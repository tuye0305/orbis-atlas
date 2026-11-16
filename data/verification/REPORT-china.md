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

## 2026-11 expansion

Added 59 events, 37 people, 13 places and 17 polities, plus 103 stories (95 events, 8 people). Every event of importance 4 or 5 now has a story: 70 of these were existing records, 25 are new. The Long March (`ev-long-march`) also gained an 11-stop route.

### Auto-diff
The build flagged 12 new differences. Each was checked against a second source and recorded in `resolutions/china.json`. Result: 0 open.
- **keep-ours (9):**
  - Coordinates where Wikidata uses a country or island centroid, or a museum location: Sino-French War, Second Sino-Japanese War, 228 Incident, Qingming scroll.
  - Coordinates where Wikidata's point is rounded: Yancheng, Jao Modo.
  - White Lotus: 1796, following Britannica and Encyclopedia.com.
  - Rites controversy: the record covers 1704–1742; a note was added for the 1645 start.
  - Cai Lun: born 62?, following Britannica.
  - `polity-roc-taiwan`: starts in 1949 by design.
- **disputed (2):** Qingming scroll date (Huizong-era dating vs Wikidata's 1085) and Cao Xueqin's birth year (1715 vs 1724). Both records carry medium or low confidence and a note.

### Spot-check (29 of 126 new records, 23%)
| # | Record | Checked | Result |
| --- | --- | --- | --- |
| 1 | person-cai-lun | dates (Britannica: 62?–121; entered palace 75; paper c. 105) | ✓ |
| 2 | person-cao-xueqin | dates (Britannica: 1715?–1763) | ✓, confidence low |
| 3 | ev-white-lotus-rebellion | 1796–1804, Hubei–Sichuan–Shaanxi highlands | ✓ |
| 4 | ev-battle-of-penghu | Shi Lang's ~300 ships and 20,000 men | ✓. Story's "nearly 200 Zheng ships lost" not confirmed, so **reworded** |
| 5 | ev-tangshan-earthquake-1976 | ~85% of buildings collapsed; 242,769 official dead | ✓. The claim that ~10,000 miners were underground conflicts between sources, so **reworded** |
| 6 | place-yinchuan | Xingzhou 1020; name Yinchuan | **fixed**: named 1944, city 1945 (was 1945 for both) |
| 7 | person-zu-chongzhi | Nanxu post; Daming calendar 462 | **fixed**: Nanxu stop 459 → 461; note added that the Lou county year is approximate |
| 8 | ev-zu-chongzhi-daming-calendar | 462 (大明六年) | ✓ |
| 9 | ev-ming-great-wall | Yu Zijun's Yansui wall completed 1474 (Qingshuiying to Huamachi) | ✓. Length and labour figures follow 《明史·余子俊传》 |
| 10 | ev-bi-sheng-movable-type | Mengxi bitan is the only source; Bi Sheng was a commoner | ✓. Yingshan tomb identification kept as "debated" |
| 11 | place-tianjin | Zhigu (early 13th c.), Tianjin Wei 1404, zhou 1725, fu 1731 | ✓. 1316 Haijin not independently confirmed (Yuan shi) |
| 12 | place-shanghai | Shanghai town 1267, county 1292 (some say 1291) | ✓ |
| 13 | ev-ricci-in-beijing | arrival 24 Jan 1601; clocks and a keyboard instrument | ✓. Ricci never met Wanli in person; summary says "presented" (sent) |
| 14–25 | the 12 diff records above | second sources listed in the resolutions file | see the Auto-diff section |
| 26 | person-qiu-jin | Xu Xilin killed Enming 6 Jul 1907; Qiu Jin executed 15 Jul 1907 at Xuanting Kou | ✓ |
| 27 | person-cixi | Guangxu died 14 Nov 1908 of arsenic poisoning (2008 tests); Cixi died 15 Nov | ✓ |
| 28 | person-koxinga | Coyett surrendered 1 Feb 1662; Koxinga died June 1662 | ✓ |
| 29 | polity-roc-taiwan | presidents and terms, 1950–2024 | ✓ |

Fork-written stories for existing events: the claims their drafters flagged were checked against the sources' own figures:
- **Fei River:** the Jin shu gives 600,000 infantry and 270,000 cavalry.
- **Caizhou:** fell on 端平元年正月, i.e. February 1234.
- **Zhao Bing:** born 1272.
- **1931 floods:** about 180,000 km² flooded.

All of these are consistent with the stories as written.

### Open issues
- **Events without a QID:** 13 new events have no matching Wikidata item. Examples are Sui conquest of Chen, Zhu Wen ends the Tang, Bi Sheng's movable type, Aguda founds the Jin and China joins the WTO.
- **Possible overlaps:** `person-koxinga` (born in Hirado) and `person-kumarajiva` (born in Kucha) may also interest the japan-korea and central-asia curators. Other datasets should link to these ids rather than duplicate them.
