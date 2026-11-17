import type { L10n } from '../../types';

/*
 * The copybook: stroke templates, characters and levels for 兰亭.
 *
 * Everything is in "cell space": the writing square (米字格) is 0..1 on both axes, y down. A stroke
 * template is a list of [x, y, r] control points for a Catmull-Rom spline, r being the brush radius
 * as a fraction of the cell. Most characters are built from a small set of stroke shapes (横, 竖,
 * 撇, 捺, 点, 提 and their turns and hooks); 永 and 之 keep their hand-drawn templates.
 */

export type Pt = [number, number, number];
export type End = 'sharp' | 'round';

export interface StrokeDef {
  /** One character for the stroke-order dots. */
  key: string;
  /** Big label in the side panel. */
  name: L10n;
  /** Plain description of the stroke. */
  modern: L10n;
  tip: L10n;
  /** Where the tip is quoted from. */
  src?: L10n;
  how: L10n;
  pts: Pt[];
  /** Ideal mean speed, cells per second. */
  speed: number;
  end: End;
}

export interface CharDef {
  ch: string;
  strokes: StrokeDef[];
}

const BZT = { zh: '卫夫人《笔阵图》', en: 'Lady Wei, Bizhen Tu' };
const YFJ = { zh: '永字八法诀', en: 'the Eight Principles' };

// ---------- the eight principles of 永 (hand-drawn) ----------

const YONG: StrokeDef[] = [
  {
    key: '侧',
    name: { zh: '侧', en: 'Cè' },
    modern: { zh: '点', en: 'dot' },
    tip: { zh: '点如高峰坠石', en: 'A dot like a rock falling from a high peak' },
    src: BZT,
    how: { zh: '侧锋落笔，由轻到重，稍顿后收住。', en: 'Touch down at a slant, press from light to heavy, pause, and lift.' },
    pts: [[0.445, 0.07, 0.01], [0.475, 0.098, 0.032], [0.51, 0.138, 0.042], [0.52, 0.158, 0.028]],
    speed: 0.3,
    end: 'round',
  },
  {
    key: '勒',
    name: { zh: '勒', en: 'Lè' },
    modern: { zh: '横', en: 'horizontal' },
    tip: { zh: '横如千里阵云', en: 'A horizontal like clouds stretched over a thousand li' },
    src: BZT,
    how: { zh: '起笔稍重，平稳右行，微微上斜，收笔一顿。', en: 'Start firmly, move steadily right with a slight rise, pause at the end.' },
    pts: [[0.33, 0.282, 0.026], [0.36, 0.274, 0.03], [0.45, 0.264, 0.025], [0.53, 0.254, 0.028], [0.556, 0.256, 0.035]],
    speed: 0.6,
    end: 'round',
  },
  {
    key: '努',
    name: { zh: '努', en: 'Nǔ' },
    modern: { zh: '竖', en: 'vertical' },
    tip: { zh: '竖如万岁枯藤', en: 'A vertical like an ancient, dry vine' },
    src: BZT,
    how: { zh: '竖不宜太直，沉稳下行，力透纸背，蓄力待钩。', en: 'Not ruler-straight: move down slowly and strongly, saving strength for the hook.' },
    pts: [[0.556, 0.262, 0.035], [0.562, 0.4, 0.031], [0.567, 0.6, 0.031], [0.561, 0.78, 0.033], [0.556, 0.86, 0.037]],
    speed: 0.45,
    end: 'round',
  },
  {
    key: '趯',
    name: { zh: '趯', en: 'Tì' },
    modern: { zh: '钩', en: 'hook' },
    tip: { zh: '如劲弩筋节', en: 'Like the sinews of a strong crossbow' },
    src: BZT,
    how: { zh: '在竖的末端顿笔，蓄势后向左上快速踢出，锋尖收尽。', en: 'Press at the foot of the vertical, then flick up-left fast, to a sharp point.' },
    pts: [[0.556, 0.862, 0.037], [0.53, 0.848, 0.026], [0.495, 0.82, 0.012], [0.468, 0.8, 0.002]],
    speed: 1.6,
    end: 'sharp',
  },
  {
    key: '策',
    name: { zh: '策', en: 'Cè' },
    modern: { zh: '提', en: 'rising stroke' },
    tip: { zh: '策须仰策而收', en: 'Like flicking a riding whip upward' },
    src: YFJ,
    how: { zh: '由左下向右上斜挑，快而有力，越行越轻。', en: 'Lift up and to the right, quick and firm, lightening as you go.' },
    pts: [[0.2, 0.478, 0.03], [0.27, 0.463, 0.026], [0.34, 0.447, 0.021], [0.4, 0.432, 0.016]],
    speed: 1.1,
    end: 'sharp',
  },
  {
    key: '掠',
    name: { zh: '掠', en: 'Lüè' },
    modern: { zh: '长撇', en: 'long sweep' },
    tip: { zh: '撇如陆断犀象', en: 'A sweep like cutting through rhino horn and ivory' },
    src: BZT,
    how: { zh: '起笔稍重，向左下行笔，渐行渐快，出锋要利。', en: 'Start a little heavy, sweep down-left, speed up, and end in a sharp point.' },
    pts: [[0.405, 0.432, 0.03], [0.37, 0.52, 0.029], [0.3, 0.63, 0.023], [0.21, 0.725, 0.013], [0.125, 0.79, 0.002]],
    speed: 0.95,
    end: 'sharp',
  },
  {
    key: '啄',
    name: { zh: '啄', en: 'Zhuó' },
    modern: { zh: '短撇', en: 'short sweep' },
    tip: { zh: '啄如鸟之啄物', en: 'Like a bird pecking' },
    src: YFJ,
    how: { zh: '短而快，落笔即撇，锐利果断。', en: 'Short and fast: touch down and flick, crisp and decisive.' },
    pts: [[0.8, 0.33, 0.033], [0.755, 0.378, 0.029], [0.695, 0.435, 0.017], [0.625, 0.49, 0.003]],
    speed: 1.7,
    end: 'sharp',
  },
  {
    key: '磔',
    name: { zh: '磔', en: 'Zhé' },
    modern: { zh: '捺', en: 'falling stroke' },
    tip: { zh: '捺如崩浪雷奔', en: 'Like a crashing wave, like rolling thunder' },
    src: BZT,
    how: { zh: '轻入渐重，至捺脚顿笔，再向右平平送出。', en: 'Enter light, grow heavier, press at the foot, then ease out flat to the right.' },
    pts: [[0.62, 0.47, 0.007], [0.68, 0.56, 0.019], [0.76, 0.67, 0.033], [0.84, 0.768, 0.045], [0.89, 0.808, 0.042], [0.93, 0.824, 0.02], [0.972, 0.83, 0.002]],
    speed: 0.5,
    end: 'sharp',
  },
];

