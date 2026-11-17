import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * Film-style finishing pass, applied after tone mapping (display space): split toning (cool
 * shadows / warm highlights), contrast and saturation, a soft vignette and a little grain.
 * Cheap, and it is most of what makes a real-time scene read as photographed rather than rendered.
 */
export interface Grade {
  /** Colour added to the shadows (linear-ish RGB, small values like 0.02). */
  shadows: [number, number, number];
  /** Multiplier for the highlights. */
  highlights: [number, number, number];
  contrast: number;
  saturation: number;
  vignette: number;
  grain: number;
}
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uShadows: { value: new THREE.Vector3() },
    uHigh: { value: new THREE.Vector3(1, 1, 1) },
    uContrast: { value: 1 },
    uSat: { value: 1 },
    uVig: { value: 0.3 },
    uGrain: { value: 0.03 },
    uTime: { value: 0 },
    uAspect: { value: 1 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform vec3 uShadows; uniform vec3 uHigh; uniform float uContrast, uSat, uVig, uGrain, uTime, uAspect;
    varying vec2 vUv;
    float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      // split toning: tint the darks, scale the brights
      c += uShadows * (1.0 - smoothstep(0.0, 0.55, l));
      c = mix(c, c * uHigh, smoothstep(0.35, 1.0, l));
      c = (c - 0.5) * uContrast + 0.5;
      float l2 = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l2), c, uSat);
      vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);
      c *= 1.0 - uVig * smoothstep(0.35, 1.05, length(q) * 1.15);
      c += (hash(vUv * 1000.0 + fract(uTime) * 17.0) - 0.5) * uGrain;
      gl_FragColor = vec4(max(c, 0.0), 1.0);
    }`,
};

/**
 * A small image-based-lighting environment from a vertical gradient (sky, horizon, ground) plus an
 * optional bright patch for the sun or moon, so standard materials pick up believable reflections.
 */
export function gradientEnv(renderer: THREE.WebGLRenderer, o: { top: string; horizon: string; ground: string; sun?: { dir: THREE.Vector3; color: string; size?: number; power?: number } }) {
  const s = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uT: { value: new THREE.Color(o.top) },
      uH: { value: new THREE.Color(o.horizon) },
      uG: { value: new THREE.Color(o.ground) },
      uS: { value: o.sun ? o.sun.dir.clone().normalize() : new THREE.Vector3(0, 1, 0) },
      uSC: { value: new THREE.Color(o.sun?.color ?? '#000') },
      uSS: { value: o.sun?.size ?? 0.04 },
      uSP: { value: o.sun?.power ?? 0 },
    },
    vertexShader: /* glsl */ `varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uT, uH, uG, uS, uSC; uniform float uSS, uSP; varying vec3 vD;
      void main(){
        float y = vD.y;
        vec3 c = y > 0.0 ? mix(uH, uT, pow(y, 0.55)) : mix(uH, uG, pow(-y, 0.4));
        float d = 1.0 - dot(normalize(vD), uS);
        c += uSC * uSP * (exp(-d / uSS) + 0.15 * exp(-d / (uSS * 12.0)));
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  s.add(new THREE.Mesh(new THREE.SphereGeometry(10, 48, 24), mat));
  const pm = new THREE.PMREMGenerator(renderer);
  const rt = pm.fromScene(s, 0.02);
  pm.dispose();
  mat.dispose();
  return rt.texture;
}

