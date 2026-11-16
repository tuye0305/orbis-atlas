import { useMemo } from 'react';
import { EVENT_COLOR, EVENT_GLYPH, EVENT_TYPE_LABEL, s } from '../i18n';
import { gamesFor } from '../games/registry';
import { formatYear, t, useStore } from '../state/store';
import type { ImageRef, Lang, Source, Stop } from '../types';

function Img({ img, alt }: { img?: ImageRef; alt: string }) {
  if (!img) return null;
  return (
    <figure className="card-img">
      <img src={img.thumb} alt={alt} referrerPolicy="no-referrer" />
      <figcaption>
        <a href={img.page} target="_blank" rel="noreferrer">
          {img.artist ? `${img.artist} · ` : ''}
          {img.license ?? 'Wikimedia Commons'}
        </a>
      </figcaption>
    </figure>
  );
}

function Sources({ sources, qid, wiki, lang }: { sources?: Source[]; qid?: string; wiki?: { en: string | null; zh: string | null }; lang: Lang }) {
  const page = wiki?.[lang] ?? wiki?.en;
  return (
    <details className="sources">
      <summary>{s('sources', lang)}</summary>
      <ul>
        {(sources ?? []).map((x, i) => (
          <li key={i}>{x.url ? <a href={x.url} target="_blank" rel="noreferrer">{x.title}</a> : x.title}</li>
        ))}
        {qid && (
          <li>
            <a href={`https://www.wikidata.org/wiki/${qid}`} target="_blank" rel="noreferrer">
              Wikidata {qid}
            </a>
          </li>
        )}
        {page && (
          <li>
            <a href={`https://${lang === 'zh' && wiki?.zh ? 'zh' : 'en'}.wikipedia.org/wiki/${encodeURIComponent(page)}`} target="_blank" rel="noreferrer">
              {s('openWiki', lang)}: {page}
            </a>
          </li>
        )}
      </ul>
    </details>
  );
}

/**
 * Confidence flag plus the curator's note. Notes exist only in English, so in the Chinese UI they
 * are labelled 备注（英文） and marked lang="en" rather than machine-translated. Notes on
 * high-confidence records used to be hidden; they explain sourcing choices, so show them too.
 */
function Confidence({ c, note, lang }: { c?: string; note?: string; lang: Lang }) {
  const flagged = c === 'medium' || c === 'low';
  if (!flagged && !note) return null;
  const label = lang === 'zh' ? (c === 'medium' ? '存在争议或为约数' : '传统说法 / 可信度较低') : c === 'medium' ? 'Approximate or debated' : 'Traditional / low confidence';
  return (
    <div className={`confidence c-${flagged ? c : 'high'}`}>
      {flagged && (
        <p className="conf-label">
          <span className="sr-only">{s('confidence', lang)}: </span>
          {label}
        </p>
      )}
      {note && (
        <p className="note">
          <span className="note-tag">{s('noteEn', lang)}</span> <span lang="en">{note}</span>
        </p>
      )}
    </div>
  );
}

