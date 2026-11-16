import * as THREE from 'three';

/**
 * A stylised "atlas" earth: parchment land with hill-shading from the topology map,
 * ink-blue oceans tinted by bathymetry, gold coastlines and a faint graticule,
 * lit by a soft key light that follows the camera.
 * Textures: NASA Blue Marble / SRTM-derived topology (public domain) via three-globe's examples.
 */
export function createEarthMaterial(base = '/') {
  const loader = new THREE.TextureLoader();
  const load = (f: string) => {
    const tex = loader.load(`${base}textures/${f}`);
    tex.anisotropy = 8;
    return tex;
  };
  const map = load('earth-blue-marble.jpg');
  map.colorSpace = THREE.SRGBColorSpace;
  const water = load('earth-water.png');
  const topo = load('earth-topology.png');

  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uWater: { value: water },
      uTopo: { value: topo },
      uLight: { value: new THREE.Vector3(0.4, 0.5, 1).normalize() },
      uTime: { value: 0 },
      uEra: { value: 0.5 }, // 0 = ancient (warmer parchment), 1 = modern (cooler)
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform sampler2D uWater;
      uniform sampler2D uTopo;
      uniform vec3 uLight;
      uniform float uTime;
      uniform float uEra;
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vViewDir;

      float lineMask(float coord, float spacing) {
        float f = abs(fract(coord / spacing + 0.5) - 0.5) * spacing;
        float w = fwidth(coord) * 0.9;
        return 1.0 - smoothstep(0.0, w, f);
      }

      void main() {
        vec3 base = texture2D(uMap, vUv).rgb;
        float water = texture2D(uWater, vUv).r;
        float lum = dot(base, vec3(0.299, 0.587, 0.114));

        // Hill-shading from the height map (NW light, like an engraved atlas).
        vec2 px = vec2(1.0 / 2048.0, 1.0 / 1024.0);
        float h  = texture2D(uTopo, vUv).r;
        float hx = texture2D(uTopo, vUv + vec2(px.x, 0.0)).r;
        float hy = texture2D(uTopo, vUv + vec2(0.0, px.y)).r;
        float relief = clamp(0.5 + (h - hx) * 6.0 - (h - hy) * 6.0, 0.0, 1.0);

        // Land: parchment, darker in forests, lighter in deserts, warmer for ancient eras.
        vec3 parchDark = mix(vec3(0.36, 0.31, 0.22), vec3(0.30, 0.31, 0.26), uEra);
        vec3 parchLight = mix(vec3(0.80, 0.69, 0.50), vec3(0.74, 0.71, 0.60), uEra);
        vec3 land = mix(parchDark, parchLight, smoothstep(0.05, 0.75, lum));
        land = mix(land, base * 1.15, 0.16);
        land *= 0.72 + 0.56 * relief;
        land = min(land, vec3(0.86, 0.80, 0.68)); // keep deserts and ice from blowing out

        // Ocean: ink blue, lighter on the shelves.
        vec3 deep = vec3(0.035, 0.075, 0.115);
        vec3 shelf = vec3(0.10, 0.20, 0.26);
        vec3 ocean = mix(deep, shelf, smoothstep(0.06, 0.30, lum));

        float isWater = smoothstep(0.35, 0.65, water);
        vec3 col = mix(land, ocean, isWater);

        // Gold coastline where the water mask transitions.
        float coast = 1.0 - smoothstep(0.0, 0.22, abs(water - 0.5));
        col = mix(col, vec3(0.85, 0.70, 0.42), coast * 0.55);

        // Graticule every 15°, brighter at the equator and prime meridian.
        float lon = vUv.x * 360.0;
        float lat = vUv.y * 180.0;
        float grid = max(lineMask(lon, 15.0), lineMask(lat, 15.0));
        float major = max(lineMask(lon - 180.0, 360.0), lineMask(lat - 90.0, 180.0));
        col = mix(col, vec3(0.86, 0.74, 0.50), grid * mix(0.10, 0.05, 1.0 - isWater) + major * 0.12);

        // Lighting: soft wrap diffuse + rim.
        vec3 n = normalize(vNormalW);
        float diff = dot(n, normalize(uLight));
        float wrap = clamp((diff + 0.35) / 1.35, 0.0, 1.0);
        col *= 0.38 + 0.82 * wrap;
        float spec = pow(max(dot(reflect(-normalize(uLight), n), vViewDir), 0.0), 24.0) * isWater;
        col += vec3(0.9, 0.8, 0.6) * spec * 0.18;
        float rim = pow(1.0 - max(dot(n, vViewDir), 0.0), 3.0);
        col += vec3(0.45, 0.60, 0.85) * rim * 0.35;

        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

/** A field of stars on a distant sphere that twinkle softly. */
export function createStarfield(count = 5000, radius = 3000) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    pos.set([radius * r * Math.cos(th), radius * u, radius * r * Math.sin(th)], i * 3);
    seed[i] = Math.random();
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(2, window.devicePixelRatio) } },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      varying float vWarm;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = 0.65 + 0.35 * sin(uTime * (0.6 + aSeed * 1.7) + aSeed * 40.0);
        vAlpha = (0.25 + 0.75 * pow(aSeed, 3.0)) * tw;
        vWarm = fract(aSeed * 13.7);
        gl_PointSize = (1.0 + 2.2 * pow(aSeed, 6.0)) * uPixelRatio;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vAlpha;
      varying float vWarm;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d) * vAlpha;
        vec3 c = mix(vec3(0.75, 0.82, 1.0), vec3(1.0, 0.88, 0.7), step(0.7, vWarm));
        gl_FragColor = vec4(c, a);
      }
    `,
  });
  return new THREE.Points(geo, mat);
}