/** A running-script 之: dot, folded sweep, flat falling stroke. */
export const ZHI: Pt[][] = [
  [[0.46, 0.1, 0.012], [0.5, 0.142, 0.033], [0.538, 0.19, 0.04], [0.545, 0.212, 0.026]],
  [[0.27, 0.405, 0.02], [0.4, 0.388, 0.026], [0.6, 0.362, 0.03], [0.655, 0.372, 0.033], [0.56, 0.468, 0.026], [0.43, 0.578, 0.02], [0.3, 0.68, 0.013]],
  [[0.3, 0.682, 0.013], [0.4, 0.73, 0.021], [0.55, 0.77, 0.031], [0.72, 0.8, 0.041], [0.84, 0.814, 0.036], [0.93, 0.81, 0.012], [0.98, 0.8, 0.002]],
];

// ---------- stroke kinds ----------

type Kind =
  | 'dian'
  | 'heng'
  | 'shu'
  | 'xuanzhen'
  | 'pie'
  | 'duanpie'
  | 'shupie'
  | 'na'
  | 'pingna'
  | 'ti'
  | 'shugou'
  | 'hengzhe'
  | 'hengzhegou'
  | 'shuzhe'
  | 'hengpie'
  | 'piezhe'
  | 'shuwangou';

interface KindDef {
  key: string;
  name: L10n;
  modern: L10n;
  tip: L10n;
  src: L10n;
  how: L10n;
  speed: number;
  end: End;
}

const T_DIAN = { zh: '点如高峰坠石', en: 'A dot like a rock falling from a high peak' };
const T_HENG = { zh: '横如千里阵云', en: 'A horizontal like clouds stretched over a thousand li' };
const T_SHU = { zh: '竖如万岁枯藤', en: 'A vertical like an ancient, dry vine' };
const T_PIE = { zh: '撇如陆断犀象', en: 'A sweep like cutting through rhino horn and ivory' };
const T_NA = { zh: '捺如崩浪雷奔', en: 'Like a crashing wave, like rolling thunder' };
const T_ZHE = { zh: '折如百钧弩发', en: 'A turn like a heavy crossbow let loose' };
const T_GOU = { zh: '如劲弩筋节', en: 'Like the sinews of a strong crossbow' };

