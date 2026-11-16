/**
 * Planar flight dynamics for Vostok 1, in km and seconds, in the orbital plane.
 * The launch site is at (0, RE); +x is downrange. No browser dependencies, so it can be tuned
 * from Node (node --experimental-strip-types).
 *
 * The R-7 (8K72K) is modelled as three constant-thrust stages whose acceleration rises as
 * propellant burns off (a = F / m(t)). Numbers are tuned so a sensible gravity turn reaches a
 * ~170 × 300 km orbit, like the real flight (169 × 327 km), with little to spare.
 */

export const MU = 398600.4418;
export const RE = 6371;
export const G0 = 9.80665e-3; // km/s²
/** Earth's sidereal rotation rate, rad/s. */
export const OMEGA = (2 * Math.PI) / 86164;

export interface Stage {
  name: 'boosters' | 'core' | 'upper';
  /** Burn time, s. */
  T: number;
  /** Acceleration at ignition, km/s². */
  a0: number;
  /** Mass ratio over the burn (m at ignition / m at burnout). */
  MR: number;
}

export const STAGES: Stage[] = [
  { name: 'boosters', T: 118, a0: 13.8e-3, MR: 3.2 },
  { name: 'core', T: 184, a0: 11.6e-3, MR: 5.0 },
  { name: 'upper', T: 372, a0: 6.6e-3, MR: 2.0 },
];

/** Thrust acceleration of stage s, `t` seconds into its burn. */
export function stageAccel(s: Stage, t: number) {
  const frac = (1 - 1 / s.MR) * Math.min(1, t / s.T); // propellant fraction burned
  return s.a0 / (1 - frac);
}

/** Air density, kg/m³, from a piecewise-exponential fit to the US Standard Atmosphere. */
const ATM: [number, number, number][] = [
  // [base altitude km, density at base, scale height km]
  [0, 1.225, 7.3],
  [80, 1.85e-5, 5.6],
  [100, 5.6e-7, 8.9],
  [150, 2.0e-9, 24],
  [200, 2.5e-10, 40],
];
export function density(h: number) {
  if (h < 0) h = 0;
  let k = 0;
  while (k < ATM.length - 1 && h >= ATM[k + 1][0]) k++;
  const [h0, r0, H] = ATM[k];
  return r0 * Math.exp(-(h - h0) / H);
}

export interface State {
  x: number;
  y: number;
  vx: number;
  vy: number;
  t: number;
}

export interface Elements {
  /** Perigee and apogee altitude, km (apogee is Infinity for escape). */
  peri: number;
  apo: number;
  a: number;
  e: number;
  /** Specific angular momentum (sign = direction of motion). */
  hmom: number;
}

export function elements(s: State): Elements {
  const r = Math.hypot(s.x, s.y);
  const v2 = s.vx * s.vx + s.vy * s.vy;
  const E = v2 / 2 - MU / r;
  const hmom = s.x * s.vy - s.y * s.vx;
  const e = Math.sqrt(Math.max(0, 1 + (2 * E * hmom * hmom) / (MU * MU)));
  if (E >= 0) return { peri: (hmom * hmom) / (MU * (1 + e)) - RE, apo: Infinity, a: Infinity, e, hmom };
  const a = -MU / (2 * E);
  return { peri: a * (1 - e) - RE, apo: a * (1 + e) - RE, a, e, hmom };
}

export const alt = (s: State) => Math.hypot(s.x, s.y) - RE;
export const speed = (s: State) => Math.hypot(s.vx, s.vy);

/** Unit vectors at the craft's position: radial "up" and horizontal "downrange". */
export function frame(s: State) {
  const r = Math.hypot(s.x, s.y);
  const ux = s.x / r;
  const uy = s.y / r;
  return { ux, uy, hx: uy, hy: -ux };
}

/** Flight-path angle above the local horizontal, degrees. */
export function fpa(s: State) {
  const { ux, uy, hx, hy } = frame(s);
  return (Math.atan2(s.vx * ux + s.vy * uy, s.vx * hx + s.vy * hy) * 180) / Math.PI;
}

/** Dynamic pressure, kPa (relative to the atmosphere, which turns with the Earth — ignored here). */
export function qPressure(s: State) {
  const v = speed(s) * 1000;
  return (0.5 * density(alt(s)) * v * v) / 1000;
}

/**
 * One integration step (semi-implicit Euler, small dt). `thrust` is km/s² along pitch angle
 * `pitchDeg` above the local horizontal; `dragK` is Cd·A/m in m²/kg.
 */
export function step(s: State, dt: number, thrust: number, pitchDeg: number, dragK: number) {
  const r = Math.hypot(s.x, s.y);
  const g = MU / (r * r * r);
  let ax = -g * s.x;
  let ay = -g * s.y;
  if (thrust > 0) {
    const { ux, uy, hx, hy } = frame(s);
    const p = (pitchDeg * Math.PI) / 180;
    const c = Math.cos(p);
    const sn = Math.sin(p);
    ax += thrust * (hx * c + ux * sn);
    ay += thrust * (hy * c + uy * sn);
  }
  const h = r - RE;
  if (dragK > 0 && h < 140) {
    const v = Math.hypot(s.vx, s.vy);
    if (v > 0) {
      const a = (0.5 * density(h) * (v * 1000) ** 2 * dragK) / 1000; // km/s²
      ax -= (a * s.vx) / v;
      ay -= (a * s.vy) / v;
    }
  }
  s.vx += ax * dt;
  s.vy += ay * dt;
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  s.t += dt;
}

