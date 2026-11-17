import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createSfx } from '../shared/sfx';
import { GAME_BY_ID } from '../registry';
import { createCoach } from '../shared/coach';
import { clamp, createStage, dotTexture, gradientEnv, h, makeToast, puffAtlas } from '../shared/stage';
import type { GameCtx, GameResult, MountGame } from '../types';
import * as P from './physics';

/*
 * 东方一号 · 入轨 — Vostok 1, 12 April 1961.
 *
 * Scene units are kilometres in an inertial frame that equals the Earth-fixed frame at launch
 * (+y = north pole, +x = 0°E, −z = 90°E). The Earth group turns with sidereal time. The flight
 * itself is integrated in the orbital plane by ./physics and mapped into 3-D with orbitBasis().
 */

type Phase = 'pad' | 'ascent' | 'orbit' | 'reentry' | 'done';
const L = (lang: GameCtx['lang'], zh: string, en: string) => (lang === 'zh' ? zh : en);

/** 3-D value noise and fBm, for detail that must stay fixed to the turning Earth. */
const NOISE3_GLSL = /* glsl */ `
  float hash3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vnoise3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x), mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x), mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++){ s += a * vnoise3(p); p = p * 2.02 + 3.1; a *= 0.5; } return s; }`;

const LAUNCH_UTC_MIN = 6 * 60 + 7; // 06:07 UTC
const SUN = new THREE.Vector3(...P.geo(8.6, 88.2)).normalize(); // subsolar point at launch
const TARGET_PERI = 150;
const TARGET_APO = 400;
/** Reference pitch program, shown as a ghost marker on the attitude dial. */
const guidePitch = (t: number) => (t < 10 ? 90 : t < 118 ? 90 - (t - 10) * (55 / 108) : t < 302 ? 35 - (t - 118) * (25 / 184) : 5 - (t - 302) * (10 / 372));