/** “Play” call-to-action for records that have a hand-made mini-game. */
function PlayGames({ id, lang }: { id: string; lang: Lang }) {
  const set = useStore((st) => st.set);
  const games = gamesFor(id);
  if (!games.length) return null;
  return (
    <div className="play-games">
      {games.map((g) => (
        <button key={g.id} className="play-game" style={{ ['--accent' as string]: g.accent }} onClick={() => set({ game: g.id, playing: false })}>
          <span className="pg-icon" aria-hidden>
            ▶
          </span>
          <span className="pg-text">
            <b>{t(g.title, lang)}</b>
            <small>{lang === 'zh' ? '小游戏' : 'Mini-game'} · {t(g.kicker, lang)}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

function StopList({ stops, lang, active, onPick }: { stops: Stop[]; lang: Lang; active: number; onPick: (i: number) => void }) {
  return (
    <ol className="stops">
      {stops.map((st, i) => (
        <li key={i} className={i === active ? 'on' : ''}>
          <button onClick={() => onPick(i)} aria-current={i === active ? 'step' : undefined}>
            <b aria-hidden>{i + 1}</b>
            <span className="sy">{formatYear(st.year, lang)}</span>
            <span>{t(st.label, lang)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}

export function DetailCard() {
  const atlas = useStore((st) => st.atlas);
  const sel = useStore((st) => st.selection);
  const lang = useStore((st) => st.lang);
  const year = useStore((st) => st.year);
  const journeyStop = useStore((st) => st.journeyStop);
  const select = useStore((st) => st.select);
  const set = useStore((st) => st.set);
  const setYear = useStore((st) => st.setYear);
  const flyTo = useStore((st) => st.flyTo);

  const pickStop = (stops: Stop[], i: number) => {
    set({ journeyStop: i });
    setYear(stops[i].year);
    flyTo(stops[i].lat, stops[i].lon, 1.2);
  };

  const body = useMemo(() => {
    if (!atlas || !sel) return null;
    if (sel.kind === 'event') {
      const e = atlas.events.find((x) => x.id === sel.id);
      if (!e) return null;
      const people = (e.people ?? []).map((id) => atlas.people.find((p) => p.id === id)).filter(Boolean);
      return (
        <>
          <Img img={e.image} alt={t(e.name, lang)} />
          <div className="card-kicker" style={{ color: EVENT_COLOR[e.type] }}>
            <span aria-hidden>{EVENT_GLYPH[e.type]}</span> {EVENT_TYPE_LABEL[e.type][lang]} · {e.date ?? formatYear(e.year, lang)}
            {e.endYear && e.endYear !== e.year ? ` – ${formatYear(e.endYear, lang)}` : ''}
          </div>
          <h2>{t(e.name, lang)}</h2>
          <div className="alt-name" lang={lang === 'zh' ? 'en' : 'zh'}>
            {lang === 'zh' ? e.name.en : e.name.zh}
          </div>
          <p className="summary">{t(e.summary, lang)}</p>
          <PlayGames id={e.id} lang={lang} />
          <Confidence c={e.confidence} note={e.note} lang={lang} />
          {people.length > 0 && (
            <>
              <h4>{s('people_involved', lang)}</h4>
              <div className="people-row">
                {people.map((p) => (
                  <button key={p!.id} className="person-chip" onClick={() => select({ kind: 'person', id: p!.id })}>
                    {p!.image ? <img src={p!.image.thumb} alt="" referrerPolicy="no-referrer" /> : <em>{t(p!.name, lang).slice(0, 1)}</em>}
                    <span>{t(p!.name, lang)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {e.route && e.route.length > 1 && (
            <>
              <h4>{s('campaign', lang)}</h4>
              <StopList stops={e.route} lang={lang} active={journeyStop} onPick={(i) => pickStop(e.route!, i)} />
            </>
          )}
          <Sources sources={e.sources} qid={e.qid} wiki={e.wiki} lang={lang} />
        </>
      );
    }
    if (sel.kind === 'person') {
      const p = atlas.people.find((x) => x.id === sel.id);
      if (!p) return null;
      return (
        <>
          <Img img={p.image} alt={t(p.name, lang)} />
          <div className="card-kicker">
            {t(p.role, lang)} · {formatYear(p.born, lang)} – {formatYear(p.died, lang)}
          </div>
          <h2>{t(p.name, lang)}</h2>
          <div className="alt-name" lang={lang === 'zh' ? 'en' : 'zh'}>{lang === 'zh' ? p.name.en : p.name.zh}</div>
          <p className="summary">{t(p.summary, lang)}</p>
          <PlayGames id={p.id} lang={lang} />
          <Confidence c={p.confidence} note={p.note} lang={lang} />
          <h4>{s('journey', lang)}</h4>
          <StopList stops={p.stops} lang={lang} active={journeyStop} onPick={(i) => pickStop(p.stops, i)} />
          <div className="stop-nav">
            <button disabled={journeyStop <= 0} onClick={() => pickStop(p.stops, journeyStop - 1)} aria-label={s('prevStop', lang)}>
              <span aria-hidden>‹</span>
            </button>
            <span aria-live="polite">
              {journeyStop + 1} / {p.stops.length}
            </span>
            <button disabled={journeyStop >= p.stops.length - 1} onClick={() => pickStop(p.stops, journeyStop + 1)} aria-label={s('nextStop', lang)}>
              <span aria-hidden>›</span>
            </button>
          </div>
          <Sources sources={p.sources} qid={p.qid} wiki={p.wiki} lang={lang} />
        </>
      );
    }
    if (sel.kind === 'place') {
      const p = atlas.places.find((x) => x.id === sel.id);
      if (!p) return null;
      const evs = atlas.events.filter((e) => e.place === p.id || Math.hypot(e.lat - p.lat, (e.lon - p.lon) * Math.cos((p.lat * Math.PI) / 180)) < 0.35);
      return (
        <>
          <Img img={p.image} alt={t(p.modern, lang)} />
          <div className="card-kicker">
            {s('genealogy', lang)} · {s('today', lang)} {t(p.modern, lang)}
          </div>
          <h2>{t(p.modern, lang)}</h2>
          <p className="summary">{t(p.summary, lang)}</p>
          <ol className="genealogy">
            {p.names.map((n, i) => {
              const now = year >= n.from && (n.to === null || year < n.to);
              return (
                <li key={i} className={now ? 'now' : ''}>
                  <button onClick={() => setYear(Math.max(1, n.from))}>
                    <span className="gy">
                      {formatYear(n.from, lang)} – {n.to === null ? s('today', lang) : formatYear(n.to, lang)}
                    </span>
                    <span className="gn">
                      {t(n.name, lang)}
                      {n.capital && <em className="cap-badge">{s('capital', lang)}</em>}
                    </span>
                    {n.polity && <span className="gp">{t(n.polity, lang)}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
          {evs.length > 0 && (
            <>
              <h4>{s('eventsHere', lang)}</h4>
              <ul className="event-list">
                {evs.map((e) => (
                  <li key={e.id}>
                    <button onClick={() => select({ kind: 'event', id: e.id })}>
                      <b style={{ color: EVENT_COLOR[e.type] }} aria-hidden>
                        {EVENT_GLYPH[e.type]}
                      </b>
                      <span className="ey">{e.year}</span>
                      <span className="en">{t(e.name, lang)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Confidence c={p.confidence} note={p.note} lang={lang} />
          <Sources sources={p.sources} qid={p.qid} wiki={p.wiki} lang={lang} />
        </>
      );
    }
    if (sel.kind === 'polity') {
      const p = atlas.polities.find((x) => x.id === sel.id);
      if (!p) return null;
      return (
        <>
          <div className="card-kicker">
            <i className="swatch" style={{ background: p.color }} aria-hidden /> {formatYear(p.from, lang)} – {formatYear(p.to, lang)}
            {p.capital ? ` · ${s('capital', lang)} ${t(p.capital, lang)}` : ''}
          </div>
          <h2>{t(p.name, lang)}</h2>
          <div className="alt-name" lang={lang === 'zh' ? 'en' : 'zh'}>{lang === 'zh' ? p.name.en : p.name.zh}</div>
          <p className="summary">{t(p.summary, lang)}</p>
          {p.rulers && p.rulers.length > 0 && (
            <>
              <h4>{s('rulers', lang)}</h4>
              <ol className="rulers">
                {p.rulers.map((r, i) => (
                  <li key={i} className={year >= r.from && year <= r.to ? 'now' : ''}>
                    <button onClick={() => setYear(Math.max(1, r.from))}>
                      <span className="ry">
                        {formatYear(r.from, lang)} – {formatYear(r.to, lang)}
                      </span>
                      <span>{t(r.name, lang)}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
          <Confidence c={p.confidence} note={p.note} lang={lang} />
          <Sources sources={p.sources} qid={p.qid} wiki={p.wiki} lang={lang} />
        </>
      );
    }
    if (sel.kind === 'border') {
      const zh = sel.zh || atlas.polityNames[sel.name]?.zh;
      const nameLc = sel.name.toLowerCase();
      const match = atlas.polities.find(
        (p) => year >= p.from - 5 && year <= p.to + 5 && (p.name.en.toLowerCase().includes(nameLc) || nameLc.includes(p.name.en.toLowerCase().replace(/ (dynasty|empire)$/, ''))),
      );
      return (
        <>
          <div className="card-kicker">
            {s('borders', lang)} · {formatYear(year, lang)}
          </div>
          <h2>{lang === 'zh' ? zh || sel.name : sel.name}</h2>
          <div className="alt-name" lang={lang === 'zh' ? 'en' : 'zh'}>{lang === 'zh' ? sel.name : zh}</div>
          <p className="summary muted">{s('approx', lang)}</p>
          {match && (
            <button className="link-btn" onClick={() => select({ kind: 'polity', id: match.id })}>
              {t(match.name, lang)} →
            </button>
          )}
          <p className="muted small">historical-basemaps · aourednik (GPL-3.0)</p>
        </>
      );
    }
    return null;
  }, [atlas, sel, lang, year, journeyStop]);

  return (
    <aside className={`card ${body ? 'open' : ''}`} aria-hidden={!body} aria-label={s('details', lang)}>
      {body && (
        <>
          <button className="card-close" onClick={() => select(null)} aria-label={s('close', lang)}>
            ×
          </button>
          <div className="card-scroll" key={sel && 'id' in sel ? sel.id : sel?.kind}>
            {body}
          </div>
        </>
      )}
    </aside>
  );
}
