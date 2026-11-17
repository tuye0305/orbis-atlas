import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { s } from '../i18n';
import { REGIONS } from '../regions';
import { prefersReducedMotion, useStore } from '../state/store';

const behavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth');

/**
 * The region chips. When they do not all fit (narrow windows, or the longer Chinese names), the row
 * scrolls sideways: the edge that hides more chips fades out and gets an arrow button, a mouse wheel
 * scrolls it, and the current region's chip is kept in view as the camera moves.
 */
export function RegionNav() {
  const lang = useStore((st) => st.lang);
  const region = useStore((st) => st.region);
  const focus = useStore((st) => st.focus);
  const nav = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const update = useCallback(() => {
    const el = nav.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft > 2;
    const right = el.scrollLeft < max - 2;
    setEdges((e) => (e.left === left && e.right === right ? e : { left, right }));
  }, []);

  useLayoutEffect(() => {
    const el = nav.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // A vertical mouse wheel scrolls the row sideways (trackpads already send deltaX).
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    };
    el.addEventListener('scroll', update, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', update);
      el.removeEventListener('wheel', onWheel);
    };
  }, [update]);

  // Chip widths change with the language (and once web fonts arrive).
  useLayoutEffect(() => {
    update();
    void document.fonts?.ready.then(update);
  }, [lang, update]);

  // Keep the current region's chip in view: dragging the globe changes it, and so does a fly-to.
  useEffect(() => {
    const el = nav.current;
    const chip = el?.querySelector<HTMLElement>('[aria-current]');
    if (!el || !chip) return;
    const pad = 40; // clear of the edge fade and arrow
    const minLeft = chip.offsetLeft + chip.offsetWidth + pad - el.clientWidth;
    const maxLeft = chip.offsetLeft - pad;
    const target = el.scrollLeft > maxLeft ? maxLeft : el.scrollLeft < minLeft ? minLeft : null;
    if (target !== null) el.scrollTo({ left: target, behavior: behavior() });
  }, [region, lang]);

  const page = (dir: 1 | -1) => {
    const el = nav.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: behavior() });
  };

  return (
    <div className={`regions-wrap${edges.left ? ' more-left' : ''}${edges.right ? ' more-right' : ''}`}>
      {/* Pointer conveniences only: keyboard users Tab through the chips, which scroll into view. */}
      <button className="regions-arrow prev" tabIndex={-1} aria-hidden onClick={() => page(-1)}>
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <nav className="regions" ref={nav} aria-label={s('regionsNav', lang)}>
        {REGIONS.map((r) => (
          <button
            key={r.key}
            className={`region-chip ${region === r.key ? 'on' : ''}`}
            style={{ ['--accent' as string]: r.accent }}
            aria-current={region === r.key ? 'location' : undefined}
            onClick={() => focus(r.key)}
            onFocus={(e) => e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: behavior() })}
          >
            {r.name[lang]}
          </button>
        ))}
      </nav>
      <button className="regions-arrow next" tabIndex={-1} aria-hidden onClick={() => page(1)}>
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
