import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EVENT_COLOR, s } from '../i18n';
import { REGION_BY_KEY } from '../regions';
import { formatYear, t, useStore, YEAR_MAX, YEAR_MIN } from '../state/store';
import type { Polity } from '../types';
import { useHeightVar } from './layout';

const SPAN = YEAR_MAX - YEAR_MIN;
const SPEEDS = [5, 12, 30];
/** Century labels at least this far apart (px), so "1000 1100" never run together. */
const LABEL_GAP = 42;
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
  const togglePlay = useStore((st) => st.togglePlay);
  const setYear = useStore((st) => st.setYear);
  const select = useStore((st) => st.select);
  const track = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  useHeightVar(root, '--timeline-h');
  // Label every century when there is room, else every 200 or 500 years (the track's own width).
  const [trackW, setTrackW] = useState(0);
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTrackW(el.clientWidth));
    ro.observe(el);
    setTrackW(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  const labelStep = [100, 200, 500].find((st) => (trackW * st) / SPAN >= LABEL_GAP) ?? 1000;

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
  // Standard slider keys. They stop here, so the app-wide ←/→ (next event) does not also fire.
  const onKey = (e: React.KeyboardEvent) => {
    const big = e.shiftKey ? 10 : 1;
    const step: Record<string, number> = { ArrowLeft: -big, ArrowDown: -big, ArrowRight: big, ArrowUp: big, PageDown: -100, PageUp: 100 };
    let next: number | null = null;
    if (e.key in step) next = year + step[e.key];
    else if (e.key === 'Home') next = YEAR_MIN;
    else if (e.key === 'End') next = YEAR_MAX;
    if (next === null) return;
    e.preventDefault();
    e.stopPropagation();
    set({ playing: false });
    setYear(next);
  };

  const centuries = [];
  for (let c = labelStep; c <= 2000; c += labelStep) centuries.push(c);
  const rulerNow = atlas?.polities
    .filter((p) => p.region === region && year >= p.from && year <= p.to)
    .flatMap((p) => (p.rulers ?? []).filter((r) => year >= r.from && year <= r.to).map((r) => ({ r, p })))[0];

  return (
    <footer className="timeline" ref={root} aria-label={s('timeline', lang)}>
      <div className="tl-head">
        <button className="play" onClick={togglePlay} aria-label={playing ? s('pause', lang) : s('play', lang)}>
          {playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path d="M7 5l12 7-12 7z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="year-display" key={Math.floor(year / 100)} aria-hidden>
          <span className="year-num">{year}</span>
          <span className="year-era">{lang === 'zh' ? '公元' : 'CE'}</span>
        </div>
        <div className="tl-context">
          {region && <span className="tl-region">{REGION_BY_KEY[region].name[lang]}</span>}
          {rulerNow && (
            <span className="tl-ruler">
              <i style={{ background: rulerNow.p.color }} />
              <span className="tl-ruler-text">
                {t(rulerNow.p.name, lang)} · {t(rulerNow.r.name, lang)}
              </span>
            </span>
          )}
        </div>
        <div className="speed" role="group" aria-label={s('speedLabel', lang)}>
          {SPEEDS.map((v) => (
            <button key={v} className={speed === v ? 'on' : ''} aria-pressed={speed === v} aria-label={`${v} ${s('speed', lang)}`} onClick={() => set({ speed: v })}>
              {v}
            </button>
          ))}
          <span aria-hidden>{s('speed', lang)}</span>
        </div>
        {/* Phones have no room for three buttons: one that cycles 5 → 12 → 30 years per second. */}
        <button
          className="speed-cycle"
          onClick={() => set({ speed: SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] })}
          aria-label={`${s('speedLabel', lang)}: ${speed} ${s('speed', lang)}`}
        >
          <b>{speed}</b>
          <small aria-hidden>{s('speed', lang)}</small>
        </button>
      </div>

      <div
        className="tl-track"
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label={s('year', lang)}
        aria-valuemin={YEAR_MIN}
        aria-valuemax={YEAR_MAX}
        aria-valuenow={year}
        aria-valuetext={[formatYear(year, lang), rulerNow && `${t(rulerNow.p.name, lang)} · ${t(rulerNow.r.name, lang)}`].filter(Boolean).join(', ')}
        aria-orientation="horizontal"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onKeyDown={onKey}
      >
        <div className="tl-lanes" style={{ height: `${regionPolities.count * 9}px` }}>
          {regionPolities.items.map(({ p, lane }) => (
            <button
              key={p.id}
              className={`tl-band ${year >= p.from && year <= p.to ? 'now' : ''}`}
              style={{ left: `${pct(p.from)}%`, width: `${Math.max(0.4, pct(p.to) - pct(p.from))}%`, top: `${lane * 9}px`, background: p.color }}
              title={`${t(p.name, lang)} ${formatYear(p.from, lang)} – ${formatYear(p.to, lang)}`}
              tabIndex={-1}
              aria-hidden
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => select({ kind: 'polity', id: p.id })}
            >
              <span>{t(p.name, lang)}</span>
            </button>
          ))}
        </div>
        <div className="tl-ticks" aria-hidden>
          {ticks.map((e) => (
            <i
              key={e.id}
              style={{ left: `${pct(e.year)}%`, background: EVENT_COLOR[e.type], height: `${4 + e.importance * 2.2}px` }}
              title={`${e.year} · ${t(e.name, lang)}`}
            />
          ))}
        </div>
        <div className="tl-axis" aria-hidden>
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
