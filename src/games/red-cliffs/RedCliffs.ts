import * as THREE from 'three';
import { createSfx } from '../shared/sfx';
import { createCoach } from '../shared/coach';
import { clamp, createStage, gradientEnv, h, lerp, makeToast, mulberry, puffAtlas } from '../shared/stage';
import { GAME_BY_ID } from '../registry';
import type { GameCtx, GameResult, MountGame } from '../types';

/*
 * 赤壁 · 东风 — Red Cliffs, 208.
 *
 * World axes: +x = east (downstream), −z = north (toward Cao Cao's camp at Wulin), +y = up.
 * The allied fire ships start at the south bank and run before the wind; Cao's fleet is moored
 * in four rows, each row bow to stern, so fire runs along a row fast and between rows only
 * downwind. Igniting the first ship alerts the enemy, whose arrows then wear down every
 * fire ship in range — the reason Huang Gai's ten ships “同时发火”, all lit together.
 */

const ROWS = 4;
const COLS = 9;
const FRONT_Z = -36;
const ROW_GAP = 6.2;
const COL_GAP = 10.8;
const SHIP_LEN = 9;
const FIRE_SHIPS = 10;
const HOME_Z = 40;
/** “二里余”: the ideal ignition distance from the fleet's front row, in world units. */
const TWO_LI = 26;
const TENTS = 18;
const MAX_TIME = 170;

type FsState = 'moored' | 'sailing' | 'burning' | 'rammed' | 'docked' | 'sunk' | 'lost';

interface EnemyShip {
  g: THREE.Group;
  hull: THREE.MeshStandardMaterial;
  pos: THREE.Vector3;
  heat: number;
  fire: number; // 0..1 flame intensity
  burnT: number; // seconds at full fire
  burnt: boolean;
  links: number[]; // bow-to-stern neighbours (same row)
  near: { j: number; d: number; dir: THREE.Vector2 }[];
  sink: number;
}

interface FireShip {
  g: THREE.Group;
  hull: THREE.MeshStandardMaterial;
  glow: THREE.Mesh;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  state: FsState;
  fuel: number;
  hp: number;
  crew: 'aboard' | 'saved' | 'lost';
  litAt: number;
  sink: number;
  target: number; // enemy index when rammed / docked
}

interface Tent {
  m: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  pos: THREE.Vector3;
  heat: number;
  fire: number;
  burnT: number;
  burnt: boolean;
}

const L = (lang: GameCtx['lang'], zh: string, en: string) => (lang === 'zh' ? zh : en);

/**
 * The night sky as a function of view direction, shared by the sky dome, the water's reflections
 * and the mist: a moonlit gradient, a faint afterglow in the west, value-noise clouds lit silver
 * near the moon and orange from beneath once the fleet burns, and stars between the clouds.
 */
const SKY_GLSL = /* glsl */ `
  uniform vec3 uTop, uMid, uHor, uWest, uMoonDir, uFireTint; uniform float uFire, uTime;
  float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y); }
  float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; } return s; }
  vec3 skyColor(vec3 d, float time, float disk, float stars){
    float y = d.y;
    vec3 c = mix(uHor, uMid, smoothstep(0.0, 0.22, y));
    c = mix(c, uTop, smoothstep(0.18, 0.75, y));
    float west = pow(max(0.0, -d.x * 0.8 + 0.2), 2.0);
    c += uWest * west * exp(-max(y, 0.0) * 10.0);
    float md = max(dot(d, uMoonDir), 0.0);
    c += vec3(0.5, 0.58, 0.72) * (pow(md, 90.0) * 0.45 + pow(md, 10.0) * 0.07);
    float cov = 0.0;
    if (y > 0.0) {
      vec2 uv = d.xz / (y + 0.1) * 1.4 + vec2(time * 0.006, time * 0.003);
      float n = fbm(uv);
      cov = smoothstep(0.42, 0.78, n) * smoothstep(0.0, 0.2, y);
      vec3 cloud = mix(vec3(0.025, 0.04, 0.065), vec3(0.3, 0.33, 0.4), pow(md, 7.0) * 0.9 + 0.06);
      float under = smoothstep(0.1, 0.9, -d.z) * (1.0 - smoothstep(0.04, 0.5, y));
      cloud += uFireTint * uFire * under * 0.75;
      c = mix(c, cloud, cov * 0.88);
      c += vec3(0.6, 0.65, 0.75) * cov * (1.0 - cov) * pow(md, 26.0) * 2.2;
    }
    c += uFireTint * uFire * smoothstep(0.3, 0.95, -d.z) * exp(-abs(y) * 8.0) * 0.55;
    if (stars > 0.0) {
      vec3 cell = floor(d * 300.0);
      float s = step(0.9972, hash12(cell.xy + cell.z * 7.13)) * smoothstep(0.06, 0.4, y) * (1.0 - cov);
      s *= 0.55 + 0.45 * sin(time * 2.0 + hash12(cell.yz) * 30.0);
      c += vec3(0.9, 0.95, 1.0) * s * 0.9;
    }
    c += vec3(1.0, 0.97, 0.9) * smoothstep(0.99955, 0.99972, md) * 2.6 * disk * (1.0 - cov * 0.7);
    return c;
  }`;

