import { useMemo } from 'react';
import { EVENT_COLOR, EVENT_GLYPH, s } from '../i18n';
import { REGION_BY_KEY } from '../regions';
import { formatYear, t, useStore } from '../state/store';

export function Drawer() {
  const atlas = useStore((st) => st.atlas);
  const year = useStore((st) => st.year);
  const lang = useStore((st) => st.lang);
  const region = useStore((st) => st.region);
  const open = useStore((st) => st.drawerOpen);
  const set = useStore((st) => st.set);
  const select = useStore((st) => st.select);

  const data = useMemo(() => {
    if (!atlas) return null;
    const inRegion = <T extends { region: string }>(x: T) => !region || x.region === region;
    const polities = atlas.polities.filter((p) => inRegion(p) && year >= p.from && year <= p.to);
    const events = atlas.events
      .filter((e) => inRegion(e) && (e.endYear ? year >= e.year - 5 && year <= e.endYear + 5 : Math.abs(e.year - year) <= 15))
      .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year) || b.importance - a.importance)
      .slice(0, 8);
    const people = atlas.people.filter((p) => inRegion(p) && year >= p.born && year <= p.died);
    return { polities, events, people };
  }, [atlas, year, region]);

  if (!data) return null;
  return (
    <aside className={`drawer ${open ? 'open' : ''}`}>
      <button className="drawer-toggle" onClick={() => set({ drawerOpen: !open })} aria-label="toggle panel">
        {open ? '‹' : '›'}
      </button>
      <div className="drawer-body">
        <div className="drawer-title">
          <span>{region ? REGION_BY_KEY[region].name[lang] : lang === 'zh' ? '全球' : 'The world'}</span>
          <em>{formatYear(year, lang)}</em>
        </div>

        <section>
          <h3>{s('dynasties', lang)}</h3>
          {data.polities.length === 0 && <p className="muted">—</p>}
          <ul className="polity-list">
            {data.polities.map((p) => {
              const ruler = p.rulers?.find((r) => year >= r.from && year <= r.to);
              return (
                <li key={p.id}>
                  <button onClick={() => select({ kind: 'polity', id: p.id })}>
                    <i style={{ background: p.color }} />
                    <span className="pn">{t(p.name, lang)}</span>
                    {ruler && <span className="pr">{t(ruler.name, lang)}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section>
          <h3>{s('thisYear', lang)}</h3>
          {data.events.length === 0 && <p className="muted">—</p>}
          <ul className="event-list">
            {data.events.map((e) => (
              <li key={e.id}>
                <button onClick={() => select({ kind: 'event', id: e.id })}>
                  <b style={{ color: EVENT_COLOR[e.type] }}>{EVENT_GLYPH[e.type]}</b>
                  <span className="ey">{e.year}</span>
                  <span className="en">{t(e.name, lang)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>{s('aliveNow', lang)}</h3>
          {data.people.length === 0 && <p className="muted">—</p>}
          <div className="people-row">
            {data.people.map((p) => (
              <button key={p.id} className="person-chip" onClick={() => select({ kind: 'person', id: p.id })} title={t(p.role, lang)}>
                {p.image ? <img src={p.image.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <em>{t(p.name, lang).slice(0, 1)}</em>}
                <span>{t(p.name, lang)}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