const KINDS: Record<Kind, KindDef> = {
  dian: {
    key: '点',
    name: { zh: '点', en: 'Diǎn' },
    modern: { zh: '点', en: 'dot' },
    tip: T_DIAN,
    src: BZT,
    how: { zh: '侧锋落笔，由轻到重，稍顿后收住。', en: 'Touch down at a slant, press from light to heavy, pause, and lift.' },
    speed: 0.3,
    end: 'round',
  },
  heng: {
    key: '横',
    name: { zh: '横', en: 'Héng' },
    modern: { zh: '横', en: 'horizontal' },
    tip: T_HENG,
    src: BZT,
    how: { zh: '起笔稍重，平稳右行，微微上斜，收笔一顿。', en: 'Start firmly, move steadily right with a slight rise, pause at the end.' },
    speed: 0.6,
    end: 'round',
  },
  shu: {
    key: '竖',
    name: { zh: '竖', en: 'Shù' },
    modern: { zh: '垂露竖', en: 'vertical, “dewdrop” end' },
    tip: T_SHU,
    src: BZT,
    how: { zh: '起笔一顿，沉稳下行，到底停一下再抬笔，收成圆头。', en: 'Press to start, move down slowly and steadily, then stop before lifting for a round end.' },
    speed: 0.45,
    end: 'round',
  },
  xuanzhen: {
    key: '竖',
    name: { zh: '竖', en: 'Shù' },
    modern: { zh: '悬针竖', en: 'vertical, “hanging needle” end' },
    tip: T_SHU,
    src: BZT,
    how: { zh: '起笔一顿，稳稳下行，快到末端时边走边提，收成针尖。', en: 'Press to start, move down steadily, and lift while still moving so it ends in a needle point.' },
    speed: 0.6,
    end: 'sharp',
  },
  pie: {
    key: '撇',
    name: { zh: '撇', en: 'Piě' },
    modern: { zh: '撇', en: 'sweep' },
    tip: T_PIE,
    src: BZT,
    how: { zh: '起笔稍重，向左下行笔，渐行渐快，出锋要利。', en: 'Start a little heavy, sweep down-left, speed up, and end in a sharp point.' },
    speed: 0.95,
    end: 'sharp',
  },
  duanpie: {
    key: '撇',
    name: { zh: '撇', en: 'Piě' },
    modern: { zh: '短撇', en: 'short sweep' },
    tip: { zh: '啄如鸟之啄物', en: 'Like a bird pecking' },
    src: YFJ,
    how: { zh: '短而快，落笔即撇，锐利果断。', en: 'Short and fast: touch down and flick, crisp and decisive.' },
    speed: 1.3,
    end: 'sharp',
  },
  shupie: {
    key: '撇',
    name: { zh: '竖撇', en: 'Shùpiě' },
    modern: { zh: '竖撇', en: 'vertical sweep' },
    tip: T_PIE,
    src: BZT,
    how: { zh: '前段如竖，沉稳直下；后段向左下撇出，出锋要利。', en: 'Start like a vertical, then curve away down-left to a sharp point.' },
    speed: 0.7,
    end: 'sharp',
  },
  na: {
    key: '捺',
    name: { zh: '捺', en: 'Nà' },
    modern: { zh: '捺', en: 'falling stroke' },
    tip: T_NA,
    src: BZT,
    how: { zh: '轻入渐重，至捺脚顿笔，再向右平平送出。', en: 'Enter light, grow heavier, press at the foot, then ease out flat to the right.' },
    speed: 0.5,
    end: 'sharp',
  },
  pingna: {
    key: '捺',
    name: { zh: '平捺', en: 'Píngnà' },
    modern: { zh: '平捺', en: 'flat falling stroke' },
    tip: T_NA,
    src: BZT,
    how: { zh: '轻入渐重，平平向右，捺脚一顿再送出锋尖。', en: 'Enter light and grow heavier, run flat to the right, press, then ease out to a point.' },
    speed: 0.55,
    end: 'sharp',
  },
  ti: {
    key: '提',
    name: { zh: '提', en: 'Tí' },
    modern: { zh: '提', en: 'rising stroke' },
    tip: { zh: '策须仰策而收', en: 'Like flicking a riding whip upward' },
    src: YFJ,
    how: { zh: '由左下向右上斜挑，快而有力，越行越轻。', en: 'Lift up and to the right, quick and firm, lightening as you go.' },
    speed: 1.1,
    end: 'sharp',
  },
  shugou: {
    key: '钩',
    name: { zh: '竖钩', en: 'Shùgōu' },
    modern: { zh: '竖钩', en: 'vertical hook' },
    tip: T_GOU,
    src: BZT,
    how: { zh: '竖画沉稳下行，在末端顿笔蓄势，再向左上快速踢出。', en: 'Move down steadily, press at the foot, then flick up-left fast.' },
    speed: 0.55,
    end: 'sharp',
  },
  hengzhe: {
    key: '折',
    name: { zh: '横折', en: 'Héngzhé' },
    modern: { zh: '横折', en: 'turn' },
    tip: T_ZHE,
    src: BZT,
    how: { zh: '横画写到转角，轻提再顿笔，折而向下，收笔一顿。', en: 'Write the horizontal to the corner, lift a little, press, turn down, and stop to end.' },
    speed: 0.5,
    end: 'round',
  },
  hengzhegou: {
    key: '钩',
    name: { zh: '横折钩', en: 'Héngzhégōu' },
    modern: { zh: '横折钩', en: 'turn with a hook' },
    tip: T_GOU,
    src: BZT,
    how: { zh: '横到转角顿笔折下，竖画末端蓄力，向左上踢出钩。', en: 'Turn down at the corner; at the foot, gather strength and flick a hook up-left.' },
    speed: 0.55,
    end: 'sharp',
  },
  shuzhe: {
    key: '折',
    name: { zh: '竖折', en: 'Shùzhé' },
    modern: { zh: '竖折', en: 'down and across' },
    tip: T_ZHE,
    src: BZT,
    how: { zh: '竖画写到底，顿笔转向右行，收笔一顿。', en: 'Down to the bottom, press, turn right, and stop to end.' },
    speed: 0.5,
    end: 'round',
  },
  hengpie: {
    key: '撇',
    name: { zh: '横撇', en: 'Héngpiě' },
    modern: { zh: '横撇', en: 'folded sweep' },
    tip: T_ZHE,
    src: BZT,
    how: { zh: '短横写到转角，顿笔后向左下撇出，出锋要利。', en: 'A short horizontal to the corner, press, then sweep down-left to a sharp point.' },
    speed: 0.75,
    end: 'sharp',
  },
  piezhe: {
    key: '折',
    name: { zh: '撇折', en: 'Piězhé' },
    modern: { zh: '撇折', en: 'sweep and turn' },
    tip: T_ZHE,
    src: BZT,
    how: { zh: '先向左下撇，到转角顿笔，再向右上提出。', en: 'Sweep down-left, press at the corner, then rise to the right.' },
    speed: 0.65,
    end: 'sharp',
  },
  shuwangou: {
    key: '钩',
    name: { zh: '竖弯钩', en: 'Shùwāngōu' },
    modern: { zh: '竖弯钩', en: 'curved hook' },
    tip: T_GOU,
    src: BZT,
    how: { zh: '竖画下行，圆转向右，平行一段，末端向上钩出。', en: 'Down, curve round to the right, run flat, then flick a hook upward.' },
    speed: 0.55,
    end: 'sharp',
  },
};

