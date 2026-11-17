import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * A tiny modelling kit for the island builder: every building, tree and boat is a handful of
 * boxes, cylinders and lofted roofs, each tinted with a vertex colour and merged into one
 * geometry, so a whole house is one draw call and one shared material.
 */

export type Rng = () => number;

const tmpColor = new THREE.Color();

/** A colour nudged in hue, saturation and lightness, so no two roofs are quite the same. */
export function jitter(c: THREE.ColorRepresentation, rng: Rng, h = 0.02, s = 0.06, l = 0.06) {
  const out = new THREE.Color(c);
  out.offsetHSL((rng() - 0.5) * h, (rng() - 0.5) * s, (rng() - 0.5) * l);
  return out;
}

export const pick = <T>(rng: Rng, arr: readonly T[]) => arr[Math.floor(rng() * arr.length) % arr.length];

function paint(g: THREE.BufferGeometry, color: THREE.ColorRepresentation) {
  const c = tmpColor.set(color);
  const n = g.attributes.position.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
}

/** Keep only position / normal (non-indexed, flat normals) so every part merges cleanly. */
function normalise(g: THREE.BufferGeometry) {
  let geo = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(geo.attributes)) if (k !== 'position') geo.deleteAttribute(k);
  geo.computeVertexNormals();
  if (geo !== g) g.dispose();
  return geo;
}

/**
 * Remove zero-area triangles (collinear points in an outline, a cone's collapsed tip). Their
 * normal is a zero vector, and `normalize(vec3(0))` in the shader is NaN: one such fragment is
 * enough for the bloom pass to smear NaN across the whole frame, which renders black.
 */
function dropDegenerate(g: THREE.BufferGeometry) {
  const nrm = g.attributes.normal as THREE.BufferAttribute | undefined;
  if (!nrm || g.index) return g;
  const tris = nrm.count / 3;
  const keep: number[] = [];
  for (let t = 0; t < tris; t++) {
    let ok = true;
    for (let v = t * 3; v < t * 3 + 3; v++) if (!(nrm.getX(v) ** 2 + nrm.getY(v) ** 2 + nrm.getZ(v) ** 2 > 0.25)) ok = false;
    if (ok) keep.push(t);
  }
  if (keep.length === tris) return g;
  const out = new THREE.BufferGeometry();
  for (const [name, attr] of Object.entries(g.attributes) as [string, THREE.BufferAttribute][]) {
    const n = attr.itemSize;
    const src = attr.array as Float32Array;
    const dst = new Float32Array(keep.length * 3 * n);
    keep.forEach((t, k) => dst.set(src.subarray(t * 3 * n, t * 3 * n + 3 * n), k * 3 * n));
    out.setAttribute(name, new THREE.BufferAttribute(dst, n));
  }
  g.dispose();
  return out;
}

