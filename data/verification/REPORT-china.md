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
| ev-battle-of-yancheng | en.wikipedia Battle of Yancheng (search snippet: 1140 win, then Yingchang); web search on the twelve gold tablets recall | OK |
| place-fuzhou | en.wikipedia Fu Prefecture (Fujian); zh search (开元十三年) | **Fixed**: "Changle Prefecture" was dated 909–945; it was the name 933–948. Now Fuzhou (Min capital) 909–933, Changle 933–948, Fuzhou from 948 |
| ev-228-incident (story) | en.wikipedia February 28 incident | OK |
| polity-qing (story) | wd.mjs search (Q333178); en.wikipedia Jiaqing Emperor (search snippet) | **Fixed**: ruler list jumped from Qianlong (to 1796) to Daoguang (from 1820); Jiaqing Emperor 1796–1820 added |
| person-kumarajiva | en.wikipedia Kumārajīva | OK (en gives capture c. 386; 384 kept, matching the zh tradition and the note) |
| polity-later-jin-manchu | en.wikipedia Later Jin (1616–1636) via search (Hetu Ala, Dongjing/Liaoyang, Mukden; Manchu after 1635) | OK |
| ev-siege-of-diaoyucheng (story) | en.wikipedia Siege of Diaoyu Castle; zh search (免遭屠城) | OK |
| ev-tiananmen-1989 (story) | en.wikipedia 1989 Tiananmen protests; web search on the Sino-Soviet summit and Zhao's 19 May visit | OK |
| person-bai-juyi | en.wikipedia Bai Juyi | OK |
| ev-mawei-incident | zh.wikipedia 马嵬驿之变 | OK |

**zh text:** read in full for every sampled record; no mistranslation or register problem found beyond the two fixed passages.

**Error rate:** 4 of 20 records (20%) needed a fix; 2 were factual errors (1931 toll, Fuzhou dates) and 2 were omissions in ruler lists. No systematic pattern; the stories themselves held up well.

## 2026-11 story verification (web-sourced)

Every record with a `story` (111) was re-checked claim by claim — dates, numbers, names, places, who did what, and causality — against pages retrieved during this pass with WebSearch/WebFetch (zh/en Wikipedia, zh.wikisource 正史 chapters, Britannica, museum, university, government and news pages; Baidu Baike only as a pointer). Nothing was confirmed from memory. The zh text was read in full for accuracy, idiom and consistency with the en; legend was checked against 正史. All 62 polity ruler lists were checked against zh/en Wikipedia ruler tables and every ruler QID against Wikidata sitelinks.

- **Stories:** 111 checked; 44 needed a fix (40%), plus one summary (ev-long-march, zh distance not matching the en). 92 text edits in all (en and zh counted separately).
- **Error rate:** 40 of the 111 stories (36%) had a factual error (wrong date, number, age, person, place, sequence or source attribution, or legend told as fact); 4 more had only a zh slip (a lunar-looking month for a Gregorian date, or zh not updated after an earlier en fix). Most errors are small details inside otherwise sound stories; none changed the main event.
- **Ruler lists:** 62 checked; 3 fixed (two missing Han-Zhao rulers, one wrong Min accession year, one missing QID).
- **Kinds of error:** wrong ages (Western vs 虚岁: Sui, Chenqiao, Tumu, Penghu, Hundred Days), wrong attributions to a source (Lake Poyang, Hua Tuo, Aguda), unflagged legend or embellishment (Mogao, Yang Huimin, Guandu, Xiaoting, 1556 earthquake), wrong sequence or dates (Diaoyucheng, Red Turbans, 1931 floods, Great Famine, Qiu Jin, Taiwan 1995–96), overstated claims (Sixteen Prefectures, Yuan name, Great Wall), wrong places (Sui conquest of Chen crossings, Ming timber), and zh date-convention slips (lunar-looking months for Gregorian dates).
- **Ages:** the dataset now gives Western (周岁) ages in both languages.

### Stories checked