/** Cd·A/m of the R-7 stack (rough) and of the Vostok descent sphere (2.3 m, 2.46 t). */
export const DRAG_ROCKET = 1.2e-4;
export const DRAG_CAPSULE = 1.7e-3;

/**
 * Coasting step size, s. The game integrates with the same steps as the landing prediction, so
 * the capsule comes down where the prediction said it would.
 */
export const coastDt = (h: number) => (h > 140 ? 1 : 0.1);

/** Coast + re-enter with drag until the ground (or `maxT` seconds). Returns the impact state. */
export function propagateToGround(s0: State, dragK: number, maxT = 9000) {
  const s = { ...s0 };
  let peakG = 0;
  let lastV = speed(s);
  while (s.t - s0.t < maxT) {
    const dt = coastDt(alt(s));
    step(s, dt, 0, 0, dragK);
    const v = speed(s);
    peakG = Math.max(peakG, Math.abs(lastV - v) / dt / G0);
    lastV = v;
    if (alt(s) <= 0) return { s, landed: true, peakG };
  }
  return { s, landed: false, peakG };
}

/** Angle travelled in the orbital plane from the launch site, radians (0 at launch). */
export const downrangeAngle = (s: State) => Math.atan2(s.x, s.y);

// ---------- geography: the orbital plane on the rotating Earth ----------

export type V3 = [number, number, number];
const toRad = (d: number) => (d * Math.PI) / 180;

/** Unit vector for lat/lon in the Earth-fixed frame: +x = 0°E, +y = north pole, −z = 90°E. */
export function geo(lat: number, lon: number): V3 {
  const la = toRad(lat);
  const lo = toRad(lon);
  return [Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo)];
}
export function toLatLon(v: V3) {
  const r = Math.hypot(v[0], v[1], v[2]);
  return { lat: (Math.asin(v[1] / r) * 180) / Math.PI, lon: (Math.atan2(-v[2], v[0]) * 180) / Math.PI };
}

export const BAIKONUR = { lat: 45.92, lon: 63.342 };
/** Where Gagarin came down: near Smelovka, Saratov oblast. */
export const LANDING = { lat: 51.27, lon: 45.997 };
export const INCLINATION = 64.95;

/**
 * Basis of the orbital plane at launch (inertial = Earth-fixed at t = 0):
 * e1 = downrange direction, e2 = launch-site up. Launch azimuth follows from the inclination.
 */
export function orbitBasis(lat = BAIKONUR.lat, lon = BAIKONUR.lon, inc = INCLINATION) {
  const up = geo(lat, lon);
  const la = toRad(lat);
  const lo = toRad(lon);
  const north: V3 = [-Math.sin(la) * Math.cos(lo), Math.cos(la), Math.sin(la) * Math.sin(lo)];
  const east: V3 = [-Math.sin(lo), 0, -Math.cos(lo)];
  const az = Math.asin(Math.min(1, Math.cos(toRad(inc)) / Math.cos(la)));
  const e1: V3 = [0, 1, 2].map((i) => Math.cos(az) * north[i] + Math.sin(az) * east[i]) as V3;
  // Earth's rotation adds ω·RE·cos(lat) eastward; its downrange share is the launch's free speed.
  const freeSpeed = OMEGA * RE * Math.cos(la) * Math.sin(az);
  return { e1, e2: up, az, freeSpeed };
}

/** Inertial 3-D position (km) of a planar state. */
export function toInertial(s: { x: number; y: number }, b: { e1: V3; e2: V3 }): V3 {
  return [s.x * b.e1[0] + s.y * b.e2[0], s.x * b.e1[1] + s.y * b.e2[1], s.x * b.e1[2] + s.y * b.e2[2]];
}

/** Rotate an inertial vector into the Earth-fixed frame at time t (Earth turned by ω t). */
export function toEarthFixed(v: V3, t: number): V3 {
  const a = -OMEGA * t;
  const c = Math.cos(a);
  const sn = Math.sin(a);
  // rotation about +y; Earth spinning east moves +x toward −z (toward 90°E)
  return [c * v[0] + sn * v[2], v[1], -sn * v[0] + c * v[2]];
}

export function subPoint(s: State, b: { e1: V3; e2: V3 }) {
  return toLatLon(toEarthFixed(toInertial(s, b), s.t));
}

/** Great-circle distance, km. */
export function gcDist(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const p1 = toRad(a.lat);
  const p2 = toRad(b.lat);
  const dp = p2 - p1;
  const dl = toRad(b.lon - a.lon);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return 2 * RE * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Retro-rocket Δv, km/s (the TDU-1 gave about 155 m/s). */
export const RETRO_DV = 0.155;

/** Apply the retro burn (instantaneous, against the velocity) to a copy of `s`. */
export function retro(s: State, dv = RETRO_DV): State {
  const v = speed(s);
  return { ...s, vx: s.vx - (dv * s.vx) / v, vy: s.vy - (dv * s.vy) / v };
}
