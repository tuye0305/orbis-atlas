import { s } from '../i18n';
import { useStore } from '../state/store';

export type LoadError = 'data' | 'webgl' | null;

interface Props {
  dataReady: boolean;
  globeReady: boolean;
  error: LoadError;
  onEnter: (music: boolean) => void;
  onRetry: () => void;
}

export function Intro({ dataReady, globeReady, error, onEnter, onRetry }: Props) {
  const lang = useStore((st) => st.lang);
  const set = useStore((st) => st.set);
  const ready = dataReady && globeReady && !error;
  const steps = Number(dataReady) + Number(globeReady);
  const status = error ? s(error === 'webgl' ? 'noWebgl' : 'loadFailed', lang) : !dataReady ? s('loadingData', lang) : !globeReady ? s('loadingGlobe', lang) : '';
  return (
    <div className="intro">
      <div className="intro-inner">
        <div className="intro-kicker">{lang === 'zh' ? '欧洲 · 非洲 · 亚洲 · 公元 1 — 2025' : 'Europe · Africa · Asia · 1 — 2025 CE'}</div>
        <h1 className="intro-title">
          <span className="latin" lang="la">
            Orbis
          </span>
          <span className="dot" aria-hidden>
            ·
          </span>
          <span className="han" lang="zh-Hans">
            寰宇时序
          </span>
        </h1>
        <p className="intro-sub">
          {lang === 'zh'
            ? '转动地球，穿越两千年：疆域消长、王朝更迭、战争与名人，以及每一座城市的名字如何随时代改变。'
            : 'Turn the globe and travel two thousand years: shifting borders, rising and falling dynasties, wars and famous lives, and how every city’s name changed with its rulers.'}
        </p>
        <div className="intro-actions">
          <button className="btn-primary" disabled={!ready} onClick={() => onEnter(true)}>
            {lang === 'zh' ? '进入地图 · 开启音乐' : 'Enter with music'}
          </button>
          <button className="btn-ghost" disabled={!ready} onClick={() => onEnter(false)}>
            {lang === 'zh' ? '静音进入' : 'Enter silently'}
          </button>
        </div>
        <div className={`intro-status ${error ? 'err' : ''} ${ready ? 'done' : ''}`} role="status" aria-live="polite">
          {!error && (
            <div
              className="intro-progress"
              role="progressbar"
              aria-label={lang === 'zh' ? '载入进度' : 'Loading progress'}
              aria-valuemin={0}
              aria-valuemax={2}
              aria-valuenow={steps}
            >
              <i style={{ width: `${12 + steps * 44}%` }} />
            </div>
          )}
          <span>{status}</span>
          {error === 'data' && (
            <button className="link-btn" onClick={onRetry}>
              {s('retry', lang)}
            </button>
          )}
        </div>
        <div className="intro-lang" role="group" aria-label="Language / 语言">
          <button className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} lang="en" onClick={() => set({ lang: 'en' })}>
            English
          </button>
          <button className={lang === 'zh' ? 'on' : ''} aria-pressed={lang === 'zh'} lang="zh-Hans" onClick={() => set({ lang: 'zh' })}>
            简体中文
          </button>
        </div>
      </div>
    </div>
  );
}
