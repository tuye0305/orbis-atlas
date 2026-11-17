import { type RefObject, useLayoutEffect } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog behaviour: moves focus into the dialog, keeps Tab inside it, closes on Escape and
 * gives focus back to whatever opened it.
 */
export function useModal(ref: RefObject<HTMLElement | null>, onClose: () => void, initial?: RefObject<HTMLElement | null>, fallback?: string) {
  // Layout effect: focus lands right after the commit, before the next keystroke is dispatched.
  useLayoutEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    (initial?.current ?? node?.querySelector<HTMLElement>(FOCUSABLE) ?? node)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (!node) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((x) => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Capture phase, so the app-wide shortcuts never see keys meant for the dialog.
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      // Opened by a shortcut while nothing had focus: land on the dialog's trigger button instead
      // of <body>, so the next Tab continues from the top bar rather than from the globe markers.
      const back = opener && opener !== document.body && document.contains(opener) ? opener : fallback ? document.querySelector<HTMLElement>(fallback) : null;
      back?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Publish the visual viewport's height and top as `--vvh` / `--vvt` on a dialog's backdrop. On
 * phones the on-screen keyboard shrinks the visual viewport but not `dvh`, so a full-height sheet
 * sized from these keeps its results list above the keyboard instead of behind it.
 */
export function useVisualViewport(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    const vv = window.visualViewport;
    if (!el || !vv) return;
    const write = () => {
      el.style.setProperty('--vvh', `${Math.round(vv.height)}px`);
      el.style.setProperty('--vvt', `${Math.round(vv.offsetTop)}px`);
    };
    write();
    vv.addEventListener('resize', write);
    vv.addEventListener('scroll', write);
    return () => {
      vv.removeEventListener('resize', write);
      vv.removeEventListener('scroll', write);
    };
  }, [ref]);
}
