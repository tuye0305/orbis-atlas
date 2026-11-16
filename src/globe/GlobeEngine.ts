import gsap from 'gsap';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EVENT_COLOR, EVENT_GLYPH } from '../i18n';
import { regionAt } from '../regions';
import type { Atlas, AtlasEvent, Lang, Person, Place, RegionKey, Selection, Stop } from '../types';
import { type BorderFeature, borderName, featureAt, loadIndex, loadSnapshot, type Snapshot, snapshotYearFor } from './borders';
import { createEarthMaterial, createStarfield } from './earthMaterial';

const R = 100; // three-globe radius
const BASE = import.meta.env.BASE_URL;

export interface EngineState {
  atlas: Atlas;
  year: number;
  lang: Lang;
  layers: { borders: boolean; events: boolean; people: boolean; places: boolean; labels: boolean };
  selection: Selection;
  journeyStop: number;
}

export interface EngineCallbacks {
  onRegion: (r: RegionKey | null) => void;
  onSelect: (s: Selection) => void;
  onHoverBorder: (name: { en: string; zh: string } | null) => void;
  onReady: () => void;
}

type MarkerKind = 'event' | 'person' | 'place' | 'label' | 'stop';

interface Marker {
  key: string;
  kind: MarkerKind;
  lat: number;
  lon: number;
  alt: number;
  el: HTMLElement;
  priority: number;
  opacity: number;
  w: number;
  h: number;
  /** labels may be dropped on collision; markers are always kept */
  collides: boolean;
}

