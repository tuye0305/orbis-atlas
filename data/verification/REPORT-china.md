# Verification report: China (`data/china/`)

Verifier: independent fact-checker agent (separate from the curator).
Scope: 88 events, 26 people, 26 places, 45 polities.

- All 545 QID references in China and Japan/Korea (records and rulers) were re-fetched with `node scripts/wd.mjs lookup`.
- `node scripts/validate-data.mjs china` reports 0 errors. The 7 "no qid" warnings are intentional: these are founding events whose dynasty QIDs were removed.
- Britannica blocks direct fetches (HTTP 403), so Britannica facts come from search snippets of the named articles.
- Other checks used the dynastic histories as cited in the zh and en Wikipedia articles, and Wikidata.

## Auto-diff resolutions (27): `resolutions/china.json`

| Verdict | Count | Keys |
| --- | --- | --- |
| keep-ours | 26 | 22 event coordinates; years for the Three Feudatories (1673) and the Northern Expedition (1926); Eastern Wu from 222; Liang to 557 |
| disputed | 1 | person-wang-xizhi:born (303 vs 321; the record is already medium confidence with a note) |
| fix | 0 | none |

Most coordinate diffs come from Wikidata placeholders: either the China centroid (35.84 N 103.45 E) or a rounded point. In every case the curated point is the historical site.

## Fixes made

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-founding-of-sui / -tang / -western-xia, ev-yuan-dynasty-proclaimed, ev-founding-of-ming, ev-wu-zetian-proclaims-zhou | qid | Q7405 / Q9683 / Q7427 / Q7313 / Q9903 / Q835435 (state items duplicated from polity-*) → removed; note added; topical image kept | Wikidata search found no founding-event items |
| ev-princess-wencheng-to-tibet | qid | Q256555 (the princess) → removed; image kept | Wikidata search |
| ev-ming-capital-moves-to-beijing | qid | Q80290 (Forbidden City) → Q11087884 (zhwiki 永乐迁都) | wd.mjs search |
| ev-chenqiao-mutiny | date | 0960-02-08 → 0960-02-03 (Xiande 7/1/4, Julian; the dataset uses Julian before 1582) | zh.wikipedia 陈桥兵变 |
| ev-founding-of-ming | summary.en | "that summer" → "in September" (Dadu fell in Sept 1368) | 《明史·太祖本纪》 |
| ev-tang-conquest-of-eastern-turks | summary en/zh | Li Jing "captured Illig" → Illig "captured soon after" while fleeing | 《旧唐书·李靖传》, 《资治通鉴》卷193 |
| person-xuanzang | stop 645 | [34.05, 109.35] → [34.26, 108.94] (Chang'an) | — |
| person-sun-quan | stop 219 | [29.82, 113.45] → [30.35, 112.19] Jiangling | 《三国志·吴主传》 |
| person-liu-bei | stop year | Xuzhou 196 → 194 | 《三国志·先主传》 |
| person-wang-yangming | stop 1492 label | removed "passing the metropolitan exam"; jinshi noted as 1499 | 《王阳明年谱》 |
| person-emperor-guangwu | note, confidence | the note said Wikidata gives 5 CE, but it now gives −5; note corrected; medium → high | Hou Han shu 1; Wikidata Q7268 |
| polity-eastern-wu | note | "following Wikidata" → "following Britannica / jiangshan-map (Wikidata uses 229)" | Wikidata Q274488 |
| place-xian | names 1279–1369 | Fengyuan → "Anxi / Fengyuan 安西路 / 奉元路" (Fengyuan from 1312) | 《元史·地理志》 |

## Curator-flagged items

- **Dynasty QIDs on founding events:** removed, since no event items exist.
- **Wencheng marriage:** QID removed.
- **Move to Beijing:** re-pointed to Q11087884.
- **Guangwu born −5:** correct (15 Jan 5 BCE). Wikidata has since been corrected.

## Spot-checks

| # | Record | Checked | Result |
| --- | --- | --- | --- |
| 1 | all China QIDs incl. rulers | label match | ✓ except the fixes above |
| 2 | ev-an-lushan-rebellion | 755-12-16 | ✓ |
| 3 | ev-xuanwu-gate-incident | 626-07-02 | ✓ |
| 4 | ev-battle-of-fei-river | 383-11-30 | ✓ |
| 5 | ev-battle-of-yamen | 1279-03-19 | ✓ |
| 6 | ev-tumu-crisis | 1449-09-01 | ✓ |
| 7 | ev-chenqiao-mutiny | date | fixed |
| 8 | ev-founding-of-ming | summary | fixed |
| 9 | ev-tang-conquest-of-eastern-turks | summary | fixed |
| 10 | ev-yongle-encyclopedia | 22,877 juan, ~4% survives | ✓ |
| 11 | ev-huichang-persecution | 4,600 / 260,000 | ✓ |
| 12 | ev-treaty-of-nerchinsk | 1689-09-07 | ✓ |
| 13 | ev-destruction-of-opium-at-humen | 20,000+ chests, 23 days | ✓ |
| 14 | ev-zizhi-tongjian-completed | 294 juan, 403 BCE–959 | ✓ |
| 15 | ev-battle-of-shanhai-pass | 1644-05-27 | ✓ |
| 16 | ev-founding-of-ccp / ev-founding-of-prc | dates | ✓ |
| 17 | person-xuanzang | 12 stops | fixed |
| 18 | person-sun-quan | 8 stops | fixed |
| 19 | person-liu-bei | 10 stops | fixed |
| 20 | person-wang-yangming | 10 stops | fixed |
| 21 | person-su-shi | 12 stops | ✓ |
| 22 | person-zheng-he | 9 stops | ✓ |
| 23 | person-kangxi-emperor | 7 stops | ✓ |
| 24 | person-zhuge-liang | 11 stops | ✓ |
| 25 | person-emperor-guangwu | born, stops | ✓ (note fixed) |
| 26 | place-beijing | 15 ranges, capital flags | ✓ |
| 27 | place-nanjing | 16 ranges | ✓ (Jiqing strictly from 1329; left as is) |
| 28 | place-xian | 11 ranges | fixed |
| 29 | place-kaifeng | 10 ranges | ✓ |
| 30 | place-luoyang | 16 ranges | ✓ (Shendu name from 684; minor) |
| 31 | place-lhasa / place-shenyang / place-suzhou | ranges | ✓ |
| 32 | polity-tang rulers | reigns | ✓ |
| 33 | polity-ming rulers | reigns | ✓ |
| 34 | polity-qing rulers | reigns | ✓ |
| 35 | polity-eastern-han / polity-northern-song / polity-southern-song | reigns | ✓ |
| 36 | polity-liao / polity-jin-jurchen / polity-yuan | reigns | ✓ |
| 37 | zh terminology, 40 summaries | Simplified Chinese terms | ✓ |

## Notes left for curators

- **Borderline QIDs left as they are:**
  - Sixteen Prefectures (a region)
  - White Horse Temple
  - Lantingji Xu (the preface)
  - 孝文帝改革 (the reforms)
  - Guiyi circuit
- **Long March:** en says ~10,000 km and zh says 二万五千里; both are conventional figures.
- **Treaty of Shaoxing:** the marker is symbolic, near the Huai boundary.
- **Southern Tang end:** 976 in the polity record vs 975 in place-nanjing; the polity note explains the difference.
