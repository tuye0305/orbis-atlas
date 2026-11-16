import { geoArea, geoBounds, geoCentroid, geoContains } from 'd3-geo';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import type { PolityNameInfo } from '../types';

export interface BorderProps {
  NAME: string;
  NAME_ZH?: string | null;
  SUBJECTO?: string | null;
  PARTOF?: string | null;
  BORDERPRECISION?: number;
  SRC?: 'hb' | 'jiangshan';
  ROLE?: string | null;
}

/** Localised border name: jiangshan features carry their own Chinese title. */
export function borderName(p: BorderProps, lang: 'en' | 'zh', names: Record<string, PolityNameInfo>) {
  if (lang === 'en') return p.NAME;
  return p.NAME_ZH || names[p.NAME]?.zh || p.NAME;
}

export interface BorderFeature extends Feature<Polygon | MultiPolygon, BorderProps> {
  __color: string;
  __faint: boolean;
  __area: number; // steradians
  __label: [number, number]; // lon, lat
  __bbox: [[number, number], [number, number]];
}

export interface Snapshot {
  year: number;
  features: BorderFeature[];
}

const BASE = import.meta.env.BASE_URL;

// Muted, print-atlas inspired palette; one colour per lineage ("family") so a state keeps
// its colour as its borders move.
const PALETTE = [
  '#b5523b', '#c98b3a', '#7d8f4e', '#4f7a8c', '#8a5c9e', '#a8645a', '#5f8a73', '#b39348',
  '#6a6fa0', '#a0526e', '#3f7f6e', '#c4743d', '#7a8a3a', '#5a7fb0', '#9b4b3f', '#8c6d4f',
];
const FAMILY_COLOR: Record<string, string> = {
  rome: '#8a2f3c',
  china: '#c0392b',
  persia: '#2f7f74',
  caliphate: '#3f8f4f',
  ottoman: '#2e6f5e',
  russia: '#5c7a99',
  mongol: '#7b5ea7',
  england: '#b0473c',
  'united-kingdom': '#b0473c',
  france: '#3b5fa0',
  spain: '#c9a23a',
  portugal: '#3d8a5a',
  'holy-roman': '#c8a24a',
  habsburg: '#c8a24a',
  japan: '#d06a8a',
  korea: '#4f8fb0',
  'india-mughal': '#3e9a62',
  netherlands: '#d9822b',
  germany: '#5a5a5a',
  italy: '#4f9a6a',
};

const FAINT = /hunter|gatherer|peoples|tribes|culture|nomads|pastoral|settlers|herders|foragers|chiefdoms|clans|confederation of/i;

export function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function colorFor(name: string, subjecto: string | undefined, names: Record<string, PolityNameInfo>) {
  const fam = (subjecto && subjecto !== name && names[subjecto]?.family) || names[name]?.family;
  if (fam) return FAMILY_COLOR[fam] ?? PALETTE[hash(fam) % PALETTE.length];
  return PALETTE[hash(subjecto && subjecto !== name ? subjecto : name) % PALETTE.length];
}

let indexCache: { year: number; file: string }[] | null = null;
const snapCache = new Map<number, Promise<Snapshot>>();

export async function loadIndex() {
  if (!indexCache) indexCache = await fetch(`${BASE}data/borders/index.json`).then((r) => r.json());
  return indexCache!;
}

/** The snapshot shown for a given year: the latest one at or before it. */
export function snapshotYearFor(index: { year: number }[], year: number) {
  let best = index[0].year;
  for (const s of index) if (s.year <= year) best = s.year;
  return best;
}

function largestPolygon(geom: Polygon | MultiPolygon): Polygon {
  if (geom.type === 'Polygon') return geom;
  let best: Polygon = { type: 'Polygon', coordinates: geom.coordinates[0] };
  let bestA = -1;
  for (const coords of geom.coordinates) {
    const p: Polygon = { type: 'Polygon', coordinates: coords };
    const a = geoArea(p);
    if (a > bestA) {
      bestA = a;
      best = p;
    }
  }
  return best;
}

export function loadSnapshot(year: number, names: Record<string, PolityNameInfo>): Promise<Snapshot> {
  let p = snapCache.get(year);
  if (!p) {
    p = fetch(`${BASE}data/borders/${year}.topo.json`)
      .then((r) => r.json())
      .then((topo: Topology) => {
        const key = Object.keys(topo.objects)[0];
        const fc = feature(topo, topo.objects[key]) as unknown as FeatureCollection<Polygon | MultiPolygon, BorderProps>;
        const features: BorderFeature[] = [];
        for (const f of fc.features) {
          if (!f.geometry || !f.properties?.NAME) continue;
          const area = geoArea(f);
          // geoArea > 2π means the ring winding is inverted (polygon covers the rest of the globe).
          if (area > 2 * Math.PI) continue;
          const bf = f as BorderFeature;
          bf.__color =
            f.properties.ROLE === 'main' || f.properties.ROLE === 'protectorate'
              ? FAMILY_COLOR.china
              : colorFor(f.properties.NAME, f.properties.SUBJECTO ?? undefined, names);
          bf.__faint = FAINT.test(f.properties.NAME);
          bf.__area = area;
          const c = geoCentroid(largestPolygon(f.geometry));
          bf.__label = [c[0], c[1]];
          bf.__bbox = geoBounds(f) as [[number, number], [number, number]];
          features.push(bf);
        }
        return { year, features };
      });
    snapCache.set(year, p);
  }
  return p;
}

export function featureAt(snapshot: Snapshot | null, lon: number, lat: number): BorderFeature | null {
  if (!snapshot) return null;
  let hit: BorderFeature | null = null;
  for (const f of snapshot.features) {
    const [[x0, y0], [x1, y1]] = f.__bbox;
    if (lat < y0 || lat > y1) continue;
    const inLon = x0 <= x1 ? lon >= x0 && lon <= x1 : lon >= x0 || lon <= x1;
    if (!inLon) continue;
    if (geoContains(f, [lon, lat]) && (!hit || f.__area < hit.__area)) hit = f;
  }
  return hit;
}
