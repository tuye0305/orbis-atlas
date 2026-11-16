import { useState } from 'react';
import { s } from '../i18n';
import { REGION_BY_KEY, REGIONS } from '../regions';
import { type Layers, useStore } from '../state/store';

export function TopBar({ onAbout }: { onAbout: () => void }) {
  const lang = useStore((st) => st.lang);
  const region = useStore((st) => st.region);
  const musicOn = useStore((st) => st.musicOn);
  const layers = useStore((st) => st.layers);
  const set = useStore((st) => st.set);
  const focus = useStore((st) => st.focus);
  const toggleLayer = useStore((st) => st.toggleLayer);
  const [layersOpen, setLayersOpen] = useState(false);
  const cur = region ? REGION_BY_KEY[region] : null;

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden />
        <div>
          <div className="brand-title">
            Orbis <span>·</span> 寰宇时序
          </div>
          <div className="brand-sub">{lang === 'zh' ? '两千年世界历史地图' : 'Chronicles of the World'}</div>
        </div>
      </div>

      <button className="search-trigger" onClick={() => set({ searchOpen: true })}>
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>{s('search', lang)}</span>
        <kbd>⌘K</kbd>
      </button>

      <nav className="regions" aria-label="Regions">
        {REGIONS.map((r) => (
          <button
            key={r.key}
            className={`region-chip ${region === r.key ? 'on' : ''}`}
            style={{ ['--accent' as string]: r.accent }}
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
          title={cur ? `${s('regionMusic', lang)}: ${cur.music[lang]}` : s('music', lang)}
        >
          <span className="eq" aria-hidden>
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="music-label">{musicOn ? (cur ? cur.music[lang] : lang === 'zh' ? '远洋 · 琴声' : 'Open sea · bells') : s('music', lang)}</span>
        </button>
        <div className="layers-wrap">
          <button className="icon-btn" onClick={() => setLayersOpen(!layersOpen)} aria-expanded={layersOpen}>
            {s('layers', lang)}
          </button>
          {layersOpen && (
            <div className="layers-menu">
              {(['borders', 'labels', 'events', 'people', 'places'] as (keyof Layers)[]).map((k) => (
                <label key={k}>
                  <input type="checkbox" checked={layers[k]} onChange={() => toggleLayer(k)} />
                  <span>{s(k, lang)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <button className="icon-btn lang" onClick={() => set({ lang: lang === 'en' ? 'zh' : 'en' })}>
          {lang === 'en' ? '中文' : 'EN'}
        </button>
        <button className="icon-btn" onClick={onAbout} aria-label={s('about', lang)}>
          ?
        </button>
      </div>
    </header>
  );
}