export const mount: MountGame = (root, ctx) => {
  const { lang } = ctx;
  const stage = createStage(root, {
    bloom: { strength: 0.95, radius: 0.55, threshold: 0.62 },
    fov: 42,
    // moonlit night: cool, slightly lifted blacks, warm highlights so the fire reads as the only heat
    grade: { shadows: [0.0, 0.012, 0.03], highlights: [1.07, 0.98, 0.88], contrast: 1.1, saturation: 1.06, vignette: 0.45, grain: 0.035 },
  });
  const { scene, camera, renderer } = stage;
  renderer.toneMappingExposure = 1.3;
  const sfx = createSfx();

  // ---------- palette: moonlit indigo river, molten fire ----------
  const SKY_TOP = new THREE.Color('#02050c');
  const SKY_MID = new THREE.Color('#0a1626');
  const SKY_HOR = new THREE.Color('#233347');
  const WEST = new THREE.Color('#5a3428');
  const FIRE_TINT = new THREE.Color('#ff6a1f');
  const FOG = new THREE.Color('#152233');
  // the moon hangs low over Cao Cao's fleet, so the ships stand in silhouette against its path on the water
  const MOON = new THREE.Vector3(0.22, 0.2, -0.95).normalize();
  scene.fog = new THREE.Fog(FOG, 110, 520);
  const fireGlow = { value: 0 };
  const skyU = {
    uTop: { value: SKY_TOP },
    uMid: { value: SKY_MID },
    uHor: { value: SKY_HOR },
    uWest: { value: WEST },
    uMoonDir: { value: MOON },
    uFireTint: { value: FIRE_TINT },
    uFire: fireGlow,
    uTime: { value: 0 },
  };

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1400, 48, 24),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: /* glsl */ `
        ${SKY_GLSL}
        varying vec3 vDir;
        void main(){ gl_FragColor = vec4(skyColor(normalize(vDir), uTime, 1.0, 1.0), 1.0); }`,
    }),
  );
  scene.add(sky);

  scene.environment = gradientEnv(renderer, { top: '#08121f', horizon: '#2a3a50', ground: '#04070b', sun: { dir: MOON, color: '#9fb2d0', size: 0.02, power: 2.5 } });
  scene.environmentIntensity = 0.9;
  scene.add(new THREE.HemisphereLight(0x4a6488, 0x16100a, 1.7));
  const moonLight = new THREE.DirectionalLight(0xb4c6e6, 2.4);
  moonLight.position.copy(MOON).multiplyScalar(300);
  scene.add(moonLight);
  const afterglow = new THREE.DirectionalLight(0xff9a6a, 0.45);
  afterglow.position.set(-200, 30, -40);
  scene.add(afterglow);

  // Point-light pool, re-aimed at the strongest fires each frame.
  const lights: THREE.PointLight[] = [];
  for (let i = 0; i < 7; i++) {
    const pl = new THREE.PointLight(0xff7424, 0, 80, 1.5);
    scene.add(pl);
    lights.push(pl);
  }

  // ---------- water ----------
  const MAX_FIRES = 14;
  const fireU = Array.from({ length: MAX_FIRES }, () => new THREE.Vector4(0, -100, 0, 0));
  const waterMat = new THREE.ShaderMaterial({
    fog: false,
    uniforms: {
      ...skyU,
      uCam: { value: camera.position },
      uFires: { value: fireU },
      uBandZ: { value: FRONT_Z + TWO_LI },
      uBand: { value: 0 },
      uFogC: { value: FOG },
    },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      ${SKY_GLSL}
      uniform vec3 uCam; uniform vec4 uFires[${MAX_FIRES}];
      uniform vec3 uFogC; uniform float uBandZ, uBand;
      varying vec3 vW;
      vec2 wave(vec2 p, vec2 d, float f, float s, float a){ float ph = dot(p, d) * f + uTime * s; return d * cos(ph) * a * f; }
      void main(){
        vec2 p = vW.xz;
        float dist = length(uCam - vW);
        // fine ripples fade with distance so the far river does not shimmer into noise
        float fade = 1.0 - smoothstep(50.0, 260.0, dist);
        vec2 g = wave(p, normalize(vec2(1.0, 0.25)), 0.19, 0.9, 0.34)
               + wave(p, normalize(vec2(-0.45, 1.0)), 0.33, 1.3, 0.2)
               + wave(p, normalize(vec2(0.75, -0.8)), 0.57, 1.8, 0.12)
               + wave(p, normalize(vec2(-1.0, -0.35)), 1.03, 2.6, 0.065) * (0.4 + 0.6 * fade)
               + wave(p, normalize(vec2(0.15, 1.0)), 1.71, 3.4, 0.04) * fade
               + wave(p, normalize(vec2(0.95, 0.45)), 2.93, 4.6, 0.022) * fade;
        // irregular chop: the gradient of a drifting noise field breaks up the regular wave pattern
        vec2 q = p * 0.55 + uTime * vec2(0.18, -0.12);
        float e = 0.35;
        float n0 = fbm(q), nx = fbm(q + vec2(e, 0.0)), nz = fbm(q + vec2(0.0, e));
        g += vec2(nx - n0, nz - n0) / e * 0.22 * fade;
        vec3 n = normalize(vec3(-g.x, 1.0, -g.y));
        vec3 V = normalize(uCam - vW);
        float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, V), 0.0), 5.0);
        vec3 R = reflect(-V, n);
        R.y = abs(R.y);
        vec3 refl = skyColor(R, uTime, 1.0, 0.0);
        // a hard glint for each wavelet catching the moon: the glitter path
        refl += vec3(1.0, 0.96, 0.88) * pow(max(dot(R, uMoonDir), 0.0), 420.0) * 5.0;
        vec3 deep = vec3(0.004, 0.018, 0.028) + vec3(0.0, 0.02, 0.025) * (1.0 - fade);
        vec3 c = mix(deep, refl, clamp(fres, 0.0, 1.0));
        // shimmering columns of reflected firelight, stretched toward the camera
        float fireSum = 0.0;
        for (int i = 0; i < ${MAX_FIRES}; i++) {
          vec4 f = uFires[i];
          if (f.w <= 0.001) continue;
          vec2 d = p - f.xz;
          vec2 toCam = normalize(uCam.xz - f.xz);
          float along = dot(d, toCam);
          float across = dot(d, vec2(-toCam.y, toCam.x)) + n.x * 3.0;
          float w = 1.0 + max(along, 0.0) * 0.045;
          float col = exp(-across * across / (w * w)) * exp(-max(along, 0.0) / 46.0) * smoothstep(-3.0, 1.0, along);
          float pool = exp(-dot(d, d) / 80.0);
          fireSum += f.w * (col * 0.95 + pool * 0.35);
        }
        // ripples break the reflection into horizontal streaks of light and dark water
        float streak = fbm(vec2(p.x * 0.22, p.y * 1.3) + vec2(uTime * 0.2, uTime * 0.7)) * 0.6
                     + fbm(vec2(p.x * 0.5, p.y * 3.1) - vec2(uTime * 0.3, uTime * 1.1)) * 0.4;
        float glit = smoothstep(0.2, 0.85, streak + n.x * 1.2 + n.z * 0.6);
        fireSum *= 0.25 + 0.95 * glit;
        float fs = 1.0 - exp(-fireSum * 0.6);
        c += mix(vec3(0.75, 0.16, 0.03), vec3(1.0, 0.58, 0.2), fs * fs) * fs * (0.55 + 0.6 * fres + 0.4 * glit);
        // the “two li” ignition line, a dotted gold band on the water
        float band = exp(-pow(vW.z - uBandZ, 2.0) / 0.1) * step(0.5, fract(vW.x * 0.16));
        c += vec3(1.0, 0.8, 0.42) * band * uBand * 0.55;
        float fogF = smoothstep(110.0, 520.0, dist);
        gl_FragColor = vec4(mix(c, uFogC + uFireTint * uFire * 0.08, fogF), 1.0);
      }`,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1000, 1, 1), waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0, -100);
  scene.add(water);

  // ---------- land: north bank (Wulin), south bank and the red cliffs ----------
  const noise = (x: number, z: number) => Math.sin(x * 0.07) * Math.cos(z * 0.09) + 0.5 * Math.sin(x * 0.19 + z * 0.13) + 0.25 * Math.sin(x * 0.41 - z * 0.37);
  /** Height of the north bank at world (x, z): a low shore shelf for the camp, then hills. */
  function northHeight(x: number, z: number) {
    const di = -66 - z; // distance inland
    return -1.5 + clamp(di / 5, 0, 1) * 2.8 + Math.max(0, di - 24) * 0.1 + Math.max(0, di - 90) * 0.12 * (0.6 + 0.4 * Math.sin(x * 0.02)) + noise(x, z) * Math.min(1, di / 25) * 2.2;
  }
  function southHeight(x: number, z: number) {
    const di = z - 50; // distance inland from the south shore
    return -1.5 + clamp(di / 6, 0, 1) * 2.6 + Math.max(0, di - 30) * 0.12 + noise(x + 40, z) * Math.min(1, di / 20) * 1.6;
  }
  const MUD = new THREE.Color('#1a1712');
  const GRASS = new THREE.Color('#1b2316');
  const HILL = new THREE.Color('#161c19');
  const landGeo = (w: number, d: number, cz: number, f: (x: number, z: number) => number) => {
    const g = new THREE.PlaneGeometry(w, d, 160, 56);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const col: number[] = [];
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i) + cz;
      const y = f(x, z);
      pos.setY(i, y);
      const n = 0.5 + 0.5 * Math.sin(x * 0.13 + Math.sin(z * 0.21) * 2) * Math.cos(z * 0.17);
      c.copy(MUD).lerp(GRASS, clamp((y + 0.8) / 1.6, 0, 1)).lerp(HILL, clamp((y - 3) / 8, 0, 1));
      c.multiplyScalar(0.8 + 0.4 * n);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    return g;
  };
  const landMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, envMapIntensity: 0.3 });
  const north = new THREE.Mesh(landGeo(900, 260, -196, northHeight), landMat);
  north.position.set(0, 0, -196);
  scene.add(north);
  const south = new THREE.Mesh(landGeo(900, 200, 150, southHeight), landMat);
  south.position.set(0, 0, 150);
  scene.add(south);

  // Woods on both banks: dark cones, sparse near the water, dense on the hills.
  {
    const r = mulberry(7);
    const pts: [number, number, number, number][] = [];
    for (let i = 0; i < 900 && pts.length < 520; i++) {
      const x = (r() - 0.5) * 700;
      const northSide = r() < 0.62;
      const z = northSide ? -70 - r() * 170 : 56 + r() * 120;
      const di = northSide ? -66 - z : z - 50;
      if (di < 10 || r() > clamp((di - 8) / 50, 0.15, 0.9)) continue;
      if (northSide && di < 30 && Math.abs(x) < 80) continue; // keep the camp clear
      if (!northSide && x < -30 && x > -100 && z < 80) continue; // and the cliff top
      pts.push([x, (northSide ? northHeight(x, z) : southHeight(x, z)) - 0.3, z, 0.7 + r() * 0.9]);
    }
    const tree = new THREE.ConeGeometry(1.5, 5.5, 7);
    tree.translate(0, 2.6, 0);
    const trees = new THREE.InstancedMesh(tree, new THREE.MeshStandardMaterial({ color: 0x0b120d, roughness: 1, envMapIntensity: 0.2 }), pts.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    pts.forEach(([x, y, z, k], i) => trees.setMatrixAt(i, m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(k, k * (0.8 + (i % 5) * 0.12), k))));
    scene.add(trees);
  }

  // Distant ridges, layered into the haze: each farther one paler, as in ink-wash landscapes.
  for (const [z, hgt, col] of [
    [-300, 30, 0x111c28],
    [-380, 52, 0x16222f],
    [-470, 78, 0x1b2836],
  ] as const) {
    const shape = new THREE.Shape();
    shape.moveTo(-900, 0);
    for (let x = -900; x <= 900; x += 18) shape.lineTo(x, hgt * (0.45 + 0.3 * Math.sin(x * 0.011 + z) + 0.15 * Math.sin(x * 0.037 + z * 0.3) + 0.06 * Math.sin(x * 0.13)));
    shape.lineTo(900, 0);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: col, fog: false }));
    m.position.set(0, -2, z);
    scene.add(m);
  }

  // River mist: a drifting veil just above the water that the firelight shines through.
  const mistMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: false,
    uniforms: { ...skyU, uCam: { value: camera.position } },
    vertexShader: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      ${SKY_GLSL}
      uniform vec3 uCam; varying vec3 vW;
      void main(){
        float n = fbm(vW.xz * 0.018 + vec2(uTime * 0.012, uTime * 0.004));
        n *= fbm(vW.xz * 0.05 - vec2(uTime * 0.02, 0.0)) * 1.6;
        float d = length(uCam - vW);
        float a = smoothstep(0.3, 0.9, n) * smoothstep(25.0, 90.0, d) * (1.0 - smoothstep(260.0, 480.0, d)) * 0.3;
        vec3 c = vec3(0.17, 0.22, 0.29) + uFireTint * uFire * 0.45 * smoothstep(0.0, 1.0, -vW.z / 60.0 + 0.6);
        gl_FragColor = vec4(c, a);
      }`,
  });
  const mist = new THREE.Mesh(new THREE.PlaneGeometry(1200, 700), mistMat);
  mist.rotation.x = -Math.PI / 2;
  mist.position.set(0, 1.6, -80);
  mist.renderOrder = 1;
  scene.add(mist);

  // The red cliffs on the south bank, west of the fire ships: a layered rock wall facing the
  // river, with the two characters carved into it as they are at Chibi today.
  const cliffs = new THREE.Group();
  const rnd = mulberry(208);
  {
    const g = new THREE.BoxGeometry(44, 18, 12, 30, 12, 6);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const col: number[] = [];
    const base = new THREE.Color(0x8a3624);
    const dark = new THREE.Color(0x4a1c14);
    const tmpC = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = pos.getZ(i);
      const strata = Math.sin(y * 1.7 + Math.sin(x * 0.3) * 0.8);
      if (z > 5.9) z += strata * 0.6 + noise(x * 3, y * 3) * 1.1; // the river face: horizontal strata
      const top = y > 8.9 ? noise(x * 2, z * 2) * 2.2 + Math.sin(x * 0.25) * 1.5 : 0;
      pos.setXYZ(i, x + noise(y * 2, z * 2) * 0.6, y + top, z);
      tmpC.copy(base).lerp(dark, clamp(0.35 + strata * 0.25 + (y < -6 ? 0.3 : 0), 0, 1));
      col.push(tmpC.r, tmpC.g, tmpC.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    const wall = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }));
    wall.position.set(-60, 6, 46);
    wall.rotation.y = -0.55;
    cliffs.add(wall);
    // a cap of dark scrub along the top
    const scrub = new THREE.Mesh(new THREE.BoxGeometry(44, 1.6, 12), new THREE.MeshStandardMaterial({ color: 0x1d2416, roughness: 1, flatShading: true }));
    scrub.position.set(0, 9.9, 0);
    wall.add(scrub);
    const carved = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 5),
      new THREE.MeshBasicMaterial({ map: textTexture('赤壁', '#e2553a', 256, 128, 'bold 104px "Noto Serif SC", "Songti SC", serif'), transparent: true, fog: true }),
    );
    carved.position.set(12, 2.5, 6.9);
    wall.add(carved);
  }
  scene.add(cliffs);

  // ---------- ships ----------
  const sailTex = sailTexture('#5e4b34', '#2e2418');
  const sailTexFs = sailTexture('#a88d62', '#5c4428');
  const woodTex = plankTexture();
  const flagCao = textTexture('曹', '#1a1410', 64, 64, 'bold 46px "Noto Serif SC", serif', '#b83a2a');
  const flagHuang = textTexture('黄', '#3a1a08', 64, 64, 'bold 46px "Noto Serif SC", serif', '#e3b341');
  const flags: THREE.Mesh[] = [];

  const enemies: EnemyShip[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = -((COLS - 1) / 2) * COL_GAP + c * COL_GAP + (r % 2) * 2.2;
      const z = FRONT_Z - r * ROW_GAP;
      const { g, hull } = buildJunk({ len: SHIP_LEN, beam: 2.8, color: 0x6a5240, wood: woodTex, sail: sailTex, flag: flagCao, flags, masts: 2 });
      g.position.set(x, 0, z);
      g.rotation.y = (rnd() - 0.5) * 0.05;
      scene.add(g);
      enemies.push({ g, hull, pos: g.position.clone(), heat: 0, fire: 0, burnT: 0, burnt: false, links: [], near: [], sink: 0 });
    }
  }
  // A paper lantern at each stern: the fleet reads at night, and its lights wink out as it burns.
  const lanternGeo = new THREE.SphereGeometry(0.32, 10, 8);
  const lanternMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 1.6, 0.55), toneMapped: false, fog: true });
  const lanterns = enemies.map((e) => {
    const m = new THREE.Mesh(lanternGeo, lanternMat);
    m.position.set(-SHIP_LEN * 0.42, 3.2, 0);
    e.g.add(m);
    return m;
  });

  // Bow-to-stern links along each row, with ropes drawn between them.
  const ropePts: number[] = [];
  enemies.forEach((e, i) => {
    const c = i % COLS;
    if (c > 0) e.links.push(i - 1);
    if (c < COLS - 1) {
      e.links.push(i + 1);
      const n = enemies[i + 1].pos;
      ropePts.push(e.pos.x + SHIP_LEN / 2 - 0.4, 1.3, e.pos.z, n.x - SHIP_LEN / 2 + 0.4, 1.3, n.z);
    }
    enemies.forEach((o, j) => {
      if (i === j) return;
      const d = Math.hypot(o.pos.x - e.pos.x, o.pos.z - e.pos.z);
      if (d < 17) e.near.push({ j, d, dir: new THREE.Vector2(o.pos.x - e.pos.x, o.pos.z - e.pos.z).normalize() });
    });
  });
  const ropeGeo = new THREE.BufferGeometry();
  ropeGeo.setAttribute('position', new THREE.Float32BufferAttribute(ropePts, 3));
  scene.add(new THREE.LineSegments(ropeGeo, new THREE.LineBasicMaterial({ color: 0x1a120c })));

  const fireShips: FireShip[] = [];
  for (let i = 0; i < FIRE_SHIPS; i++) {
    const { g, hull } = buildJunk({ len: 7, beam: 2.4, color: 0x8a6c50, wood: woodTex, sail: sailTexFs, flag: flagHuang, flags, masts: 1, cargo: true, squareSail: true });
    g.position.set(-4 + i * 6.2, 0, HOME_Z + (i % 2) * 1.5);
    g.rotation.y = Math.PI / 2; // bows pointing north
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(3.4, 4.2, 40),
      new THREE.MeshBasicMaterial({ color: 0xffd58a, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.15;
    scene.add(glow);
    scene.add(g);
    fireShips.push({ g, hull, glow, pos: g.position, vel: new THREE.Vector3(), state: 'moored', fuel: 4.8, hp: 1, crew: 'aboard', litAt: -1, sink: 0, target: -1 });
  }

  // Cao Cao's camp on the north shore.
  const tents: Tent[] = [];
  const tentGeo = new THREE.ConeGeometry(2.2, 3.2, 6);
  for (let i = 0; i < TENTS; i++) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x9c8a6a, roughness: 1, flatShading: true });
    const m = new THREE.Mesh(tentGeo, mat);
    const x = -64 + (i % 9) * 16 + (rnd() - 0.5) * 6;
    const z = -72 - Math.floor(i / 9) * 7 - rnd() * 2;
    m.position.set(x, northHeight(x, z) + 1.5, z);
    scene.add(m);
    tents.push({ m, mat, pos: m.position.clone(), heat: 0, fire: 0, burnT: 0, burnt: false });
  }
  // Watch fires along the camp, so the shore reads at dusk.
  const watchFires: THREE.Vector3[] = [];
  for (let i = 0; i < 6; i++) watchFires.push(new THREE.Vector3(-55 + i * 22, northHeight(-55 + i * 22, -69) + 0.4, -69));

  // ---------- particles ----------
  const puffs = puffAtlas();
  const fire = new Particles(9000, puffs, true);
  const smoke = new Particles(3200, puffs, false);
  smoke.points.renderOrder = 1;
  fire.points.renderOrder = 2;
  scene.add(smoke.points, fire.points);

  // Arrows (after the enemy is alerted): short streaks flying from the fleet to the fire ships.
  const ARROWS = 80;
  const arrowPos = new Float32Array(ARROWS * 6);
  const arrowGeo = new THREE.BufferGeometry();
  arrowGeo.setAttribute('position', new THREE.BufferAttribute(arrowPos, 3));
  const arrowLines = new THREE.LineSegments(arrowGeo, new THREE.LineBasicMaterial({ color: 0xd8d0c0, transparent: true, opacity: 0.7 }));
  scene.add(arrowLines);
  const arrows = Array.from({ length: ARROWS }, () => ({ t: 1, dur: 1, a: new THREE.Vector3(), b: new THREE.Vector3() }));

  // Rowing boats taking the crews home.
  const boats: { m: THREE.Mesh; v: THREE.Vector3; t: number }[] = [];
  const boatGeo = new THREE.BoxGeometry(2.2, 0.5, 1);
  const boatMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2c, roughness: 0.8 });

  // ---------- HUD ----------
  const hud = h('div', 'g-hud rc-hud', root);
  h('div', 'g-title', hud, L(lang, '赤壁 · 东风', 'Red Cliffs · The East Wind'));
  const toast = makeToast(hud);
  const windEl = h('div', 'rc-wind g-panel-sm', hud);
  windEl.innerHTML = `
    <svg viewBox="-50 -50 100 100" width="86" height="86" aria-hidden="true">
      <circle r="40" fill="none" stroke="rgba(255,255,255,.18)"/>
      <circle r="28" fill="none" stroke="rgba(255,255,255,.08)"/>
      <text y="-30" text-anchor="middle" font-size="11" fill="#e8d6b0">${L(lang, '北', 'N')}</text>
      <text y="38" text-anchor="middle" font-size="11" fill="#8a7f6a">${L(lang, '南', 'S')}</text>
      <text x="33" y="4" text-anchor="middle" font-size="11" fill="#8a7f6a">${L(lang, '东', 'E')}</text>
      <text x="-33" y="4" text-anchor="middle" font-size="11" fill="#8a7f6a">${L(lang, '西', 'W')}</text>
      <g class="rc-arrow"><path d="M0,-24 L7,6 L0,1 L-7,6 Z" fill="#ffb066"/><line y1="1" y2="22" stroke="#ffb066" stroke-width="2.5" stroke-linecap="round"/></g>
    </svg>
    <div class="rc-wind-label"></div>`;
  const windArrow = windEl.querySelector('.rc-arrow') as SVGGElement;
  const windLabel = windEl.querySelector('.rc-wind-label') as HTMLElement;

  const bar = h('div', 'rc-bar', hud);
  const shipsRow = h('div', 'rc-ships', bar);
  const shipPips = fireShips.map(() => h('i', 'rc-pip', shipsRow));
  const lightAll = h('button', 'g-btn rc-light', bar, L(lang, '齐发火 <kbd>F</kbd>', 'Light all <kbd>F</kbd>')) as HTMLButtonElement;
  const stats = h('div', 'rc-stats g-panel-sm', hud);
  const bandLabel = h('div', 'rc-band-label', hud, L(lang, '约二里 · 最佳点火', '≈ 2 li · light here'));
  const coach = createCoach(hud, GAME_BY_ID['red-cliffs'], lang);

  const style = h('style', '', hud);
  style.textContent = `
    .rc-wind { position: absolute; top: max(14px, env(safe-area-inset-top)); right: 68px; display: flex; align-items: center; gap: 10px; padding: 8px 14px 8px 8px; }
    .rc-wind-label { font-family: var(--serif-zh); font-size: 15px; color: #f3e2c4; letter-spacing: .12em; min-width: 6.5em; line-height: 1.4; }
    .rc-wind-label small { display:block; font-family: var(--sans); font-size: 11px; letter-spacing: .04em; color: var(--muted); }
    .rc-bar { position: absolute; left: 50%; bottom: max(22px, env(safe-area-inset-bottom)); transform: translateX(-50%); display: flex; align-items: center; gap: 16px; }
    .rc-ships { display: flex; gap: 5px; padding: 10px 12px; border-radius: 99px; background: rgba(8,9,14,.6); border: 1px solid rgba(255,255,255,.08); backdrop-filter: blur(8px); }
    .rc-pip { width: 12px; height: 18px; border-radius: 3px 3px 6px 6px; background: #d7b77c; opacity: .9; transition: background .3s, opacity .3s, box-shadow .3s; }
    .rc-pip.sailing { background: #f3e2c4; box-shadow: 0 0 8px #f3e2c4; }
    .rc-pip.burning, .rc-pip.rammed { background: #ff7a2a; box-shadow: 0 0 10px #ff7a2a; }
    .rc-pip.sunk, .rc-pip.lost { background: #3a3530; opacity: .5; }
    .rc-pip.docked { background: #9a8a6a; }
    .rc-light kbd { margin-left: 6px; background: rgba(0,0,0,.15); border-color: rgba(0,0,0,.2); color: inherit; }
    .rc-stats { position: absolute; left: 20px; top: calc(max(16px, env(safe-area-inset-top)) + 30px); display: grid; grid-template-columns: auto auto 1fr; gap: 4px 8px; font-size: 12.5px; align-items: center; }
    .rc-stats b { color: #ffd2a0; font-variant-numeric: tabular-nums; text-align: right; }
    .rc-stats i { font-style: normal; font-size: 14px; }
    .rc-light.g-pulse { animation-duration: .9s; }
    .rc-band-label { position: absolute; left: 0; top: 0; pointer-events: none; font-size: 12px; color: #ffe0a6; letter-spacing: .1em; white-space: nowrap; text-shadow: 0 1px 4px #000; opacity: 0; transition: opacity .6s; }
    .rc-band-label.show { opacity: .9; }
    @media (max-width: 640px) {
      .rc-wind { right: 62px; padding: 4px 10px 4px 4px; } .rc-wind svg { width: 60px; height: 60px; } .rc-wind-label { font-size: 13px; min-width: 5em; }
      .rc-stats { top: auto; bottom: calc(max(22px, env(safe-area-inset-bottom)) + 66px); left: 12px; font-size: 12px; }
      .rc-bar { gap: 8px; } .rc-pip { width: 8px; height: 14px; } .rc-ships { padding: 8px; gap: 3px; }
    }`;

  // ---------- game state ----------
  let time = 0;
  const windShiftAt = 10 + rnd() * 4;
  const wind = new THREE.Vector2(0.6, 0.8); // where the wind blows *to* (x, z)
  let windS = 0.4;
  let alarm = false;
  let ended = false;
  let endTimer = -1;
  let shiftAnnounced = false;
  let firstLight = -1;
  const litTimes: number[] = [];
  let shake = 0;
  const windBed = sfx.bed(500, 0.5);
  const fireBed = sfx.bed(900, 0.4, 'bandpass');

  const camBase = new THREE.Vector3(2, 58, 100);
  const camLook = new THREE.Vector3(2, 0, -24);
  const intro = ctx.reduced ? 0 : 6.5;
  const pointer = new THREE.Vector2();

  toast(L(lang, '乌林 · 曹军水寨', 'Wulin · Cao Cao’s fleet'), L(lang, '战船首尾相接', 'moored bow to stern'), 3600);
  coach.step(0);
  let earlyLaunch = false;

  const launch = (s: FireShip) => {
    if (s.state !== 'moored' || ended) return;
    s.state = 'sailing';
    if (time < windShiftAt + 3.5) earlyLaunch = true;
    sfx.noise({ dur: 1.2, freq: 700, q: 0.6, gain: 0.25, attack: 0.3, sweepTo: 300 });
  };
  const ignite = (s: FireShip) => {
    if (s.state !== 'sailing' && s.state !== 'docked') return;
    const d = nearestEnemy(s.pos).d;
    s.litAt = time;
    litTimes.push(time);
    if (firstLight < 0) {
      firstLight = time;
      toast(L(lang, '举火！', 'Fire!'), '', 1600);
    }
    if (s.state === 'docked') {
      s.crew = 'lost';
      rammed(s, s.target);
    } else {
      s.state = 'burning';
      if (d > 9) {
        s.crew = 'saved';
        spawnBoat(s.pos);
      } else s.crew = 'lost';
    }
    sfx.noise({ dur: 1.6, freq: 1200, q: 0.4, gain: 0.5, attack: 0.05, sweepTo: 400 });
    sfx.noise({ dur: 0.5, freq: 160, type: 'lowpass', gain: 0.6 });
    if (!alarm) {
      alarm = true;
      setTimeout(() => !ended && toast(L(lang, '曹军惊觉，箭如雨下', 'The ruse is seen — arrows fly'), '', 2000), 900);
    }
  };
  const lightAllNow = () => {
    let any = false;
    for (const s of fireShips)
      if (s.state === 'sailing' || s.state === 'docked') {
        ignite(s);
        any = true;
      }
    if (!any) launchAll();
  };
  /** The fleet sails together, a beat apart, easternmost first (the south-east wind carries it west onto Cao's line). */
  function launchAll() {
    [...fireShips]
      .reverse()
      .filter((s) => s.state === 'moored')
      .forEach((s, i) => setTimeout(() => launch(s), i * 120));
  }
  lightAll.onclick = lightAllNow;

  const onKey = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === 'f' || e.key === 'F') lightAllNow();
    else if (e.key === ' ') {
      e.preventDefault();
      launchAll();
    }
  };
  window.addEventListener('keydown', onKey);

  const v3 = new THREE.Vector3();
  const onDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const rect = renderer.domElement.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    let best: FireShip | null = null;
    let bestD = Math.max(44, rect.width * 0.035);
    for (const s of fireShips) {
      if (s.state !== 'moored' && s.state !== 'sailing' && s.state !== 'docked') continue;
      v3.copy(s.pos).setY(2);
      v3.project(camera);
      const sx = ((v3.x + 1) / 2) * rect.width;
      const sy = ((1 - v3.y) / 2) * rect.height;
      const d = Math.hypot(sx - px, sy - py);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    if (!best) return;
    if (best.state === 'moored') launch(best);
    else ignite(best);
  };
  const onMove = (e: PointerEvent) => {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };
  renderer.domElement.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);

  function spawnBoat(p: THREE.Vector3) {
    const m = new THREE.Mesh(boatGeo, boatMat);
    m.position.copy(p).setY(0.3);
    scene.add(m);
    boats.push({ m, v: new THREE.Vector3((rnd() - 0.5) * 2, 0, 6), t: 0 });
  }

  function nearestEnemy(p: THREE.Vector3) {
    let d = Infinity;
    let j = -1;
    enemies.forEach((e, i) => {
      if (e.burnt) return;
      // distance to the ship's long axis segment
      const dx = Math.max(0, Math.abs(p.x - e.pos.x) - SHIP_LEN / 2);
      const dd = Math.hypot(dx, p.z - e.pos.z);
      if (dd < d) {
        d = dd;
        j = i;
      }
    });
    return { d, j };
  }

  function rammed(s: FireShip, j: number) {
    s.state = 'rammed';
    s.target = j;
    s.fuel = 10;
    s.vel.set(0, 0, 0);
    const e = enemies[j];
    if (e) {
      e.heat = Math.max(e.heat, 1.05);
      for (const k of e.links) enemies[k].heat += 0.45;
    }
    shake = Math.max(shake, 0.6);
    sfx.noise({ dur: 1.4, freq: 120, type: 'lowpass', gain: 0.9, attack: 0.01 });
    sfx.noise({ dur: 2.4, freq: 1500, q: 0.3, gain: 0.35, attack: 0.1, sweepTo: 500 });
  }

  // ---------- frame ----------
  const tmp2 = new THREE.Vector2();
  const firesNow: { p: THREE.Vector3; w: number }[] = [];

  stage.onFrame((dt, t) => {
    if (ended) dt *= 0.6;
    time += dt;
    (sky.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    waterMat.uniforms.uTime.value = t;

    // --- wind ---
    let target: THREE.Vector2;
    let strength: number;
    if (time < windShiftAt) {
      target = tmp2.set(0.55 + Math.sin(t * 0.3) * 0.15, 0.83).normalize();
      strength = 0.35 + 0.15 * Math.sin(t * 0.7) + 0.08 * Math.sin(t * 2.3);
    } else if (time < windShiftAt + 3.5) {
      target = tmp2.set(-0.2, -0.3).normalize();
      strength = 0.08;
    } else {
      const wob = Math.sin(t * 0.37) * 0.22 + Math.sin(t * 1.1) * 0.06;
      target = tmp2.set(-0.62 + wob, -0.79).normalize();
      strength = clamp(0.82 + 0.12 * Math.sin(t * 0.9) + 0.06 * Math.sin(t * 2.7), 0, 1);
      // Lulls: every ~11 s the wind drops for a few seconds. A ship lit in a lull crawls under the arrows.
      const ph = (time - windShiftAt - 12) % 11;
      if (time > windShiftAt + 12 && ph > 0 && ph < 3) strength *= 0.32;
      if (!shiftAnnounced) {
        shiftAnnounced = true;
        toast(L(lang, '东南风起！', 'The south-east wind rises!'), L(lang, '时东南风急 — 扬帆！', 'Set sail now'), 3200);
        sfx.noise({ dur: 2.5, freq: 400, q: 0.4, gain: 0.5, attack: 0.6, sweepTo: 900 });
      }
    }
    const ang = Math.atan2(wind.y, wind.x);
    let tAng = Math.atan2(target.y, target.x);
    while (tAng - ang > Math.PI) tAng -= Math.PI * 2;
    while (tAng - ang < -Math.PI) tAng += Math.PI * 2;
    const na = ang + (tAng - ang) * Math.min(1, dt * 0.9);
    wind.set(Math.cos(na), Math.sin(na));
    windS = lerp(windS, strength, Math.min(1, dt * 1.2));
    windBed.set(0.05 + windS * 0.22, 300 + windS * 600);
    // compass: SVG y is down = south (+z)
    windArrow.setAttribute('transform', `rotate(${(Math.atan2(wind.x, -wind.y) * 180) / Math.PI})`);
    setHtml(windLabel, `${windName(wind, lang)} · ${windS > 0.7 ? L(lang, '急', 'strong') : windS > 0.3 ? L(lang, '缓', 'steady') : L(lang, '微', 'calm')}<small>${L(lang, '箭头指风去向', 'arrow: blowing toward')}</small>`);
    const seWind = time > windShiftAt + 3.5;
    waterMat.uniforms.uBand.value = lerp(waterMat.uniforms.uBand.value, seWind && !ended ? 1 : 0, dt * 1.5);

    // --- fire ships ---
    for (const s of fireShips) {
      if (s.state === 'sailing' || s.state === 'burning') {
        const tail = Math.max(0, -wind.y) * windS; // northward push
        const north = 1.6 + 8.8 * tail * (s.state === 'burning' ? 1.45 : 1);
        const vx = wind.x * windS * 3.6 + 0.55;
        s.vel.set(vx, 0, -north);
        s.pos.addScaledVector(s.vel, dt);
        s.g.rotation.y = Math.atan2(-s.vel.z, s.vel.x) * 1 + 0; // face travel
        s.g.position.y = Math.sin(t * 2 + s.pos.x) * 0.08;
        const ne = nearestEnemy(s.pos);
        if (ne.j >= 0 && ne.d < 2.2) {
          if (s.state === 'burning') rammed(s, ne.j);
          else {
            s.state = 'docked';
            s.target = ne.j;
          }
        }
        if (s.state === 'burning') {
          s.fuel -= dt;
          if (s.fuel <= 0) sinkShip(s);
        }
        if (alarm && ne.d < 58 && (s.state === 'sailing' || s.state === 'burning')) {
          s.hp -= dt * 0.15;
          if (rnd() < dt * 6) fireArrow(enemies[ne.j]?.pos ?? s.pos, s.pos);
          if (s.hp <= 0) sinkShip(s);
        }
        if (s.pos.z < -66 || s.pos.x > 120 || s.pos.x < -120) s.state = 'lost';
      } else if (s.state === 'docked') {
        if (alarm) {
          s.hp -= dt * 0.15;
          if (rnd() < dt * 6) fireArrow(enemies[s.target].pos, s.pos);
          if (s.hp <= 0) sinkShip(s);
        }
        if (enemies[s.target]?.burnt) sinkShip(s);
      } else if (s.state === 'rammed') {
        s.fuel -= dt;
        if (s.fuel <= 0) sinkShip(s);
      } else if (s.state === 'moored') {
        s.g.position.y = Math.sin(t * 1.6 + s.pos.x) * 0.06;
      }
      if (s.state === 'sunk' || s.state === 'lost') {
        s.sink += dt;
        s.g.position.y = -s.sink * 0.9;
        s.g.rotation.z = Math.min(0.5, s.sink * 0.2);
        if (s.sink > 4) s.g.visible = false;
      }
      // gold ring when the ship is in the ignition band
      const inBand = (s.state === 'sailing' || s.state === 'docked') && Math.abs(nearestEnemy(s.pos).d - TWO_LI) < 8;
      const gm = s.glow.material as THREE.MeshBasicMaterial;
      gm.opacity = lerp(gm.opacity, s.state === 'moored' && seWind ? 0.25 + 0.15 * Math.sin(t * 4) : inBand ? 0.9 : 0, dt * 6);
      s.glow.position.set(s.pos.x, 0.15, s.pos.z);
      if (s.state === 'burning' || s.state === 'rammed') {
        const k = s.state === 'rammed' ? 1 : 0.85;
        emitShipFire(s.pos, 7, s.g.rotation.y, k, dt);
        s.hull.color.lerp(CHAR, dt * 0.25);
        s.hull.emissive.setRGB(0.5, 0.12, 0.02);
        firesNow.push({ p: s.pos, w: k });
      }
    }

    // --- enemy fleet fire spread ---
    for (const e of enemies) {
      if (e.burnt) {
        e.sink += dt;
        e.g.position.y = Math.max(-1.6, -e.sink * 0.12);
        e.g.rotation.z = Math.min(0.18, e.sink * 0.02);
        if (e.fire > 0) {
          e.fire = Math.max(0, e.fire - dt * 0.25);
          emitShipFire(e.pos, SHIP_LEN, 0, e.fire * 0.6, dt);
          firesNow.push({ p: e.pos, w: e.fire * 0.6 });
        }
        continue;
      }
      if (e.fire === 0 && e.heat >= 1) {
        e.fire = 0.05;
        sfx.noise({ dur: 1.0, freq: 220, type: 'lowpass', gain: 0.35 });
      }
      if (e.fire > 0) {
        if (e.fire < 1) e.fire = Math.min(1, e.fire + dt / 3.5);
        else e.burnT += dt;
        if (e.burnT > 17) e.burnt = true;
        for (const n of e.near) {
          const o = enemies[n.j];
          if (o.burnt || o.fire > 0) continue;
          const linked = e.links.includes(n.j);
          const down = 1 + 2.3 * Math.max(0, wind.x * n.dir.x + wind.y * n.dir.y) * windS;
          o.heat += dt * e.fire * 0.065 * (linked ? 4 : 1) * down * (8 / (8 + n.d));
        }
        for (const tn of tents) {
          if (tn.burnt || tn.fire > 0) continue;
          const dx = tn.pos.x - e.pos.x;
          const dz = tn.pos.z - e.pos.z;
          const d = Math.hypot(dx, dz);
          if (d > 30) continue;
          const down = Math.max(0, (wind.x * dx + wind.y * dz) / d) * windS;
          tn.heat += dt * e.fire * 0.08 * (0.2 + 2.6 * down) * (12 / (12 + d));
        }
        emitShipFire(e.pos, SHIP_LEN, 0, e.fire, dt);
        // embers ride the wind toward the shore
        if (rnd() < dt * 10 * e.fire) {
          fire.emit(e.pos.x + (rnd() - 0.5) * 6, 4 + rnd() * 3, e.pos.z, wind.x * 9 * windS + (rnd() - 0.5) * 2, 3 + rnd() * 3, wind.y * 9 * windS + (rnd() - 0.5) * 2, 2.4 + rnd(), 0.5, 1);
        }
        const c = e.hull.color;
        c.lerp(CHAR, dt * 0.08);
        e.hull.emissive.setRGB(0.35 * e.fire, 0.08 * e.fire, 0.01);
        firesNow.push({ p: e.pos, w: e.fire });
      }
    }
    for (const tn of tents) {
      if (tn.burnt) continue;
      if (tn.fire === 0 && tn.heat >= 1) tn.fire = 0.05;
      if (tn.fire > 0) {
        if (tn.fire < 1) tn.fire = Math.min(1, tn.fire + dt / 2);
        else tn.burnT += dt;
        if (tn.burnT > 10) {
          tn.burnt = true;
          tn.m.scale.y = 0.25;
          tn.m.position.y = 0.6;
          tn.mat.color.copy(CHAR);
          tn.mat.emissive.setRGB(0.2, 0.04, 0);
        }
        tn.mat.color.lerp(CHAR, dt * 0.1);
        for (let k = 0; k < 3; k++)
          if (rnd() < dt * 40 * tn.fire) fire.emit(tn.pos.x + (rnd() - 0.5) * 3, tn.pos.y + rnd(), tn.pos.z + (rnd() - 0.5) * 3, wind.x * 2, 4 + rnd() * 4, wind.y * 2, 0.6 + rnd() * 0.5, 2.2, 0);
        if (rnd() < dt * 6 * tn.fire) smoke.emit(tn.pos.x, tn.pos.y + 3, tn.pos.z, wind.x * 4, 2.5, wind.y * 4, 5 + rnd() * 2, 6, 0);
        firesNow.push({ p: tn.pos, w: tn.fire * 0.7 });
      }
    }
    // watch fires on the shore: small, steady
    for (const w of watchFires) {
      if (rnd() < dt * 18) fire.emit(w.x + (rnd() - 0.5) * 0.6, w.y, w.z, 0, 2 + rnd() * 1.5, 0, 0.5 + rnd() * 0.3, 1.2, 0);
    }

    // --- particles ---
    const focal = (stage.size.h * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    fire.setScale(focal);
    smoke.setScale(focal);
    fire.update(dt, wind, windS, 1);
    smoke.update(dt, wind, windS, 0);

    // --- arrows ---
    for (let i = 0; i < ARROWS; i++) {
      const a = arrows[i];
      if (a.t < 1) {
        a.t += dt / a.dur;
        const p0 = v3.lerpVectors(a.a, a.b, Math.min(1, a.t));
        const y = p0.y + Math.sin(Math.min(1, a.t) * Math.PI) * 6;
        const dx = (a.b.x - a.a.x) * 0.02;
        const dz = (a.b.z - a.a.z) * 0.02;
        arrowPos.set([p0.x, y, p0.z, p0.x - dx, y + 0.1, p0.z - dz], i * 6);
      } else arrowPos.fill(0, i * 6, i * 6 + 6);
    }
    arrowGeo.attributes.position.needsUpdate = true;

    // --- boats ---
    for (let i = boats.length - 1; i >= 0; i--) {
      const b = boats[i];
      b.t += dt;
      b.m.position.addScaledVector(b.v, dt);
      b.m.position.y = 0.25 + Math.sin(b.t * 6) * 0.05;
      b.m.rotation.y = Math.PI / 2;
      if (b.m.position.z > HOME_Z + 4) {
        scene.remove(b.m);
        boats.splice(i, 1);
      }
    }

    // --- lights & water reflections from the strongest fires ---
    const realFire = Math.min(1, firesNow.reduce((a, f) => a + f.w, 0) / 12);
    // lanterns still burning on unharmed ships glint on the water when slots are free
    enemies.forEach((e, i) => {
      const on = !e.burnt && e.fire === 0;
      lanterns[i].visible = on;
      if (on && i % 3 === 1) firesNow.push({ p: e.pos, w: 0.09 });
    });
    firesNow.sort((a, b) => b.w - a.w);
    for (let i = 0; i < MAX_FIRES; i++) {
      const f = firesNow[i];
      if (f) fireU[i].set(f.p.x, 1, f.p.z, f.w * (0.85 + 0.15 * Math.sin(t * 13 + i)));
      else fireU[i].w = 0;
    }
    lights.forEach((pl, i) => {
      const f = firesNow[i * 2];
      if (f) {
        pl.position.set(f.p.x, 4, f.p.z);
        pl.intensity = f.w * (34 + 8 * Math.sin(t * 17 + i * 3));
      } else pl.intensity = 0;
    });
    const fireLevel = realFire;
    fireGlow.value = lerp(fireGlow.value, fireLevel, Math.min(1, dt * 0.8));
    smoke.setGlow(fireLevel);
    fireBed.set(fireLevel * 0.5, 500 + fireLevel * 900);
    if (rnd() < dt * fireLevel * 8) sfx.noise({ dur: 0.08 + rnd() * 0.1, freq: 2000 + rnd() * 3000, q: 2, gain: 0.08 + fireLevel * 0.1 });
    firesNow.length = 0;
    renderer.toneMappingExposure = 1.3 + fireLevel * 0.08;

    // --- camera ---
    const k = intro > 0 ? clamp(time / intro, 0, 1) : 1;
    const e = k * k * (3 - 2 * k);
    const startPos = v3.set(-64, 20, -4);
    camera.position.lerpVectors(startPos, camBase, e);
    camera.position.x += pointer.x * 3 * e;
    camera.position.y += -pointer.y * 2 * e;
    shake = Math.max(0, shake - dt * 1.2);
    if (!ctx.reduced && shake > 0) camera.position.add(new THREE.Vector3((rnd() - 0.5) * shake, (rnd() - 0.5) * shake, 0));
    const look = new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 2, FRONT_Z - 6), camLook, e);
    camera.lookAt(look);

    // --- flags stream with the wind ---
    const flagYaw = Math.atan2(-wind.y, wind.x);
    for (let i = 0; i < flags.length; i++) {
      const f = flags[i];
      const parentYaw = f.parent?.parent?.rotation.y ?? 0;
      f.rotation.y = flagYaw - parentYaw + Math.sin(t * 6 + i) * 0.15 * windS;
    }

    // --- HUD ---
    fireShips.forEach((s, i) => {
      const cls = `rc-pip ${s.state}`;
      if (shipPips[i].className !== cls) shipPips[i].className = cls;
    });
    lightAll.disabled = ended || !fireShips.some((s) => s.state === 'sailing' || s.state === 'docked' || s.state === 'moored');
    const sailingNow = fireShips.filter((s) => s.state === 'sailing' || s.state === 'docked');
    setHtml(lightAll, sailingNow.length ? L(lang, '🔥 齐发火 <kbd>F</kbd>', '🔥 Light all <kbd>F</kbd>') : L(lang, '⛵ 扬帆 <kbd>空格</kbd>', '⛵ Set sail <kbd>Space</kbd>'));
    const burned = enemies.filter((x) => x.fire > 0 || x.burnt).length;
    const tentsBurned = tents.filter((x) => x.fire > 0 || x.burnt).length;
    const saved = fireShips.filter((x) => x.crew === 'saved').length;
    setHtml(stats, `<i>🔥</i><b>${burned} / ${enemies.length}</b><span>${L(lang, '北船', 'ships')}</span><i>⛺</i><b>${tentsBurned} / ${TENTS}</b><span>${L(lang, '营寨', 'tents')}</span><i>🚣</i><b>${saved} / ${FIRE_SHIPS}</b><span>${L(lang, '撤回', 'crews home')}</span>`);

    // --- coach: one instruction at a time ---
    let pulse = false;
    if (ended) coach.say('');
    else if (litTimes.length) {
      coach.step(3);
      const rest = sailingNow.length;
      if (rest) {
        coach.say(L(lang, `还有 ${rest} 艘火船没点着！<small>趁曹军尚未射沉，立刻点火</small>`, `${rest} ship${rest > 1 ? 's' : ''} still unlit!<small>Light them before the arrows sink them</small>`), 'warn', 'F');
        pulse = true;
      } else coach.say(L(lang, '火借风势，烧向曹营<small>看火从一艘船蔓延到下一艘</small>', 'Wind and fire do the rest<small>Watch it leap from ship to ship</small>'), 'good');
    } else if (!seWind) {
      coach.step(0);
      if (earlyLaunch) coach.say(L(lang, '太早了！北风会把船吹回来<small>等罗盘转为东南风</small>', 'Too early — the north wind holds you back<small>Wait for the compass to turn south-east</small>'), 'warn');
      else coach.say(L(lang, '等待东南风……<small>盯住右上角的罗盘</small>', 'Waiting for the south-east wind…<small>Watch the compass, top right</small>'), 'wait');
    } else if (!sailingNow.length) {
      coach.step(1);
      coach.say(L(lang, '东南风起！全军扬帆', 'The wind has turned — set sail!'), 'do', L(lang, '空格', 'Space'));
      pulse = true;
    } else {
      coach.step(2);
      // the lead ship's distance to the gold line, in metres (1 world unit ≈ 38 m)
      const lead = Math.min(...sailingNow.map((s) => nearestEnemy(s.pos).d)) - TWO_LI;
      if (lead > 8) coach.say(L(lang, `驶向金线……还有约 ${Math.round((lead * 38) / 10) * 10} 米`, `Heading for the gold line… ${Math.round((lead * 38) / 10) * 10} m to go`), 'wait');
      else if (lead > -8) {
        coach.say(L(lang, '就是现在 — 齐发火！', 'Now — light them all!'), 'do', 'F');
        pulse = true;
      } else {
        coach.say(L(lang, '过线了！快点火<small>再靠近，士卒就来不及撤离</small>', 'Past the line — light now!<small>Any closer and the crews can’t get away</small>'), 'warn', 'F');
        pulse = true;
      }
    }
    lightAll.classList.toggle('g-pulse', pulse);
    // band label projected at the west end of the gold line
    v3.set(-38, 0, FRONT_Z + TWO_LI).project(camera);
    bandLabel.style.transform = `translate(${((v3.x + 1) / 2) * stage.size.w}px, ${((1 - v3.y) / 2) * stage.size.h - 18}px)`;
    bandLabel.classList.toggle('show', seWind && !ended && fireShips.some((s) => s.state === 'sailing' || s.state === 'moored'));

    // --- end ---
    const active = fireShips.some((s) => s.state === 'moored' || s.state === 'sailing' || s.state === 'burning' || s.state === 'docked');
    const burning = enemies.some((x) => x.fire > 0 && !x.burnt) || tents.some((x) => x.fire > 0 && !x.burnt);
    if (!ended && ((!active && !burning && time > 4) || time > MAX_TIME || burned === enemies.length)) {
      if (endTimer < 0) endTimer = burned === enemies.length ? 9 : 2.5;
    }
    if (endTimer >= 0 && !ended) {
      endTimer -= dt;
      if (endTimer <= 0) finish(burned, tentsBurned, saved);
    }
  });

  const CHAR = new THREE.Color(0x120c0a);

  function sinkShip(s: FireShip) {
    if (s.state === 'sunk') return;
    if (s.crew === 'aboard') s.crew = 'lost';
    s.state = 'sunk';
    sfx.noise({ dur: 1.2, freq: 300, type: 'lowpass', gain: 0.25, sweepTo: 80 });
  }

  function fireArrow(from: THREE.Vector3, to: THREE.Vector3) {
    const a = arrows.find((x) => x.t >= 1);
    if (!a) return;
    a.t = 0;
    a.dur = 0.7 + rnd() * 0.5;
    a.a.set(from.x + (rnd() - 0.5) * 6, 3, from.z);
    a.b.set(to.x + (rnd() - 0.5) * 3, 1, to.z + (rnd() - 0.5) * 3);
  }

  function emitShipFire(p: THREE.Vector3, len: number, yaw: number, k: number, dt: number) {
    const n = 75 * k * dt;
    const cx = Math.cos(yaw);
    const sz = -Math.sin(yaw);
    for (let i = 0; i < n || (i === 0 && rnd() < n); i++) {
      const u = (rnd() - 0.5) * len;
      // licks of flame: big, short-lived, leaning downwind
      fire.emit(
        p.x + cx * u + (rnd() - 0.5) * 1.6,
        0.9 + rnd() * 1.6,
        p.z + sz * u + (rnd() - 0.5) * 1.6,
        wind.x * 3 * windS + (rnd() - 0.5),
        6 + rnd() * 10 * k,
        wind.y * 3 * windS + (rnd() - 0.5),
        0.45 + rnd() * 0.8,
        1.8 + rnd() * 2.6 * k,
        0,
      );
    }
    // sparks
    if (rnd() < dt * 26 * k) fire.emit(p.x + (rnd() - 0.5) * len, 2 + rnd() * 3, p.z, wind.x * 6 * windS + (rnd() - 0.5) * 3, 6 + rnd() * 6, wind.y * 6 * windS + (rnd() - 0.5) * 3, 1.4 + rnd(), 0.35, 1);
    // a column of smoke, thick and slow
    if (rnd() < dt * 20 * k) smoke.emit(p.x + (rnd() - 0.5) * len, 5 + rnd() * 2, p.z + (rnd() - 0.5) * 2, wind.x * 5 * windS, 3 + rnd() * 1.5, wind.y * 5 * windS, 8 + rnd() * 4, 7 + rnd() * 5, 0);
  }

  function finish(burned: number, tentsBurned: number, saved: number) {
    ended = true;
    const shipsPct = burned / enemies.length;
    const tentPct = tentsBurned / TENTS;
    const score = Math.round(shipsPct * 70 + tentPct * 15 + (saved / FIRE_SHIPS) * 15);
    const stars = (score >= 86 ? 3 : score >= 66 ? 2 : score >= 40 ? 1 : 0) as GameResult['stars'];
    const spread = litTimes.length > 1 ? Math.max(...litTimes) - Math.min(...litTimes) : 0;
    const lines = [
      { zh: `焚毁北船 ${burned} / ${enemies.length} 艘`, en: `Enemy ships burned: ${burned} / ${enemies.length}` },
      { zh: `延烧岸上营寨 ${tentsBurned} / ${TENTS} 座`, en: `Camp tents burned: ${tentsBurned} / ${TENTS}` },
      { zh: `走舸接回 ${saved} / ${FIRE_SHIPS} 船士卒`, en: `Fire-ship crews rowed home: ${saved} / ${FIRE_SHIPS}` },
    ];
    if (litTimes.length >= 6 && spread < 2.5) lines.push({ zh: '十船同时发火——与史书所载相合', en: 'Your ships were lit together, as the sources describe' });
    else if (firstLight >= 0 && litTimes.length > 1 && spread > 6) lines.push({ zh: '点火太分散：第一把火就惊动了曹军', en: 'Lit one by one: the first flame gave the ruse away' });
    if (firstLight >= 0 && firstLight < windShiftAt) lines.push({ zh: '未待东南风便举火，火势逆风难成', en: 'Lit before the south-east wind came' });
    const headline =
      stars === 3
        ? { zh: '烟炎张天，曹军大溃', en: 'Smoke and flame fill the sky' }
        : stars === 2
          ? { zh: '火烈风猛，北船多焚', en: 'Fierce fire, fierce wind' }
          : stars === 1
            ? { zh: '火起江上，曹军受挫', en: 'Fire on the river' }
            : { zh: '火攻未成', en: 'The fire attack failed' };
    if (stars >= 2) toast(L(lang, '周瑜率轻锐继其后，雷鼓大进', 'Zhou Yu’s troops follow, drums thundering'), '', 3000);
    setTimeout(() => ctx.end({ score, stars, headline, lines }), stars >= 2 ? 3400 : 300);
  }

  return {
    dispose() {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onMove);
      windBed.stop();
      fireBed.stop();
      sfx.dispose();
      for (const b of boats) scene.remove(b.m);
      boatGeo.dispose();
      boatMat.dispose();
      stage.dispose();
      hud.remove();
    },
  };
};

