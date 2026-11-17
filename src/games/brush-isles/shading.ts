import * as THREE from 'three';
import type { Style } from './styles';

/**
 * Shader patches for the island's standard materials. Everything here is computed per pixel from
 * the world position, so it costs no textures and follows the terrain as it is painted:
 *
 * - cloud shadows: soft patches of shade drifting over land, buildings and water alike;
 * - ground detail: fine speckle and broad hue patches over the grass, wet sand at the waterline;
 * - streets: the town mask drawn as stucco, brick, flagstones or packed earth, per city;
 * - contact shade: the ground darkens where it meets a wall (an occupancy mask from the cells).
 */

export interface CloudUniforms {
  uCloudT: { value: number };
  uCloudK: { value: number };
  uWind: { value: THREE.Vector2 };
}

export const cloudUniforms = (shadow: number, wind: THREE.Vector3): CloudUniforms => ({
  uCloudT: { value: 0 },
  uCloudK: { value: shadow },
  uWind: { value: new THREE.Vector2(wind.x, wind.z).normalize().multiplyScalar(0.012) },
});

/** Value noise and the cloud-shadow term, shared by every patched shader. */
export const NOISE_GLSL = /* glsl */ `
  float bi_hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float bi_noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(bi_hash(i), bi_hash(i + vec2(1, 0)), f.x), mix(bi_hash(i + vec2(0, 1)), bi_hash(i + vec2(1, 1)), f.x), f.y); }
  uniform float uCloudT, uCloudK; uniform vec2 uWind;
  float cloudShade(vec3 w){
    vec2 p = w.xz * 0.05 + uWind * uCloudT;
    float n = bi_noise(p) * 0.62 + bi_noise(p * 2.3 + 7.1) * 0.38;
    return 1.0 - uCloudK * smoothstep(0.5, 0.7, n);
  }
`;

const VERT_WORLD = /* glsl */ `
  #ifdef USE_INSTANCING
    vBiW = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
  #else
    vBiW = (modelMatrix * vec4(transformed, 1.0)).xyz;
  #endif
`;

/** Only direct sunlight is shaded by a cloud; sky light still fills the shadow in. */
const FRAG_CLOUD = /* glsl */ `
  #include <lights_fragment_end>
  { float cs = cloudShade(vBiW); reflectedLight.directDiffuse *= cs; reflectedLight.directSpecular *= cs; }
`;

/**
 * Cloud shadows on a standard / lambert material (buildings, trees, boats). With `sway`, an
 * instanced mesh also bends in the breeze: the higher a vertex sits in its model, the further it
 * moves, each copy on its own phase (trees, reeds, grass). The lean is worked out in world space,
 * so every copy bends the same way downwind whichever way it was turned.
 *
 * With `lever` the geometry carries `aLever` (see `Kit.build`): trunks keep almost still and each
 * crown, frond or blossom cluster swings and flutters about the point where it joins the tree. The
 * per-copy tint then colours only the leaves; bark keeps just its brightness.
 */
