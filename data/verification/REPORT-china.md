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

## 2026-11 review

Independent reviewer (separate from the curator and from the earlier verifier). Scope: the 2026-11 expansion on `data/china` (126 new records, 70 new stories on existing events, 3 changed records).

### What was checked
- **All 70 fork-written stories on existing events**, line by line (en and zh): dates, numbers (army sizes, death tolls, distances), names, causality, and legend vs history (e.g. 演义 vs 正史 at Red Cliffs and the Northern Expeditions). Checked against the dynastic histories as I know them (《后汉书》《三国志》及裴注、《晋书》《资治通鉴》《旧唐书》《宋史》《明史》《清史稿》) and the standard en/zh reference articles; disputed points (Zhang Shun and Zhang Gui, the Li–Lobanov treaty, Helian Ding, the ROC retreat) were looked up on the web.
- **All 126 new records** (100%, above the 30% target) at summary level, with every ruler reign (17 polities), every journey stop (37 people), every name range (13 places), and the routes of the Long March, Ban Chao, the Sino-French War and the 1937–45 war. All 25 new-event and 8 new-person stories were read in both languages, with particular care for the Great Leap famine, the Cultural Revolution, 1989, 228, the ROC retreat, martial law and the 1996 election: the wording is factual, sourced and neutral in both languages, and the estimates are given as ranges.
- **zh quality:** a script listed every CJK character outside GB2312. All 46 hits are legitimate rare name characters in standard simplified use (儁 朱儁, 縯 刘縯, 濬 王濬, 綎 刘綎, 訢 奕訢, 澂 瑞澂, 鋹 刘鋹, etc.). There are no traditional characters. Lunar months written in Chinese numerals but holding Gregorian values were changed to Arabic numerals (see below).
- **Cross-dataset duplicates:** the QIDs were compared with every other dataset on this branch and on the other `origin/data/*` branches. None found.

