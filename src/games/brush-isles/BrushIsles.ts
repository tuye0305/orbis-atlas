import * as THREE from 'three';
import type { L10n } from '../../types';
import { GAME_BY_ID } from '../registry';
import { createCoach, type Tone } from '../shared/coach';
import { createSfx } from '../shared/sfx';
import { clamp, createStage, gradientEnv, h, makeToast, mulberry } from '../shared/stage';
import type { GameCtx, GameInstance, GameResult, MountGame } from '../types';
import { Kit } from './kit';
import { STYLES, type Stats, type Style, type StyleId } from './styles';

/**
 * Brush Isles: paint land out of the water and a historical city grows on it. You never place a
 * single house: you paint where the town, the fields and the trees should be, and each cell of
 * the map decides for itself what to become (a house turned toward the canal, a field, a bridge
 * over a narrow channel, a windmill) in the building style of the place and period you chose.
 */

export const GAME_ID: Record<StyleId, string> = {
  tenochtitlan: 'isle-tenochtitlan',
  kaifeng: 'isle-kaifeng',
  raiatea: 'isle-raiatea',
  amsterdam: 'isle-amsterdam',
};

export const mountStyle =
  (id: StyleId): MountGame =>
  (root, ctx) =>
    mount(root, ctx, STYLES[id]);

/* ---------------------------------------------------------------- map constants */

const S = 40; // world size
const HALF = S / 2;
const N = 128; // fine grid (height + paint masks)
const CELL = S / (N - 1);
const G = 40; // coarse grid: one building per cell, 1 world unit each
const BRUSH = [1.3, 2.3, 3.8];
const GOAL_SHAPED = 30;
const GOAL_HOUSES = 24;
const GOAL_FIELDS = 8;

const enum K {
  None,
  House,
  Field,
  Chinampa,
  Trees,
  Bridge,
  Reserved,
  Mill,
}

type ToolId = 'land' | 'hill' | 'water' | 'houses' | 'fields' | 'trees' | 'landmark' | 'erase';

const ICON: Record<ToolId, string> = {
  land: '<path d="M2 17c3-5 6-7 10-7s7 2 10 7z" fill="currentColor" opacity=".9"/><path d="M1 20h22" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  hill: '<path d="M2 19l7-11 4 6 3-4 6 9z" fill="currentColor" opacity=".9"/>',
  water: '<path d="M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 19c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  houses: '<path d="M3 20V11l5-4 5 4v9zM13 20v-7l4-3 4 3v7z" fill="currentColor" opacity=".9"/><path d="M7 20v-4h2v4" fill="#000" opacity=".35"/>',
  fields: '<path d="M3 18l4-9h4l-3 9zM10 18l2-9h3l1 9zM18 18l-1-9h3l2 9z" fill="currentColor" opacity=".9"/>',
  trees: '<circle cx="9" cy="9" r="5" fill="currentColor" opacity=".9"/><circle cx="16" cy="11" r="4" fill="currentColor" opacity=".7"/><path d="M9 13v7M16 14v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  landmark: '<path d="M12 2l2 5h-4zM8 9h8l1 4H7zM6 15h12l1 5H5z" fill="currentColor" opacity=".9"/>',
  erase: '<path d="M4 15l8-8 7 7-5 5H8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 19h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
};

const TOOL_LABEL: Record<ToolId, L10n> = {
  land: { en: 'Land', zh: '陆地' },
  hill: { en: 'Hills', zh: '山丘' },
  water: { en: 'Water', zh: '水' },
  houses: { en: 'Houses', zh: '房屋' },
  fields: { en: 'Fields', zh: '田地' },
  trees: { en: 'Trees', zh: '树木' },
  landmark: { en: 'Landmark', zh: '地标' },
  erase: { en: 'Clear', zh: '清除' },
};
const TOOLS: ToolId[] = ['land', 'hill', 'water', 'houses', 'fields', 'trees', 'landmark', 'erase'];
const CURSOR: Record<ToolId, string> = {
  land: '#f3dfb0',
  hill: '#c9e0a0',
  water: '#8fd3ff',
  houses: '#ffd36a',
  fields: '#b8e07a',
  trees: '#7fd08a',
  landmark: '#ffd36a',
  erase: '#ff9a85',
};

const SHAPE_HINT: Record<StyleId, L10n> = {
  tenochtitlan: {
    en: 'The Mexica settled on a small island. Pick <b>Land</b> and grow it out into the lake.',
    zh: '墨西加人在湖中小岛上定居。选择<b>陆地</b>，把小岛向湖中扩展。',
  },
  kaifeng: {
    en: 'Shape the banks of the Bian river: paint <b>Land</b>, or dig canals with <b>Water</b>.',
    zh: '塑造汴河两岸：用<b>陆地</b>填岸，或用<b>水</b>开挖河渠。',
  },
  raiatea: {
    en: 'Shape the island: <b>Land</b> for beaches and motu, <b>Hills</b> for the mountain, <b>Water</b> for the lagoon.',
    zh: '塑造海岛：<b>陆地</b>造海滩和环礁小岛，<b>山丘</b>堆高火山，<b>水</b>拓宽泻湖。',
  },
  amsterdam: {
    en: 'Dam and dig: paint <b>Land</b> out into the IJ, or cut canals with <b>Water</b>.',
    zh: '筑坝与开渠：用<b>陆地</b>向艾湾填地，或用<b>水</b>开出运河。',
  },
};

/* ---------------------------------------------------------------- helpers */

function hash(a: number, b: number, c = 0) {
  let x = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1) ^ Math.imul(c | 0, 0x9e3779b1);
  x = Math.imul(x ^ (x >>> 15), 0x85ebca6b);
  x ^= x >>> 13;
  return (x >>> 0) / 4294967296;
}

function makeNoise(seed: number) {
  const P = 64;
  const r = mulberry(seed);
  const v = Float32Array.from({ length: P * P }, () => r());
  const at = (i: number, j: number) => v[(((j % P) + P) % P) * P + (((i % P) + P) % P)];
  const one = (x: number, z: number) => {
    const ix = Math.floor(x);
    const iz = Math.floor(z);
    const fx = x - ix;
    const fz = z - iz;
    const sx = fx * fx * (3 - 2 * fx);
    const sz = fz * fz * (3 - 2 * fz);
    return (at(ix, iz) * (1 - sx) + at(ix + 1, iz) * sx) * (1 - sz) + (at(ix, iz + 1) * (1 - sx) + at(ix + 1, iz + 1) * sx) * sz;
  };
  return (x: number, z: number) => one(x, z) * 0.65 + one(x * 2.1 + 17, z * 2.1 + 5) * 0.35;
}

const easeOutBack = (p: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2);
};

interface Inst {
  pool: Pool;
  i: number;
  pos: THREE.Vector3;
  rot: number;
  scl: THREE.Vector3;
  k: number;
  color: THREE.Color;
  /** Height above the terrain, or (if `abs`) above the water line. */
  dy: number;
  abs: boolean;
  anim?: Anim;
}

interface Anim {
  t: number;
  delay: number;
  dur: number;
  grow: boolean;
  inst?: Inst;
  obj?: THREE.Object3D;
  done?: () => void;
}

class Pool {
  readonly mesh: THREE.InstancedMesh;
  readonly items: Inst[] = [];
  private static m = new THREE.Matrix4();
  private static q = new THREE.Quaternion();
  private static s = new THREE.Vector3();
  private static Y = new THREE.Vector3(0, 1, 0);
  constructor(
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    readonly cap: number,
  ) {
    this.mesh = new THREE.InstancedMesh(geo, mat, cap);
    this.mesh.count = 0;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.setColorAt(0, new THREE.Color(1, 1, 1));
  }
  add(pos: THREE.Vector3, rot: number, scl: THREE.Vector3, color: THREE.Color, dy: number, abs = false): Inst | null {
    if (this.items.length >= this.cap) return null;
    const it: Inst = { pool: this, i: this.items.length, pos, rot, scl, k: 0, color, dy, abs };
    this.items.push(it);
    this.mesh.count = this.items.length;
    this.write(it);
    this.mesh.setColorAt(it.i, color);
    this.mesh.instanceColor!.needsUpdate = true;
    return it;
  }
  write(it: Inst) {
    if (it.i < 0) return;
    Pool.q.setFromAxisAngle(Pool.Y, it.rot);
    Pool.s.copy(it.scl).multiplyScalar(Math.max(1e-4, it.k));
    Pool.m.compose(it.pos, Pool.q, Pool.s);
    this.mesh.setMatrixAt(it.i, Pool.m);
    this.mesh.instanceMatrix.needsUpdate = true;
  }
  remove(it: Inst) {
    if (it.i < 0) return;
    const last = this.items.pop()!;
    if (last !== it) {
      last.i = it.i;
      this.items[it.i] = last;
      this.write(last);
      this.mesh.setColorAt(last.i, last.color);
      this.mesh.instanceColor!.needsUpdate = true;
    }
    this.mesh.count = this.items.length;
    it.i = -1;
  }
}

interface Cell {
  kind: K;
  sig: number;
  obj: THREE.Object3D | null;
  inst: Inst[];
  shoreTrees: number;
}

interface Boat {
  obj: THREE.Object3D;
  x: number;
  z: number;
  head: number;
  speed: number;
  tx: number;
  tz: number;
  phase: number;
  leaving: boolean;
}

interface Snapshot {
  L: Float32Array;
  T: Float32Array;
  F: Float32Array;
  R: Float32Array;
  lm: { cx: number; cz: number; ry: number } | null;
  prop: boolean;
}