| Record | Sources retrieved | Result |
|---|---|---|
| ev-battle-of-kunyang | [zh.wikisource 后汉书 卷1上 光武帝纪](https://zh.wikisource.org/zh-hans/後漢書/卷1上); [zh.wikipedia 昆阳之战](https://zh.wikipedia.org/zh-cn/昆阳之战); [en.wikipedia Battle of Kunyang](https://en.wikipedia.org/wiki/Battle_of_Kunyang); [zh.wikipedia 王莽](https://zh.wikipedia.org/zh-cn/王莽) | OK |
| ev-yellow-turban-rebellion | [zh.wikisource 后汉书 卷71 皇甫嵩传](https://zh.wikisource.org/zh-hans/後漢書/卷71); [zh.wikipedia 黄巾之乱](https://zh.wikipedia.org/zh-cn/黄巾之乱); [zh.wikisource 三国志 卷01 武帝纪](https://zh.wikisource.org/zh-hans/三國志/卷01) | OK |
| ev-end-of-han | [zh.wikipedia 董卓](https://zh.wikipedia.org/zh-cn/董卓); [en.wikipedia He Jin](https://en.wikipedia.org/wiki/He_Jin); [zh.wikipedia 汉献帝](https://zh.wikipedia.org/zh-cn/汉献帝); [zh.wikisource 三国志 卷01/卷02 (为坛于繁阳)](https://zh.wikisource.org/wiki/三國志/卷02) | **fixed** |
| ev-battle-of-guandu | [zh.wikisource 三国志 卷01 武帝纪 (+裴注)](https://zh.wikisource.org/zh-hans/三國志/卷01); [zh.wikisource 后汉书 卷74上 袁绍传](https://zh.wikisource.org/zh-hans/後漢書/卷74上) | **fixed** |
| ev-battle-of-red-cliffs | [zh.wikisource 三国志 卷54 周瑜传 (+江表传)](https://zh.wikisource.org/zh-hans/三國志/卷54) | OK |
| ev-battle-of-xiaoting | [zh.wikisource 三国志 卷58 陆逊传](https://zh.wikisource.org/zh-hans/三國志/卷58); [zh.wikisource 三国志 卷36 张飞传/云别传](https://zh.wikisource.org/zh-hans/三國志/卷36); [zh.wikipedia 夷陵之战](https://zh.wikipedia.org/zh-cn/夷陵之战); [en.wikipedia Lu Xun](https://en.wikipedia.org/wiki/Lu_Xun_%28Three_Kingdoms%29) | **fixed** |
| ev-zhuge-liang-northern-expeditions | [zh.wikisource 三国志 卷35 诸葛亮传](https://zh.wikisource.org/zh-hans/三國志/卷35); [zh.wikipedia 诸葛亮北伐](https://zh.wikipedia.org/zh-cn/诸葛亮北伐); [晋书宣帝纪 quotation (search result, 巾帼妇人之饰)](https://m.bjnews.com.cn/detail/159479536215201.html) | OK |
| ev-conquest-of-shu-by-wei | [zh.wikisource 三国志 卷28 邓艾传/钟会传](https://zh.wikisource.org/zh-hans/三國志/卷28); [zh.wikisource 三国志 卷33 后主传 (+汉晋春秋)](https://zh.wikisource.org/zh-hans/三國志/卷33); [zh.wikipedia 魏灭蜀之战](https://zh.wikipedia.org/zh-cn/魏灭蜀之战) | **fixed** |
| ev-conquest-of-wu-by-jin | [zh.wikisource 晋书 卷42 王濬传](https://zh.wikisource.org/zh-hans/晉書/卷042); [zh.wikisource 晋书 卷3 武帝纪](https://zh.wikisource.org/zh-hans/晉書/卷003); [zh.wikipedia 晋灭吴之战](https://zh.wikipedia.org/zh-cn/晋灭吴之战) | OK |
| ev-war-of-the-eight-princes | [zh.wikisource 晋书 卷4 惠帝纪](https://zh.wikisource.org/zh-hans/晉書/卷004); [zh.wikisource 晋书 卷101 刘元海载记](https://zh.wikisource.org/zh-hans/晉書/卷101); [zh.wikipedia 刘渊](https://zh.wikipedia.org/zh-cn/刘渊) | OK |
| ev-disaster-of-yongjia | [zh.wikisource 晋书 卷5 孝怀帝纪/孝愍帝纪](https://zh.wikisource.org/zh-hans/晉書/卷005); [zh.wikipedia 永嘉之乱](https://zh.wikipedia.org/zh-cn/永嘉之乱) | OK |
| ev-battle-of-fei-river | [zh.wikipedia 淝水之战](https://zh.wikipedia.org/zh-cn/淝水之战) | OK |
| ev-xiaowen-moves-capital-to-luoyang | [zh.wikisource 魏书 卷7下 高祖纪下](https://zh.wikisource.org/zh-hans/魏書/卷7下); [zh.wikipedia 北魏孝文帝](https://zh.wikipedia.org/zh-cn/北魏孝文帝); [zh.wikipedia 孝文帝改革](https://zh.wikipedia.org/zh-cn/孝文帝改革); [zh.wikipedia 元恂](https://zh.wikipedia.org/zh-cn/元恂) | OK |
| ev-founding-of-sui | [zh.wikipedia 隋文帝](https://zh.wikipedia.org/zh-cn/隋文帝); [zh.wikipedia 北周静帝](https://zh.wikipedia.org/zh-cn/北周静帝); [en.wikipedia Emperor Jing of Northern Zhou](https://en.wikipedia.org/wiki/Emperor_Jing_of_Northern_Zhou); [en.wikipedia Emperor Wen of Sui](https://en.wikipedia.org/wiki/Emperor_Wen_of_Sui) | **fixed** |
| ev-sui-grand-canal | [zh.wikisource 资治通鉴卷180](https://zh.wikisource.org/zh-hans/資治通鑑/卷180); [zh.wikisource 资治通鉴卷181](https://zh.wikisource.org/wiki/資治通鑑/卷181); [zh.wikipedia 隋唐大运河](https://zh.wikipedia.org/zh-cn/隋唐大运河); [search: 隋书 炀帝纪 河北诸郡男女百余万 (secondary citations)](https://zzwb.zynews.cn/page/2/2012-02/10/A32/20120210A32_pdf.PDF) | OK |
| ev-founding-of-tang | [zh.wikipedia 晋阳起兵](https://zh.wikipedia.org/zh-cn/晋阳起兵); [en.wikipedia Emperor Gaozu of Tang](https://en.wikipedia.org/wiki/Emperor_Gaozu_of_Tang); [zh.wikipedia 江都之变](https://zh.wikipedia.org/zh-cn/江都之变); [zh.wikipedia 平阳昭公主](https://zh.wikipedia.org/zh-cn/平阳昭公主) | **fixed** |
| ev-xuanwu-gate-incident | [zh.wikipedia 玄武门之变](https://zh.wikipedia.org/zh-cn/玄武门之变) | OK |
| ev-tang-conquest-of-eastern-turks | [zh.wikisource 资治通鉴卷193](https://zh.wikisource.org/wiki/資治通鑑/卷193); [zh.wikipedia 唐灭东突厥之战](https://zh.wikipedia.org/zh-cn/唐灭东突厥之战); [zh.wikipedia 渭水之盟](https://zh.wikipedia.org/zh-cn/渭水之盟); [en.wikipedia Illig Qaghan](https://en.wikipedia.org/wiki/Illig_Qaghan) | **fixed** |
| ev-wu-zetian-proclaims-zhou | [zh.wikipedia 武则天](https://zh.wikipedia.org/zh-cn/武则天); [search: 光宅元年改东都为神都 / 载初 new characters](https://www.aisixiang.com/data/150330.html); [search: 宰相安得失此人 (secondary)](https://c.m.163.com/news/a/KQE63G7H0536ASC2.html) | OK |
| ev-an-lushan-rebellion | [zh.wikipedia 安史之乱](https://zh.wikipedia.org/zh-cn/安史之乱); [en.wikipedia An Lushan](https://en.wikipedia.org/wiki/An_Lushan); [en.wikipedia Yang Guifei](https://en.wikipedia.org/wiki/Yang_Guifei) | **fixed** |
| ev-huang-chao-rebellion | [zh.wikipedia 黄巢](https://zh.wikipedia.org/zh-cn/黄巢); [en.wikipedia Huang Chao](https://en.wikipedia.org/wiki/Huang_Chao); [en.wikipedia Guangzhou massacre](https://en.wikipedia.org/wiki/Guangzhou_massacre); [zh.wikipedia 秦妇吟](https://zh.wikipedia.org/zh-cn/秦妇吟) | OK |
| ev-cession-of-sixteen-prefectures | [zh.wikipedia 燕云十六州](https://zh.wikipedia.org/zh-cn/燕云十六州); [zh.wikipedia 石敬瑭](https://zh.wikipedia.org/zh-cn/石敬瑭); [en.wikipedia Emperor Taizong of Liao](https://en.wikipedia.org/wiki/Emperor_Taizong_of_Liao); [zh.wikipedia 李从珂](https://zh.wikipedia.org/zh-cn/李从珂) | **fixed** |
| ev-chenqiao-mutiny | [zh.wikipedia 陈桥兵变](https://zh.wikipedia.org/zh-cn/陈桥兵变); [zh.wikipedia 周恭帝](https://zh.wikipedia.org/zh-cn/周恭帝); [en.wikipedia Emperor Gong of Later Zhou](https://en.wikipedia.org/wiki/Emperor_Gong_of_Later_Zhou); [zh.wikipedia 杯酒释兵权](https://zh.wikipedia.org/zh-cn/杯酒释兵权) | **fixed** |
| ev-treaty-of-chanyuan | [zh.wikipedia 澶渊之盟](https://zh.wikipedia.org/zh-cn/澶渊之盟); [en.wikipedia Chanyuan Treaty](https://en.wikipedia.org/wiki/Chanyuan_Treaty); [zh.wikipedia 寇准](https://zh.wikipedia.org/zh-cn/寇准); [zh.wikipedia 曹利用](https://zh.wikipedia.org/zh-cn/曹利用) | OK |
| ev-wang-anshi-new-policies | [zh.wikipedia 王安石](https://zh.wikipedia.org/zh-cn/王安石); [zh.wikipedia 王安石变法](https://zh.wikipedia.org/zh-cn/王安石变法); [zh.wikipedia 郑侠](https://zh.wikipedia.org/zh-cn/郑侠) | OK |
| ev-jingkang-incident | [zh.wikipedia 靖康之变](https://zh.wikipedia.org/zh-cn/靖康之变); [en.wikipedia Emperor Huizong of Song](https://en.wikipedia.org/wiki/Emperor_Huizong_of_Song); [zh.wikipedia 燕云十六州](https://zh.wikipedia.org/zh-cn/燕云十六州) | OK |
| ev-treaty-of-shaoxing | [zh.wikipedia 绍兴和议](https://zh.wikipedia.org/zh-cn/绍兴和议); [zh.wikipedia 岳飞](https://zh.wikipedia.org/zh-cn/岳飞); [杭州新闻 岳王庙跪像](https://hznews.hangzhou.com.cn/chengshi/content/2023-01/18/content_8451418_0.htm) | OK |
| ev-fall-of-jin-at-caizhou | [zh.wikipedia 蔡州之战](https://zh.wikipedia.org/zh-cn/蔡州之战); [en.wikipedia Siege of Caizhou](https://en.wikipedia.org/wiki/Siege_of_Caizhou); [en.wikipedia Battle of Sanfengshan](https://en.wikipedia.org/wiki/Battle_of_Sanfengshan); [zh.wikipedia 端平入洛](https://zh.wikipedia.org/zh-cn/端平入洛) | OK |
| ev-siege-of-diaoyucheng | [zh.wikipedia 钓鱼城之战](https://zh.wikipedia.org/zh-cn/钓鱼城之战); [en.wikipedia Siege of Diaoyu Castle](https://en.wikipedia.org/wiki/Siege_of_Diaoyu_Castle); [en.wikipedia Möngke Khan](https://en.wikipedia.org/wiki/Möngke_Khan); [zh.wikisource 元史 卷10 世祖七 (至元十六年正月 王立以城降)](https://zh.wikisource.org/wiki/元史/卷010) | **fixed** |
| ev-battle-of-xiangyang | [zh.wikipedia 襄樊之战](https://zh.wikipedia.org/zh-cn/襄樊之战); [en.wikipedia Battle of Xiangyang](https://en.wikipedia.org/wiki/Battle_of_Xiangyang); [De Re Militari, The Mongol Siege of Xiangyang and Fan-ch'eng](https://deremilitari.org/2014/05/the-mongol-siege-of-xiangyang-and-fan-cheng-and-the-song-military/); [zh.wikisource 宋史 卷450 (张顺、张贵)](https://zh.wikisource.org/wiki/宋史/卷450) | OK |
| ev-yuan-dynasty-proclaimed | [zh.wikipedia 建国号诏](https://zh.wikipedia.org/zh-cn/建国号诏); [zh.wikipedia 元大都](https://zh.wikipedia.org/zh-cn/元大都); [en.wikipedia Yuan dynasty](https://en.wikipedia.org/wiki/Yuan_dynasty); [zh.wikipedia 金朝 (国号由来)](https://zh.wikipedia.org/zh-cn/金朝) | **fixed** |
| ev-battle-of-yamen | [zh.wikipedia 崖山海战](https://zh.wikipedia.org/zh-cn/崖山海战); [zh.wikipedia 过零丁洋](https://zh.wikipedia.org/zh-cn/过零丁洋); [澎湃 未来讲堂 文天祥《过零丁洋》](https://m.thepaper.cn/baijiahao_10151793); [中国作家网 过零丁洋](https://www.chinawriter.com.cn/n1/2020/0622/c404064-31754653.html) | **fixed** |
| ev-red-turban-rebellion | [zh.wikisource 元史 卷42 顺帝五 (至正十一年)](https://zh.wikisource.org/wiki/元史/卷042); [zh.wikipedia 红巾军起义](https://zh.wikipedia.org/zh-cn/红巾军起义); [zh.wikipedia 韩林儿](https://zh.wikipedia.org/zh-cn/韩林儿); [en.wikipedia Han Lin'er](https://en.wikipedia.org/wiki/Han_Lin'er) | **fixed** |
| ev-battle-of-lake-poyang | [zh.wikipedia 鄱阳湖之战](https://zh.wikipedia.org/zh-cn/鄱阳湖之战); [en.wikipedia Battle of Lake Poyang](https://en.wikipedia.org/wiki/Battle_of_Lake_Poyang); [zh.wikisource 明史 卷1 太祖一](https://zh.wikisource.org/wiki/明史/卷1); [zh.wikisource 明史 卷123 陈友谅传 (走马棚, 裹以铁)](https://zh.wikisource.org/zh-hans/明史/卷123) | **fixed** |
| ev-founding-of-ming | [en.wikipedia Hongwu Emperor](https://en.wikipedia.org/wiki/Hongwu_Emperor); [爱思想 黄朴民 朱升《时务对》](https://www.aisixiang.com/data/112787.html); [中研院史语所 张佳论文 (谕中原檄)](https://www1.ihp.sinica.edu.tw/storage/publish2L/92-1-3張佳.pdf) | **fixed** |
| ev-jingnan-campaign | [zh.wikipedia 靖难之变](https://zh.wikipedia.org/zh-cn/靖难之变) | OK |
| ev-zheng-he-voyages | [zh.wikisource 明史 卷304 郑和传](https://zh.wikisource.org/wiki/明史/卷304); [zh.wikipedia 郑和下西洋](https://zh.wikipedia.org/zh-cn/郑和下西洋); [Scroll.in on the 1414 Bengal giraffe](https://scroll.in/article/998301/scroll_in) | OK |
| ev-ming-capital-moves-to-beijing | [zh.wikipedia 永乐迁都](https://zh.wikipedia.org/zh-cn/永乐迁都); [zh.wikisource 明史 卷6 成祖二 (永乐四年采木)](https://zh.wikisource.org/wiki/明史/卷6); [Beijing Postcards, earthquake/1441 capital status](https://www.beijing-postcards.com/archival-materials/if-it-was-not-for-an-earthquake-the-capital-might-be-in-nanjing-today); [非遗网 临清贡砖](https://www.ihchina.cn/project_details/14447.html) | **fixed** |
| ev-tumu-crisis | [en.wikipedia Emperor Yingzong of Ming](https://en.wikipedia.org/wiki/Emperor_Yingzong_of_Ming); [en.wikipedia Tumu Crisis](https://en.wikipedia.org/wiki/Tumu_Crisis); [zh.wikipedia 土木之变](https://zh.wikipedia.org/zh-cn/土木之变); [en.wikipedia Yu Qian](https://en.wikipedia.org/wiki/Yu_Qian) | **fixed** |
| ev-battle-of-sarhu | [zh.wikipedia 萨尔浒之战](https://zh.wikipedia.org/zh-cn/萨尔浒之战); [en.wikipedia Battle of Tieling](https://en.wikipedia.org/wiki/Battle_of_Tieling); [en.wikipedia Battle of Shen-Liao](https://en.wikipedia.org/wiki/Battle_of_Shen-Liao) | OK |
| ev-battle-of-shanhai-pass | [en.wikipedia Battle of Shanhai Pass](https://en.wikipedia.org/wiki/Battle_of_Shanhai_Pass); [zh.wikipedia 山海关之战](https://zh.wikipedia.org/zh-cn/山海关之战); [zh.wikipedia 陈圆圆](https://zh.wikipedia.org/zh-cn/陈圆圆) | OK |
| ev-siege-of-fort-zeelandia | [en.wikipedia Siege of Fort Zeelandia](https://en.wikipedia.org/wiki/Siege_of_Fort_Zeelandia); [zh.wikipedia 郑成功](https://zh.wikipedia.org/zh-cn/郑成功); [search: 1661年4月30日 鹿耳门 普罗民遮城 5月4日](https://www.chinatimes.com/cn/opinion/20221204001276-262110) | **fixed** |
| ev-revolt-of-three-feudatories | [en.wikipedia Revolt of the Three Feudatories](https://en.wikipedia.org/wiki/Revolt_of_the_Three_Feudatories); [zh.wikipedia 三藩之乱](https://zh.wikipedia.org/zh-cn/三藩之乱) | **fixed** |
| ev-treaty-of-nerchinsk | [en.wikipedia Treaty of Nerchinsk](https://en.wikipedia.org/wiki/Treaty_of_Nerchinsk); [zh.wikipedia 雅克萨之战](https://zh.wikipedia.org/zh-cn/雅克萨之战); [worldjpn Nerchinsk text (27 Aug OS / 7 Sep NS)](https://worldjpn.net/documents/texts/pw/16890827.T1E.html) | OK |
| ev-destruction-of-opium-at-humen | [zh.wikipedia 虎门销烟](https://zh.wikipedia.org/zh-cn/虎门销烟); [en.wikipedia Destruction of opium at Humen](https://en.wikipedia.org/wiki/Destruction_of_opium_at_Humen) | OK |
| ev-first-opium-war | [zh.wikipedia 第一次鸦片战争](https://zh.wikipedia.org/zh-cn/第一次鸦片战争); [en.wikipedia Convention of Chuenpi](https://en.wikipedia.org/wiki/Convention_of_Chuenpi); [en.wikipedia Sanyuanli incident](https://en.wikipedia.org/wiki/Sanyuanli_incident); [en.wikipedia Battle of Chinkiang](https://en.wikipedia.org/wiki/Battle_of_Chinkiang) | OK |
| ev-treaty-of-nanjing | [en.wikipedia Treaty of Nanking](https://en.wikipedia.org/wiki/Treaty_of_Nanking); [zh.wikipedia 南京条约](https://zh.wikipedia.org/zh-cn/南京条约); [zh.wikipedia 中国近代史](https://zh.wikipedia.org/zh-cn/中国近代史) | **fixed** |
| ev-taiping-rebellion | [zh.wikipedia 洪秀全](https://zh.wikipedia.org/zh-cn/洪秀全); [en.wikipedia Taiping Rebellion](https://en.wikipedia.org/wiki/Taiping_Rebellion) | OK |
| ev-second-opium-war | [en.wikipedia Second Opium War](https://en.wikipedia.org/wiki/Second_Opium_War); [en.wikipedia Treaty of Nanking (opium legalised in Tianjin settlement)](https://en.wikipedia.org/wiki/Treaty_of_Nanking); [search: Parkes captives deaths](https://thechinaproject.com/2022/10/19/what-led-to-the-burning-of-beijings-old-summer-palace/); [en.wikipedia Zongli Yamen (via search)](https://en.wikipedia.org/wiki/Zongli_Yamen) | OK |
| ev-first-sino-japanese-war | [zh.wikipedia 甲午战争](https://zh.wikipedia.org/zh-cn/甲午战争); [en.wikipedia First Sino-Japanese War](https://en.wikipedia.org/wiki/First_Sino-Japanese_War); [zh.wikipedia 丁汝昌](https://zh.wikipedia.org/zh-cn/丁汝昌); [search: 李鸿章 遇刺 小山丰太郎 3月24日](https://www.thepaper.cn/newsDetail_forward_1309314) | OK |
| ev-boxer-rebellion | [en.wikipedia Boxer Rebellion](https://en.wikipedia.org/wiki/Boxer_Rebellion); [zh.wikipedia 庚子西狩](https://zh.wikipedia.org/zh-cn/庚子西狩) | OK |
| ev-wuchang-uprising | [zh.wikipedia 武昌起义](https://zh.wikipedia.org/zh-cn/武昌起义); [en.wikipedia Wuchang uprising](https://en.wikipedia.org/wiki/Wuchang_uprising) | **fixed** |
| ev-xinhai-revolution | [zh.wikipedia 辛亥革命](https://zh.wikipedia.org/zh-cn/辛亥革命); [en.wikipedia Xinhai Revolution](https://en.wikipedia.org/wiki/Xinhai_Revolution); [zh.wikipedia 清帝退位诏书](https://zh.wikipedia.org/zh-cn/清帝退位诏书); [en.wikipedia Articles of Favourable Treatment](https://en.wikipedia.org/wiki/Articles_of_Favourable_Treatment_of_the_Great_Qing_Emperor_after_His_Abdication) | OK |
| ev-may-fourth-movement | [zh.wikipedia 五四运动](https://zh.wikipedia.org/zh-cn/五四运动); [en.wikipedia May Fourth Movement](https://en.wikipedia.org/wiki/May_Fourth_Movement); [en.wikipedia Shandong Problem](https://en.wikipedia.org/wiki/Shandong_Problem) | OK |
| ev-founding-of-ccp | [zh.wikipedia 中国共产党第一次全国代表大会](https://zh.wikipedia.org/zh-cn/中国共产党第一次全国代表大会); [en.wikipedia 1st National Congress of the CCP](https://en.wikipedia.org/wiki/1st_National_Congress_of_the_Chinese_Communist_Party); [共产党员网 中共三大 (search result)](https://www.12371.cn/2022/06/03/ARTI1654250606197127.shtml) | OK |
| ev-northern-expedition | [zh.wikipedia 国民革命军北伐](https://zh.wikipedia.org/zh-cn/国民革命军北伐) | **fixed** |
| ev-mukden-incident | [zh.wikipedia 九一八事变](https://zh.wikipedia.org/zh-cn/九一八事变); [en.wikipedia Mukden incident](https://en.wikipedia.org/wiki/Mukden_incident) | OK |
| ev-long-march | [zh.wikipedia 长征](https://zh.wikipedia.org/zh-cn/长征); [en.wikipedia Long March](https://en.wikipedia.org/wiki/Long_March) | **fixed** |
| ev-xian-incident | [zh.wikipedia 西安事变](https://zh.wikipedia.org/zh-cn/西安事变); [search: 1936年12月4日 蒋介石从洛阳飞抵西安 (aisixiang/peopleapp results)](https://www.aisixiang.com/data/95533.html); [search: 杨虎城1949年9月6日遇害, 张学良软禁54年](https://m.thepaper.cn/baijiahao_4628622) | OK |
| ev-marco-polo-bridge-incident | [zh.wikipedia 七七事变](https://zh.wikipedia.org/zh-cn/七七事变); [search: 庐山谈话 原文 (secretchina/chinadigitaltimes reprints of 蒋中正总统集)](https://www.secretchina.com/news/gb/2015/07/19/581249.html); [en.wikipedia Second Sino-Japanese War](https://en.wikipedia.org/wiki/Second_Sino-Japanese_War) | OK |
| ev-huaihai-campaign | [zh.wikipedia 淮海战役](https://zh.wikipedia.org/zh-cn/淮海战役); [search: 陈毅 小车推出来的 (12371.cn etc.)](https://www.12371.cn/2021/11/18/ARTI1637195513839270.shtml); [search: 1949年1月21日蒋介石引退; 平津战役至1月31日 (chinadaily)](https://cn.chinadaily.com.cn/a/202103/29/WS606170c1a3101e7ce974655f.html) | OK |
| ev-founding-of-prc | [zh.wikipedia 开国大典](https://zh.wikipedia.org/zh-cn/开国大典); [en.wikipedia Proclamation of the People's Republic of China](https://en.wikipedia.org/wiki/Proclamation_of_the_People's_Republic_of_China); [search: 1949年9月27日 政协决议 北平改名北京 (12371.cn / wikisource)](https://www.12371.cn/2021/09/29/ARTI1632914599874306.shtml); [search: 1949年12月7日 国民政府宣布迁台北](https://www.twcenter.org.tw/?p=2434) | OK |
| ev-reform-and-opening-up | [zh.wikipedia 中国共产党第十一届中央委员会第三次全体会议](https://zh.wikipedia.org/zh-cn/中国共产党第十一届中央委员会第三次全体会议); [zh.wikipedia 小岗村](https://zh.wikipedia.org/zh-cn/小岗村); [en.wikipedia Xiaogang, Anhui](https://en.wikipedia.org/wiki/Xiaogang,_Anhui); [chinadaily 改革开放的一声春雷](https://cn.chinadaily.com.cn/a/202103/17/WS605198c4a3101e7ce97445b3.html) | OK |
| ev-handover-of-hong-kong | [en.wikipedia Transfer of sovereignty over Hong Kong](https://en.wikipedia.org/wiki/Transfer_of_sovereignty_over_Hong_Kong); [search results on Britannia departure in rain (SCMP, The Week, Spectator)](https://mcdn.i-scmp.com/magazines/post-magazine/short-reads/article/3268230/memories-1997-hong-kong-handover-rain-excitement-hope-sadness-and-uncertainty) | OK |
| ev-cai-lun-paper | [zh.wikisource 后汉书 卷78 蔡伦传](https://zh.wikisource.org/zh-hans/后汉书/卷78); [en.wikipedia History of paper](https://en.wikipedia.org/wiki/History_of_paper); [en.wikipedia Fangmatan](https://en.wikipedia.org/wiki/Fangmatan) | OK |
| ev-mogao-caves | [zh.wikipedia 莫高窟](https://zh.wikipedia.org/zh-cn/莫高窟); [en.wikipedia Mogao Caves](https://en.wikipedia.org/wiki/Mogao_Caves); [NTU Buddhism library: 《李君修慈悲佛龛碑》(圣历碑)](https://buddhism.lib.ntu.edu.tw/en/search/search_detail.jsp?seq=562922) | **fixed** |
| ev-dunhuang-diamond-sutra | [en.wikipedia Diamond Sutra](https://en.wikipedia.org/wiki/Diamond_Sutra); [British Library / IDP search snippets (Or.8210/P.2, 5 m scroll)](https://idp.bl.uk/exhibition/buddhism-on-the-silk-roads/articles/buddhism-on-the-ground/buddhist-texts-the-diamond-sutra); [amusingplanet: seven panels](https://www.amusingplanet.com/2019/05/the-worlds-oldest-printed-book.html) | OK |
| ev-dream-pool-essays | [en.wikipedia Shen Kuo](https://en.wikipedia.org/wiki/Shen_Kuo); [zh.wikipedia 沈括](https://zh.wikipedia.org/zh-cn/沈括); [zh.wikipedia 梦溪笔谈](https://zh.wikipedia.org/zh-cn/梦溪笔谈); [peopleapp: 此物后必大行于世](https://www.peopleapp.com/column/30051317329-500007328997) | OK |
| ev-shaanxi-earthquake-1556 | [zh.wikipedia 嘉靖大地震](https://zh.wikipedia.org/zh-cn/嘉靖大地震); [en.wikipedia 1556 Shaanxi earthquake](https://en.wikipedia.org/wiki/1556_Shaanxi_earthquake); [渭南师范学院学报 2017 明代陕西朝邑、华县地震抗震思想研究 (quotes 秦可大《地震记》)](https://html.rhhz.net/WNSFXYXB/html/3d04de00-b4e6-4935-bc26-0337bd4d3d67.htm); [The China Project: deadliest earthquake](https://thechinaproject.com/?p=260220) | **fixed** |
| ev-1931-china-floods | [en.wikipedia 1931 China floods](https://en.wikipedia.org/wiki/1931_China_floods); [zh.wikipedia 1931年中国水灾](https://zh.wikipedia.org/zh-cn/1931年中国水灾); [The China Project: great China floods of 1931 (Gaoyou night of 25 Aug)](https://thechinaproject.com/2020/08/26/the-great-china-floods-of-1931/); [disasterhistory.org Central China flood 1931](https://disasterhistory.org/central-china-flood) | **fixed** |
| ev-wang-mang-founds-xin | [zh.wikipedia 王莽](https://zh.wikipedia.org/zh-cn/王莽); [en.wikipedia Xin dynasty](https://en.wikipedia.org/wiki/Xin_dynasty); [wikisource 文献通考 卷296 (河决魏郡)](https://zh.wikisource.org/wiki/文獻通考_%28四庫全書本%29/卷296) | **fixed** |
| ev-northern-wei-unifies-north | [en.wikipedia Emperor Taiwu of Northern Wei](https://en.wikipedia.org/wiki/Emperor_Taiwu_of_Northern_Wei); [zh.wikipedia 北魏灭北凉之战](https://zh.wikipedia.org/zh-cn/北魏灭北凉之战); [zh.wikipedia 沮渠牧犍](https://zh.wikipedia.org/zh-cn/沮渠牧犍) | OK |
| ev-sui-conquest-of-chen | [zh.wikipedia 隋灭陈之战](https://zh.wikipedia.org/zh-cn/隋灭陈之战); [en.wikipedia Chen Shubao](https://en.wikipedia.org/wiki/Chen_Shubao); [wikisource 南史 卷10](https://zh.wikisource.org/zh-hans/南史/卷10) | **fixed** |
| ev-imperial-examination-instituted | [zh.wikipedia 科举](https://zh.wikipedia.org/zh-cn/科举); [aisixiang: 宋代解试、省试、殿试 (后称乡试、会试与殿试)](https://www.aisixiang.com/data/91438.html) | **fixed** |
| ev-zhu-wen-ends-tang | [zh.wikipedia 朱温](https://zh.wikipedia.org/zh-cn/朱温); [zh.wikipedia 白马驿之祸](https://zh.wikipedia.org/zh-cn/白马驿之祸); [wikisource 资治通鉴 卷264](https://zh.wikisource.org/zh-hans/資治通鑑/卷264); [en.wikipedia Emperor Ai of Tang](https://en.wikipedia.org/wiki/Emperor_Ai_of_Tang) | OK |
| ev-bi-sheng-movable-type | [wikisource 梦溪笔谈 卷18](https://zh.wikisource.org/zh-hans/夢溪筆談/卷18); [en.wikipedia Wang Zhen (inventor)](https://en.wikipedia.org/wiki/Wang_Zhen_%28inventor%29); [Guinness: first metal movable type (Goryeo 1234)](https://www.guinnessworldrecords.com/world-records/689336-first-use-of-metal-moveable-type-printing) | OK |
| ev-aguda-founds-jin | [wikisource 辽史 卷27](https://zh.wikisource.org/zh-hans/遼史/卷27); [wikisource 金史 卷2](https://zh.wikisource.org/zh-hans/金史/卷2); [wikisource 金史 卷24 地理志](https://zh.wikisource.org/zh-hans/金史/卷24); [zh.wikipedia 金太祖](https://zh.wikipedia.org/zh-cn/金太祖) | **fixed** |
| ev-mongol-conquest-of-western-xia | [en.wikipedia Mongol conquest of Western Xia](https://en.wikipedia.org/wiki/Mongol_conquest_of_Western_Xia); [zh.wikipedia 蒙古灭西夏之战](https://zh.wikipedia.org/zh-cn/蒙古灭西夏之战); [The Collector: how did Genghis Khan die](https://www.thecollector.com/how-did-genghis-khan-die/) | OK |
| ev-ming-great-wall | [zh.wikipedia 余子俊 (明史卷178)](https://zh.wikipedia.org/zh-cn/余子俊); [zh.wikisource 明史卷212 戚继光传](https://zh.wikisource.org/zh-hans/明史/卷212); [zh.wikipedia 戚继光](https://zh.wikipedia.org/zh-cn/戚继光); [zh.wikipedia 八达岭长城](https://zh.wikipedia.org/zh-cn/八达岭长城) | **fixed** |
| ev-battle-of-penghu | [zh.wikipedia 澎湖海战](https://zh.wikipedia.org/zh-cn/澎湖海战); [zh.wikipedia 施琅](https://zh.wikipedia.org/zh-cn/施琅); [en.wikipedia Shi Lang](https://en.wikipedia.org/wiki/Shi_Lang); [zh.wikipedia 郑克塽](https://zh.wikipedia.org/zh-cn/郑克塽) | **fixed** |
| ev-self-strengthening-movement | [en.wikipedia Old Summer Palace](https://en.wikipedia.org/wiki/Old_Summer_Palace); [zh.wikipedia 总理各国事务衙门](https://zh.wikipedia.org/zh-cn/总理各国事务衙门); [zh.wikipedia 安庆内军械所](https://zh.wikipedia.org/zh-cn/安庆内军械所); [zh.wikipedia 江南机器制造总局](https://zh.wikipedia.org/zh-cn/江南机器制造总局) | **fixed** |
| ev-hundred-days-reform | [en.wikipedia Hundred Days' Reform](https://en.wikipedia.org/wiki/Hundred_Days'_Reform); [zh.wikipedia 光绪帝](https://zh.wikipedia.org/zh-cn/光绪帝); [zh.wikipedia 谭嗣同](https://zh.wikipedia.org/zh-cn/谭嗣同); [zh.wikipedia 公车上书](https://zh.wikipedia.org/zh-cn/公车上书) | **fixed** |
| ev-second-sino-japanese-war | [zh.wikipedia 第二次国共合作](https://zh.wikipedia.org/zh-cn/第二次国共合作); [en.wikipedia Bombing of Chongqing](https://en.wikipedia.org/wiki/Bombing_of_Chongqing); [en.wikipedia Battle of Tai'erzhuang](https://en.wikipedia.org/wiki/Battle_of_Tai'erzhuang); [en.wikipedia 1938 Yellow River flood](https://en.wikipedia.org/wiki/1938_Yellow_River_flood) | OK |
| ev-battle-of-shanghai-1937 | [en.wikipedia Battle of Shanghai](https://en.wikipedia.org/wiki/Battle_of_Shanghai); [zh.wikipedia 淞沪会战](https://zh.wikipedia.org/zh-cn/淞沪会战); [en.wikipedia Bloody Saturday (Shanghai)](https://en.wikipedia.org/wiki/Bloody_Saturday_%28Shanghai%29); [en.wikipedia Bloody Saturday (photograph)](https://en.wikipedia.org/wiki/Bloody_Saturday_%28photograph%29) | **fixed** |
| ev-nanjing-massacre | [en.wikipedia Nanjing Massacre](https://en.wikipedia.org/wiki/Nanjing_Massacre); [en.wikipedia Nanking Safety Zone](https://en.wikipedia.org/wiki/Nanking_Safety_Zone); [zh.wikipedia 唐生智](https://zh.wikipedia.org/zh-cn/唐生智); [en.wikipedia Hisao Tani](https://en.wikipedia.org/wiki/Hisao_Tani) | OK |
| ev-228-incident | [en.wikipedia February 28 incident](https://en.wikipedia.org/wiki/February_28_incident); [zh.wikipedia 二二八事件](https://zh.wikipedia.org/zh-cn/二二八事件) | OK |
| ev-roc-retreat-to-taiwan | [zh.wikipedia 中华民国政府迁台](https://zh.wikipedia.org/zh-cn/中華民國政府遷台); [en.wikipedia Retreat of the government of the ROC to Taiwan](https://en.wikipedia.org/wiki/Retreat_of_the_government_of_the_Republic_of_China_to_Taiwan); [en.wikipedia Martial law in Taiwan](https://en.wikipedia.org/wiki/Martial_law_in_Taiwan); [The News Lens memoir on 7 Dec 1949 Executive Yuan meeting](https://www.thenewslens.com/article/188236) | OK |
| ev-great-leap-forward | [zh.wikipedia 大跃进](https://zh.wikipedia.org/zh-cn/大跃进); [People's Daily 中国经济周刊 on communes (2.6万多个)](https://paper.people.com.cn/zgjjzk/html/2009-09/28/content_355709.htm); [web search: 嵖岈山卫星人民公社 1958年4月20日](https://www.sohu.com/a/249199505_523099) | **fixed** |
| ev-great-chinese-famine | [en.wikipedia Great Chinese Famine](https://en.wikipedia.org/wiki/Great_Chinese_Famine); [zh.wikipedia 信阳事件](https://zh.wikipedia.org/zh-cn/信阳事件); [zh.wikipedia 七千人大会](https://zh.wikipedia.org/zh-cn/七千人大会); [zh.wikipedia 刘少奇](https://zh.wikipedia.org/zh-cn/刘少奇) | **fixed** |
| ev-cultural-revolution | [zh.wikipedia 刘少奇](https://zh.wikipedia.org/zh-cn/刘少奇); [zh.wikipedia 老舍](https://zh.wikipedia.org/zh-cn/老舍); [zh.wikipedia 邓小平](https://zh.wikipedia.org/zh-cn/邓小平); [en.wikipedia Down to the Countryside Movement](https://en.wikipedia.org/wiki/Down_to_the_Countryside_Movement) | OK |
| ev-tangshan-earthquake-1976 | [en.wikipedia 1976 Tangshan earthquake](https://en.wikipedia.org/wiki/1976_Tangshan_earthquake); [zh.wikipedia 唐山大地震](https://zh.wikipedia.org/zh-cn/唐山大地震); [Xinhua English 2016 (100,000 PLA soldiers)](https://www.xinhuanet.com/english/2016-07/26/c_135542266.htm); [web search: 周恩来/朱德 death dates](https://news.bjd.com.cn/2026/07/06/11847070.shtml) | OK |
| ev-tiananmen-1989 | [en.wikipedia 1989 Tiananmen Square protests and massacre](https://en.wikipedia.org/wiki/1989_Tiananmen_Square_protests_and_massacre); [zh.wikipedia 六四事件](https://zh.wikipedia.org/zh-cn/六四事件) | OK |
| ev-china-joins-wto | [en.wikipedia China and the World Trade Organization](https://en.wikipedia.org/wiki/China_and_the_World_Trade_Organization); [ourchinastory 中国入世](https://www.ourchinastory.com/zh/519); [sina 2001 龙永图 coverage](https://news.sina.com.cn/c/2001-11-11/396813.html); [State Council white paper China and the WTO (tariff 15.3%->9.8%)](https://english.www.gov.cn/archive/whitepaper/201806/28/content_WS5d16bf89c6d03ce678793b0c.html) | OK |
| ev-sichuan-earthquake-2008 | [en.wikipedia 2008 Sichuan earthquake](https://en.wikipedia.org/wiki/2008_Sichuan_earthquake); [NPR 15 May 2008 (130,000 troops)](https://www.npr.org/2008/05/15/90463031/china-increases-relief-effort-accepts-foreign-help); [China Daily: One school's miracle escape (Sangzao)](https://covid-19.chinadaily.com.cn/china/2008-05-22/content_6703962_2.htm); [huanqiu 对口支援方案 一省帮一重灾县](https://china.huanqiu.com/article/9CaKrnJkBfY) | OK |
| ev-1996-taiwan-presidential-election | [en.wikipedia Third Taiwan Strait Crisis](https://en.wikipedia.org/wiki/Third_Taiwan_Strait_Crisis); [en.wikipedia 1996 Taiwanese presidential election](https://en.wikipedia.org/wiki/1996_Taiwanese_presidential_election); [en.wikipedia 1948 Chinese legislative election](https://en.wikipedia.org/wiki/1948_Chinese_legislative_election); [zh.wikipedia 第一届国民大会](https://zh.wikipedia.org/zh-cn/第一届国民大会) | **fixed** |
| person-zhang-heng | [zh.wikipedia 张衡](https://zh.wikipedia.org/zh-cn/张衡); [zh.wikisource 後漢書 卷59 张衡传](https://zh.wikisource.org/zh-hans/後漢書/卷59) | OK |
| person-hua-tuo | [zh.wikisource 三國志 卷29 华佗传](https://zh.wikisource.org/zh-hans/三國志/卷29); [zh.wikisource 三国志 卷29 华佗传](https://zh.wikisource.org/zh-hans/三國志/卷29) | **fixed** |
| person-yang-guifei | [zh.wikipedia 杨贵妃](https://zh.wikipedia.org/zh-cn/杨贵妃); [zh.wikipedia 安禄山](https://zh.wikipedia.org/zh-cn/安禄山) | OK |
| person-xu-xiake | [zh.wikipedia 徐霞客](https://zh.wikipedia.org/zh-cn/徐霞客); [en.wikipedia Xu Xiake](https://en.wikipedia.org/wiki/Xu_Xiake); [zh.wikipedia 徐霞客游记](https://zh.wikipedia.org/zh-cn/徐霞客游记); [thepaper 徐霞客](https://www.thepaper.cn/newsDetail_forward_19262463) | **fixed** |
| person-koxinga | [en.wikipedia Koxinga](https://en.wikipedia.org/wiki/Koxinga); [zh.wikipedia 郑成功](https://zh.wikipedia.org/zh-cn/郑成功); [en.wikipedia Siege of Fort Zeelandia](https://en.wikipedia.org/wiki/Siege_of_Fort_Zeelandia) | OK |
| person-cixi | [en.wikipedia Empress Dowager Cixi](https://en.wikipedia.org/wiki/Empress_Dowager_Cixi); [zh.wikipedia 辛酉政变](https://zh.wikipedia.org/zh-cn/辛酉政变); [5000yan: Cixi flees west](https://en.5000yan.com/history-of-china/qing-dynasty/empress-dowager-cixi-flees-west.html) | **fixed** |
| person-qiu-jin | [zh.wikipedia 秋瑾](https://zh.wikipedia.org/zh-cn/秋瑾); [en.wikipedia Qiu Jin](https://en.wikipedia.org/wiki/Qiu_Jin); [chinanews 2011 徐锡麟后人:秋瑾徐锡麟非表兄妹](https://www.chinanews.com.cn/cul/2011/10-10/3378603.shtml); [thepaper 秋瑾](https://www.thepaper.cn/newsDetail_forward_2115455) | **fixed** |
| person-lu-xun | [zh.wikipedia 鲁迅](https://zh.wikipedia.org/zh-cn/鲁迅); [《呐喊·自序》 (marxists.org 鲁迅全集)](https://www.marxists.org/chinese/reference-books/luxun/03/001.htm); [zh.wikisource 狂人日記](https://zh.wikisource.org/zh-hans/狂人日記) | **fixed** |
| place-xian | [en.wikipedia Chang'an](https://en.wikipedia.org/wiki/Chang'an); [thepaper 西安得名 洪武二年](https://www.thepaper.cn/newsDetail_forward_1756994); [Liverpool Museums: Qin terracotta warriors discovery 1974](https://liverpoolmuseums.org.uk/stories/qin-terracotta-warriors-stunning-discovery) | OK |
| place-kaifeng | [en.wikipedia Kaifeng](https://en.wikipedia.org/wiki/Kaifeng); [zh.wikipedia 开封市](https://zh.wikipedia.org/zh-cn/开封市); [ifeng 开封城摞城 地下6城](https://news.ifeng.com/c/7fdhNpa7IUZ); [Storozum et al. 2020, Sci Rep, AD 1642 Yellow River flood (via search)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7048742/) | **fixed** |
| place-nanjing | [en.wikipedia Nanjing](https://en.wikipedia.org/wiki/Nanjing); [zh.wikipedia 南京城墙](https://zh.wikipedia.org/zh-cn/南京城墙); [People's Daily 2023-12-09 城砖物勒工名 (via search)](https://paper.people.com.cn/rmrb/html/2023-12/09/nw.D110000renmrb_20231209_3-07.htm); [gmw 钟山龙蟠石头虎踞 (via search)](https://m.gmw.cn/2023-08/04/content_1303467162.htm) | OK |
| place-beijing | [en.wikipedia History of Beijing](https://en.wikipedia.org/wiki/History_of_Beijing); [12371.cn / mfa.gov.cn 开国大典 (via search)](https://www.mfa.gov.cn/ziliao_674904/zt_674979/dnzt_674981/qtzt/zggcddwjw100ggs/jszgddzg/202208/t20220824_10750397.shtml); [en.wikipedia Ming dynasty](https://en.wikipedia.org/wiki/Ming_dynasty) | OK |
| polity-tang | [en.wikipedia Tang dynasty](https://en.wikipedia.org/wiki/Tang_dynasty); [zh.wikipedia 唐朝](https://zh.wikipedia.org/zh-cn/唐朝) | OK |
| polity-northern-song | [en.wikipedia Northern Song](https://en.wikipedia.org/wiki/Northern_Song); [zh.wikipedia 北宋](https://zh.wikipedia.org/zh-cn/北宋) | OK |
| polity-ming | [en.wikipedia Ming dynasty](https://en.wikipedia.org/wiki/Ming_dynasty); [zh.wikipedia 胡惟庸案](https://zh.wikipedia.org/zh-cn/胡惟庸案); [zh.wikipedia 一条鞭法](https://zh.wikipedia.org/zh-cn/一条鞭法); [en.wikipedia Yuegang (via search, 1567)](https://en.wikipedia.org/wiki/Yuegang) | OK |
| polity-qing | [en.wikipedia Qing dynasty](https://en.wikipedia.org/wiki/Qing_dynasty); [zh.wikipedia 清朝](https://zh.wikipedia.org/zh-cn/清朝); [en.wikipedia Puyi](https://en.wikipedia.org/wiki/Puyi); [Ming 1415 area 6.5M km2 vs Qing 1790 14.7M km2 (Wikipedia infobox, via search)](https://en.wikipedia.org/wiki/Ming_dynasty) | OK |

### Corrections

| Record | Field | Old → new | Reason | Source |
|---|---|---|---|---|
| ev-battle-of-guandu | story.en | he burned them unread, saying → he burned them all and made no inquiries, saying | The Sanguozhi says only 皆焚之 (burned them all); 'unread' is not in the source. zh already says 全部焚毁、不予追究. | <https://zh.wikisource.org/zh-hans/三國志/卷01> |
| ev-battle-of-xiaoting | story.en | blamed fate for his defeat by a man he had dismissed → blamed Heaven for his humiliation at Lu Xun's hands | The Sanguozhi records only 吾乃为逊所折辱，岂非天邪; no source says Liu Bei had dismissed Lu Xun. New wording matches the zh. | <https://zh.wikisource.org/zh-hans/三國志/卷58> <https://en.wikipedia.org/wiki/Lu_Xun_%28Three_Kingdoms%29> |
| ev-conquest-of-shu-by-wei | story.en | but in early 264 the army mutinied and killed them all. → but in early 264 the army mutinied and killed Zhong Hui and Jiang Wei, and men sent by Wei Guan hunted down Deng Ai and killed him. | The mutineers killed Jiang Wei and Zhong Hui; Deng Ai, freed by his own troops, was then killed near Mianzhu by Tian Xu, whom Wei Guan sent. zh (先后被杀) is fine. | <https://zh.wikisource.org/zh-hans/三國志/卷28> <https://zh.wikipedia.org/zh-cn/魏灭蜀之战> |
| ev-founding-of-sui | story.en | regent for the seven-year-old Emperor Jing → regent for the six-year-old Emperor Jing | Emperor Jing was born on 1 Aug 573, so he was 6 when Emperor Xuan died in June 580 (7 at the abdication in March 581). | <https://en.wikipedia.org/wiki/Emperor_Jing_of_Northern_Zhou> <https://zh.wikipedia.org/zh-cn/北周静帝> |
| ev-founding-of-sui | story.zh | 辅佐年仅七岁的周静帝 → 辅佐年仅六岁的周静帝 | Born 573, he was 6 (Western age) when Emperor Xuan died in 580; 七岁 fitted neither Western nor 虚岁 count. zh now uses the Western age like the en. | <https://zh.wikipedia.org/zh-cn/北周静帝> |
| ev-founding-of-sui | story.zh | 581年三月静帝“禅让” → 581年3月静帝“禅让” | This is a Gregorian date (4 Mar 581; the lunar date is 开皇元年二月甲子), so by dataset convention it takes an Arabic-numeral month. | <https://zh.wikipedia.org/zh-cn/北周静帝> <https://zh.wikipedia.org/zh-cn/隋文帝> |
| ev-founding-of-tang | story.en | When news came that Yuwen Huaji had strangled Emperor Yang at Jiangdu → When news came that Yuwen Huaji had had Emperor Yang strangled at Jiangdu | Yuwen Huaji ordered the killing. The officer Linghu Xingda did the strangling. | <https://zh.wikipedia.org/zh-cn/江都之变> |
| ev-founding-of-tang | story.zh | 宇文化及在江都缢杀炀帝 → 宇文化及在江都命人缢杀炀帝 | Same fix as en: 宇文化及命校尉令狐行达缢杀炀帝. | <https://zh.wikipedia.org/zh-cn/江都之变> |
| ev-tang-conquest-of-eastern-turks | story.en | capturing tens of thousands of people → capturing more than a hundred thousand people | Zizhi tongjian 193 has 俘男女十余万 (100,000+). The zh already says 十余万, so en and zh did not match. | <https://zh.wikisource.org/wiki/資治通鑑/卷193> |
| ev-an-lushan-rebellion | story.en | with some 150,000 troops → with some 180,000 troops | His three commands (Pinglu, Fanyang, Hedong) held about 183,900 troops. 150,000 (claimed 200,000) was the army he led out in Dec 755. | <https://zh.wikipedia.org/zh-cn/安史之乱> |
| ev-an-lushan-rebellion | story.zh | 拥兵约十五万 → 拥兵约十八万 | Same as en: the three commands had about 183,900 troops. 十五万 was the army he rebelled with. | <https://zh.wikipedia.org/zh-cn/安史之乱> |
| ev-cession-of-sixteen-prefectures | story.en | Song attempts to recover the region failed in 979 and 986, and the prefectures stayed under Liao, Jin and Yuan rule until Ming armies took Beijing in 1368, some four centuries later. → Later Zhou won back two southern prefectures in 959, but Song attempts to recover the rest failed in 979 and 986; apart from a brief Song hold on Yanjing in 1123–25, the region stayed under Liao, Jin and Yuan rule until Ming armies took Beijing in 1368, some four centuries later. | Not all sixteen stayed foreign until 1368. Shizong of Later Zhou recovered Yingzhou and Mozhou (瀛、莫) in 959, and Song held Yanjing in 1123–1125. | <https://zh.wikipedia.org/zh-cn/燕云十六州> |
| ev-cession-of-sixteen-prefectures | story.zh | 宋朝在979年和986年两次北伐收复失败，十六州历经辽、金、元统治，直到1368年明军攻克大都才重归中原王朝，前后约四百余年。 → 后周世宗曾于959年收复瀛、莫二州，但宋朝在979年和986年两次北伐均告失败；除1123至1125年宋朝短暂得回燕京外，其余各州历经辽、金、元统治，直到1368年明军攻克大都才重归中原王朝，前后四百余年。 | Same fix as en (959 recovery of 瀛、莫; Song held 燕京 1123–1125). Also dropped the redundant 约…余. | <https://zh.wikipedia.org/zh-cn/燕云十六州> |
| ev-chenqiao-mutiny | story.en | he left a seven-year-old heir → he left a five-year-old heir | Chai Zongxun was born on 14 Sep 953, so he was 5 when Shizong died in July 959. Seven is his age by sui count. | <https://zh.wikipedia.org/zh-cn/周恭帝> <https://en.wikipedia.org/wiki/Emperor_Gong_of_Later_Zhou> |
| ev-chenqiao-mutiny | story.zh | 继位的恭帝年仅七岁 → 继位的恭帝年仅五岁 | Chai Zongxun was born 14 Sep 953, so 5 (Western age) in July 959; 七岁 was his 虚岁. zh now uses the Western age like the en. | <https://zh.wikipedia.org/zh-cn/周恭帝> |
| ev-siege-of-diaoyucheng | story.en | Diaoyucheng itself held out until 1279, after the Song had fallen, surrendering on a promise that its people would be spared. → Diaoyucheng itself held out until early 1279, three years after Lin'an had surrendered and only weeks before the last Song stand at Yamen, then surrendered on a promise that its people would be spared. | The Yuan shi dates Wang Li's surrender to the first lunar month of Zhiyuan 16 (c. late Feb 1279), before the Battle of Yamen (19 Mar 1279); en.wikipedia also says two months before the end of Song. | <https://zh.wikisource.org/wiki/元史/卷010> <https://en.wikipedia.org/wiki/Siege_of_Diaoyu_Castle> <https://zh.wikisource.org/wiki/元史/卷163> |
| ev-siege-of-diaoyucheng | story.zh | 钓鱼城本身一直坚守到1279年南宋灭亡之后，才以保全城中军民为条件开城投降。 → 钓鱼城本身一直坚守到1279年初，此时临安已降三年，距南宋在崖山覆亡仅数周，守将王立才以保全城中军民为条件开城投降。 | 《元史·世祖纪》载至元十六年正月合州安抚使王立以城降，早于崖山海战（1279年3月19日），并非在南宋灭亡之后。 | <https://zh.wikisource.org/wiki/元史/卷010> <https://en.wikipedia.org/wiki/Siege_of_Diaoyu_Castle> |
| ev-yuan-dynasty-proclaimed | story.en | It was the first Chinese dynastic name taken from an abstract idea rather than a place or fief. → Unlike Qin, Han, Tang or Song, the name came from an abstract idea rather than a place or fief. | 'First' is contestable: Aguda explained the Jin name by the imperishability of gold; zh.wikipedia 建国号诏 only contrasts Da Yuan with place- or fief-based names. | <https://zh.wikipedia.org/zh-cn/建国号诏> <https://zh.wikipedia.org/zh-cn/金朝> |
| ev-yuan-dynasty-proclaimed | story.zh | 这是中国历史上第一个不以封地或地名、而以抽象含义命名的国号。 → 与秦、汉、唐、宋等以地名或封地为号不同，“大元”取的是抽象的文义。 | 同上：“第一个”之说有争议（金国号据阿骨打自述取金之不变不坏）。 | <https://zh.wikipedia.org/zh-cn/建国号诏> <https://zh.wikipedia.org/zh-cn/金朝> |
| ev-battle-of-yamen | story.en | and instead composed his poem → and instead wrote out for him his poem | Wen composed the poem while being carried past the Lingding Sea (12th lunar month of 1278) and wrote it out when Zhang Hongfan pressed him for a letter; it was not composed at Yamen. | <https://zh.wikipedia.org/zh-cn/过零丁洋> <https://m.thepaper.cn/baijiahao_10151793> |
| ev-battle-of-yamen | story.zh | 他拒绝写信招降张世杰，写下《过零丁洋》， → 他拒绝写信招降张世杰，只把途经零丁洋时所作的《过零丁洋》写给张弘范， | 诗作于1278年冬途经零丁洋时，张弘范逼其招降时他书此诗以示，并非当场所作。 | <https://zh.wikipedia.org/zh-cn/过零丁洋> <https://m.thepaper.cn/baijiahao_10151793> |
| ev-red-turban-rebellion | story.en | Han Lin'er drowned in the Yangtze in 1366 → Han Lin'er drowned in the Yangtze early in 1367 | He died in the 12th lunar month of Longfeng 12 / Zhizheng 26, i.e. January 1367 in the Western calendar. | <https://en.wikipedia.org/wiki/Han_Lin'er> <https://zh.wikipedia.org/zh-cn/韩林儿> |
| ev-red-turban-rebellion | story.zh | 1366年韩林儿在朱元璋部将护送下 → 1367年初韩林儿在朱元璋部将护送下 | 龙凤十二年十二月折合公历为1367年1月；按数据集惯例阿拉伯数字年份为公历。 | <https://zh.wikipedia.org/zh-cn/韩林儿> <https://en.wikipedia.org/wiki/Han_Lin'er> |
| ev-battle-of-lake-poyang | story.en | The Ming shi puts Chen's force at 600,000 men and Zhu's at 200,000; → Chen's force was reported as 600,000 men and Zhu's as 200,000; | 明史·太祖本纪 gives Chen's 号六十万 but not Zhu's 200,000 (that figure comes from other accounts), so attributing both to the Ming shi is inaccurate. | <https://zh.wikisource.org/wiki/明史/卷1> <https://zh.wikipedia.org/zh-cn/鄱阳湖之战> |
| ev-battle-of-lake-poyang | story.zh | 《明史》称陈友谅号六十万，朱元璋二十万， → 史载陈友谅号称六十万，朱元璋二十万， | 《明史·太祖本纪》只记陈友谅“号六十万”，未记朱军二十万。 | <https://zh.wikisource.org/wiki/明史/卷1> |
| ev-founding-of-ming | story.zh | 同年九月元顺帝 → 同年9月元顺帝 | Gregorian month (en: September; Dadu fell early Sept 1368, lunar 闰七月/八月) must use Arabic numerals per dataset convention; 九月 reads as the lunar ninth month, which is wrong. | <https://en.wikipedia.org/wiki/Hongwu_Emperor> |
| ev-ming-capital-moves-to-beijing | story.en | timber floated from Sichuan and Yunnan → timber floated from Sichuan and Huguang | The 1406 order sent officials to cut timber in Sichuan, Huguang, Jiangxi, Zhejiang and Shanxi; Yunnan is not listed. | <https://zh.wikisource.org/wiki/明史/卷6> |
| ev-ming-capital-moves-to-beijing | story.zh | 楠木自四川、云南放排而来 → 楠木自四川、湖广等地放排而来 | 《明史·成祖纪》永乐四年采木于四川、湖广、江西、浙江、山西，无云南。 | <https://zh.wikisource.org/wiki/明史/卷6> |
| ev-tumu-crisis | story.en | The 22-year-old Zhengtong Emperor → The 21-year-old Zhengtong Emperor | Born 29 November 1427, he was 21 in summer 1449 (22 neither by Western nor by sui reckoning, which gives 23). | <https://en.wikipedia.org/wiki/Emperor_Yingzong_of_Ming> |
| ev-tumu-crisis | story.zh | 二十二岁的明英宗 → 二十一岁的明英宗 | 英宗生于1427年11月29日，1449年夏为21周岁。 | <https://en.wikipedia.org/wiki/Emperor_Yingzong_of_Ming> |
| ev-siege-of-fort-zeelandia | story.zh | 郑成功当年六月去世 → 郑成功当年6月去世 | Koxinga died 23 June 1662 (Gregorian), which is lunar 五月初八; the Chinese-numeral 六月 wrongly reads as a lunar month under the dataset convention | <https://zh.wikipedia.org/zh-cn/郑成功> |
| ev-revolt-of-three-feudatories | story.en | Shang Kexi in Guangdong and Geng Jingzhong in Fujian. → Shang Kexi in Guangdong and the Geng family in Fujian, headed by 1673 by Geng Jingzhong. | The Fujian fief was granted to Geng Zhongming and passed via Geng Jimao; Geng Jingzhong was the grandson who inherited it, not one of the rewarded conquest generals | <https://en.wikipedia.org/wiki/Revolt_of_the_Three_Feudatories> <https://zh.wikipedia.org/zh-cn/三藩之乱> |
| ev-revolt-of-three-feudatories | story.zh | 尚可喜镇广东，耿精忠镇福建。 → 尚可喜镇广东，耿氏镇福建（1673年时由耿精忠承袭）。 | Same as en: the Geng fief went to Geng Zhongming / Geng Jimao; Geng Jingzhong only inherited it | <https://en.wikipedia.org/wiki/Revolt_of_the_Three_Feudatories> <https://zh.wikipedia.org/zh-cn/三藩之乱> |
| ev-treaty-of-nanjing | story.en | and the date of 1842 traditionally opens China's modern history → and the Opium War of 1840 traditionally opens China's modern history | Chinese historiography conventionally dates the start of modern history to 1840 (outbreak of the First Opium War), not 1842 | <https://zh.wikipedia.org/zh-cn/中国近代史> |
| ev-treaty-of-nanjing | story.zh | 并传统上以1842年作为中国近代史的开端 → 并传统上以1840年鸦片战争作为中国近代史的开端 | Same as en: 中国近代史 conventionally begins in 1840 | <https://zh.wikipedia.org/zh-cn/中国近代史> |
| ev-wuchang-uprising | story.zh | 约六周内 → 约七周内 | The previous review changed en 'six weeks' to 'seven weeks' (Sichuan declared on 27 Nov) but the zh still says 六周; en/zh mismatch | <https://zh.wikipedia.org/zh-cn/武昌起义> <https://en.wikipedia.org/wiki/Wuchang_uprising> |
| ev-northern-expedition | story.en | controlled only Guangdong. → controlled only Guangdong and Guangxi. | Guangxi had been merged into the Nationalist base on 15 March 1926 (provincial govt under Guangzhou from 1 June 1926), before the expedition began | <https://zh.wikipedia.org/zh-cn/国民革命军北伐> |
| ev-northern-expedition | story.zh | 仅控制广东一省 → 仅控制广东、广西两省 | Same fix: 两广统一 in March 1926, before the 9 July 誓师 | <https://zh.wikipedia.org/zh-cn/国民革命军北伐> |
| ev-long-march | summary.zh | 转战西南、西北约二万五千里抵达陕北 → 转战西南、西北，行程约一万公里（号称“二万五千里”），抵达陕北 | en says roughly 10,000 km while zh gives 25,000 li (= 12,500 km); 25,000 li is the traditional name, zh.wikipedia gives 二万余华里 for the First Front Army and en.wikipedia ~10,000 km; align zh with en and mark 25,000 li as the conventional figure | <https://zh.wikipedia.org/zh-cn/长征> <https://en.wikipedia.org/wiki/Long_March> |
| ev-mogao-caves | story.en | passing the cliffs of the Dang River valley southeast of Dunhuang at dusk, saw the opposite Sanwei mountain blaze with golden light like a thousand Buddhas, and cut a cell → passing the cliffs of the Dang River valley southeast of Dunhuang, saw a golden light shaped like a thousand Buddhas (later retellings explain it as the setting sun on Sanwei mountain opposite), and cut a cell | The stele says only that Lezun reached this mountain and saw golden light like a thousand Buddhas; dusk and Sanwei mountain are a later explanation, not part of the stele's record. | <https://zh.wikipedia.org/zh-cn/莫高窟> <https://buddhism.lib.ntu.edu.tw/en/search/search_detail.jsp?seq=562922> |
| ev-mogao-caves | story.zh | 云游僧人乐僔傍晚途经敦煌东南宕泉河谷的崖壁，忽见对面三危山上金光闪耀，状若千佛， → 云游僧人乐僔途经敦煌东南宕泉河谷的崖壁，忽见金光闪耀，状若千佛（后人多解释为夕阳映照对面的三危山）， | Same as en: the stele says only '忽见金光，状有千佛'; dusk and 三危山 are a later explanation. | <https://zh.wikipedia.org/zh-cn/莫高窟> <https://buddhism.lib.ntu.edu.tw/en/search/search_detail.jsp?seq=562922> |
| ev-shaanxi-earthquake-1556 | story.en | He also noted that low houses of wood and bamboo survived better than heavy brick and earth buildings. → He also compared how badly each district had suffered and estimated the share of its people who had died. | No retrieved source has Qin Keda comparing wood/bamboo houses with brick/earth ones (History.com says only that people later rebuilt with lighter materials); his account does estimate death rates by area (e.g. about 70% in Tong and Pu). | <https://zh.wikipedia.org/zh-cn/嘉靖大地震> <https://html.rhhz.net/WNSFXYXB/html/3d04de00-b4e6-4935-bc26-0337bd4d3d67.htm> <https://en.wikipedia.org/wiki/1556_Shaanxi_earthquake> |
| ev-shaanxi-earthquake-1556 | story.zh | 他还注意到木竹结构的低矮房屋比沉重的砖土建筑更能经受地震。 → 他还比较了各地受灾的轻重，并估算了各地的死亡比例。 | Same as en: the wood/bamboo comparison is unsupported; the death-rate estimates by area are in his account. | <https://zh.wikipedia.org/zh-cn/嘉靖大地震> |
| ev-1931-china-floods | story.en | At Wuhan the Yangtze broke through the defences in August and → At Wuhan the dykes began to give way at the end of July and | The Wuhan dyke failed on 27 July (en.wikipedia); zh.wikipedia has breaches from late July to early August, with the peak on 19 August. Saying the river broke through in August is wrong. | <https://en.wikipedia.org/wiki/1931_China_floods> <https://zh.wikipedia.org/zh-cn/1931年中国水灾> |
| ev-1931-china-floods | story.zh | 8月，长江洪水冲破武汉防线， → 7月底，武汉堤防开始溃决， | Same as en: the Wuhan dykes began failing in late July (27 July). | <https://en.wikipedia.org/wiki/1931_China_floods> <https://zh.wikipedia.org/zh-cn/1931年中国水灾> |
| ev-wang-mang-founds-xin | story.zh | 公元9年正月，他索性登基 → 公元9年1月，他索性登基 | Dataset convention: a Gregorian date takes an Arabic-numeral month. The en says January 9 CE (10 Jan 9). In the lunar calendar it was the 11th/12th month of 初始元年, later counted as 始建国元年正月, so '公元9年正月' mixes the two. | <https://zh.wikipedia.org/zh-cn/王莽> <https://en.wikipedia.org/wiki/Xin_dynasty> |
| ev-sui-conquest-of-chen | story.en | He Ruobi crossed at Jingkou and Han Qinhu at Caishi → He Ruobi crossed from Guangling to Jingkou and Han Qinhu from Hengjiang to Caishi | Jingkou and Caishi were the landing points on the south bank; He Ruobi crossed from Guangling and Han Qinhu from Hengjiang (南史 卷10; zh.wikipedia). | <https://zh.wikisource.org/zh-hans/南史/卷10> <https://zh.wikipedia.org/zh-cn/隋灭陈之战> |
| ev-sui-conquest-of-chen | story.zh | 贺若弼从京口、韩擒虎从采石相继渡江 → 贺若弼自广陵渡江夺取京口，韩擒虎自横江夜渡袭取采石 | The zh says they crossed FROM Jingkou and Caishi, which are south-bank points the Sui captured; the crossings were from Guangling and Hengjiang on the north bank. | <https://zh.wikisource.org/zh-hans/南史/卷10> <https://zh.wikipedia.org/zh-cn/隋灭陈之战> |
| ev-imperial-examination-instituted | story.zh | 乡试、省试、殿试三级考试三年一举 → 解试、省试、殿试三级考试三年一举 | In the Song the first level was called 解试 (发解试); 乡试 is the later Ming-Qing name. The en 'prefectural' matches 解试. | <https://zh.wikipedia.org/zh-cn/科举> <https://www.aisixiang.com/data/91438.html> |
| ev-aguda-founds-jin | story.en | while gold does not change, and the Wanyan homeland on the Anchuhu River was named for gold. → while gold does not change; elsewhere it notes that the Anchuhu River of the Wanyan homeland took its name from the Jurchen word for gold. | Aguda's recorded speech (金史·太祖纪) has only the iron vs gold argument; the Anchuhu = gold link is in 金史·地理志, not in his explanation. | <https://zh.wikisource.org/zh-hans/金史/卷2> <https://zh.wikisource.org/zh-hans/金史/卷24> |
| ev-aguda-founds-jin | story.zh | 只有金不变不坏；完颜部又兴起于按出虎水，"按出虎"即女真语的"金"。 → 只有金不变不坏。《金史·地理志》又说，完颜部兴起于按出虎水，"按出虎"即女真语的"金"。 | Same as en: the 按出虎 explanation comes from the 地理志, not from Aguda's speech in the 太祖纪. | <https://zh.wikisource.org/zh-hans/金史/卷2> <https://zh.wikisource.org/zh-hans/金史/卷24> |
| ev-ming-great-wall | story.en | built more than a thousand two-storey hollow towers → built more than a thousand hollow towers | Storey count is wrong or at best disputed: 明史·戚继光传 says the towers were hollow in three levels (虚中为三层); removed the number. | <https://zh.wikisource.org/zh-hans/明史/卷212> <https://zh.wikipedia.org/zh-cn/戚继光> |
| ev-ming-great-wall | story.zh | 修建空心敌台一千余座，上下两层，可以驻兵 → 修建空心敌台一千余座，可以驻兵 | 同上：《明史》称敌台“虚中为三层”，删去“上下两层”。 | <https://zh.wikisource.org/zh-hans/明史/卷212> |
| ev-ming-great-wall | story.zh | 1568年，抗倭名将戚继光调任蓟镇总兵 → 1568年，抗倭名将戚继光调往蓟镇主持防务 | In 1568 (隆庆二年五月) Qi was made 总理蓟州、昌平、保定练兵事; he became 总兵 of Jizhou only afterwards (1569 per zh.wikipedia). en text ("given command of the Jizhou sector") is fine. | <https://zh.wikisource.org/zh-hans/明史/卷212> <https://zh.wikipedia.org/zh-cn/戚继光> |
| ev-ming-great-wall | story.en | Badaling, Mutianyu and Jinshanling, the stretches visited today, all date from this period. → Mutianyu (rebuilt 1569) and Jinshanling (begun 1570), among the stretches visited today, date from this period; Badaling had been rebuilt a little earlier, in 1505. | Badaling was built in 1505, before the post-1550 phase the paragraph describes (the record note itself says 1505). | <https://zh.wikipedia.org/zh-cn/八达岭长城> <https://en.wikipedia.org/wiki/Mutianyu> <https://en.wikipedia.org/wiki/Jinshanling> |
| ev-ming-great-wall | story.zh | 今日游人所到的八达岭、慕田峪、金山岭等段都是这一时期的遗存。 → 今日游人所到的慕田峪（1569年重修）、金山岭（1570年始建）等段都是这一时期的遗存，八达岭则早在1505年已经修筑。 | 同上：八达岭建于1505年，早于1550年后的重修阶段。 | <https://zh.wikipedia.org/zh-cn/八达岭长城> <https://en.wikipedia.org/wiki/Mutianyu> |
| ev-battle-of-penghu | story.en | leaving a twelve-year-old heir → leaving a ten-year-old heir | Zheng Keshuang was born 13 Aug 1670 and succeeded on 20 Mar 1681, so he was 10 (12 only by Chinese sui reckoning). | <https://zh.wikipedia.org/zh-cn/郑克塽> <https://en.wikipedia.org/wiki/Zheng_Keshuang> |
| ev-battle-of-penghu | story.zh | 继位的郑克塽年仅十二岁 → 继位的郑克塽年仅十岁 | 同上：郑克塽生于1670年8月13日，1681年3月继位时实岁十岁（虚岁十二），与英文统一按实岁。 | <https://zh.wikipedia.org/zh-cn/郑克塽> |
| ev-self-strengthening-movement | story.en | In October 1860 British and French troops burned the Summer Palace while the Xianfeng Emperor sheltered in Rehe. → In October 1860, after Anglo-French troops had looted it, British soldiers burned the Old Summer Palace while the Xianfeng Emperor sheltered in Rehe. | The burning (ordered by Elgin, 18 Oct) was carried out by British troops; no French soldiers took part. Also "Old Summer Palace" (Yuanmingyuan) matches the zh 圆明园 and avoids confusion with the Summer Palace (Yiheyuan) rebuilt later in the same story. | <https://en.wikipedia.org/wiki/Old_Summer_Palace> |
| ev-self-strengthening-movement | story.zh | 1860年10月，英法联军火烧圆明园，咸丰帝避居热河。 → 1860年10月，英法联军劫掠圆明园后，英军纵火将其焚毁，咸丰帝避居热河。 | 同上：焚园由额尔金下令、英军执行，法军未参与纵火（但参与了劫掠）。 | <https://en.wikipedia.org/wiki/Old_Summer_Palace> |
| ev-hundred-days-reform | story.en | the 27-year-old Guangxu Emperor → the 26-year-old Guangxu Emperor | Guangxu was born 14 Aug 1871, so he was 26 on 11 June 1898. | <https://zh.wikipedia.org/zh-cn/光绪帝> |
| ev-hundred-days-reform | story.zh | 27岁的光绪帝 → 26岁的光绪帝 | 同上：光绪帝生于1871年8月14日，1898年6月11日时实岁26。 | <https://zh.wikipedia.org/zh-cn/光绪帝> |
| ev-battle-of-shanghai-1937 | story.en | a Girl Guide, Yang Huimin, is said to have swum the creek to bring them a flag. → a Girl Guide, Yang Huimin, smuggled a national flag to them, wrapped around her body under her uniform. | The swimming-in version is a popular legend; the documented account is that she carried the flag wrapped around her body past the British sentries (the flag was raised on 29 Oct). | <https://en.wikipedia.org/wiki/Defense_of_Sihang_Warehouse> |
| ev-battle-of-shanghai-1937 | story.zh | 据说女童军杨惠敏泅渡苏州河为他们送去国旗。 → 女童军杨惠敏把国旗缠在身上、藏在制服下，越过封锁送进仓库。 | 同上：“泅渡送旗”是流传说法，较可靠的记载是她把国旗缠在身上送入。 | <https://en.wikipedia.org/wiki/Defense_of_Sihang_Warehouse> |
| ev-great-leap-forward | story.en | In 1958 the target shrank to a few years and then to one. → In 1958 the target shrank to seven years and then to two. | The 1958 deadlines went 15 -> 10 -> 7 years, and in June a report Mao endorsed said Britain would be surpassed in two years; no source found for "one". | <https://zh.wikipedia.org/zh-cn/大跃进> |
| ev-great-leap-forward | story.zh | 1958年，期限缩短为几年，继而一年。 → 1958年，期限先缩短为七年，继而两年。 | 同上：1958年由十五年缩为十年、七年，6月毛批示的报告提出“两年超过英国”。 | <https://zh.wikipedia.org/zh-cn/大跃进> |
| ev-great-chinese-famine | story.en | At the 'Seven Thousand Cadres' conference in January 1962 he said so in public, and the communes were scaled back, canteens closed and private plots restored. → At the 'Seven Thousand Cadres' conference in January 1962 he said so in public. By then most canteens had been closed and private plots restored, and the communes were scaled back further. | Chronology: canteens were disbanded and private plots restored during 1961 (Mar-Jun 1961, Sixty Articles), before the January 1962 conference, not as its result. | <https://statics.scnu.edu.cn/pics/em/2016/0106/1452084948117252.pdf> <https://zh.wikipedia.org/zh-cn/大跃进> <https://zh.wikipedia.org/zh-cn/七千人大会> |
| ev-great-chinese-famine | story.zh | 1962年1月"七千人大会"上，他公开表达了这一看法；此后人民公社规模缩小，公共食堂解散，自留地恢复。 → 1962年1月"七千人大会"上，他公开表达了这一看法。此前公共食堂已在1961年大多解散，自留地也已恢复，此后人民公社规模进一步缩小。 | 同上：公共食堂解散、自留地恢复发生在1961年，早于七千人大会。 | <https://statics.scnu.edu.cn/pics/em/2016/0106/1452084948117252.pdf> |
| person-xu-xiake | story.en | A great-grandfather's involvement in an exam scandal → A great-great-grandfather's involvement in an exam scandal | The ancestor in the 1499 exam scandal (with Tang Yin) was Xu Jing, Xu Xiake's 高祖 (great-great-grandfather), not great-grandfather. | <https://zh.wikipedia.org/zh-cn/徐霞客> |
| person-xu-xiake | story.zh | 曾祖卷入科场案 → 高祖徐经卷入科场案 | 卷入弘治十二年科场案的徐经是徐霞客的高祖，不是曾祖。 | <https://zh.wikipedia.org/zh-cn/徐霞客> |
| person-qiu-jin | story.en | Back in China in 1906 she started the China Women's Journal in Shanghai, → Back in China in 1906 she moved to Shanghai, where in January 1907 she started the China Women's Journal, | The journal's first issue appeared in January 1907 (lunar 1906-12-01), not 1906. | <https://zh.wikipedia.org/zh-cn/秋瑾> |
| person-qiu-jin | story.en | In 1907 she took charge of the Datong school → Soon afterwards she took charge of the Datong school | Avoids repeating 1907 after the date fix; she took over Datong after returning to Shaoxing in spring 1907. | <https://zh.wikipedia.org/zh-cn/秋瑾> |
| person-qiu-jin | story.en | with her cousin Xu Xilin → with her fellow Shaoxing revolutionary Xu Xilin | No kinship is attested; Xu's family says the 'cousins' claim is unfounded (Qiu Jin first met him with Cai Yuanpei's introduction letter). en.wikipedia's 'cousin' appears to be an error. | <https://zh.wikipedia.org/zh-cn/秋瑾> <https://www.chinanews.com.cn/cul/2011/10-10/3378603.shtml> |
| person-qiu-jin | story.zh | 1906年回国后，她在上海创办《中国女报》 → 1906年回国后，她来到上海，于1907年1月创办《中国女报》 | 《中国女报》创刊于1907年1月（农历丙午年十二月初一）。 | <https://zh.wikipedia.org/zh-cn/秋瑾> |
| person-qiu-jin | story.zh | 1907年她主持绍兴大通学堂 → 随后她主持绍兴大通学堂 | 与上句日期修改衔接，避免重复。 | <https://zh.wikipedia.org/zh-cn/秋瑾> |
| person-qiu-jin | story.zh | 与表兄徐锡麟 → 与同乡战友徐锡麟 | 二人并无表亲关系的可靠记载，徐家后人经考证否认“表兄妹”之说；二人是绍兴同乡、光复会同志。 | <https://zh.wikipedia.org/zh-cn/秋瑾> <https://www.chinanews.com.cn/cul/2011/10-10/3378603.shtml> |
| person-lu-xun | story.en | in which a man reads the Confucian classics and finds the words 'eat people' between the lines → in which a man leafs through an old history, every page marked 'benevolence and morality', and finds the words 'eat people' between the lines | In the story the madman reads a history book (历史) with 仁义道德 on every page, not the Confucian classics; zh already says 翻开历史. | <https://zh.wikisource.org/zh-hans/狂人日記> |
| ev-1996-taiwan-presidential-election | story.en | In July 1995 and again in March 1996, days before the vote, the People's Liberation Army fired missiles into waters near Keelung and Kaohsiung. → In July 1995 the People's Liberation Army fired missiles into the sea north of Taiwan, and in March 1996, days before the vote, into waters near Keelung and Kaohsiung. | Only the March 1996 tests targeted zones off Keelung and Kaohsiung; the July 1995 tests fell in an area some 60-70 km north of Taiwan. | <https://en.wikipedia.org/wiki/Third_Taiwan_Strait_Crisis> |
| ev-1996-taiwan-presidential-election | story.zh | 1995年7月和1996年3月选举前夕，解放军两度向基隆、高雄附近海域试射导弹，美国派出两个航母战斗群。 → 1995年7月，解放军向台湾以北海域试射导弹；1996年3月选举前夕，又向基隆、高雄附近海域试射，美国派出两个航母战斗群。 | 1995年7月的导弹落在台湾以北海域，只有1996年3月的演习针对基隆、高雄外海。 | <https://en.wikipedia.org/wiki/Third_Taiwan_Strait_Crisis> |
| ev-1996-taiwan-presidential-election | story.en | with a legislature elected on the mainland in 1947 whose members → with a parliament elected on the mainland in 1947–48 whose members | The National Assembly was elected in November 1947 but the Legislative Yuan in January 1948. | <https://en.wikipedia.org/wiki/1948_Chinese_legislative_election> <https://zh.wikipedia.org/zh-cn/第一届国民大会> |
| ev-1996-taiwan-presidential-election | story.zh | 1947年在大陆选出的民意代表 → 1947至1948年在大陆选出的民意代表 | 国大代表1947年11月选出，立法委员1948年1月选出。 | <https://en.wikipedia.org/wiki/1948_Chinese_legislative_election> <https://zh.wikipedia.org/zh-cn/第一届国民大会> |
| person-cixi | story.en | arrested the regents on the way back to Beijing → arrested the regents as the court returned to Beijing | Only Sushun was seized en route (at Miyun); Zaiyuan and Duanhua were arrested after the dowagers had reached Beijing. | <https://zh.wikipedia.org/zh-cn/辛酉政变> |
| person-cixi | story.zh | 在回京途中拿下顾命大臣 → 趁回京之机拿下顾命大臣 | 只有肃顺在密云途中被擒，载垣、端华是在两宫回京后被拿下。 | <https://zh.wikipedia.org/zh-cn/辛酉政变> |
| place-kaifeng | story.en | Yellow River floods, above all the breach of the dykes during Li Zicheng's siege of 1642, buried the Song city several metres under silt. → Repeated Yellow River floods buried the Song city some eight metres under silt, beneath the remains of later cities; the worst, when the dykes were breached during Li Zicheng's siege of 1642, killed most of the inhabitants. | Misleading causality: the Song city lies ~8 m down, under the Jin (~6 m) and Ming (~5-6 m) layers; the 1642 flood (deposit ~3 m) buried the Ming city, not the Song one. The 1642 flood was the deadliest (about 30,000 of 370,000 survived). | <https://news.ifeng.com/c/7fdhNpa7IUZ> <https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7048742/> <https://zh.wikipedia.org/zh-cn/开封市> |
| place-kaifeng | story.zh | 黄河屡次泛滥，尤其是1642年李自成围城期间黄河决堤，使宋代城市被深埋在数米厚的泥沙之下，形成“城摞城”的奇观。 → 黄河屡次泛滥，使宋代城市被深埋在地下约8米的泥沙之中，其上又叠压着后世的城池，形成“城摞城”的奇观；其中最惨烈的一次是1642年李自成围城期间黄河决堤，全城居民大多罹难。 | Same as en: the Song city was buried by successive floods before 1642 (it lies below the Jin and Ming cities); 1642 buried the Ming city and killed most residents. | <https://news.ifeng.com/c/7fdhNpa7IUZ> <https://zh.wikipedia.org/zh-cn/开封市> |
| ev-battle-of-xiaoting | story.en | Sun Quan's young commander Lu Xun → Sun Quan's little-known commander Lu Xun | Lu Xun (b. 183) was about 39; the Sanguozhi calls him 春秋方壮，威名未著 (in his prime but not yet famous); 'young' comes from later commentary | <https://zh.wikipedia.org/zh-cn/陆逊> |
| ev-battle-of-xiaoting | story.zh | 东吴年轻的主将陆逊 → 东吴威名未著的主将陆逊 | 同上：陆逊时年约三十九岁，陈寿称其“春秋方壮，威名未著” | <https://zh.wikipedia.org/zh-cn/陆逊> |
| ev-end-of-han | story.en | while Liu Bei and Sun Quan soon claimed their own thrones. → while Liu Bei (in 221) and Sun Quan (in 229) claimed thrones of their own. | Sun Quan took the imperial title only in 229, nine years later; 'soon' was misleading | <https://www.thepaper.cn/newsDetail_forward_25990752> |
| ev-end-of-han | story.zh | 刘备、孙权随后也相继称帝。 → 刘备、孙权也先后于221年、229年称帝。 | 同上 | <https://www.thepaper.cn/newsDetail_forward_25990752> |
| person-hua-tuo | story.en | Chen Shou's Records of the Three Kingdoms collects his cases: he gave patients a powder dissolved in wine, mafeisan, → Chen Shou's Records of the Three Kingdoms collects his cases: he gave patients a powder to drink, mafeisan (taken with wine, the later Hou Han shu adds), | 三国志·华佗传 has only 饮其麻沸散; 'with wine' (以酒服) is from the 后汉书 | <https://zh.wikisource.org/zh-hans/三國志/卷29> |
| person-hua-tuo | story.zh | 他让病人以酒服下"麻沸散" → 他让病人服下"麻沸散"（《后汉书》称以酒送服） | 同上 | <https://zh.wikisource.org/zh-hans/三國志/卷29> |
| person-xu-xiake | story.en | and Mu Zeng, the Naxi chieftain of Lijiang, had him carried home by litter. → and the Naxi chieftains of Lijiang had him carried home by litter. | Qian Qianyi's 徐霞客传 credits an unnamed 'Mu prefect of Lijiang' (丽江木太守) with provisions and a litter; no retrieved source names Mu Zeng. Now matches the zh 丽江土司 | <https://zh.wikipedia.org/zh-cn/徐霞客> |

### Ruler lists

| Polity | Change | Reason | Source |
|---|---|---|---|
| polity-han-zhao | insert Liu He (刘和, 310–310, Q714140) after Liu Yuan | Insertion after Liu Yuan. The three-ruler list has no gaps (304-310, 310-318, 318-329), so it reads as exhaustive, but it skips Liu He (刘和), who succeeded Liu Yuan in 310 and was killed within days by Liu Cong. Same pattern as the earlier Northern Han fix (Liu Ji'en). | <https://zh.wikipedia.org/zh-cn/汉赵> <https://en.wikipedia.org/wiki/Liu_He_%28Han-Zhao%29> <https://www.wikidata.org/wiki/Q714140> |
| polity-han-zhao | insert Liu Can (刘粲, 318–318, Q1152735) after Liu Cong | Insertion after Liu Cong. Liu Can (刘粲, Emperor Yin) succeeded Liu Cong in 318 and was killed by Jin Zhun the same year, before Liu Yao took the throne; the gap-free list skips him. | <https://zh.wikipedia.org/zh-cn/汉赵> <https://en.wikipedia.org/wiki/Liu_Can> <https://www.wikidata.org/wiki/Q1152735> |
| polity-nanzhao | Shilong: add qid Q7263510 | Shilong has no qid; Wikidata Q7263510 ("Shilong", king of Nanzhao, zhwiki 世隆) is the person. Reign 859-877 confirmed by zh.wikipedia 世隆 and 南诏. | <https://zh.wikipedia.org/zh-cn/世隆> <https://www.wikidata.org/wiki/Q7263510> |
| polity-min | Wang Yanzheng: from 944 → 943 | Wang Yanzheng's reign begins in 943, when he proclaimed himself emperor of Yin (天德 era 943) and the lists count Yin within Min. 944 is the year Zhu Wenjin killed Wang Yanxi and took Fuzhou, which is not Wang Yanzheng's accession; he took the Min title only in 945. | <https://zh.wikipedia.org/zh-cn/闽国> <https://zh.wikipedia.org/wiki/Template:中国君主列表/五代十国/闽> <https://en.wikipedia.org/wiki/Min_%28Ten_Kingdoms%29> |

The other 59 lists matched the sources (within ±1 year for lunar/Gregorian or accession-vs-era conventions). Omissions in lists that are clearly a selection were left alone.

### Doubts left unchanged

Points where sources disagree, or where the text follows one defensible reading:

- ev-battle-of-kunyang: Relief force size: the 后汉书 gives 步骑千余 plus a 3,000-man dare-to-die charge (consistent with 'a few thousand'), while zh/en Wikipedia say he came back with 步骑万余/10,000. The story follows the 后汉书, so it is left as is.
- ev-battle-of-xiaoting: Lu Xun is called 'young / 年轻' but was about 39 in 222 (born 183). The sources stress that he was little known and junior to the Sun Ce-era veterans, not young. Consider 'little-known' / '资历尚浅' instead. Not changed.
- ev-end-of-han: 'Liu Bei and Sun Quan soon claimed their own thrones / 随后相继称帝': Liu Bei did in 221, but Sun Quan only in 229, nine years later. This is loose but not clearly wrong.
- ev-zhuge-liang-northern-expeditions: Women's-clothing taunt: the only source I could retrieve is 《晋书·宣帝纪》, which was compiled under the Tang. I could not confirm a genuinely Jin-era text (e.g. a Pei-cited 魏氏春秋 passage). 'Jin-era accounts / 晋代史料' might be better as 'the Jin shu / 《晋书》'.
- ev-xiaowen-moves-capital-to-luoyang: The 魏书 has the move decided at Luoyang in 493 and announced empire-wide (诏天下喻以迁都之意) in 494; one secondary source puts the formal proclamation on 1st day of 1st month 495. '494' is defensible. Six Garrisons: 524 follows the 魏书 (the 通鉴 dates it differently); OK.
- ev-conquest-of-wu-by-jin: 'took Wuchang': 晋书武帝纪 credits Wang Jun with 进破夏口、武昌, though zh.wikipedia credits Wang Rong's column (Wang Jun supporting). 'spring of 280' = 三月壬寅 (1 May 280), lunar spring. Both defensible.
- ev-sui-grand-canal: Labour for the Yongji Canal: the Sui shu (as cited secondarily) gives 河北诸郡男女百余万, but Zizhi tongjian 181 says 河北诸军五百余万众. The story follows the Sui shu. One secondary source notes that the 610 Jiangnan River appears only in the Tongjian, not the Sui shu or Bei shi. I could not load the Sui shu text itself from wikisource (404).
- ev-chenqiao-mutiny: Distance from Kaifeng to Chenqiao, '~20 km / 四十里': not confirmed. Secondary sources say 三十里. Chenqiao lies north of Kaifeng across the Yellow River (southeast of Fengqiu). Left unchanged.
- ev-tang-conquest-of-eastern-turks: Zizhi tongjian says Illig fled to 铁山, while zh.wikipedia 唐灭东突厥之战 says 阴山. 铁山 is in the Yin range area, so 'Yin Mountains' is defensible. Tongjian has Illig lodged at the 太仆 (馆于太仆, 厚廪食之), which 'given a house / 赐予宅第' only loosely matches.
- ev-wu-zetian-proclaims-zhou: The Luo Binwang anecdote (宰相安得失此人) is widely reported, but I could not retrieve the primary passage (usually cited from 新唐书·骆宾王传 / 资治通鉴卷203). The story correctly frames it as 'the histories say'.
- ev-cession-of-sixteen-prefectures: Li Congke dying 'with his family': zh.wikipedia 李从珂 mentions only his self-immolation in 玄武楼 (11 Jan 937). Standard accounts add 曹太后, 刘皇后 and his son 重美, but I did not retrieve that text.
- ev-huang-chao-rebellion: Huang Chao died at 狼虎谷, now Laiwu, which en.wikipedia contrasts with 'near Mount Tai'. Laiwu sits on the eastern flank of the Taishan massif, and 新唐书 calls it 泰山狼虎谷, so I left it.
- ev-founding-of-sui / ev-chenqiao-mutiny: Ages: I normalised en to Western ages and marked the zh figures as 虚岁. If the owner prefers zh to use Western ages too, change them to 六岁 and 五岁.
- ev-battle-of-xiangyang: Salt and cloth as the 1272 relief cargo: 宋史·张顺传 (卷450) as retrieved does not mention them; only popular articles describe salt/cloth shortages. Left unchanged.
- ev-battle-of-xiangyang: Simplification: 元史·阿里海牙传 says the shot hit the 谯楼 and then Aliqaya's personal promise of safety persuaded Lü Wenhuan; the story credits the stone alone. Not changed.
- ev-battle-of-lake-poyang: Chen's ships 'said to carry stables and to be sheathed in iron' (en only, flagged 'said'): not found in the zh/en Wikipedia articles or 明史 太祖纪 retrieved; 明史 only describes linked tower ships over ten zhang high. Consider dropping if no source.
- ev-red-turban-rebellion: Shangdu was sacked by Guan Xiansheng/Po Toupan around 至正十八年十二月 (≈ Jan 1359); the sentence 'took Kaifeng in 1358, burned ... Shangdu and raided Korea' reads as if all in 1358 (Korea was 1359–60). Not exactly dated in sources retrieved; left.
- ev-jingnan-campaign: Dongchang was fought 建文二年十二月 (≈ Jan 1401); zh '1400年铁铉死守济南，燕军又在东昌大败' could be read as both in 1400. Minor; left.
- ev-yuan-dynasty-proclaimed: en.wikipedia Yuan dynasty infobox gives 5 Nov 1271 for the name proclamation, but zh.wikipedia 建国号诏 gives 至元八年十一月乙亥 = 18 Dec 1271, which matches the lunar date; kept 18 Dec.
- ev-ming-capital-moves-to-beijing: Final confirmation of Beijing: a source gives 1440 for the decision to stay and rebuild, others 1441 (正统六年) for dropping 行在; 1441 kept.
- ev-battle-of-shanhai-pass: Dorgon's entry into Beijing: zh.wikipedia gives 6 June 1644 (story follows this, as the previous review decided), en.wikipedia gives 5 June. Left as is.
- ev-siege-of-fort-zeelandia: Surrender date: treaty terms finalised 1 Feb 1662 (en.wikipedia); zh.wikipedia 郑成功 gives 1662-02-09 (lunar 12/21) as the surrender/departure. Story's 1 Feb is defensible. en.wikipedia's '2 April / 4 April 1661' for landing and Provintia look like lunar-date confusion; zh sources give 30 Apr and 4 May.
- ev-battle-of-sarhu: zh text writes 刘綎; 綎 is the traditional form, the 通用规范汉字表 simplified form is 𬘩 (used by zh.wikipedia), but 𬘩 has poor font support and 刘綎 is common in mainland print. Not changed. Fall of Kaiyuan in 1619 only confirmed via weak sources (Tieling Sept 1619 confirmed).
- ev-second-opium-war: 'Treaties of Tianjin legalised opium imports': legalisation came in the November 1858 Shanghai tariff rules supplementing the Tianjin treaties (en.wikipedia Second Opium War attributes it to the 1860 Convention of Peking; Treaty of Nanking article says Tianjin). Common simplification, left as is.
- ev-taiping-rebellion: zh says 洪秀全病逝; cause is debated (illness after eating wild plants vs. suicide/poison per Zeng Guofan). zh.wikipedia follows 病逝; en text just says 'died'. Acceptable.
- ev-long-march: Xiang River 'perhaps half their strength / 损失约半': sources say the army fell from 86,000 at departure to 30,000-36,000 after the Xiang (more than half), but part of that loss came at the earlier blockade lines; 'about half' for the Xiang battle itself is defensible, so left as is.
- ev-long-march: Summary.en 'Mao Zedong gained leadership of the army' (and zh 确立了毛泽东的领导地位, the official formula) is stronger than en.wikipedia, which says Zhou Enlai kept the final say and Mao became his assistant on the three-man military group in March 1935. The story's own wording ('a leading role in military command') is fine. Consider softening the summary.
- ev-founding-of-ccp: Mao in 1921 was 主事 (head) of the primary school attached to Hunan First Normal, not strictly a 'teacher/教师'. 'A few collaborated with Japan' refers to two delegates (Chen Gongbo, Zhou Fohai, via the Wang Jingwei regime). Both are defensible simplifications.
- ev-reform-and-opening-up: Xiaogang pact date: zh.wikipedia gives the night of 24 Nov 1978 (matches 'a month earlier'), en.wikipedia says December 1978. The 'raise children to 18 if jailed' clause comes from en.wikipedia; I found no primary text of the pact.
- ev-huaihai-campaign: Chen Yi's wheelbarrow remark is quoted widely in party-history media, but no primary record or occasion was found (one account says it was said to the Soviet ambassador Yudin after 1949). 'Later remarked' is consistent with that.
- ev-xian-incident: That Chiang flew from Luoyang to Xi'an on 4 Dec 1936 rests on a popular-history source. zh.wikipedia gives the date but not how he travelled.
- ev-may-fourth-movement: The officials' removal: zh.wikipedia body says they resigned 9/10 June, en.wikipedia says dismissed 12 June. The story gives no date. The '1918 secret agreement' matches the Sept 1918 Shandong exchange of notes (en.wikipedia: Duan secretly reaffirmed the transfer in late 1918).
- ev-handover-of-hong-kong: zh '香港岛和九龙半岛' as the perpetual cession: strictly only Kowloon south of Boundary Street was ceded in 1860, and New Kowloon was part of the 1898 lease. This is a minor imprecision with no correction made; the en text ('Kowloon') is fine.
- ev-mogao-caves: Cliff length is 1,680 m per zh.wikipedia; story says 'about 1.6 km' / 约一千六百米. Left as is, but 1.7 km would be closer. The 698 date of the stele rests on its name 圣历碑 (圣历元年 = 698); no page giving the conversion explicitly was retrieved.
- ev-1931-china-floods: Gaoyou breach: en.wikipedia and The China Project give the night of 25 August; zh.wikipedia gives about 5 a.m. on 26 August. 'Night of 25 August' is defensible. The China Project puts the drowned that night at 10,000-15,000, so 'thousands' undercounts. Wuhan stayed flooded about three months, so 'for weeks' / 数周 is an understatement but not wrong.
- ev-aguda-founds-jin: zh quotes 阿骨打 '端立直视'; 辽史 卷27 has only '独阿骨打辞以不能'. The phrase may come from 契丹国志 or 三朝北盟会编 but I could not retrieve it. Consider dropping the quotation marks.
- ev-mongol-conquest-of-western-xia: Place of Genghis Khan's death: the story says the Liupan Mountains; en.wikipedia puts it during the fall of Yinchuan, and 元史 has 萨里川哈老徒行宫. The Liupan/Qingshui area is a common view, so the text is defensible but disputed.
- ev-imperial-examination-instituted: zh adds '开殿试先声' for Wu Zetian; zh.wikipedia says she set up the palace examination, so this is consistent, though the en is more cautious ('is said to').
- ev-sui-conquest-of-chen: 南史 has 孔贵人 while the story has 孔贵嫔 (the 陈书 usage). Both are attested; kept. The '景阳殿旁的枯井' location is traditional (景阳井) and sits under '相传'.
- ev-battle-of-penghu: Shi Lang's fleet: ~300 ships/20,000 men (en.wikipedia Shi Lang, accepted by prior review) vs 238 ships/~21,000-24,000 (zh.wikipedia 澎湖海战 infobox, en Battle of Penghu). "Liu fled with a few boats": no source gives a number; zh wiki only says he retreated via 吼门 with remnants.
- ev-self-strengthening-movement: Navy funds diverted to the Summer Palace: widely stated, but en.wikipedia notes recent Chinese research arguing Cixi's project was not the cause of the navy's decline; text ("among other things") is defensible. zh "容闳率首批幼童" vs en "Yung Wing sent": first group was led by Chen Lanbin and Yung Wing (Yung went ahead); acceptable.
- ev-hundred-days-reform: Gongche Shangshu: the 1,200-signature memorial is Kang's own account; Mao Haijian (2005) argues Kang's petition was never delivered and was much smaller. "Signed by hundreds" is defensible but the event is contested. Coup date 21 vs 22 Sep varies between sections of en.wikipedia; 21 Sep (训政 edict) is standard.
- ev-roc-retreat-to-taiwan: 7 Dec 1949: zh.wikipedia describes it as a presidential decree (signed by Li Zongren and Yan Xishan) moving the government to Taipei; a memoir in The News Lens describes an Executive Yuan meeting that day. "Executive Yuan decided" is defensible.
- ev-great-chinese-famine: Summary lists Anhui, Sichuan, Gansu and Henan as worst-hit; en.wikipedia ranks by death rate Anhui, Chongqing, Sichuan, Guizhou, Hunan (story says Anhui, Sichuan, Guizhou, Gansu). Defensible since rankings depend on method (rate vs absolute numbers); owner may want summary and story to name the same provinces.
- ev-tangshan-earthquake-1976: Official toll: 242,769 is the commonly cited figure (1982 地球的震撼, Xinhua), but en.wikipedia gives 242,469 as official and zh.wikipedia lists 242,419/242,669/242,469 variants. Distance to Beijing 140 km (wiki) vs 150 km in text; minor.
- ev-cultural-revolution: Lao She: suicide is the standard account; zh.wikipedia notes a minority murder theory. Deng's factory is 新建县拖拉机修配厂 in zh.wikipedia; zh text says 修造厂 (both names occur in sources).
- ev-ming-great-wall: No retrieved source gives how many days Altan Khan stayed outside Beijing in 1550 (one popular source says three days); "camped outside Beijing for days" is vague enough to stand.
- person-qiu-jin: Arrest date: zh.wikipedia and en.wikipedia put the raid/arrest on 14 July 1907; many Chinese sources (thepaper, etc.) say troops surrounded Datong on 13 July. Text keeps 13 July. Some scholars also treat the 秋风秋雨愁煞人 'only line' story as embellished; zh.wikipedia says she wrote it in her deposition.
- person-qiu-jin: Kinship with Xu Xilin: en.wikipedia calls him her cousin; the only denial found is from Xu's descendants (chinanews 2011) and zh.wikipedia gives no kinship. I neutralised the wording rather than assert either side.
- person-xu-xiake: Who sent him home in 1640: zh.wikipedia 徐霞客游记 says the local prefect (当地知府), unnamed; the en story names Mu Zeng of Lijiang, the zh story says 丽江土司. Widely repeated but not confirmed in a retrieved source. 'Hundreds of caves in Guangxi' is loose: counts vary (100-300+) and cover Guangxi, Guizhou and Yunnan. Also the Five Sacred Peaks were not all visited before 1636 (Hengshan in Hunan came on the 1637 leg).
- person-hua-tuo: The 'powder dissolved in wine' detail comes from the Hou Han shu (以酒服麻沸散); the Sanguozhi, to which the story credits the case list, says only that the patient drank the powder. 'Huai and Si rivers' is a gloss on 游学徐土. Neither is wrong enough to change.
- ev-china-joins-wto: The 'hair turned white' quip is credited to Long Yongtu in most Chinese reporting, but Sina's 2001 coverage says Zhu Rongji also used it. The tariff fall from 15.3% to 9.8% was completed by 2005 or 2010, depending on the source.
- place-xian: en.wikipedia Chang'an gives about 78 km² inside the walls and about 110 wards; Chinese sources usually say 84 km² and 108 坊. The text follows the Chinese figures, which is defensible.
- person-koxinga: The 'high tide' at Luermen is the traditional account; I found no retrieved source that ties the crossing to the tide. Sources also differ on whether the siege began on 30 March or 30 April 1661.
- place-kaifeng: Later Liang capital: zh.wikipedia lists Kaifeng as capital 907-923, en.wikipedia 913-923 (Zhu Wen also used Luoyang as capital 909-913). '907' is defensible since Zhu Wen was enthroned at Bianzhou, renamed Dongdu/Kaifeng fu. Population 'may have held a million' follows zh.wikipedia; en.wikipedia gives 600-700k for the 11th century.
- polity-northern-song: Treaty of Chanyuan: en.wikipedia 1005, zh.wikipedia 1004 (lunar 景德元年十二月 = Jan 1005); 1005 is correct in Gregorian terms. 'Population passed 100 million' follows zh.wikipedia (~1.13亿 in 1110); en.wikipedia gives lower overall estimates (~90 million), so this is a contested estimate.
- polity-qing: 'Roughly doubling the territory of the Ming' rests on Wikipedia infobox figures (Ming 1415 ~6.5M km2; Qing 1790 ~13-14.7M km2 incl. vassals); estimates vary by method.
- place-beijing: 'It has been China's capital ever since [1421]' simplifies: the Ming kept Nanjing as nominal capital in the Hongxi era until 1441, and Nanjing was the provisional ROC capital Jan-Mar 1912. Not counted as an error.
- polity-eastern-han: Emperor He: to=105, but he died on 13 Feb 106 (Yuanxing 1, 12th month), per en/zh infoboxes. The list uses Gregorian years elsewhere (e.g. Emperor Huan to=168 for a death in Jan 168, also in the lunar 12th month), so 106 would be more consistent. Within ±1; left as is.
- polity-eastern-jin: Emperor An: to=418 and Emperor Gong from=418, but An died and Gong acceded on 28 Jan 419 (Yixi 14, 12th month) per en/zh infoboxes. Lunar-year convention; within ±1. Also Emperor Yuan from=317: he became King of Jin in 317 and took the imperial throne on 26 Apr 318 (en infobox; the zh infobox says 317). Defensible.
- polity-liu-song: Emperor Ming: from=465, but he took the throne on 9 Jan 466 (Taishi 1 is lunar 465) per en/zh infoboxes. Within ±1.
- polity-chen: Emperor Xuan: from=569 follows en.wikipedia (formal accession 5 Feb 569); zh.wikipedia infobox gives 568 (he deposed Emperor Fei in the 11th month of 568). Both defensible.
- polity-han-zhao: Liu Yao: to=329 matches the en/zh biography infoboxes (captured at Luoyang in the 12th lunar month of 328 = Jan 329), but the zh 汉赵 dynasty infobox gives 318-328. Within ±1.
- polity-western-jin: Emperor Huai: to=313 (his execution at Pingyang, en infobox); zh infobox ends his reign in 311 when he was captured. Defensible; Emperor Min from=313 follows.
- polity-tibetan-empire: Langdarma: from=838 matches zh.wikipedia (838-842); en.wikipedia gives 841-842. Ralpachen from=815 matches en (zh: 816). Songtsen Gampo 618 matches en (618/629); zh gives 629. The polity note already flags the chronology as approximate.
- polity-sui: The 3-ruler list omits Yang Tong (杨侗, Q7422), enthroned at Luoyang in mid-618 after Emperor Yang was killed and deposed in 619, and Yang Hao (618, set up by Yuwen Huaji). As the polity ends in 618 and Yang Tong is often treated as a rival claimant, this is a judgment call; not corrected.
- polity-later-zhao: Shi Hong (石弘, Q1199590, 333-334) is skipped between Shi Le and Shi Hu, and Shi Shi/Shi Zun/Shi Jian/Shi Zhi (349-351) are omitted. The 333-334 gap and the end at 349 make the omission visible, so not corrected; adding Shi Hong would be cheap if completeness is wanted.
- polity-liang: Xiao Yuanming (萧渊明, Emperor Min, 555), installed by Northern Qi between Emperor Yuan and Emperor Jing, is skipped with no visible gap (Yuan to 555, Jing from 555). Xiao Dong (551-552) is also omitted but the gap shows. Notable-only list, so not corrected.
- polity-jin-jurchen: Xizong to 1150 / Hailing from 1150 and Xuanzong to 1224 / Aizong from 1224: zh.wikipedia's table gives 1149 and 1223 (lunar years 皇统九年十二月, 元光二年十二月), which fall in January 1150 and January 1224 Gregorian. The data follows Gregorian, so it is fine; ±1 noted.
- polity-dali: Duan Xingzhi to 1253: zh.wikipedia 大理君主列表 gives 1251–1254 (captured 1254). The data stops at 1253 to match the polity's Wikidata end date, which the note explains. Consider 1254 for the ruler's own end year.
- polity-later-qin: Yao Xing from 394: en.wikipedia gives 394–416, but zh.wikipedia's family tree has 393 (Yao Chang died at the end of lunar 393). ±1 from lunar/Gregorian or first era year (皇初 394); fine.
- polity-later-yan: The polity runs to 409, but the list ends with Murong Xi in 407. It omits Murong Yun (Gao Yun, 407–409), whom zh.wikipedia counts as Later Yan's last ruler or as Northern Yan's founder (disputed), plus the illegitimate usurpers Murong Xiang, Murong Lin and Lan Han. The four rulers listed look like a complete list. Consider adding Murong Yun or noting that the state ends with Murong Xi.
- polity-former-yan: Murong Huang from 337: he succeeded Murong Hui in 333 (zh table 334) and took the title Prince of Yan in 337, when the state begins. Defensible.
- polity-cheng-han: Li Xiong from 304: zh.wikipedia table gives 303 (he led the group after Li Liu died). The polity note explains 304/306; fine.
- polity-yuan: Kublai from 1271 (Great Khan from 1260) is defensible for the Yuan record. Toghon Temür has en '(Huizong)' (Northern Yuan temple name 惠宗) but zh '元顺帝' (Ming-given posthumous name). Both are correct, but the two languages use different designations (en could read 'Emperor Shun / Huizong', or zh '元惠宗（顺帝）妥懽帖睦尔').
- polity-min: Wang Yanjun from 926: en.wikipedia gives 926–935; the zh Template gives 927 (Wang Yanhan was killed in lunar 12th month of 926, i.e. early 927). ±1, fine.
- polity-western-xia: Li Yuanhao from 1038 is the year he proclaimed himself emperor; he succeeded as ruler in 1032. Defensible because the polity starts in 1038.