### Corrections (old → new, reason)
| Record | Field | Old → New | Reason / source |
| --- | --- | --- | --- |
| ev-battle-of-kunyang | story.en | Wang Yi/Xun "his cousins" → "his generals"; "Thousands drowned" → "Tens of thousands" | Not cousins; 《后汉书·光武帝纪》"溺死者以万数" |
| ev-conquest-of-shu-by-wei | story en/zh | Deng Ai "a few thousand men / 数千人" → "a picked force / 精兵" | The Sanguozhi gives no figure for the Yinping force |
| ev-conquest-of-wu-by-jin | story.zh | 吴彦 → 吾彦 | 《晋书·王濬传》: the Jianping governor was 吾彦 |
| ev-founding-of-tang | story.en | "defeated Xue Ju" → "crushed the Xue family's state" | Li Shimin lost to Xue Ju in 618 and then beat his son Xue Rengao |
| ev-tang-conquest-of-eastern-turks | story en/zh | "weeks after the Xuanwu Gate coup" → "less than three weeks after Taizong's accession" | Coup on 2 Jul 626, accession on 4 Sep, Illig at the Wei bridge on 23 Sep (《资治通鉴》卷191) |
| ev-wu-zetian-proclaims-zhou | story en/zh | Zhongzong deposed "within weeks / 一个多月" → "within two months / 次年二月"; Luoyang named Divine Capital "in 690" → "in 684"; 曌 coined "the year before" | Gaozong died Dec 683 and Zhongzong was deposed Feb 684; 神都 dates from 光宅元年 (684); 曌 from 载初元年 (689) |
| ev-huang-chao-rebellion | story.zh | 881年正月 → 881年1月（广明元年十二月） | Chang'an fell in the lunar 12th month, not the 1st |
| ev-cession-of-sixteen-prefectures | story.en | son-in-law of "the Later Tang founder" → "the Later Tang emperor Mingzong" | The founder was Zhuangzong (zh already said 明宗) |
| ev-chenqiao-mutiny | story en/zh | the army left "that night" → "two days later" / 初三 | The alarm came on the 1st and the army marched on the 3rd; the mutiny was at dawn on the 4th |
| ev-wang-anshi-new-policies | story en/zh | "a chief minister" → vice chief councillor, chief councillor the next year; 三司条例司 → 制置三司条例司 | 参知政事 in 1069, 同平章事 in 1070 (《宋史·王安石传》) |
| ev-jingkang-incident | story.zh | 1127年六月 → 1127年6月 | Zhao Gou was enthroned on 建炎元年五月初一 (lunar), i.e. 12 June |
| ev-treaty-of-shaoxing | story en/zh | iron figures of "Qin Hui and his wife" → four figures (with 万俟卨 and 张俊) | Yue Fei temple, Hangzhou |
| ev-battle-of-xiangyang | story en/zh | "the brothers Zhang Shun and Zhang Gui / 张顺、张贵兄弟" → "militia leaders" | 《宋史·忠义传》 calls them 民兵部辖 and gives no kinship; "brothers" reflects the Water Margin |
| ev-yuan-dynasty-proclaimed | story.en | Kaidu "his cousin" → "his kinsman, a grandson of Ögedei" | Kaidu was Kublai's first cousin once removed (zh 堂侄 was already right) |
| ev-battle-of-lake-poyang | story.zh | 八月底 / 十月初 → 8月底 / 10月初 | These are Gregorian dates; the lunar months were 七月 / 八月 |
| ev-founding-of-ming | story en/zh | "his parents and brothers" → "parents and eldest brother" | 《明史·太祖本纪》: his father, mother and eldest brother died in 1344 |
| ev-battle-of-sarhu | story en/zh | 四月中旬 → 4月中旬; "the Manchus / 满洲" → Later Jin (后金) | Lunar 三月初; the name Manchu dates only from 1635 |
| ev-revolt-of-three-feudatories | story.en | "proclaiming a new Zhou dynasty" (1673) → "soon styling himself King of Zhou" | He took the imperial title only in 1678 (the zh already said 周王) |
| ev-first-opium-war | story.zh | Nemesis 铁甲蒸汽舰 → 铁壳蒸汽舰 | The ship was iron-hulled, not an armoured ironclad |
| ev-treaty-of-nanjing | story en/zh | "Asia's greatest port / 亚洲第一大港" → "one of Asia's greatest ports" | Overstatement |
| ev-first-sino-japanese-war | story.zh | 日本暴徒 → 日本刺客小山丰太郎 | More precise and neutral |
| ev-wuchang-uprising | story en/zh | "six weeks" → "seven weeks"; 台湾的"国庆日" → 至今在台湾作为国庆日纪念 | Sichuan declared on 27 Nov; the zh used scare quotes |
| ev-huaihai-campaign | story.en | "along the Huai River plain" → "on the plains north of the Huai River" | Matches the zh and the geography |
| ev-reform-and-opening-up | story.zh | 当年粮食大幅增产 → 次年 | The Xiaogang pact was signed in Nov 1978; the bumper harvest came in 1979 |
| ev-dream-pool-essays | story en/zh | Shen Kuo "coined the term shiyou" → "described the 'rock oil' and predicted it would be widely used" (此物后必大行于世) | The coinage claim is unsafe; the prediction is in the text |
| person-li-hongzhang | stop 1896 | St Petersburg → Moscow (55.75, 37.62) | The Li–Lobanov treaty was signed in Moscow on 3 Jun 1896, at Nicholas II's coronation |
| person-qi-jiguang | stop 1559 | 29.87, 121.55 (Ningbo) → 29.31, 120.07 (Yiwu) | The label says Yiwu |
| person-liang-qichao | stop 1898 | 横滨创办《新民丛报》 → 《清议报》 | Qingyi bao 1898; Xinmin congbao 1902 |
| polity-hu-xia | summary | "destroyed by Northern Wei in 427–431" → Tongwan lost in 427; in 431 the Tuyuhun captured Helian Ding and handed him to Wei | 《魏书》; en Wikipedia: Helian Ding |
| polity-later-jin-manchu | summary | Manchu name "1636" → 1635 (state Qing 1636) | 天聪九年 (1635) decree |
| polity-cheng-han | summary | "the first of the Sixteen Kingdoms" → "with Liu Yuan's Han the first, both in 304" | Both states were founded in 304 |
| ev-roc-retreat-to-taiwan | summary.en | "divided two Chinese states" → "the two sides have been governed separately ever since" | Neutral wording, matching the zh 两岸分治 |

### QIDs (13 events lacked one)
Searched again with `wd.mjs search` (en and zh) and through zh.wikipedia pageprops:
- **Added:**
  - ev-sui-conquest-of-chen → Q15897055 (隋灭陈之战)
  - ev-mongol-conquest-of-dali → Q11660013 (蒙古灭大理之战)
  - ev-roc-retreat-to-taiwan → Q16165653
  - ev-yuan-dynasty-proclaimed (an older record) → Q60990943 (建国号诏, the edict itself); its note was updated.
- **Still none:**
  - Wang Mang founds Xin, Ban Chao, Northern Wei unifies the north, Tibetan capture of Chang'an, Zhu Wen ends Tang, Abaoji, Bi Sheng, Aguda, Ricci in Beijing and abolition of the exams have no item of their own.
  - China joins the WTO was left without one: Q5099981 ("China and the WTO") is a topic item, not the event.