/* ---------------------------------------------------------------- the game */

function mount(root: HTMLElement, ctx: GameCtx, st: Style): GameInstance {
  const lang = ctx.lang;
  const tx = (o: L10n) => o[lang];
  const reduced = ctx.reduced;

  const stage = createStage(root, { bloom: { strength: 0.16, radius: 0.5, threshold: 1.25 }, fov: 32, grade: st.grade });
  const { renderer, scene, camera } = stage;
  renderer.toneMappingExposure = st.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  camera.far = 1200;
  camera.updateProjectionMatrix();
  scene.fog = new THREE.Fog(st.fog.color, st.fog.near, st.fog.far);

  /* ---------- light and sky */
  const sunDir = new THREE.Vector3(...st.sun.dir).normalize();
  const sun = new THREE.DirectionalLight(st.sun.color, st.sun.intensity);
  sun.position.copy(sunDir).multiplyScalar(60);
  sun.castShadow = true;
  const sc = sun.shadow.camera;
  sc.left = -25;
  sc.right = 25;
  sc.top = 25;
  sc.bottom = -25;
  sc.near = 1;
  sc.far = 150;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(st.hemi.sky, st.hemi.ground, st.hemi.intensity));
  const env = gradientEnv(renderer, { top: st.sky.top, horizon: st.sky.horizon, ground: st.ground.grass, sun: { dir: sunDir, color: st.sky.sun, power: 1.5 } });
  scene.environment = env;

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(600, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color(st.sky.top) },
        uHor: { value: new THREE.Color(st.sky.horizon) },
        uFog: { value: new THREE.Color(st.fog.color) },
        uSun: { value: sunDir.clone() },
        uSunC: { value: new THREE.Color(st.sky.sun) },
      },
      vertexShader: /* glsl */ `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uTop, uHor, uFog, uSun, uSunC; varying vec3 vD;
        void main(){
          float y = max(vD.y, 0.0);
          vec3 c = mix(uHor, uTop, pow(y, 0.6));
          c = mix(uFog, c, smoothstep(-0.02, 0.12, vD.y));
          float d = max(dot(normalize(vD), uSun), 0.0);
          c += uSunC * (pow(d, 600.0) * 3.0 + pow(d, 12.0) * 0.18);
          gl_FragColor = vec4(c, 1.0);
        }`,
    }),
  );
  sky.renderOrder = -1;
  scene.add(sky);

  /* ---------- fields */
  const noise = makeNoise(st.id.length * 131 + 7);
  const Lf = new Float32Array(N * N);
  const Tf = new Float32Array(N * N);
  const Ff = new Float32Array(N * N);
  const Rf = new Float32Array(N * N);
  const Hh = new Float32Array(N * N);
  const NZ = new Float32Array(N * N);
  const CAP = new Float32Array(N * N);
  const wx = (ix: number) => -HALF + ix * CELL;
  for (let iz = 0; iz < N; iz++)
    for (let ix = 0; ix < N; ix++) {
      const i = iz * N + ix;
      const x = wx(ix);
      const z = wx(iz);
      const c = st.seed(x, z, noise);
      Lf[i] = c.L ?? 0.1;
      Tf[i] = c.town ?? 0;
      Ff[i] = c.field ?? 0;
      Rf[i] = c.tree ?? 0;
      NZ[i] = noise(x * 0.55 + 40, z * 0.55 + 40) - 0.5;
      const e = Math.min(ix, iz, N - 1 - ix, N - 1 - iz);
      const s = clamp((e - 3) / 9, 0, 1);
      CAP[i] = 0.2 + 3.8 * s * s * (3 - 2 * s);
    }

  // soften the seed map's edges into beaches and slopes
  {
    const tmp = new Float32Array(N * N);
    for (let pass = 0; pass < 3; pass++) {
      for (const arr of [Lf, Tf, Ff, Rf]) {
        tmp.set(arr);
        for (let iz = 1; iz < N - 1; iz++)
          for (let ix = 1; ix < N - 1; ix++) {
            const i = iz * N + ix;
            arr[i] = (tmp[i] * 4 + tmp[i - 1] + tmp[i + 1] + tmp[i - N] + tmp[i + N]) / 8;
          }
      }
    }
  }

  const heightOf = (i: number) => {
    const L = Math.min(Lf[i], CAP[i]);
    if (L < 0.5) return -1.25 * (1 - L / 0.5);
    const s = clamp((L - 0.5) / 0.42, 0, 1);
    return 0.34 * (1 - (1 - s) * (1 - s)) + Math.max(0, L - 1.08) * 1.55 + NZ[i] * 0.06 * s + (L > 1.1 ? NZ[i] * 0.5 * (L - 1.1) : 0);
  };
  for (let i = 0; i < N * N; i++) Hh[i] = heightOf(i);

  const sample = (arr: Float32Array, x: number, z: number) => {
    const fx = clamp((x + HALF) / CELL, 0, N - 1.001);
    const fz = clamp((z + HALF) / CELL, 0, N - 1.001);
    const ix = Math.floor(fx);
    const iz = Math.floor(fz);
    const u = fx - ix;
    const v = fz - iz;
    const i = iz * N + ix;
    return (arr[i] * (1 - u) + arr[i + 1] * u) * (1 - v) + (arr[i + N] * (1 - u) + arr[i + N + 1] * u) * v;
  };
  const heightAt = (x: number, z: number) => (Math.abs(x) < HALF && Math.abs(z) < HALF ? sample(Hh, x, z) : st.water.outside);

  /* ---------- terrain mesh */
  const tGeo = new THREE.PlaneGeometry(S, S, N - 1, N - 1);
  tGeo.rotateX(-Math.PI / 2);
  tGeo.deleteAttribute('uv');
  const tPos = tGeo.attributes.position as THREE.BufferAttribute;
  const tCol = new THREE.BufferAttribute(new Float32Array(N * N * 3), 3);
  tGeo.setAttribute('color', tCol);
  const GC = Object.fromEntries(Object.entries(st.ground).map(([k, v]) => [k, new THREE.Color(v)])) as Record<keyof Style['ground'], THREE.Color>;
  const tmpC = new THREE.Color();
  const shade = (i: number, out: THREE.Color) => {
    const hgt = Hh[i];
    const ix = i % N;
    const iz = (i / N) | 0;
    const hx = Hh[ix < N - 1 ? i + 1 : i] - Hh[ix > 0 ? i - 1 : i];
    const hz = Hh[iz < N - 1 ? i + N : i] - Hh[iz > 0 ? i - N : i];
    const slope = Math.hypot(hx, hz) / (2 * CELL);
    const n = NZ[i];
    out.copy(GC.grass).lerp(GC.grass2, clamp(n * 2.2 + 0.5, 0, 1));
    if (hgt < 0.16) out.lerp(GC.sand, clamp((0.16 - hgt) / 0.07, 0, 1));
    if (hgt < 0.02) out.multiplyScalar(0.82);
    if (hgt > 0.55) out.lerp(GC.hill, clamp((hgt - 0.55) / 0.7, 0, 1));
    if (slope > 0.85) out.lerp(GC.rock, clamp((slope - 0.85) / 0.9, 0, 0.85));
    if (hgt > 0.08) {
      if (Tf[i] > 0.3) out.lerp(GC.town, clamp((Tf[i] - 0.3) * 1.6, 0, 0.75));
      if (Ff[i] > 0.3) out.lerp(GC.field, clamp((Ff[i] - 0.3) * 1.4, 0, 0.55));
    }
    out.multiplyScalar(0.96 + n * 0.12);
  };

  // height texture for the water shader (depth colour, foam)
  const hTexData = new Uint8Array(N * N);
  const hTex = new THREE.DataTexture(hTexData, N, N, THREE.RedFormat, THREE.UnsignedByteType);
  hTex.magFilter = THREE.LinearFilter;
  hTex.minFilter = THREE.LinearFilter;

  const tNrm = tGeo.attributes.normal as THREE.BufferAttribute;
  let dirtyBox: [number, number, number, number] | null = null;
  const writeRegion = (x0: number, z0: number, x1: number, z1: number) => {
    // one ring wider than the edited box: its edge vertices' slopes (normal, rock tint) changed too
    x0 = Math.max(0, x0 - 1);
    z0 = Math.max(0, z0 - 1);
    x1 = Math.min(N - 1, x1 + 1);
    z1 = Math.min(N - 1, z1 + 1);
    for (let iz = z0; iz <= z1; iz++)
      for (let ix = x0; ix <= x1; ix++) {
        const i = iz * N + ix;
        tPos.setY(i, Hh[i]);
        shade(i, tmpC);
        tCol.setXYZ(i, tmpC.r, tmpC.g, tmpC.b);
        hTexData[i] = Math.round(clamp((Hh[i] + 2) / 3, 0, 1) * 255);
        // Normals straight from the height grid, only over this box: recomputing the whole 128²
        // mesh every few frames of a stroke was the costliest part of painting.
        const hx = (Hh[ix < N - 1 ? i + 1 : i] - Hh[ix > 0 ? i - 1 : i]) / ((ix < N - 1 ? 1 : 0) + (ix > 0 ? 1 : 0)) / CELL;
        const hz = (Hh[iz < N - 1 ? i + N : i] - Hh[iz > 0 ? i - N : i]) / ((iz < N - 1 ? 1 : 0) + (iz > 0 ? 1 : 0)) / CELL;
        const l = Math.hypot(hx, 1, hz);
        tNrm.setXYZ(i, -hx / l, 1 / l, -hz / l);
      }
    tPos.needsUpdate = true;
    tCol.needsUpdate = true;
    tNrm.needsUpdate = true;
    hTex.needsUpdate = true;
  };
  writeRegion(0, 0, N - 1, N - 1);
  const terrain = new THREE.Mesh(tGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0, envMapIntensity: 0.3 }));
  terrain.receiveShadow = true;
  terrain.castShadow = true;
  scene.add(terrain);

  /** Recompute heights in a fine-grid box (immediately) and queue the mesh update. */
  const touch = (x0: number, z0: number, x1: number, z1: number) => {
    x0 = Math.max(0, x0 - 1);
    z0 = Math.max(0, z0 - 1);
    x1 = Math.min(N - 1, x1 + 1);
    z1 = Math.min(N - 1, z1 + 1);
    for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) Hh[iz * N + ix] = heightOf(iz * N + ix);
    dirtyBox = dirtyBox ? [Math.min(dirtyBox[0], x0), Math.min(dirtyBox[1], z0), Math.max(dirtyBox[2], x1), Math.max(dirtyBox[3], z1)] : [x0, z0, x1, z1];
    // coarse cells over the box (and a ring around, for bridges and facing)
    const cx0 = Math.max(0, Math.floor(wx(x0) + HALF) - 1);
    const cz0 = Math.max(0, Math.floor(wx(z0) + HALF) - 1);
    const cx1 = Math.min(G - 1, Math.floor(wx(x1) + HALF) + 1);
    const cz1 = Math.min(G - 1, Math.floor(wx(z1) + HALF) + 1);
    for (let cz = cz0; cz <= cz1; cz++) for (let cx = cx0; cx <= cx1; cx++) dirty.add(cz * G + cx);
  };

  /* ---------- water */
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(900, 900, 1, 1).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({
      uniforms: {
        uH: { value: hTex },
        uS: { value: S },
        uN: { value: N },
        uT: { value: 0 },
        uOut: { value: st.water.outside },
        uShallow: { value: new THREE.Color(st.water.shallow) },
        uDeep: { value: new THREE.Color(st.water.deep) },
        uFoam: { value: new THREE.Color(st.water.foam) },
        uSky: { value: new THREE.Color(st.sky.horizon) },
        uSunDir: { value: sunDir.clone() },
        uSunC: { value: new THREE.Color(st.sun.color) },
        uFogC: { value: new THREE.Color(st.fog.color) },
        uFogN: { value: st.fog.near },
        uFogF: { value: st.fog.far },
      },
      vertexShader: /* glsl */ `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uH; uniform float uS, uN, uT, uOut, uFogN, uFogF;
        uniform vec3 uShallow, uDeep, uFoam, uSky, uSunDir, uSunC, uFogC;
        varying vec3 vW;
        float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
        void main(){
          vec2 g = (vW.xz + uS * 0.5) / uS * (uN - 1.0);
          vec2 uv = (g + 0.5) / uN;
          bool inside = all(greaterThan(uv, vec2(0.0))) && all(lessThan(uv, vec2(1.0)));
          vec2 e2 = min(uv, 1.0 - uv);
          float edge = smoothstep(0.0, 0.09, min(e2.x, e2.y));
          float hgt = inside ? mix(uOut, texture2D(uH, uv).r * 3.0 - 2.0, edge) : uOut;
          float depth = clamp(-hgt, 0.0, 3.0);
          vec3 col = mix(uShallow, uDeep, smoothstep(0.02, 1.5, depth));
          vec2 p = vW.xz;
          float t = uT;
          float n1 = vnoise(p * 1.6 + vec2(t * 0.35, t * 0.2));
          float n2 = vnoise(p * 3.1 - vec2(t * 0.25, -t * 0.3));
          vec3 nrm = normalize(vec3((n1 - 0.5) * 0.22 + sin(p.x * 1.2 + t) * 0.03, 1.0, (n2 - 0.5) * 0.22 + cos(p.y * 1.05 - t * 0.8) * 0.03));
          vec3 V = normalize(cameraPosition - vW);
          float fres = pow(1.0 - max(dot(nrm, V), 0.0), 3.0);
          col = mix(col, uSky, fres * 0.55);
          vec3 R = reflect(-uSunDir, nrm);
          col += uSunC * pow(max(dot(R, V), 0.0), 220.0) * 1.6;
          // foam: a bright line at the shore, broken patches over the shallows and reefs
          float shore = smoothstep(0.07, 0.0, depth);
          float shallow = smoothstep(0.3, 0.02, depth);
          float foamy = smoothstep(0.52, 0.78, vnoise(p * 2.4 + vec2(t * 0.5, -t * 0.3)) * 0.7 + 0.3 * sin(depth * 30.0 - t * 2.2));
          col = mix(col, uFoam, clamp(shore * 0.8 + shallow * foamy * 0.55, 0.0, 1.0));
          float dist = length(cameraPosition - vW);
          col = mix(col, uFogC, smoothstep(uFogN, uFogF, dist));
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  );
  scene.add(water);
  const waterU = (water.material as THREE.ShaderMaterial).uniforms;

  /* ---------- materials, pools */
  const matB = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.4 });
  const ghostMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.45, depthWrite: false, fog: false });

  const bedKit = new Kit();
  bedKit.box(1, 1, 1, 0, 0, 0, '#ffffff');
  const beds = new Pool(bedKit.build(), matB, 14000);
  scene.add(beds.mesh);
  const treePools: Record<string, Pool> = {};
  const treeNames = new Set([...st.trees.shore, ...st.trees.land, ...st.trees.hill, ...(st.trees.chinampa ? [st.trees.chinampa] : [])]);
  for (const name of treeNames) {
    const k = new Kit();
    st.treeKits[name](k);
    // room for every cell planted at full density with this one kind (Amsterdam's elms nearly are)
    const p = new Pool(k.build(), matB, G * G * 3);
    treePools[name] = p;
    scene.add(p.mesh);
  }

  // far scenery
  {
    const k = new Kit();
    st.backdrop(k, mulberry(99));
    const m = new THREE.Mesh(k.build(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
    scene.add(m);
  }

  // the starting decoration (eagle on the cactus)
  let propObj: THREE.Mesh | null = null;
  const placeProp = () => {
    if (!st.prop || propObj) return;
    const k = new Kit();
    st.prop.build(k);
    propObj = new THREE.Mesh(k.build(), matB);
    propObj.castShadow = true;
    propObj.position.set(st.prop.x, heightAt(st.prop.x, st.prop.z) - 0.02, st.prop.z);
    scene.add(propObj);
  };
  placeProp();
  const removeProp = () => {
    if (!propObj) return;
    const o = propObj;
    propObj = null;
    animate({ obj: o, grow: false, dur: 0.4, done: () => disposeObj(o) });
  };

  /* ---------- animation */
  const anims: Anim[] = [];
  const animate = (a: Omit<Anim, 't' | 'delay'> & { delay?: number }) => {
    const an: Anim = { t: 0, delay: a.delay ?? 0, ...a };
    if (reduced) an.dur = 0.001;
    if (an.inst) an.inst.anim = an;
    if (an.obj) an.obj.userData.anim = an;
    anims.push(an);
  };
  const disposeObj = (o: THREE.Object3D) => {
    o.removeFromParent();
    o.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.geometry && !m.userData.sharedGeo) m.geometry.dispose();
    });
  };
  const stepAnims = (dt: number) => {
    for (let i = anims.length - 1; i >= 0; i--) {
      const a = anims[i];
      const owner = a.inst ? a.inst.anim : a.obj?.userData.anim;
      if (owner !== a) {
        anims.splice(i, 1);
        continue;
      }
      if (a.delay > 0) {
        a.delay -= dt;
        continue;
      }
      a.t += dt;
      const p = clamp(a.t / a.dur, 0, 1);
      const k = a.grow ? easeOutBack(p) : 1 - p * p;
      if (a.inst) {
        a.inst.k = k;
        a.inst.pool.write(a.inst);
      } else if (a.obj) a.obj.scale.setScalar(Math.max(1e-4, k));
      if (p >= 1) {
        anims.splice(i, 1);
        if (a.inst) a.inst.anim = undefined;
        if (a.obj) a.obj.userData.anim = undefined;
        a.done?.();
      }
    }
  };

  /* ---------- sound */
  const sfx = createSfx();
  let brushBed: ReturnType<typeof sfx.bed> | null = null;
  let waveBed: ReturnType<typeof sfx.bed> | null = null;
  const ensureAudio = () => {
    if (brushBed) return;
    brushBed = sfx.bed(900, 0.6, 'bandpass');
    waveBed = sfx.bed(420, 0.4, 'lowpass');
  };
  let lastPluck = 0;
  let clock = 0;
  const pluck = (kind: K, seed: number) => {
    if (clock - lastPluck < 0.07) return;
    lastPluck = clock;
    const f = st.notes[Math.floor(seed * st.notes.length) % st.notes.length];
    if (kind === K.House || kind === K.Mill || kind === K.Bridge) sfx.tone({ freq: f, dur: 0.55, type: 'triangle', gain: 0.045, attack: 0.004 });
    else if (kind === K.Field || kind === K.Chinampa) sfx.tone({ freq: f / 2, dur: 0.4, type: 'sine', gain: 0.05, attack: 0.004 });
    else sfx.tone({ freq: f * 2, dur: 0.25, type: 'sine', gain: 0.022, attack: 0.003 });
  };

  /* ---------- cells */
  const cells: Cell[] = Array.from({ length: G * G }, () => ({ kind: K.None, sig: -1, obj: null, inst: [], shoreTrees: 0 }));
  const reserved = new Uint8Array(G * G);
  const dirty = new Set<number>();
  const cxw = (c: number) => -HALF + c + 0.5;
  const inG = (cx: number, cz: number) => cx >= 0 && cz >= 0 && cx < G && cz < G;
  const cellH = (cx: number, cz: number) => heightAt(cxw(cx), cxw(cz));
  const isWater = (cx: number, cz: number) => !inG(cx, cz) || cellH(cx, cz) < -0.03;
  const isTown = (cx: number, cz: number) => inG(cx, cz) && cellH(cx, cz) > 0.05 && sample(Tf, cxw(cx), cxw(cz)) > 0.45;
  const seedLand = new Uint8Array(G * G);
  for (let c = 0; c < G * G; c++) seedLand[c] = cellH(c % G, (c / G) | 0) > 0.02 ? 1 : 0;

  /** What a cell wants to be now: [kind, sub-variant]. */
  const desired = (cx: number, cz: number): [K, number] => {
    const ci = cz * G + cx;
    if (reserved[ci]) return [K.Reserved, 0];
    const x = cxw(cx);
    const z = cxw(cz);
    const h0 = heightAt(x, z);
    let mn = h0;
    let mx = h0;
    for (const [dx, dz] of [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]]) {
      const hh = heightAt(x + dx, z + dz);
      mn = Math.min(mn, hh);
      mx = Math.max(mx, hh);
    }
    const land = mn > 0.03;
    const flat = mx - mn < 0.3 && mx < 1.3;
    const t = sample(Tf, x, z);
    const f = sample(Ff, x, z);
    const r = sample(Rf, x, z);
    if (land && flat && t > 0.45) return [K.House, 0];
    if (f > 0.45) {
      if (land && flat) return st.windmill && hash(cx, cz, 5) < 0.07 ? [K.Mill, 0] : [K.Field, 0];
      if (st.chinampas && mx < 0.0 && mn > -1.0) return [K.Chinampa, 0];
    }
    if (r > 0.35 && h0 > 0.02) {
      const n = r > 0.8 ? 3 : r > 0.55 ? 2 : 1;
      const zone = h0 > 0.75 ? 2 : h0 < 0.2 || isWater(cx + 1, cz) || isWater(cx - 1, cz) || isWater(cx, cz + 1) || isWater(cx, cz - 1) ? 0 : 1;
      return [K.Trees, n * 4 + zone];
    }
    if (st.bridge && h0 < -0.03) {
      // a crossing of 1–3 water cells with town on both banks; only every fourth row, so the
      // river is not one long deck
      for (const ax of [0, 1]) {
        const dx = ax === 0 ? 1 : 0;
        const dz = 1 - dx;
        if ((ax === 0 ? cz : cx) % 4 !== 1) continue;
        let back = 0;
        while (back < 3 && isWater(cx - (back + 1) * dx, cz - (back + 1) * dz) && inG(cx - (back + 1) * dx, cz - (back + 1) * dz)) back++;
        let fwd = 0;
        while (fwd < 3 && isWater(cx + (fwd + 1) * dx, cz + (fwd + 1) * dz) && inG(cx + (fwd + 1) * dx, cz + (fwd + 1) * dz)) fwd++;
        const n = back + fwd + 1;
        if (n <= 3 && isTown(cx - (back + 1) * dx, cz - (back + 1) * dz) && isTown(cx + (fwd + 1) * dx, cz + (fwd + 1) * dz)) return [K.Bridge, ax * 16 + n * 4 + back];
      }
    }
    return [K.None, 0];
  };

  const baseY = (cx: number, cz: number) => {
    const x = cxw(cx);
    const z = cxw(cz);
    let mn = heightAt(x, z);
    for (const [dx, dz] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) mn = Math.min(mn, heightAt(x + dx, z + dz));
    return mn;
  };

  const facing = (cx: number, cz: number) => {
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const start = Math.floor(hash(cx, cz, 2) * 4);
    if (st.orient === 'free') return hash(cx, cz, 3) * Math.PI * 2;
    if (st.orient === 'water')
      for (let d = 1; d <= 3; d++)
        for (let j = 0; j < 4; j++) {
          const [dx, dz] = dirs[(start + j) % 4];
          if (isWater(cx + dx * d, cz + dz * d)) return Math.atan2(dx, dz);
        }
    const [dx, dz] = dirs[start];
    return Math.atan2(dx, dz);
  };

  const clearCell = (c: Cell) => {
    if (c.obj) {
      const o = c.obj;
      animate({ obj: o, grow: false, dur: 0.25, done: () => disposeObj(o) });
      spinners.delete(o.userData.sails);
    }
    for (const it of c.inst) animate({ inst: it, grow: false, dur: 0.22, done: () => it.pool.remove(it) });
    c.obj = null;
    c.inst = [];
    c.shoreTrees = 0;
  };

  const spinners = new Set<THREE.Object3D>();
  const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

  const buildCell = (cx: number, cz: number, c: Cell, kind: K, sub: number) => {
    const x = cxw(cx);
    const z = cxw(cz);
    const rng = mulberry((cx * 7919 + cz * 104729 + 13) >>> 0);
    const delay = rng() * 0.25;
    c.kind = kind;
    if (kind === K.House) {
      let nb = 0;
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) if ((dx || dz) && isTown(cx + dx, cz + dz)) nb++;
      const waterside = isWater(cx + 1, cz) || isWater(cx - 1, cz) || isWater(cx, cz + 1) || isWater(cx, cz - 1);
      const k = new Kit();
      st.house(k, { rng, neighbours: nb, waterside });
      const m = new THREE.Mesh(k.build(), matB);
      m.castShadow = true;
      m.receiveShadow = true;
      m.position.set(x, baseY(cx, cz), z);
      m.rotation.y = facing(cx, cz);
      m.scale.setScalar(1e-4);
      scene.add(m);
      c.obj = m;
      animate({ obj: m, grow: true, dur: 0.5, delay });
    } else if (kind === K.Mill && st.windmill) {
      const w = st.windmill(rng);
      const g = new THREE.Group();
      const body = new THREE.Mesh(w.body, matB);
      body.castShadow = body.receiveShadow = true;
      const sails = new THREE.Mesh(w.sails, matB);
      sails.castShadow = true;
      sails.position.copy(w.hub);
      sails.rotation.z = rng() * 6;
      g.add(body, sails);
      g.userData.sails = sails;
      g.position.set(x, baseY(cx, cz), z);
      g.rotation.y = facing(cx, cz) + Math.PI * 0.25;
      g.scale.setScalar(1e-4);
      scene.add(g);
      spinners.add(sails);
      c.obj = g;
      animate({ obj: g, grow: true, dur: 0.6, delay });
    } else if (kind === K.Field || kind === K.Chinampa) {
      const onWater = kind === K.Chinampa;
      const rot = hash(cx, cz, 4) < 0.5 ? 0 : Math.PI / 2;
      const cr = Math.cos(rot);
      const sr = Math.sin(rot);
      for (const b of st.field(rng, onWater)) {
        const px = x + b.x * cr + b.z * sr;
        const pz = z - b.x * sr + b.z * cr;
        const dy = b.y ?? 0;
        const pos = v3(px, onWater ? dy : heightAt(px, pz) - 0.015 + dy, pz);
        const it = beds.add(pos, rot, v3(b.w, b.h, b.d), new THREE.Color(b.color), onWater ? dy : dy - 0.015, onWater);
        if (it) {
          c.inst.push(it);
          animate({ inst: it, grow: true, dur: 0.45, delay });
        }
      }
      if (onWater && st.trees.chinampa && rng() < 0.55) {
        const p = treePools[st.trees.chinampa];
        const sx = rng() < 0.5 ? -0.4 : 0.4;
        const pos = v3(x + sx * cr, 0.1, z - sx * sr);
        const s = 0.8 + rng() * 0.4;
        const it = p.add(pos, rng() * 6, v3(s, s, s), new THREE.Color(1, 1, 1).multiplyScalar(0.9 + rng() * 0.2), 0.1, true);
        if (it) {
          c.inst.push(it);
          animate({ inst: it, grow: true, dur: 0.5, delay: delay + 0.15 });
        }
      }
    } else if (kind === K.Trees) {
      const n = sub >> 2;
      const zone = sub & 3;
      const list = zone === 0 ? st.trees.shore : zone === 2 ? st.trees.hill : st.trees.land;
      for (let j = 0; j < n; j++) {
        const name = list[Math.floor(rng() * list.length)];
        const px = x + (rng() - 0.5) * 0.7;
        const pz = z + (rng() - 0.5) * 0.7;
        const s = 0.75 + rng() * 0.5;
        const col = new THREE.Color(1, 1, 1).multiplyScalar(0.86 + rng() * 0.26);
        col.r *= 1 + (rng() - 0.5) * 0.12;
        const it = treePools[name].add(v3(px, heightAt(px, pz) - 0.03, pz), rng() * 6.28, v3(s, s * (0.85 + rng() * 0.3), s), col, -0.03);
        if (it) {
          c.inst.push(it);
          if (zone === 0) c.shoreTrees++;
          animate({ inst: it, grow: true, dur: 0.5, delay: delay + j * 0.08 });
        }
      }
    } else if (kind === K.Bridge && st.bridge) {
      const k = new Kit();
      st.bridge(k, sub & 3, (sub >> 2) & 3);
      const m = new THREE.Mesh(k.build(), matB);
      m.castShadow = m.receiveShadow = true;
      m.position.set(x, 0, z);
      m.rotation.y = sub >= 16 ? -Math.PI / 2 : 0;
      m.scale.setScalar(1e-4);
      scene.add(m);
      c.obj = m;
      animate({ obj: m, grow: true, dur: 0.5, delay });
    }
    if (kind !== K.None && kind !== K.Reserved) pluck(kind, rng());
  };

  /** Keep what a cell holds sitting on the ground after the terrain under it moved. */
  const resettle = (cx: number, cz: number, c: Cell) => {
    if (c.obj && c.kind !== K.Bridge) c.obj.position.y = baseY(cx, cz);
    for (const it of c.inst) {
      if (it.abs) continue;
      it.pos.y = heightAt(it.pos.x, it.pos.z) + it.dy;
      it.pool.write(it);
    }
  };

  const processCells = (max: number) => {
    let n = 0;
    for (const ci of dirty) {
      dirty.delete(ci);
      const cx = ci % G;
      const cz = (ci / G) | 0;
      const c = cells[ci];
      const [kind, sub] = desired(cx, cz);
      const sig = kind * 64 + sub;
      if (c.sig === sig) resettle(cx, cz, c);
      else {
        const wasHouse = c.kind === K.House;
        clearCell(c);
        c.kind = K.None;
        c.sig = sig;
        buildCell(cx, cz, c, kind, sub);
        // neighbours may now face this house, or a bridge may now span to it
        if (wasHouse !== (kind === K.House) && st.bridge)
          for (let dz = -4; dz <= 4; dz++) for (let dx = -4; dx <= 4; dx++) if ((dx || dz) && inG(cx + dx, cz + dz) && (dx === 0 || dz === 0)) dirty.add((cz + dz) * G + cx + dx);
      }
      if (++n >= max) break;
    }
  };
  for (let c = 0; c < G * G; c++) dirty.add(c);

  /* ---------- landmark */
  const lmKit = new Kit();
  st.buildLandmark(lmKit);
  const lmGeo = lmKit.build();
  const ghost = new THREE.Mesh(lmGeo, ghostMat);
  ghost.userData.sharedGeo = true;
  ghost.visible = false;
  scene.add(ghost);
  let lm: { cx: number; cz: number; ry: number; obj: THREE.Mesh } | null = null;
  const lmY = () => 0.34;

  const setLandmark = (spot: { cx: number; cz: number; ry: number } | null, flatten: boolean) => {
    for (let i = 0; i < reserved.length; i++) if (reserved[i]) dirty.add(i);
    reserved.fill(0);
    if (lm) {
      const o = lm.obj;
      animate({ obj: o, grow: false, dur: 0.3, done: () => o.removeFromParent() });
      lm = null;
    }
    if (!spot) return;
    const { cx, cz, ry } = spot;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) reserved[(cz + dz) * G + cx + dx] = 1;
    const x = cxw(cx);
    const z = cxw(cz);
    if (flatten) {
      const fx0 = Math.max(0, Math.floor((x - 2.6 + HALF) / CELL));
      const fx1 = Math.min(N - 1, Math.ceil((x + 2.6 + HALF) / CELL));
      const fz0 = Math.max(0, Math.floor((z - 2.6 + HALF) / CELL));
      const fz1 = Math.min(N - 1, Math.ceil((z + 2.6 + HALF) / CELL));
      for (let iz = fz0; iz <= fz1; iz++)
        for (let ix = fx0; ix <= fx1; ix++) {
          const i = iz * N + ix;
          const ax = Math.abs(wx(ix) - x);
          const az = Math.abs(wx(iz) - z);
          const d = Math.pow(ax ** 4 + az ** 4, 0.25); // a rounded square
          const w = clamp((2.5 - d) / 1.0, 0, 1);
          Lf[i] += (1 - Lf[i]) * w;
          Tf[i] *= 1 - w;
          Ff[i] *= 1 - w;
          Rf[i] *= 1 - w;
        }
      touch(fx0, fz0, fx1, fz1);
    }
    const m = new THREE.Mesh(lmGeo, matB);
    m.userData.sharedGeo = true;
    m.castShadow = m.receiveShadow = true;
    m.position.set(x, lmY(), z);
    m.rotation.y = ry;
    m.scale.setScalar(1e-4);
    scene.add(m);
    lm = { cx, cz, ry, obj: m };
    animate({ obj: m, grow: true, dur: 1.1 });
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) dirty.add((cz + dz) * G + cx + dx);
    if (propObj && Math.abs(propObj.position.x - x) < 2 && Math.abs(propObj.position.z - z) < 2) removeProp();
  };

  /* ---------- undo */
  const undoStack: Snapshot[] = [];
  const snapshot = (): Snapshot => ({ L: Lf.slice(), T: Tf.slice(), F: Ff.slice(), R: Rf.slice(), lm: lm && { cx: lm.cx, cz: lm.cz, ry: lm.ry }, prop: !!propObj });
  const pushUndo = (snap = snapshot()) => {
    undoStack.push(snap);
    if (undoStack.length > 30) undoStack.shift();
    undoBtn.disabled = false;
  };
  const undo = (quiet = false) => {
    const s = undoStack.pop();
    undoBtn.disabled = undoStack.length === 0;
    if (!s) return;
    Lf.set(s.L);
    Tf.set(s.T);
    Ff.set(s.F);
    Rf.set(s.R);
    if ((s.lm?.cx ?? -1) !== (lm?.cx ?? -1) || (s.lm?.cz ?? -1) !== (lm?.cz ?? -1)) setLandmark(s.lm, false);
    if (s.prop) placeProp();
    touch(0, 0, N - 1, N - 1);
    if (!quiet) sfx.tone({ freq: 520, to: 340, dur: 0.18, type: 'sine', gain: 0.05 });
  };

  /* ---------- camera */
  const cam = { yaw: 0.62, pitch: 0.64, dist: 33, tx: 0, tz: 1 };
  const goal = { ...cam };
  cam.dist = 62;
  cam.yaw = 1.4;
  cam.pitch = 0.95;
  const fit = () => {
    const a = stage.size.w / stage.size.h;
    return a < 1 ? Math.pow(1 / a, 0.75) : 1;
  };
  const updateCamera = (dt: number) => {
    const k = reduced ? 1 : 1 - Math.exp(-dt * 6);
    cam.yaw += (goal.yaw - cam.yaw) * k;
    cam.pitch += (goal.pitch - cam.pitch) * k;
    cam.dist += (goal.dist - cam.dist) * k;
    cam.tx += (goal.tx - cam.tx) * k;
    cam.tz += (goal.tz - cam.tz) * k;
    const d = cam.dist * fit();
    camera.position.set(cam.tx + Math.sin(cam.yaw) * Math.cos(cam.pitch) * d, Math.sin(cam.pitch) * d, cam.tz + Math.cos(cam.yaw) * Math.cos(cam.pitch) * d);
    camera.lookAt(cam.tx, 0.4, cam.tz);
  };
  const pan = (dx: number, dz: number) => {
    const c = Math.cos(goal.yaw);
    const s = Math.sin(goal.yaw);
    goal.tx = clamp(goal.tx + dx * c + dz * s, -14, 14);
    goal.tz = clamp(goal.tz - dx * s + dz * c, -14, 14);
  };

  /* ---------- picking and painting */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const surf = (x: number, z: number) => Math.max(0, heightAt(x, z));
  const pick = (clientX: number, clientY: number): THREE.Vector3 | null => {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const o = ray.ray.origin;
    const d = ray.ray.direction;
    if (d.y > -0.01) return null;
    let t = Math.max(0, (4.5 - o.y) / d.y);
    const tEnd = -o.y / d.y;
    let prev = t;
    let hit = false;
    for (let i = 0; i < 600 && t <= tEnd; i++) {
      if (o.y + d.y * t <= surf(o.x + d.x * t, o.z + d.z * t)) {
        let a = prev;
        let b = t;
        for (let j = 0; j < 10; j++) {
          const m = (a + b) / 2;
          if (o.y + d.y * m <= surf(o.x + d.x * m, o.z + d.z * m)) b = m;
          else a = m;
        }
        t = b;
        hit = true;
        break;
      }
      prev = t;
      t += 0.1;
    }
    if (!hit) t = tEnd;
    const p = new THREE.Vector3(o.x + d.x * t, 0, o.z + d.z * t);
    if (Math.abs(p.x) > HALF - 0.5 || Math.abs(p.z) > HALF - 0.5) return null;
    p.y = surf(p.x, p.z);
    return p;
  };

  let tool: ToolId = 'land';
  let size = 1;
  let hintUntil = 0;
  let hintText = '';
  const hint = (o: L10n, tone: Tone = 'warn') => {
    hintText = tx(o);
    hintUntil = clock + 2.6;
    coach.say(hintText, tone);
  };

  const applyBrush = (p: THREE.Vector3, dt: number) => {
    const R = BRUSH[size];
    const r2 = R * R;
    const x0 = Math.max(0, Math.floor((p.x - R + HALF) / CELL));
    const x1 = Math.min(N - 1, Math.ceil((p.x + R + HALF) / CELL));
    const z0 = Math.max(0, Math.floor((p.z - R + HALF) / CELL));
    const z1 = Math.min(N - 1, Math.ceil((p.z + R + HALF) / CELL));
    const rate = dt * 3.4;
    // the landmark stands on its own levelled court: terrain brushes leave that ground alone
    const lx = lm ? cxw(lm.cx) : 0;
    const lz = lm ? cxw(lm.cz) : 0;
    const onCourt = (i: number) => !!lm && Math.abs(wx(i % N) - lx) < 1.75 && Math.abs(wx((i / N) | 0) - lz) < 1.75;
    const mask = (up: Float32Array, i: number, w: number) => {
      up[i] = Math.min(1, up[i] + w * rate * 1.6);
      for (const o of [Tf, Ff, Rf]) if (o !== up) o[i] = Math.max(0, o[i] - w * rate * 1.6);
    };
    for (let iz = z0; iz <= z1; iz++)
      for (let ix = x0; ix <= x1; ix++) {
        const dx = wx(ix) - p.x;
        const dz = wx(iz) - p.z;
        const d2 = dx * dx + dz * dz;
        if (d2 > r2) continue;
        const w0 = 1 - d2 / r2;
        const w = w0 * w0;
        const i = iz * N + ix;
        switch (tool) {
          case 'land':
            if (Lf[i] < 1 && !onCourt(i)) Lf[i] = Math.min(1, Lf[i] + w * rate);
            break;
          case 'hill':
            if (!onCourt(i)) Lf[i] = Math.min(3.4, Lf[i] + w * rate * (Lf[i] < 1 ? 1 : 0.32));
            break;
          case 'water':
            if (Lf[i] > st.floorL && !onCourt(i)) Lf[i] = Math.max(st.floorL, Lf[i] - w * rate * (Lf[i] > 1.2 ? 0.5 : 1));
            break;
          case 'houses':
            mask(Tf, i, w);
            break;
          case 'fields':
            mask(Ff, i, w);
            break;
          case 'trees':
            mask(Rf, i, w);
            break;
          case 'erase':
            for (const o of [Tf, Ff, Rf]) o[i] = Math.max(0, o[i] - w * rate * 2);
            break;
          default:
            break;
        }
      }
    touch(x0, z0, x1, z1);
    const hgt = heightAt(p.x, p.z);
    if (tool === 'houses' && hgt < 0.05) hint({ en: 'Houses need dry, flat land: paint <b>Land</b> here first.', zh: '房屋要建在干燥平坦的陆地上：先在这里画<b>陆地</b>。' });
    else if (tool === 'houses' && hgt > 1.3) hint({ en: 'Too steep for houses. Plant <b>Trees</b> on the hills.', zh: '山坡太陡，建不了房屋。山上可以种<b>树木</b>。' });
    else if (tool === 'fields' && hgt < 0.03 && !st.chinampas) hint({ en: 'Fields need land: paint <b>Land</b> first.', zh: '田地要在陆地上：先画<b>陆地</b>。' });
  };

  /* ---------- boats */
  const boats: Boat[] = [];
  const nav = (x: number, z: number) => Math.abs(x) < HALF - 1.2 && Math.abs(z) < HALF - 1.2 && heightAt(x, z) < -0.22;
  /** Open water all the way from a to b, so a boat does not set course across an island. */
  const clear = (ax: number, az: number, bx: number, bz: number) => {
    const n = Math.ceil(Math.hypot(bx - ax, bz - az) / 0.45);
    for (let i = 1; i <= n; i++) if (!nav(ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n)) return false;
    return true;
  };
  const boatRng = mulberry(4242);
  const newTarget = (b: Boat) => {
    for (let i = 0; i < 40; i++) {
      const x = b.x + (boatRng() - 0.5) * 18;
      const z = b.z + (boatRng() - 0.5) * 18;
      if (nav(x, z) && (i > 30 || clear(b.x, b.z, x, z))) {
        b.tx = x;
        b.tz = z;
        return;
      }
    }
    b.tx = b.x;
    b.tz = b.z;
  };
  const spawnBoat = () => {
    // near a house by the water if there is one
    const town: number[] = [];
    for (let c = 0; c < G * G; c++) if (cells[c].kind === K.House) town.push(c);
    for (let tries = 0; tries < 60; tries++) {
      let x: number;
      let z: number;
      if (town.length && tries < 40) {
        const c = town[Math.floor(boatRng() * town.length)];
        x = cxw(c % G) + (boatRng() - 0.5) * 6;
        z = cxw((c / G) | 0) + (boatRng() - 0.5) * 6;
      } else {
        x = (boatRng() - 0.5) * 34;
        z = (boatRng() - 0.5) * 34;
      }
      if (!nav(x, z)) continue;
      const k = new Kit();
      st.boat(k, boatRng);
      const m = new THREE.Mesh(k.build(), matB);
      m.castShadow = true;
      m.scale.setScalar(1e-4);
      scene.add(m);
      const b: Boat = { obj: m, x, z, head: boatRng() * 6.28, speed: 0.5 + boatRng() * 0.5, tx: x, tz: z, phase: boatRng() * 6, leaving: false };
      newTarget(b);
      boats.push(b);
      animate({ obj: m, grow: true, dur: 0.8 });
      return;
    }
  };
  let boatTimer = 0;
  const stepBoats = (dt: number, t: number, target: number) => {
    boatTimer -= dt;
    const live = boats.filter((b) => !b.leaving).length;
    if (boatTimer <= 0 && live < target) {
      spawnBoat();
      boatTimer = 1.2;
    } else if (boatTimer <= 0 && live > target) {
      const b = boats.find((x) => !x.leaving);
      if (b) {
        b.leaving = true;
        animate({ obj: b.obj, grow: false, dur: 0.6, done: () => disposeObj(b.obj) });
      }
      boatTimer = 0.8;
    }
    for (let i = boats.length - 1; i >= 0; i--) {
      const b = boats[i];
      if (b.leaving && !b.obj.parent) {
        boats.splice(i, 1);
        continue;
      }
      // (a boat already sinking away must not restart its shrink every frame, or it never goes)
      if (!b.leaving && !nav(b.x, b.z)) {
        // land was painted under it
        b.leaving = true;
        animate({ obj: b.obj, grow: false, dur: 0.4, done: () => disposeObj(b.obj) });
        continue;
      }
      const dx = b.tx - b.x;
      const dz = b.tz - b.z;
      if (dx * dx + dz * dz < 1) newTarget(b);
      const want = Math.atan2(-dz, dx);
      let dh = want - b.head;
      dh = Math.atan2(Math.sin(dh), Math.cos(dh));
      b.head += clamp(dh, -dt * 0.9, dt * 0.9);
      const sp = b.speed * (Math.abs(dh) > 1.2 ? 0.3 : 1);
      const nx = b.x + Math.cos(b.head) * sp * dt;
      const nz = b.z - Math.sin(b.head) * sp * dt;
      if (nav(nx, nz)) {
        b.x = nx;
        b.z = nz;
      } else newTarget(b);
      const bob = reduced ? 0 : Math.sin(t * 1.7 + b.phase) * 0.02;
      b.obj.position.set(b.x, 0.02 + bob, b.z);
      b.obj.rotation.set(reduced ? 0 : Math.sin(t * 1.3 + b.phase) * 0.04, b.head, 0);
    }
  };

  /* ---------- brush cursor */
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fff', transparent: true, opacity: 0.85, depthTest: false, depthWrite: false, fog: false }));
  ring.renderOrder = 10;
  ring.visible = false;
  scene.add(ring);

  /* ---------- HUD */
  const hud = h('div', 'g-hud bi-hud', root);
  h('div', 'g-title', hud, tx(GAME_BY_ID[GAME_ID[st.id]].kicker));
  const coach = createCoach(hud, GAME_BY_ID[GAME_ID[st.id]], lang);
  const toast = makeToast(hud);
  const bar = h('div', 'bi-bar', hud);
  const toolsEl = h('div', 'bi-tools', bar);
  toolsEl.setAttribute('role', 'toolbar');
  toolsEl.setAttribute('aria-label', lang === 'zh' ? '画笔' : 'Brushes');
  const toolBtns = {} as Record<ToolId, HTMLButtonElement>;
  TOOLS.forEach((id, i) => {
    const label = id === 'landmark' ? tx(st.landmark.short) : tx(TOOL_LABEL[id]);
    const b = h('button', 'bi-tool', toolsEl, `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg><span>${label}</span><kbd>${i + 1}</kbd>`);
    b.style.setProperty('--tc', CURSOR[id]);
    b.title = `${label} (${i + 1})`;
    b.setAttribute('aria-keyshortcuts', String(i + 1));
    b.onclick = () => setTool(id);
    toolBtns[id] = b;
  });
  // ARIA toolbar: one tab stop (the chosen brush), arrow keys move along the row
  const onToolKey = (e: KeyboardEvent) => {
    const i = TOOLS.findIndex((t) => toolBtns[t] === document.activeElement);
    if (i < 0) return;
    const j = e.key === 'ArrowRight' ? (i + 1) % TOOLS.length : e.key === 'ArrowLeft' ? (i + TOOLS.length - 1) % TOOLS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TOOLS.length - 1 : -1;
    if (j < 0) return;
    e.preventDefault();
    e.stopPropagation(); // not a camera pan
    setTool(TOOLS[j]);
    toolBtns[TOOLS[j]].focus();
  };
  toolsEl.addEventListener('keydown', onToolKey);
  const side = h('div', 'bi-side', bar);
  const sizes = h('div', 'bi-sizes', side);
  sizes.setAttribute('role', 'group');
  sizes.setAttribute('aria-label', lang === 'zh' ? '笔刷大小 ([ ])' : 'Brush size ([ ])');
  const sizeBtns = [0, 1, 2].map((s) => {
    const b = h('button', 'bi-size', sizes, `<i style="width:${6 + s * 5}px;height:${6 + s * 5}px"></i>`);
    b.setAttribute('aria-label', [lang === 'zh' ? '小笔刷' : 'Small brush', lang === 'zh' ? '中笔刷' : 'Medium brush', lang === 'zh' ? '大笔刷' : 'Large brush'][s]);
    b.onclick = () => setSize(s);
    return b;
  });
  const undoBtn = h('button', 'bi-icon', side, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4 12l5 5M4 12h10a6 6 0 010 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -3)"/></svg>');
  undoBtn.setAttribute('aria-label', lang === 'zh' ? '撤销 (Z)' : 'Undo (Z)');
  undoBtn.title = undoBtn.getAttribute('aria-label')!;
  undoBtn.disabled = true;
  undoBtn.onclick = () => undo();
  const rotL = h('button', 'bi-icon', side, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 11-3-6.2M17 2v4h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  rotL.setAttribute('aria-label', lang === 'zh' ? '向左转 (Q)' : 'Turn left (Q)');
  rotL.title = rotL.getAttribute('aria-label')!;
  rotL.onclick = () => (goal.yaw -= Math.PI / 4);
  const rotR = h('button', 'bi-icon', side, '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 103-6.2M7 2v4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  rotR.setAttribute('aria-label', lang === 'zh' ? '向右转 (E)' : 'Turn right (E)');
  rotR.title = rotR.getAttribute('aria-label')!;
  rotR.onclick = () => (goal.yaw += Math.PI / 4);
  const finishBtn = h('button', 'g-btn bi-finish', side, lang === 'zh' ? '完成' : 'Finish');
  finishBtn.onclick = () => finish();

  const setTool = (id: ToolId) => {
    tool = id;
    for (const t of TOOLS) {
      toolBtns[t].classList.toggle('on', t === id);
      toolBtns[t].setAttribute('aria-pressed', String(t === id));
      toolBtns[t].tabIndex = t === id ? 0 : -1;
    }
    ring.material.color.set(CURSOR[id]);
    ghost.visible = false;
  };
  const setSize = (s: number) => {
    size = clamp(s, 0, 2);
    sizeBtns.forEach((b, i) => {
      b.classList.toggle('on', i === size);
      b.setAttribute('aria-pressed', String(i === size));
    });
  };
  setTool('land');
  setSize(1);

  /* ---------- input */
  const el = renderer.domElement;
  el.classList.add('bi-canvas');
  const ptrs = new Map<number, { x: number; y: number }>();
  let mode: 'none' | 'paint' | 'orbit' | 'pan' | 'gesture' = 'none';
  let last = { x: 0, y: 0 };
  let gest = { d: 1, a: 0, mx: 0, my: 0 };
  let hover: THREE.Vector3 | null = null;
  let hoverXY: { x: number; y: number } | null = null;
  let ended = false;
  let painting = false;
  // The undo snapshot of the stroke in progress: pushed only once the brush first touches the
  // map, so a click on the sky or a stray tap leaves no empty undo step.
  let strokeSnap: Snapshot | null = null;
  let strokeT0 = 0;

  const gestureState = () => {
    const [a, b] = [...ptrs.values()];
    return { d: Math.hypot(b.x - a.x, b.y - a.y) || 1, a: Math.atan2(b.y - a.y, b.x - a.x), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  };
  const landmarkSpot = (p: THREE.Vector3) => {
    // kept off the map's rim, where the ground falls away to the sea and flattening can't hold it
    const cx = clamp(Math.floor(p.x + HALF), 4, G - 5);
    const cz = clamp(Math.floor(p.z + HALF), 4, G - 5);
    const ry = Math.round(cam.yaw / (Math.PI / 2)) * (Math.PI / 2);
    return { cx, cz, ry };
  };
  const timers: number[] = [];
  const placeLandmark = (p: THREE.Vector3) => {
    pushUndo();
    const first = !lm;
    setLandmark(landmarkSpot(p), true);
    // (tracked: a chime firing after dispose would open a fresh AudioContext that nothing closes)
    st.notes.slice(0, 3).forEach((f, i) => timers.push(window.setTimeout(() => sfx.tone({ freq: f, dur: 1.4, type: 'triangle', gain: 0.05 }), i * 110)));
    if (first) toast(tx(st.landmark.name), tx(st.landmark.note), 4200);
  };

  const onDown = (e: PointerEvent) => {
    el.setPointerCapture(e.pointerId);
    ensureAudio();
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    last = { x: e.clientX, y: e.clientY };
    if (ptrs.size === 2) {
      // The first finger of a pinch has already started a stroke: if it is that young, it was
      // never meant as paint, so take it back.
      if (painting) {
        const pushed = !strokeSnap;
        endStroke();
        if (pushed && clock - strokeT0 < 0.4) undo(true);
      }
      mode = 'gesture';
      gest = gestureState();
      return;
    }
    if (ptrs.size > 2) return;
    if (ended || (e.pointerType === 'mouse' && e.button === 2)) {
      mode = 'orbit';
      return;
    }
    if (e.pointerType === 'mouse' && (e.button === 1 || e.shiftKey)) {
      mode = 'pan';
      return;
    }
    hoverXY = { x: e.clientX, y: e.clientY };
    hover = pick(e.clientX, e.clientY);
    if (tool === 'landmark') {
      if (hover) placeLandmark(hover);
      mode = 'none';
      return;
    }
    mode = 'paint';
    painting = true;
    strokeSnap = snapshot();
    strokeT0 = clock;
  };
  const onMove = (e: PointerEvent) => {
    const p = ptrs.get(e.pointerId);
    if (p) {
      p.x = e.clientX;
      p.y = e.clientY;
    }
    if (e.pointerType === 'mouse' || mode === 'paint') hoverXY = { x: e.clientX, y: e.clientY };
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    last = { x: e.clientX, y: e.clientY };
    if (mode === 'orbit') {
      goal.yaw -= dx * 0.006;
      goal.pitch = clamp(goal.pitch + dy * 0.004, 0.32, 1.35);
    } else if (mode === 'pan') {
      const s = goal.dist * 0.0016;
      pan(-dx * s, -dy * s);
    } else if (mode === 'gesture' && ptrs.size >= 2) {
      const g = gestureState();
      goal.dist = clamp((goal.dist * gest.d) / g.d, 10, 72);
      let da = g.a - gest.a;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      goal.yaw -= da;
      const s = goal.dist * 0.0016;
      pan(-(g.mx - gest.mx) * s, -(g.my - gest.my) * s);
      gest = g;
    }
  };
  const endStroke = () => {
    painting = false;
    strokeSnap = null;
    brushBed?.set(0);
  };
  const onUp = (e: PointerEvent) => {
    ptrs.delete(e.pointerId);
    if (mode === 'paint') endStroke();
    if (ptrs.size === 0) mode = 'none';
    else if (mode === 'gesture' && ptrs.size === 1) mode = 'none';
    if (e.pointerType !== 'mouse') {
      hoverXY = null;
      hover = null;
    }
  };
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    goal.dist = clamp(goal.dist * Math.exp(e.deltaY * 0.0012), 10, 72);
  };
  const onLeave = () => {
    if (mode !== 'paint') {
      hoverXY = null;
      hover = null;
    }
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLElement && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    // After Finish the city is on show behind the result card: leave it as it was scored.
    if (ended) return;
    // Leave browser shortcuts (Cmd/Ctrl+1…8, +S, +W, +−) alone; Cmd/Ctrl+Z still undoes.
    if (e.metaKey || e.ctrlKey || e.altKey) {
      if (k === 'z' && !e.shiftKey && !e.altKey) {
        undo();
        e.preventDefault();
      }
      return;
    }
    if (/^[1-8]$/.test(k)) setTool(TOOLS[Number(k) - 1]);
    else if (k === '[') setSize(size - 1);
    else if (k === ']') setSize(size + 1);
    else if (k === 'q') goal.yaw -= Math.PI / 4;
    else if (k === 'e') goal.yaw += Math.PI / 4;
    else if (k === 'z') undo();
    else if (k === '=' || k === '+') goal.dist = clamp(goal.dist * 0.85, 10, 72);
    else if (k === '-') goal.dist = clamp(goal.dist / 0.85, 10, 72);
    else if (k === 'arrowleft' || k === 'a') pan(-1.5, 0);
    else if (k === 'arrowright' || k === 'd') pan(1.5, 0);
    else if (k === 'arrowup' || k === 'w') pan(0, -1.5);
    else if (k === 'arrowdown' || k === 's') pan(0, 1.5);
    else if (k === 'h') hud.classList.toggle('bi-clean');
    else return;
    e.preventDefault();
  };
  const noMenu = (e: Event) => e.preventDefault();
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  el.addEventListener('pointerleave', onLeave);
  el.addEventListener('wheel', onWheel, { passive: false });
  el.addEventListener('contextmenu', noMenu);
  window.addEventListener('keydown', onKey);

  /* ---------- stats, coach, scoring */
  const stats = (): Stats => {
    const s: Stats = { houses: 0, fields: 0, chinampas: 0, trees: 0, shoreTrees: 0, bridges: 0, windmills: 0, boats: boats.filter((b) => !b.leaving).length, shaped: 0, landmark: !!lm, landmarkTown: 0 };
    for (let c = 0; c < G * G; c++) {
      const cell = cells[c];
      const cx = c % G;
      const cz = (c / G) | 0;
      if (cell.kind === K.House) {
        s.houses++;
        if (lm && Math.max(Math.abs(cx - lm.cx), Math.abs(cz - lm.cz)) <= 4) s.landmarkTown++;
      } else if (cell.kind === K.Field) s.fields++;
      else if (cell.kind === K.Chinampa) s.chinampas++;
      else if (cell.kind === K.Trees) s.trees += cell.inst.length;
      else if (cell.kind === K.Bridge && (cell.sig & 3) === 0) s.bridges++;
      else if (cell.kind === K.Mill) s.windmills++;
      s.shoreTrees += cell.shoreTrees;
      if ((cellH(cx, cz) > 0.02 ? 1 : 0) !== seedLand[c]) s.shaped++;
    }
    return s;
  };
  let cur = stats();
  let stepShown = -1;
  const updateCoach = () => {
    cur = stats();
    const fieldsAll = cur.fields + cur.chinampas + cur.windmills;
    const d0 = cur.shaped >= GOAL_SHAPED;
    const d1 = cur.houses >= GOAL_HOUSES && fieldsAll >= GOAL_FIELDS;
    const d2 = cur.landmark;
    const step = !d0 ? 0 : !d1 ? 1 : !d2 ? 2 : 3;
    coach.step(step);
    if (step !== stepShown && stepShown >= 0 && step > stepShown) sfx.tone({ freq: st.notes[4], dur: 0.6, type: 'triangle', gain: 0.05 });
    stepShown = step;
    if (clock < hintUntil) return;
    const small = (s: string) => `<small>${s}</small>`;
    if (step === 0) coach.say(`${tx(SHAPE_HINT[st.id])}${small(lang === 'zh' ? `已改造 ${cur.shaped} / ${GOAL_SHAPED} 格` : `${cur.shaped} / ${GOAL_SHAPED} cells reshaped`)}`, 'do', '1');
    else if (step === 1) {
      const chin = st.chinampas ? (lang === 'zh' ? '，画在浅水上就成了浮田（奇南帕）' : ': on shallow water they become chinampas') : '';
      coach.say(
        `${lang === 'zh' ? `在平地上画<b>房屋</b>，再画<b>田地</b>${chin}。` : `Paint <b>Houses</b> on flat land, and <b>Fields</b>${chin}.`}${small(lang === 'zh' ? `房屋 ${cur.houses} / ${GOAL_HOUSES} · 田地 ${fieldsAll} / ${GOAL_FIELDS}` : `houses ${cur.houses} / ${GOAL_HOUSES} · fields ${fieldsAll} / ${GOAL_FIELDS}`)}`,
        'do',
        cur.houses < GOAL_HOUSES ? '4' : '5',
      );
    } else if (step === 2) coach.say(lang === 'zh' ? `选择<b>${tx(st.landmark.name)}</b>，点在城镇的中心。` : `Pick <b>${tx(st.landmark.name)}</b> and tap the heart of your town.`, 'do', '7');
    else coach.say(lang === 'zh' ? `${tx(st.name)}建成了。继续描画，或点<b>完成</b>。` : `${tx(st.name)} is built. Keep painting, or press <b>Finish</b>.`, 'good');
    finishBtn.classList.toggle('g-pulse', step === 3);
  };

  const finish = () => {
    if (ended) return;
    const s = stats();
    const fieldsAll = s.fields + s.chinampas + s.windmills;
    const g0 = s.shaped >= GOAL_SHAPED;
    const g1 = s.houses >= GOAL_HOUSES && fieldsAll >= GOAL_FIELDS;
    const g2 = s.landmark;
    const goals = (g0 ? 15 : 0) + (g1 ? 15 : 0) + (g2 ? 15 : 0);
    const sizeP = Math.round(Math.min(1, s.houses / 60) * 15);
    const fourth = st.bridge ? s.bridges >= 1 : (() => {
      let hill = 0;
      for (let i = 0; i < N * N; i++) if (Hh[i] > 1.4) hill++;
      return hill > 60;
    })();
    const variety = (fieldsAll >= 16 ? 5 : 0) + (s.trees >= 30 ? 5 : 0) + (s.boats >= 3 ? 5 : 0) + (fourth ? 5 : 0);
    const bonus = st.bonus.test(s) ? 10 : 0;
    const heart = s.landmark ? (s.landmarkTown >= 10 ? 10 : s.landmarkTown >= 4 ? 5 : 0) : 0;
    const score = clamp(goals + sizeP + variety + bonus + heart, 0, 100);
    const stars = (score >= 85 ? 3 : score >= 60 ? 2 : score >= 25 ? 1 : 0) as GameResult['stars'];
    const name = st.name;
    const headline: L10n = [
      { en: 'Only the beginnings', zh: '初具雏形' },
      { en: 'A village takes shape', zh: '村落初成' },
      { en: `${name.en} is thriving`, zh: `${name.zh}日渐繁华` },
      { en: `${name.en} in all its glory`, zh: `${name.zh}盛景` },
    ][stars];
    const lines: L10n[] = [
      { en: `${s.houses} houses, ${fieldsAll} fields${s.chinampas ? ` (${s.chinampas} chinampas)` : ''}, ${s.trees} trees, ${s.boats} boats.`, zh: `房屋 ${s.houses} 座，田地 ${fieldsAll} 块${s.chinampas ? `（浮田 ${s.chinampas} 块）` : ''}，树木 ${s.trees} 棵，船 ${s.boats} 艘。` },
      s.landmark
        ? { en: `${st.landmark.name.en} stands with ${s.landmarkTown} houses around it.`, zh: `${st.landmark.name.zh}已建成，周围有 ${s.landmarkTown} 座房屋。` }
        : { en: `No ${st.landmark.name.en} yet: every city here had its centre.`, zh: `还没有建${st.landmark.name.zh}：每座城都有它的中心。` },
      bonus ? { en: `✓ ${st.bonus.label.en}`, zh: `✓ ${st.bonus.label.zh}` } : { en: `Bonus missed: ${st.bonus.label.en}`, zh: `未达成：${st.bonus.label.zh}` },
    ];
    if (st.bridge) lines.push({ en: `${s.bridges} bridge${s.bridges === 1 ? '' : 's'} over the water.`, zh: `水上有 ${s.bridges} 座桥。` });
    ended = true;
    painting = false;
    brushBed?.set(0);
    hud.classList.add('bi-ended');
    coach.hide(true);
    ring.visible = false;
    ghost.visible = false;
    ctx.end({ score, stars, headline, lines });
  };

  /* ---------- frame loop */
  let coachTimer = 0;
  let normalsTimer = 0;
  stage.onFrame((dt, t) => {
    clock = t;
    if (ended && !reduced) goal.yaw += dt * 0.06;
    updateCamera(dt);

    if (hoverXY && !ended) hover = pick(hoverXY.x, hoverXY.y);
    if (painting && hover) {
      if (strokeSnap) {
        pushUndo(strokeSnap);
        strokeSnap = null;
      }
      applyBrush(hover, dt);
      brushBed?.set(0.035, tool === 'water' ? 500 : tool === 'land' || tool === 'hill' ? 750 : 1300);
    } else brushBed?.set(0);
    waveBed?.set(0.02 + Math.sin(t * 0.4) * 0.008);

    normalsTimer -= dt;
    if (dirtyBox && normalsTimer <= 0) {
      writeRegion(...dirtyBox);
      dirtyBox = null;
      normalsTimer = 0.06;
    }
    processCells(painting ? 70 : 120);
    stepAnims(dt);

    const s = cur;
    stepBoats(dt, t, Math.min(14, Math.floor(s.houses / 7) + Math.floor(s.chinampas / 6) + (st.id === 'raiatea' ? 3 : 1)));
    for (const sp of spinners) sp.rotation.z -= dt * (reduced ? 0.3 : 1.1);
    waterU.uT.value = t;

    // brush cursor / landmark ghost
    if (hover && !ended && tool !== 'landmark') {
      ring.visible = true;
      ring.position.set(hover.x, hover.y + 0.04, hover.z);
      ring.scale.setScalar(BRUSH[size]);
      (ring.material as THREE.MeshBasicMaterial).opacity = painting ? 1 : 0.7;
      ghost.visible = false;
    } else if (hover && !ended && tool === 'landmark') {
      ring.visible = false;
      const sp = landmarkSpot(hover);
      ghost.visible = true;
      ghost.position.set(cxw(sp.cx), lmY(), cxw(sp.cz));
      ghost.rotation.y = sp.ry;
    } else {
      ring.visible = false;
      ghost.visible = false;
    }

    coachTimer -= dt;
    if (coachTimer <= 0 && !ended) {
      updateCoach();
      coachTimer = 0.3;
    }
  });

  // Dev hook for screenshots and smoke tests: paint a little town programmatically.
  const devWin = window as unknown as { __isle?: unknown };
  if (import.meta.env.DEV)
    devWin.__isle = {
      paint(toolId: ToolId, x: number, z: number, secs = 0.6, s = 1) {
        const prev = tool;
        const ps = size;
        tool = toolId;
        size = s;
        for (let i = 0; i < Math.round(secs * 30); i++) applyBrush(new THREE.Vector3(x, 0, z), 1 / 30);
        tool = prev;
        size = ps;
      },
      landmark(x: number, z: number) {
        placeLandmark(new THREE.Vector3(x, 0, z));
      },
      view(yaw: number, pitch: number, dist: number, txx = 0, tz = 0) {
        Object.assign(goal, { yaw, pitch, dist, tx: txx, tz });
      },
      stats,
      finish,
    };

  return {
    dispose() {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('contextmenu', noMenu);
      window.removeEventListener('keydown', onKey);
      for (const id of timers) clearTimeout(id);
      if (import.meta.env.DEV) delete devWin.__isle;
      brushBed?.stop();
      waveBed?.stop();
      sfx.dispose();
      hTex.dispose();
      env.dispose();
      ghostMat.dispose();
      stage.dispose();
      hud.remove();
    },
  };
}