export function patchClouds(mat: THREE.Material, u: CloudUniforms, sway = 0, lever = 0) {
  const lv = sway > 0 && lever > 0;
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    const bend = sway
      ? /* glsl */ `
        #ifdef USE_INSTANCING
        {
          mat3 im = mat3(instanceMatrix);
          vec3 o = instanceMatrix[3].xyz;
          float sc = length(im[1]);
          float ph = uCloudT * 1.6 + o.x * 0.8 + o.z * 0.6;
          float gust = 0.65 + 0.35 * sin(uCloudT * 0.37 + o.x * 0.11);
          vec2 sw = vec2(sin(ph), cos(ph * 0.83)) + uWind * 40.0;
          float k = ${sway.toFixed(3)} * transformed.y * transformed.y * gust${lv ? ' * 0.3' : ''};
          vec2 d = sw * k;
          ${
            lv
              ? `float lev = clamp(aLever, 0.0, 0.45);
          float fl = sin(uCloudT * 3.3 + ph * 1.9 + dot(transformed, vec3(9.0, 7.0, 8.0)));
          d += (sw * gust + vec2(fl, -fl) * 0.3) * lev * ${lever.toFixed(3)};`
              : ''
          }
          // a world-space offset (scaled with the copy) brought back into model space
          vec3 dw = vec3(d.x, 0.0, d.y) * sc;
          transformed += (transpose(im) * dw) / vec3(dot(im[0], im[0]), dot(im[1], im[1]), dot(im[2], im[2]));
        }
        #endif`
      : '';
    const wood = lv
      ? /* glsl */ `
        #ifdef USE_INSTANCING_COLOR
          vColor.rgb = mix(vColor.rgb, color.rgb * dot(instanceColor.rgb, vec3(0.3333)), step(aLever, -0.5));
        #endif`
      : '';
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vBiW;\nuniform float uCloudT; uniform vec2 uWind;${lv ? '\nattribute float aLever;' : ''}`)
      .replace('#include <color_vertex>', '#include <color_vertex>' + wood)
      .replace('#include <begin_vertex>', '#include <begin_vertex>' + bend)
      .replace('#include <project_vertex>', '#include <project_vertex>\n' + VERT_WORLD);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBiW;\n' + NOISE_GLSL)
      .replace('#include <lights_fragment_end>', FRAG_CLOUD);
  };
  mat.customProgramCacheKey = () => `bi-clouds-${sway}-${lv ? lever : 0}`;
}

export type QuayKind = 'brick' | 'stone';

/**
 * Quay walls: instanced unit blocks (y from -1 to 0) whose faces are drawn by the shader in world
 * units — brick in running bond or coursed ashlar, a pale coping along the top edge, the walk on
 * top in `top`, and the stone darkened and greened where the water laps it. The wall colour comes
 * from each copy's instance colour, so neighbouring stretches differ a little.
 */
export function patchQuay(mat: THREE.MeshStandardMaterial, u: CloudUniforms, o: { kind: QuayKind; cap: string; top: string; joint: string }, pave?: Style['paving']) {
  const uniforms = {
    ...u,
    uQCap: { value: new THREE.Color(o.cap) },
    uQTop: { value: new THREE.Color(o.top) },
    uQJoint: { value: new THREE.Color(o.joint) },
    uPave: { value: new THREE.Color(pave?.color ?? o.top) },
    uJoint: { value: new THREE.Color(pave?.joint ?? o.joint) },
  };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    // the walk on top is paved like the streets it continues
    sh.defines = { ...sh.defines, QK: o.kind === 'brick' ? 0 : 1, PAVE: pave ? PAVE_KIND[pave.kind] : -1 };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBiW; varying vec3 vBiN; varying float vTopD;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        ${VERT_WORLD}
        #ifdef USE_INSTANCING
          vBiN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * objectNormal);
          vTopD = -position.y * length(instanceMatrix[1].xyz);
        #else
          vBiN = normalize(mat3(modelMatrix) * objectNormal);
          vTopD = -position.y;
        #endif`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBiW; varying vec3 vBiN; varying float vTopD;\nuniform vec3 uQCap, uQTop, uQJoint, uPave, uJoint;\n' + NOISE_GLSL + PAVE_GLSL + QUAY_GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\n diffuseColor.rgb = quayColor(diffuseColor.rgb);')
      .replace('#include <lights_fragment_end>', FRAG_CLOUD);
  };
  mat.customProgramCacheKey = () => `bi-quay-${o.kind}-${pave?.kind ?? 'none'}`;
}

