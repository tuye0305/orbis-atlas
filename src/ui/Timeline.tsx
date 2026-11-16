import { useMemo, useRef } from 'react';
import { EVENT_COLOR, s } from '../i18n';
import { REGION_BY_KEY } from '../regions';
import { formatYear, t, useStore, YEAR_MAX, YEAR_MIN } from '../state/store';
import type { Polity } from '../types';

const SPAN = YEAR_MAX - YEAR_MIN;
const pct = (y: number) => ((Math.min(YEAR_MAX, Math.max(YEAR_MIN, y)) - YEAR_MIN) / SPAN) * 100;

/** Greedy lane packing so overlapping dynasties stack instead of overdrawing. */
function lanes(polities: Polity[], max = 4) {
  const ends: number[] = [];
  const out: { p: Polity; lane: number }[] = [];
  for (const p of [...polities].sort((a, b) => a.from - b.from)) {
    let lane = ends.findIndex((e) => e < p.from);
    if (lane === -1) {
      if (ends.length >= max) continue;
      lane = ends.length;
      ends.push(p.to);
    } else ends[lane] = p.to;
    out.push({ p, lane });
  }
  return { items: out, count: Math.max(1, ends.length) };
}

export function Timeline() {
  const year = useStore((st) => st.year);
  const lang = useStore((st) => st.lang);
  const playing = useStore((st) => st.playing);
  const speed = useStore((st) => st.speed);
  const region = useStore((st) => st.region);
  const atlas = useStore((st) => st.atlas);
  const set = useStore((st) => st.set);
  const setYear = useStore((st) => st.setYear);
  const select = useStore((st) => st.select);
  const track = useRef<HTMLDivElement>(null);

  const regionPolities = useMemo(() => {
    if (!atlas || !region) return { items: [], count: 1 };
    return lanes(atlas.polities.filter((p) => p.region === region && p.to - p.from >= 20));
  }, [atlas, region]);

  const ticks = useMemo(() => (atlas ? atlas.events.filter((e) => e.importance >= 3 && (!region || e.region === region)) : []), [atlas, region]);

  const yearFromPointer = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return YEAR_MIN + ((clientX - r.left) / r.width) * SPAN;
  };

  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    set({ playing: false });
    setYear(yearFromPointer(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => {
    if (e.buttons) setYear(yearFromPointer(e.clientX));
  };

  const centuries = [];
  for (let c = 100; c <= 2000; c += 100) centuries.push(c);
  const rulerNow = atlas?.polities
    .filter((p) => p.region === region && year >= p.from && year <= p.to)
    .flatMap((p) => (p.rulers ?? []).filter((r) => year >= r.from && year <= r.to).map((r) => ({ r, p })))[0];

  return (
    <footer className="timeline">
      <div className="tl-head">
        <button className="play" onClick={() => set({ playing: !playing })} aria-label={playing ? s('pause', lang) : s('play', lang)}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M7 5l12 7-12 7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="year-display" key={Math.floor(year / 100)}>
          <span className="year-num">{lang === 'zh' ? year : year}</span>
          <span className="year-era">{lang === 'zh' ? '公元' : 'CE'}</span>
        </div>
        <div className="tl-context">
          {region && <span className="tl-region">{REGION_BY_KEY[region].name[lang]}</span>}
          {rulerNow && (
            <span className="tl-ruler">
              <i style={{ background: rulerNow.p.color }} />
              {t(rulerNow.p.name, lang)} · {t(rulerNow.r.name, lang)}
            </span>
          )}
        </div>
        <div className="speed">
          {[5, 12, 30].map((v) => (
            <button key={v} className={speed === v ? 'on' : ''} onClick={() => set({ speed: v })}>
              {v}
            </button>
          ))}
          <span>{s('speed', lang)}</span>
        </div>
      </div>

      <div className="tl-track" ref={track} onPointerDown={onDown} onPointerMove={onMove}>
        <div className="tl-lanes" style={{ height: `${regionPolities.count * 9}px` }}>
          {regionPolities.items.map(({ p, lane }) => (
            <button
              key={p.id}
              className={`tl-band ${year >= p.from && year <= p.to ? 'now' : ''}`}
              style={{ left: `${pct(p.from)}%`, width: `${Math.max(0.4, pct(p.to) - pct(p.from))}%`, top: `${lane * 9}px`, background: p.color }}
              title={`${t(p.name, lang)} ${formatYear(p.from, lang)} – ${formatYear(p.to, lang)}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => select({ kind: 'polity', id: p.id })}
            >
              <span>{t(p.name, lang)}</span>
            </button>
          ))}
        </div>
        <div className="tl-ticks">
          {ticks.map((e) => (
            <i
              key={e.id}
              style={{ left: `${pct(e.year)}%`, background: EVENT_COLOR[e.type], height: `${4 + e.importance * 2.2}px` }}
              title={`${e.year} · ${t(e.name, lang)}`}
            />
          ))}
        </div>
        <div className="tl-axis">
          {centuries.map((c) => (
            <span key={c} style={{ left: `${pct(c)}%` }}>
              {c}
            </span>
          ))}
        </div>
        <div className="tl-head-line" style={{ left: `${pct(year)}%` }}>
          <b />
        </div>
      </div>
    </footer>
  );
}
