import { useEffect, useId, useRef, useState } from 'react';
import { useNowPlaying } from '../audio/nowPlaying';
import { GAMES } from '../games/registry';
import { s } from '../i18n';
import { REGION_BY_KEY, REGIONS } from '../regions';
import { type Layers, useStore } from '../state/store';

export function TopBar() {
  const lang = useStore((st) => st.lang);
  const region = useStore((st) => st.region);
  const musicOn = useStore((st) => st.musicOn);
  const layers = useStore((st) => st.layers);
  const set = useStore((st) => st.set);
  const focus = useStore((st) => st.focus);
  const toggleLayer = useStore((st) => st.toggleLayer);
  const [layersOpen, setLayersOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const gamesRef = useRef<HTMLDivElement>(null);
  const gamesBtn = useRef<HTMLButtonElement>(null);
  const gamesId = useId();
  const layersRef = useRef<HTMLDivElement>(null);
  const layersBtn = useRef<HTMLButtonElement>(null);
  const menuId = useId();
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
    <header className="topbar">
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

      <nav className="regions" aria-label={s('regionsNav', lang)}>
        {REGIONS.map((r) => (
          <button
            key={r.key}
            className={`region-chip ${region === r.key ? 'on' : ''}`}
            style={{ ['--accent' as string]: r.accent }}
            aria-current={region === r.key ? 'location' : undefined}
            onClick={() => focus(r.key)}
          >
            {r.name[lang]}
          </button>
        ))}
      </nav>

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
          <button ref={gamesBtn} className="icon-btn games-btn" onClick={() => setGamesOpen(!gamesOpen)} aria-expanded={gamesOpen} aria-controls={gamesId}>
            {lang === 'zh' ? '小游戏' : 'Games'}
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
          <button ref={layersBtn} className="icon-btn" onClick={() => setLayersOpen(!layersOpen)} aria-expanded={layersOpen} aria-controls={menuId}>
            {s('layers', lang)}
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
