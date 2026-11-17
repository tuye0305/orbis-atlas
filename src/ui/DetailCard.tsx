import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { EVENT_COLOR, EVENT_GLYPH, EVENT_TYPE_LABEL, s } from '../i18n';
import { gamesFor } from '../games/registry';
import { formatYear, t, useStore } from '../state/store';
import type { Details, ImageRef, Lang, Stop } from '../types';
import { useModal } from './dialog';

// Stories, sources, notes and Wikipedia links live in details.json, so first paint only waits for
// atlas.json. The file is fetched once, on the first card that needs it.
let detailsPromise: Promise<Record<string, Details>> | null = null;
function loadDetails() {
  detailsPromise ??= fetch(`${import.meta.env.BASE_URL}data/details.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => {
      detailsPromise = null;
      return {};
    });
  return detailsPromise;
}

function useDetails(id: string): Details | null {
  const [loaded, setLoaded] = useState<{ id: string; d: Details } | null>(null);
  useEffect(() => {
    let live = true;
    loadDetails().then((all) => live && setLoaded({ id, d: all[id] ?? {} }));
    return () => {
      live = false;
    };
  }, [id]);
  return loaded?.id === id ? loaded.d : null;
}

function Story({ id, lang }: { id: string; lang: Lang }) {
  const story = useDetails(id)?.story;
  if (!story) return null;
  return (
    <div className="story">
      {t(story, lang)
        .split(/\n{2,}/)
        .map((para, i) => (
          <p key={i}>{para}</p>
        ))}
    </div>
  );
}

const commonsPage = (file: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, '_'))}`;

/** atlas.json images carry the original's pixel size (scripts/build-data.mjs) when Commons gave one. */
type SizedImage = ImageRef & { w?: number; h?: number };

/** Thumbnail widths Commons serves; any other width is rejected with HTTP 400 (800 and 1000 included). */
const STEPS = [120, 250, 330, 500, 960, 1280, 1920];
const THUMB = /\/((?:lossy-)?(?:page\d+-)?)\d+px-([^/?]+)(\?.*)?$/;
const isSvg = (img: ImageRef) => /\.svg$/i.test(img.file);

/** The same picture at another standard width, or null when Commons cannot render it. */
function thumbAt(img: SizedImage, width: number): string | null {
  if (!THUMB.test(img.thumb)) return null; // Already the original: the file is narrower than 500 px.
  // Commons never upscales a bitmap; SVGs rasterise at any width. Without a size, keep the 500 we have.
  if (!isSvg(img) && (img.w ? width >= img.w : width !== 500)) return null;
  return img.thumb.replace(THUMB, `/$1${width}px-$2$3`);
}

/** `srcset` from 250 px up to `max`. A JPEG that falls between 500 and 960 also offers its original. */
function srcSet(img: SizedImage, max: number): string | undefined {
  const c = STEPS.filter((w) => w >= 250 && w <= max).flatMap((w) => {
    const url = thumbAt(img, w);
    return url ? [`${url} ${w}w`] : [];
  });
  if (img.w && img.w > 500 && img.w < 960 && /\.jpe?g$/i.test(img.file) && THUMB.test(img.thumb)) {
    const original = img.thumb.replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/').replace('/commons/thumb/', '/commons/').replace(/\/[^/]+$/, '');
    c.push(`${original} ${img.w}w`);
  }
  return c.length > 1 ? c.join(', ') : undefined;
}

/**
 * Where a round avatar centres a portrait. The circle shows a square of the picture's width; the
 * taller the picture, the higher in that frame the head usually sits (bust ≈ 0.8, full figure < 0.6).
 */
function avatarFocus(img: SizedImage): CSSProperties | undefined {
  if (!img.w || !img.h || img.w >= img.h) return undefined; // Wide: only the sides are cut.
  return { objectPosition: img.w / img.h >= 0.72 ? '50% 18%' : '50% 6%' };
}

const credit = (img: ImageRef) => `${img.artist ? `${img.artist} · ` : ''}${img.license ?? 'Wikimedia Commons'}`;

function Img({ img, alt, lang }: { img?: SizedImage; alt: string; lang: Lang }) {
  if (!img) return null;
  // Keyed by URL so the load state and any measured ratio reset when the card switches record.
  return <CardImage key={img.thumb} img={img} alt={alt} lang={lang} />;
}

/**
 * The whole picture is always shown (object-fit: contain), never cropped. The frame takes the
 * image's own aspect ratio, known from atlas.json before anything loads (so the card does not jump),
 * capped by a viewport-relative height and by 1.5x the original's pixels (tiny files stay crisp).
 * Wide paintings fill the card edge to edge; tall portraits sit on a blurred copy of themselves,
 * drawn from a 120 px thumbnail that arrives first and doubles as the loading placeholder.
 * Clicking the picture opens it larger.
 */
function CardImage({ img, alt, lang }: { img: SizedImage; alt: string; lang: Lang }) {
  const [measured, setMeasured] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState(0);
  const [open, setOpen] = useState(false);
  const ratio = img.w && img.h ? img.w / img.h : measured;
  const r = ratio ?? 4 / 3;
  // A broken srcset candidate retries with the plain 500 px thumbnail; a second failure hides the frame.
  const set = errors ? undefined : srcSet(img, 1280);
  if (errors > 1) return null;
  const style = {
    '--img': `url("${thumbAt(img, 120) ?? img.thumb}")`,
    '--up': img.h ? `${Math.round(img.h * 1.5)}px` : undefined,
    aspectRatio: String(r),
  } as CSSProperties;
  const done = (el: HTMLImageElement) => {
    setLoaded(true);
    if (!ratio && el.naturalWidth && el.naturalHeight) setMeasured(el.naturalWidth / el.naturalHeight);
  };
  const zh = lang === 'zh';
  return (
    <figure className={`card-img${r < 1 ? ' tall' : ''}${loaded ? ' loaded' : ''}`} style={style}>
      <button type="button" className="card-img-open" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`${zh ? '查看大图' : 'View larger image'}: ${alt}`}>
        <img
          // A cached picture can finish before React attaches onLoad.
          ref={(el) => {
            if (el?.complete && el.naturalWidth && !loaded) done(el);
          }}
          src={img.thumb}
          srcSet={set}
          // The painted width: the card's, or less once the height cap applies to a tall picture.
          sizes={set && `(max-width: 900px) and (min-height: 501px) min(calc(100vw - 18px), calc(${r.toFixed(3)} * clamp(130px, 24vh, 230px))), min(378px, calc(${r.toFixed(3)} * clamp(170px, 38vh, 380px)))`}
          width={img.w}
          height={img.h}
          alt={alt}
          referrerPolicy="no-referrer"
          decoding="async"
          onLoad={(e) => done(e.currentTarget)}
          onError={() => setErrors((n) => n + (set ? 1 : 2))}
        />
        <span className="card-img-zoom" aria-hidden>
          <svg viewBox="0 0 16 16" width="13" height="13">
            <path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <figcaption>
        <a href={commonsPage(img.file)} target="_blank" rel="noreferrer" title={credit(img)}>
          {credit(img)}
        </a>
      </figcaption>
      {open && <Lightbox img={img} alt={alt} lang={lang} ratio={r} onClose={() => setOpen(false)} />}
    </figure>
  );
}

/**
 * The picture as large as the window allows (never past 2x its pixels) with its full credit. A
 * modal dialog: focus stays inside, Escape or a click outside closes it, focus returns to the
 * picture. Rendered into <body>, because the card's backdrop-filter would trap position: fixed.
 * The card's already-loaded copy is painted underneath, so something shows while the large one loads.
 */
function Lightbox({ img, alt, lang, ratio, onClose }: { img: SizedImage; alt: string; lang: Lang; ratio: number; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  useModal(box, onClose, close);
  const set = srcSet(img, 1920);
  const maxw = img.w ? `${img.w * (isSvg(img) ? 4 : 2)}px` : '1400px';
  const style = { '--r': String(ratio), '--maxw': maxw, backgroundImage: `url("${img.thumb}")` } as CSSProperties;
  return createPortal(
    // Keys stop here, so the app's shortcuts (arrows step through events, Space plays) stay inert.
    <div className="img-lightbox" onClick={onClose} onKeyDown={(e) => e.stopPropagation()}>
      <div ref={box} className="img-lightbox-box" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={(e) => e.stopPropagation()}>
        <img src={img.thumb} srcSet={set} sizes={set && `min(92vw, ${maxw}, calc(${ratio.toFixed(3)} * (100vh - 150px)))`} alt={alt} referrerPolicy="no-referrer" style={style} />
        <div className="img-lightbox-cap">
          <b id={titleId}>{alt}</b>
          <span>{credit(img)}</span>
          <a href={commonsPage(img.file)} target="_blank" rel="noreferrer">
            Wikimedia Commons ↗
          </a>
        </div>
        <button ref={close} type="button" className="img-lightbox-close" onClick={onClose} aria-label={s('close', lang)}>
          ×
        </button>
      </div>
    </div>,
    document.body,
  );
}

function Sources({ id, qid, lang }: { id: string; qid?: string; lang: Lang }) {
  const d = useDetails(id);
  const sources = d?.sources;
  const wiki = d?.wiki;
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
function Confidence({ c, id, lang }: { c?: string; id: string; lang: Lang }) {
  const note = useDetails(id)?.note;
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
          <Img img={e.image} alt={t(e.name, lang)} lang={lang} />
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
          <Story id={e.id} lang={lang} />
          <Confidence c={e.confidence} id={e.id} lang={lang} />
          {people.length > 0 && (
            <>
              <h4>{s('people_involved', lang)}</h4>
              <div className="people-row">
                {people.map((p) => (
                  <button key={p!.id} className="person-chip" onClick={() => select({ kind: 'person', id: p!.id })}>
                    {p!.image ? (
                      <img src={thumbAt(p!.image, 120) ?? p!.image.thumb} alt="" referrerPolicy="no-referrer" style={avatarFocus(p!.image)} />
                    ) : (
                      <em>{t(p!.name, lang).slice(0, 1)}</em>
                    )}
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
          <Sources id={e.id} qid={e.qid} lang={lang} />
        </>
      );
    }
    if (sel.kind === 'person') {
      const p = atlas.people.find((x) => x.id === sel.id);
      if (!p) return null;
      return (
        <>
          <Img img={p.image} alt={t(p.name, lang)} lang={lang} />
          <div className="card-kicker">
            {t(p.role, lang)} · {formatYear(p.born, lang)} – {p.died == null ? s('living', lang) : formatYear(p.died, lang)}
          </div>
          <h2>{t(p.name, lang)}</h2>
          <div className="alt-name" lang={lang === 'zh' ? 'en' : 'zh'}>{lang === 'zh' ? p.name.en : p.name.zh}</div>
          <p className="summary">{t(p.summary, lang)}</p>
          <PlayGames id={p.id} lang={lang} />
          <Story id={p.id} lang={lang} />
          <Confidence c={p.confidence} id={p.id} lang={lang} />
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
          <Sources id={p.id} qid={p.qid} lang={lang} />
        </>
      );
    }
    if (sel.kind === 'place') {
      const p = atlas.places.find((x) => x.id === sel.id);
      if (!p) return null;
      const evs = atlas.events.filter((e) => e.place === p.id || Math.hypot(e.lat - p.lat, (e.lon - p.lon) * Math.cos((p.lat * Math.PI) / 180)) < 0.35);
      return (
        <>
          <Img img={p.image} alt={t(p.modern, lang)} lang={lang} />
          <div className="card-kicker">
            {s('genealogy', lang)} · {s('today', lang)} {t(p.modern, lang)}
          </div>
          <h2>{t(p.modern, lang)}</h2>
          <p className="summary">{t(p.summary, lang)}</p>
          <Story id={p.id} lang={lang} />
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
          <Confidence c={p.confidence} id={p.id} lang={lang} />
          <Sources id={p.id} qid={p.qid} lang={lang} />
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
          <Story id={p.id} lang={lang} />
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
          <Confidence c={p.confidence} id={p.id} lang={lang} />
          <Sources id={p.id} qid={p.qid} lang={lang} />
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
