import gsap from 'gsap';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EVENT_COLOR, EVENT_GLYPH } from '../i18n';
import { regionAt } from '../regions';
import type { Atlas, AtlasEvent, Lang, Person, Place, RegionKey, Selection, Stop } from '../types';
import { type BorderFeature, borderName, featureAt, loadIndex, loadSnapshot, type Snapshot, snapshotYearFor } from './borders';
import { createAtmosphere, createEarthMaterial, createStarfield } from './earthMaterial';

const R = 100; // three-globe radius
const BASE = import.meta.env.BASE_URL;
const HOVER_ALT = 0.028;
/** Rings sit just above the tallest cap (0.0125) so polity fills never hide them. */
const RING_ALT = 0.014;
const DEG = Math.PI / 180;
const Y_AXIS = new THREE.Vector3(0, 1, 0);

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
  /**
   * Screen point (client px) the user is actually looking at, e.g. the centre of the area no panel
   * covers. Region tracking probes the globe there; without it, the camera's sub-point is used.
   */
  focusPoint?: () => { x: number; y: number } | null;
}

type MarkerKind = 'event' | 'person' | 'place' | 'label' | 'stop';

interface Marker {
  key: string;
  kind: MarkerKind;
  lat: number;
  lon: number;
  alt: number;
  el: HTMLElement;
  /** text label inside the marker (events, people, stops, places) */
  span: HTMLElement | null;
  priority: number;
  opacity: number;
  /** box size of the element itself, and of its side label (places) */
  w: number;
  h: number;
  tw: number;
  measured: boolean;
  /** labels may be dropped on collision; markers are always kept */
  collides: boolean;
  now: boolean;
  selected: boolean;
  hover: boolean;
  // cached unit vector of (lat, lon) and the inputs it was computed from
  ux: number;
  uy: number;
  uz: number;
  cLat: number;
  cLon: number;
  // per-frame layout results
  x: number;
  y: number;
  vis: number;
  eff: number;
  // last values written to the DOM, so idle frames write nothing
  sVis: boolean;
  sX: number;
  sY: number;
  sS: number;
  sOp: number;
  sZ: number;
  sQuiet: boolean;
}

interface BorderLayer {
  globe: ThreeGlobe;
  features: BorderFeature[];
  fade: { v: number };
  /** polygon groups per feature, rebuilt lazily once three-globe has digested the data */
  groups: Map<BorderFeature, THREE.Object3D[]> | null;
  /** frames left in which material state must be (re)applied */
  dirty: number;
}

type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string | string[];
  stroke: number;
  dash: number;
  gap: number;
  init: number;
  anim: number;
};

type RingDatum = { lat: number; lng: number; radius: number; period: number; color: (t: number) => string };

