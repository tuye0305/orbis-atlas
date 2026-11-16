import { create } from 'zustand';
import type { Atlas, Lang, RegionKey, Selection } from '../types';

export const YEAR_MIN = 1;
export const YEAR_MAX = 2025;

export interface Layers {
  borders: boolean;
  events: boolean;
  people: boolean;
  places: boolean;
  labels: boolean;
}

interface State {
  atlas: Atlas | null;
  lang: Lang;
  year: number;
  playing: boolean;
  speed: number; // years per second
  region: RegionKey | null; // region under the camera centre
  focusRequest: { region: RegionKey; at: number } | null;
  flyRequest: { lat: number; lon: number; altitude?: number; at: number } | null;
  selection: Selection;
  journeyStop: number; // index into the selected person's / war's stops
  /** Border polity under the pointer, for the hover tooltip. */
  hoverBorder: { en: string; zh: string } | null;
  layers: Layers;
  musicOn: boolean;
  searchOpen: boolean;
  aboutOpen: boolean;
  drawerOpen: boolean;
  /** Id of the mini-game open over the globe (see src/games/registry.ts). */
  game: string | null;
  set: (patch: Partial<State>) => void;
  setYear: (year: number) => void;
  focus: (region: RegionKey) => void;
  flyTo: (lat: number, lon: number, altitude?: number) => void;
  select: (sel: Selection) => void;
  toggleLayer: (k: keyof Layers) => void;
  togglePlay: () => void;
}

const params = new URLSearchParams(location.search);
const initialYear = Number(params.get('year'));
/** Narrow screens start with the side panel closed: it would cover most of the globe. */
export const isCompact = () => window.matchMedia('(max-width: 900px)').matches;
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const initialLang: Lang = params.get('lang') === 'zh' || (!params.get('lang') && navigator.language.startsWith('zh')) ? 'zh' : 'en';

export const useStore = create<State>((set, get) => ({
  atlas: null,
  lang: initialLang,
  year: Number.isFinite(initialYear) && initialYear >= YEAR_MIN && initialYear <= YEAR_MAX ? initialYear : 1066,
  playing: false,
  speed: 12,
  region: null,
  focusRequest: null,
  flyRequest: null,
  selection: null,
  journeyStop: 0,
  hoverBorder: null,
  layers: { borders: true, events: true, people: true, places: true, labels: true },
  musicOn: false,
  searchOpen: false,
  aboutOpen: false,
  drawerOpen: !isCompact(),
  game: null,
  set: (patch) => set(patch),
  setYear: (year) => set({ year: Math.round(Math.min(YEAR_MAX, Math.max(YEAR_MIN, year))) }),
  focus: (region) => set({ focusRequest: { region, at: performance.now() } }),
  flyTo: (lat, lon, altitude) => set({ flyRequest: { lat, lon, altitude, at: performance.now() } }),
  select: (selection) => {
    set({ selection, journeyStop: 0 });
    const s = get();
    if (!selection || !s.atlas) return;
    if (selection.kind === 'event') {
      const ev = s.atlas.events.find((e) => e.id === selection.id);
      if (ev) {
        s.setYear(ev.year);
        s.flyTo(ev.lat, ev.lon, ev.route ? 1.5 : 1.1);
      }
    } else if (selection.kind === 'person') {
      const p = s.atlas.people.find((x) => x.id === selection.id);
      const first = p?.stops[0];
      if (p && first) {
        s.setYear(first.year);
        s.flyTo(first.lat, first.lon, 1.3);
      }
    } else if (selection.kind === 'place') {
      const p = s.atlas.places.find((x) => x.id === selection.id);
      if (p) s.flyTo(p.lat, p.lon, 0.9);
    } else if (selection.kind === 'polity') {
      const p = s.atlas.polities.find((x) => x.id === selection.id);
      if (p) {
        if (s.year < p.from || s.year > p.to) s.setYear(Math.max(YEAR_MIN, p.from));
        if (p.capitalLat != null && p.capitalLon != null) s.flyTo(p.capitalLat, p.capitalLon, 1.4);
      }
    }
  },
  toggleLayer: (k) => set({ layers: { ...get().layers, [k]: !get().layers[k] } }),
  togglePlay: () => {
    const { playing, year } = get();
    // Pressing play at the end of time starts again from the beginning instead of doing nothing.
    if (!playing && year >= YEAR_MAX) set({ year: YEAR_MIN });
    set({ playing: !playing });
  },
}));

export const t = (v: { en: string; zh: string } | undefined, lang: Lang) => (v ? v[lang] || v.en : '');

export function formatYear(y: number, lang: Lang) {
  if (lang === 'zh') return y < 0 ? `公元前${-y}年` : `${y}年`;
  return y < 0 ? `${-y} BCE` : `${y} CE`;
}

// Keep the URL in sync so any view can be shared.
let urlTimer: number | undefined;
useStore.subscribe((s) => {
  clearTimeout(urlTimer);
  urlTimer = window.setTimeout(() => {
    const p = new URLSearchParams();
    p.set('year', String(s.year));
    if (s.lang === 'zh') p.set('lang', 'zh');
    else p.set('lang', 'en');
    if (s.selection && s.selection.kind !== 'border') p.set(s.selection.kind, s.selection.id);
    if (s.game) p.set('game', s.game);
    history.replaceState(null, '', `?${p.toString()}`);
  }, 250);
});
