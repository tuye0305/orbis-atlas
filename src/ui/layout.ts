import { type RefObject, useLayoutEffect } from 'react';

/**
 * Publish an element's live height as a CSS variable on <html>.
 *
 * The top bar wraps to one, two or three rows depending on the window, and the timeline grows with
 * the number of dynasty lanes in the current region. The side panels, the phone bottom sheet and
 * the disclaimer are positioned from `--topbar-h` and `--timeline-h`, so they always sit between
 * the two instead of sliding under either at some window size.
 */
export function useHeightVar(ref: RefObject<HTMLElement | null>, name: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    // offsetHeight ignores CSS transforms, so the slide-in animations do not disturb it.
    const write = () => root.style.setProperty(name, `${el.offsetHeight}px`);
    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty(name);
    };
  }, [ref, name]);
}
