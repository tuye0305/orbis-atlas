import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, t, useStore } from '../state/store';
import type { Lang } from '../types';
import './games.css';
import { GAME_BY_ID } from './registry';
import StepArt, { HeroArt } from './StepArt';
import type { GameInstance, GameResult, MountGame } from './types';

type Phase = 'intro' | 'loading' | 'play' | 'result';

const BEST_KEY = 'orbis.games.best';
function readBest(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(BEST_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}
function saveBest(id: string, score: number) {
  try {
    const all = readBest();
    if ((all[id] ?? -1) < score) localStorage.setItem(BEST_KEY, JSON.stringify({ ...all, [id]: score }));
  } catch {
    /* private mode: best scores just aren't kept */
  }
}

const L = {
  start: { en: 'Begin', zh: '开始' },
  again: { en: 'Play again', zh: '再来一局' },
  back: { en: 'Back to the atlas', zh: '返回地图' },
  close: { en: 'Close game', zh: '关闭游戏' },
  controls: { en: 'How to play', zh: '玩法' },
  history: { en: 'What really happened', zh: '史实' },
  best: { en: 'Best', zh: '最佳' },
  loading: { en: 'Setting the scene…', zh: '布景中……' },
  failed: { en: 'The game could not be loaded.', zh: '游戏载入失败。' },
  score: { en: 'Score', zh: '得分' },
  story: { en: 'The story', zh: '背景故事' },
  goal: { en: 'Your goal', zh: '目标' },
};
const l = (k: keyof typeof L, lang: Lang) => L[k][lang];

export default function GameHost({ id }: { id: string }) {
  const def = GAME_BY_ID[id];
  const lang = useStore((st) => st.lang);
  const set = useStore((st) => st.set);
  const [phase, setPhase] = useState<Phase>('intro');
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState(false);
  const [best, setBest] = useState(() => readBest()[id]);
  const [run, setRun] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const startBtn = useRef<HTMLButtonElement>(null);
  const resultBtn = useRef<HTMLButtonElement>(null);
  const mod = useRef<Promise<{ mount: MountGame }> | null>(null);
  const inst = useRef<GameInstance | null>(null);
  const close = () => set({ game: null });

  // Fetch the game's chunk while the intro is being read.
  useEffect(() => {
    if (!def) return;
    mod.current = def.load();
    mod.current.catch(() => setError(true));
  }, [def]);

  useEffect(() => {
    if (phase === 'intro') startBtn.current?.focus();
    if (phase === 'result') resultBtn.current?.focus();
  }, [phase]);

  // Escape leaves the game (a run in progress is simply abandoned).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  // Mount a run. `run` bumps on "play again" so the game starts from a clean instance.
  useEffect(() => {
    if (phase !== 'loading' || !mod.current) return;
    let cancelled = false;
    mod.current.then(
      ({ mount }) => {
        if (cancelled || !stage.current) return;
        inst.current?.dispose();
        stage.current.innerHTML = '';
        inst.current = mount(stage.current, {
          lang,
          reduced: prefersReducedMotion(),
          end: (r) => {
            saveBest(id, r.score);
            setBest(readBest()[id]);
            setResult(r);
            setPhase('result');
          },
        });
        setPhase('play');
      },
      () => !cancelled && setError(true),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, run]);

  useEffect(
    () => () => {
      inst.current?.dispose();
      inst.current = null;
    },
    [],
  );

  if (!def) return null;
  const start = () => {
    setResult(null);
    setRun((n) => n + 1);
    setPhase('loading');
  };

  return (
    <div className="game-host" role="dialog" aria-modal="true" aria-label={t(def.title, lang)} style={{ ['--accent' as string]: def.accent }}>
      <div className="game-stage" ref={stage} />
      <button className="game-close" onClick={close} aria-label={l('close', lang)}>
        ×
      </button>

      {phase === 'intro' && (
        <div className={`game-panel game-intro ${def.steps ? 'has-steps' : ''}`}>
          {def.steps && <HeroArt id={def.id} />}
          <div className="gp-kicker">{t(def.kicker, lang)}</div>
          <h2 className="gp-title">{t(def.title, lang)}</h2>
          {def.steps ? (
            <>
              {def.goal && (
                <p className="gp-goal">
                  <span>{l('goal', lang)}</span>
                  {t(def.goal, lang)}
                </p>
              )}
              <ol className="gp-steps">
                {def.steps.map((st, i) => (
                  <li key={i} style={{ animationDelay: `${0.15 + i * 0.12}s` }} title={t(st.text, lang)}>
                    <StepArt art={st.art} />
                    <div className="gp-step-cap">
                      <i>{i + 1}</i>
                      <b>{t(st.title, lang)}</b>
                    </div>
                    {st.keys ? <kbd>{t(st.keys, lang)}</kbd> : <kbd className="gp-nokey">{lang === 'zh' ? '等待' : 'wait'}</kbd>}
                    <span className="sr-only">{t(st.text, lang)}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <div className="gp-story">
                {def.story.map((p, i) => (
                  <p key={i}>{t(p, lang)}</p>
                ))}
              </div>
              <h3>{l('controls', lang)}</h3>
              <ul className="gp-controls">
                {def.controls.map((c, i) => (
                  <li key={i}>{t(c, lang)}</li>
                ))}
              </ul>
            </>
          )}
          {error && <p className="gp-error">{l('failed', lang)}</p>}
          <div className="gp-actions">
            <button ref={startBtn} className="gp-primary" onClick={start} disabled={error}>
              {l('start', lang)} <span aria-hidden="true">→</span>
            </button>
            {best != null && (
              <span className="gp-best">
                {l('best', lang)} {best}
              </span>
            )}
          </div>
          {def.steps && (
            <details className="gp-history gp-story-fold">
              <summary>{l('story', lang)}</summary>
              {def.story.map((p, i) => (
                <p key={i}>{t(p, lang)}</p>
              ))}
            </details>
          )}
        </div>
      )}

      {phase === 'loading' && <div className="game-loading">{error ? l('failed', lang) : l('loading', lang)}</div>}

      {phase === 'result' && result && (
        <div className="game-panel game-result">
          <div className="gp-stars" aria-label={`${result.stars} / 3`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < result.stars ? 'on' : ''} style={{ animationDelay: `${0.25 + i * 0.22}s` }}>
                ★
              </span>
            ))}
          </div>
          <h2 className="gp-title">{t(result.headline, lang)}</h2>
          <div className="gp-score">
            {l('score', lang)} <b>{result.score}</b>
            {best != null && (
              <span className="gp-best">
                {l('best', lang)} {best}
              </span>
            )}
          </div>
          <ul className="gp-lines">
            {result.lines.map((x, i) => (
              <li key={i}>{t(x, lang)}</li>
            ))}
          </ul>
          <details className="gp-history" open>
            <summary>{l('history', lang)}</summary>
            {def.history.map((p, i) => (
              <p key={i}>{t(p, lang)}</p>
            ))}
          </details>
          <div className="gp-actions">
            <button ref={resultBtn} className="gp-primary" onClick={start}>
              {l('again', lang)}
            </button>
            <button className="gp-ghost" onClick={close}>
              {l('back', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