// ---------- stroke shapes ----------

const P = (x: number, y: number, r: number): Pt => [x, y, r];
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function heng(x0: number, y0: number, x1: number, y1: number, w = 1): Pt[] {
  return [
    P(x0, y0 + 0.004, 0.022 * w),
    P(x0 + 0.03, y0 - 0.002, 0.028 * w),
    P((x0 + x1) / 2, (y0 + y1) / 2, 0.022 * w),
    P(x1 - 0.03, y1, 0.025 * w),
    P(x1, y1 + 0.006, 0.033 * w),
  ];
}

/** 垂露竖: round end. */
function shu(x: number, y0: number, y1: number, w = 1): Pt[] {
  const l = y1 - y0;
  return [
    P(x - 0.006, y0 - 0.008, 0.026 * w),
    P(x, y0 + 0.02, 0.034 * w),
    P(x + 0.003, y0 + l * 0.35, 0.029 * w),
    P(x + 0.003, y0 + l * 0.7, 0.029 * w),
    P(x, y1 - 0.02, 0.032 * w),
    P(x - 0.001, y1, 0.034 * w),
  ];
}

/** 悬针竖: tapers to a point. */
function xuanzhen(x: number, y0: number, y1: number, w = 1): Pt[] {
  const l = y1 - y0;
  return [
    P(x - 0.006, y0 - 0.008, 0.026 * w),
    P(x, y0 + 0.02, 0.034 * w),
    P(x + 0.002, y0 + l * 0.4, 0.029 * w),
    P(x + 0.001, y0 + l * 0.72, 0.026 * w),
    P(x, y0 + l * 0.9, 0.015 * w),
    P(x, y1, 0.002),
  ];
}

/** 撇: quadratic sweep; `b` bends it (0 straight, ~0.45 starts almost vertical). */
function pie(x0: number, y0: number, x1: number, y1: number, b = 0.35, w = 1): Pt[] {
  const cx = x0 + (x1 - x0) * (0.5 - b);
  const cy = y0 + (y1 - y0) * (0.5 + b / 4);
  const T = [0, 0.25, 0.55, 0.8, 1];
  const R = [0.03, 0.029, 0.023, 0.013, 0.002];
  return T.map((t, i) => {
    const a = (1 - t) * (1 - t);
    const m = 2 * t * (1 - t);
    const c = t * t;
    return P(a * x0 + m * cx + c * x1, a * y0 + m * cy + c * y1, R[i] * (i < 4 ? w : 1));
  });
}

function duanpie(x0: number, y0: number, x1: number, y1: number, w = 1): Pt[] {
  return [P(x0, y0, 0.032 * w), P(mix(x0, x1, 0.33), mix(y0, y1, 0.3), 0.029 * w), P(mix(x0, x1, 0.67), mix(y0, y1, 0.68), 0.017 * w), P(x1, y1, 0.003)];
}

