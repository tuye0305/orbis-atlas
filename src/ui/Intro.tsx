import { s } from '../i18n';
import { useStore } from '../state/store';

export function Intro({ ready, onEnter }: { ready: boolean; onEnter: (music: boolean) => void }) {
  const lang = useStore((st) => st.lang);
  const set = useStore((st) => st.set);
  return (
    <div className="intro">
      <div className="intro-inner">
        <div className="intro-kicker">{lang === 'zh' ? '欧洲 · 非洲 · 亚洲 · 公元 1 — 2025' : 'Europe · Africa · Asia · 1 — 2025 CE'}</div>
        <h1 className="intro-title">
          <span className="latin">Orbis</span>
          <span className="dot">·</span>
          <span className="han">寰宇时序</span>
        </h1>
        <p className="intro-sub">
          {lang === 'zh'
            ? '转动地球，穿越两千年：疆域消长、王朝更迭、战争与名人，以及每一座城市的名字如何随时代改变。'
            : 'Turn the globe and travel two thousand years: shifting borders, rising and falling dynasties, wars and famous lives, and how every city’s name changed with its rulers.'}
        </p>
        <div className="intro-actions">
          <button className="btn-primary" disabled={!ready} onClick={() => onEnter(true)}>
            {ready ? (lang === 'zh' ? '进入地图 · 开启音乐' : 'Enter with music') : s('loading', lang)}
          </button>
          <button className="btn-ghost" disabled={!ready} onClick={() => onEnter(false)}>
            {lang === 'zh' ? '静音进入' : 'Enter silently'}
          </button>
        </div>
        <div className="intro-lang">
          <button className={lang === 'en' ? 'on' : ''} onClick={() => set({ lang: 'en' })}>
            English
          </button>
          <button className={lang === 'zh' ? 'on' : ''} onClick={() => set({ lang: 'zh' })}>
            简体中文
          </button>
        </div>
      </div>
    </div>
  );
}