function el(tag: string, cls: string, html?: string) {
  const e = document.createElement(tag);
  e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export function nameAt(place: Place, year: number) {
  let cur = place.names[0];
  for (const n of place.names) if (n.from <= year) cur = n;
  return cur;
}

export function personPosition(p: Person, year: number): Stop {
  let cur = p.stops[0];
  for (const s of p.stops) if (s.year <= year) cur = s;
  return cur;
}

export class GlobeEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private globe: ThreeGlobe;
  private earth: THREE.ShaderMaterial;
  private stars: THREE.Points;
  private clock = new THREE.Clock();
  private overlay: HTMLElement;
  private markers = new Map<string, Marker>();
  private snapshot: Snapshot | null = null;
  private snapYear: number | null = null;
  private index: { year: number; file: string }[] = [];
  private hovered: BorderFeature | null = null;
  private state: EngineState | null = null;
  private flying: gsap.core.Tween | null = null;
  private region: RegionKey | null = null;
  private regionCandidate: { r: RegionKey | null; since: number } = { r: null, since: 0 };
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDown: { x: number; y: number; t: number } | null = null;
  private lastInteraction = performance.now();
  private disposed = false;
  private frame = 0;
  private resizeObs: ResizeObserver;

  constructor(
    private container: HTMLElement,
    private cb: EngineCallbacks,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setClearColor(0x05070d, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.className = 'globe-canvas';

    this.overlay = el('div', 'globe-overlay');
    container.appendChild(this.overlay);

    this.camera = new THREE.PerspectiveCamera(42, 1, 1, 10000);
    this.camera.position.set(0, 0, R * 4.6);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.enablePan = false;
    this.controls.minDistance = R * 1.18;
    this.controls.maxDistance = R * 5;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.7;
    this.controls.addEventListener('start', () => {
      this.lastInteraction = performance.now();
      this.flying?.kill();
      this.flying = null;
    });

    this.earth = createEarthMaterial(BASE);
    this.globe = new ThreeGlobe({ animateIn: false })
      .globeMaterial(this.earth)
      .showAtmosphere(true)
      .atmosphereColor('#9fb8e8')
      .atmosphereAltitude(0.16)
      .polygonGeoJsonGeometry('geometry')
      .polygonCapColor((f: object) => this.capColor(f as BorderFeature))
      .polygonSideColor(() => 'rgba(20,12,4,0.35)')
      .polygonStrokeColor((f: object) => ((f as BorderFeature).__faint ? 'rgba(240,225,190,0.18)' : 'rgba(250,236,205,0.62)'))
      .polygonAltitude((f: object) => this.capAltitude(f as BorderFeature))
      .polygonCapCurvatureResolution(4)
      .polygonsTransitionDuration(700)
      .arcColor((a: object) => (a as { color: string[] }).color)
      .arcStroke((a: object) => (a as { stroke: number }).stroke)
      .arcAltitudeAutoScale(0.35)
      .arcDashLength(0.45)
      .arcDashGap(0.2)
      .arcDashInitialGap((a: object) => (a as { order: number }).order * 0.65)
      .arcDashAnimateTime(2600)
      .arcsTransitionDuration(500)
      .ringColor((r: object) => (r as { color: (t: number) => string }).color)
      .ringMaxRadius((r: object) => (r as { radius: number }).radius)
      .ringPropagationSpeed(2.2)
      .ringRepeatPeriod((r: object) => (r as { period: number }).period);
    this.scene.add(this.globe);

    this.stars = createStarfield();
    this.scene.add(this.stars);

    // A warm key light for the polygons' Lambert materials, plus fill.
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xfff1dc, 1.4);
    key.position.set(1, 1, 2);
    this.camera.add(key);
    this.scene.add(this.camera);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('wheel', () => (this.lastInteraction = performance.now()), { passive: true });

    this.resizeObs = new ResizeObserver(() => this.resize());
    this.resizeObs.observe(container);
    this.resize();
    this.renderer.setAnimationLoop(this.tick);

    loadIndex().then((idx) => {
      this.index = idx;
      if (this.state) this.syncBorders();
    });
  }

  // ---------- public API ----------

  update(next: EngineState) {
    const prev = this.state;
    this.state = next;
    const yearChanged = !prev || prev.year !== next.year;
    const langChanged = !prev || prev.lang !== next.lang;
    const layersChanged = !prev || prev.layers !== next.layers;
    const selChanged = !prev || prev.selection !== next.selection || prev.journeyStop !== next.journeyStop;
    if (yearChanged || layersChanged || !prev) this.syncBorders();
    if (yearChanged || langChanged || layersChanged || selChanged || prev?.atlas !== next.atlas) this.syncMarkers();
    if (selChanged || yearChanged || prev?.atlas !== next.atlas) this.syncArcsAndRings();
    this.earth.uniforms.uEra.value = THREE.MathUtils.smoothstep(next.year, 300, 1900);
  }

  intro() {
    // Swing in from deep space toward the Old World.
    this.setCameraGeo(20, 150, 4.2);
    this.flyTo(36, 40, 2.1, 3.2, 'power3.inOut');
  }

  flyTo(lat: number, lon: number, altitude = 1.4, duration?: number, ease = 'power2.inOut') {
    this.flying?.kill();
    this.lastInteraction = performance.now();
    const from = this.camera.position.clone();
    const fromLen = from.length();
    const fromAlt = fromLen / R - 1;
    const fromDir = from.clone().normalize();
    const p = this.globe.getCoords(lat, lon, 0);
    const toDir = new THREE.Vector3(p.x, p.y, p.z).normalize();
    const angle = fromDir.angleTo(toDir);
    const dur = duration ?? THREE.MathUtils.clamp(0.9 + angle * 0.9, 1, 2.6);
    // Pull back mid-flight on long hops so the arc reads as travel across the globe.
    const lift = Math.max(0, angle / Math.PI) * 1.1;
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion().setFromUnitVectors(fromDir, toDir);
    const qt = new THREE.Quaternion();
    const prog = { t: 0 };
    this.controls.enabled = false;
    this.flying = gsap.to(prog, {
      t: 1,
      duration: dur,
      ease,
      onUpdate: () => {
        qt.slerpQuaternions(q0, q1, prog.t);
        const dir = fromDir.clone().applyQuaternion(qt);
        const alt = THREE.MathUtils.lerp(fromAlt, altitude, prog.t) + lift * Math.sin(Math.PI * prog.t);
        this.camera.position.copy(dir.multiplyScalar(R * (1 + alt)));
        this.camera.lookAt(0, 0, 0);
      },
      onComplete: () => {
        this.controls.enabled = true;
        this.controls.update();
        this.flying = null;
      },
    });
  }

  cameraGeo() {
    const g = this.globe.toGeoCoords(this.camera.position);
    return { lat: g.lat, lon: g.lng, altitude: g.altitude };
  }

  dispose() {
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    this.resizeObs.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    this.container.innerHTML = '';
  }

  // ---------- borders ----------

  private capColor(f: BorderFeature) {
    const hovered = this.hovered === f;
    const a = f.__faint ? (hovered ? 0.22 : 0.07) : hovered ? 0.78 : 0.44;
    return hexA(f.__color, a);
  }

  private capAltitude(f: BorderFeature) {
    if (this.hovered === f) return 0.028;
    return f.__faint ? 0.003 : 0.0065 + Math.min(0.006, f.__area * 0.02);
  }

  private async syncBorders() {
    const st = this.state;
    if (!st || !this.index.length) return;
    if (!st.layers.borders) {
      this.globe.polygonsData([]);
      this.snapYear = null;
      return;
    }
    const sy = snapshotYearFor(this.index, Math.max(-1, st.year));
    if (sy === this.snapYear) return;
    this.snapYear = sy;
    const snap = await loadSnapshot(sy, st.atlas.polityNames);
    if (this.snapYear !== sy || this.disposed) return;
    this.snapshot = snap;
    this.hovered = null;
    this.globe.polygonsData(snap.features);
    // Prefetch neighbours so scrubbing stays smooth.
    const i = this.index.findIndex((s) => s.year === sy);
    for (const j of [i - 1, i + 1]) if (this.index[j]) loadSnapshot(this.index[j].year, st.atlas.polityNames);
    this.syncMarkers();
  }

  // ---------- markers (DOM overlay) ----------

  private upsert(key: string, kind: MarkerKind, lat: number, lon: number, build: () => HTMLElement, opts: Partial<Marker> = {}) {
    let m = this.markers.get(key);
    if (!m) {
      const node = build();
      node.dataset.key = key;
      this.overlay.appendChild(node);
      m = { key, kind, lat, lon, alt: 0.012, el: node, priority: 0, opacity: 1, w: 0, h: 0, collides: kind === 'label' || kind === 'place' };
      this.markers.set(key, m);
      requestAnimationFrame(() => {
        if (!m) return;
        m.w = node.offsetWidth;
        m.h = node.offsetHeight;
        node.classList.add('in');
      });
    }
    m.lat = lat;
    m.lon = lon;
    Object.assign(m, opts);
    return m;
  }

  private syncMarkers() {
    const st = this.state;
    if (!st) return;
    const { atlas, year, lang, layers, selection } = st;
    const keep = new Set<string>();
    const alt = this.cameraGeo().altitude;

    // Polity labels from the current border snapshot.
    if (layers.labels && layers.borders && this.snapshot) {
      const big = this.snapshot.features
        .filter((f) => !f.__faint && f.__area > 0.0009)
        .sort((a, b) => b.__area - a.__area)
        .slice(0, 70);
      for (const f of big) {
        const name = f.properties.NAME;
        const label = borderName(f.properties, lang, atlas.polityNames);
        const key = `label:${this.snapYear}:${name}:${f.__label[0].toFixed(1)}`;
        keep.add(key);
        const size = Math.round(Math.min(17, 10 + Math.sqrt(f.__area) * 22));
        const m = this.upsert(key, 'label', f.__label[1], f.__label[0], () => {
          const e = el('div', 'mk-label', esc(label));
          e.style.fontSize = `${size}px`;
          return e;
        });
        m.priority = 10 + f.__area * 1000;
        if (m.el.textContent !== label) {
          m.el.textContent = label;
          m.w = m.el.offsetWidth;
        }
      }
    }

    // Places: show the name valid in this year.
    if (layers.places) {
      for (const p of atlas.places) {
        const n = nameAt(p, year);
        const label = n.name[lang] || n.name.en;
        const key = `place:${p.id}`;
        keep.add(key);
        const selected = selection?.kind === 'place' && selection.id === p.id;
        const m = this.upsert(key, 'place', p.lat, p.lon, () => {
          const e = el('button', 'mk-place');
          e.onclick = (ev) => {
            ev.stopPropagation();
            this.cb.onSelect({ kind: 'place', id: p.id });
          };
          return e;
        });
        const html = `<i class="${n.capital ? 'cap' : ''}"></i><span>${esc(label)}</span>`;
        if (m.el.innerHTML !== html) {
          m.el.innerHTML = html;
          m.el.classList.add('renamed');
          setTimeout(() => m.el.classList.remove('renamed'), 900);
          m.w = m.el.offsetWidth;
        }
        m.el.classList.toggle('selected', selected);
        m.priority = selected ? 1000 : n.capital ? 60 : 40;
        m.collides = !selected;
      }
    }

    // Events near this year.
    if (layers.events) {
      for (const ev of atlas.events) {
        const op = eventOpacity(ev, year);
        const selected = selection?.kind === 'event' && selection.id === ev.id;
        if (op <= 0 && !selected) continue;
        if (!selected && alt > 2.2 && ev.importance < 4) continue;
        if (!selected && alt > 1.6 && ev.importance < 3) continue;
        const key = `event:${ev.id}`;
        keep.add(key);
        const m = this.upsert(key, 'event', ev.lat, ev.lon, () => {
          const e = el('button', `mk-event t-${ev.type}`);
          e.style.setProperty('--c', EVENT_COLOR[ev.type]);
          e.innerHTML = `<b>${EVENT_GLYPH[ev.type]}</b><span></span>`;
          e.onclick = (x) => {
            x.stopPropagation();
            this.cb.onSelect({ kind: 'event', id: ev.id });
          };
          return e;
        });
        const span = m.el.querySelector('span')!;
        const label = ev.name[lang] || ev.name.en;
        if (span.textContent !== label) span.textContent = label;
        m.el.classList.toggle('major', ev.importance >= 4);
        m.el.classList.toggle('selected', selected);
        m.el.classList.toggle('now', op > 0.85);
        m.opacity = selected ? 1 : Math.max(0.25, op);
        m.priority = selected ? 2000 : 100 + ev.importance * 20 + op * 20;
        m.alt = 0.02;
      }
    }

    // People alive this year, standing where they were.
    if (layers.people) {
      for (const p of atlas.people) {
        const selected = selection?.kind === 'person' && selection.id === p.id;
        if (!selected && (year < p.born || year > p.died)) continue;
        if (!p.stops.length) continue;
        const pos = personPosition(p, year);
        const key = `person:${p.id}`;
        keep.add(key);
        const m = this.upsert(key, 'person', pos.lat, pos.lon, () => {
          const e = el('button', 'mk-person');
          const img = p.image?.thumb
            ? `<img src="${esc(p.image.thumb)}" alt="" loading="lazy" referrerpolicy="no-referrer"/>`
            : `<em>${esc((p.name[lang] || p.name.en).slice(0, 1))}</em>`;
          e.innerHTML = `${img}<span></span>`;
          e.onclick = (x) => {
            x.stopPropagation();
            this.cb.onSelect({ kind: 'person', id: p.id });
          };
          return e;
        });
        const span = m.el.querySelector('span')!;
        const label = p.name[lang] || p.name.en;
        if (span.textContent !== label) span.textContent = label;
        m.el.classList.toggle('selected', selected);
        m.priority = selected ? 3000 : 300;
        m.alt = 0.03;
      }
    }

    // Numbered stops for the selected journey / campaign.
    const stops = this.selectedStops();
    stops.forEach((s, i) => {
      const key = `stop:${i}:${s.lat}:${s.lon}`;
      keep.add(key);
      const m = this.upsert(key, 'stop', s.lat, s.lon, () => el('div', 'mk-stop', `<b>${i + 1}</b><span></span>`));
      const span = m.el.querySelector('span')!;
      const label = `${s.year < 0 ? `${-s.year} BCE` : s.year} · ${s.label[lang] || s.label.en}`;
      if (span.textContent !== label) span.textContent = label;
      m.el.classList.toggle('active', i === st.journeyStop);
      m.priority = i === st.journeyStop ? 5000 : 900;
      m.alt = 0.01;
    });

    for (const [key, m] of this.markers) {
      if (!keep.has(key)) {
        m.el.classList.remove('in');
        m.el.classList.add('out');
        const node = m.el;
        setTimeout(() => node.remove(), 400);
        this.markers.delete(key);
      }
    }
  }

  private selectedStops(): Stop[] {
    const st = this.state;
    if (!st?.selection) return [];
    if (st.selection.kind === 'person') {
      const id = st.selection.id;
      return st.atlas.people.find((p) => p.id === id)?.stops ?? [];
    }
    if (st.selection.kind === 'event') {
      const id = st.selection.id;
      return st.atlas.events.find((e) => e.id === id)?.route ?? [];
    }
    return [];
  }

  private syncArcsAndRings() {
    const st = this.state;
    if (!st) return;
    const stops = this.selectedStops();
    const isWar = st.selection?.kind === 'event';
    const arcs = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      const done = i < st.journeyStop;
      arcs.push({
        startLat: a.lat,
        startLng: a.lon,
        endLat: b.lat,
        endLng: b.lon,
        order: i,
        stroke: done ? 0.55 : 0.35,
        color: isWar ? ['rgba(255,120,80,0.95)', 'rgba(255,200,120,0.9)'] : ['rgba(255,220,150,0.95)', 'rgba(160,200,255,0.9)'],
      });
    }
    this.globe.arcsData(arcs);

    const rings: object[] = [];
    for (const ev of st.atlas.events) {
      if (ev.importance < 3) continue;
      const inRange = ev.endYear ? st.year >= ev.year && st.year <= ev.endYear : Math.abs(st.year - ev.year) <= 1;
      if (!inRange) continue;
      const c = new THREE.Color(EVENT_COLOR[ev.type]);
      const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
      rings.push({ lat: ev.lat, lng: ev.lon, radius: 2 + ev.importance * 0.9, period: 1400 + (ev.importance % 3) * 300, color: (t: number) => `rgba(${rgb},${1 - t})` });
    }
    const cur = stops[st.journeyStop];
    if (cur) rings.push({ lat: cur.lat, lng: cur.lon, radius: 4, period: 900, color: (t: number) => `rgba(255,230,160,${1 - t})` });
    this.globe.ringsData(rings);
  }

  // ---------- interaction ----------

  private geoAtPointer(e: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const ray = this.raycaster.ray;
    // Analytic ray–sphere intersection (faster and exact vs. raycasting the mesh).
    const b = ray.origin.dot(ray.direction);
    const c = ray.origin.lengthSq() - R * R;
    const disc = b * b - c;
    if (disc < 0) return null;
    const tHit = -b - Math.sqrt(disc);
    const p = ray.origin.clone().addScaledVector(ray.direction, tHit);
    const g = this.globe.toGeoCoords(p);
    return { lat: g.lat, lon: g.lng };
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.buttons) return;
    const g = this.geoAtPointer(e);
    const f = g ? featureAt(this.snapshot, g.lon, g.lat) : null;
    if (f !== this.hovered) {
      this.hovered = f;
      this.globe.polygonCapColor(this.globe.polygonCapColor()).polygonAltitude(this.globe.polygonAltitude());
      this.cb.onHoverBorder(f ? this.borderL10n(f) : null);
      this.renderer.domElement.style.cursor = f ? 'pointer' : 'grab';
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    this.pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
    this.lastInteraction = performance.now();
  };

  private onPointerUp = (e: PointerEvent) => {
    const d = this.pointerDown;
    this.pointerDown = null;
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5 || performance.now() - d.t > 500) return;
    const g = this.geoAtPointer(e);
    if (!g) return;
    const f = featureAt(this.snapshot, g.lon, g.lat);
    this.cb.onSelect(f ? { kind: 'border', name: f.properties.NAME, zh: this.borderL10n(f).zh, lat: g.lat, lon: g.lon } : null);
  };

  private borderL10n(f: BorderFeature) {
    const names = this.state?.atlas.polityNames ?? {};
    return { en: f.properties.NAME, zh: borderName(f.properties, 'zh', names) };
  }

  // ---------- frame loop ----------

  private resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
    this.globe.rendererSize(new THREE.Vector2(w, h));
  }

  private setCameraGeo(lat: number, lon: number, altitude: number) {
    const p = this.globe.getCoords(lat, lon, altitude);
    this.camera.position.set(p.x, p.y, p.z);
    this.camera.lookAt(0, 0, 0);
  }

  private tick = () => {
    const dt = Math.min(0.05, this.clock.getDelta());
    const time = this.clock.elapsedTime;
    if (!this.flying) {
      // Gentle drift when idle, like a slowly turning library globe.
      if (performance.now() - this.lastInteraction > 25000) {
        this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), dt * 0.035);
      }
      this.controls.rotateSpeed = THREE.MathUtils.clamp((this.camera.position.length() / R - 1) * 0.35, 0.08, 0.6);
      this.controls.update();
    }
    // Key light sits up-left of the camera so the visible hemisphere is always lit.
    const camDir = this.camera.position.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(up, camDir).normalize();
    this.earth.uniforms.uLight.value.copy(camDir).addScaledVector(up, 0.55).addScaledVector(side, -0.45).normalize();
    this.earth.uniforms.uTime.value = time;
    (this.stars.material as THREE.ShaderMaterial).uniforms.uTime.value = time;

    this.renderer.render(this.scene, this.camera);
    this.layoutOverlay();

    if (this.frame++ % 10 === 0) this.trackRegion();
    if (this.frame === 2) this.cb.onReady();
  };

  private trackRegion() {
    const g = this.cameraGeo();
    const r = regionAt(g.lat, g.lon);
    const now = performance.now();
    if (r !== this.regionCandidate.r) this.regionCandidate = { r, since: now };
    if (r !== this.region && now - this.regionCandidate.since > 600) {
      this.region = r;
      this.cb.onRegion(r);
    }
    // Event density depends on zoom; refresh markers when altitude bands change.
    const band = g.altitude > 2.2 ? 2 : g.altitude > 1.6 ? 1 : 0;
    if (band !== this.altBand) {
      this.altBand = band;
      this.syncMarkers();
    }
  }
  private altBand = -1;

  private layoutOverlay() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    const camPos = this.camera.position;
    const camDist = camPos.length();
    const horizon = R / camDist; // cos of the angle at which a surface point leaves view
    const v = new THREE.Vector3();
    const list = [...this.markers.values()].sort((a, b) => b.priority - a.priority);
    const placed: [number, number, number, number][] = [];
    for (const m of list) {
      const c = this.globe.getCoords(m.lat, m.lon, m.alt);
      v.set(c.x, c.y, c.z);
      const facing = v.clone().normalize().dot(camPos.clone().normalize());
      const vis = THREE.MathUtils.smoothstep(facing, horizon, horizon + 0.12);
      if (vis <= 0.01) {
        m.el.style.visibility = 'hidden';
        continue;
      }
      v.project(this.camera);
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      let show = true;
      if (m.collides && m.w) {
        const box: [number, number, number, number] = [x - m.w / 2 - 2, y - m.h / 2 - 2, x + m.w / 2 + 2, y + m.h / 2 + 2];
        for (const p of placed) {
          if (box[0] < p[2] && box[2] > p[0] && box[1] < p[3] && box[3] > p[1]) {
            show = false;
            break;
          }
        }
        if (show) placed.push(box);
      } else if (m.w) {
        placed.push([x - 14, y - 14, x + 14, y + 14]);
      }
      if (!show) {
        m.el.style.visibility = 'hidden';
        continue;
      }
      m.el.style.visibility = 'visible';
      m.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      m.el.style.opacity = String(vis * m.opacity);
      m.el.style.zIndex = String(Math.round(m.priority));
    }
  }
}

function eventOpacity(ev: AtlasEvent, year: number) {
  const win = ev.importance >= 5 ? 30 : ev.importance >= 4 ? 20 : 12;
  if (ev.endYear && year >= ev.year && year <= ev.endYear) return 1;
  const d = ev.endYear && year > ev.endYear ? year - ev.endYear : Math.abs(year - ev.year);
  return Math.max(0, 1 - d / win);
}

function hexA(hex: string, a: number) {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