const QUAY_GLSL = /* glsl */ `
  float qJoint(vec2 f, vec2 w){ vec2 a = smoothstep(vec2(0.0), w, f) * smoothstep(vec2(1.0), 1.0 - w, f); return a.x * a.y; }
  vec3 quayColor(vec3 wall){
    vec3 w = vBiW;
    vec3 n = normalize(vBiN);
    // along the face: z on faces turned to ±x, x on faces turned to ±z
    float u = abs(n.x) > abs(n.z) ? w.z : w.x;
    #if QK == 0
      vec2 q = vec2(u, w.y) / vec2(0.11, 0.042);
      q.x += step(1.0, mod(floor(q.y), 2.0)) * 0.5;
      vec2 jw = vec2(0.06, 0.13);
    #else
      vec2 q = vec2(u, w.y) / vec2(0.21, 0.07);
      q.x += bi_hash(vec2(floor(q.y), 7.0)) * 0.7;
      vec2 jw = vec2(0.035, 0.08);
    #endif
    vec2 id = floor(q);
    vec2 f = fract(q);
    float aa = clamp(1.0 - length(fwidth(q)) * 1.4, 0.0, 1.0);
    vec3 c = wall * (0.84 + 0.26 * bi_hash(id)) * (0.94 + 0.1 * bi_noise(w.xz * 6.0 + w.y * 4.0));
    c = mix(uQJoint, c, mix(0.82, qJoint(f, jw), aa));
    // the coping: a pale band of dressed stone along the top, with a thin shadow line under it
    float cap = 1.0 - smoothstep(0.022, 0.03, vTopD);
    c = mix(c, uQCap * (0.95 + 0.08 * bi_noise(vec2(u * 14.0, 3.0))), cap);
    c *= 1.0 - 0.3 * smoothstep(0.03, 0.036, vTopD) * (1.0 - smoothstep(0.036, 0.05, vTopD));
    // wet stone at the water line, a little green with weed
    float wet = 1.0 - smoothstep(-0.01, 0.045, w.y);
    c = mix(c, c * vec3(0.55, 0.62, 0.52), wet);
    // the walk on top, and a ribbon of the coping stone along its edge
    float top = smoothstep(0.5, 0.8, n.y);
    #if PAVE >= 0
      vec3 walk = paving(w.xz);
    #else
      vec3 walk = uQTop * (0.9 + 0.14 * bi_noise(w.xz * 9.0)) * (0.96 + 0.06 * bi_hash(floor(w.xz * 8.0)));
    #endif
    return mix(c, walk, top);
  }
`;

const PAVE_KIND = { stucco: 0, brick: 1, flag: 2, earth: 3 } as const;

/**
 * The terrain material: cloud shadows plus ground detail, streets and contact shade. Needs the
 * per-vertex attributes `aTown` (the town paint mask) and `aOcc` (how close a wall stands).
 */
export function patchTerrain(mat: THREE.MeshStandardMaterial, u: CloudUniforms, st: Style) {
  const pave = st.paving;
  const uniforms = {
    ...u,
    uPave: { value: new THREE.Color(pave?.color ?? st.ground.town) },
    uJoint: { value: new THREE.Color(pave?.joint ?? st.ground.town) },
    uSand: { value: new THREE.Color(st.ground.sand) },
  };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.defines = { ...sh.defines, PAVE: pave ? PAVE_KIND[pave.kind] : -1 };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aTown; attribute float aOcc;\nvarying vec3 vBiW; varying float vTown; varying float vOcc;')
      .replace('#include <project_vertex>', '#include <project_vertex>\n' + VERT_WORLD + '\nvTown = aTown; vOcc = aOcc;');
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vBiW; varying float vTown; varying float vOcc;\nuniform vec3 uPave, uJoint, uSand;\n' + NOISE_GLSL + PAVE_GLSL,
      )
      .replace('#include <color_fragment>', '#include <color_fragment>\n' + GROUND_GLSL)
      .replace('#include <lights_fragment_end>', FRAG_CLOUD);
  };
  mat.customProgramCacheKey = () => `bi-terrain-${pave?.kind ?? 'none'}`;
}

/**
 * Street patterns in world units (a map cell is 1 × 1). Each returns the surface colour; `aa`
 * fades the joints out as they shrink below a pixel, so the wide view shows an even tone rather
 * than moiré.
 */
