import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/** A three.js renderer + bloom composer that fills `root` and resizes with it. */
export function createStage(root: HTMLElement, opts: { bloom?: { strength: number; radius: number; threshold: number }; fov?: number; logDepth?: boolean } = {}) {
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
    composer.render();
  });

  return {
    renderer,
    scene,
    camera,
    composer,
    bloom,
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