/** A three.js renderer + bloom composer that fills `root` and resizes with it. */
export function createStage(root: HTMLElement, opts: { bloom?: { strength: number; radius: number; threshold: number }; fov?: number; logDepth?: boolean; grade?: Partial<Grade> } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', logarithmicDepthBuffer: !!opts.logDepth });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(opts.fov ?? 45, 1, 0.1, 5000);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const b = opts.bloom ?? { strength: 0.9, radius: 0.6, threshold: 0.7 };
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), b.strength, b.radius, b.threshold);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  const setGrade = (g: Partial<Grade>) => {
    const u = grade.uniforms;
    if (g.shadows) u.uShadows.value.set(...g.shadows);
    if (g.highlights) u.uHigh.value.set(...g.highlights);
    if (g.contrast != null) u.uContrast.value = g.contrast;
    if (g.saturation != null) u.uSat.value = g.saturation;
    if (g.vignette != null) u.uVig.value = g.vignette;
    if (g.grain != null) u.uGrain.value = g.grain;
  };
  setGrade({ shadows: [0, 0, 0], highlights: [1, 1, 1], contrast: 1, saturation: 1, vignette: 0.3, grain: 0.025, ...opts.grade });
  composer.addPass(grade);

  const size = { w: 1, h: 1 };
  const resize = () => {
    const w = Math.max(1, root.clientWidth);
    const h = Math.max(1, root.clientHeight);
    size.w = w;
    size.h = h;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    grade.uniforms.uAspect.value = w / h;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  resize();

  let frame: ((dt: number, t: number) => void) | null = null;
  const timer = new THREE.Timer();
  renderer.setAnimationLoop((ts) => {
    timer.update(ts);
    const dt = Math.min(0.05, timer.getDelta());
    frame?.(dt, timer.getElapsed());
    grade.uniforms.uTime.value = timer.getElapsed();
    composer.render();
  });

  return {
    renderer,
    scene,
    camera,
    composer,
    bloom,
    setGrade,
    size,
    onFrame(f: (dt: number, t: number) => void) {
      frame = f;
    },
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        for (const x of Array.isArray(mat) ? mat : mat ? [mat] : []) {
          for (const v of Object.values(x)) if (v instanceof THREE.Texture) v.dispose();
          x.dispose();
        }
      });
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export type Stage = ReturnType<typeof createStage>;

/** Small DOM helper for HUDs. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, parent?: HTMLElement, html?: string) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

/** A centred caption that fades in, holds and fades out. */
export function makeToast(parent: HTMLElement) {
  const el = h('div', 'g-toast', parent);
  el.setAttribute('role', 'status');
  let timer = 0;
  return (text: string, sub = '', ms = 2600) => {
    el.innerHTML = sub ? `${text}<small>${sub}</small>` : text;
    el.classList.add('show');
    clearTimeout(timer);
    timer = window.setTimeout(() => el.classList.remove('show'), ms);
  };
}

/** Soft round sprite texture for particles. */
export function dotTexture(soft = 0.5) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(soft, 'rgba(255,255,255,0.45)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Small seeded PRNG (mulberry32). */
export function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Four soft, billowing puff shapes in a 2 × 2 atlas, made from layered value noise: used as
 * licks of flame (additive) and as smoke (alpha), each particle picking a tile and a spin.
 */
export function puffAtlas() {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S * 2;
  const g = c.getContext('2d')!;
  const img = g.createImageData(S * 2, S * 2);
  const r = mulberry(31);
  for (let tile = 0; tile < 4; tile++) {
    const grid = Array.from({ length: 4 }, (_, o) => {
      const n = 4 << o;
      return { n, v: Array.from({ length: (n + 1) * (n + 1) }, () => r()) };
    });
    const vn = (x: number, y: number, gr: { n: number; v: number[] }) => {
      const fx = x * gr.n;
      const fy = y * gr.n;
      const ix = Math.floor(fx);
      const iy = Math.floor(fy);
      const ux = fx - ix;
      const uy = fy - iy;
      const sx = ux * ux * (3 - 2 * ux);
      const sy = uy * uy * (3 - 2 * uy);
      const at = (i: number, j: number) => gr.v[Math.min(gr.n, j) * (gr.n + 1) + Math.min(gr.n, i)];
      return (at(ix, iy) * (1 - sx) + at(ix + 1, iy) * sx) * (1 - sy) + (at(ix, iy + 1) * (1 - sx) + at(ix + 1, iy + 1) * sx) * sy;
    };
    const ox = (tile % 2) * S;
    const oy = Math.floor(tile / 2) * S;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const v = y / S;
        const n = vn(u, v, grid[0]) * 0.5 + vn(u, v, grid[1]) * 0.27 + vn(u, v, grid[2]) * 0.15 + vn(u, v, grid[3]) * 0.08;
        const d = Math.hypot(u - 0.5, v - 0.5) * 2;
        const a = clamp((1 - d * (0.75 + n * 0.6)) * 1.6, 0, 1) * (0.55 + n * 0.6);
        const i = ((oy + y) * S * 2 + ox + x) * 4;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
        img.data[i + 3] = Math.round(clamp(a, 0, 1) ** 1.3 * 255);
      }
  }
  g.putImageData(img, 0, 0);
  return new THREE.CanvasTexture(c);
}