export const mount: MountGame = (root, ctx) => {
  const { lang } = ctx;
  const stage = createStage(root, {
    bloom: { strength: 0.75, radius: 0.5, threshold: 0.88 },
    fov: 50,
    logDepth: true,
    // bright desert noon: neutral-cool shadows, gently warm highlights, a touch of film
    grade: { shadows: [0.004, 0.008, 0.016], highlights: [1.04, 1.0, 0.95], contrast: 1.07, saturation: 1.08, vignette: 0.36, grain: 0.022 },
  });
  const { scene, camera, renderer } = stage;
  camera.near = 0.0005;
  camera.far = 120000;
  camera.updateProjectionMatrix();
  const sfx = createSfx();
  const basis = P.orbitBasis();
  const E1 = new THREE.Vector3(...basis.e1);
  const E2 = new THREE.Vector3(...basis.e2);
  const NRM = new THREE.Vector3().crossVectors(E1, E2).normalize();
  const tex = new THREE.TextureLoader();
  const BASE = import.meta.env.BASE_URL;
  const dayMap = tex.load(`${BASE}textures/earth-blue-marble.jpg`);
  dayMap.colorSpace = THREE.SRGBColorSpace;
  dayMap.anisotropy = 8;
  const waterMap = tex.load(`${BASE}textures/earth-water.png`);
  // CC0 photo textures from Poly Haven (see public/textures/cc0/CREDITS.md)
  const photo = (name: string, color: boolean, repeat = 1) => {
    const t = tex.load(`${BASE}textures/cc0/${name}.jpg`);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = 8;
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const groundMap = photo('aerial_ground_rock_diff', true);
  const groundNrm = photo('aerial_ground_rock_nor', false);
  // a flat east/north frame at Baikonur to lay the ground photo on (also good enough 1,400 km away
  // at the landing site, where it just stretches a little)
  const siteUp = new THREE.Vector3(...P.geo(P.BAIKONUR.lat, P.BAIKONUR.lon));
  const siteE = new THREE.Vector3(0, 1, 0).cross(siteUp).normalize();
  const siteN = siteUp.clone().cross(siteE).normalize();

  // ---------- Earth ----------
  const earth = new THREE.Group();
  scene.add(earth);
  const earthUniforms = { uMap: { value: dayMap }, uWater: { value: waterMap }, uSun: { value: SUN.clone() }, uCamPos: { value: camera.position }, uHaze: { value: new THREE.Color('#9fc0e0') }, uCamAlt: { value: 0 }, uGround: { value: groundMap }, uGroundN: { value: groundNrm }, uSiteE: { value: siteE }, uSiteN: { value: siteN } };
  const earthMat = new THREE.ShaderMaterial({
    uniforms: earthUniforms,
    vertexShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec3 vO;
      void main(){
        vUv = uv;
        vO = normal; // Earth-fixed direction: clouds and ground detail stay put as the globe turns
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        // modelViewMatrix is composed in double precision on the CPU; going through world space
        // in float32 would lose ~0.5 m at Earth-radius distances
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform sampler2D uMap; uniform sampler2D uWater; uniform vec3 uSun; uniform vec3 uCamPos; uniform vec3 uHaze; uniform float uCamAlt;
      uniform sampler2D uGround; uniform sampler2D uGroundN; uniform vec3 uSiteE; uniform vec3 uSiteN;
      varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec3 vO;
      ${NOISE3_GLSL}
      void main(){
        #include <logdepthbuf_fragment>
        vec3 N = normalize(vN);
        vec3 V = normalize(uCamPos - vW);
        vec3 day = texture2D(uMap, vUv).rgb;
        float water = texture2D(uWater, vUv).r;
        float ndl = dot(N, uSun);
        float lit = smoothstep(-0.08, 0.3, ndl);
        // close to the ground the 2 km/px photo is a smear: weave in steppe at three scales
        // (tens of km of terrain, km-scale fields and salt pans, 100 m tufts)
        float near = 1.0 - smoothstep(25.0, 160.0, length(uCamPos - vW));
        if (near > 0.0 && water < 0.5) {
          vec3 o = normalize(vO) * 6371.0;
          float n1 = fbm3(o * 0.05), n2 = fbm3(o * 0.6 + 7.0), n3 = vnoise3(o * 9.0), n4 = vnoise3(o * 70.0);
          vec3 steppe = mix(vec3(0.50, 0.42, 0.27), vec3(0.30, 0.31, 0.19), smoothstep(0.3, 0.7, n1));
          steppe = mix(steppe, vec3(0.70, 0.64, 0.52), smoothstep(0.6, 0.78, n2) * 0.8);
          steppe = mix(steppe, vec3(0.26, 0.27, 0.16), smoothstep(0.55, 0.75, fbm3(o * 2.5 + 2.0)) * 0.5);
          steppe *= (0.78 + 0.4 * n3) * (0.88 + 0.24 * n4);
          // photographed dry ground (stones, cracked crust, scrub) at 80 m and 700 m tiles: the
          // close detail the noise cannot draw. Used as a relative tint so the steppe keeps its hue.
          float d = length(uCamPos - vW);
          vec2 pl = vec2(dot(o, uSiteE), dot(o, uSiteN));
          vec3 ph1 = texture2D(uGround, pl / 0.08).rgb, ph2 = texture2D(uGround, pl / 0.7 + 0.37).rgb;
          float fine = 1.0 - smoothstep(1.5, 9.0, d);
          // (relative to the photo's mean; mostly its light and shade, a little of its colour)
          const vec3 PH_MEAN = vec3(0.22, 0.146, 0.107);
          vec3 rel1 = mix(vec3(dot(ph1, vec3(0.2126, 0.7152, 0.0722)) / 0.159), ph1 / PH_MEAN, 0.25);
          vec3 rel2 = mix(vec3(dot(ph2, vec3(0.2126, 0.7152, 0.0722)) / 0.159), ph2 / PH_MEAN, 0.25);
          vec3 tint = mix(vec3(1.0), rel2, 0.55 * (1.0 - smoothstep(10.0, 60.0, d)));
          tint *= mix(vec3(1.0), rel1, 0.75 * fine);
          steppe *= tint;
          // its normal map, so the low Sun picks out every stone and rut near the pad
          vec3 gn = texture2D(uGroundN, pl / 0.08).xyz * 2.0 - 1.0;
          vec3 Np = normalize(N + (uSiteE * gn.x + uSiteN * gn.y) * 0.9 * fine);
          steppe *= mix(1.0, clamp(max(dot(Np, uSun), 0.0) / max(ndl, 0.15), 0.55, 1.4), fine);
          day = mix(day, steppe, near * 0.85);
        }
        vec3 c = day * (0.03 + 0.95 * lit);
        // weather seen from orbit: cloud decks lit by the Sun, faded out near the ground where a
        // painted-on cloud would read as a stain on the steppe
        float cl = smoothstep(0.5, 0.8, fbm3(normalize(vO) * 4.0 + vec3(3.0)) * 0.78 + fbm3(normalize(vO) * 16.0) * 0.3);
        cl *= smoothstep(80.0, 300.0, uCamAlt);
        c = mix(c, vec3(0.95, 0.96, 0.98) * (0.04 + 1.05 * lit), cl * 0.85);
        // a thin warm line along the terminator
        c += vec3(0.6, 0.28, 0.1) * exp(-pow(ndl * 22.0, 2.0)) * 0.05;
        vec3 R = reflect(-uSun, N);
        c += vec3(1.0, 0.95, 0.85) * pow(max(dot(R, V), 0.0), 220.0) * water * lit * 0.35;
        // the limb glow belongs to the view from space; near the ground it only washes the steppe out
        float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0) * smoothstep(1.0, 60.0, length(uCamPos) - 6371.0);
        c = mix(c, vec3(0.35, 0.6, 1.0) * (0.15 + lit), fres * 0.55 * smoothstep(-0.25, 0.2, ndl));
        // aerial perspective while still low: the far steppe fades into the sky
        float camAlt = length(uCamPos) - 6371.0;
        float hz = (1.0 - exp(-length(uCamPos - vW) / 140.0)) * (1.0 - smoothstep(3.0, 45.0, camAlt));
        c = mix(c, uHaze, hz * 0.7);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const globe = new THREE.Mesh(new THREE.SphereGeometry(P.RE - 3, 160, 80), earthMat);
  earth.add(globe);
  // High-resolution patch around Baikonur, on the true radius, so the pad and the climb sit on a
  // smooth surface rather than on the coarse sphere's 250 km facets.
  {
    // vertices are stored relative to the patch centre: at Earth-radius magnitudes float32 would
    // jitter them by ~0.5 m, enough to fight the pad deck
    const patch = new THREE.Mesh(patchGeometry(P.BAIKONUR.lat, P.BAIKONUR.lon, 0.32, 90, 128), earthMat);
    patch.position.set(...P.geo(P.BAIKONUR.lat, P.BAIKONUR.lon)).multiplyScalar(P.RE);
    earth.add(patch);
  }

  // Atmosphere: a back-face shell glowing at the limb, plus the sky colour from inside it.
  const atmoMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uSun: { value: SUN.clone() }, uCamPos: { value: camera.position } },
    vertexShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec3 vW; varying vec3 vN;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(w.xyz); gl_Position = projectionMatrix * viewMatrix * w;
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform vec3 uSun; uniform vec3 uCamPos; varying vec3 vW; varying vec3 vN;
      void main(){
        #include <logdepthbuf_fragment>
        vec3 V = normalize(vW - uCamPos);
        float rim = pow(1.0 - abs(dot(V, vN)), 5.0);
        float lit = smoothstep(-0.3, 0.4, dot(vN, uSun));
        gl_FragColor = vec4(vec3(0.3, 0.55, 1.0) * rim * lit * 1.4, 1.0);
      }`,
  });
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(P.RE + 90, 96, 48), atmoMat);
  scene.add(atmo);

  // Stars.
  {
    const n = 3000;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(90000);
      pos.set([v.x, v.y, v.z], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, transparent: true, opacity: 0 }));
    stars.name = 'stars';
    scene.add(stars);
  }
  const stars = scene.getObjectByName('stars') as THREE.Points;
  const sunLight = new THREE.DirectionalLight(0xfff1dc, 2.6);
  sunLight.position.copy(SUN).multiplyScalar(100000);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x6688aa, 0.35));
  const sky = new THREE.Color();
  const SKY_LOW = new THREE.Color('#9fc0e0');
  const SKY_HIGH = new THREE.Color('#02030a');
  scene.background = new THREE.Color('#000000');
  // The sky from inside the atmosphere: deep blue overhead, milky toward the horizon, a hot halo
  // round the Sun, all thinning to black as the rocket climbs out of the air. It is a sphere that
  // rides with the camera and draws first, so the Earth simply paints over its lower half.
  // the real sky behind the stars: NASA/Goddard SVS Deep Star Maps 2020 (celestial coordinates)
  const milky = tex.load(`${BASE}textures/cc0/nasa_starmap_2020_1k.jpg`);
  milky.colorSpace = THREE.SRGBColorSpace;
  const skyU = { uSun: { value: SUN.clone() }, uUp: { value: new THREE.Vector3(0, 1, 0) }, uAlt: { value: 0 }, uDip: { value: 0 }, uMilky: { value: milky } };
  const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 32),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      uniforms: skyU,
      vertexShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_vertex>
        varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_fragment>
        uniform vec3 uSun, uUp; uniform float uAlt, uDip; uniform sampler2D uMilky; varying vec3 vD;
        void main(){
          #include <logdepthbuf_fragment>
          vec3 d = normalize(vD);
          float h = dot(d, uUp) + uDip;           // elevation above the (dipping) horizon
          float mu = max(dot(d, uSun), 0.0);
          float air = exp(-uAlt / 9.0);           // how much atmosphere is still overhead
          float sunH = clamp(dot(uUp, uSun) * 2.0 + 0.3, 0.0, 1.0);
          vec3 zen = vec3(0.10, 0.28, 0.66);
          vec3 hor = vec3(0.70, 0.80, 0.90);
          vec3 c = mix(hor, zen, pow(clamp(h, 0.0, 1.0), 0.42));
          c = mix(c, hor * 0.9, smoothstep(0.0, -0.06, h));
          c += vec3(1.0, 0.92, 0.75) * (pow(mu, 9.0) * 0.35 + pow(mu, 80.0) * 0.6);
          c *= sunH * air;
          // above the air: black, with a thin blue band clinging to the horizon
          c += vec3(0.25, 0.5, 1.0) * exp(-abs(h) * 40.0) * (1.0 - air) * smoothstep(5.0, 40.0, uAlt) * 0.35;
          // the Milky Way and the faint background of stars, once the air no longer outshines them.
          // Scene +y is the celestial pole and +x pointed at 0°E at launch, when Greenwich sidereal
          // time was ~19.6 h (294°); east is −z. The map has RA 0 h at its centre, rising leftward.
          float ra = radians(294.0) + atan(-d.z, d.x);
          vec2 suv = vec2(0.5 - ra / 6.2831853, asin(clamp(d.y, -1.0, 1.0)) / 3.1415927 + 0.5);
          c += texture2D(uMilky, suv).rgb * 1.3 * (1.0 - air) * smoothstep(-0.02, 0.05, h + 0.05) * (1.0 - pow(mu, 4.0));
          // the Sun itself, hot enough to bloom
          c += vec3(1.0, 0.96, 0.88) * smoothstep(0.99965, 0.99985, mu) * 18.0;
          gl_FragColor = vec4(c, 1.0);
        }`,
    }),
  );
  skyDome.renderOrder = -10;
  skyDome.frustumCulled = false;
  scene.add(skyDome);
  scene.environment = gradientEnv(renderer, { top: '#3d6fb8', horizon: '#c8d8e6', ground: '#6a5f48', sun: { dir: SUN, color: '#fff2dc', size: 0.02, power: 3 } });
  scene.environmentIntensity = 0.55;

  // ---------- the pad (on the Earth, so it turns away with it) ----------
  const padUp = new THREE.Vector3(...P.geo(P.BAIKONUR.lat, P.BAIKONUR.lon));
  const pad = new THREE.Group();
  pad.position.copy(padUp).multiplyScalar(P.RE);
  pad.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), padUp);
  earth.add(pad);
  const padM = new THREE.Group();
  padM.scale.setScalar(0.001); // build in metres
  pad.add(padM);
  // Gagarin's Start: a stepped concrete launch table on a wide apron, the flame-trench mouth open
  // under the rocket, and steel lattice for every mast and arm. The table carries painted slabs and
  // scorch rings, with the relief of worn poured concrete (Poly Haven, CC0).
  const slabMap = concreteTexture();
  slabMap.center.set(0.5, 0.5);
  slabMap.rotation = Math.PI / 4; // the square frustum's cap is mapped as a diamond
  const relief = (rep: number) => photo('concrete_floor_worn_001_nor', false, rep);
  const concrete = new THREE.MeshStandardMaterial({ color: 0xa8a396, map: slabMap, normalMap: relief(5), normalScale: new THREE.Vector2(1.4, 1.4), roughness: 0.95 });
  const apronMap = concreteTexture(false);
  apronMap.center.set(0.5, 0.5);
  apronMap.rotation = Math.PI / 4;
  const apronMat = new THREE.MeshStandardMaterial({ color: 0x9a9488, map: apronMap, normalMap: relief(9), normalScale: new THREE.Vector2(1.2, 1.2), roughness: 0.97 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x8a4a32, roughness: 0.55, metalness: 0.55 });
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x9a9c98, roughness: 0.6, metalness: 0.5 });
  // square frustums (4-sided cylinders turned 45°): sloped concrete skirts, tops proud of the ground
  const SQ = Math.SQRT2;
  const frustum = (top: number, bottom: number, hgt: number, y: number, mat: THREE.Material) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(top * SQ, bottom * SQ, hgt, 4, 1), mat);
    m.rotation.y = Math.PI / 4;
    m.position.y = y;
    padM.add(m);
    return m;
  };
  frustum(50, 56, 1.0, -0.3, apronMat); // apron, top 0.2 m
  frustum(26, 29, 1.2, 0.0, concrete); // launch table, top 0.6 m
  // the trench mouth: a dark well under the stack, running out to the table's edge, with a steel lip
  const pitMat = new THREE.MeshStandardMaterial({ color: 0x0b0a09, roughness: 1 });
  const pit = new THREE.Mesh(new THREE.BoxGeometry(15, 0.1, 34), pitMat);
  pit.position.set(0, 0.62, 9);
  padM.add(pit);
  {
    const lip: THREE.BufferGeometry[] = [];
    for (const x of [-7.8, 7.8]) lip.push(new THREE.BoxGeometry(0.6, 0.5, 34.6).translate(x, 0.75, 9));
    for (const z of [-8.3, 26.3]) lip.push(new THREE.BoxGeometry(16.2, 0.5, 0.6).translate(0, 0.75, z));
    padM.add(new THREE.Mesh(mergeGeometries(lip)!, mastMat));
  }
  // The four support arms ("tulip") that fall back at lift-off: tapering lattice trusses.
  const armGeo = lattice(1.1, 0.55, 26, 3.25, 0.32);
  const arms: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) {
    const a = new THREE.Group();
    a.add(new THREE.Mesh(armGeo, steel));
    // counterweight at the foot that swings the arm clear
    const cw = new THREE.Mesh(new THREE.BoxGeometry(3, 2.2, 3), steel);
    cw.position.set(1.2, 0.9, 0);
    a.add(cw);
    const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
    a.position.set(Math.cos(ang) * 7.5, 0.6, Math.sin(ang) * 7.5);
    a.rotation.y = -ang;
    a.rotation.z = 0.08;
    padM.add(a);
    arms.push(a);
  }

  // The two cable masts, floodlight towers, the erector rail line and the low service buildings
  // around Gagarin's Start, for scale.
  {
    for (const [x, z, hgt] of [
      [-22, -8, 52],
      [24, 6, 46],
    ] as const) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(lattice(1.3, 1.0, hgt, 4, 0.34), mastMat));
      // cable boom and working platform at the top
      const deckTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 3.6), mastMat);
      deckTop.position.y = hgt;
      g.add(deckTop);
      const boom = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(x, z) * 0.55, 0.5, 0.5), mastMat);
      boom.position.set((-Math.sign(x) * Math.hypot(x, z) * 0.55) / 2, hgt - 6, 0);
      g.add(boom);
      g.position.set(x, 0.6, z);
      padM.add(g);
    }
    // four floodlight towers at the apron corners
    const floodGeo = lattice(1.1, 0.4, 62, 5, 0.26);
    const lamp = new THREE.MeshStandardMaterial({ color: 0x6d6f6c, roughness: 0.5, metalness: 0.6, emissive: 0xfff2d8, emissiveIntensity: 0.15 });
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const tw = new THREE.Group();
      tw.add(new THREE.Mesh(floodGeo, mastMat));
      const head = new THREE.Mesh(new THREE.BoxGeometry(4, 2.4, 1), lamp);
      head.position.y = 62;
      tw.add(head);
      tw.position.set(Math.cos(a) * 95, 0, Math.sin(a) * 95);
      tw.lookAt(0, 0, 0);
      padM.add(tw);
    }
    // the rail line the rocket arrived on, lying flat on the erector, from the assembly hall
    const railMat = new THREE.MeshStandardMaterial({ color: 0x5c5650, roughness: 0.45, metalness: 0.7 });
    const railLen = 420;
    const rails = mergeGeometries([-0.76, 0.76].map((x) => new THREE.BoxGeometry(0.12, 0.16, railLen).translate(x, 0.32, -56 - railLen / 2)))!;
    padM.add(new THREE.Mesh(rails, railMat));
    const sleepers = new THREE.InstancedMesh(new THREE.BoxGeometry(2.6, 0.2, 0.25), new THREE.MeshStandardMaterial({ color: 0x3e3730, roughness: 1 }), Math.floor(railLen / 0.8));
    const sm = new THREE.Matrix4();
    for (let i = 0; i < sleepers.count; i++) sleepers.setMatrixAt(i, sm.makeTranslation(0, 0.14, -56 - i * 0.8));
    padM.add(sleepers);
    const ballast = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, railLen), new THREE.MeshStandardMaterial({ color: 0x77706a, roughness: 1, normalMap: relief(1) }));
    ballast.position.set(0, 0.04, -56 - railLen / 2);
    padM.add(ballast);
    const shed = new THREE.MeshStandardMaterial({ color: 0xb9b3a4, roughness: 0.9 });
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(14 + (i % 3) * 8, 5 + (i % 4) * 2, 10 + (i % 2) * 6), shed);
      const a = (i / 9) * Math.PI * 2 + 0.4;
      const r = 160 + (i % 3) * 70;
      b.position.set(Math.cos(a) * r, 2, Math.sin(a) * r);
      b.rotation.y = a;
      padM.add(b);
    }
    // the assembly hall at the far end of the rail line
    const hall = new THREE.Mesh(new THREE.BoxGeometry(60, 26, 110), shed);
    hall.position.set(0, 13, -56 - railLen - 55);
    padM.add(hall);
  }
  // the engines light the pad, the stack and the cloud for the first seconds
  const launchLight = new THREE.PointLight(0xffa04a, 0, 0.35, 1.2);
  scene.add(launchLight);

  // ---------- rocket ----------
  const R7 = buildR7();
  scene.add(R7.root);

  // Real sun shadows round the pad: the stack, the arms and the masts throw long morning shadows
  // across the concrete. The shadow camera is a small box (km) kept centred on the pad; once the
  // rocket is well clear the map stops updating and it simply falls outside the box.
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  Object.assign(sunLight.shadow.camera, { left: -0.16, right: 0.16, top: 0.16, bottom: -0.16, near: 0.05, far: 1.2 });
  sunLight.shadow.camera.updateProjectionMatrix();
  // The pad sits 6,371 km from the origin, where float32 world positions only resolve ~0.5 m,
  // so the bias has to clear a couple of metres (depth runs 0..1 over the 1.15 km box).
  sunLight.shadow.bias = -0.0018;
  sunLight.shadow.normalBias = 0.0012;
  sunLight.shadow.radius = 3;
  scene.add(sunLight.target);
  const caster = (o: THREE.Object3D, receive: boolean) =>
    o.traverse((m) => {
      if (!(m instanceof THREE.Mesh)) return;
      const mat = m.material as THREE.Material;
      if (mat.transparent) return; // frost, plumes, glows
      m.castShadow = true;
      m.receiveShadow = receive;
    });
  caster(padM, true);
  caster(R7.root, true);
  const padWorld = new THREE.Vector3();
  const aimShadow = () => {
    pad.getWorldPosition(padWorld);
    sunLight.target.position.copy(padWorld);
    sunLight.position.copy(padWorld).addScaledVector(SUN, 0.6);
    sunLight.target.updateMatrixWorld();
  };
  const plumeMat = plumeMaterial();
  const plumes: THREE.Mesh[] = [];
  const addPlume = (parent: THREE.Object3D, x: number, y: number, z: number, r: number) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(r, 1, 20, 1, true), plumeMat.clone());
    m.geometry.translate(0, -0.5, 0);
    m.position.set(x, y, z);
    parent.add(m);
    plumes.push(m);
    return m;
  };
  const boosterPlumes = R7.boosters.map((b) => addPlume(b, 0, 0, 0, 1.3));
  const corePlume = addPlume(R7.core, 0, 0, 0, 1.1);
  const upperPlume = addPlume(R7.upper, 0, 0, 0, 0.7);
  upperPlume.visible = false;

  // Smoke / contrail, in world coordinates, left behind by the rocket.
  const smoke = new WorldPuffs(4200, puffAtlas());
  /** Stochastic count for a per-second emission rate, so smoke density is frame-rate independent. */
  const perSec = (rate: number, dt: number) => Math.floor(rate * dt + Math.random());
  scene.add(smoke.points);

  // ---------- markers & tracks on the globe ----------
  const trackPast = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffc56a, transparent: true, opacity: 0.95 }));
  const trackNext = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: 0xbfd8ff, dashSize: 60, gapSize: 50, transparent: true, opacity: 0.7 }));
  earth.add(trackPast, trackNext);
  const PAST_MAX = 4000;
  const pastBuf = new Float32Array(PAST_MAX * 3);
  trackPast.geometry.setAttribute('position', new THREE.BufferAttribute(pastBuf, 3));
  trackPast.geometry.setDrawRange(0, 0);
  trackPast.frustumCulled = false;
  trackNext.frustumCulled = false;
  let pastN = 0;
  const marker = (color: number, size: number) => {
    const m = new THREE.Mesh(new THREE.RingGeometry(size * 0.7, size, 40), new THREE.MeshBasicMaterial({ color, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.renderOrder = 3;
    return m;
  };
  const placeOn = (m: THREE.Object3D, lat: number, lon: number, lift = 6) => {
    const v = new THREE.Vector3(...P.geo(lat, lon));
    m.position.copy(v).multiplyScalar(P.RE + lift);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v);
  };
  const targetMk = marker(0xffd36a, 170);
  placeOn(targetMk, P.LANDING.lat, P.LANDING.lon);
  const predictMk = marker(0xff5a4a, 130);
  predictMk.visible = false;
  const baikonurMk = marker(0x9fd0ff, 110);
  placeOn(baikonurMk, P.BAIKONUR.lat, P.BAIKONUR.lon);
  earth.add(targetMk, predictMk, baikonurMk);
  targetMk.visible = baikonurMk.visible = false;
  let markersOn = false;
  let predictOn = false;
  const craftGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture(0.25), color: 0xffe8b0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: false }));
  craftGlow.scale.setScalar(0.018);
  craftGlow.visible = false;
  scene.add(craftGlow);
  // The descent module's own parachute (Gagarin came down separately under his).
  const chute = buildChute();
  chute.visible = false;
  scene.add(chute);
  let chuteK = 0; // 0 → 1 as the canopy opens
  // Re-entry: a white-hot shock cap ahead of the heat shield, a faint halo, and a long ionised
  // wake streaming behind, flickering and cooling from yellow-white through orange to violet.
  const plasma = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture(0.3), color: 0xffc08a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture(0.5), color: 0xff6a2a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  scene.add(plasma, halo);
  const wakeU = { uK: { value: 0 }, uTime: { value: 0 } };
  const wakeGeo = new THREE.CylinderGeometry(0.12, 1, 1, 24, 40, true).translate(0, 0.5, 0);
  const wake = new THREE.Mesh(
    wakeGeo,
    new THREE.ShaderMaterial({
      uniforms: wakeU,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_vertex>
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
          #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_fragment>
        uniform float uK, uTime; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        float h1(float n){ return fract(sin(n) * 43758.5453); }
        void main(){
          #include <logdepthbuf_fragment>
          float along = vUv.y;
          float rim = pow(abs(dot(normalize(vN), normalize(vV))), 1.4);   // soft edges, bright core
          float ripple = 0.65 + 0.35 * sin(along * 46.0 - uTime * 38.0 + vUv.x * 18.0)
                              * sin(along * 17.0 - uTime * 21.0);
          float flick = 0.85 + 0.15 * h1(floor(uTime * 30.0));
          float a = pow(1.0 - along, 3.0) * pow(rim, 2.0) * ripple * flick * uK;
          vec3 c = mix(vec3(1.0, 0.92, 0.78), vec3(1.0, 0.5, 0.16), smoothstep(0.0, 0.3, along));
          c = mix(c, vec3(0.62, 0.2, 0.42), smoothstep(0.35, 0.9, along));
          gl_FragColor = vec4(c * a * 0.75, 1.0);
        }`,
    }),
  );
  wake.frustumCulled = false;
  wake.visible = false;
  scene.add(wake);
  const ballMat = R7.ball.material as THREE.MeshStandardMaterial;
  let shieldHeat = 0; // the heat shield keeps glowing a while after the plasma fades

  // ---------- HUD ----------
  const hud = h('div', 'g-hud vk-hud', root);
  h('div', 'g-title', hud, L(lang, '东方一号 · 入轨', 'Vostok 1 · Into Orbit'));
  const toast = makeToast(hud);
  const left = h('div', 'vk-tele g-panel-sm', hud);
  const right = h('div', 'vk-orbit g-panel-sm', hud);
  const orbitCv = h('canvas', '', right) as HTMLCanvasElement;
  orbitCv.width = orbitCv.height = 220 * 2;
  const orbitTxt = h('div', 'vk-orbit-txt', right);
  const dial = h('canvas', 'vk-dial', hud) as HTMLCanvasElement;
  dial.width = dial.height = 200 * 2;
  const controls = h('div', 'vk-controls', hud);
  const btnDown = h('button', 'g-btn ghost vk-pitch', controls, L(lang, '◀ 压低', '◀ Pitch down')) as HTMLButtonElement;
  const btnAct = h('button', 'g-btn vk-act', controls, L(lang, '关机', 'Cut engine')) as HTMLButtonElement;
  const btnUp = h('button', 'g-btn ghost vk-pitch', controls, L(lang, '抬高 ▶', 'Pitch up ▶')) as HTMLButtonElement;
  const clock = h('div', 'vk-clock', hud);
  const coach = createCoach(hud, GAME_BY_ID.vostok, lang);
  let lastD = Infinity;
  const tag = h('div', 'vk-tag', hud);
  const style = h('style', '', hud);
  style.textContent = `
    .vk-tele { position: absolute; left: 20px; top: calc(max(16px, env(safe-area-inset-top)) + 84px); display: grid; grid-template-columns: auto auto; gap: 3px 14px; font-size: 12.5px; min-width: 200px; }
    .vk-tele b { color: #e8f1ff; font-variant-numeric: tabular-nums; text-align: right; font-weight: 600; }
    .vk-tele .warn { color: #ff8a6a; }
    .vk-tele .ok { color: #8ef0b0; }
    .vk-tele .stagebar { grid-column: 1 / -1; margin-top: 6px; font-size: 11px; letter-spacing: .08em; color: var(--accent); }
    .vk-orbit { position: absolute; right: 18px; top: calc(max(14px, env(safe-area-inset-top)) + 54px); padding: 8px; text-align: center; }
    .vk-orbit canvas { width: 220px; height: 220px; display: block; }
    .vk-orbit-txt { font-size: 12px; line-height: 1.6; font-variant-numeric: tabular-nums; }
    .vk-orbit-txt b { color: #e8f1ff; }
    .vk-orbit-txt .ok { color: #8ef0b0; } .vk-orbit-txt .warn { color: #ffb07a; }
    .vk-dial { position: absolute; left: 20px; bottom: max(22px, env(safe-area-inset-bottom)); width: 200px; height: 200px; }
    .vk-controls { position: absolute; left: 50%; bottom: max(22px, env(safe-area-inset-bottom)); transform: translateX(-50%); display: flex; gap: 10px; }
    .vk-pitch { min-width: 116px; touch-action: none; user-select: none; -webkit-user-select: none; }
    .vk-pitch.held { border-color: var(--accent); color: #fff; }
    .vk-act { min-width: 120px; }
    .vk-clock { position: absolute; left: 20px; top: calc(max(16px, env(safe-area-inset-top)) + 28px); font-size: 11.5px; color: var(--ink-2); letter-spacing: .06em; text-shadow: 0 1px 4px #000; font-variant-numeric: tabular-nums; pointer-events: none; }
    .vk-clock b { display: block; font-family: var(--serif); font-size: 22px; color: #fff; letter-spacing: .04em; }
    .vk-tag { position: absolute; left: 0; top: 0; pointer-events: none; font-size: 12px; color: #ffe6b0; white-space: nowrap; text-shadow: 0 1px 4px #000; transform: translate(-9999px, 0); }
    .vk-tag.target { color: #ffd36a; }
    @media (max-width: 760px) {
      .vk-orbit { top: auto; bottom: calc(max(22px, env(safe-area-inset-bottom)) + 60px); right: 10px; padding: 4px; }
      .vk-orbit canvas { width: 120px; height: 120px; }
      .vk-orbit-txt { font-size: 10.5px; }
      .vk-tele { font-size: 11px; min-width: 0; left: 12px; }
      .vk-dial { width: 120px; height: 120px; left: 10px; bottom: calc(max(22px, env(safe-area-inset-bottom)) + 60px); }
      .vk-clock { left: 12px; } .vk-tele { top: calc(max(16px, env(safe-area-inset-top)) + 150px); }
      .vk-pitch { min-width: 90px; } .vk-act { min-width: 84px; }
    }
    @media (max-width: 640px) {
      /* phones: coach under the clock, telemetry under the coach, one-line buttons above the corners' gauges */
      .vk-hud .g-coach { top: calc(max(14px, env(safe-area-inset-top)) + 66px); }
      .vk-tele { top: calc(max(16px, env(safe-area-inset-top)) + 178px); gap: 1px 10px; }
      .vk-controls { gap: 6px; width: calc(100vw - 24px); justify-content: center; }
      .vk-controls .g-btn { white-space: nowrap; font-size: 13px; padding: 10px 12px; }
      .vk-pitch, .vk-act { min-width: 0; flex: 1 1 0; }
      .vk-dial, .vk-orbit { bottom: calc(max(22px, env(safe-area-inset-bottom)) + 56px); }
      .vk-dial { width: 108px; height: 108px; }
      .vk-orbit canvas { width: 104px; height: 104px; }
    }`;

  // ---------- state ----------
  let phase: Phase = 'pad';
  let padT = ctx.reduced ? 2.2 : 4.2; // countdown
  const s: P.State = { x: 0, y: P.RE, vx: basis.freeSpeed, vy: 0, t: 0 };
  // The flight is solved in its orbital plane, so the share of the Earth's spin that runs across
  // that plane (~0.25 km/s at Baikonur) never reaches the rocket: drawn honestly, the pad would
  // slide out from under it within seconds of lift-off. For the first part of the climb the globe
  // is nudged by that amount, so pad, launch cloud and exhaust trail stay where the eye expects;
  // the nudge then freezes (a few km, invisible at globe scale).
  const HOLD_T = 50;
  const crossV = new THREE.Vector3(padUp.z, 0, -padUp.x).multiplyScalar(P.OMEGA * P.RE).dot(NRM);
  const holdAxis = new THREE.Vector3().crossVectors(padUp, NRM).normalize();
  const holdQ = new THREE.Quaternion();
  const spinQ = new THREE.Quaternion();
  const prevEarthQ = new THREE.Quaternion();
  const deltaQ = new THREE.Quaternion();
  const Yaxis = new THREE.Vector3(0, 1, 0);
  let stageIdx = 0;
  let stageT = 0;
  let pitch = 90;
  let engineOn = true;
  let maxQ = 0;
  let failure: '' | 'crash' | 'maxq' | 'suborbital' = '';
  let insertion: P.Elements | null = null;
  let boostersGone = false;
  let fairingGone = false;
  let coreGone = false;
  let retroAt = -1;
  let windowState: 'before' | 'in' | 'after' = 'before';
  let bestPredict = Infinity;
  let landing: { lat: number; lon: number } | null = null;
  let peakG = 0;
  let lastSpeed = 0;
  let ejected = false;
  let moduleGone = false;
  let shadowSaid = false;
  let sunriseSaid = false;
  let pacificSaid = false;
  let zoomT = 0; // seconds since orbit began, for the reveal shot
  let cine = 0; // booster-separation camera
  let ended = false;
  let predictTimer = 0;
  let predicted: { d: number; ll: { lat: number; lon: number } } | null = null;
  const held = { down: false, up: false };
  const engine = sfx.bed(220, 0.8);
  const rumble = sfx.bed(90, 0.6);

  const pos3 = new THREE.Vector3();
  const dir3 = new THREE.Vector3();
  const up3 = new THREE.Vector3();
  const hz3 = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const Y = new THREE.Vector3(0, 1, 0);
  const to3 = (x: number, y: number, out: THREE.Vector3) => out.copy(E1).multiplyScalar(x).addScaledVector(E2, y);

  // ---------- input ----------
  const onKey = (e: KeyboardEvent, down: boolean) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') held.down = down;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') held.up = down;
    else if (k === ' ' && down && !e.repeat) {
      e.preventDefault();
      act();
    } else return;
    e.preventDefault();
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);
  const hold = (btn: HTMLButtonElement, k: 'down' | 'up') => {
    const on = (e: PointerEvent) => {
      e.preventDefault();
      held[k] = true;
      btn.classList.add('held');
      btn.setPointerCapture(e.pointerId);
    };
    const off = () => {
      held[k] = false;
      btn.classList.remove('held');
    };
    btn.addEventListener('pointerdown', on);
    btn.addEventListener('pointerup', off);
    btn.addEventListener('pointercancel', off);
    btn.addEventListener('lostpointercapture', off);
  };
  hold(btnDown, 'down');
  hold(btnUp, 'up');
  btnAct.onclick = () => act();

  function act() {
    if (phase === 'ascent' && engineOn && stageIdx === 2) cutoff(false);
    else if (phase === 'orbit' && retroAt < 0) fireRetro();
  }

  function cutoff(auto: boolean) {
    engineOn = false;
    const el = P.elements(s);
    sfx.noise({ dur: 0.6, freq: 180, type: 'lowpass', gain: 0.5 });
    if (el.peri < 100) {
      failure = 'suborbital';
      toast(L(lang, '未能入轨', 'Orbit not reached'), auto ? L(lang, '燃料耗尽，近地点仍在大气层内', 'Propellant gone, perigee still inside the atmosphere') : L(lang, '关机过早，近地点仍在大气层内', 'Cut too early: perigee still inside the atmosphere'), 3600);
      setTimeout(() => finish(), 3200);
      return;
    }
    insertion = el;
    phase = 'orbit';
    // the spacecraft separates from the spent upper stage a few seconds after cut-off
    for (const c of R7.upper.children) if (c !== R7.capsule) c.visible = false;
    toast(L(lang, '入轨！', 'Orbit!'), `${L(lang, '近地点', 'Perigee')} ${el.peri.toFixed(0)} km · ${L(lang, '远地点', 'Apogee')} ${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'} km`, 3800);
    sfx.tone({ freq: 660, to: 990, dur: 0.6, gain: 0.12 });
    markersOn = true;
    btnAct.textContent = L(lang, '制动点火', 'Fire retro');
    btnDown.style.visibility = btnUp.style.visibility = 'hidden';
  }

  function fireRetro() {
    retroAt = s.t;
    const r = P.retro(s);
    s.vx = r.vx;
    s.vy = r.vy;
    phase = 'reentry';
    camInit = false; // cut straight from the orbit view to the capsule
    predictOn = true;
    toast(L(lang, '制动点火', 'Retro-fire'), L(lang, 'TDU-1 制动发动机工作约 40 秒', 'The TDU-1 retro-rocket burns for about 40 s'), 3000);
    sfx.noise({ dur: 2.2, freq: 260, type: 'lowpass', gain: 0.5, attack: 0.1 });
    btnAct.disabled = true;
    btnAct.style.visibility = 'hidden';
    lastSpeed = P.speed(s);
  }

  // Dev-only hook so scripted runs can fly the reference program (see scripts in the PR notes).
  if (import.meta.env.DEV)
    (window as unknown as Record<string, unknown>).__vostok = {
      state: () => ({ phase, t: s.t, stageIdx, peri: P.elements(s).peri, apo: P.elements(s).apo, windowState, d: predicted?.d ?? null }),
      setPitch: (p: number) => (pitch = p),
      sunLight,
      holdPad: () => (padT = 1e6),
      act,
    };

  // ---------- frame ----------
  stage.onFrame((dt, t) => {
    if (ended) return;
    // --- time warp ---
    let warp = 1;
    // real time for the last seconds of the burn, when every second adds ~40 km of apogee
    if (phase === 'ascent') warp = s.t < 25 ? 3 : stageIdx === 2 && P.elements(s).peri > 30 ? 1 : 8;
    else if (phase === 'orbit') warp = zoomT < 5 ? 10 : windowState === 'in' ? 10 : 95;
    // the fireball (≈ 90 → 45 km) runs slow enough to watch
    else if (phase === 'reentry') warp = chuteK > 0 ? 45 : P.alt(s) > 110 ? 60 : P.alt(s) > 92 ? 16 : P.alt(s) > 45 ? 5 : 12;
    if (phase === 'done') warp = 0;

    if (phase === 'pad') {
      padT -= dt;
      const n = Math.ceil(padT - 1.2);
      if (n >= 1 && n <= 3) setHtml(clock, `<b>${n}</b>${L(lang, '倒计时', 'Countdown')}`);
      if (padT <= 1.2 && padT + dt > 1.2) {
        toast('Поехали!', L(lang, '“我们出发了！”', '“Let’s go!”'), 2600);
        sfx.noise({ dur: 2.5, freq: 120, type: 'lowpass', gain: 0.9, attack: 0.3 });
      }
      if (padT <= 0) phase = 'ascent';
      for (const a of arms) a.rotation.z = padT < 1.2 ? Math.min(0.9, a.rotation.z + dt * 0.6) : 0.08;
    }

    // --- pitch control ---
    if (phase === 'ascent' && s.t > 6) pitch = clamp(pitch + ((held.up ? 1 : 0) - (held.down ? 1 : 0)) * 16 * dt, -15, 90);

    // --- integrate ---
    let simLeft = dt * warp;
    while (simLeft > 1e-6 && (phase === 'ascent' || phase === 'orbit' || phase === 'reentry')) {
      const h = P.alt(s);
      const maxStep = phase === 'ascent' ? 0.05 : P.coastDt(h);
      const d = Math.min(simLeft, maxStep);
      simLeft -= d;
      if (phase === 'ascent') {
        const S = P.STAGES[stageIdx];
        const a = engineOn ? P.stageAccel(S, stageT) : 0;
        P.step(s, d, a, pitch, P.DRAG_ROCKET);
        stageT += d;
        const q = P.qPressure(s);
        maxQ = Math.max(maxQ, q);
        if (q > 72 && !failure) {
          failure = 'maxq';
          toast(L(lang, '动压超限，箭体解体', 'Aerodynamic overload'), L(lang, '在稠密大气中压得太平、飞得太快', 'Too flat, too fast, too low in the thick air'), 4200);
          explode();
          return;
        }
        if (P.alt(s) < -0.002 && s.t > 3 && !failure) {
          failure = 'crash';
          toast(L(lang, '火箭坠地', 'The rocket came down'), L(lang, '俯仰压得太早太低', 'Pitched over too far, too soon'), 4200);
          explode();
          return;
        }
        if (stageT >= S.T) {
          if (stageIdx === 0) separateBoosters();
          else if (stageIdx === 1) separateCore();
          else {
            cutoff(true);
            break;
          }
          stageIdx++;
          stageT = 0;
        }
        if (stageIdx === 1 && !fairingGone && s.t >= 156) dropFairing();
      } else {
        P.step(s, d, 0, 0, phase === 'reentry' ? P.DRAG_CAPSULE : 0);
        if (phase === 'reentry') {
          const v = P.speed(s);
          peakG = Math.max(peakG, Math.abs(lastSpeed - v) / d / P.G0);
          lastSpeed = v;
          if (!ejected && P.alt(s) < 7) {
            ejected = true;
            toast(L(lang, '约 7 公里 · 弹射', 'About 7 km · ejection'), L(lang, '加加林弹射出舱，与返回舱分别伞降', 'Gagarin ejects and parachutes down separately from the capsule'), 3200);
          }
          if (!moduleGone && s.t - retroAt > 12) {
            // the instrument module is cut loose after the burn (on the real flight a cable
            // held on and set the pair tumbling for ten minutes)
            moduleGone = true;
            // drift away from the camera, so it never swallows the view
            const away = tmp.copy(pos3).sub(camera.position).normalize().addScaledVector(up3, -0.5).normalize();
            detach(R7.instrument, away, 0, new THREE.Vector3(0.8, 0, 0.5));
            debris[debris.length - 1].t = 8; // gone after ~6 s
            toast(L(lang, '仪器舱分离', 'Instrument module separates'), L(lang, '只剩球形返回舱迎着大气', 'Only the spherical descent module meets the air'), 2600);
          }
          if (ejected && chuteK === 0 && P.alt(s) < 4) {
            chuteK = 0.001;
            chute.visible = true;
            sfx.noise({ dur: 0.6, freq: 900, type: 'bandpass', gain: 0.25, attack: 0.02 });
          }
          if (chuteK > 0) {
            // under the canopy the capsule settles to ~8.5 m/s straight down
            const fr = P.frame(s);
            const k = 1 - Math.exp(-d / 5);
            s.vx += (-fr.ux * 0.0085 - s.vx) * k;
            s.vy += (-fr.uy * 0.0085 - s.vy) * k;
            lastSpeed = P.speed(s);
          }
          if (P.alt(s) <= 0) {
            landing = P.subPoint(s, basis);
            for (let i = 0; i < 10; i++) smoke.emit(pos3, up3, hz3, 0.002 + Math.random() * 0.002, 3, false, 0.004);
            sfx.noise({ dur: 0.5, freq: 200, type: 'lowpass', gain: 0.5, attack: 0.01 });
            phase = 'done';
            setTimeout(() => finish(), 2600);
            break;
          }
        }
      }
    }

    // --- 3-D placement ---
    prevEarthQ.copy(earth.quaternion);
    spinQ.setFromAxisAngle(Yaxis, P.OMEGA * s.t);
    holdQ.setFromAxisAngle(holdAxis, (-crossV * Math.min(s.t, HOLD_T)) / P.RE);
    earth.quaternion.multiplyQuaternions(holdQ, spinQ);
    to3(s.x, s.y, pos3);
    up3.copy(pos3).normalize();
    const f = P.frame(s);
    to3(f.hx, f.hy, hz3);
    const pr = THREE.MathUtils.degToRad(phase === 'ascent' || phase === 'pad' ? pitch : P.fpa(s));
    dir3.copy(hz3).multiplyScalar(Math.cos(pr)).addScaledVector(up3, Math.sin(pr)).normalize();
    if (phase === 'pad') pos3.copy(up3).multiplyScalar(P.RE);
    R7.root.position.copy(pos3);
    R7.root.quaternion.setFromUnitVectors(Y, dir3);
    // the rime sheds in the first minute of flight, from vibration and the slipstream
    R7.frost.opacity = 0.85 * (1 - THREE.MathUtils.smoothstep(Math.max(0, P.alt(s)), 0.3, 9));
    R7.frost.visible = R7.frost.opacity > 0.01;
    if (insertion) {
      // once only the capsule is left, centre it (not the old stack's base) on the craft position
      R7.root.updateMatrixWorld();
      R7.ball.getWorldPosition(tmp);
      R7.root.position.add(tmp.sub(pos3).negate());
    }

    const altKm = Math.max(0, P.alt(s));
    const nearPad = altKm < 4;
    if (nearPad) aimShadow();
    renderer.shadowMap.autoUpdate = nearPad;
    // engines & plumes: plumes swell as the air thins
    const thin = clamp(altKm / 60, 0, 1);
    const firing = phase === 'ascent' && engineOn;
    const flick = 0.92 + Math.sin(t * 60) * 0.05 + Math.random() * 0.05;
    for (const p of boosterPlumes) setPlume(p, firing && !boostersGone, (14 + thin * 30) * flick, 1 + thin * 2.4, t);
    setPlume(corePlume, firing && !coreGone, (14 + thin * 34) * flick, 1 + thin * 2.6, t);
    setPlume(upperPlume, firing && coreGone, (8 + 14 * thin) * flick, 1.6 + thin * 2, t);
    if (phase === 'pad' && padT < 1.4) {
      for (const p of [...boosterPlumes, corePlume]) setPlume(p, true, 6 + Math.random() * 3, 1.2, t);
      // ignition: exhaust slams into the flame trench and billows out sideways round the pad
      for (let i = perSec(200, dt); i > 0; i--) smoke.emit(pos3, up3, dir3, 0.02 + Math.random() * 0.025, 6, false, 0.035);
    }
    if (firing && altKm < 0.5) for (let i = perSec(220 * (1 - altKm * 1.6), dt); i > 0; i--) smoke.emit(tmp.copy(up3).multiplyScalar(P.RE + 0.004), up3, dir3, 0.025 + Math.random() * 0.03, 9, false, 0.06);
    if (firing && altKm < 28) {
      const n = perSec(altKm < 3 ? 180 : 110, dt);
      for (let i = 0; i < n; i++) smoke.emit(pos3, up3, dir3, altKm < 2 ? 0.03 : 0.012 + altKm * 0.001, altKm < 3 ? 9 : 16);
    }
    smoke.setSun(SUN, camera);
    smoke.setScale((stage.size.h * renderer.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))));
    // smoke hangs in the air, which turns with the (displayed) ground
    smoke.update(dt, deltaQ.copy(prevEarthQ).invert().premultiply(earth.quaternion));
    const engineLevel = firing ? (1 - thin * 0.85) * (coreGone ? 0.5 : 1) : phase === 'pad' && padT < 1.4 ? 0.6 : 0;
    launchLight.position.copy(pos3).addScaledVector(dir3, -0.012);
    launchLight.intensity = (firing || (phase === 'pad' && padT < 1.4) ? 1 : 0) * (1 - smoothstep(0.5, 6, altKm)) * 0.02 * flick;
    engine.set(engineLevel * 0.55, 160 + engineLevel * 200);
    rumble.set(phase === 'reentry' ? clamp(peakG / 9, 0, 1) * 0.4 * (altKm < 100 && altKm > 10 ? 1 : 0.1) : engineLevel * 0.4);

    animateDebris(dt);

    // --- sky & stars ---
    const camAlt = camera.position.length() - P.RE;
    const sunUp = clamp(up3.dot(SUN) * 3 + 0.4, 0, 1);
    sky.copy(SKY_HIGH).lerp(SKY_LOW, (1 - smoothstep(4, 70, camAlt)) * sunUp);
    earthUniforms.uHaze.value.copy(sky);
    earthUniforms.uCamAlt.value = camAlt;
    (stars.material as THREE.PointsMaterial).opacity = smoothstep(25, 90, camAlt) * 0.9;
    atmo.visible = camAlt > 40;

    // --- camera ---
    placeCamera(dt);

    // --- orbit-phase logic: window, prediction, narration ---
    if (phase === 'orbit') {
      zoomT += dt;
      const sub = P.subPoint(s, basis);
      if (!pacificSaid && sub.lon > 150) {
        pacificSaid = true;
        toast(L(lang, '飞越太平洋', 'Over the Pacific'), L(lang, '由北向南，飞向南半球', 'Heading south across the ocean'), 2600);
      }
      const inSun = up3.dot(SUN) > -0.05;
      if (!shadowSaid && !inSun) {
        shadowSaid = true;
        toast(L(lang, '进入地球阴影', 'Into the Earth’s shadow'), '', 2400);
      } else if (shadowSaid && !sunriseSaid && inSun) {
        sunriseSaid = true;
        toast(L(lang, '日出', 'Sunrise'), L(lang, '飞船驶出地影，越过南大西洋', 'Out of the shadow, over the South Atlantic'), 2400);
      }
      predictTimer -= dt;
      if (predictTimer <= 0) {
        predictTimer = windowState === 'in' ? 0.05 : 0.3;
        const g = P.propagateToGround(P.retro(s), P.DRAG_CAPSULE);
        if (g.landed) {
          const ll = P.subPoint(g.s, basis);
          predicted = { d: P.gcDist(ll, P.LANDING), ll };
        } else predicted = null;
        const d = predicted?.d ?? Infinity;
        if (windowState === 'before' && d < 2600 && s.t > 3000) {
          windowState = 'in';
          toast(L(lang, '进入制动窗口', 'Retro-fire window'), L(lang, '飞船正越过非洲西海岸 · 看准时机点火', 'Over the west coast of Africa · time the burn'), 3000);
          sfx.tone({ freq: 880, dur: 0.25, gain: 0.1 });
          setTimeout(() => sfx.tone({ freq: 880, dur: 0.25, gain: 0.1 }), 300);
        } else if (windowState === 'in') {
          bestPredict = Math.min(bestPredict, d);
          if (d > bestPredict + 1600 && d > 2600) {
            windowState = 'after';
            toast(L(lang, '错过制动窗口', 'Window missed'), L(lang, '飞船只能靠大气阻力慢慢降轨', 'Now only drag can bring the capsule down'), 3400);
            phase = 'done';
            setTimeout(() => finish(), 3000);
          }
        }
      }
      predictOn = windowState === 'in' && !!predicted;
      if (predicted) placeOn(predictMk, predicted.ll.lat, predicted.ll.lon, 8);
    }
    if (phase === 'reentry' || phase === 'done') {
      if (!landing) {
        predictTimer -= dt;
        if (predictTimer <= 0) {
          predictTimer = 0.5;
          const g = P.propagateToGround(s, P.DRAG_CAPSULE);
          if (g.landed) placeOn(predictMk, ...latlon(P.subPoint(g.s, basis)), 8);
        }
      }
    }

    // --- tracks ---
    if ((phase === 'orbit' || phase === 'reentry' || phase === 'ascent') && Math.floor(s.t / 20) !== Math.floor((s.t - dt * warp) / 20)) {
      const ef = new THREE.Vector3(...P.toEarthFixed([pos3.x, pos3.y, pos3.z], s.t)).normalize().multiplyScalar(P.RE + 6);
      if (pastN < PAST_MAX) {
        pastBuf.set([ef.x, ef.y, ef.z], pastN * 3);
        pastN++;
        trackPast.geometry.setDrawRange(0, pastN);
        trackPast.geometry.attributes.position.needsUpdate = true;
      }
    }
    if (phase === 'orbit' && Math.floor(t * 2) !== Math.floor((t - dt) * 2)) {
      const c = { ...s };
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k < 120; k++) {
        for (let j = 0; j < 6; j++) P.step(c, 5, 0, 0, 0);
        const v = P.toEarthFixed(P.toInertial(c, basis), c.t);
        pts.push(new THREE.Vector3(...v).normalize().multiplyScalar(P.RE + 6));
      }
      trackNext.geometry.setFromPoints(pts);
      trackNext.computeLineDistances();
    }
    trackNext.visible = phase === 'orbit';
    craftGlow.visible = phase === 'orbit' || (phase === 'reentry' && camera.position.distanceTo(pos3) > 50);
    craftGlow.position.copy(pos3);
    const glowK = phase === 'reentry' && altKm < 100 && altKm > 15 ? clamp((P.speed(s) - 1.5) / 5, 0, 1) * smoothstep(100, 78, altKm) : 0;
    const fl = 0.8 + Math.random() * 0.2;
    plasma.position.copy(pos3).addScaledVector(dir3, 0.0016);
    (plasma.material as THREE.SpriteMaterial).opacity = glowK * fl;
    plasma.scale.setScalar(0.0022 + glowK * 0.0026);
    halo.position.copy(pos3);
    (halo.material as THREE.SpriteMaterial).opacity = glowK * 0.3 * fl;
    halo.scale.setScalar(0.005 + glowK * 0.008);
    wake.visible = glowK > 0.01;
    if (wake.visible) {
      wake.position.copy(pos3).addScaledVector(dir3, 0.0008);
      wake.quaternion.setFromUnitVectors(Y, tmp.copy(dir3).negate());
      const r = 0.0011 + glowK * 0.0004;
      wake.scale.set(r, 0.025 + glowK * 0.06, r);
      wakeU.uK.value = glowK;
      wakeU.uTime.value = t;
    }
    shieldHeat = Math.max(glowK, shieldHeat - dt * 0.12);
    ballMat.emissive.setRGB(1.0, 0.38, 0.1).multiplyScalar(shieldHeat * 1.4);
    if (chuteK > 0) {
      chuteK = Math.min(1, chuteK + dt * 0.7);
      const open = 1 - Math.pow(1 - chuteK, 3);
      chute.position.copy(pos3);
      chute.quaternion.setFromUnitVectors(Y, up3);
      chute.scale.set(0.25 + 0.75 * open, 0.5 + 0.5 * open, 0.25 + 0.75 * open);
    }
    // the globe overlays are drawn at map scale; from close to the ground they are just huge bands
    const overlays = camAlt > 400;
    trackPast.visible = overlays;
    targetMk.visible = baikonurMk.visible = markersOn && overlays;
    predictMk.visible = predictOn && overlays;

    // --- HUD ---
    updateHud();
    updateTags();
  });

  const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;
  function smoothstep(a: number, b: number, x: number) {
    const k = clamp((x - a) / (b - a), 0, 1);
    return k * k * (3 - 2 * k);
  }

  /** Camera offset from the craft (smoothed), and the look target. */
  const camOff = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  let camInit = false;
  const sunH = new THREE.Vector3();
  const side = new THREE.Vector3();
  const SIDE_LIGHT = THREE.MathUtils.degToRad(68);
  function placeCamera(dt: number) {
    const altKm = Math.max(0, P.alt(s));
    let smooth = true;
    if (phase === 'pad' || phase === 'ascent' || (phase === 'done' && !insertion && !landing)) {
      const D = clamp(0.085 + altKm * 0.002, 0.085, 0.22);
      if (cine > 0) {
        cine -= dt;
        // ahead and above, looking back down the stack: the four boosters peel away as a cross
        // against the Earth below
        tmp.copy(dir3).multiplyScalar(0.11).addScaledVector(up3, 0.07).addScaledVector(NRM, 0.025);
      } else {
        // near the ground "behind the rocket" is underground: blend from a raised side view
        const low = 1 - smoothstep(0.2, 2, altKm);
        // On the pad, swing round so the morning Sun rakes in from the side: straight from behind
        // the camera it flattens everything and hides every shadow behind its own mast.
        sunH.copy(SUN).addScaledVector(up3, -SUN.dot(up3)).normalize();
        const swing = SIDE_LIGHT * low * (hz3.dot(sunH) > 0 ? -1 : 1);
        side.copy(NRM).multiplyScalar(Math.cos(swing)).addScaledVector(hz3, Math.sin(swing));
        tmp.copy(side).multiplyScalar(D).addScaledVector(dir3, -D * 0.25 * (1 - low)).addScaledVector(up3, lerpN(-D * 0.08, D * 0.18, low));
      }
      // after lift-off, aim a little lower so the exhaust column and the launch cloud stay in shot
      const lift = phase === 'ascent' ? smoothstep(0, 0.05, altKm) * (1 - smoothstep(1, 4, altKm)) : 0;
      tmp2.copy(pos3).addScaledVector(dir3, 0.012 * clamp(1 - altKm / 3, 0, 1) - 0.016 * lift);
      camera.up.copy(up3);
    } else if (phase === 'orbit' || (phase === 'done' && insertion && !landing && retroAt < 0)) {
      // reveal: pull out from the capsule to see the whole Earth, then ride along the ground track
      const k = smoothstep(0, 6, zoomT);
      const far = tmp.copy(pos3).normalize().multiplyScalar(P.RE * 2.75).addScaledVector(NRM, P.RE * 0.9).sub(pos3);
      const near = tmp2.copy(NRM).multiplyScalar(0.03).addScaledVector(up3, 0.006).addScaledVector(dir3, -0.01);
      tmp.lerpVectors(near, far, Math.pow(k, 2.4));
      tmp2.copy(pos3).multiplyScalar(1 - k * 0.85);
      camera.up.copy(up3).lerp(Y, k).normalize();
      smooth = false;
    } else {
      // re-entry: back in close behind the capsule
      const D = 0.022;
      if (ejected || (phase === 'reentry' && P.speed(s) < 1.2) || (phase === 'done' && landing)) {
        // once the fireball is over, and under the canopy: a side view with the steppe below
        tmp.copy(NRM).multiplyScalar(0.07).addScaledVector(hz3, -0.03).addScaledVector(up3, 0.004);
        tmp2.copy(pos3).addScaledVector(up3, 0.016);
      } else {
        tmp.copy(NRM).multiplyScalar(D).addScaledVector(dir3, -D * 1.4).addScaledVector(up3, D * 0.5);
        tmp2.copy(pos3);
      }
      camera.up.copy(up3);
    }
    if (!camInit || !smooth) camOff.copy(tmp);
    else camOff.lerp(tmp, 1 - Math.exp(-dt * 3));
    camInit = true;
    camLook.copy(tmp2);
    camera.position.copy(pos3).add(camOff);
    camera.lookAt(camLook);
    const camAlt = camera.position.length() - P.RE;
    camera.near = camAlt > 2000 ? 5 : 0.0005;
    camera.updateProjectionMatrix();
    skyDome.position.copy(camera.position);
    skyDome.scale.setScalar(Math.max(1, camera.near * 50));
    skyU.uUp.value.copy(camera.position).normalize();
    skyU.uAlt.value = Math.max(0, camAlt);
    skyU.uDip.value = Math.acos(clamp(P.RE / (P.RE + Math.max(0, camAlt)), 0, 1)) * 0.9;
  }

  // ---------- staging / debris ----------
  type Debris = { obj: THREE.Object3D; rel: THREE.Vector3; vel: THREE.Vector3; spin: THREE.Vector3; t: number };
  const debris: Debris[] = [];
  function detach(obj: THREE.Object3D, outward: THREE.Vector3, back: number, spin: THREE.Vector3) {
    // keep its current world transform, then fly it in the rocket's frame
    obj.updateMatrixWorld();
    const wp = new THREE.Vector3();
    const wq = new THREE.Quaternion();
    obj.getWorldPosition(wp);
    obj.getWorldQuaternion(wq);
    obj.removeFromParent();
    scene.add(obj);
    obj.position.copy(wp);
    obj.quaternion.copy(wq);
    obj.scale.setScalar(0.001);
    const rel = wp.clone().sub(R7.root.position);
    debris.push({ obj, rel, vel: outward.clone().multiplyScalar(0.012).addScaledVector(dir3, -back), spin, t: 0 });
  }
  function animateDebris(dt: number) {
    for (const d of debris) {
      d.t += dt;
      d.vel.addScaledVector(dir3, -0.004 * dt * (phase === 'ascent' ? 8 : 1));
      d.rel.addScaledVector(d.vel, dt);
      d.obj.position.copy(R7.root.position).add(d.rel);
      d.obj.rotateX(d.spin.x * dt);
      d.obj.rotateZ(d.spin.z * dt);
      if (d.t > 14) d.obj.visible = false;
    }
  }
  function separateBoosters() {
    boostersGone = true;
    cine = ctx.reduced ? 0 : 3.2;
    toast(L(lang, '助推器分离', 'Booster separation'), L(lang, '四台助推器向外散开——“科罗廖夫十字”', 'The four boosters fall away — the “Korolev cross”'), 3200);
    sfx.noise({ dur: 0.8, freq: 300, type: 'lowpass', gain: 0.6 });
    R7.boosters.forEach((b, i) => {
      const ang = (i / 4) * Math.PI * 2;
      const out = new THREE.Vector3(Math.cos(ang), 0, Math.sin(ang)).applyQuaternion(R7.root.quaternion);
      detach(b, out, 0.002, new THREE.Vector3(0, 0, (i % 2 ? 1 : -1) * 0.6));
    });
  }
  function dropFairing() {
    fairingGone = true;
    toast(L(lang, '整流罩抛离', 'Fairing jettisoned'), L(lang, '球形的东方号返回舱露了出来', 'The spherical Vostok capsule is uncovered'), 2400);
    R7.fairing.forEach((f, i) => {
      const out = new THREE.Vector3(i ? 1 : -1, 0, 0).applyQuaternion(R7.root.quaternion);
      detach(f, out, 0.001, new THREE.Vector3(0, 0, i ? 1.2 : -1.2));
    });
  }
  function separateCore() {
    coreGone = true;
    toast(L(lang, '芯级分离 · 末级点火', 'Core stage away · upper stage ignites'), L(lang, '最后一级：现在由你决定何时关机', 'Last stage: you decide when to cut the engine'), 3200);
    sfx.noise({ dur: 0.6, freq: 260, type: 'lowpass', gain: 0.5 });
    detach(R7.core, new THREE.Vector3(), 0.003, new THREE.Vector3(0.15, 0, 0.1));
    upperPlume.visible = true;
  }
  function explode() {
    phase = 'done';
    engine.set(0);
    sfx.noise({ dur: 2.4, freq: 100, type: 'lowpass', gain: 1, attack: 0.01 });
    for (let i = 0; i < 80; i++) smoke.emit(pos3, up3, dir3, 0.04 + Math.random() * 0.05, 6, true);
    R7.root.visible = false;
    setTimeout(() => finish(), 3200);
  }

  // ---------- HUD ----------
  const dctx = dial.getContext('2d')!;
  const octx = orbitCv.getContext('2d')!;
  function updateHud() {
    const el = P.elements(s);
    const altKm = P.alt(s);
    const utc = LAUNCH_UTC_MIN + s.t / 60;
    const hh = Math.floor(utc / 60) % 24;
    const mm = Math.floor(utc % 60);
    const msk = (hh + 3) % 24;
    const tt = Math.max(0, s.t);
    const tPlus = `T+${String(Math.floor(tt / 3600)).padStart(1, '0')}:${String(Math.floor((tt % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(tt % 60)).padStart(2, '0')}`;
    if (phase !== 'pad') setHtml(clock, `<b>${tPlus}</b>${L(lang, '莫斯科时间', 'Moscow time')} ${String(msk).padStart(2, '0')}:${String(mm).padStart(2, '0')}`);
    const q = P.qPressure(s);
    const stageName = phase === 'ascent' ? [L(lang, '一级 · 助推器＋芯级', 'Stage 1 · boosters + core'), L(lang, '二级 · 芯级', 'Stage 2 · core'), L(lang, '三级 · 末级', 'Stage 3 · upper stage')][stageIdx] : phase === 'orbit' ? L(lang, '轨道飞行', 'In orbit') : phase === 'reentry' ? L(lang, '返回', 'Re-entry') : '';
    const rows = [
      [L(lang, '高度', 'Altitude'), `${altKm.toFixed(altKm < 10 ? 2 : 0)} km`],
      [L(lang, '速度', 'Speed'), `${P.speed(s).toFixed(2)} km/s`],
      [L(lang, '航迹角', 'Flight path'), `${P.fpa(s).toFixed(1)}°`],
      ...(phase === 'ascent' || phase === 'pad' ? [[L(lang, '俯仰角', 'Pitch'), `${pitch.toFixed(0)}°`], [L(lang, '动压', 'Dyn. pressure'), `<span class="${q > 50 ? 'warn' : ''}">${q.toFixed(0)} kPa</span>`]] : []),
      ...(phase === 'reentry' ? [[L(lang, '过载', 'Load'), `${peakG.toFixed(1)} g`]] : []),
    ];
    setHtml(left, rows.map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join('') + `<span class="stagebar">${stageName}</span>`);
    const periOk = el.peri >= TARGET_PERI;
    const apoOk = el.apo <= TARGET_APO;
    let txt = `${L(lang, '近地点', 'Perigee')} <b class="${periOk ? 'ok' : 'warn'}">${el.peri < -999 ? '—' : el.peri.toFixed(0)}</b> km · ${L(lang, '远地点', 'Apogee')} <b class="${apoOk && el.apo > 0 ? 'ok' : 'warn'}">${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'}</b> km`;
    if (phase === 'ascent') txt += `<br>${L(lang, `目标：近地点 ≥ ${TARGET_PERI} · 远地点 ≤ ${TARGET_APO}`, `Target: perigee ≥ ${TARGET_PERI} · apogee ≤ ${TARGET_APO}`)}`;
    if (phase === 'orbit' && windowState === 'in' && predicted) txt = `${L(lang, '预计落点距目标', 'Predicted landing from target')}<br><b class="${predicted.d < 150 ? 'ok' : 'warn'}" style="font-size:20px">${predicted.d.toFixed(0)} km</b>`;
    else if (phase === 'orbit') txt += `<br>${L(lang, '等待制动窗口……', 'Waiting for the retro window…')}`;
    setHtml(orbitTxt, txt);
    right.style.display = phase === 'pad' ? 'none' : '';
    btnAct.disabled = !((phase === 'ascent' && engineOn && stageIdx === 2) || (phase === 'orbit' && windowState === 'in'));
    dial.style.display = phase === 'ascent' || phase === 'pad' ? '' : 'none';
    controls.style.display = phase === 'done' ? 'none' : '';
    drawDial();
    drawOrbit(el);
    updateCoach(el, q);
  }

  /** One instruction at a time, from what the flight needs right now. */
  function updateCoach(el: P.Elements, q: number) {
    let pulse = false;
    const err = pitch - guidePitch(s.t);
    /** Shows a steering instruction if one is needed; returns whether it did. */
    const steer = () => {
      if (q > 52) coach.say(L(lang, '动压太高 — 抬头！<small>稠密大气中飞得太平太快</small>', 'Too fast in thick air — pitch up!<small>Hold → until the warning clears</small>'), 'warn', '→');
      else if (err > 5) coach.say(L(lang, '按住 ← 压低机头<small>让白针贴住金针</small>', 'Hold ← to lean over<small>Put the white needle on the gold one</small>'), 'do', '←');
      else if (err < -5) coach.say(L(lang, '压得太低了 — 按住 → 抬头', 'Too flat — hold → to pitch up'), 'warn', '→');
      else return false;
      return true;
    };
    if (ended || phase === 'done') coach.say(landing ? L(lang, '着陆！', 'Touchdown!') : '', 'good');
    else if (phase === 'pad') {
      coach.step(0);
      coach.say(L(lang, '准备点火……<small>升空后跟住金色参考针</small>', 'Ignition…<small>After lift-off, follow the gold needle</small>'), 'wait');
    } else if (phase === 'ascent' && stageIdx < 2) {
      coach.step(0);
      if (s.t < 9) coach.say(L(lang, '垂直爬升中……<small>马上开始压低</small>', 'Climbing straight up…<small>Get ready to lean over</small>'), 'wait');
      else if (!steer()) coach.say(L(lang, '正在金线上 ✓<small>保持白针贴住金针</small>', 'On the gold line ✓<small>Keep the white needle on the gold one</small>'), 'good');
    } else if (phase === 'ascent') {
      coach.step(1);
      if (el.apo > TARGET_APO && el.peri >= 100) {
        coach.say(L(lang, '立刻关机！轨道越来越高', 'Cut now — the orbit is getting too high!'), 'warn', L(lang, '空格', 'Space'));
        pulse = true;
      } else if (el.peri >= TARGET_PERI) {
        coach.say(L(lang, '轨道变绿了 — 关机！', 'Orbit is green — cut the engine!'), 'do', L(lang, '空格', 'Space'));
        pulse = true;
      } else if (!(Math.abs(err) > 8 && steer())) {
        const k = Math.max(0, Math.round(el.peri));
        coach.say(L(lang, `继续加速…… 近地点 ${k} / ${TARGET_PERI} km<small>右侧圆圈变绿时关机</small>`, `Keep burning… perigee ${k} / ${TARGET_PERI} km<small>Cut when the ring on the right turns green</small>`), 'wait');
      }
    } else if (phase === 'orbit') {
      coach.step(2);
      const d = predicted?.d ?? Infinity;
      if (windowState !== 'in') coach.say(L(lang, '入轨成功 ✓ 加速飞向非洲……<small>到达制动窗口时会提醒你</small>', 'In orbit ✓ Speeding on toward Africa…<small>You’ll be told when the window opens</small>'), 'wait');
      else if (d < 160) {
        coach.say(L(lang, `就是现在 — 制动点火！<small>落点距目标 ${d.toFixed(0)} km</small>`, `Fire now!<small>Landing ${d.toFixed(0)} km from the target</small>`), 'do', L(lang, '空格', 'Space'));
        pulse = true;
      } else if (d > lastD + 2 && d < 1200)
        coach.say(L(lang, `红点在远离 — 快点火！<small>${d.toFixed(0)} km</small>`, `The red mark is moving away — fire!<small>${d.toFixed(0)} km</small>`), 'warn', L(lang, '空格', 'Space'));
      else coach.say(L(lang, `红点正在靠近金色目标…… ${d.toFixed(0)} km<small>落到金圈上时点火</small>`, `Red mark closing on the gold target… ${d.toFixed(0)} km<small>Fire when it’s on the gold ring</small>`), 'wait', L(lang, '空格', 'Space'));
      if (Number.isFinite(d)) lastD = d;
    } else if (phase === 'reentry') {
      coach.step(3);
      coach.say(chuteK > 0 ? L(lang, '主伞张开 ✓', 'Parachute open ✓') : L(lang, '再入大气 — 无需操作', 'Re-entry — hands off'), 'good');
    }
    btnAct.classList.toggle('g-pulse', pulse);
    const wantDown = phase === 'ascent' && s.t >= 9 && err > 5 && q <= 52;
    const wantUp = phase === 'ascent' && (err < -5 || q > 52);
    btnDown.classList.toggle('g-pulse', wantDown && !held.down);
    btnUp.classList.toggle('g-pulse', wantUp && !held.up);
  }

  function drawDial() {
    const W = dial.width;
    const c = dctx;
    c.clearRect(0, 0, W, W);
    const cx = W / 2;
    const r = W * 0.42;
    c.fillStyle = 'rgba(8,10,16,.55)';
    c.beginPath();
    c.arc(cx, cx, r + 10, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.18)';
    c.lineWidth = 2;
    c.beginPath();
    c.arc(cx, cx, r, Math.PI, 0);
    c.stroke();
    // horizon
    c.strokeStyle = 'rgba(140,190,255,.6)';
    c.beginPath();
    c.moveTo(cx - r - 6, cx);
    c.lineTo(cx + r + 6, cx);
    c.stroke();
    const arrow = (deg: number, color: string, w: number, len: number) => {
      const a = THREE.MathUtils.degToRad(deg);
      c.strokeStyle = color;
      c.lineWidth = w;
      c.lineCap = 'round';
      c.beginPath();
      c.moveTo(cx, cx);
      c.lineTo(cx + Math.cos(a) * len, cx - Math.sin(a) * len);
      c.stroke();
    };
    if (phase === 'ascent') {
      // a gold wedge: the band around the guide that counts as "on the line"
      const gp = THREE.MathUtils.degToRad(guidePitch(s.t));
      c.fillStyle = 'rgba(255,211,106,.22)';
      c.beginPath();
      c.moveTo(cx, cx);
      c.arc(cx, cx, r, -gp - 0.09, -gp + 0.09);
      c.closePath();
      c.fill();
      arrow(guidePitch(s.t), '#ffd36a', 9, r * 0.98);
    }
    arrow(pitch, '#ffffff', 6, r * 0.86);
    c.fillStyle = '#fff';
    c.font = `${W * 0.085}px Inter, sans-serif`;
    c.textAlign = 'center';
    c.fillText(`${pitch.toFixed(0)}°`, cx, cx + r * 0.42);
    c.font = `600 ${W * 0.055}px Inter, sans-serif`;
    c.fillStyle = '#ffd36a';
    c.fillText(L(lang, '■ 金：目标', '■ gold: aim here'), cx, cx + r * 0.66);
    c.fillStyle = '#fff';
    c.fillText(L(lang, '■ 白：你', '■ white: you'), cx, cx + r * 0.82);
    c.fillStyle = 'rgba(255,255,255,.55)';
    c.font = `${W * 0.05}px Inter, sans-serif`;
    c.fillText('90°', cx, cx - r - 4);
    c.textAlign = 'left';
    c.fillText('0°', cx + r + 2, cx - 6);
  }

  function drawOrbit(el: P.Elements) {
    const W = orbitCv.width;
    const c = octx;
    c.clearRect(0, 0, W, W);
    const cx = W / 2;
    const Rd = W * 0.24; // Earth radius on the diagram
    const k = (W * 0.22) / 400; // px per km of altitude (exaggerated)
    const rd = (r: number) => Rd + Math.max(-Rd, (r - P.RE) * k);
    // the diagram's "up" is the launch site
    const toXY = (ang: number, r: number) => [cx + Math.sin(ang) * rd(r), cx - Math.cos(ang) * rd(r)];
    // target band
    c.fillStyle = 'rgba(142,240,176,.12)';
    c.beginPath();
    c.arc(cx, cx, rd(P.RE + TARGET_APO), 0, Math.PI * 2);
    c.arc(cx, cx, rd(P.RE + TARGET_PERI), 0, Math.PI * 2, true);
    c.fill();
    // Earth
    const g = c.createRadialGradient(cx - Rd * 0.3, cx - Rd * 0.3, Rd * 0.1, cx, cx, Rd);
    g.addColorStop(0, '#3d6fae');
    g.addColorStop(1, '#16304f');
    c.fillStyle = g;
    c.beginPath();
    c.arc(cx, cx, Rd, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(120,180,255,.5)';
    c.lineWidth = 3;
    c.beginPath();
    c.arc(cx, cx, rd(P.RE + 100), 0, Math.PI * 2);
    c.setLineDash([6, 8]);
    c.stroke();
    c.setLineDash([]);
    // predicted orbit / trajectory: sample the conic
    const r0 = Math.hypot(s.x, s.y);
    const th0 = P.downrangeAngle(s);
    if (el.e < 0.999 && el.hmom !== 0) {
      const p = (el.hmom * el.hmom) / P.MU;
      // true anomaly of the craft now
      const rv = (s.x * s.vx + s.y * s.vy) / r0;
      const nu0 = Math.atan2((rv * Math.abs(el.hmom)) / P.MU, p / r0 - 1);
      const dirSign = el.hmom < 0 ? 1 : -1; // hmom < 0: moving toward +downrange angle
      c.strokeStyle = '#ffd36a';
      c.lineWidth = 3.5;
      c.beginPath();
      for (let i = 0; i <= 200; i++) {
        const dnu = (i / 200) * Math.PI * 2;
        const r = p / (1 + el.e * Math.cos(nu0 + dnu));
        if (r < P.RE - 50) break;
        const [x, y] = toXY(th0 + dirSign * dnu, Math.min(r, P.RE + 900));
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
    }
    const [px, py] = toXY(th0, r0);
    c.fillStyle = '#fff';
    c.beginPath();
    c.arc(px, py, 6, 0, Math.PI * 2);
    c.fill();
  }

  const tagV = new THREE.Vector3();
  function updateTags() {
    if ((phase !== 'orbit' && phase !== 'reentry') || !targetMk.visible) {
      tag.style.transform = 'translate(-9999px,0)';
      return;
    }
    targetMk.getWorldPosition(tagV);
    const visible = tagV.clone().sub(camera.position).dot(tagV) < 0;
    tagV.project(camera);
    tag.className = 'vk-tag target';
    tag.textContent = L(lang, '◎ 目标：斯梅洛夫卡（萨拉托夫州）', '◎ Target: Smelovka (Saratov)');
    tag.style.transform = visible ? `translate(${((tagV.x + 1) / 2) * stage.size.w + 12}px, ${((1 - tagV.y) / 2) * stage.size.h - 8}px)` : 'translate(-9999px,0)';
  }

  // ---------- result ----------
  function finish() {
    if (ended) return;
    ended = true;
    engine.set(0);
    rumble.set(0);
    const lines: GameResult['lines'] = [];
    let ascentScore = 0;
    let landScore = 0;
    if (failure === 'crash' || failure === 'maxq') {
      lines.push({ zh: failure === 'crash' ? '上升段失败：俯仰压得太早，火箭坠地' : '上升段失败：在稠密大气中速度过快，动压超限', en: failure === 'crash' ? 'Ascent failed: pitched over too far, too soon' : 'Ascent failed: too fast in the thick lower air' });
      lines.push({ zh: '诀窍：先垂直爬升，离开稠密大气后再逐渐压平', en: 'Tip: climb steeply first, then lean over gradually once out of the thick air' });
    } else if (failure === 'suborbital' || !insertion) {
      const el = P.elements(s);
      lines.push({ zh: `未能入轨：近地点 ${el.peri.toFixed(0)} km，仍在大气层内`, en: `No orbit: perigee ${el.peri.toFixed(0)} km, still inside the atmosphere` });
      lines.push({ zh: '诀窍：上升到约 200 公里后把俯仰压到接近水平，用推力换速度', en: 'Tip: by ~200 km, hold the nose near the horizon and turn thrust into speed' });
      ascentScore = 5;
    } else {
      const el = insertion;
      ascentScore = 50;
      if (el.peri < TARGET_PERI) ascentScore -= (TARGET_PERI - el.peri) * 0.6;
      if (el.apo > TARGET_APO) ascentScore -= Math.min(30, (el.apo - TARGET_APO) * 0.06);
      ascentScore = clamp(ascentScore, 10, 50);
      lines.push({ zh: `入轨：近地点 ${el.peri.toFixed(0)} km · 远地点 ${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'} km（史实约 169 × 327）`, en: `Orbit: ${el.peri.toFixed(0)} × ${Number.isFinite(el.apo) ? el.apo.toFixed(0) : '∞'} km (the real one: about 169 × 327)` });
      if (el.apo > 500) lines.push({ zh: '轨道偏高：若制动火箭失灵，飞船要很久才会自然坠落', en: 'High orbit: if the retro-rocket failed, natural decay would take a long time' });
      if (landing) {
        const d = P.gcDist(landing, P.LANDING);
        landScore = Math.round(50 * clamp(1 - (d - 40) / 1400, 0, 1));
        lines.push({ zh: `落点距斯梅洛夫卡 ${d.toFixed(0)} km · 最大过载 ${peakG.toFixed(1)} g`, en: `Landed ${d.toFixed(0)} km from Smelovka · peak load ${peakG.toFixed(1)} g` });
        if (retroAt > 0) lines.push({ zh: `制动点火于 T+${(retroAt / 60).toFixed(1)} 分（史实约 T+78 分，安哥拉外海上空）`, en: `Retro-fire at T+${(retroAt / 60).toFixed(1)} min (historically about T+78 min, off Angola)` });
      } else lines.push({ zh: '错过了制动窗口', en: 'The retro-fire window was missed' });
    }
    const score = Math.round(ascentScore + landScore);
    const stars = (score >= 85 ? 3 : score >= 60 ? 2 : score >= 30 ? 1 : 0) as GameResult['stars'];
    const headline = landing
      ? score >= 85
        ? { zh: '“我很好，感觉良好”', en: 'Home in 108 minutes' }
        : { zh: '平安着陆', en: 'Safely down' }
      : insertion
        ? { zh: '滞留轨道', en: 'Stranded in orbit' }
        : { zh: '发射失败', en: 'Launch failure' };
    ctx.end({ score, stars, headline, lines });
  }

  return {
    dispose() {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      engine.stop();
      rumble.stop();
      sfx.dispose();
      stage.dispose();
      hud.remove();
    },
  };
};

// ---------- helpers ----------

const latlon = (p: { lat: number; lon: number }) => [p.lat, p.lon] as [number, number];

const htmlCache = new WeakMap<HTMLElement, string>();
function setHtml(el: HTMLElement, html: string) {
  if (htmlCache.get(el) === html) return;
  htmlCache.set(el, html);
  el.innerHTML = html;
}

/** A polar grid of the sphere around (lat, lon), dense at the centre, for the launch area. */
function patchGeometry(lat: number, lon: number, maxAng: number, rings: number, segs: number) {
  const c = new THREE.Vector3(...P.geo(lat, lon));
  const la = THREE.MathUtils.degToRad(lat);
  const lo = THREE.MathUtils.degToRad(lon);
  const n = new THREE.Vector3(-Math.sin(la) * Math.cos(lo), Math.cos(la), Math.sin(la) * Math.sin(lo));
  const e = new THREE.Vector3(-Math.sin(lo), 0, -Math.cos(lo));
  const pos: number[] = [];
  const uv: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  const v = new THREE.Vector3();
  for (let i = 0; i <= rings; i++) {
    const th = maxAng * Math.pow(i / rings, 2.6);
    for (let j = 0; j <= segs; j++) {
      const ph = (j / segs) * Math.PI * 2;
      v.copy(c)
        .multiplyScalar(Math.cos(th))
        .addScaledVector(n, Math.sin(th) * Math.cos(ph))
        .addScaledVector(e, Math.sin(th) * Math.sin(ph))
        .normalize();
      pos.push((v.x - c.x) * P.RE, (v.y - c.y) * P.RE, (v.z - c.z) * P.RE);
      nor.push(v.x, v.y, v.z);
      const ll = P.toLatLon([v.x, v.y, v.z]);
      uv.push((ll.lon + 180) / 360, (ll.lat + 90) / 180);
    }
  }
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j;
      const b = a + segs + 1;
      idx.push(a, a + 1, b, b, a + 1, b + 1); // counter-clockwise seen from above
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/** The descent module's main parachute: an orange-and-white canopy on shroud lines, in km. */
function buildChute() {
  const root = new THREE.Group();
  const m = new THREE.Group();
  m.scale.setScalar(0.001); // built in metres; the capsule hangs at the origin
  root.add(m);
  const gores = 16;
  const R = 13;
  const H = 34; // capsule to canopy skirt
  for (let i = 0; i < gores; i++) {
    const g = new THREE.SphereGeometry(R, 3, 10, (i / gores) * Math.PI * 2, (Math.PI * 2) / gores, 0, Math.PI * 0.42);
    const mat = new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf2efe6 : 0xff7a2a, roughness: 0.9, side: THREE.DoubleSide });
    const gore = new THREE.Mesh(g, mat);
    gore.position.y = H - R * Math.cos(Math.PI * 0.42);
    m.add(gore);
  }
  const lines: number[] = [];
  const skirt = R * Math.sin(Math.PI * 0.42);
  for (let i = 0; i < gores; i++) {
    const a = (i / gores) * Math.PI * 2;
    lines.push(0, 1.2, 0, Math.sin(a) * skirt, H, Math.cos(a) * skirt);
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
  m.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xd8d2c4, transparent: true, opacity: 0.7 })));
  return root;
}

/** R-7 / Vostok-K, built in metres, scaled to km. Origin at the base of the core stage. */
function buildR7() {
  const root = new THREE.Group();
  const m = new THREE.Group();
  m.scale.setScalar(0.001);
  root.add(m);
  const panels = panelTexture();
  const white = new THREE.MeshStandardMaterial({ color: 0xd2d5ce, map: panels, roughness: 0.42, metalness: 0.12 });
  const grey = new THREE.MeshStandardMaterial({ color: 0x8c9088, map: panels, roughness: 0.5, metalness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1e1f20, roughness: 0.35, metalness: 0.8 });
  const lathe = (pts: [number, number][], mat: THREE.Material) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), 32), mat);

  // rocket-engine bells: a throat flaring to the exit, open, with a hot-dark inside
  const bellGeo = (r: number, len: number) =>
    new THREE.LatheGeometry(
      [[r * 0.42, 0], [r * 0.38, -len * 0.12], [r * 0.55, -len * 0.4], [r * 0.82, -len * 0.75], [r, -len]].map(([a, b]) => new THREE.Vector2(a, b)),
      20,
    );
  const bellMat = new THREE.MeshStandardMaterial({ color: 0x2a2826, roughness: 0.4, metalness: 0.85, side: THREE.DoubleSide });
  const bigBell = bellGeo(0.42, 1.05);
  const vernier = bellGeo(0.2, 0.55);
  // engine block: four main chambers in a square, two (booster) or four (core) gimballed verniers
  const engines = (g: THREE.Object3D, mainR: number, verniers: [number, number][]) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.22, 24), dark);
    plate.position.y = 0.02;
    g.add(plate);
    for (let k = 0; k < 4; k++) {
      const n = new THREE.Mesh(bigBell, bellMat);
      const a = (k * Math.PI) / 2 + Math.PI / 4;
      n.position.set(Math.cos(a) * mainR, -0.05, Math.sin(a) * mainR);
      g.add(n);
    }
    for (const [x, z] of verniers) {
      const n = new THREE.Mesh(vernier, bellMat);
      n.position.set(x, -0.05, z);
      g.add(n);
    }
  };
  // liquid-oxygen frost on the tanks while the rocket stands fuelled: white rime in bands, shed
  // as it climbs (opacity is driven from the flight loop)
  const frostMat = new THREE.MeshStandardMaterial({ color: 0xf4f7fa, roughness: 0.9, transparent: true, opacity: 0.85, alphaMap: frostTexture(), depthWrite: false });

  // core (Block A): narrow at the base, widest just above the boosters' tips
  const core = new THREE.Group();
  const coreProfile: [number, number][] = [[0.95, 0], [1.0, 1.2], [1.2, 9], [1.47, 19], [1.47, 27.5], [1.3, 28.2]];
  core.add(lathe(coreProfile, white));
  const band = lathe([[1.48, 20], [1.48, 21.2]], grey);
  core.add(band);
  // the LOX tank is the upper half of the core: that is where the rime collects
  const coreFrost = lathe([[1.215, 9.5], [1.475, 19.2], [1.478, 26.8]], frostMat);
  core.add(coreFrost);
  engines(core, 0.5, [[0, 0.98], [0, -0.98], [0.98, 0], [-0.98, 0]]);
  m.add(core);
  // upper stage (Block E) on its open lattice interstage — the exhaust of its engine had to
  // escape sideways when it lit while still attached — then the payload and the fairing
  const upper = new THREE.Group();
  const GAP = 1.5;
  upper.position.y = 28.2 + GAP;
  upper.add(lathe([[0.9, 0], [1.3, 0.6], [1.3, 3.2], [1.25, 3.4]], grey));
  {
    const bars: THREE.BufferGeometry[] = [];
    const Yv = new THREE.Vector3(0, 1, 0);
    const N = 16;
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      const lo = new THREE.Vector3(Math.cos(a0) * 1.28, -GAP, Math.sin(a0) * 1.28);
      const hi = new THREE.Vector3(Math.cos(a1) * 0.92, 0, Math.sin(a1) * 0.92);
      const lo2 = new THREE.Vector3(Math.cos(a1) * 1.28, -GAP, Math.sin(a1) * 1.28);
      for (const [a, b] of [
        [lo, hi],
        [lo2, hi],
      ]) {
        const g = new THREE.CylinderGeometry(0.035, 0.035, a.distanceTo(b), 4);
        g.applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(Yv, b.clone().sub(a).normalize()), new THREE.Vector3(1, 1, 1)));
        bars.push(g);
      }
    }
    bars.push(new THREE.TorusGeometry(1.28, 0.05, 4, 32).rotateX(Math.PI / 2).translate(0, -GAP, 0));
    bars.push(new THREE.TorusGeometry(0.92, 0.05, 4, 32).rotateX(Math.PI / 2));
    upper.add(new THREE.Mesh(mergeGeometries(bars)!, dark));
    // Block E's single engine, seen through the truss
    const e = new THREE.Mesh(bellGeo(0.38, 0.9), bellMat);
    e.position.y = 0.05;
    upper.add(e);
  }
  const capsule = new THREE.Group();
  capsule.position.y = 3.4;
  const instrument = lathe([[1.2, 0], [1.25, 0.6], [0.7, 1.9], [0.3, 2.1]], grey); // instrument module
  capsule.add(instrument);
  // the descent module wore a charred-looking ablative coat; its hatches and windows read as dark spots
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.15, 36, 24), new THREE.MeshStandardMaterial({ color: 0x8e8574, roughness: 0.85, metalness: 0.05, map: panels }));
  ball.position.y = 3.0;
  capsule.add(ball);
  upper.add(capsule);
  const fairing: THREE.Object3D[] = [];
  for (const side of [0, 1]) {
    const half = new THREE.Mesh(
      new THREE.LatheGeometry(
        [[1.32, 0], [1.32, 4.4], [1.0, 6.3], [0.35, 7.6], [0.05, 7.9]].map(([r, y]) => new THREE.Vector2(r, y)),
        24,
        side * Math.PI,
        Math.PI,
      ),
      white,
    );
    half.position.y = 3.3;
    upper.add(half);
    fairing.push(half);
  }
  // a slender aerial on the nose, jettisoned with the fairing
  const aerial = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 1.4, 5), dark);
  aerial.position.y = 7.9 + 0.65;
  fairing[0].add(aerial);
  m.add(upper);

  // four boosters: oblique cones whose inner edge runs up the core, so their pointed noses rest
  // against it; each with an air rudder and two verniers on the outboard side
  const boosters: THREE.Object3D[] = [];
  const boosterProfile: [number, number][] = [[1.34, 0], [1.34, 0.6], [1.3, 3], [1.12, 8], [0.85, 13], [0.45, 17.5], [0.12, 19.6]];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const out = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const b = new THREE.Group();
    b.position.copy(out).multiplyScalar(2.4);
    const geo = new THREE.LatheGeometry(boosterProfile.map(([r, y]) => new THREE.Vector2(r, y)), 32);
    // lean the cone inward: the nose ends up just outside the core's skin
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pos.count; k++) {
      const y = pos.getY(k);
      const lean = (2.4 - 1.62) * Math.pow(y / 19.6, 1.35);
      pos.setXYZ(k, pos.getX(k) - out.x * lean, y, pos.getZ(k) - out.z * lean);
    }
    geo.computeVertexNormals();
    b.add(new THREE.Mesh(geo, white));
    const frost = new THREE.Mesh(geo.clone().scale(1.004, 1, 1.004), frostMat);
    frost.position.y = 0.02;
    b.add(frost);
    // triangular air rudder at the base, outboard
    const fs = new THREE.Shape();
    fs.moveTo(0, 0);
    fs.lineTo(1.3, 0);
    fs.lineTo(0, 2.4);
    const fin = new THREE.Mesh(new THREE.ExtrudeGeometry(fs, { depth: 0.08, bevelEnabled: false }).translate(0, 0, -0.04), grey);
    fin.position.copy(out).multiplyScalar(1.32);
    fin.position.y = 0.2;
    fin.rotation.y = -a;
    b.add(fin);
    const side = new THREE.Vector3(-out.z, 0, out.x);
    engines(b, 0.55, [
      [out.x * 1.05 + side.x * 0.55, out.z * 1.05 + side.z * 0.55],
      [out.x * 1.05 - side.x * 0.55, out.z * 1.05 - side.z * 0.55],
    ]);
    m.add(b);
    boosters.push(b);
  }
  return { root, core, upper, boosters, fairing, capsule, ball, instrument, frost: frostMat };
}