/** 竖撇: straight down, then away to the lower left. */
function shupie(x: number, y0: number, x1: number, y1: number, w = 1): Pt[] {
  return [
    P(x - 0.006, y0 - 0.008, 0.026 * w),
    P(x, y0 + 0.02, 0.032 * w),
    P(x + 0.002, mix(y0, y1, 0.42), 0.029 * w),
    P(x - 0.008, mix(y0, y1, 0.7), 0.025 * w),
    P(mix(x, x1, 0.45), mix(y0, y1, 0.88), 0.016 * w),
    P(x1, y1, 0.002),
  ];
}

/** 捺 from its light entry (x0, y0) to the foot (fx, fy); the flat tail is added. */
function na(x0: number, y0: number, fx: number, fy: number, w = 1): Pt[] {
  const dx = fx - x0;
  const dy = fy - y0;
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  const T = [0, 0.22, 0.52, 0.815, 1];
  const R = [0.007, 0.019, 0.033, 0.045, 0.042];
  const body = T.map((t, i) => {
    const off = 0.016 * Math.sin(Math.PI * t);
    return P(x0 + dx * t + nx * off, y0 + dy * t + ny * off, R[i] * w);
  });
  return [...body, P(fx + 0.04, fy + 0.016, 0.02 * w), P(fx + 0.082, fy + 0.022, 0.002)];
}

function dian(x: number, y: number, s = 1, w = 1): Pt[] {
  return [P(x, y, 0.01), P(x + 0.03 * s, y + 0.028 * s, 0.032 * w), P(x + 0.065 * s, y + 0.068 * s, 0.042 * w), P(x + 0.075 * s, y + 0.088 * s, 0.028 * w)];
}

function ti(x0: number, y0: number, x1: number, y1: number, w = 1): Pt[] {
  return [P(x0, y0, 0.03 * w), P(mix(x0, x1, 0.35), mix(y0, y1, 0.35), 0.026 * w), P(mix(x0, x1, 0.7), mix(y0, y1, 0.7), 0.021 * w), P(x1, y1, 0.015 * w)];
}

function shugou(x: number, y0: number, y1: number, w = 1): Pt[] {
  const l = y1 - y0;
  return [
    P(x - 0.006, y0 - 0.008, 0.026 * w),
    P(x, y0 + 0.02, 0.034 * w),
    P(x + 0.004, y0 + l * 0.4, 0.03 * w),
    P(x + 0.003, y0 + l * 0.78, 0.031 * w),
    P(x, y1 - 0.012, 0.035 * w),
    P(x - 0.004, y1, 0.037 * w),
    P(x - 0.03, y1 - 0.016, 0.025 * w),
    P(x - 0.062, y1 - 0.04, 0.012 * w),
    P(x - 0.085, y1 - 0.056, 0.002),
  ];
}

/** 横折 (and 横折钩): across to the corner (x1, y1), then down to y2, leaning in by dx. */
function hengzhe(x0: number, y0: number, x1: number, y1: number, y2: number, o: { dx?: number; gou?: boolean; w?: number } = {}): Pt[] {
  const dx = o.dx ?? 0.012;
  const w = o.w ?? 1;
  const xb = x1 - dx;
  const pts = [
    P(x0, y0 + 0.004, 0.022 * w),
    P(x0 + 0.03, y0 - 0.002, 0.027 * w),
    P((x0 + x1) / 2, (y0 + y1) / 2, 0.021 * w),
    P(x1 - 0.028, y1, 0.021 * w),
    P(x1 + 0.004, y1 - 0.004, 0.028 * w),
    P(x1 + 0.008, y1 + 0.022, 0.033 * w),
    P(x1 + 0.004 - dx * 0.3, mix(y1, y2, 0.4), 0.029 * w),
    P(x1 - dx * 0.8, mix(y1, y2, 0.8), 0.029 * w),
  ];
  if (o.gou)
    return [
      ...pts,
      P(xb, y2 - 0.012, 0.034 * w),
      P(xb - 0.004, y2, 0.036 * w),
      P(xb - 0.03, y2 - 0.016, 0.024 * w),
      P(xb - 0.06, y2 - 0.038, 0.011 * w),
      P(xb - 0.082, y2 - 0.052, 0.002),
    ];
  return [...pts, P(xb, y2, 0.033 * w)];
}

/** 竖折: down to (x, y1), then across to (x2, y2). */
function shuzhe(x: number, y0: number, y1: number, x2: number, y2: number, w = 1): Pt[] {
  return [
    P(x - 0.006, y0 - 0.008, 0.026 * w),
    P(x, y0 + 0.02, 0.032 * w),
    P(x + 0.002, mix(y0, y1, 0.5), 0.028 * w),
    P(x, y1 - 0.025, 0.028 * w),
    P(x + 0.006, y1 + 0.004, 0.031 * w),
    P(x + 0.045, mix(y1, y2, 0.08), 0.024 * w),
    P((x + x2) / 2, (y1 + y2) / 2, 0.022 * w),
    P(x2 - 0.03, y2, 0.025 * w),
    P(x2, y2 + 0.005, 0.031 * w),
  ];
}

