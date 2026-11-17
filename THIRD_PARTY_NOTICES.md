# Third-party notices

Orbis's own code and content are proprietary (see `LICENSE`). The material below comes from
third parties and stays under its original license. Keep these credits, and the license terms,
wherever the material (or anything built from it) is shipped, including the public website.

## GPL-3.0 data

Full license text: [`LICENSES/GPL-3.0.txt`](LICENSES/GPL-3.0.txt).

| Material | Source | Files in this repo |
| --- | --- | --- |
| World border snapshots, 1 CE → 2010 | [aourednik/historical-basemaps](https://github.com/aourednik/historical-basemaps) | `public/data/borders/*.topo.json` (built by `scripts/build-borders.mjs`), `data/borders/corrections.json`, `data/borders/polity-names.json` |
| China & neighbours: polity outlines, dynasties, events, journeys, place genealogy | [DeanChensj/jiangshan-map](https://github.com/DeanChensj/jiangshan-map) (its CHGIS-derived prefecture layer is **not** used) | China outlines inside `public/data/borders/*.topo.json`, `data/china/*.json`, and the records built from them in `public/data/atlas.json` / `stories.json` |

These files are modified versions of the originals (simplified, merged, corrected and translated).
Anyone who receives them, for example by loading the website, may use them under GPL-3.0.
Their corresponding source (the files listed above plus `scripts/build-borders.mjs`) is
available on request.

## Other sources

| Material | Source | License |
| --- | --- | --- |
| Dates, coordinates, labels, portrait references | [Wikidata](https://www.wikidata.org) | CC0 |
| Images (hot-linked thumbnails) | [Wikimedia Commons](https://commons.wikimedia.org) | per file; author and license shown under each image |
| Earth textures | NASA Blue Marble / topography via three-globe's examples | public domain |
| npm dependencies | see `package-lock.json` | each package's own license |