- The new ROC-retreat coordinate diff is resolved keep-ours (Taipei vs the island centroid).

### Added
- Stories for Chang'an/Xi'an, Kaifeng, Nanjing and Beijing (places), and for Tang, Northern Song, Ming and Qing (polities). These are the first place and polity stories in the dataset.

### Left for a human
- Yan Zhenqing's death: kept as 785 (Wikidata, Britannica); the 旧唐书 gives 兴元元年 (784).
- Kaidu, Qiu Jin's "cousin" Xu Xilin (表兄), and Kumārajīva's dates follow common usage; specialists may differ.
- Tiananmen, the famine and the Cultural Revolution give death tolls as ranges with named sources. A reader from either side may want different emphasis, but the facts are as stated.

## 2026-11 audit (web-sourced)

Independent audit using only pages retrieved during the audit (WebFetch/WebSearch); nothing checked from memory.

- **Seed:** 20261113 (mulberry32 shuffle of the 204 records added or changed against `origin/feat/world-regions`, sorted by id; first 8 records with new stories taken, then filled in shuffle order).
- **Sample (20, 12 with stories):** listed below with the source used.

| Record | Source(s) retrieved | Result |
|---|---|---|
| ev-cession-of-sixteen-prefectures (story) | en.wikipedia Sixteen Prefectures; zh web search (帛三十万匹, 小十岁) | OK |
| ev-battle-of-shanhai-pass (story) | en.wikipedia Battle of Shanhai Pass; zh.wikipedia 山海关之战 (6 June entry) | OK |
| ev-1931-china-floods (story) | en.wikipedia 1931 China floods | **Fixed**: story said "official counts were around 400,000"; the official report gave 140,000 drowned / 2 million total, Buck's survey 150,000 drowned, Chinese historians ~422,000, Western estimates to 3.7–4 million |
| person-lu-xun (story) | en.wikipedia Lu Xun | OK |
| ev-aguda-founds-jin (story) | en.wikipedia Emperor Taizu of Jin; zh.wikipedia 金太祖 (会宁, 2,500 men, 1123) | OK (Hubudagang month not settled by sources; "that winter" kept) |
| ev-sui-grand-canal (story) | en.wikipedia Grand Canal; zh search on 隋书 大业元年/四年 (男女百余万) | OK |
| ev-destruction-of-opium-at-humen (story) | en.wikipedia Destruction of opium at Humen; zh search (湖广总督, 6月3日, 23天) | OK |
| ev-treaty-of-chanyuan (story) | en.wikipedia Chanyuan Treaty | OK |
| polity-northern-han | zh.wikipedia 北汉 | **Fixed**: ruler list skipped Liu Ji'en (968) |
| person-wen-tianxiang | zh.wikipedia 文天祥 | OK |
| ev-battle-of-yancheng | (covered with Yue Fei sources in the review; dates consistent with zh search) | OK |
| place-fuzhou | en.wikipedia Fu Prefecture (Fujian); zh search (开元十三年) | **Fixed**: "Changle Prefecture" was dated 909–945; it was the name 933–948. Now Fuzhou (Min capital) 909–933, Changle 933–948, Fuzhou from 948 |
| ev-228-incident (story) | en.wikipedia February 28 incident | OK |
| polity-qing (story) | wd.mjs search (Q333178); en.wikipedia Jiaqing Emperor (search snippet) | **Fixed**: ruler list jumped from Qianlong (to 1796) to Daoguang (from 1820); Jiaqing Emperor 1796–1820 added |
| person-kumarajiva | en.wikipedia Kumārajīva | OK (en gives capture c. 386; 384 kept, matching the zh tradition and the note) |
| polity-later-jin-manchu | as for polity-qing / Sarhu sources | OK |
| ev-siege-of-diaoyucheng (story) | en.wikipedia Siege of Diaoyu Castle; zh search (免遭屠城) | OK |
| ev-tiananmen-1989 (story) | en.wikipedia 1989 Tiananmen protests; web search on the Sino-Soviet summit and Zhao's 19 May visit | OK |
| person-bai-juyi | en.wikipedia Bai Juyi | OK |
| ev-mawei-incident | zh.wikipedia 马嵬驿之变 | OK |

**zh text:** read in full for every sampled record; no mistranslation or register problem found beyond the two fixed passages.

**Error rate:** 4 of 20 records (20%) needed a fix; 2 were factual errors (1931 toll, Fuzhou dates) and 2 were omissions in ruler lists. No systematic pattern; the stories themselves held up well.