/** Quads between consecutive closed rings of points (all rings the same length). */
export function loft(rings: THREE.Vector3[][], close = true) {
  const pos: number[] = [];
  const push = (v: THREE.Vector3) => pos.push(v.x, v.y, v.z);
  for (let r = 0; r < rings.length - 1; r++) {
    const a = rings[r];
    const b = rings[r + 1];
    const n = a.length;
    for (let i = 0; i < (close ? n : n - 1); i++) {
      const j = (i + 1) % n;
      push(a[i]);
      push(a[j]);
      push(b[j]);
      push(a[i]);
      push(b[j]);
      push(b[i]);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

export class Kit {
  private parts: THREE.BufferGeometry[] = [];
  private anchors: Record<string, THREE.Vector3> = {};
  readonly m = new THREE.Matrix4();

  private glowParts: THREE.BufferGeometry[] = [];
  private glowK = 0;

  /**
   * Name a point of the model for the engine: `smoke` is where a hearth's smoke rises (a chimney,
   * a cooking fire); `nosmoke` (no position needed) keeps this building's hearth cold even when the
   * dice say it smokes (a warehouse, a shrine, a shed). Anchors travel with the built geometry as
   * `geometry.userData.anchors`.
   */
  mark(name: 'smoke' | 'nosmoke', x = 0, y = 0, z = 0) {
    this.anchors[name] = new THREE.Vector3(x, y, z);
    return this;
  }

  /**
   * Parts drawn inside `draw` glow: a lantern's paper, a lit window, the coals of a brazier. They
   * are kept out of the shaded geometry and handed over as `geometry.userData.glow`, which the
   * engine draws unlit at `strength` × their colour (about 1.5–3: past ~2 they bloom softly).
   */
  glow(strength: number, draw: () => void) {
    const prev = this.glowK;
    this.glowK = strength;
    try {
      draw();
    } finally {
      this.glowK = prev;
    }
    return this;
  }

  add(g: THREE.BufferGeometry, color: THREE.ColorRepresentation, m?: THREE.Matrix4) {
    const geo = normalise(g);
    if (m) {
      geo.applyMatrix4(m);
      geo.computeVertexNormals();
    }
    if (this.glowK > 0) {
      paint(geo, tmpColor.set(color).multiplyScalar(this.glowK));
      this.glowParts.push(geo);
    } else {
      paint(geo, color);
      this.parts.push(geo);
    }
    return this;
  }

  /** Box standing on y (its base), centred at x / z, turned ry about its own centre. */
  box(w: number, h: number, d: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, ry = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(0, h / 2, 0);
    if (ry) g.rotateY(ry);
    g.translate(x, y, z);
    return this.add(g, color);
  }

  cyl(rTop: number, rBot: number, h: number, seg: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, ry = 0, open = false) {
    const g = new THREE.CylinderGeometry(rTop, rBot, h, seg, 1, open);
    g.translate(0, h / 2, 0);
    if (ry) g.rotateY(ry);
    g.translate(x, y, z);
    return this.add(g, color);
  }

  sphere(r: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, sy = 1, detail = 1) {
    const g = new THREE.IcosahedronGeometry(r, detail);
    g.scale(1, sy, 1);
    g.translate(x, y, z);
    return this.add(g, color);
  }

  /** Gable roof, ridge along x (length w), slopes down to ±d/2, eaves at y. */
  gable(w: number, d: number, rh: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, ry = 0) {
    const hw = w / 2;
    const hd = d / 2;
    const v = [
      [-hw, 0, hd], [hw, 0, hd], [hw, rh, 0], [-hw, rh, 0], // front slope
      [hw, 0, -hd], [-hw, 0, -hd], [-hw, rh, 0], [hw, rh, 0], // back slope
    ];
    const pos: number[] = [];
    const quad = (a: number[], b: number[], c: number[], e: number[]) => pos.push(...a, ...b, ...c, ...a, ...c, ...e);
    quad(v[0], v[1], v[2], v[3]);
    quad(v[4], v[5], v[6], v[7]);
    pos.push(...v[5], ...v[0], ...v[3]); // left gable
    pos.push(...v[1], ...v[4], ...v[7]); // right gable
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    if (ry) g.rotateY(ry);
    g.translate(x, y, z);
    return this.add(g, color);
  }

  /**
   * A curved hip roof lofted from the eaves (a w × d rectangle) up to a ridge of length `ridge`.
   * `k` > 1 gives the concave sweep of a Chinese roof, `k` < 1 the rounded bulk of thatch; `lift`
   * raises the four corners of the eaves.
   */
  hip(w: number, d: number, rh: number, o: { ridge?: number; k?: number; lift?: number; x?: number; y?: number; z?: number; ry?: number }, color: THREE.ColorRepresentation) {
    const ridge = o.ridge ?? w * 0.45;
    const k = o.k ?? 1;
    const lift = o.lift ?? 0;
    const rings: THREE.Vector3[][] = [];
    const R = 6;
    const M = 4;
    for (let i = 0; i <= R; i++) {
      const t = i / R;
      const ax = THREE.MathUtils.lerp(w / 2, ridge / 2, t);
      const az = THREE.MathUtils.lerp(d / 2, 0.0005, t);
      const y = rh * Math.pow(t, k);
      const lt = lift * Math.pow(1 - t, 2.2);
      const ring: THREE.Vector3[] = [];
      const corners = [[-ax, az], [ax, az], [ax, -az], [-ax, -az]];
      for (let s = 0; s < 4; s++) {
        const [x0, z0] = corners[s];
        const [x1, z1] = corners[(s + 1) % 4];
        for (let m = 0; m < M; m++) {
          const u = m / M;
          const e = Math.abs(u * 2 - 1);
          const up = lt * Math.pow(e, 3);
          ring.push(new THREE.Vector3(THREE.MathUtils.lerp(x0, x1, u), y + up, THREE.MathUtils.lerp(z0, z1, u)));
        }
      }
      rings.push(ring);
    }
    const g = loft(rings);
    if (o.ry) g.rotateY(o.ry);
    g.translate(o.x ?? 0, o.y ?? 0, o.z ?? 0);
    return this.add(g, color);
  }

  /** A flared polygonal eave ring (pagoda storeys, tower roofs): from radius r0 at y down-out to r1. */
  flare(n: number, r0: number, r1: number, rh: number, x: number, y: number, z: number, color: THREE.ColorRepresentation, lift = 0, k = 1.6) {
    const rings: THREE.Vector3[][] = [];
    const R = 4;
    const M = 3;
    for (let i = 0; i <= R; i++) {
      const t = i / R; // 0 = eave (outer, low), 1 = top (inner, high)
      const r = THREE.MathUtils.lerp(r1, r0, t);
      const yy = rh * Math.pow(t, k);
      const lt = lift * Math.pow(1 - t, 2);
      const ring: THREE.Vector3[] = [];
      for (let s = 0; s < n; s++) {
        const a0 = (s / n) * Math.PI * 2 + Math.PI / n;
        const a1 = ((s + 1) / n) * Math.PI * 2 + Math.PI / n;
        for (let m = 0; m < M; m++) {
          const u = m / M;
          const e = Math.abs(u * 2 - 1);
          const px = THREE.MathUtils.lerp(Math.cos(a0), Math.cos(a1), u) * r;
          const pz = THREE.MathUtils.lerp(Math.sin(a0), Math.sin(a1), u) * r;
          ring.push(new THREE.Vector3(px, yy + lt * e * e * e, pz));
        }
      }
      rings.push(ring);
    }
    const g = loft(rings);
    g.translate(x, y, z);
    return this.add(g, color);
  }

  /** A flat triangle (sails, fronds), two-sided by the material. */
  tri(a: THREE.Vector3Like, b: THREE.Vector3Like, c: THREE.Vector3Like, color: THREE.ColorRepresentation) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z], 3));
    return this.add(g, color);
  }

  /**
   * Merge into one geometry. The kit is empty afterwards. `ao` (0–1) bakes a cheap ambient
   * occlusion into the vertex colours: walls darken toward the ground they stand on (y = 0) and
   * faces turned down (eave soffits, deck undersides) sit in shade, which is most of what makes
   * small boxes read as solid buildings rather than floating cut-outs.
   *
   * `lever` (for trees) adds the attribute `aLever` the breeze reads: wood (brown, dark parts:
   * trunks, boughs, stumps) is -1 and stays put, every other part gets its distance from the point
   * where it hangs on the tree (the vertex nearest the trunk axis, lowest first), so a crown bends
   * about its own base and never tears off the trunk.
   */
  build(o: { ao?: number; lever?: boolean } = {}) {
    if (o.lever) for (const p of this.parts) addLever(p);
    let g = mergeGeometries(this.parts, false) ?? new THREE.BufferGeometry();
    for (const p of this.parts) p.dispose();
    this.parts = [];
    g = dropDegenerate(g);
    g.userData.anchors = this.anchors;
    this.anchors = {};
    if (this.glowParts.length) {
      const gl = mergeGeometries(this.glowParts, false);
      for (const p of this.glowParts) p.dispose();
      this.glowParts = [];
      if (gl) {
        const glow = dropDegenerate(gl);
        glow.computeBoundingSphere();
        g.userData.glow = glow;
      }
    }
    const ao = o.ao ?? 1;
    const pos = g.attributes.position as THREE.BufferAttribute | undefined;
    const col = g.attributes.color as THREE.BufferAttribute | undefined;
    const nrm = g.attributes.normal as THREE.BufferAttribute | undefined;
    if (ao > 0 && pos && col && nrm)
      for (let i = 0; i < pos.count; i++) {
        const t = THREE.MathUtils.smoothstep(pos.getY(i), -0.06, 0.42);
        let f = 0.58 + 0.42 * t;
        const ny = nrm.getY(i);
        if (ny < -0.3) f *= 0.72 + 0.28 * (1 + ny);
        f = 1 - (1 - f) * ao;
        col.setXYZ(i, col.getX(i) * f, col.getY(i) * f, col.getZ(i) * f);
      }
    g.computeBoundingSphere();
    return g;
  }
}

