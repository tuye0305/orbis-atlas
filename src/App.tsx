import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { MusicEngine } from './audio/MusicEngine';
import type { TrackPlayer } from './audio/TrackPlayer';
import type { GlobeEngine } from './globe/GlobeEngine';
import { s } from './i18n';
import { REGION_BY_KEY } from './regions';
import { prefersReducedMotion, useStore } from './state/store';
import type { Atlas, Selection } from './types';
import { DetailCard } from './ui/DetailCard';
import { Drawer } from './ui/Drawer';
import { framedTarget, freeArea } from './ui/framing';
import { HoverTip } from './ui/HoverTip';
import { Intro, type LoadError } from './ui/Intro';
import Search from './ui/Search';
import { Timeline } from './ui/Timeline';
import { TopBar } from './ui/TopBar';

// Code-split: three.js + three-globe are ~80% of the JS. Start fetching them as soon as the app
// shell runs, in parallel with atlas.json, while the intro screen is already painted.
// (Search stays in the main chunk: it is ~3 kB and must focus its field within the `/` keystroke,
// or the first typed letters are lost.)
const globeModule = import('./globe/GlobeEngine');
const loadAbout = () => import('./ui/About');
const About = lazy(loadAbout);

// Music is only needed once someone turns it on. The player is fetched in the background after the
// globe is up, so that enabling music still happens inside the click (autoplay rules). It plays the
// recorded per-region tracks in public/music (scripts/gen-music.mjs); the procedural MusicEngine is
// only a fallback for builds that have no tracks.
type Music = Pick<MusicEngine, 'setEnabled' | 'setRegion'>;
let music: Music | null = null;
let musicLoading: Promise<Music> | null = null;
const loadMusic = () =>
  (musicLoading ??= import('./audio/TrackPlayer').then(async ({ TrackPlayer, loadManifest }) => {
    const manifest = await loadManifest();
    if (manifest) {
      const player = new TrackPlayer(manifest);
      // Play/pause from the OS media controls goes through the store, so the top bar follows.
      player.onRemote = (on) => useStore.getState().set({ musicOn: on });
      return (music = player);
    }
    const { MusicEngine } = await import('./audio/MusicEngine');
    return (music = new MusicEngine());
  }));

/** GSAP fly-to duration: an instant cut when the user asked for reduced motion, else the engine default. */
const flyDuration = () => (prefersReducedMotion() ? 0.01 : undefined);