/** 横撇: a short horizontal to the corner (x1, y1), then a sweep to (x2, y2). */
function hengpie(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, w = 1): Pt[] {
  return [
    P(x0, y0 + 0.004, 0.021 * w),
    P(x0 + 0.03, y0 - 0.002, 0.026 * w),
    P(x1 - 0.022, y1, 0.022 * w),
    P(x1 + 0.006, y1 + 0.004, 0.031 * w),
    P(mix(x1, x2, 0.3) + 0.008, mix(y1, y2, 0.3), 0.027 * w),
    P(mix(x1, x2, 0.66) + 0.006, mix(y1, y2, 0.66), 0.018 * w),
    P(x2, y2, 0.002),
  ];
}

/** 撇折: sweep down-left to the corner (x1, y1), then rise to (x2, y2). */
function piezhe(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, w = 1): Pt[] {
  return [
    P(x0, y0, 0.028 * w),
    P(mix(x0, x1, 0.5), mix(y0, y1, 0.5), 0.025 * w),
    P(x1 + 0.01, y1 - 0.014, 0.022 * w),
    P(x1, y1, 0.027 * w),
    P(x1 + 0.045, mix(y1, y2, 0.12), 0.024 * w),
    P(mix(x1, x2, 0.62), mix(y1, y2, 0.62), 0.02 * w),
    P(x2, y2, 0.014 * w),
  ];
}

/** 竖弯钩: down, round the corner at y1, flat to x2, hook up. */
function shuwangou(x: number, y0: number, y1: number, x2: number, w = 1): Pt[] {
  return [
    P(x - 0.006, y0 - 0.008, 0.026 * w),
    P(x, y0 + 0.02, 0.031 * w),
    P(x + 0.002, mix(y0, y1, 0.5), 0.027 * w),
    P(x + 0.004, y1 - 0.06, 0.026 * w),
    P(x + 0.03, y1 - 0.008, 0.025 * w),
    P(x + 0.09, y1 + 0.004, 0.025 * w),
    P(x2 - 0.05, y1 + 0.002, 0.029 * w),
    P(x2, y1 - 0.006, 0.034 * w),
    P(x2 + 0.006, y1 - 0.05, 0.014 * w),
    P(x2 + 0.008, y1 - 0.09, 0.002),
  ];
}

const s = (kind: Kind, pts: Pt[]): StrokeDef => ({ ...KINDS[kind], pts });

// ---------- characters ----------

export const CHARS: Record<string, CharDef> = {};
const def = (ch: string, strokes: StrokeDef[]) => (CHARS[ch] = { ch, strokes });

