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

/** Cloud shadows on a standard / lambert material (buildings, trees, boats). */
export function patchClouds(mat: THREE.Material, u: CloudUniforms) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vBiW;').replace('#include <project_vertex>', '#include <project_vertex>\n' + VERT_WORLD);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBiW;\n' + NOISE_GLSL)
      .replace('#include <lights_fragment_end>', FRAG_CLOUD);
  };
  mat.customProgramCacheKey = () => 'bi-clouds';
}

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
