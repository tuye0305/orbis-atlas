import type { L10n, Lang } from '../types';

export interface GameResult {
  /** 0–100. */
  score: number;
  stars: 0 | 1 | 2 | 3;
  headline: L10n;
  /** What happened in this run, one line each. */
  lines: L10n[];
}

export interface GameCtx {
  lang: Lang;
  reduced: boolean;
  /** Called once when a run ends; the host then shows the result over the still-running scene. */
  end: (r: GameResult) => void;
}

export interface GameInstance {
  dispose(): void;
}

export type MountGame = (root: HTMLElement, ctx: GameCtx) => GameInstance;

export interface GameDef {
  id: string;
  title: L10n;
  /** Short line under the title. */
  kicker: L10n;
  /** Events / people whose card offers this game. The first event is where the game "happens". */
  targets: string[];
  /** Intro screen: the situation, 2–3 short paragraphs. */
  story: L10n[];
  /** Controls, one line each. */
  controls: L10n[];
  /** What really happened, shown on the result screen. */
  history: L10n[];
  /** Accent colour of the intro and result screens. */
  accent: string;
  load: () => Promise<{ mount: MountGame }>;
}