def('永', YONG);
def('之', [s('dian', ZHI[0]), s('hengpie', ZHI[1]), s('pingna', ZHI[2])]);
def('一', [s('heng', heng(0.13, 0.52, 0.87, 0.49, 1.15))]);
def('十', [s('heng', heng(0.14, 0.43, 0.86, 0.405)), s('xuanzhen', xuanzhen(0.5, 0.13, 0.9))]);
def('人', [s('pie', pie(0.5, 0.11, 0.11, 0.84, 0.22)), s('na', na(0.45, 0.37, 0.79, 0.77))]);
def('大', [s('heng', heng(0.14, 0.38, 0.86, 0.355)), s('pie', pie(0.5, 0.1, 0.11, 0.86, 0.38)), s('na', na(0.53, 0.42, 0.79, 0.78))]);
def('天', [s('heng', heng(0.26, 0.22, 0.74, 0.2, 0.9)), s('heng', heng(0.12, 0.45, 0.88, 0.425)), s('pie', pie(0.5, 0.21, 0.11, 0.87, 0.38)), s('na', na(0.53, 0.49, 0.79, 0.8))]);
def('山', [s('shu', shu(0.5, 0.12, 0.8)), s('shuzhe', shuzhe(0.2, 0.36, 0.82, 0.82, 0.79)), s('shu', shu(0.8, 0.33, 0.79))]);
def('日', [
  s('shu', shu(0.27, 0.14, 0.86, 0.95)),
  s('hengzhe', hengzhe(0.27, 0.14, 0.73, 0.13, 0.86, { dx: 0.01 })),
  s('heng', heng(0.29, 0.49, 0.71, 0.48, 0.8)),
  s('heng', heng(0.29, 0.85, 0.71, 0.84, 0.85)),
]);
def('月', [
  s('shupie', shupie(0.3, 0.12, 0.13, 0.88)),
  s('hengzhegou', hengzhe(0.3, 0.12, 0.72, 0.11, 0.86, { dx: 0, gou: true })),
  s('heng', heng(0.32, 0.39, 0.7, 0.38, 0.8)),
  s('heng', heng(0.32, 0.6, 0.7, 0.59, 0.8)),
]);
def('水', [s('shugou', shugou(0.5, 0.1, 0.86)), s('hengpie', hengpie(0.17, 0.37, 0.41, 0.357, 0.12, 0.7)), s('pie', pie(0.84, 0.25, 0.57, 0.5, 0.12)), s('na', na(0.56, 0.47, 0.81, 0.79))]);
def('不', [s('heng', heng(0.14, 0.2, 0.86, 0.18)), s('pie', pie(0.53, 0.2, 0.13, 0.75, 0.25)), s('shu', shu(0.5, 0.43, 0.9)), s('dian', dian(0.6, 0.45, 1.1))]);
def('见', [
  s('shu', shu(0.28, 0.13, 0.62, 0.9)),
  s('hengzhe', hengzhe(0.28, 0.13, 0.72, 0.12, 0.62)),
  s('pie', pie(0.48, 0.26, 0.13, 0.88, 0.18)),
  s('shuwangou', shuwangou(0.56, 0.27, 0.8, 0.86)),
]);
def('行', [
  s('duanpie', duanpie(0.32, 0.1, 0.15, 0.27)),
  s('pie', pie(0.34, 0.3, 0.12, 0.53, 0.15)),
  s('shu', shu(0.25, 0.43, 0.9)),
  s('heng', heng(0.5, 0.22, 0.84, 0.2, 0.85)),
  s('heng', heng(0.46, 0.43, 0.9, 0.41)),
  s('shugou', shugou(0.72, 0.43, 0.88)),
]);
def('江', [
  s('dian', dian(0.13, 0.16, 0.9)),
  s('dian', dian(0.1, 0.38, 0.9)),
  s('ti', ti(0.09, 0.8, 0.29, 0.6)),
  s('heng', heng(0.44, 0.25, 0.82, 0.23, 0.9)),
  s('shu', shu(0.63, 0.25, 0.79, 0.9)),
  s('heng', heng(0.37, 0.81, 0.91, 0.79, 1.05)),
]);
def('东', [
  s('heng', heng(0.17, 0.25, 0.83, 0.23)),
  s('piezhe', piezhe(0.47, 0.08, 0.27, 0.52, 0.8, 0.5)),
  s('shugou', shugou(0.54, 0.26, 0.88)),
  s('pie', pie(0.38, 0.61, 0.17, 0.8, 0.1)),
  s('dian', dian(0.66, 0.6)),
]);
def('去', [
  s('heng', heng(0.25, 0.24, 0.75, 0.225, 0.9)),
  s('shu', shu(0.5, 0.07, 0.46)),
  s('heng', heng(0.1, 0.48, 0.9, 0.46, 1.05)),
  s('piezhe', piezhe(0.47, 0.5, 0.22, 0.85, 0.7, 0.79)),
  s('dian', dian(0.62, 0.62)),
]);

// ---------- levels ----------

export interface Poem {
  /** The line, with punctuation. */
  text: string;
  by: L10n;
  en: string;
}

export interface Level {
  id: string;
  group: number;
  /** The characters written, in order. */
  chars: string;
  /** 'trace': stroke by stroke over the guide. 'variety': three free 之, each different. */
  mode: 'trace' | 'variety';
  name: L10n;
  poem: Poem;
  /** Two characters for the seal on the finished sheet. */
  seal?: [string, string];
}

export const GROUPS: { name: L10n; desc: L10n }[] = [
  { name: { zh: '笔画', en: 'Strokes' }, desc: { zh: '从横竖撇捺学起', en: 'Start with the basic strokes' } },
  { name: { zh: '结构', en: 'Shapes' }, desc: { zh: '折、钩，与笔画间的搭配', en: 'Turns, hooks, and fitting strokes together' } },
  { name: { zh: '兰亭', en: 'Orchid Pavilion' }, desc: { zh: '王羲之的永字八法与“之”字三变', en: 'Wang Xizhi’s eight principles, and 之 three ways' } },
  { name: { zh: '诗句', en: 'Poem lines' }, desc: { zh: '一字一格，写下一句诗', en: 'One character per square: write a line of poetry' } },
];