/** Sheet-metal panels: ring seams along the stage, stringers around it, faint weathering. */
/** Alpha for the LOX rime: horizontal bands with ragged, flaking edges. */
function frostTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = '#000';
  g.fillRect(0, 0, 256, 512);
  for (let y = 0; y < 512; y += 4) {
    const k = 0.35 + 0.65 * Math.abs(Math.sin(y * 0.031) * Math.sin(y * 0.007 + 1.3));
    for (let x = 0; x < 256; x += 4) {
      const v = Math.max(0, k - Math.random() * 0.75);
      g.fillStyle = `rgba(255,255,255,${v})`;
      g.fillRect(x, y, 4 + Math.random() * 6, 3 + Math.random() * 3);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function panelTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 1800; i++) {
    g.fillStyle = `rgba(70,75,70,${Math.random() * 0.05})`;
    g.fillRect(Math.random() * 512, Math.random() * 256, 2 + Math.random() * 10, 1 + Math.random() * 3);
  }
  g.fillStyle = 'rgba(40,44,40,.28)';
  for (let y = 0; y < 256; y += 21) g.fillRect(0, y, 512, 1.5);
  g.fillStyle = 'rgba(40,44,40,.14)';
  for (let x = 0; x < 512; x += 32) g.fillRect(x, 0, 1, 256);
  // soot streaks toward the base
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, 'rgba(60,55,50,.22)');
  grd.addColorStop(0.25, 'rgba(60,55,50,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 512, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/** A square steel lattice tower in metres: four corner legs, a ring every bay and a cross-brace on
 *  each face, tapering from half-width w0 at the foot to w1 at the top. One merged geometry. */
function lattice(w0: number, w1: number, hgt: number, bay: number, t: number) {
  const parts: THREE.BufferGeometry[] = [];
  const Y = new THREE.Vector3(0, 1, 0);
  const strut = (a: THREE.Vector3, b: THREE.Vector3, th: number) => {
    const g = new THREE.BoxGeometry(th, a.distanceTo(b), th);
    const q = new THREE.Quaternion().setFromUnitVectors(Y, b.clone().sub(a).normalize());
    g.applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, new THREE.Vector3(1, 1, 1)));
    parts.push(g);
  };
  const corner = (y: number, i: number) => {
    const w = w0 + ((w1 - w0) * y) / hgt;
    return new THREE.Vector3(i === 0 || i === 3 ? -w : w, y, i < 2 ? -w : w);
  };
  for (let i = 0; i < 4; i++) strut(corner(0, i), corner(hgt, i), t * 1.5);
  const bays = Math.max(1, Math.round(hgt / bay));
  for (let k = 0; k <= bays; k++) {
    const y = (k / bays) * hgt;
    for (let i = 0; i < 4; i++) {
      strut(corner(y, i), corner(y, (i + 1) % 4), t);
      if (k < bays) {
        const y2 = ((k + 1) / bays) * hgt;
        if (k % 2) strut(corner(y, i), corner(y2, (i + 1) % 4), t * 0.8);
        else strut(corner(y, (i + 1) % 4), corner(y2, i), t * 0.8);
      }
    }
  }
  const g = mergeGeometries(parts)!;
  for (const p of parts) p.dispose();
  return g;
}