const hsl = { h: 0, s: 0, l: 0 };
/** Bark and bare wood: warm hues, muted and dark. Leaves, needles, fronds and blossom are not. */
const isWood = (c: THREE.Color) => {
  c.getHSL(hsl);
  return (hsl.h < 0.15 || hsl.h > 0.97) && hsl.s < 0.56 && hsl.l < 0.5;
};

function addLever(g: THREE.BufferGeometry) {
  const pos = g.attributes.position as THREE.BufferAttribute;
  const col = g.attributes.color as THREE.BufferAttribute;
  const n = pos.count;
  const lev = new Float32Array(n);
  if (n && isWood(tmpColor.setRGB(col.getX(0), col.getY(0), col.getZ(0)))) lev.fill(-1);
  else if (n) {
    let best = 0;
    let bestR = Infinity;
    let bestY = Infinity;
    for (let i = 0; i < n; i++) {
      const r = Math.hypot(pos.getX(i), pos.getZ(i));
      const y = pos.getY(i);
      if (r < bestR - 0.01 || (r < bestR + 0.01 && y < bestY)) {
        best = i;
        bestR = Math.min(bestR, r);
        bestY = y;
      }
    }
    const px = pos.getX(best);
    const py = pos.getY(best);
    const pz = pos.getZ(best);
    for (let i = 0; i < n; i++) lev[i] = Math.hypot(pos.getX(i) - px, pos.getY(i) - py, pos.getZ(i) - pz);
  }
  g.setAttribute('aLever', new THREE.BufferAttribute(lev, 1));
}
