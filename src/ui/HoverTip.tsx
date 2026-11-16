import { useEffect, useRef } from 'react';
import { useStore } from '../state/store';

/**
 * Name of the border polity under the pointer. It follows the pointer by writing the transform
 * directly, so moving the mouse no longer re-renders the whole app (App used to keep the mouse
 * position in React state). Hidden while the pointer is over a panel rather than the globe.
 */
export function HoverTip() {
  const name = useStore((st) => st.hoverBorder);
  const lang = useStore((st) => st.lang);
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef({ x: -999, y: -999, onGlobe: false });

  useEffect(() => {
    const place = () => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate(${last.current.x + 14}px, ${last.current.y + 12}px)`;
      el.style.visibility = last.current.onGlobe ? 'visible' : 'hidden';
    };
    const onMove = (e: PointerEvent) => {
      const t = e.target as Element | null;
      last.current = { x: e.clientX, y: e.clientY, onGlobe: !!t?.classList?.contains('globe-canvas') };
      place();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    place();
    return () => window.removeEventListener('pointermove', onMove);
  }, [name]);

  if (!name) return null;
  return (
    <div ref={ref} className="hover-tip" aria-hidden style={{ visibility: 'hidden' }}>
      {name[lang]}
    </div>
  );
}
