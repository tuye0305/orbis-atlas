import type { GameDef } from '../types';
import { h } from './stage';

export type Tone = 'do' | 'wait' | 'good' | 'warn' | 'info';

/**
 * The in-game guide: a strip of the game's numbered steps (current one lit, finished ones ticked)
 * and one short instruction under it, with the key to press. Games call `step()` as the player
 * progresses and `say()` whenever the right next action changes; repeated calls with the same
 * text are free.
 */
export function createCoach(parent: HTMLElement, def: Pick<GameDef, 'steps'>, lang: 'en' | 'zh') {
  const el = h('div', 'g-coach', parent);
  const strip = h('div', 'g-coach-steps', el);
  const pills = (def.steps ?? []).map((st, i) => h('span', '', strip, `<i>${i + 1}</i><b>${st.title[lang]}</b>`));
  const say = h('div', 'g-say', el);
  say.setAttribute('role', 'status');
  say.setAttribute('aria-live', 'polite');
  let cur = -2;
  let last = '';
  return {
    el,
    step(i: number) {
      if (i === cur) return;
      cur = i;
      pills.forEach((p, k) => (p.className = k < i ? 'done' : k === i ? 'cur' : ''));
      if (i >= pills.length) pills.forEach((p) => (p.className = 'done'));
    },
    /** `text` may hold a <small> second line. `key` is shown as a keycap. */
    say(text: string, tone: Tone = 'info', key?: string) {
      const html = `<span class="g-say-ico"></span><span>${text}</span>${key ? `<kbd>${key}</kbd>` : ''}`;
      const sig = tone + html;
      if (sig === last) return;
      last = sig;
      say.className = `g-say ${tone}`;
      say.innerHTML = text ? html : '';
    },
    hide(on: boolean) {
      el.style.opacity = on ? '0' : '';
    },
  };
}