// ---------- helpers ----------

const htmlCache = new WeakMap<HTMLElement, string>();
function setHtml(el: HTMLElement, html: string) {
  if (htmlCache.get(el) === html) return;
  htmlCache.set(el, html);
  el.innerHTML = html;
}

function windName(w: THREE.Vector2, lang: GameCtx['lang']) {
  // Named for where it blows FROM. w is the direction it blows TO in (x = east, z = south).
  const fromX = -w.x;
  const fromN = w.y; // blowing toward +z (south) means it comes from the north
  const a = (Math.atan2(fromX, fromN) * 180) / Math.PI; // 0 = from north, 90 = from east
  const i = ((Math.round(a / 45) % 8) + 8) % 8;
  const zh = ['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风'];
  const en = ['North wind', 'North-east wind', 'East wind', 'South-east wind', 'South wind', 'South-west wind', 'West wind', 'North-west wind'];
  return lang === 'zh' ? zh[i] : en[i];
}


function textTexture(text: string, color: string, w: number, hgt: number, font: string, bg?: string) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = hgt;
  const g = c.getContext('2d')!;
  if (bg) {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, hgt);
  }
  g.fillStyle = color;
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, w / 2, hgt / 2 + hgt * 0.04);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function sailTexture(cloth: string, batten: string) {
  // woven bamboo matting between battens, weathered toward the foot
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 160;
  const g = c.getContext('2d')!;
  g.fillStyle = cloth;
  g.fillRect(0, 0, 128, 160);
  for (let y = 0; y < 160; y += 3)
    for (let x = (y / 3) % 2 ? 0 : 3; x < 128; x += 6) {
      g.fillStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.08})`;
      g.fillRect(x, y, 3, 2);
    }
  const grd = g.createLinearGradient(0, 0, 0, 160);
  grd.addColorStop(0, 'rgba(255,240,210,.08)');
  grd.addColorStop(1, 'rgba(0,0,0,.28)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 160);
  for (let i = 0; i < 14; i++) {
    g.fillStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.1})`;
    g.fillRect(Math.random() * 128, Math.random() * 160, 6 + Math.random() * 14, 2 + Math.random() * 5);
  }
  g.strokeStyle = batten;
  g.lineWidth = 4;
  for (let y = 10; y < 160; y += 21) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(128, y + 4);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Tarred planking for the hulls: strakes, seams and grain. */
function plankTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#5a4634';
  g.fillRect(0, 0, 256, 64);
  for (let y = 0; y < 64; y += 8) {
    const k = 0.75 + Math.random() * 0.35;
    g.fillStyle = `rgba(${Math.round(90 * k)},${Math.round(70 * k)},${Math.round(52 * k)},1)`;
    g.fillRect(0, y, 256, 7);
    for (let i = 0; i < 60; i++) {
      g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`;
      g.fillRect(Math.random() * 256, y + Math.random() * 7, 10 + Math.random() * 30, 1);
    }
    g.fillStyle = 'rgba(10,6,4,.9)';
    g.fillRect(0, y + 7, 256, 1);
    for (let x = Math.random() * 60; x < 256; x += 50 + Math.random() * 60) g.fillRect(x, y, 1, 7);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

/** A junk: tapered planked hull with sheer, deckhouse, masts with battened matting sails, banner. */
function buildJunk(o: { len: number; beam: number; color: number; wood: THREE.Texture; sail: THREE.Texture; flag: THREE.Texture; flags: THREE.Mesh[]; masts: number; cargo?: boolean; squareSail?: boolean }) {
  const g = new THREE.Group();
  const hullGeo = new THREE.BoxGeometry(o.len, 1.5, o.beam, 16, 3, 4);
  const pos = hullGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = x / (o.len / 2);
    let z = pos.getZ(i) * (1 - 0.5 * u * u);
    if (y < 0) z *= 0.5 + 0.25 * (y + 0.75);
    const yy = y + (y > 0 ? 0.55 * u * u + (u < 0 ? 0.35 * u * u : 0) : 0.2 * u * u);
    pos.setXYZ(i, x, yy + 0.4, z);
  }
  hullGeo.computeVertexNormals();
  const hull = new THREE.MeshStandardMaterial({ color: o.color, map: o.wood, roughness: 0.78, emissive: 0x000000, envMapIntensity: 0.8 });
  g.add(new THREE.Mesh(hullGeo, hull));
  const trim = new THREE.MeshStandardMaterial({ color: 0x2a1c12, roughness: 0.7 });
  const house = new THREE.Mesh(new THREE.BoxGeometry(o.len * 0.22, 1.1, o.beam * 0.7), trim);
  house.position.set(-o.len * 0.32, 1.9, 0);
  g.add(house);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(o.len * 0.27, 0.16, o.beam * 0.86), new THREE.MeshStandardMaterial({ color: 0x1c140e, roughness: 0.9 }));
  roof.position.set(-o.len * 0.32, 2.5, 0);
  g.add(roof);
  if (o.cargo) {
    // reeds and oil under curtains
    const cargo = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, o.len * 0.5, 9, 1), new THREE.MeshStandardMaterial({ color: 0x8c7448, roughness: 1, map: o.sail }));
    cargo.rotation.z = Math.PI / 2;
    cargo.position.set(o.len * 0.08, 1.9, 0);
    cargo.scale.set(1, 1, o.beam * 0.4);
    g.add(cargo);
  }
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x1f160f, roughness: 0.8 });
  const sailMat = new THREE.MeshStandardMaterial({ map: o.sail, side: THREE.DoubleSide, roughness: 1, envMapIntensity: 0.4 });
  for (let m = 0; m < o.masts; m++) {
    const mx = o.masts === 1 ? 0.1 * o.len : (m === 0 ? 0.18 : -0.12) * o.len;
    const hgt = m === 0 ? 7.5 : 6;
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, hgt, 6), mastMat);
    mast.position.set(mx, 1.2 + hgt / 2, 0);
    g.add(mast);
    const sw = hgt * 0.62;
    const sh = hgt * 0.75;
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh, 6, 6), sailMat);
    // a little belly in the cloth
    const sp = sail.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < sp.count; i++) sp.setZ(i, Math.cos((sp.getX(i) / sw) * Math.PI) * 0.4 * (0.6 + 0.4 * Math.cos((sp.getY(i) / sh) * Math.PI)));
    sail.geometry.computeVertexNormals();
    sail.position.set(mx + (o.squareSail ? 0 : -sw * 0.35), 1.6 + hgt * 0.52, 0);
    if (o.squareSail) sail.rotation.y = Math.PI / 2; // squared across the hull, running before the wind
    g.add(sail);
    if (m === 0) {
      const flagPivot = new THREE.Group();
      flagPivot.position.set(mx, 1.2 + hgt + 0.2, 0);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.2), new THREE.MeshStandardMaterial({ map: o.flag, side: THREE.DoubleSide, roughness: 1 }));
      flag.position.x = 0.75;
      const fp = new THREE.Group();
      fp.add(flag);
      flagPivot.add(fp);
      g.add(flagPivot);
      o.flags.push(fp as unknown as THREE.Mesh);
    }
  }
  return { g, hull };
}

/**
 * CPU particle pool rendered as camera-facing puffs: additive licks of flame (white-hot to
 * ember-red as they age) or alpha-blended smoke (lit orange from below while young, then
 * charcoal), each one spinning slowly on its own atlas tile.
 */
class Particles {
  points: THREE.Points;
  private pos: Float32Array;
  private vel: Float32Array;
  private life: Float32Array;
  private max: Float32Array;
  private size: Float32Array;
  private kind: Float32Array;
  private aLife: Float32Array;
  private rot: Float32Array;
  private spin: Float32Array;
  private next = 0;
  constructor(
    private n: number,
    tex: THREE.Texture,
    private additive: boolean,
  ) {
    this.pos = new Float32Array(n * 3).fill(-999);
    this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n).fill(1);
    this.max = new Float32Array(n).fill(1);
    this.size = new Float32Array(n);
    this.kind = new Float32Array(n);
    this.aLife = new Float32Array(n).fill(1);
    this.rot = new Float32Array(n);
    this.spin = new Float32Array(n);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) seed[i] = Math.floor(Math.random() * 4);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    geo.setAttribute('aLife', new THREE.BufferAttribute(this.aLife, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    geo.setAttribute('aKind', new THREE.BufferAttribute(this.kind, 1));
    geo.setAttribute('aRot', new THREE.BufferAttribute(this.rot, 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: { uTex: { value: tex }, uScale: { value: 420 }, uGlow: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aLife; attribute float aSize; attribute float aKind; attribute float aRot; attribute float aSeed;
        varying float vLife; varying float vKind; varying float vRot; varying float vSeed; uniform float uScale;
        void main(){
          vLife = aLife; vKind = aKind; vRot = aRot; vSeed = aSeed;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float grow = ${additive ? 'aKind > 0.5 ? 1.0 : (0.6 + aLife * 1.2) * (1.0 - aLife * 0.75)' : '0.5 + aLife * 2.4'};
          gl_PointSize = aLife >= 1.0 ? 0.0 : min(600.0, aSize * grow * uScale / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: additive
        ? /* glsl */ `
        uniform sampler2D uTex; varying float vLife; varying float vKind; varying float vRot; varying float vSeed;
        void main(){
          float t = vLife;
          if (vKind > 0.5) {
            // embers: tiny hard sparks
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.1, d) * (1.0 - t);
            gl_FragColor = vec4(vec3(1.0, 0.62, 0.22) * a * 3.0, a);
            return;
          }
          vec2 pc = gl_PointCoord - 0.5;
          // flames are tongues, not balls: a narrow, upright sample of the puff, tapering upward
          pc.x *= 1.55 + (0.5 - gl_PointCoord.y) * -0.9;
          float cs = cos(vRot), sn = sin(vRot);
          pc = mat2(cs, -sn, sn, cs) * pc * 1.1 + 0.5;
          if (pc.x < 0.0 || pc.y < 0.0 || pc.x > 1.0 || pc.y > 1.0) discard;
          vec2 uv = (pc + vec2(mod(vSeed, 2.0), floor(vSeed / 2.0))) * 0.5;
          float a = texture2D(uTex, uv).a;
          // erode the puff as it ages so overlapping flames keep gaps and ragged edges
          float dens = smoothstep(0.12 + t * 0.55, 0.62 + t * 0.3, a);
          float tt = clamp(t + (1.0 - dens) * 0.35, 0.0, 1.0);
          // black-body ramp: white-yellow core, orange body, deep red tips
          vec3 c = tt < 0.18 ? mix(vec3(1.0, 0.9, 0.66), vec3(1.0, 0.55, 0.15), tt / 0.18)
                 : tt < 0.55 ? mix(vec3(1.0, 0.55, 0.15), vec3(0.8, 0.18, 0.03), (tt - 0.18) / 0.37)
                 : mix(vec3(0.8, 0.18, 0.03), vec3(0.18, 0.03, 0.01), (tt - 0.55) / 0.45);
          float alpha = dens * (1.0 - t) * smoothstep(0.0, 0.05, t);
          gl_FragColor = vec4(c * alpha * 0.95, alpha);
        }`
        : /* glsl */ `
        uniform sampler2D uTex; uniform float uGlow; varying float vLife; varying float vRot; varying float vSeed;
        void main(){
          vec2 pc = gl_PointCoord - 0.5;
          float cs = cos(vRot), sn = sin(vRot);
          pc = mat2(cs, -sn, sn, cs) * pc * 1.15 + 0.5;
          if (pc.x < 0.0 || pc.y < 0.0 || pc.x > 1.0 || pc.y > 1.0) discard;
          vec2 uv = (pc + vec2(mod(vSeed, 2.0), floor(vSeed / 2.0))) * 0.5;
          float a = texture2D(uTex, uv).a;
          // lit from below by the fire while young and low; charcoal once it has risen and cooled
          vec3 warm = vec3(0.62, 0.26, 0.08) * (0.6 + uGlow * 0.6);
          vec3 c = mix(warm, vec3(0.055, 0.055, 0.065), smoothstep(0.0, 0.4, vLife));
          c += vec3(0.05, 0.06, 0.08) * (1.0 - pc.y) * smoothstep(0.3, 1.0, vLife);
          gl_FragColor = vec4(c, a * 0.6 * (1.0 - vLife) * smoothstep(0.0, 0.08, vLife));
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
  }
  emit(x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, size: number, kind: number) {
    const i = this.next;
    this.next = (this.next + 1) % this.n;
    this.pos.set([x, y, z], i * 3);
    this.vel.set([vx, vy, vz], i * 3);
    this.life[i] = 0;
    this.max[i] = life;
    this.size[i] = size;
    this.kind[i] = kind;
    // flames stay roughly upright; smoke tumbles freely
    this.rot[i] = this.additive ? (Math.random() - 0.5) * 0.7 : Math.random() * Math.PI * 2;
    this.spin[i] = (Math.random() - 0.5) * (this.additive ? 0.8 : 0.6);
  }
  /** Point sizes are in world units: scale by the camera's focal length in device pixels. */
  setScale(px: number) {
    (this.points.material as THREE.ShaderMaterial).uniforms.uScale.value = px;
  }
  setGlow(k: number) {
    (this.points.material as THREE.ShaderMaterial).uniforms.uGlow.value = k;
  }
  update(dt: number, wind: THREE.Vector2, windS: number, buoy: number) {
    const { pos, vel, life, max, aLife, rot, spin } = this;
    for (let i = 0; i < this.n; i++) {
      if (life[i] >= 1) {
        aLife[i] = 1;
        continue;
      }
      life[i] += dt / max[i];
      rot[i] += spin[i] * dt;
      const j = i * 3;
      vel[j] += wind.x * windS * 3 * dt;
      vel[j + 2] += wind.y * windS * 3 * dt;
      vel[j + 1] += (buoy ? 2 : 0.3) * dt - (this.kind[i] > 0.5 ? 3 * dt : 0);
      const drag = 1 - dt * (this.additive ? 0.9 : 0.35);
      vel[j] *= drag;
      vel[j + 1] *= drag;
      vel[j + 2] *= drag;
      pos[j] += vel[j] * dt;
      pos[j + 1] += vel[j + 1] * dt;
      pos[j + 2] += vel[j + 2] * dt;
      aLife[i] = Math.min(1, life[i]);
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aLife.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
    g.attributes.aKind.needsUpdate = true;
    g.attributes.aRot.needsUpdate = true;
  }
}
