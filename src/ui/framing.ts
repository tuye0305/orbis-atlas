/**
 * Frame a fly-to target in the part of the screen that panels do not cover.
 *
 * The globe camera always looks at the globe's centre, so the target lands in the middle of the
 * viewport, which is under the detail card on phones and close to it on desktop. Instead of
 * changing the engine, we aim the camera at a slightly different point so that the real target
 * appears at the centre of the free area (between top bar, timeline, side panel and card).
 */

const FOV = (42 * Math.PI) / 180; // GlobeEngine's vertical field of view

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** The visible area that no panel covers, in CSS pixels. */
export function freeArea(cardOpen: boolean): Rect {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const r: Rect = { left: 0, top: 0, right: W, bottom: H };
  const shown = (el: HTMLElement | null): el is HTMLElement => !!el && el.offsetParent !== null;
  // offset* ignore CSS transforms, so this works while panels are still sliding in.
  const bar = document.querySelector<HTMLElement>('.topbar');
  if (shown(bar)) r.top = Math.max(r.top, bar.offsetTop + bar.offsetHeight + 8);
  const tl = document.querySelector<HTMLElement>('.timeline');
  if (shown(tl)) r.bottom = Math.min(r.bottom, tl.offsetTop - 8);
  const drawer = document.querySelector<HTMLElement>('.drawer.open');
  if (shown(drawer) && drawer.offsetWidth < W * 0.6) r.left = Math.max(r.left, drawer.offsetLeft + drawer.offsetWidth);
  const card = document.querySelector<HTMLElement>('.card');
  if (cardOpen && shown(card)) {
    // A card spanning most of the width is the phone bottom sheet; otherwise it is the side card.
    if (card.offsetWidth > W * 0.6) r.bottom = Math.min(r.bottom, card.offsetTop - 8);
    else r.right = Math.min(r.right, card.offsetLeft - 8);
  }
  if (r.right - r.left < 80 || r.bottom - r.top < 80) return { left: 0, top: 0, right: W, bottom: H };
  return r;
}

/** Angle (radians, from the sub-camera point) of a surface point that projects `px` pixels off-centre. */
function angleForOffset(px: number, altitude: number, H: number) {
  const f = H / 2 / Math.tan(FOV / 2);
  const k = Math.abs(px) / f;
  const D = 1 + altitude; // camera distance in globe radii
  const horizon = Math.acos(1 / D);
  // screen offset ∝ sinθ / (D − cosθ), monotonic on [0, horizon): bisect.
  let lo = 0;
  let hi = horizon * 0.98;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sin(mid) / (D - Math.cos(mid)) < k) lo = mid;
    else hi = mid;
  }
  return Math.sign(px) * lo;
}

/**
 * Where to aim the camera so (lat, lon) shows at the centre of the free area.
 * `altitude` is what will be passed to GlobeEngine.flyTo.
 */
export function framedTarget(lat: number, lon: number, altitude: number, cardOpen: boolean) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const a = freeArea(cardOpen);
  const dx = (a.left + a.right) / 2 - W / 2;
  const dy = (a.top + a.bottom) / 2 - H / 2;
  // GlobeEngine pulls the camera back on portrait screens; mirror that so the maths matches.
  const aspect = W / H;
  const alt = aspect < 1 ? altitude * (1 + (1 - aspect) * 1.2) : altitude;
  const toDeg = 180 / Math.PI;
  // Screen-down is south and screen-right is east (the camera keeps north up).
  const aimLat = Math.max(-85, Math.min(85, lat + angleForOffset(dy, alt, H) * toDeg));
  const dLon = (angleForOffset(dx, alt, H) * toDeg) / Math.max(0.2, Math.cos((aimLat * Math.PI) / 180));
  let aimLon = lon - dLon;
  if (aimLon > 180) aimLon -= 360;
  if (aimLon < -180) aimLon += 360;
  return { lat: aimLat, lon: aimLon };
}
