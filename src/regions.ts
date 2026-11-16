import type { L10n, RegionKey } from './types';

export interface RegionDef {
  key: RegionKey;
  name: L10n;
  lat: number;
  lon: number;
  altitude: number;
  accent: string;
  music: L10n;
}

export const REGIONS: RegionDef[] = [
  { key: 'europe', name: { en: 'Europe', zh: '欧洲' }, lat: 49, lon: 14, altitude: 1.25, accent: '#7f9cc0', music: { en: 'Lute, viol & organ', zh: '鲁特琴、古提琴与管风琴' } },
  { key: 'africa', name: { en: 'Africa', zh: '非洲' }, lat: 4, lon: 19, altitude: 1.7, accent: '#d08a3e', music: { en: 'Kora & balafon', zh: '科拉琴与巴拉丰木琴' } },
  { key: 'west-asia', name: { en: 'West Asia', zh: '西亚' }, lat: 32, lon: 45, altitude: 1.3, accent: '#c9a54a', music: { en: 'Oud, ney & qanun', zh: '乌德琴、奈伊笛与卡侬琴' } },
  { key: 'central-asia', name: { en: 'Central Asia', zh: '中亚草原' }, lat: 45, lon: 72, altitude: 1.45, accent: '#9aa86a', music: { en: 'Dombra & horse-head fiddle', zh: '冬不拉与马头琴' } },
  { key: 'south-asia', name: { en: 'South Asia', zh: '南亚' }, lat: 22, lon: 79, altitude: 1.3, accent: '#c0675a', music: { en: 'Sitar & bansuri over tanpura', zh: '西塔琴与竹笛 · 坦普拉' } },
  { key: 'east-asia', name: { en: 'East Asia', zh: '东亚' }, lat: 34, lon: 113, altitude: 1.35, accent: '#b5523b', music: { en: 'Guzheng, dizi & erhu', zh: '古筝、笛子与二胡' } },
  { key: 'southeast-asia', name: { en: 'Southeast Asia', zh: '东南亚' }, lat: 9, lon: 109, altitude: 1.4, accent: '#5f9a86', music: { en: 'Gamelan', zh: '甘美兰' } },
];

export const REGION_BY_KEY = Object.fromEntries(REGIONS.map((r) => [r.key, r])) as Record<RegionKey, RegionDef>;

export function angularDistance(aLat: number, aLon: number, bLat: number, bLon: number) {
  const r = Math.PI / 180;
  const d =
    Math.sin(((bLat - aLat) * r) / 2) ** 2 + Math.cos(aLat * r) * Math.cos(bLat * r) * Math.sin(((bLon - aLon) * r) / 2) ** 2;
  return 2 * Math.asin(Math.min(1, Math.sqrt(d))) / r;
}

/** The region whose centre is nearest the camera's look-at point, or null over open ocean / the Americas. */
export function regionAt(lat: number, lon: number): RegionKey | null {
  let best: RegionDef | null = null;
  let bestD = Infinity;
  for (const r of REGIONS) {
    const d = angularDistance(lat, lon, r.lat, r.lon);
    if (d < bestD) {
      bestD = d;
      best = r;
    }
  }
  return best && bestD < 38 ? best.key : null;
}
