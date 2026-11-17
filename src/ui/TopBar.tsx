import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useNowPlaying } from '../audio/nowPlaying';
import { GAMES } from '../games/registry';
import { s } from '../i18n';
import { REGION_BY_KEY } from '../regions';
import { type Layers, useStore } from '../state/store';
import { useHeightVar } from './layout';
import { RegionNav } from './RegionNav';

/**
 * Whether the region chips fit on the same row as the brand, search and controls. If not, the top
 * bar stacks them on a second, centred row of their own (where they may still scroll sideways).
 * Measured rather than guessed from a breakpoint: the answer depends on the language, the fonts and
 * the music label, and it is the same in both layouts, so it cannot flip back and forth.
 */
function useStacked(bar: React.RefObject<HTMLElement | null>, lang: string) {
  const [stacked, setStacked] = useState(true);
  useLayoutEffect(() => {
    const el = bar.current;
    if (!el) return;
    const measure = () => {
      const nav = el.querySelector<HTMLElement>('.regions');
      const wrap = el.querySelector<HTMLElement>('.regions-wrap');
      if (!nav || !wrap) return;
      const cs = getComputedStyle(el);
      const gap = parseFloat(cs.columnGap) || 0;
      const inner = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const wcs = getComputedStyle(wrap);
      let need = nav.scrollWidth + parseFloat(wcs.paddingLeft) + parseFloat(wcs.paddingRight) + 2;
      const others = [...el.children].filter((c) => c !== wrap) as HTMLElement[];
      for (const c of others) need += c.offsetWidth + gap;
      // The music button gives way first (its label ellipsizes), so count it at its minimum width.
      const music = el.querySelector<HTMLElement>('.music-btn');
      if (music) need -= music.offsetWidth - Math.min(music.offsetWidth, parseFloat(getComputedStyle(music).minWidth) || 0);
      setStacked(need > inner);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [bar, lang]);
  return stacked;
}

export function TopBar() {
  const lang = useStore((st) => st.lang);
  const region = useStore((st) => st.region);
  const musicOn = useStore((st) => st.musicOn);
  const layers = useStore((st) => st.layers);
  const set = useStore((st) => st.set);
  const toggleLayer = useStore((st) => st.toggleLayer);
  const [layersOpen, setLayersOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const gamesRef = useRef<HTMLDivElement>(null);
  const gamesBtn = useRef<HTMLButtonElement>(null);
  const gamesId = useId();
  const layersRef = useRef<HTMLDivElement>(null);
  const layersBtn = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const bar = useRef<HTMLElement>(null);
  useHeightVar(bar, '--topbar-h');
  const stacked = useStacked(bar, lang);
  const cur = region ? REGION_BY_KEY[region] : null;
  // Name the music you hear, which can lag the camera (it settles first) or fall back to open sea.
  const playing = useNowPlaying();
  const heard = playing ? (playing === 'ocean' ? null : REGION_BY_KEY[playing]) : cur;
  const track = heard ? heard.music[lang] : lang === 'zh' ? '远洋' : 'Open sea';

  // The layers popover closes on outside click and on Escape (returning focus to its button).
  useEffect(() => {
    if (!layersOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!layersRef.current?.contains(e.target as Node)) setLayersOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setLayersOpen(false);
      layersBtn.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [layersOpen]);

  useEffect(() => {
    if (!gamesOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!gamesRef.current?.contains(e.target as Node)) setGamesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setGamesOpen(false);
      gamesBtn.current?.focus();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [gamesOpen]);

  /** Open a game from the menu: show its event on the globe behind it, then start. */
  const openGame = (id: string, target: string) => {
    setGamesOpen(false);
    const st = useStore.getState();
    st.select({ kind: target.startsWith('person-') ? 'person' : 'event', id: target });
    st.set({ game: id, playing: false });
  };

  return (
    <header className={`topbar${stacked ? ' stacked' : ''}`} ref={bar}>
      <div className="brand">
        <div className="brand-mark" aria-hidden />
        <div>
          <div className="brand-title">
            <span className="brand-latin">Orbis</span> <span className="brand-dot">·</span> <span className="brand-han">寰宇时序</span>
          </div>
          <div className="brand-sub">{lang === 'zh' ? '两千年世界历史地图' : 'Chronicles of the World'}</div>
        </div>
      </div>

      <button className="search-trigger" onClick={() => set({ searchOpen: true })} aria-label={s('search', lang)} aria-keyshortcuts="Meta+K /">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span aria-hidden>{s('search', lang)}</span>
        <kbd aria-hidden>⌘K</kbd>
      </button>

      <RegionNav />

      <div className="controls">
        <button
          className={`music-btn ${musicOn ? 'on' : ''}`}
          onClick={() => set({ musicOn: !musicOn })}
          aria-pressed={musicOn}
          aria-label={musicOn ? `${s('musicOn', lang)} (${s('regionMusic', lang)}: ${track})` : s('musicOff', lang)}
          title={musicOn ? `${s('regionMusic', lang)}: ${track}` : cur ? `${s('regionMusic', lang)}: ${cur.music[lang]}` : s('music', lang)}
        >
          <svg className="note-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden>
            <path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
            <circle cx="16.5" cy="16" r="2.5" fill="currentColor" />
          </svg>
          <span className="eq" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="music-label" aria-hidden>
            {musicOn ? track : s('music', lang)}
          </span>
        </button>
        <div className="layers-wrap" ref={gamesRef}>
          <button ref={gamesBtn} className="icon-btn games-btn" onClick={() => setGamesOpen(!gamesOpen)} aria-expanded={gamesOpen} aria-controls={gamesId} aria-label={lang === 'zh' ? '小游戏' : 'Games'}>
            <svg className="btn-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              <rect x="2.5" y="7" width="19" height="11" rx="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M7.5 10.5v4M5.5 12.5h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="15.5" cy="11.5" r="1.2" fill="currentColor" />
              <circle cx="17.8" cy="13.8" r="1.2" fill="currentColor" />
            </svg>
            <span className="btn-label" aria-hidden>{lang === 'zh' ? '小游戏' : 'Games'}</span>
          </button>
          {gamesOpen && (
            <div className="layers-menu games-menu" id={gamesId} role="group" aria-label={lang === 'zh' ? '小游戏' : 'Mini-games'}>
              {GAMES.map((g) => (
                <button key={g.id} className="games-item" style={{ ['--accent' as string]: g.accent }} onClick={() => openGame(g.id, g.targets[0])}>
                  <b>{g.title[lang]}</b>
                  <small>{g.kicker[lang]}</small>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="layers-wrap" ref={layersRef}>
          <button ref={layersBtn} className="icon-btn" onClick={() => setLayersOpen(!layersOpen)} aria-expanded={layersOpen} aria-controls={menuId} aria-label={s('layers', lang)}>
            <svg className="btn-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
              <path d="M12 3l9 5-9 5-9-5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M3 12.5l9 5 9-5M3 16.5l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="btn-label" aria-hidden>{s('layers', lang)}</span>
          </button>
          {layersOpen && (
            <div className="layers-menu" id={menuId} role="group" aria-label={s('layers', lang)}>
              {(['borders', 'labels', 'events', 'people', 'places'] as (keyof Layers)[]).map((k) => (
                <label key={k}>
                  <input type="checkbox" checked={layers[k]} onChange={() => toggleLayer(k)} />
                  <span>{s(k, lang)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button className="icon-btn lang" onClick={() => set({ lang: lang === 'en' ? 'zh' : 'en' })} aria-label={s('switchLang', lang)} lang={lang === 'en' ? 'zh' : 'en'}>
          {lang === 'en' ? '中文' : 'EN'}
        </button>
        <button className="icon-btn" onClick={() => set({ aboutOpen: true })} aria-label={s('about', lang)} aria-haspopup="dialog">
          ?
        </button>
      </div>
    </header>
  );
}
