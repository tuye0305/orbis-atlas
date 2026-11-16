import { useEffect, useMemo, useRef, useState } from 'react';
import { EVENT_GLYPH, s } from '../i18n';
import { formatYear, useStore } from '../state/store';
import type { Selection } from '../types';

interface Hit {
  sel: Selection;
  title: string;
  sub: string;
  glyph: string;
  score: number;
}

const norm = (x: string) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function Search() {
  const open = useStore((st) => st.searchOpen);
  const atlas = useStore((st) => st.atlas);
  const lang = useStore((st) => st.lang);
  const set = useStore((st) => st.set);
  const select = useStore((st) => st.select);
  const setYear = useStore((st) => st.setYear);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);

  const hits = useMemo<Hit[]>(() => {
    if (!atlas || !q.trim()) return [];
    const nq = norm(q.trim());
    const score = (...names: string[]) => {
      let best = 0;
      for (const n of names) {
        const nn = norm(n);
        if (nn === nq) best = Math.max(best, 100);
        else if (nn.startsWith(nq)) best = Math.max(best, 60);
        else if (nn.includes(nq)) best = Math.max(best, 30);
      }
      return best;
    };
    const out: Hit[] = [];
    for (const p of atlas.people) {
      const sc = score(p.name.en, p.name.zh);
      if (sc) out.push({ sel: { kind: 'person', id: p.id }, title: p.name[lang], sub: `${p.role[lang]} · ${formatYear(p.born, lang)}–${formatYear(p.died, lang)}`, glyph: '☺', score: sc + 5 });
    }
    for (const e of atlas.events) {
      const sc = score(e.name.en, e.name.zh);
      if (sc) out.push({ sel: { kind: 'event', id: e.id }, title: e.name[lang], sub: formatYear(e.year, lang), glyph: EVENT_GLYPH[e.type], score: sc + e.importance });
    }
    for (const p of atlas.places) {
      const sc = score(p.modern.en, p.modern.zh, ...p.names.flatMap((n) => [n.name.en, n.name.zh]));
      if (sc) out.push({ sel: { kind: 'place', id: p.id }, title: p.modern[lang], sub: p.names.map((n) => n.name[lang]).join(' → '), glyph: '◆', score: sc + 3 });
    }
    for (const p of atlas.polities) {
      const sc = score(p.name.en, p.name.zh, ...(p.rulers ?? []).flatMap((r) => [r.name.en, r.name.zh]));
      if (sc) out.push({ sel: { kind: 'polity', id: p.id }, title: p.name[lang], sub: `${formatYear(p.from, lang)}–${formatYear(p.to, lang)}`, glyph: '♛', score: sc + 2 });
    }
    const asYear = Number(q.trim());
    if (Number.isInteger(asYear) && asYear >= 1 && asYear <= 2025)
      out.unshift({ sel: null, title: formatYear(asYear, lang), sub: lang === 'zh' ? '跳转到此年' : 'Jump to this year', glyph: '⌛', score: 999 });
    return out.sort((a, b) => b.score - a.score).slice(0, 12);
  }, [atlas, q, lang]);

  if (!open) return null;
  const choose = (h: Hit) => {
    set({ searchOpen: false });
    if (h.sel) select(h.sel);
    else setYear(Number(q.trim()));
  };
  return (
    <div className="search-backdrop" onClick={() => set({ searchOpen: false })}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <input
          ref={input}
          value={q}
          placeholder={s('search', lang)}
          onChange={(e) => {
            setQ(e.target.value);
            setCursor(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') setCursor((c) => Math.min(hits.length - 1, c + 1));
            else if (e.key === 'ArrowUp') setCursor((c) => Math.max(0, c - 1));
            else if (e.key === 'Enter' && hits[cursor]) choose(hits[cursor]);
            else if (e.key === 'Escape') set({ searchOpen: false });
          }}
        />
        {hits.length > 0 && (
          <ul>
            {hits.map((h, i) => (
              <li key={i} className={i === cursor ? 'on' : ''} onMouseEnter={() => setCursor(i)} onClick={() => choose(h)}>
                <b>{h.glyph}</b>
                <span className="st">{h.title}</span>
                <span className="ss">{h.sub}</span>
              </li>
            ))}
          </ul>
        )}
        {!q && (
          <div className="search-hints">
            {(lang === 'zh' ? ['君士坦丁堡', '曼萨·穆萨', '长安', '1453', '拿破仑', '玄奘'] : ['Constantinople', 'Mansa Musa', "Chang'an", '1453', 'Napoleon', 'Xuanzang']).map((x) => (
              <button key={x} onClick={() => setQ(x)}>
                {x}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
