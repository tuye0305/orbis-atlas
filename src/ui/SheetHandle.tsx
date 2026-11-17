import { useRef } from 'react';

interface Drag {
  card: HTMLElement;
  y: number; // pointer Y at the start
  h: number; // card height at the start
  max: number; // tallest the card may get: from the timeline up to just under the top bar
  lastY: number;
  lastT: number;
  vy: number; // smoothed velocity, px/ms (positive = down)
  moved: boolean;
}

/**
 * Grab handle of the phone bottom sheet (the detail card at ≤900 px wide; CSS hides it elsewhere).
 *
 * Drag up to expand the sheet to the full height between the top bar and the timeline, down to go
 * back to the peek height, and down from the peek height (or a quick flick) to close it. A tap,
 * Enter or Space toggles between peek and expanded. While dragging, the card's height follows the
 * finger; on release the `.full` class decides again and the CSS height transition settles it.
 * Closing keeps the dragged height so the sheet slides away as it is; DetailCard resets it once the
 * slide-out has finished, so the next card opens at the peek height that framing.ts expects.
 */
export function SheetHandle({
  full,
  onFull,
  onClose,
  label,
}: {
  full: boolean;
  onFull: (full: boolean) => void;
  onClose: () => void;
  label: string;
}) {
  const drag = useRef<Drag | null>(null);
  const dragged = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = e.currentTarget.closest<HTMLElement>('.card');
    if (!el || (e.pointerType === 'mouse' && e.button !== 0)) return;
    // No native drag-and-drop or text selection: either would cancel the pointer mid-drag (Chrome
    // can pick up the card's picture as the drag source from here).
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const bar = document.querySelector<HTMLElement>('.topbar');
    const barBottom = bar ? bar.offsetTop + bar.offsetHeight : 0;
    // offset* ignore transforms, so this is the resting geometry even mid-animation.
    const max = el.offsetTop + el.offsetHeight - barBottom - 4;
    drag.current = { card: el, y: e.clientY, h: el.offsetHeight, max, lastY: e.clientY, lastT: e.timeStamp, vy: 0, moved: false };
    dragged.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = d.card;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dy) < 6) return; // still a tap
    d.moved = true;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.vy = 0.6 * ((e.clientY - d.lastY) / dt) + 0.4 * d.vy;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;
    el.classList.add('dragging');
    el.style.height = `${Math.round(Math.max(56, Math.min(d.max, d.h - dy)))}px`;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.moved) return;
    const el = d.card;
    dragged.current = true; // the click that follows is not a tap
    el.classList.remove('dragging');
    const dy = e.clientY - d.y;
    const h = d.h - dy;
    // A flick decides by direction; a slow drag by how far it went.
    const flick = Math.abs(d.vy) > 0.5 ? Math.sign(d.vy) : 0;
    const up = flick < 0 || (!flick && dy < -40);
    const down = flick > 0 || (!flick && dy > 40);
    const close = down && (full ? h < d.max * 0.3 : true);
    if (close) {
      onClose(); // keeps the inline height: the sheet slides out as it is
      return;
    }
    el.style.height = '';
    if (up) onFull(true);
    else if (down) onFull(false);
  };

  const onPointerCancel = () => {
    const el = drag.current?.card;
    drag.current = null;
    if (!el) return;
    el.classList.remove('dragging');
    el.style.height = '';
  };

  return (
    <button
      type="button"
      className="card-handle"
      aria-label={label}
      aria-expanded={full}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClick={() => {
        if (dragged.current) dragged.current = false;
        else onFull(!full);
      }}
    >
      <i aria-hidden />
    </button>
  );
}