export const LEVELS: Level[] = [
  {
    id: 'yi',
    group: 0,
    chars: '一',
    mode: 'trace',
    name: { zh: '横', en: 'Horizontal' },
    poem: { text: '会当凌绝顶，一览众山小。', by: { zh: '杜甫《望岳》', en: 'Du Fu, Gazing at Mount Tai' }, en: 'I will climb to the very top, and see all the other mountains small.' },
  },
  {
    id: 'shi',
    group: 0,
    chars: '十',
    mode: 'trace',
    name: { zh: '横竖', en: 'Cross' },
    poem: { text: '十年磨一剑，霜刃未曾试。', by: { zh: '贾岛《剑客》', en: 'Jia Dao, The Swordsman' }, en: 'Ten years to grind one sword; its frost-white edge not yet tried.' },
  },
  {
    id: 'ren',
    group: 0,
    chars: '人',
    mode: 'trace',
    name: { zh: '撇捺', en: 'Two sweeps' },
    poem: { text: '空山不见人，但闻人语响。', by: { zh: '王维《鹿柴》', en: 'Wang Wei, Deer Park' }, en: 'Empty hills, no one in sight — only the sound of voices.' },
  },
  {
    id: 'da',
    group: 0,
    chars: '大',
    mode: 'trace',
    name: { zh: '舒展', en: 'Spread wide' },
    poem: { text: '大漠孤烟直，长河落日圆。', by: { zh: '王维《使至塞上》', en: 'Wang Wei, Envoy to the Frontier' }, en: 'Over the vast desert a lone smoke rises straight; over the long river the setting sun is round.' },
  },
  {
    id: 'tian',
    group: 0,
    chars: '天',
    mode: 'trace',
    name: { zh: '长短横', en: 'Two horizontals' },
    poem: { text: '是日也，天朗气清，惠风和畅。', by: { zh: '王羲之《兰亭集序》', en: 'Wang Xizhi, Orchid Pavilion Preface' }, en: 'That day the sky was bright and the air clear, and a gentle breeze blew.' },
  },
  {
    id: 'shan',
    group: 1,
    chars: '山',
    mode: 'trace',
    name: { zh: '竖折', en: 'Down and across' },
    poem: { text: '白日依山尽，黄河入海流。', by: { zh: '王之涣《登鹳雀楼》', en: 'Wang Zhihuan, On Stork Tower' }, en: 'The white sun sinks behind the mountains; the Yellow River flows into the sea.' },
  },
  {
    id: 'ri',
    group: 1,
    chars: '日',
    mode: 'trace',
    name: { zh: '横折', en: 'The turn' },
    poem: { text: '日出江花红胜火，春来江水绿如蓝。', by: { zh: '白居易《忆江南》', en: 'Bai Juyi, Remembering the South' }, en: 'At sunrise the river flowers burn redder than fire; in spring the river runs green as indigo.' },
  },
  {
    id: 'yue',
    group: 1,
    chars: '月',
    mode: 'trace',
    name: { zh: '横折钩', en: 'Turn and hook' },
    poem: { text: '举头望明月，低头思故乡。', by: { zh: '李白《静夜思》', en: 'Li Bai, Quiet Night Thoughts' }, en: 'I raise my head to the bright moon, then lower it and think of home.' },
  },
  {
    id: 'shui',
    group: 1,
    chars: '水',
    mode: 'trace',
    name: { zh: '竖钩', en: 'Vertical hook' },
    poem: { text: '抽刀断水水更流，举杯销愁愁更愁。', by: { zh: '李白《宣州谢朓楼饯别校书叔云》', en: 'Li Bai, Farewell at Xie Tiao’s Tower' }, en: 'Cut the water with a blade and it flows on; drink to drown sorrow and sorrow deepens.' },
  },
  {
    id: 'yong',
    group: 2,
    chars: '永',
    mode: 'trace',
    name: { zh: '永字八法', en: 'Eight principles' },
    poem: { text: '永和九年，岁在癸丑，暮春之初。', by: { zh: '王羲之《兰亭集序》', en: 'Wang Xizhi, Orchid Pavilion Preface' }, en: 'In the ninth year of Yonghe, a guichou year, at the start of late spring…' },
  },
  {
    id: 'zhi',
    group: 2,
    chars: '之之之',
    mode: 'variety',
    name: { zh: '之字三变', en: '之 three ways' },
    poem: { text: '后之视今，亦犹今之视昔。', by: { zh: '王羲之《兰亭集序》', en: 'Wang Xizhi, Orchid Pavilion Preface' }, en: 'Those who come after will look on us as we look on those before.' },
  },
  {
    id: 'yiri',
    group: 3,
    chars: '一日不见',
    mode: 'trace',
    name: { zh: '诗经', en: 'Book of Songs' },
    poem: { text: '彼采葛兮，一日不见，如三月兮。', by: { zh: '《诗经·王风·采葛》', en: 'Book of Songs, Gathering Kudzu' }, en: 'There she gathers kudzu — one day without seeing her is like three months.' },
    seal: ['诗', '经'],
  },
  {
    id: 'riyue',
    group: 3,
    chars: '日月之行',
    mode: 'trace',
    name: { zh: '观沧海', en: 'Viewing the Sea' },
    poem: { text: '日月之行，若出其中；星汉灿烂，若出其里。', by: { zh: '曹操《观沧海》', en: 'Cao Cao, Viewing the Sea' }, en: 'The sun and moon on their journey seem to rise from it; the bright Milky Way seems to spring from within.' },
    seal: ['沧', '海'],
  },
  {
    id: 'dajiang',
    group: 3,
    chars: '大江东去',
    mode: 'trace',
    name: { zh: '赤壁怀古', en: 'Red Cliffs' },
    poem: { text: '大江东去，浪淘尽，千古风流人物。', by: { zh: '苏轼《念奴娇·赤壁怀古》', en: 'Su Shi, Remembering Red Cliffs' }, en: 'The great river flows east, its waves washing away the heroes of a thousand ages.' },
    seal: ['东', '坡'],
  },
];