const PAVE_GLSL = /* glsl */ `
  float jointMask(vec2 f, vec2 w){ vec2 a = smoothstep(vec2(0.0), w, f) * smoothstep(vec2(1.0), 1.0 - w, f); return a.x * a.y; }
  vec3 paving(vec2 p){
    float n = bi_noise(p * 3.0);
    #if PAVE == 0
      // lime stucco: smooth, broad mottling, a faint grid of trowelled panels
      vec2 q = p / 0.5; vec2 f = fract(q);
      float aa = clamp(1.0 - length(fwidth(q)) * 3.0, 0.0, 1.0);
      float j = mix(1.0, jointMask(f, vec2(0.03)), aa * 0.6);
      vec3 c = uPave * (0.94 + 0.1 * n + 0.05 * bi_noise(p * 14.0));
      return mix(uJoint, c, j);
    #elif PAVE == 1
      // klinker brick in running bond, every brick a slightly different fired colour
      vec2 q = p / vec2(0.13, 0.065); q.x += step(1.0, mod(q.y, 2.0)) * 0.5;
      vec2 id = floor(q); vec2 f = fract(q);
      float aa = clamp(1.0 - length(fwidth(q)) * 1.2, 0.0, 1.0);
      vec3 c = uPave * (0.82 + 0.3 * bi_hash(id)) * (0.95 + 0.08 * n);
      float j = mix(0.7, jointMask(f, vec2(0.07, 0.14)), aa);
      return mix(uJoint, c, j);
    #elif PAVE == 2
      // flagstones: big slabs in staggered rows
      vec2 q = p / vec2(0.34, 0.24); q.x += bi_hash(vec2(floor(q.y), 3.0)) * 0.8;
      vec2 id = floor(q); vec2 f = fract(q);
      float aa = clamp(1.0 - length(fwidth(q)) * 3.0, 0.0, 1.0);
      vec3 c = uPave * (0.86 + 0.22 * bi_hash(id)) * (0.94 + 0.1 * n);
      float j = mix(0.85, jointMask(f, vec2(0.04, 0.06)), aa);
      return mix(uJoint, c, j);
    #else
      // packed earth: cart ruts and footpaths worn lighter, pebbles and darker damp patches
      float ruts = bi_noise(p * vec2(1.2, 6.0)) * 0.5 + bi_noise(p * 0.7 + 3.0) * 0.5;
      vec3 c = mix(uJoint, uPave, smoothstep(0.25, 0.75, ruts));
      float peb = smoothstep(0.78, 0.86, bi_noise(p * 22.0));
      float aa = clamp(1.0 - length(fwidth(p * 22.0)) * 0.8, 0.0, 1.0);
      c = mix(c, uJoint * 0.85, peb * aa * 0.6);
      return c * (0.95 + 0.1 * bi_noise(p * 9.0));
    #endif
  }
`;

const GROUND_GLSL = /* glsl */ `
  {
    vec3 w = vBiW;
    // fine speckle and broad patches of lusher or drier grass, so open ground never reads as flat paint
    float aaF = clamp(1.0 - length(fwidth(w.xz * 11.0)) * 0.7, 0.0, 1.0);
    float fine = (bi_noise(w.xz * 11.0) - 0.5) * aaF + (bi_noise(w.xz * 4.2) - 0.5) * 0.6;
    float broad = bi_noise(w.xz * 0.35 + 11.0) - 0.5;
    vec3 g = diffuseColor.rgb;
    g *= 1.0 + fine * 0.14;
    g = mix(g, g * vec3(1.06, 1.02, 0.86), clamp(broad * 1.6, 0.0, 1.0));
    g = mix(g, g * vec3(0.9, 1.04, 0.95), clamp(-broad * 1.6, 0.0, 1.0));
    // wet sand: a darker, cooler band where the waves reach, and the bed darkening below the line
    float wet = smoothstep(0.09, 0.0, w.y);
    g = mix(g, g * vec3(0.78, 0.8, 0.84), wet * 0.8);
    #if PAVE >= 0
      float town = smoothstep(0.38, 0.62, vTown) * smoothstep(0.03, 0.1, w.y);
      // (evaluated everywhere: derivatives inside a branch are undefined)
      g = mix(g, paving(w.xz), town * 0.92);
    #endif
    // contact shade at the foot of walls
    g *= 1.0 - 0.42 * vOcc;
    diffuseColor.rgb = g;
  }
`;