function el(tag: string, cls: string, html?: string) {
  const e = document.createElement(tag);
  e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Rough pill width for a text label, without touching layout. */
function textWidth(text: string) {
  let w = 14;
  for (const ch of text) w += ch.charCodeAt(0) > 0x2e80 ? 12.5 : 6.8;
  return w;
}

function hexRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

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
  private atmosphere: THREE.Mesh;
  private stars: THREE.Points;
  private clock = new THREE.Clock();
  private overlay: HTMLElement;
  private markers = new Map<string, Marker>();
  /** markers in a stable array, re-sorted in place each layout */
  private list: Marker[] = [];
  private toMeasure: Marker[] = [];
  private placed: number[][] = [];
  private placedN = 0;
  private layoutDirty = true;
  private lastCam = new THREE.Vector3(Number.NaN, 0, 0);
  private width = 1;
  private height = 1;
  private snapshot: Snapshot | null = null;
  private snapYear: number | null = null;
  private index: { year: number; file: string }[] = [];
  private borderLayers: [BorderLayer, BorderLayer];
  private activeLayer = 0;
  private hovered: BorderFeature | null = null;
  private lift = new Map<BorderFeature, { t: number; done: boolean }>();
  private lastPointer: { x: number; y: number } | null = null;
  private hoverPending = false;
  private arcKey = '';
  private ringKey = '';
  private arcCache = new Map<string, ArcDatum>();
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
  private altBand = -1;
  private lastTrack = 0;
  private resizeObs: ResizeObserver;
  private motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  private reduced = this.motionQuery.matches;
  // scratch objects, so the frame loop allocates nothing
  private v = new THREE.Vector3();
  private camDir = new THREE.Vector3();
  private side = new THREE.Vector3();

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
    this.overlay.addEventListener('pointerover', this.onOverlayHover);
    this.overlay.addEventListener('pointerout', this.onOverlayHover);

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
      this.cancelFlight();
    });

    this.earth = createEarthMaterial(BASE);
    this.globe = new ThreeGlobe({ animateIn: false })
      .globeMaterial(this.earth)
      .showAtmosphere(false) // replaced by our own limb-hugging shell, see createAtmosphere
      .arcColor((a: object) => (a as ArcDatum).color)
      .arcStroke((a: object) => (a as ArcDatum).stroke)
      .arcAltitudeAutoScale(0.35)
      .arcDashLength((a: object) => (a as ArcDatum).dash)
      .arcDashGap((a: object) => (a as ArcDatum).gap)
      .arcDashInitialGap((a: object) => (a as ArcDatum).init)
      .arcDashAnimateTime((a: object) => (a as ArcDatum).anim)
      .arcsTransitionDuration(500)
      .ringAltitude(RING_ALT)
      .ringColor((r: object) => (r as RingDatum).color)
      .ringMaxRadius((r: object) => (r as RingDatum).radius)
      .ringPropagationSpeed(2.2)
      .ringRepeatPeriod((r: object) => (r as RingDatum).period);
    this.scene.add(this.globe);

    // Two polygon layers so snapshots crossfade instead of swapping in a single frame.
    this.borderLayers = [this.makeBorderLayer(), this.makeBorderLayer()];

    this.atmosphere = createAtmosphere(R);
    this.scene.add(this.atmosphere);
    this.stars = createStarfield();
    this.scene.add(this.stars);

    // A warm key light plus fill (kept for any lit materials three-globe adds).
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xfff1dc, 1.4);
    key.position.set(1, 1, 2);
    this.camera.add(key);
    this.scene.add(this.camera);

    const dom = this.renderer.domElement;
    dom.addEventListener('pointermove', this.onPointerMove);
    dom.addEventListener('pointerdown', this.onPointerDown);
    dom.addEventListener('pointerup', this.onPointerUp);
    dom.addEventListener('pointerleave', this.onPointerLeave);
    dom.addEventListener('wheel', this.onWheel, { passive: true });
    this.motionQuery.addEventListener('change', this.onMotionPref);

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
    // Swing in from deep space toward Afro-Eurasia (the densest part of the atlas).
    if (this.reduced) {
      this.setCameraGeo(36, 40, 2.1);
      this.controls.update();
      return;
    }
    this.setCameraGeo(20, 150, 4.2);
    this.flyTo(36, 40, 2.1, 3.2, 'power3.inOut');
  }

  flyTo(lat: number, lon: number, altitude = 1.4, duration?: number, ease = 'power2.inOut') {
    this.cancelFlight();
    this.lastInteraction = performance.now();
    // Portrait screens have a narrow horizontal field of view: pull back so the region fits.
    const aspect = this.camera.aspect;
    if (aspect < 1) altitude *= 1 + (1 - aspect) * 1.2;
    const from = this.camera.position.clone();
    const fromAlt = from.length() / R - 1;
    const fromDir = from.normalize();
    const p = this.globe.getCoords(lat, lon, 0);
    const toDir = new THREE.Vector3(p.x, p.y, p.z).normalize();
    const angle = fromDir.angleTo(toDir);
    let dur = duration ?? THREE.MathUtils.clamp(0.9 + angle * 0.9, 1, 2.6);
    // Pull back mid-flight on long hops so the arc reads as travel across the globe.
    let lift = Math.max(0, angle / Math.PI) * 1.1;
    if (this.reduced) {
      // Short and flat: a quick reorientation rather than a swoop.
      dur = Math.min(0.45, dur * 0.25);
      lift = 0;
      ease = 'power1.out';
    }
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
        const alt = THREE.MathUtils.lerp(fromAlt, altitude, prog.t) + lift * Math.sin(Math.PI * prog.t);
        this.camera.position.copy(fromDir).applyQuaternion(qt).multiplyScalar(R * (1 + alt));
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
    this.cancelFlight();
    this.renderer.setAnimationLoop(null);
    this.resizeObs.disconnect();
    this.motionQuery.removeEventListener('change', this.onMotionPref);
    for (const L of this.borderLayers) {
      gsap.killTweensOf(L.fade);
      L.globe._destructor();
    }
    for (const e of this.lift.values()) gsap.killTweensOf(e);
    this.globe._destructor();
    this.controls.dispose();
    this.renderer.dispose();
    this.container.innerHTML = '';
  }

  /** A fly-to (or the intro swing) is under way. */
  isFlying() {
    return this.flying !== null;
  }

  private cancelFlight() {
    if (!this.flying) return;
    this.flying.kill();
    this.flying = null;
    this.controls.enabled = true;
  }

  // ---------- borders ----------

  private makeBorderLayer(): BorderLayer {
    const L: BorderLayer = { globe: null!, features: [], fade: { v: 0 }, groups: null, dirty: 0 };
    // Initial colours already carry the layer's fade, so freshly digested polygons never flash
    // at full strength before applyLayer() takes over their materials.
    L.globe = new ThreeGlobe({ animateIn: false })
      .showGlobe(false)
      .showAtmosphere(false)
      .polygonGeoJsonGeometry('geometry')
      .polygonCapColor((f: object) => hexA((f as BorderFeature).__color, this.capAlpha(f as BorderFeature, 0) * L.fade.v))
      .polygonSideColor(() => `rgba(20,12,4,${0.35 * L.fade.v})`)
      .polygonStrokeColor((f: object) => `rgba(250,236,205,${this.strokeAlpha(f as BorderFeature, 0) * L.fade.v})`)
      .polygonAltitude((f: object) => this.capAltitude(f as BorderFeature))
      .polygonCapCurvatureResolution(4)
      .polygonsTransitionDuration(this.reduced ? 0 : 700);
    this.scene.add(L.globe);
    return L;
  }

  private capAlpha(f: BorderFeature, lift: number) {
    return f.__faint ? 0.07 + 0.15 * lift : 0.44 + 0.34 * lift;
  }

  private strokeAlpha(f: BorderFeature, lift: number) {
    return f.__faint ? 0.18 + 0.2 * lift : 0.62 + 0.3 * lift;
  }

  private capAltitude(f: BorderFeature) {
    return f.__faint ? 0.003 : 0.0065 + Math.min(0.006, f.__area * 0.02);
  }

  /** Crossfade to a new set of polygons (or fade the current one out when `features` is null). */
  private showBorders(features: BorderFeature[] | null) {
    const dur = this.reduced ? 0.2 : 0.9;
    const cur = this.borderLayers[this.activeLayer];
    if (features && cur.features === features) {
      gsap.to(cur.fade, { v: 1, duration: dur, ease: 'power1.out', overwrite: true, onUpdate: () => this.touch(cur) });
      return;
    }
    gsap.to(cur.fade, {
      v: 0,
      duration: dur * 0.85,
      ease: 'power1.in',
      overwrite: true,
      onUpdate: () => this.touch(cur),
      onComplete: () => {
        cur.features = [];
        cur.groups = null;
        cur.globe.polygonsData([]);
      },
    });
    if (!features) return;
    this.activeLayer = 1 - this.activeLayer;
    const next = this.borderLayers[this.activeLayer];
    gsap.killTweensOf(next.fade);
    next.fade.v = 0;
    next.features = features;
    next.groups = null;
    next.dirty = 60; // cover three-globe's debounced digest
    next.globe.polygonsData(features);
    gsap.to(next.fade, { v: 1, duration: dur, delay: dur * 0.1, ease: 'power1.out', onUpdate: () => this.touch(next) });
  }

  private touch(L: BorderLayer, frames = 2) {
    L.dirty = Math.max(L.dirty, frames);
  }

  /** Push fade and hover state straight into the polygon materials: no three-globe re-digest. */
  private applyLayer(L: BorderLayer) {
    if (!L.groups) {
      if (!L.features.length) return;
      const map = new Map<BorderFeature, THREE.Object3D[]>();
      L.globe.traverse((o) => {
        const tagged = o as THREE.Object3D & { __globeObjType?: string; __data?: { data: BorderFeature } };
        const d = tagged.__data;
        if (tagged.__globeObjType !== 'polygon' || !d) return;
        let arr = map.get(d.data);
        if (!arr) map.set(d.data, (arr = []));
        arr.push(o);
      });
      if (!map.size) return; // digest still pending
      L.groups = map;
    }
    const v = L.fade.v;
    // While two snapshots overlap mid-crossfade neither may occlude the other; once settled,
    // caps write depth again so overlapping source polygons don't double-blend.
    const depthWrite = v >= 1;
    for (const [f, objs] of L.groups) {
      const e = this.lift.get(f);
      const t = e ? e.t : 0;
      const capA = this.capAlpha(f, t) * v;
      const strokeA = this.strokeAlpha(f, t) * v;
      const alt = e ? THREE.MathUtils.lerp(this.capAltitude(f), HOVER_ALT, t) : 0;
      for (const g of objs) {
        const conic = g.children[0] as THREE.Mesh;
        const stroke = g.children[1] as THREE.LineSegments;
        const mats = conic.material as THREE.MeshBasicMaterial[];
        mats[0].opacity = 0.35 * v;
        mats[0].depthWrite = depthWrite;
        if (mats[1]) {
          mats[1].opacity = capA;
          mats[1].depthWrite = depthWrite;
        }
        (stroke.material as THREE.LineBasicMaterial).opacity = strokeA;
        if (e) {
          conic.scale.setScalar(1 + alt);
          stroke.scale.setScalar(1 + alt + 1e-4);
          const sh = (g as THREE.Object3D & { __defaultSideMaterial?: THREE.Material }).__defaultSideMaterial?.userData.shader;
          if (sh) sh.uniforms.uSurfaceRadius.value = R / (1 + alt);
        }
      }
    }
  }

  private setHovered(f: BorderFeature | null) {
    if (f === this.hovered) return;
    const prev = this.hovered;
    this.hovered = f;
    const tween = (feat: BorderFeature, to: number) => {
      let e = this.lift.get(feat);
      if (!e) this.lift.set(feat, (e = { t: 0, done: false }));
      e.done = false;
      gsap.to(e, {
        t: to,
        duration: this.reduced ? 0 : to ? 0.32 : 0.45,
        ease: to ? 'back.out(1.6)' : 'power2.out',
        overwrite: true,
        onUpdate: () => this.borderLayers.forEach((L) => this.touch(L)),
        onComplete: () => {
          if (!to) e.done = true;
          this.borderLayers.forEach((L) => this.touch(L));
        },
      });
    };
    if (prev) tween(prev, 0);
    if (f) tween(f, 1);
  }

  private async syncBorders() {
    const st = this.state;
    if (!st || !this.index.length) return;
    if (!st.layers.borders) {
      // Also drop the snapshot, so hidden borders can no longer be hovered or clicked.
      if (this.snapYear !== null || this.snapshot) {
        this.snapYear = null;
        this.snapshot = null;
        this.setHovered(null);
        this.cb.onHoverBorder(null);
        this.showBorders(null);
      }
      return;
    }
    const sy = snapshotYearFor(this.index, Math.max(-1, st.year));
    if (sy === this.snapYear) return;
    this.snapYear = sy;
    const snap = await loadSnapshot(sy, st.atlas.polityNames);
    if (this.snapYear !== sy || this.disposed) return;
    this.snapshot = snap;
    this.setHovered(null);
    this.showBorders(snap.features);
    this.hoverPending = true; // re-pick under a resting pointer
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
      m = {
        key,
        kind,
        lat,
        lon,
        alt: 0.012,
        el: node,
        span: node.querySelector('span'),
        priority: 0,
        opacity: 1,
        w: 0,
        h: 0,
        tw: 0,
        measured: false,
        collides: kind === 'label' || kind === 'place',
        now: false,
        selected: false,
        hover: false,
        ux: 0,
        uy: 0,
        uz: 0,
        cLat: Number.NaN,
        cLon: Number.NaN,
        x: 0,
        y: 0,
        vis: 0,
        eff: 0,
        sVis: true,
        sX: Number.NaN,
        sY: Number.NaN,
        sS: Number.NaN,
        sOp: -1,
        sZ: -1,
        sQuiet: false,
      };
      this.markers.set(key, m);
      this.toMeasure.push(m);
    }
    m.lat = lat;
    m.lon = lon;
    Object.assign(m, opts);
    return m;
  }

  private setText(m: Marker, text: string) {
    if (!m.span || m.span.textContent === text) return;
    m.span.textContent = text;
    m.tw = textWidth(text);
  }

  private setFlag(m: Marker, cls: 'now' | 'selected', on: boolean) {
    if (m[cls] === on) return;
    m[cls] = on;
    m.el.classList.toggle(cls, on);
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
          this.remeasure(m);
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
          m.span = m.el.querySelector('span');
          m.el.classList.add('renamed');
          setTimeout(() => m.el.classList.remove('renamed'), 900);
          this.remeasure(m);
        }
        this.setFlag(m, 'selected', selected);
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
          const e = el('button', `mk-event t-${ev.type}${ev.importance >= 4 ? ' major' : ''}`);
          e.style.setProperty('--c', EVENT_COLOR[ev.type]);
          e.innerHTML = `<b>${EVENT_GLYPH[ev.type]}</b><span></span>`;
          e.onclick = (x) => {
            x.stopPropagation();
            this.cb.onSelect({ kind: 'event', id: ev.id });
          };
          return e;
        });
        this.setText(m, ev.name[lang] || ev.name.en);
        this.setFlag(m, 'selected', selected);
        this.setFlag(m, 'now', op > 0.85);
        m.opacity = selected ? 1 : Math.max(0.25, op);
        m.priority = selected ? 2000 : 100 + ev.importance * 20 + op * 20;
        m.alt = 0.02;
      }
    }

    // People alive this year, standing where they were.
    if (layers.people) {
      for (const p of atlas.people) {
        const selected = selection?.kind === 'person' && selection.id === p.id;
        if (!selected && (year < p.born || year > (p.died ?? Infinity))) continue;
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
        this.setText(m, p.name[lang] || p.name.en);
        this.setFlag(m, 'selected', selected);
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
      this.setText(m, `${s.year < 0 ? `${-s.year} BCE` : s.year} · ${s.label[lang] || s.label.en}`);
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
    this.list = [...this.markers.values()];
    this.layoutDirty = true;
  }

  private remeasure(m: Marker) {
    if (!m.measured) return; // already queued
    m.measured = false;
    this.toMeasure.push(m);
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

  // ---------- arcs & rings ----------

  private syncArcsAndRings() {
    const st = this.state;
    if (!st) return;
    const stops = this.selectedStops();
    const sel = st.selection;
    const selKey = sel ? `${sel.kind}:${'id' in sel ? sel.id : sel.name}` : '';
    const isWar = sel?.kind === 'event';
    const reduced = this.reduced;

    // Arcs only change with the selection / current stop. Reuse datum objects so three-globe
    // updates existing tubes in place instead of re-creating (and re-animating) every leg.
    const arcKey = `${selKey}|${st.journeyStop}|${stops.length}|${reduced}`;
    if (arcKey !== this.arcKey) {
      if (!this.arcKey.startsWith(`${selKey}|`)) this.arcCache.clear();
      this.arcKey = arcKey;
      const pal = isWar
        ? { done: ['rgba(214,84,52,0.95)', 'rgba(255,140,90,0.95)'], ahead: 'rgba(255,150,110,0.7)', comet: 'rgba(255,226,170,1)' }
        : { done: ['rgba(214,170,96,0.95)', 'rgba(255,224,160,0.95)'], ahead: 'rgba(240,226,190,0.7)', comet: 'rgba(255,248,226,1)' };
      const arcs: ArcDatum[] = [];
      const datum = (id: string, a: Stop, b: Stop, d: Omit<ArcDatum, 'startLat' | 'startLng' | 'endLat' | 'endLng'>) => {
        let o = this.arcCache.get(id);
        if (!o) this.arcCache.set(id, (o = { startLat: a.lat, startLng: a.lon, endLat: b.lat, endLng: b.lon, ...d }));
        else Object.assign(o, d);
        arcs.push(o);
      };
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i];
        const b = stops[i + 1];
        if (i < st.journeyStop) {
          // Travelled: a solid, warm line.
          datum(`${i}:track`, a, b, { color: pal.done, stroke: 0.5, dash: 1, gap: 0, init: 0, anim: 0 });
        } else if (i === st.journeyStop) {
          // The leg ahead of the current stop: faint track with a comet running along it.
          datum(`${i}:track`, a, b, { color: pal.ahead, stroke: 0.32, dash: 1, gap: 0, init: 0, anim: 0 });
          datum(`${i}:comet`, a, b, reduced
            ? { color: pal.comet, stroke: 0.6, dash: 1, gap: 0, init: 0, anim: 0 }
            : { color: pal.comet, stroke: 0.7, dash: 0.28, gap: 1.2, init: 1, anim: 1700 });
        } else {
          // Further ahead: dotted, slowly marching (static with reduced motion).
          datum(`${i}:track`, a, b, { color: pal.ahead, stroke: 0.32, dash: 0.045, gap: 0.035, init: 0, anim: reduced ? 0 : 14000 });
        }
      }
      this.globe.arcsData(arcs);
    }

    const rings: RingDatum[] = [];
    const ids: string[] = [];
    const slow = reduced ? 2.5 : 1;
    for (const ev of st.atlas.events) {
      if (ev.importance < 3) continue;
      const inRange = ev.endYear ? st.year >= ev.year && st.year <= ev.endYear : Math.abs(st.year - ev.year) <= 1;
      if (!inRange) continue;
      ids.push(ev.id);
      // Parse the hex directly: THREE.Color would hand back linear values (darker rings).
      const [r, g, b] = hexRgb(EVENT_COLOR[ev.type]);
      rings.push({
        lat: ev.lat,
        lng: ev.lon,
        radius: 2 + ev.importance * 0.9,
        period: (1400 + (ev.importance % 3) * 300) * slow,
        // Hot white-gold at the centre cooling to the event colour; ease-out alpha so the
        // ring lingers as it widens instead of vanishing linearly.
        color: (t: number) => {
          const k = Math.min(1, t * 2.2);
          const a = (1 - t) ** 1.6 * 0.95;
          return `rgba(${Math.round(255 + (r - 255) * k)},${Math.round(240 + (g - 240) * k)},${Math.round(205 + (b - 205) * k)},${a})`;
        },
      });
    }
    const cur = stops[st.journeyStop];
    if (cur) {
      ids.push(`stop:${cur.lat}:${cur.lon}`);
      rings.push({ lat: cur.lat, lng: cur.lon, radius: 4.5, period: 1100 * slow, color: (t: number) => `rgba(255,228,160,${(1 - t) ** 1.4})` });
    }
    const ringKey = `${ids.join(',')}|${reduced}`;
    if (ringKey !== this.ringKey) {
      this.ringKey = ringKey;
      this.globe.ringPropagationSpeed(reduced ? 1 : 2.2).ringsData(rings);
    }
  }

  // ---------- interaction ----------

  private geoAt(clientX: number, clientY: number) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const ray = this.raycaster.ray;
    // Analytic ray–sphere intersection (faster and exact vs. raycasting the mesh).
    const b = ray.origin.dot(ray.direction);
    const c = ray.origin.lengthSq() - R * R;
    const disc = b * b - c;
    if (disc < 0) return null;
    const tHit = -b - Math.sqrt(disc);
    this.v.copy(ray.origin).addScaledVector(ray.direction, tHit);
    const g = this.globe.toGeoCoords(this.v);
    return { lat: g.lat, lon: g.lng };
  }

  private onPointerMove = (e: PointerEvent) => {
    if (e.buttons) return;
    // Hit-testing happens once per frame in tick(), not once per (often >60 Hz) pointer event.
    this.lastPointer = { x: e.clientX, y: e.clientY };
    this.hoverPending = true;
  };

  private onPointerLeave = () => {
    this.lastPointer = null;
    this.hoverPending = true;
  };

  private pickHover() {
    this.hoverPending = false;
    const g = this.lastPointer ? this.geoAt(this.lastPointer.x, this.lastPointer.y) : null;
    const f = g ? featureAt(this.snapshot, g.lon, g.lat) : null;
    if (f === this.hovered) return;
    this.setHovered(f);
    this.cb.onHoverBorder(f ? this.borderL10n(f) : null);
    this.renderer.domElement.style.cursor = f ? 'pointer' : 'grab';
  }

  private onPointerDown = (e: PointerEvent) => {
    this.pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
    this.lastInteraction = performance.now();
    this.cancelFlight(); // grabbing the globe stops a fly-to
  };

  private onWheel = () => {
    this.lastInteraction = performance.now();
    this.cancelFlight();
  };

  private onPointerUp = (e: PointerEvent) => {
    const d = this.pointerDown;
    this.pointerDown = null;
    if (!d || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5 || performance.now() - d.t > 500) return;
    const g = this.geoAt(e.clientX, e.clientY);
    if (!g) return;
    const f = featureAt(this.snapshot, g.lon, g.lat);
    this.cb.onSelect(f ? { kind: 'border', name: f.properties.NAME, zh: this.borderL10n(f).zh, lat: g.lat, lon: g.lon } : null);
  };

  private onOverlayHover = (e: PointerEvent) => {
    const node = (e.target as HTMLElement).closest?.('[data-key]') as HTMLElement | null;
    const m = node?.dataset.key ? this.markers.get(node.dataset.key) : undefined;
    if (!m) return;
    const hover = e.type === 'pointerover';
    if (m.hover !== hover) {
      m.hover = hover;
      this.layoutDirty = true;
    }
  };

  private onMotionPref = () => {
    this.reduced = this.motionQuery.matches;
    for (const L of this.borderLayers) L.globe.polygonsTransitionDuration(this.reduced ? 0 : 700);
    this.syncArcsAndRings();
  };

  private borderL10n(f: BorderFeature) {
    const names = this.state?.atlas.polityNames ?? {};
    return { en: f.properties.NAME, zh: borderName(f.properties, 'zh', names) };
  }

  // ---------- frame loop ----------

  private resize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.renderer.setSize(this.width, this.height, false);
    this.camera.aspect = this.width / Math.max(1, this.height);
    this.camera.updateProjectionMatrix();
    this.globe.rendererSize(new THREE.Vector2(this.width, this.height));
    this.layoutDirty = true;
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
      // Gentle drift when idle, like a slowly turning library globe (not with reduced motion).
      if (!this.reduced && !this.state?.selection && performance.now() - this.lastInteraction > 40000) {
        this.camera.position.applyAxisAngle(Y_AXIS, dt * 0.035);
      }
      this.controls.rotateSpeed = THREE.MathUtils.clamp((this.camera.position.length() / R - 1) * 0.35, 0.08, 0.6);
      this.controls.update();
    }
    // Key light sits up-left of the camera so the visible hemisphere is always lit.
    const camDir = this.camDir.copy(this.camera.position).normalize();
    const side = this.side.crossVectors(Y_AXIS, camDir).normalize();
    const light = this.earth.uniforms.uLight.value as THREE.Vector3;
    light.copy(camDir).addScaledVector(Y_AXIS, 0.55).addScaledVector(side, -0.45).normalize();
    (this.atmosphere.material as THREE.ShaderMaterial).uniforms.uLight.value.copy(light);
    this.earth.uniforms.uTime.value = time;
    (this.stars.material as THREE.ShaderMaterial).uniforms.uTime.value = time;

    if (this.hoverPending) this.pickHover();
    for (const L of this.borderLayers) {
      if (L.dirty > 0) {
        this.applyLayer(L);
        L.dirty--;
      }
    }
    for (const [f, e] of this.lift) if (e.done) this.lift.delete(f);

    this.renderer.render(this.scene, this.camera);
    this.layoutOverlay();

    const now = performance.now();
    if (now - this.lastTrack > 150) {
      this.lastTrack = now;
      this.trackRegion();
    }
    if (++this.frame === 2) this.cb.onReady();
  };

  private trackRegion() {
    const g = this.cameraGeo();
    // The camera aims off-target so panels don't cover it; judge the region where the user looks.
    const p = this.cb.focusPoint?.();
    const look = (p && this.geoAt(p.x, p.y)) || g;
    const r = regionAt(look.lat, look.lon);
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

  private claim(x0: number, y0: number, x1: number, y1: number) {
    let b = this.placed[this.placedN];
    if (!b) this.placed.push((b = [0, 0, 0, 0]));
    b[0] = x0;
    b[1] = y0;
    b[2] = x1;
    b[3] = y1;
    this.placedN++;
  }

  private isFree(x0: number, y0: number, x1: number, y1: number) {
    for (let i = 0; i < this.placedN; i++) {
      const p = this.placed[i];
      if (x0 < p[2] && x1 > p[0] && y0 < p[3] && y1 > p[1]) return false;
    }
    return true;
  }

  private layoutOverlay() {
    // 1) Reads first: measure new / renamed markers in one batch, before any style writes.
    if (this.toMeasure.length) {
      for (const m of this.toMeasure) {
        if (!m.el.isConnected) continue;
        if (m.kind === 'place') {
          const dot = m.el.querySelector('i') as HTMLElement | null;
          m.w = dot?.offsetWidth ?? 6;
          m.h = Math.max(m.w, m.span?.offsetHeight ?? 0);
          m.tw = m.span?.offsetWidth ?? 0;
        } else if (m.kind === 'stop') {
          // The stop's label sits inline after its badge: anchor on the badge, not the box centre.
          const badge = m.el.querySelector('b') as HTMLElement | null;
          m.w = badge?.offsetWidth ?? 20;
          m.h = badge?.offsetHeight ?? 20;
        } else {
          m.w = m.el.offsetWidth;
          m.h = m.el.offsetHeight;
        }
        m.measured = true;
        // The read above forced a style pass, so this starts the CSS fade-in from opacity 0.
        m.el.classList.add('in');
      }
      this.toMeasure.length = 0;
      this.layoutDirty = true;
    }

    // 2) Nothing moved and nothing changed: leave the DOM alone.
    const camPos = this.camera.position;
    if (!this.layoutDirty && this.lastCam.distanceToSquared(camPos) < 1e-8) return;
    this.layoutDirty = false;
    this.lastCam.copy(camPos);

    const w = this.width;
    const h = this.height;
    const camDist = camPos.length();
    const cx = camPos.x / camDist;
    const cy = camPos.y / camDist;
    const cz = camPos.z / camDist;
    // Angular radius of the visible cap; markers fade over the last fifth of it, so the fade
    // band looks the same whether we are zoomed into a valley or looking at the whole globe.
    const horizon = Math.acos(Math.min(1, R / camDist));
    const band = Math.max(0.05, horizon * 0.2);
    const list = this.list;

    // 3) Project everything and score it: markers near the limb yield to central ones.
    for (const m of list) {
      if (m.cLat !== m.lat || m.cLon !== m.lon) {
        const phi = (90 - m.lat) * DEG;
        const theta = (90 - m.lon) * DEG;
        m.ux = Math.sin(phi) * Math.cos(theta);
        m.uy = Math.cos(phi);
        m.uz = Math.sin(phi) * Math.sin(theta);
        m.cLat = m.lat;
        m.cLon = m.lon;
      }
      const ang = Math.acos(THREE.MathUtils.clamp(m.ux * cx + m.uy * cy + m.uz * cz, -1, 1));
      m.vis = 1 - THREE.MathUtils.smoothstep(ang, horizon - band, horizon);
      if (m.vis > 0.01) {
        const r = R * (1 + m.alt);
        this.v.set(m.ux * r, m.uy * r, m.uz * r).project(this.camera);
        m.x = (this.v.x * 0.5 + 0.5) * w;
        m.y = (-this.v.y * 0.5 + 0.5) * h;
      }
      m.eff = m.priority * (0.4 + 0.6 * m.vis);
    }
    list.sort((a, b) => b.eff - a.eff);

    // 4) Collisions and DOM writes (only where a value actually changed).
    this.placedN = 0;
    for (const m of list) {
      const { x, y, vis } = m;
      let show = vis > 0.01;
      if (show && (m.kind === 'event' || m.kind === 'person')) {
        // The icon always shows; its text label yields to anything already placed.
        this.claim(x - 13, y - 13, x + 13, y + 13);
        const tw = m.tw;
        const wantsText = m.kind === 'person' || m.now || m.selected || m.hover;
        let free = true;
        if (wantsText) {
          free =
            m.kind === 'event' ? this.isFree(x + 15, y - 10, x + 15 + tw, y + 10) : this.isFree(x - tw / 2, y + 20, x + tw / 2, y + 36);
          if (free) {
            if (m.kind === 'event') this.claim(x + 15, y - 10, x + 15 + tw, y + 10);
            else this.claim(x - tw / 2, y + 20, x + tw / 2, y + 36);
          }
        }
        const quiet = !free && !m.selected && !m.hover;
        if (quiet !== m.sQuiet) {
          m.sQuiet = quiet;
          m.el.classList.toggle('quiet', quiet);
        }
      } else if (show && m.collides && m.measured) {
        // Places carry their name to the right of the dot; labels are centred.
        const x0 = x - m.w / 2 - 2;
        const x1 = m.kind === 'place' ? x + m.w / 2 + 4 + m.tw + 2 : x + m.w / 2 + 2;
        const y0 = y - m.h / 2 - 2;
        const y1 = y + m.h / 2 + 2;
        // Fading labels at the limb never claim space, and only show where it is free.
        show = this.isFree(x0, y0, x1, y1);
        if (show && vis > 0.5) this.claim(x0, y0, x1, y1);
      } else if (show && m.measured) {
        this.claim(x - 14, y - 14, x + 14, y + 14);
      }
      if (!show) {
        if (m.sVis) {
          m.sVis = false;
          m.el.style.visibility = 'hidden';
        }
        continue;
      }
      if (!m.sVis) {
        m.sVis = true;
        m.el.style.visibility = 'visible';
      }
      // Foreshorten slightly toward the limb, as if the marker lay on the curved surface.
      const s = Math.round((0.8 + 0.2 * vis) * 100) / 100;
      if (Math.abs(x - m.sX) > 0.05 || Math.abs(y - m.sY) > 0.05 || s !== m.sS) {
        m.sX = x;
        m.sY = y;
        m.sS = s;
        const anchor = m.kind === 'stop' ? `${(-m.w / 2).toFixed(1)}px` : '-50%';
        m.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(${anchor}, -50%) scale(${s})`;
      }
      const op = Math.round(vis * m.opacity * 100) / 100;
      if (op !== m.sOp) {
        m.sOp = op;
        m.el.style.opacity = String(op);
      }
      const z = Math.round(m.priority);
      if (z !== m.sZ) {
        m.sZ = z;
        m.el.style.zIndex = String(z);
      }
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