/** Poured slabs: expansion joints, stains and scorch rings round the flame pit. */
function concreteTexture(scorch = true) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  g.fillStyle = '#d8d4ca';
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5000; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '40,36,30' : '255,250,240'},${Math.random() * 0.06})`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 4, 1 + Math.random() * 4);
  }
  g.strokeStyle = 'rgba(50,46,40,.35)';
  g.lineWidth = 1.5;
  for (let x = 0; x <= 512; x += 64) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, 512);
    g.moveTo(0, x);
    g.lineTo(512, x);
    g.stroke();
  }
  // tide marks of rain, oil and blown dust, plus slabs poured on different days
  for (let i = 0; i < 40; i++) {
    const x = (i % 8) * 64, y = Math.floor(i / 8) * 64 + (scorch ? 0 : 192);
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '70,62,50' : '235,228,214'},${Math.random() * 0.12})`;
    g.fillRect(x + 1, y % 512, 63, 63);
  }
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, rr = 10 + Math.random() * 46;
    const st = g.createRadialGradient(x, y, 0, x, y, rr);
    st.addColorStop(0, `rgba(48,40,30,${0.08 + Math.random() * 0.12})`);
    st.addColorStop(1, 'rgba(48,40,30,0)');
    g.fillStyle = st;
    g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
  }
  if (scorch) {
    const r = g.createRadialGradient(256, 256, 20, 256, 256, 250);
    r.addColorStop(0, 'rgba(20,16,12,.75)');
    r.addColorStop(0.35, 'rgba(40,32,24,.35)');
    r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 512, 512);
  } else {
    // steppe dust drifted against the outer edge
    const r = g.createRadialGradient(256, 256, 150, 256, 256, 365);
    r.addColorStop(0, 'rgba(150,130,96,0)');
    r.addColorStop(1, 'rgba(150,130,96,.55)');
    g.fillStyle = r;
    g.fillRect(0, 0, 512, 512);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function plumeMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uTime: { value: 0 }, uK: { value: 1 } },
    vertexShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_vertex>
      varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vV = -normalize(mv.xyz); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv;
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <logdepthbuf_pars_fragment>
      uniform float uTime; uniform float uK; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){
        #include <logdepthbuf_fragment>
        float along = 1.0 - vUv.y;            // 0 at the nozzle … 1 at the tip
        float facing = abs(dot(normalize(vN), normalize(vV)));
        float core = pow(facing, 4.0);        // the hot central jet
        float env = pow(facing, 0.8);         // the cooler, wider envelope
        float shock = 0.7 + 0.3 * smoothstep(0.2, 0.9, sin(along * 46.0 - uTime * 30.0)) * (1.0 - along);
        float flick = 0.9 + 0.1 * sin(uTime * 53.0 + along * 9.0);
        float a = (core * 1.0 + env * 0.3) * pow(1.0 - along, 1.6) * shock * flick * uK;
        vec3 c = mix(vec3(1.0, 0.97, 0.88), vec3(1.0, 0.62, 0.22), smoothstep(0.0, 0.35, along));
        c = mix(c, vec3(0.9, 0.3, 0.08), smoothstep(0.35, 0.9, along));
        gl_FragColor = vec4(c * a * 2.0, a);
      }`,
  });
}

function setPlume(m: THREE.Mesh, on: boolean, len: number, widen: number, t: number) {
  m.visible = on;
  if (!on) return;
  m.scale.set(widen, len, widen);
  const u = (m.material as THREE.ShaderMaterial).uniforms;
  u.uTime.value = t;
}

/** Smoke puffs that stay where they were emitted (the contrail and the launch cloud). */
class WorldPuffs {
  points: THREE.Points;
  private pos: Float32Array;
  private vel: Float32Array;
  private life: Float32Array;
  private max: Float32Array;
  private size: Float32Array;
  private aLife: Float32Array;
  private next = 0;
  private m = new THREE.Matrix4();
  constructor(
    private n: number,
    tex: THREE.Texture,
  ) {
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.life = new Float32Array(n).fill(1);
    this.max = new Float32Array(n).fill(1);
    this.size = new Float32Array(n);
    this.aLife = new Float32Array(n).fill(1);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) seed[i] = Math.floor(Math.random() * 4);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('aLife', new THREE.BufferAttribute(this.aLife, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1));
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTex: { value: tex }, uScale: { value: 900 }, uSunSide: { value: 1 }, uSunV: { value: new THREE.Vector3(0, 1, 0) } },
      vertexShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_vertex>
        attribute float aLife; attribute float aSize; attribute float aSeed; varying float vLife; varying float vSeed; uniform float uScale;
        void main(){ vLife = aLife; vSeed = aSeed; vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = aLife >= 1.0 ? 0.0 : min(900.0, aSize * (0.5 + aLife * 2.5) * uScale / -mv.z);
          gl_Position = projectionMatrix * mv;
          #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */ `
        #include <common>
        #include <logdepthbuf_pars_fragment>
        uniform sampler2D uTex; uniform float uSunSide; uniform vec3 uSunV; varying float vLife; varying float vSeed;
        void main(){
          #include <logdepthbuf_fragment>
          float r = vSeed * 1.7 + vLife * 0.6;
          vec2 pc = gl_PointCoord - 0.5;
          pc = mat2(cos(r), -sin(r), sin(r), cos(r)) * pc * 1.15 + 0.5;
          if (pc.x < 0.0 || pc.y < 0.0 || pc.x > 1.0 || pc.y > 1.0) discard;
          vec2 uv = (pc + vec2(mod(vSeed, 2.0), floor(vSeed / 2.0))) * 0.5;
          float a = texture2D(uTex, uv).a;
          // Lit like a billow, not a flat card: a ball normal across the sprite, roughened by the
          // slope of the puff's own density, then wrapped sunlight against blue skylight; denser
          // cores self-shadow. Glowing orange while still in the exhaust.
          const float e = 0.012;
          vec2 gr = vec2(texture2D(uTex, uv - vec2(e, 0.0)).a - texture2D(uTex, uv + vec2(e, 0.0)).a,
                         texture2D(uTex, uv + vec2(0.0, e)).a - texture2D(uTex, uv - vec2(0.0, e)).a);
          gr = mat2(cos(r), sin(r), -sin(r), cos(r)) * gr; // back from the turned tile to the screen
          vec2 sp = (gl_PointCoord - 0.5) * vec2(2.0, -2.0);
          vec3 nrm = normalize(vec3(sp * 0.9 + gr * 2.2, sqrt(max(0.05, 1.0 - dot(sp, sp)))));
          float lam = clamp(dot(nrm, uSunV) * 0.6 + 0.45, 0.0, 1.0);
          vec3 lit = mix(vec3(0.42, 0.47, 0.56), vec3(1.06, 1.0, 0.92), lam) * mix(1.0, 0.78, a * (1.0 - lam));
          vec3 c = mix(vec3(1.0, 0.68, 0.38) * 1.15, lit, smoothstep(0.0, 0.05, vLife));
          gl_FragColor = vec4(c, a * 0.8 * (1.0 - vLife) * smoothstep(0.0, 0.02, vLife));
        }`,
    });
    this.points = new THREE.Points(g, mat);
    this.points.frustumCulled = false;
  }
  /** `near` > 0: a local puff of that radius (km) at `p`, e.g. dust at touchdown. */
  emit(p: THREE.Vector3, up: THREE.Vector3, dir: THREE.Vector3, size: number, life: number, burst = false, near = 0) {
    const i = this.next;
    this.next = (this.next + 1) % this.n;
    // trail puffs start just past the nozzles, where the visible flame ends
    const back = burst || near ? 0 : 0.008 + Math.random() * 0.014;
    const j = near || 0.02;
    const rx = (Math.random() - 0.5) * j;
    const rz = (Math.random() - 0.5) * j;
    this.pos.set([p.x - dir.x * back + rx, p.y - dir.y * back, p.z - dir.z * back + rz], i * 3);
    const spread = near ? near * 0.5 : burst ? 0.05 : 0.004;
    this.vel.set([(Math.random() - 0.5) * spread + up.x * 0.001, (Math.random() - 0.5) * spread + up.y * 0.001, (Math.random() - 0.5) * spread + up.z * 0.001], i * 3);
    this.life[i] = 0;
    this.max[i] = life;
    this.size[i] = size;
  }
  setScale(px: number) {
    (this.points.material as THREE.ShaderMaterial).uniforms.uScale.value = px;
  }
  /** The Sun's direction in view space, for the billow lighting. */
  setSun(sun: THREE.Vector3, cam: THREE.Camera) {
    (this.points.material as THREE.ShaderMaterial).uniforms.uSunV.value.copy(sun).transformDirection(cam.matrixWorldInverse);
  }
  /** `turn`: how the Earth, and the air with it, rotated this frame. The flight runs in an
   *  inertial frame, so smoke left hanging there would be swept off the pad at the ground's
   *  ~0.3 km/s; it has to turn with the atmosphere instead. */
  update(dt: number, turn: THREE.Quaternion) {
    const m = this.m.makeRotationFromQuaternion(turn).elements;
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] >= 1) {
        this.aLife[i] = 1;
        continue;
      }
      this.life[i] += dt / this.max[i];
      const j = i * 3;
      const x = this.pos[j];
      const y = this.pos[j + 1];
      const z = this.pos[j + 2];
      this.pos[j] = m[0] * x + m[4] * y + m[8] * z + this.vel[j] * dt;
      this.pos[j + 1] = m[1] * x + m[5] * y + m[9] * z + this.vel[j + 1] * dt;
      this.pos[j + 2] = m[2] * x + m[6] * y + m[10] * z + this.vel[j + 2] * dt;
      this.aLife[i] = Math.min(1, this.life[i]);
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true;
    g.attributes.aLife.needsUpdate = true;
    g.attributes.aSize.needsUpdate = true;
  }
}

