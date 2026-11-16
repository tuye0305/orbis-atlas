export type Lang = 'en' | 'zh';
export type L10n = { en: string; zh: string };

export type RegionKey =
  | 'europe'
  | 'africa'
  | 'west-asia'
  | 'south-asia'
  | 'central-asia'
  | 'east-asia'
  | 'southeast-asia'
  | 'north-america'
  | 'mesoamerica'
  | 'south-america'
  | 'oceania';

export interface Source {
  title: string;
  url?: string;
}

export interface ImageRef {
  file: string;
  thumb: string;
  page: string;
  license: string | null;
  artist: string | null;
}

interface Base {
  id: string;
  qid?: string;
  region: RegionKey;
  dataset: string;
  summary?: L10n;
  /** Longer narrative (stories, anecdotes, context). Built into stories.json and loaded lazily. */
  story?: L10n;
  sources?: Source[];
  confidence?: 'high' | 'medium' | 'low';
  note?: string;
  image?: ImageRef;
  wiki?: { en: string | null; zh: string | null };
}

export type EventType =
  | 'battle'
  | 'war'
  | 'political'
  | 'founding'
  | 'fall'
  | 'cultural'
  | 'religious'
  | 'science'
  | 'exploration'
  | 'disaster'
  | 'treaty';

export interface Stop {
  year: number;
  lat: number;
  lon: number;
  label: L10n;
}

export interface AtlasEvent extends Base {
  type: EventType;
  year: number;
  endYear?: number;
  date?: string;
  name: L10n;
  lat: number;
  lon: number;
  importance: number;
  people?: string[];
  place?: string;
  polities?: string[];
  route?: Stop[];
}

export interface Person extends Base {
  name: L10n;
  born: number;
  /** null = still living */
  died: number | null;
  role: L10n;
  stops: Stop[];
}

export interface PlaceName {
  from: number;
  to: number | null;
  name: L10n;
  polity?: L10n;
  capital?: boolean;
}

export interface Place extends Base {
  lat: number;
  lon: number;
  modern: L10n;
  names: PlaceName[];
}

export interface Ruler {
  name: L10n;
  from: number;
  to: number;
  qid?: string;
}

export interface Polity extends Base {
  name: L10n;
  from: number;
  to: number;
  capital?: L10n;
  capitalLat?: number;
  capitalLon?: number;
  color: string;
  rulers?: Ruler[];
}

export interface PolityNameInfo {
  zh: string;
  family?: string;
}

export interface Atlas {
  generated: string;
  events: AtlasEvent[];
  people: Person[];
  places: Place[];
  polities: Polity[];
  polityNames: Record<string, PolityNameInfo>;
}

export type Selection =
  | { kind: 'event'; id: string }
  | { kind: 'person'; id: string }
  | { kind: 'place'; id: string }
  | { kind: 'polity'; id: string }
  | { kind: 'border'; name: string; zh?: string; lat: number; lon: number }
  | null;
