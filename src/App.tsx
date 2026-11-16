import { useEffect, useRef, useState } from 'react';
import { MusicEngine } from './audio/MusicEngine';
import { GlobeEngine } from './globe/GlobeEngine';
import { s } from './i18n';
import { REGION_BY_KEY } from './regions';
import { useStore } from './state/store';
import type { Atlas, Selection } from './types';
import { About } from './ui/About';
import { DetailCard } from './ui/DetailCard';
import { Drawer } from './ui/Drawer';
import { Intro } from './ui/Intro';
import { Search } from './ui/Search';
import { Timeline } from './ui/Timeline';
import { TopBar } from './ui/TopBar';

const music = new MusicEngine();

export default function App() {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<GlobeEngine | null>(null);
  const [hoverName, setHoverName] = useState<{ en: string; zh: string } | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [entered, setEntered] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const atlas = useStore((st) => st.atlas);
  const lang = useStore((st) => st.lang);

  // Load data once.
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/atlas.json`)
      .then((r) => r.json())
      .then((a: Atlas) => {
        useStore.getState().set({ atlas: a });
        // Deep links: ?event=…&person=…&place=…
        const p = new URLSearchParams(location.search);
        for (const kind of ['event', 'person', 'place', 'polity'] as const) {
          const id = p.get(kind);
          if (id) useStore.getState().select({ kind, id } as Selection);
        }
      });
  }, []);

  // Create the globe engine and wire it to the store.
  useEffect(() => {
    if (!host.current) return;
    const eng = new GlobeEngine(host.current, {
      onRegion: (r) => {
        useStore.getState().set({ region: r });
        music.setRegion(r);
      },
      onSelect: (sel) => useStore.getState().select(sel),
      onHoverBorder: setHoverName,
      onReady: () => {},
    });
    engine.current = eng;
    const push = () => {
      const st = useStore.getState();
      if (!st.atlas) return;
      eng.update({ atlas: st.atlas, year: st.year, lang: st.lang, layers: st.layers, selection: st.selection, journeyStop: st.journeyStop });
    };
    push();
    const unsub = useStore.subscribe((st, prev) => {
      if (
        st.atlas !== prev.atlas ||
        st.year !== prev.year ||
        st.lang !== prev.lang ||
        st.layers !== prev.layers ||
        st.selection !== prev.selection ||
        st.journeyStop !== prev.journeyStop
      )
        push();
      if (st.focusRequest && st.focusRequest !== prev.focusRequest) {
        const r = REGION_BY_KEY[st.focusRequest.region];
        eng.flyTo(r.lat, r.lon, r.altitude);
      }
      if (st.flyRequest && st.flyRequest !== prev.flyRequest) {
        const f = st.flyRequest;
        eng.flyTo(f.lat, f.lon, f.altitude ?? 1.3);
      }
      if (st.musicOn !== prev.musicOn) music.setEnabled(st.musicOn, st.region);
    });
    return () => {
      unsub();
      eng.dispose();
      engine.current = null;
    };
  }, []);

  // Playback: advance the year at `speed` years per second.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const st = useStore.getState();
      const dt = (now - last) / 1000;
      last = now;
      if (st.playing) {
        acc += dt * st.speed;
        if (acc >= 1) {
          const step = Math.floor(acc);
          acc -= step;
          if (st.year + step > 2025) st.set({ playing: false });
          else st.setYear(st.year + step);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useStore.getState();
      const typing = (e.target as HTMLElement)?.closest('input, textarea');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        st.set({ searchOpen: true });
        return;
      }
      if (typing) return;
      if (e.key === 'Escape') {
        if (st.searchOpen) st.set({ searchOpen: false });
        else st.select(null);
      } else if (e.key === ' ') {
        e.preventDefault();
        st.set({ playing: !st.playing });
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        stepEvent(e.key === 'ArrowRight' ? 1 : -1, e.shiftKey);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const enter = (withMusic: boolean) => {
    setEntered(true);
    engine.current?.intro();
    if (withMusic) useStore.getState().set({ musicOn: true });
    // A deep-linked selection flies to its target once the intro swing has landed.
    const { selection, select, year, setYear } = useStore.getState();
    if (selection) setTimeout(() => {
      select(selection);
      if (selection.kind === 'place') setYear(year);
    }, 3300);
  };

  return (
    <div className={`app ${entered ? '' : 'pre'} ${lang}`} onPointerMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}>
      <div ref={host} className="globe-host" />
      <div className="vignette" />
      {entered && (
        <>
          <TopBar onAbout={() => setAboutOpen(true)} />
          <Drawer />
          <DetailCard />
          <Timeline />
          <Search />
          <div className="disclaimer">{s('approx', lang)}</div>
        </>
      )}
      {hoverName && entered && (
        <div className="hover-tip" style={{ transform: `translate(${mouse.x + 14}px, ${mouse.y + 12}px)` }}>
          {hoverName[lang]}
        </div>
      )}
      {!entered && <Intro ready={!!atlas} onEnter={enter} />}
      {aboutOpen && <About onClose={() => setAboutOpen(false)} />}
    </div>
  );
}

/** Jump to the next/previous event year (or ±10 years with Shift); steps journeys when one is open. */
function stepEvent(dir: 1 | -1, coarse: boolean) {
  const st = useStore.getState();
  if (!st.atlas) return;
  const sel = st.selection;
  const stops =
    sel?.kind === 'person'
      ? st.atlas.people.find((p) => p.id === sel.id)?.stops
      : sel?.kind === 'event'
        ? st.atlas.events.find((e) => e.id === sel.id)?.route
        : undefined;
  if (stops?.length) {
    const i = Math.max(0, Math.min(stops.length - 1, st.journeyStop + dir));
    const stop = stops[i];
    st.set({ journeyStop: i });
    st.setYear(stop.year);
    st.flyTo(stop.lat, stop.lon, 1.2);
    return;
  }
  if (coarse) return st.setYear(st.year + dir * 10);
  const years = [...new Set(st.atlas.events.filter((e) => e.importance >= 3).map((e) => e.year))].sort((a, b) => a - b);
  const next = dir > 0 ? years.find((y) => y > st.year) : [...years].reverse().find((y) => y < st.year);
  if (next !== undefined) st.setYear(next);
}
