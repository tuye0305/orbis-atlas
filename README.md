# Orbis · 寰宇时序 — Chronicles of the World

**An interactive 3D historical atlas of the whole world — Europe, Africa, Asia, the Americas and Oceania — across the last 2,000 years.**
Turn the globe, fly to a region, scrub the timeline from 1 CE to today, and watch borders shift,
dynasties rise and fall, wars march across the map, famous people travel their lives, and city
names change with their rulers (Byzantion → Constantinople → Istanbul; 长安 → 西安). Each region
has its own soundtrack, and the music crossfades as you turn the globe.

**Live site: <https://tuye0305.github.io/orbis-atlas/>** (deployed from `main` by `.github/workflows/pages.yml`).

**Open source** under the [GPL-3.0](LICENSE): you're free to use, study, change and share it under the same license. Issues and pull requests are welcome.

> A world companion to [江山时序 jiangshan-map](https://github.com/DeanChensj/jiangshan-map), whose
> Chinese data this project adapts. Static site, no backend.

## Features

| | |
| --- | --- |
| **3D globe** | three.js + three-globe. A custom "engraved atlas" shader gives parchment land with hill-shading, ink-blue seas, gold coastlines and a graticule. Lifted, colour-keyed polity caps keep one colour per lineage (Rome → Byzantium; Han → Tang → Ming → Qing) as borders move. |
| **Regions** | Europe · Africa · West Asia · Central Asia · South Asia · East Asia · Southeast Asia · North America · Mesoamerica · South America · Oceania: the camera flies there along a great-circle arc. Rotating freely also changes the region (and the music) under the camera. |
| **Timeline** | Scrub or play 1 → 2025 CE at 5/12/30 years per second. Dynasty bands for the current region, event ticks, and the ruler reigning that year. |
| **Stories** | Records carry a longer `story` (anecdotes, context, consequences) shown under the summary; stories ship in a separate lazily loaded `stories.json`. |
| **Events** | Battles, wars, foundings and falls, treaties, religion, science, exploration and disasters. Pins glow near their year, and wars and expeditions draw animated campaign routes. |
| **People** | Portraits stand where each person was in the current year. Opening a biography draws the numbered journey; step through it with ‹ › and the year follows. |
| **Place genealogy** | City labels change as you scrub. A city's card lists every historical name, the polity that ruled it, its capital periods and the events that happened there. |
| **Music** | One original instrumental score per region (plus an open-sea track), generated with ElevenLabs Music via WaveSpeed from the prompts in `music/prompts.json`: lute, viol and harp for Europe, kora and balafon for Africa, oud and ney for West Asia, dombra and horse-head fiddle for the steppe, sitar over tanpura for South Asia, guzheng and dizi for East Asia, gamelan and suling flute for Southeast Asia, cedar flute and frame drum for North America, clay flutes and teponaztli for Mesoamerica, siku panpipes, charango and bombo for South America, didgeridoo drone and clapsticks for Oceania. The player streams `public/music/*.mp3` and crossfades over 3.5 s when the region under the camera changes. Regenerate with `node scripts/gen-music.mjs` (see the script header for providers and keys). To choose between takes, `scripts/score-music.py` rates each one with Meta’s Audiobox Aesthetics model; keep the higher “content enjoyment”. The procedural Web Audio score remains only as a fallback for builds without tracks. |
| **Bilingual** | English / 简体中文 (`?lang=zh`). |
| **Deep links** | `?year=1453&place=place-istanbul`, `?person=person-ibn-battuta`, `?event=…`, `?polity=…` |

Keys: `⌘K` or `/` search · `Space` play · `←/→` next event or journey stop (`Shift` ±10 years) · `Esc` close.

## Data & authenticity

| Layer | Source | License |
| --- | --- | --- |
| World borders, 38 snapshots 1 CE → 2010 | [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) | GPL-3.0 |
| China & neighbours: polity outlines, dynasties, events, journeys, place genealogy | [DeanChensj/jiangshan-map](https://github.com/DeanChensj/jiangshan-map) (prefecture layer **not** used: CHGIS terms forbid redistribution) | GPL-3.0 |
| Dates, coordinates, labels, portraits | [Wikidata](https://www.wikidata.org) | CC0 |
| Images | Wikimedia Commons, hot-linked thumbnails, with author and license under each image | per file |
| Earth textures | NASA Blue Marble / topography via three-globe's examples | public domain |

Every curated record carries its **Wikidata QID**, at least two **sources** (one non-Wikipedia
where possible) and a **confidence** level. The build diffs each curated year and coordinate
against Wikidata and writes one report per dataset to [`data/verification/auto-diff/`](data/verification/auto-diff/).
Verifiers resolve every difference against a second independent source in
`data/verification/resolutions.json`. Known source errors in the border layer are fixed in
`data/borders/corrections.json`, and the China area of every snapshot is replaced by
jiangshan-map's outlines (historical-basemaps' 1400 snapshot, for example, still shows a Yuan
"Great Khanate" over China, 32 years after the Ming took over).

Borders are schematic reconstructions, not surveyed boundaries.

## Develop

```bash
npm install
npm run dev                         # http://localhost:5173
```

Data pipeline. The Wikidata/Commons caches (`data/cache/<dataset>/`) and verification reports are
committed; `public/data/atlas.json` and `stories.json` are build outputs that `npm run dev` and
`npm run build` regenerate from them, offline:

```bash
node scripts/wd.mjs search "Battle of Hastings"   # find a QID
node scripts/wd.mjs lookup Q83224                  # Wikidata facts for a QID
node scripts/validate-data.mjs                     # schema + cross-reference checks
node scripts/wd.mjs enrich [dataset]               # fetch Wikidata/Commons facts into data/cache/<dataset>/
node scripts/build-data.mjs                        # → public/data/{atlas,stories}.json + auto-diff reports
node scripts/build-borders.mjs <historical-basemaps>/geojson <jiangshan-map>   # → public/data/borders
npm run shots                                      # Playwright smoke test + screenshots
```

Curated data lives in `data/<dataset>/{events,people,places,polities}.json`; see
[`data/SCHEMA.md`](data/SCHEMA.md). The project plan is in [`docs/PLAN.md`](docs/PLAN.md).

## License

Open source under GPL-3.0; the full text is in [`LICENSE`](LICENSE). The project is GPL-3.0 because it adapts GPL-3.0 data from historical-basemaps and jiangshan-map. When reusing maps
or screenshots, credit Orbis, [jiangshan-map](https://github.com/DeanChensj/jiangshan-map) and
[historical-basemaps](https://github.com/aourednik/historical-basemaps).
