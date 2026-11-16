# Orbis · 寰宇时序 — Project Plan

An interactive 3D historical atlas of the Old World (Europe, Africa, Asia) over the last
~2,000 years (1 CE → today): borders that shift with time, dynasties and their rulers,
wars and battles, famous people with portraits and life journeys, and the genealogy of
place names (Byzantion → Constantinople → Istanbul; 长安 → 西安). The China part adapts
[jiangshan-map](https://github.com/DeanChensj/jiangshan-map) (江山时序); the rest comes from
open, citable sources.

Static web app (no backend). Deployable to GitHub Pages.

## 1. Experience

| Surface | What it does |
| --- | --- |
| **Globe** | A 3D Earth (three.js + three-globe) with a parchment-tinted relief, atmosphere glow and starfield. Historical polities are drawn as extruded, color-keyed caps; hovering one lifts it and shows its name. |
| **Region jumps** | Chips for Europe · Africa · West Asia · South Asia · Central Asia · East Asia · Southeast Asia. The camera flies there along a great-circle arc (GSAP); the soundtrack crossfades to that region's score. Free rotation also updates the "current region" from the camera's centre. |
| **Timeline** | A bottom scrubber, 1 → 2025 CE, with era bands per region (dynasty succession), event density ticks, play/pause, ←/→ step to the next event. The border snapshot follows the year. |
| **Events** | Pins (battles = crossed swords, wars = flame, politics = crown, culture/science = star, religion, disasters). Their glow fades with distance in time from the current year. Click → card with image, date, summary, people involved, sources. Wars with campaigns draw animated arcs. |
| **People** | Portrait markers. Click → biography card with Commons portrait, life span, role, numbered journey stops drawn as an arc path on the globe; ‹ › steps through the stops and the year follows. |
| **Places** | City markers. Click → name-genealogy card: every historical name with its date range and ruling polity, capital badges, events that happened there. |
| **Dynasties** | A side drawer per region listing polities and rulers active in the current year ("Who ruled where in 1066?"). |
| **Search** | `/` or ⌘K: people, events, places, polities, years. |
| **Music** | Code-synthesized Web Audio scores per region (pentatonic zither for East Asia, maqam-flavoured oud for West Asia, modal drone for Europe, kora-like polyrhythm for Africa, raga drone for South Asia, steppe throat-drone for Central Asia, gamelan bells for Southeast Asia). Crossfade on region change, never a hard cut (see the adant `soundtrack` skill: mark transitions with harmony, not volume). |
| **i18n** | English and 简体中文 throughout (`?lang=zh`). |
| **Deep links** | `?year=1453&focus=europe&event=…&person=…&place=…` |

## 2. Data sources (authenticity first)

| Layer | Source | License |
| --- | --- | --- |
| World borders (snapshots 1 CE → 2010) | [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) | GPL-3.0 |
| China data (dynasties, milestones, events, people, places) | [DeanChensj/jiangshan-map](https://github.com/DeanChensj/jiangshan-map) (excluding the CHGIS-derived prefecture layer, which is not redistributable) | GPL-3.0 |
| Canonical facts: dates, coordinates, labels en/zh, portraits | [Wikidata](https://www.wikidata.org) | CC0 |
| Images | Wikimedia Commons (hot-linked thumbnails, per-file license + author shown in the card) | per file |
| Cross-check sources | Encyclopaedia Britannica, Wikipedia (en/zh), primary texts named per record (e.g. Procopius, Ibn Battuta, 资治通鉴), standard reference works | cited, not copied |

**Pipeline.** Agents curate records (which events/people/places matter, bilingual summaries,
journey stops) and tag each with its Wikidata QID. `scripts/enrich-wikidata.mjs` pulls the
canonical date, coordinates, labels and image for each QID and caches them;
`scripts/build-data.mjs` merges, validates and writes `public/data/*.json`, and writes an
**auto-diff report** wherever the curated value disagrees with Wikidata (year off by more than a
year, coordinates more than 50 km apart). Verifier agents then resolve every diff
against a second independent source and record the verdict in `data/verification/`.

## 3. Architecture

```
data/                    curated source (editable)
  <region>/events.json people.json places.json polities.json
  polity-names.json      historical-basemaps NAME → zh + colour family
  cache/wikidata.json    enrichment cache (committed, reproducible)
  verification/          auto-diff + verifier reports
scripts/
  enrich-wikidata.mjs    Wikidata + Commons fetch → cache
  build-borders.mjs      historical-basemaps → simplified TopoJSON per snapshot
  build-data.mjs         merge + validate + diff → public/data
public/data/             built, loaded lazily by the app
src/
  globe/                 three.js scene, globe, layers, camera director
  audio/                 region scores (Web Audio)
  ui/                    React panels: timeline, cards, search, drawer
  state/                 zustand store (year, region, selection, lang)
```

## 4. Milestones

1. **M0 – Plan & scaffold** (this doc, schema, pipeline scripts).
2. **M1 – Data v1** (parallel agents): Europe, Africa, West/South/Central Asia, China (from
   jiangshan-map), Japan/Korea/SE Asia; polity-name translations.
3. **M2 – Globe v1**: borders by year, region fly-to, event/person/place layers, cards, timeline.
4. **M3 – Audio**: seven region scores with crossfade.
5. **M4 – Verification**: verifier agents resolve auto-diffs and spot-check records against
   second sources; reports committed.
6. **M5 – Ship**: public GitHub repo, PR with screenshots, local Playwright smoke test.
7. **M6 – Review & improve**: reviewer agents (3D/motion, data accuracy, UX/a11y/perf) open
   follow-up PRs on top.

## 5. Known limitations

- Borders are schematic (historical-basemaps marks most as `BORDERPRECISION = 1`) and the
  snapshots are sparse (every ~100 years before 1500). The UI says so.
- "Region" is a navigation aid, not a historical claim.
- Records carry a `confidence` and `sources`; disputed dates are shown as such, not hidden.