export default function App() {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<GlobeEngine | null>(null);
  const enteredRef = useRef(false);
  const [entered, setEntered] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [error, setError] = useState<LoadError>(null);
  const atlas = useStore((st) => st.atlas);
  const lang = useStore((st) => st.lang);
  const searchOpen = useStore((st) => st.searchOpen);
  const aboutOpen = useStore((st) => st.aboutOpen);

  // Language of the document, for screen readers, hyphenation and the :lang(zh) font rules.
  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  }, [lang]);

  // Load data once.
  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/atlas.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`atlas.json: HTTP ${r.status}`);
        return r.json();
      })
      .then((a: Atlas) => {
        if (cancelled) return;
        useStore.getState().set({ atlas: a });
        // Deep links: ?event=…&person=…&place=…
        const p = new URLSearchParams(location.search);
        for (const kind of ['event', 'person', 'place', 'polity'] as const) {
          const id = p.get(kind);
          if (id) useStore.getState().select({ kind, id } as Selection);
        }
      })
      .catch((err) => {
        console.warn(err);
        if (!cancelled) setError('data');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Create the globe engine (once its chunk arrives) and wire it to the store.
  useEffect(() => {
    let cancelled = false;
    let teardown = () => {};
    globeModule.then(
      ({ GlobeEngine }) => {
        if (cancelled || !host.current) return;
        let eng: GlobeEngine;
        try {
          eng = new GlobeEngine(host.current, {
            onRegion: (r) => {
              useStore.getState().set({ region: r });
              music?.setRegion(r);
            },
            onSelect: (sel) => useStore.getState().select(sel),
            onHoverBorder: (name) => useStore.getState().set({ hoverBorder: name }),
            focusPoint: () => {
              const sel = useStore.getState().selection;
              const a = freeArea(!!sel && sel.kind !== 'border');
              return { x: (a.left + a.right) / 2, y: (a.top + a.bottom) / 2 };
            },
            onReady: () => {
              setGlobeReady(true);
              loadMusic();
            },
          });
        } catch (err) {
          console.warn(err);
          setError('webgl');
          return;
        }
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
          // Aim so the target lands in the part of the screen no panel covers.
          const cardOpen = !!st.selection && st.selection.kind !== 'border';
          if (st.focusRequest && st.focusRequest !== prev.focusRequest) {
            const r = REGION_BY_KEY[st.focusRequest.region];
            const aim = framedTarget(r.lat, r.lon, r.altitude, cardOpen);
            eng.flyTo(aim.lat, aim.lon, r.altitude, flyDuration());
          }
          if (st.flyRequest && st.flyRequest !== prev.flyRequest) {
            const f = st.flyRequest;
            const alt = f.altitude ?? 1.3;
            const aim = framedTarget(f.lat, f.lon, alt, cardOpen);
            eng.flyTo(aim.lat, aim.lon, alt, flyDuration());
          }
          if (st.musicOn !== prev.musicOn) {
            // Synchronous when the module is already here, so AudioContext starts inside the click.
            if (music) music.setEnabled(st.musicOn, st.region);
            else if (st.musicOn)
              loadMusic().then((m) => {
                const now = useStore.getState();
                m.setEnabled(now.musicOn, now.region);
              });
          }
        });
        teardown = () => {
          unsub();
          eng.dispose();
          engine.current = null;
        };
      },
      (err) => {
        console.warn(err);
        if (!cancelled) setError('webgl');
      },
    );
    return () => {
      cancelled = true;
      teardown();
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
      // Nothing to control behind the intro; open dialogs handle their own keys.
      if (!enteredRef.current || st.searchOpen || st.aboutOpen) return;
      const el = e.target as HTMLElement | null;
      const typing = el?.closest?.('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        st.set({ searchOpen: true });
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        st.select(null);
      } else if (e.key === ' ') {
        // Space on a focused button or link must activate it, not toggle playback.
        if (el?.closest?.('button, a[href], summary, [role="button"], label')) return;
        e.preventDefault();
        st.togglePlay();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        stepEvent(e.key === 'ArrowRight' ? 1 : -1, e.shiftKey);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const enter = (withMusic: boolean) => {
    enteredRef.current = true;
    setEntered(true);
    const reduced = prefersReducedMotion();
    if (reduced) engine.current?.flyTo(36, 40, 2.1, 0.01);
    else engine.current?.intro();
    // Start the music once the intro has landed, not on each region the swing passes over.
    const { selection: deepLink } = useStore.getState();
    // Intro flight 3.2 s + region tracking settle (~0.6 s) + margin; deep links fly on afterwards.
    const settleMs = reduced ? 900 : deepLink ? 6200 : 4600;
    if (music && 'holdFor' in music) (music as TrackPlayer).holdFor(settleMs);
    else void loadMusic().then((m) => 'holdFor' in m && (m as TrackPlayer).holdFor(settleMs));
    if (withMusic) useStore.getState().set({ musicOn: true });
    // Warm the lazily-loaded About dialog so “?” opens without a network round trip.
    void loadAbout();
    // A deep-linked selection flies to its target once the intro swing has landed.
    const { selection, select, year, setYear } = useStore.getState();
    if (selection)
      setTimeout(
        () => {
          select(selection);
          if (selection.kind === 'place') setYear(year);
        },
        reduced ? 100 : 3300,
      );
  };

  return (
    <div className={`app ${entered ? '' : 'pre'} ${lang}`}>
      {entered && (
        <>
          <TopBar />
          <main className="ui-main">
            <h1 className="sr-only">Orbis · 寰宇时序</h1>
            <Drawer />
            <DetailCard />
            <Timeline />
          </main>
          {searchOpen && <Search />}
          <Suspense fallback={null}>{aboutOpen && <About />}</Suspense>
          <div className="disclaimer">{s('approx', lang)}</div>
          <HoverTip />
        </>
      )}
      {/* After the panels in DOM order (z-index keeps it underneath), so Tab reaches the controls
          before the globe's ~200 marker buttons. Inert behind the intro screen. */}
      <div ref={host} className="globe-host" role="region" aria-label={lang === 'zh' ? '地球' : 'Globe'} inert={!entered} />
      <div className="vignette" />
      {!entered && <Intro dataReady={!!atlas} globeReady={globeReady} error={error} onEnter={enter} onRetry={() => location.reload()} />}
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
