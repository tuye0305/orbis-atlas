# Verification report: Japan & Korea (`data/japan-korea/`)

Verifier: independent fact-checker agent (separate from the curator).
Scope: 49 events, 13 people, 9 places, 16 polities.

- All QIDs, including rulers, were re-fetched.
- validate-data reports 0 errors. The 2 "no qid" warnings are intentional: these are founding events whose state QIDs were removed.
- Britannica facts come from search snippets, because direct fetches return 403.

## Auto-diff resolutions (12): `resolutions/japan-korea.json`

| Verdict | Count | Keys |
| --- | --- | --- |
| keep-ours | 12 | 11 event coordinates; polity-silla:to 935 |
| fix / disputed | 0 | none |

The Wikidata coordinates were either placeholders or the place where an object is held:

- 35 N 136 E for the Genpei War (placeholder)
- the Korea Strait for the Korean War (placeholder)
- Paris for the Jikji (where the book is kept)

Silla: 892 marks the start of the Later Three Kingdoms; the formal end was 935.

## Fixes made

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| polity-nara-japan | ruler Genmei qid | Q233133 (La Teste-de-Buch, a French commune) → Q233224 | wd.mjs lookup/search |
| ev-todaiji-great-buddha | qid | Q460367 (the temple) → Q11526469 (Tōdai-ji Daibutsu) | wd.mjs search |
| ev-founding-of-joseon, ev-kamakura-shogunate | qid | Q28179 / Q736839 (state items duplicated from polities) → removed; note added | no event items exist |
| person-kim-yu-sin | stop 668 | Pyongyang → Gyeongju; he was named supreme commander but stayed in the capital through illness | Samguk sagi (Kim Yu-sin yeoljeon; Munmu 8) |
| ev-mongol-invasions-of-japan | summary en/zh | the coastal wall applies to 1281 only (built from 1276) | Conlan 2001; Cambridge History of Japan 3 |
| ev-tripitaka-koreana | summary en/zh | carved under the court in exile on Ganghwa; blocks moved to Haeinsa in 1398 | Britannica: Tripitaka Koreana / Haein Temple; UNESCO |
| polity-joseon | summary en/zh | "longest-ruling dynasty / 历时最长" (Silla lasted longer) → "last dynasty, five centuries" | Samguk sagi chronology |
| place-osaka | names | Naniwa capital flag 645–1496 → capital 645–655 only | the record's own note; CHJ vol. 1 |
| 8 events: kamakura-shogunate, kojiki, later-three-kingdoms, sakoku, seokguram, todaiji-great-buddha, tripitaka-koreana, founding-of-joseon | Britannica source title | titles copied from our event names → the real article titles (URLs unchanged; checked to exist) | site:britannica.com searches |

## Curator-flagged items

- **Murasaki 973–1014:** Britannica gives c. 978–c. 1014; the record is medium confidence with a note covering 978. ✓
- **Genji 1008:** 1008 is the earliest diary reference; Britannica gives c. 1010 for completion. The record is medium confidence with a note. ✓
- **Kamakura:** 1185 for the polity and 1192 for the event. Both are standard, and both records are medium confidence with a note. ✓ (event QID removed)
- **Tripitaka 1236–1251:** ✓ (summary fixed).
- **Silla 935:** ✓.

## Spot-checks

| # | Record | Checked | Result |
| --- | --- | --- | --- |
| 1 | all QIDs incl. rulers | label match | 2 fixed, rest ✓ |
| 2 | polity-nara-japan | rulers | fixed |
| 3 | person-murasaki-shikibu | dates, stops | ✓ |
| 4 | ev-tale-of-genji | 1008 | ✓ |
| 5 | ev-kamakura-shogunate / polity-kamakura | 1192 / 1185 | ✓ |
| 6 | ev-tripitaka-koreana | dates, blocks, coords | fixed |
| 7 | polity-silla | rulers | ✓ |
| 8 | person-kim-yu-sin | stops | fixed |
| 9 | ev-mongol-invasions-of-japan | route, summary | fixed |
| 10 | polity-joseon | summary, rulers | fixed |
| 11 | place-osaka | ranges | fixed |
| 12 | place-seoul | 7 ranges | ✓ |
| 13 | place-kaesong | 6 ranges | ✓ |
| 14 | place-pyongyang | 8 ranges | ✓ ("North Korea" from 1945 predates the 1948 DPRK; minor) |
| 15 | place-kyoto / place-tokyo / place-nara / place-gyeongju | ranges | ✓ |
| 16 | person-yi-sun-sin | stops | ✓ |
| 17 | person-tokugawa-ieyasu | stops | ✓ |
| 18 | person-oda-nobunaga | stops | ✓ |
| 19 | person-minamoto-no-yoritomo | stops | ✓ |
| 20 | person-taejo-of-goryeo | stops | ✓ |
| 21 | ev-battle-of-sekigahara / ev-battle-of-myeongnyang / ev-battle-of-okehazama | dates | ✓ |
| 22 | ev-eulsa-treaty / ev-annexation-of-korea | dates | ✓ |
| 23 | ev-heijo-kyo / ev-heian-kyo | 710 / 794 | ✓ |
| 24 | polity-tokugawa / polity-muromachi | rulers | ✓ |
| 25 | polity-goryeo / polity-balhae / polity-goguryeo / polity-baekje | rulers | ✓ |
| 26 | all 60 Britannica citations | titles vs URLs | 8 fixed |
| 27 | zh terminology, 25 summaries | terms | ✓ |

## 2026-11 expansion

Checked 2026-11-16. The dataset grew from 55 events, 15 people, 9 places and 16 polities to 117 events, 48 people, 18 places and 29 polities. That is +62 events, +33 people, +9 places and +13 polities. The occupation-era governors-general also gained four rulers (Ugaki, Minami, Koiso, Abe). There are 81 stories in all: 32 on existing importance-4/5 events and 49 on new records. Every importance-4/5 event now has a story, and every story is between 80 and 220 words.

**Pipeline.** `validate-data.mjs` reports 0 errors. The only warnings are known `no qid` items (ev-buddhism-reaches-japan, ev-ryukyu-unification). `wd.mjs enrich` resolved 297 QIDs. `build-data.mjs` produced 153 diffs; the 11 left open were all resolved as keep-ours (see `resolutions/japan-korea.json`), leaving 0 open. No new id or QID duplicates any record in the other regional datasets.

**Resolved diffs.** Most were Wikidata coordinate placeholders:

- Tenmei famine: generic centre of Japan.
- Satsuma Rebellion: 33N 131E.
- Pacific War: 0N 160W.
- Goryeo–Khitan War: Seoul.
- May 16 coup: centroid of South Korea.

Two coordinates were real places, but not where the event happened:

- Wihwado retreat: Wikidata uses Kaesong, but the retreat was on Wihwa Island in the Yalu.
- Korean Provisional Government: Wikidata uses Seoul, but the government sat in Shanghai.

The remaining diffs were dates:

- Kōyasan: 816 grant, not 810.
- Goryeo–Khitan War: ends 1019 at Gwiju; the peace of 1022 is in the note.
- Azuchi–Momoyama period: ends 1603 to join the Tokugawa band.
- Satsuma Rebellion: Wikidata has an erroneous start year of 2005.

**Spot-checks (30 of 128 new records, 23%).** Each was checked against at least two sources (Britannica, UNESCO, Encyclopedia of Korean Culture, university and museum pages, and Wikipedia):

| # | Record | Checked | Result |
|---|---|---|---|
| 1 | ev-shakushain-revolt | 1669–72, killed at the peace banquet | ✓ |
| 2 | ev-koshamain-war | 1456 incident, 1457 rising, Takeda Nobuhiro | ✓ |
| 3 | person-sho-hashi | 1416 Hokuzan, 1429 Nanzan (Ming records 1415) | ✓, noted |
| 4 | ev-ryukyu-unification | 1429 | ✓ (no QID exists) |
| 5 | ev-satsuma-invasion-of-ryukyu | 1609, Shō Nei taken to Kagoshima | ✓ |
| 6 | person-jang-bogo | Cheonghaejin 828; death 846 (Samguk sagi) vs 841 (Japanese records) | ✓, noted |
| 7 | ev-cheonghaejin | 828, Wando | ✓ |
| 8 | ev-goryeo-khitan-war | Gwiju 1019, Heunghwajin dam | ✓ |
| 9 | person-gang-gam-chan | 948–1031 | ✓ |
| 10 | ev-hwaseong-fortress | 1794–96, Jeong Yak-yong's crane, Uigwe 1801, UNESCO 1997 | ✓ |
| 11 | ev-mount-koya | 816 grant | ✓ |
| 12 | ev-wihwado-retreat | 1388, island in the Yalu | ✓ |
| 13 | person-jang-yeong-sil | birth unknown; c. 1390 vs Wikidata 1400 | low confidence, noted |
| 14 | person-yi-hwang | 1501–1570 | ✓ |
| 15 | person-jeon-bong-jun | 1855–1895 | ✓ |
| 16 | ev-gapsin-coup | 4–6 Dec 1884 | ✓ |
| 17 | ev-eulmi-incident | 8 Oct 1895 | ✓ |
| 18 | ev-assassination-of-ito-hirobumi | 26 Oct 1909, Harbin | ✓ |
| 19 | ev-jeju-uprising | 3 Apr 1948 | ✓ |
| 20 | ev-gwangju-uprising | 18–27 May 1980 | ✓ |
| 21 | ev-dejima | 1636 built, Dutch from 1641 | ✓ |
| 22 | ev-ryukyu-disposition | 1879 | ✓ |
| 23 | ev-okinawa-reversion | 15 May 1972 | ✓ |
| 24 | ev-battle-of-okinawa | Apr–Jun 1945 | ✓ |
| 25 | ev-boshin-war | 1868–69, ends at Hakodate | ✓ |
| 26 | place-sapporo / place-hakodate | Ainu names, Kaitakushi dates | ✓ |
| 27 | polity-chuzan / polity-ryukyu | 1314–1429 / 1429–1879 | ✓ |
| 28 | polity-yamatai | 3rd century, location disputed | low confidence |
| 29 | polity-japanese-korea | governors-general succession | ✓ |
| 30 | all new people | born/died vs Wikidata | ✓ (only Jang Yeong-sil differs) |

**Gaps that remain.** Buddhism in Goguryeo (372) and Gaya are thin. The Ainu are not covered after 1899. The Gaya, Balhae and Ryukyu second Shō dynasty records have no ruler lists beyond the major kings.

## 2026-11 review

Independent reviewer, 2026-11-16. Scope: the 117 records this PR adds (62 events, 33 people, 9 places, 13 polities) and the 32 stories it adds to existing events.

**Sample.** I read 110 of the 117 new records in full: every field, stop, route point and `names` range. The only ones left out were 7 events the curator had already logged. Of those 110, 80 are not in the curator's table. I also read 48 stories in full: 35 on new records and 13 on existing events (Imjin, annexation, March First, Korean War, armistice, Taika, Baekgang, Goguryeo–Tang, Silla–Tang, Later Three Kingdoms, founding of Joseon, Hangul, Myeongnyang, Sekigahara, sakoku, Perry, Meiji Restoration, Buddhism). Every importance-4/5 record was included.

**Checked against.**

- Wikidata labels and dates for every new QID, including rulers (from the cache and `wd.mjs lookup`).
- ja.wikipedia: 長篠の戦い, 白村江の戦い, 琉球侵攻, 北海道.
- en.wikipedia: Invasion of Ryukyu.
- ko.wikipedia: 병자호란, for lunar and solar conversions.
- zh.wikipedia titles, through en→zh langlinks.
- Asian Women's Fund: the text of the Kōno Statement.
- Encyclopedia of Korean Culture: 대가야.
- Cabinet Secretariat and FPCJ: the Ainu policy pages.
- Reporting on the 1965 claims agreement and the 2018/2023 forced-labour rulings.
- Contemporary captions for the 1951 San Francisco conference.

**QIDs.** All new QIDs are the intended subjects. `ev-tanegashima-firearms` uses the item for the gun (Q358057) because no item exists for the event. That is acceptable. No QID duplicates `origin/data/china`. `person-koxinga` stays in data/china and is not duplicated here. Nanjing, the First Sino-Japanese War and the Second Sino-Japanese War are also not duplicated: they live in data/china. `ev-assassination-of-ito-hirobumi` links to `place-harbin` in data/china.

**Coordinates.** I checked all new pins and routes. The Pacific War (Tokyo, not 0N 160W) and the Korean Provisional Government (Shanghai, not Seoul) are correct.

### Corrections

Most errors were lunar or era dates read as Western months.

| Record | Field | Old → New | Reason / source |
| --- | --- | --- | --- |
| ev-battle-of-baekgang | story en/zh | "late August 663" → "early October 663 (eighth lunar month)" | Tenji 2.8.27–28 = 4–5 Oct 663 (Julian); ja.wikipedia 白村江の戦い |
| ev-kaitakushi | story en/zh | Hokkaido name adopted "August 1869" → "September 1869 (eighth month of the old calendar)" | Proclamation of Meiji 2.8.15 = 20 Sept 1869; ja.wikipedia 北海道 |
| ev-second-manchu-invasion | summary, story en/zh, note | Yalu crossing "December 1636" → "12th lunar month of 1636 (early January 1637)"; Ganghwa fell "January" → "mid-February" | 3 Jan and 16 Feb 1637 (solar); ko.wikipedia 병자호란 |
| ev-satsuma-invasion-of-ryukyu | story en/zh | Shuri surrendered "early April" → "early May (fourth month)" | Keichō 14.4.1–5; en.wikipedia Invasion of Ryukyu gives 4–5 May 1609 |
| ev-pillow-book, person-sei-shonagon | story, summary, stop | Teishi died "1000" → "start of 1001" | Chōhō 2.12.16 = 13 Jan 1001 |
| ev-kinkaku-ji | story en/zh | "The Yongle Emperor addressed him as King of Japan" → "The Ming emperors…" | Jianwen's 1402 letter came first; Yongle confirmed the title in 1403–04 |
| ev-koshamain-war | name/summary/story zh; lat/lon | 胡奢魔犬 → 胡奢麻尹; 41.8205,140.84 → 41.7657,140.8224 | zh.wikipedia 胡奢麻尹之战; Wikidata Q11491132 (Shinoridate) |
| ev-imjin-war, ev-first-manchu-invasion, ev-second-manchu-invasion, polity-joseon | zh names/text | 壬辰倭乱 → 万历朝鲜之役（壬辰战争）/壬辰战争; 丁卯胡乱 → 丁卯之役; 丙子胡乱 → 丙子之役 | Neutral 中文维基 titles (萬曆朝鮮之役, 丁卯之役, 丙子之役); 倭/胡 are pejorative Korean-side terms |
| ev-korean-war | summary zh | "朝鲜人民军南下" → "越过三八线进攻南方" | Now matches the en summary ("invaded") |
| ev-pacific-war | story zh | Asian deaths "多达数千万" → "数以百万计" | Now matches the en text |
| ev-annexation-of-korea | story en/zh | "Tens of thousands of guerrillas were killed" → "Japanese army records count well over ten thousand… 1907–1911"; land survey wording made specific | Japanese figures of about 11,400–17,000 killed, cited in Righteous-army literature |
| ev-joseon-tongsinsa | summary en/zh | "twelve embassies… travelled to Edo" → "to Japan, ten of them as far as Edo" | The 1617 embassy stopped at Fushimi and the 1811 embassy at Tsushima; the record's own story agrees |
| place-naha | summary zh | "1954年并入首里" (Naha merged into Shuri) → "1954年合并了首里" | Shuri was merged into Naha |
| person-kim-dae-jung | stop 1971 zh | "险胜朴正熙未果" → "以微弱差距负于朴正熙" | The old phrase was a mistranslation |
| person-yu-gwan-sun | summary/stop zh | "并川阿佤内市场" → "并川集市" | Garbled transliteration |
| person-yi-hwang | note | Lunar birth date added (Jan 1502 Gregorian) | Matches the existing note on his death |
| polity-matsumae | ruler Norihiro | QID added: Q8514298 | `wd.mjs search` |

**Checked and kept.**

- **Nagashino 1575-06-29.** This is the Julian date in ja.wikipedia. en.wikipedia's 28 June is the outlier.
- **San Francisco walkout.** Gromyko's walkout with Poland and Czechoslovakia is attested by contemporary press captions.
- **Resolutions.** All 22 entries in `resolutions/japan-korea.json` were checked, and their reasons hold.

### Additions

- **ev-japan-korea-treaty-1965** (Q485343). The 1965 normalisation, the "already null and void" clause, the $300M and $200M settlement, and the 2018 Supreme Court forced-labour rulings followed by the 2023 Korean fund. The story gives both governments' positions.
- **ev-kono-statement** (Q6429581). The comfort women system, Kim Hak-sun's 1991 testimony, the 1993 statement, the Asian Women's Fund and the 2015 agreement. Disputed figures (20,000 to 200,000 or more) are given as a range in the note.
- **ev-ainu-promotion-act** (Q85869754). Covers the Ainu after 1899: Kayano Shigeru, the 1997 Nibutani ruling and act, the 2008 resolution, the 2019 act and Upopoy (2020). The route covers Nibutani, the Diet and Shiraoi.
- **Story on polity-japanese-korea.** The three phases of rule, assimilation (shrines, language, name changes), labour mobilisation, conscription and comfort stations. The colonial-modernisation debate is noted. The summary now names the mobilisation of labour, soldiers and "comfort women".
- **Story on polity-gaya.** The Suro legend (marked as legend), iron, the shift to Daegaya, the falls in 532 and 562, Kim Yu-sin's descent, and the Mimana/Nihon shoki debate.
- **Rulers.** Guhyeong of Geumgwan Gaya (521–532). Mu of Balhae (719–737). Shō Sei (1527–1555) and Shō Kei (1713–1751). Shō En is now labelled as founder of the Second Shō dynasty.

**Pipeline.** `fmt-data` and `validate-data japan-korea` both pass (0 errors; the warnings are the known no-qid items and the cross-dataset place-harbin link). `wd.mjs enrich` ran, and `build-data` reports 0 open diffs.

**For a human.**

- **Comfort women and forced labour.** Wording on these is balanced, but it is sensitive. A Korea and Japan specialist should read the two new events.
- **The four early Gaya chronology claims** follow the Samguk yusa and are marked low confidence.
- **Daegaya's last king, Doseolji,** has no Wikidata item and was not added.
- **Dokdo/Takeshima** is not covered. The San Francisco treaty story mentions only "small disputed islands".

## 2026-11 audit (web-sourced)

Independent audit using only pages retrieved during the audit (WebFetch/WebSearch); nothing checked from memory.

- **Seed:** 20261115 (mulberry32 shuffle of the 156 records added or changed against `origin/feat/world-regions`, sorted by id; first 5 records with new stories taken, then filled in shuffle order).
- **Sample (15, 10 with stories):**

| Record | Source(s) retrieved | Result |
|---|---|---|
| ev-taika-reform (story) | en.wikipedia Isshi incident | OK (10 July 645; Tennōki burned, Kokki saved) |
| ev-goryeo-khitan-war (story) | en.wikipedia Goryeo–Khitan War | OK (cowhide dam and Gang's age not in source; from Goryeosa per story) |
| ev-perry-expedition (story) | en.wikipedia Perry Expedition | OK |
| ev-battle-of-myeongnyang (story) | en.wikipedia Battle of Myeongnyang | OK |
| ev-silla-tang-war (story) | en.wikipedia Silla–Tang War | OK ("some 30,000 horses"; source 30,080) |
| person-ito-hirobumi | en.wikipedia Itō Hirobumi | OK |
| place-incheon | en.wikipedia History of Incheon | OK (Maesochol/Soseong not in source; consistent with it) |
| ev-great-hanshin-earthquake | web search (Wikipedia, Britannica snippets: 5:46, Mw 6.9 / JMA 7.3, 6,434 dead, Route 43 spans) | OK |
| ev-gapsin-coup | web search (Wikipedia mirror, JACAR glossary: 4 Dec 1884, three days, Yuan Shikai, post office) | OK |
| ev-daisen-kofun (story) | en.wikipedia Mozu Kofun Group; UNESCO WHC 1593 via search (45 components, 49 kofun) | OK |
| polity-yamatai | en.wikipedia Yamatai | OK |
| ev-buddhism-reaches-japan (story) | en.wikipedia Buddhism in Japan; Soga–Mononobe conflict via search (587, Mount Shigi; Asuka-dera begun 588) | OK |
| ev-imjin-war (story) | en.wikipedia Japanese invasions of Korea | OK (23 May 1592, Konishi; >1 million Korean dead) |
| ev-korean-armistice (story) | en.wikipedia Korean Armistice Agreement | OK |
| ev-ako-incident (story) | en.wikipedia Forty-seven rōnin; search (Britannica, Samurai Museum: 21 Apr 1701, same-day sentence) | **zh fixed**: summary 大石内藏助率四十七名浪士 read as 47 plus Ōishi; now 大石内藏助等四十七名浪士 |

**Error rate:** 1 of 15 records (7%), a zh wording ambiguity; no factual errors found. This dataset looks solid.

## 2026-11 story verification (web-sourced)

Checked 2026-11-16. Every story not already checked against a retrieved web source (the 2026-11 audit covered ev-taika-reform, ev-goryeo-khitan-war, ev-perry-expedition, ev-battle-of-myeongnyang, ev-silla-tang-war, ev-daisen-kofun, ev-buddhism-reaches-japan, ev-imjin-war, ev-korean-armistice and ev-ako-incident) was re-read claim by claim against pages retrieved during this check (WebFetch; WebSearch snippets where available). Nothing was accepted from memory. Fixes keep ids; en and zh were corrected together.

**Result:** 76 stories checked; 48 needed a correction or a hedge (63%); 123 text edits (en and zh counted separately).

### Stories checked

| Story | Sources retrieved | Result |
|---|---|---|
| ev-battle-of-baekgang | en.wikipedia: Battle of Baekgang en.wikipedia.org/wiki/Battle_of_Baekgang; zh.wikipedia: 白江口之战 zh.wikipedia.org/wiki/白江口之战; en.wikipedia: Empress Kōgyoku en.wikipedia.org/wiki/Empress_Kōgyoku; Bunka Isan Online: 水城跡 online.bunka.go.jp/db/heritages/detail/191902; tabi-mag: 664 防人・烽 tabi-mag.jp/fu0140/ | fixed — open: Pung's stay in Japan (since 631 per Nihon Shoki) is about 30 years; 'decades' kept. |
| ev-mongol-invasions-of-japan | en.wikipedia: Mongol invasions of Japan en.wikipedia.org/wiki/Mongol_invasions_of_Japan; tabi-mag: 元寇防塁 tabi-mag.jp/fu0270/ | fixed — open: The 20 km wall length is a commonly cited figure (Fukuoka tourism sources), not confirmed in a scholarly source; force sizes are hedged and scholars such as Conlan argue for much smaller numbers. |
| ev-battle-of-tsushima | en.wikipedia: Battle of Tsushima en.wikipedia.org/wiki/Battle_of_Tsushima | fixed |
| ev-tokaido-shinkansen | en.wikipedia: Tōkaidō Shinkansen en.wikipedia.org/wiki/Tōkaidō_Shinkansen; ja.wikipedia: 東海道新幹線 ja.wikipedia.org/wiki/東海道新幹線; Bullet at 60 timeline trainstobeyond.com/bullet-at-60-timeline/; trafficnews: 弾丸列車計画 trafficnews.jp/post/35906 | softened — open: No-fatality safety claim not checked in a retrieved source (widely stated). en.wikipedia suggests early running was limited below 210 km/h in places; ja.wikipedia gives 210 km/h as the opening maximum. |
| ev-tanegashima-firearms | en.wikipedia: Tanegashima (Japanese matchlock) en.wikipedia.org/wiki/Tanegashima_(Japanese_matchlock); ja.wikipedia: 鉄炮記 ja.wikipedia.org/wiki/鉄炮記 | softened — open: Tokitaka (born 1528) was 15, or 16 by traditional reckoning. 'Southwestern barbarians' wording and the large price were not checked against the Teppōki text. |
| ev-great-wave | en.wikipedia: The Great Wave off Kanagawa en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa; Claude Monet Giverny: Japanese prints claudemonetgiverny.fr/en/decouvrir/les-estampes-japonaises/ | softened — open: Monet collected Hokusai prints, but no retrieved source shows that he specifically admired this print. |
| ev-pacific-war | en.wikipedia: Battle of Hong Kong en.wikipedia.org/wiki/Battle_of_Hong_Kong | fixed — open: Other figures (Singapore 80,000, Tokyo raid ~100,000, ~3 million Japanese dead) are standard estimates and were not re-fetched. |
| ev-cheonghaejin | en.wikipedia: Jang Bogo en.wikipedia.org/wiki/Jang_Bogo; en.wikipedia: Ennin en.wikipedia.org/wiki/Ennin; Encyclopedia of Korean Culture encykorea.aks.ac.kr/Article/E0077815 | fixed — open: Jang's death year differs (841 in other records, 846 in Samguk sagi); the story does not give it. |
| ev-provisional-government-of-korea | en.wikipedia: Provisional Government of the Republic of Korea en.wikipedia.org/wiki/Provisional_Government_of_the_Republic_of_Korea | fixed — open: Shirakawa died of his wounds about a month after the bombing; 'killing' kept. |
| ev-kono-statement | en.wikipedia: Kono Statement en.wikipedia.org/wiki/Kono_Statement; en.wikipedia: Kim Hak-sun en.wikipedia.org/wiki/Kim_Hak-sun; UPI / Korea JoongAng Daily on the 2018 dissolution of the foundation koreajoongangdaily.com/korea/korea-shutting-down-comfort-women-fund/… | softened — open: Kim Hak-sun was born 20 Oct 1924, so 66 in Aug 1991 (some sources say 67); age replaced by birth year. |
| ev-goguryeo-tang-war | en.wikipedia: Goguryeo–Tang War en.wikipedia.org/wiki/Goguryeo%E2%80%93Tang_War; en.wikipedia: Siege of Ansi en.wikipedia.org/wiki/Siege_of_Ansi; ko.wikipedia: 연개소문 ko.wikipedia.org/wiki/%EC%97%B0%EA%B0%9C%EC%86%8C%EB%AC%B8; itwiki: 고구려 멸망 itwiki.kr/w/%EA%B3%A0%EA%B5%AC%EB%A0%A4_%EB%A9%B8%EB%A7%9D | fixed — open: Number killed in 642: Samguk sagi says 100-odd, Nihon shoki 180-odd (story's 'some hundred' follows the Samguk sagi). Taizong's regret (Wei Zheng anecdote) is attested only loosely; kept as 'reportedly'. |
| ev-founding-of-joseon | en.wikipedia: Taejo of Joseon en.wikipedia.org/wiki/Taejo_of_Joseon; Search: 조선 국호 조선·화령 후보, 명 태조 선택 (태조실록 1392.11.27; 1393.2 확정) sgsg.hankyung.com/article/2022021823611; itwiki: 정몽주 itwiki.kr/w/%EC%A0%95%EB%AA%BD%EC%A3%BC | fixed — open: Jeong Mong-ju's death 4th lunar month (May 1392) to Yi's enthronement 17th day of 7th lunar month (Aug 1392) is about three and a half months; 'three months later' left as approximate. '518 years' counts 1392–1910 includ |
| ev-annexation-of-korea | en.wikipedia: Japan–Korea Treaty of 1910 en.wikipedia.org/wiki/Japan%E2%80%93Korea_Treaty_of_1910; Search: Righteous army casualties (Japanese official figures ~16,700–17,700 killed 1907–1910; 11,419 killed 1906–1911 per Korean study) d…; AJU News on Hwang Hyeon's death poem ajunews.com/view/20190219100046513 | ok — open: Exact wording of Hwang Hyeon's poem line not retrieved, but the paraphrase matches the well-known line. |
| ev-himiko-embassy-to-wei | en.wikipedia: Himiko en.wikipedia.org/wiki/Himiko | fixed — open: 'Kyushu has the Wei itinerary on its side' is a simplification: both camps reinterpret the itinerary's directions or distances. Left unchanged. |
| ev-battle-of-nagashino | en.wikipedia: Battle of Nagashino en.wikipedia.org/wiki/Battle_of_Nagashino; ja (wikid mirror): 長篠の戦い — 天正3年5月21日＝ユリウス暦1575年6月29日 ja.wikid.org/%E9%95%B7%E7%AF%A0%E3%81%AE%E6%88%A6%E3%81%84 | fixed — open: 29 June is the Julian date (Gregorian 9 July; en.wikipedia gives 28 June). |
| ev-boshin-war | en.wikipedia: Boshin War en.wikipedia.org/wiki/Boshin_War; tabi-mag: 江戸開城 西郷南洲・勝海舟会見の地 (talks 3/13–14 = 5–6 April 1868; castle handed over 4/11 = 3 May 1868) tabi-mag.jp/tk0431/ | fixed — open: Edo population 'a million' not checked in the retrieved text (commonly cited estimate). |
| ev-battle-of-okinawa | en.wikipedia: Cornerstone of Peace en.wikipedia.org/wiki/Cornerstone_of_Peace; Okinawa Prefecture: Cornerstone of Peace — Names to be Inscribed pref.okinawa.jp/site/kodomo/heiwadanjo/heiwa/7797.html; Okinawa Prefecture: number of names inscribed (242,225 as of 23 June 2024) pref.okinawa.jp/heiwakichi/jinken/1008269/1008287/1008296/1008…; Search: Okinawa share of exclusive-use US facilities (~70%; ~62% by count per USFJ article) english.ryukyushimpo.jp/2022/05/17/34677/ | fixed — open: 'Most US bases in Japan' holds for exclusive-use facilities (~62–70% depending on count/area); left unchanged. |
| ev-goryeo-military-regime | Encyclopedia of Korean Culture: 무신정변 encykorea.aks.ac.kr/Article/E0023616; en.wikipedia: Goryeo military regime en.wikipedia.org/wiki/Goryeo_military_regime; itwiki: 무신정변 itwiki.kr/w/%EB%AC%B4%EC%8B%A0%EC%A0%95%EB%B3%80 | fixed — open: Manjeok's quotation is from the Goryeosa (kept as 'reportedly'). |
| ev-division-of-korea | en.wikipedia: Division of Korea en.wikipedia.org/wiki/Division_of_Korea | ok — open: The 'half an hour' detail comes from Rusk's own later recollection; not separately verified in the retrieved text. |
| ev-ainu-promotion-act | en.wikipedia: Nibutani Dam en.wikipedia.org/wiki/Nibutani_Dam; Cultural Survival on the Nibutani decision and 1997 law culturalsurvival.org/node/3330; Cambridge ILR: Kayano et al. v Hokkaido Expropriation Committee cambridge.org/core/journals/international-law-reports/article/kayano-et-a… | ok |
| ev-heijo-kyo | en.wikipedia: Heijō-kyō en.wikipedia.org/wiki/Heij%C5%8D-ky%C5%8D; Nabunken/Bunka-cho search snippets on Heijō Palace mokkan (tens of thousands from the palace site; 3,184 designated National Treasure 201… | softened — open: No source found for 'hundreds of thousands' of mokkan from the palace ditches; available sources speak of tens of thousands from the palace site (larger totals include the Nagaya-ō residence and Nijō-ōji finds in the cit |
| ev-hangul | en.wikipedia: Hangul en.wikipedia.org/wiki/Hangul; ko.wikipedia: 최만리 ko.wikipedia.org/wiki/%EC%B5%9C%EB%A7%8C%EB%A6%AC; en.wikipedia: Hunminjeongeum Haerye en.wikipedia.org/wiki/Hunminjeongeum_Haerye | ok — open: Length of Choe Man-ri's imprisonment ('briefly', reportedly one day) is only weakly sourced; 'briefly' kept. Authenticity of the Gansong copy as a 1446 original is debated by some scholars. |
| ev-march-first-movement | en.wikipedia: March 1st Movement en.wikipedia.org/wiki/March_1st_Movement; ko.wikipedia: 3·1 운동 ko.wikipedia.org/wiki/3%C2%B71_%EC%9A%B4%EB%8F%99; Seoul mediahub (funeral set for 3 March) mediahub.seoul.go.kr/archives/2009543 | ok — open: Accounts differ on whether the signatories phoned the police themselves or had the restaurant owner An Sun-hwan notify them; Korean sources describe them as turning themselves in. |
| ev-mount-koya | en.wikipedia: Kūkai en.wikipedia.org/wiki/K%C5%ABkai; en.wikipedia: Okunoin en.wikipedia.org/wiki/Okunoin; ANA/matcha-jp travel pages: 117 temples on Kōyasan matcha-jp.com/jp/4785 | fixed — open: 'Eight peaks' (the lotus image of 内八葉) not explicitly in sources fetched but standard tradition. |
| ev-honno-ji-incident | en.wikipedia: Honnō-ji incident en.wikipedia.org/wiki/Honn%C5%8D-ji_incident; Japanese press on Chūgoku Ōgaeshi (200–230 km, 8–10 days) gendai.media/articles/-/76614 | softened — open: Nobunaga's retinue size is uncertain (sources give ~70 to ~150 men, or a few dozen pages); 13,000 for Mitsuhide is the conventional figure from later accounts. 'About a week' for the march is at the short end of 8–10-day |
| ev-kaitakushi | en.wikipedia: Hokkaidō Development Commission en.wikipedia.org/wiki/Hokkaid%C5%8D_Development_Commission; Hokkaido Prefecture FAQ on the naming pref.hokkaido.lg.jp/sm/mnj/d/faq/faq02.html; japanese-wiki-corpus: The Development Commission (Shima 1869, office moved to Sapporo May 1871) japanese-wiki-corpus.github.io/history/Th…; en.wikipedia: William S. Clark en.wikipedia.org/wiki/William_S._Clark; Hokkaido Shimbun: first tondenhei at Kotoni 1875 hokkaido-np.co.jp/article/998057/; FPCJ: Ainu Policy Promotion Act 2019 fpcj.jp/wp/wp-content/uploads/2019/11/b8102b519c7b7c4a4e129763f23ed690.pdf | fixed |
| ev-surrender-of-japan | en.wikipedia: Surrender of Japan en.wikipedia.org/wiki/Surrender_of_Japan | fixed — open: Soviet operations in the Kurils continued into early September; 'for days' is a mild understatement but not wrong. |
| ev-wihwado-retreat | ko.wikipedia: 위화도 회군 ko.wikipedia.org/wiki/%EC%9C%84%ED%99%94%EB%8F%84_%ED%9A%8C%EA%B5%B0 | ok — open: Historians debate whether the retreat was spontaneous or a planned coup. |
| ev-jeju-uprising | en.wikipedia: Jeju uprising en.wikipedia.org/wiki/Jeju_uprising; Kyunghyang/Seoul Shinmun on the 2003 report (25,000–30,000 estimate) and Roh's 31 Oct 2003 apology khan.co.kr/article/200310311916431/amp | ok |
| polity-gaya | en.wikipedia: Gaya confederacy en.wikipedia.org/wiki/Gaya_confederacy; Encyclopedia of Korean Culture / Samguk sagi music treatise on King Gasil and Ureuk encykorea.aks.ac.kr/Article/E0077916 | fixed — open: Identification of King Gasil as a Daegaya ruler is common but not certain, so the fix says 'a Gaya king'. |
| ev-heian-kyo | en.wikipedia: Heian-kyō en.wikipedia.org/wiki/Heian-ky%C5%8D; en.wikipedia: Nagaoka-kyō en.wikipedia.org/wiki/Nagaoka-ky%C5%8D | ok — open: That the western half was 'marshy' is not stated in the sources; Wikipedia says only that the low-lying western part near the Katsura River declined. |
| ev-onin-war | en.wikipedia: Ōnin War en.wikipedia.org/wiki/%C5%8Cnin_War; en.wikipedia: Yamana Sōzen en.wikipedia.org/wiki/Yamana_S%C5%8Dzen; Ginkaku-ji (begun 1482) search results, e.g. discoverkyoto.com/places-go/ginkaku-ji/ | fixed — open: The zh text had a typo (足轨). Some sources say Katsumoto's wife was Sōzen's adopted daughter, but the father-in-law tie holds. That ashigaru were 'recruited from the urban poor' is a common description that I did not conf |
| ev-atomic-bombing-of-hiroshima | en.wikipedia: Atomic bombings of Hiroshima and Nagasaki en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki; zh.wikipedia: 广岛市原子弹爆炸 zh.wikipedia.org/zh-cn/广岛市原子弹爆炸; Hiroshima Peace Media: black rain hiroshimapeacemedia.jp/?p=133700; Atomic Archive: Meteorological Observations atomicarchive.com/resources/documents/hiroshima-nagasaki/a-bomb/chapter11.html | fixed — open: Detonation was about 580 m (the story's 'about 600 m' is fine). Total destruction covered about 1.6 km, so 'within two kilometres' is a loose round figure. 70,000–80,000 immediate deaths and about 140,000 by year's end a |
| ev-pillow-book | en.wikipedia: Sei Shōnagon en.wikipedia.org/wiki/Sei_Sh%C5%8Dnagon; en.wikipedia: The Pillow Book en.wikipedia.org/wiki/The_Pillow_Book; Japan Society Boston: Sei Shōnagon japansocietyboston.org/post/sei-shōnagon | ok — open: Her start of service in 993 is marked uncertain in the sources (hence 'about'). The 'dreadfully conceited' wording is one translation (Bowring); others differ. Calling her the 'founder' of zuihitsu is a conventional judg |
| ev-ryukyu-unification | en.wikipedia: Shō Hashi en.wikipedia.org/wiki/Sh%C5%8D_Hashi; ja.wikipedia: 尚巴志 ja.wikipedia.org/wiki/尚巴志; en.wikipedia: Bridge of Nations Bell en.wikipedia.org/wiki/Bridge_of_Nations_Bell; MLIT multilingual text on gusuku (zh) mlit.go.jp/tagengo-db/common/001647355.pdf | softened — open: The 1406 date, the order of the conquests and the 1429 date all rest on the official histories, which the record's note already flags. en.wikipedia notes that no Ming record supports the grant of the Shō surname. |
| ev-iwakura-mission | en.wikipedia: Iwakura Mission en.wikipedia.org/wiki/Iwakura_Mission; National Archives of Japan (credentials, Ōkubo and Itō) digital.archives.go.jp/DAS/pickup/view/print/printArchives/0000000711; Takii (Bismarck speech of 15 March 1873) sh.zjapanr.de/index.php/zjapanr/catalog/download/rechtstransfer-japan-deutschland/22/358?inline=1 | ok — open: 'Half of Japan's new leadership' is a common characterisation that I did not find stated in a retrieved source. Member counts vary (48 officials versus 'about 50'). Tsuda Umeko was 6 (born December 1864). |
| ev-constitution-of-japan | en.wikipedia: Constitution of Japan en.wikipedia.org/wiki/Constitution_of_Japan; en.wikipedia: Beate Sirota Gordon en.wikipedia.org/wiki/Beate_Sirota_Gordon; NDL: Birth of the Constitution of Japan, chronology and March 4–5 session ndl.go.jp/constitution/e/etc/history03.html; Gendai: たった9日間 gendai.media/articles/-/45309 | ok — open: 'Nine days' counts from 4 to 12 February 1946 (draft finished on 10 February, approved on 12 February). en.wikipedia says 'less than a week'. The headcount of about two dozen comes from secondary sources. |
| ev-joseon-tongsinsa | en.wikipedia: Joseon missions to Japan en.wikipedia.org/wiki/Joseon_missions_to_Japan; en.wikipedia: Sō Yoshitoshi en.wikipedia.org/wiki/S%C5%8D_Yoshitoshi; Japanese wiki corpus: Chosen Tsushinshi japanese-wiki-corpus.github.io/history/Chosen Tsushinshi (the Korean Emissary).html; J-CAST on the 2017 UNESCO listing j-cast.com/trend/2020/07/21390507.html; UNESCO nomination media.unesco.org/sites/default/files/webform/mow001/korea_japan_joseon_en.pdf | fixed — open: The 12 missions, the 10 that reached Edo (1617 went only to Fushimi, 1811 only to Tsushima) and retinues of about 336–500 are confirmed. Amenomori's 'sincerity and trust' (誠信) is confirmed by a KCI article. Sources disag |
| ev-april-revolution | en.wikipedia: April Revolution en.wikipedia.org/wiki/April_Revolution; Encyclopedia of Korean Culture: 김주열 encykorea.aks.ac.kr/Article/E0078995; Pressian on the 25 April professors' march (258 professors) pressian.com/pages/articles/116826; Kyunghyang photo caption of the professors' banner khan.co.kr/article/20100417170339A/ | fixed — open: Kim Ju-yul was born 7 October 1944, so he was 15 (16 by Korean reckoning); 17 was wrong. The retrieved sources do not say who found the body, so the fisherman was dropped. The banner wording appears as both 보답하라 and 보답하자 |
| polity-japanese-korea | en.wikipedia: Korea under Japanese rule en.wikipedia.org/wiki/Korea_under_Japanese_rule | ok — open: About 670,000 were taken to Japan including Karafuto, which fits 'several hundred thousand'. 80.3% of households had filed for Japanese-style names by August 1940. Korean was phased out of schools by 1943. Saitō Makoto a |
| ev-later-three-kingdoms | en.wikipedia: Later Three Kingdoms en.wikipedia.org/wiki/Later_Three_Kingdoms; en.wikipedia: Gyeon Hwon en.wikipedia.org/wiki/Gyeon_Hwon; en.wikipedia: Gung Ye en.wikipedia.org/wiki/Gung_Ye; Encyclopedia of Korean Culture: 공산전투 encykorea.aks.ac.kr/Article/E0004338; en.wikipedia: Jinseong of Silla en.wikipedia.org/wiki/Jinseong_of_Silla | ok — open: 'Destroyed Later Baekje at Illicheon' compresses the 936 campaign (victory at Illicheon, then Singeom's surrender at Hwangsan); acceptable simplification. Armour-swap at Gongsan is already flagged as tradition. |
| ev-battle-of-sekigahara | en.wikipedia: Battle of Sekigahara en.wikipedia.org/wiki/Battle_of_Sekigahara; nippon.com: Exploring Japanese History (6.3 million koku, about a third) nippon.com/en/japan-topics/b06917/; en.wikipedia: Ishida Mitsunari (beheaded at Rokujōgawara, Kyoto) en.wikipedia.org/wiki/Ishida_Mitsunari | softened — open: Troop figures vary by source (East 75,000 initially / 88,888 at battle; West 120,000 / 81,890); story's figures are within the range. |
| ev-atomic-bombing-of-nagasaki | en.wikipedia: Atomic bombings of Hiroshima and Nagasaki (Nagasaki section) en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki; en.wikipedia: Takashi Nagai en.wikipedia.org/wiki/Takashi_Nagai; AsiaNews / Fides on Urakami Cathedral as Asia's largest cathedral asianews.it/news-en/The-60th-anniversary-of-the-Nagasaki-atomic-bomb-at… | fixed — open: Wikipedia puts the burst nearly 3 km north-west of the aiming point (Japanese sources: north-north-west); 'north' left as is. ~74,000 deaths by end-1945 matches the Nagasaki city figure (RERF range 60,000-80,000). Nagai' |
| ev-battle-of-dan-no-ura | ja.wikipedia: 壇ノ浦の戦い ja.wikipedia.org/wiki/壇ノ浦の戦い; nippon.com (ja): 黒板勝美の潮流説 is now largely rejected nippon.com/ja/japan-topics/c10509/ | fixed — open: 25 April 1185 is the Julian equivalent of Genryaku 2.3.24. Antoku was six by Western count. |
| ev-satsuma-invasion-of-ryukyu | en.wikipedia: Invasion of Ryukyu en.wikipedia.org/wiki/Invasion_of_Ryukyu | fixed — open: 'Ryukyuans had little experience of war' and the matchlock/Korea-veteran details were not directly confirmed but are commonly stated; Shuri surrendered 4-5 May 1609 (Gregorian). |
| ev-satsuma-rebellion | en.wikipedia: Satsuma Rebellion en.wikipedia.org/wiki/Satsuma_Rebellion; ja.wikipedia: 田原坂の戦い ja.wikipedia.org/wiki/田原坂の戦い; Walkerplus / serai.jp: 上野の西郷隆盛像と犬ツン serai.jp/hobby/300324 | ok — open: en.wikipedia calls Tabaruzaka an eight-day battle, but ja.wikipedia gives 4-20 March (17 days); kept. The Ueno dog was modelled on a Satsuma dog and may not be Saigō's actual dog. |
| ev-treaty-of-san-francisco | en.wikipedia: Treaty of San Francisco en.wikipedia.org/wiki/Treaty_of_San_Francisco; Presidio Trust: The signing of the Pacific security treaties in the Presidio presidio.gov/blog/the-signing-of-the-pacific-security-treati…; Japan Society: Signing of US-Japan Security Treaty 1951 aboutjapan.japansociety.org/signing_usjapan_securitytreaty | softened — open: Whether the Soviet bloc delegations physically walked out is unclear (one Oakland Tribune photo caption says so; treaty histories say they attended and refused to sign). Security Treaty timing: afternoon per US Army film |
| ev-second-manchu-invasion | en.wikipedia: Qing invasion of Joseon en.wikipedia.org/wiki/Qing_invasion_of_Joseon; ko.wikipedia: 병자호란 ko.wikipedia.org/wiki/병자호란; Seoul Shinmun: 병자호란 다시 읽기 (52) — Queen Inyeol died Dec 1635 seoul.co.kr/news/newsView.php?id=20080102022001 | fixed — open: zh '身穿素服' (en 'plain clothes'): Korean sources describe a blue commoner's robe; not changed. |
| ev-gwangju-uprising | en.wikipedia: Gwangju Uprising en.wikipedia.org/wiki/Gwangju_Uprising | ok — open: Army had withdrawn from downtown by evening of 21 May and to the outskirts by 22 May; consistent with story. |
| ev-tale-of-genji | en.wikipedia: The Tale of Genji en.wikipedia.org/wiki/The_Tale_of_Genji; en.wikipedia: Murasaki Shikibu en.wikipedia.org/wiki/Murasaki_Shikibu; intojapanwaraku / The News Lens (54 chapters, ~70 years) thenewslens.com/article/200744 | fixed — open: Michinaga is called 'regent' though he held the formal regency only briefly (de facto regent); left as is. Diary wording 'our young Murasaki' follows one translation. |
| ev-sakoku | en.wikipedia: Sakoku en.wikipedia.org/wiki/Sakoku; en.wikipedia: 1640 Macau embassy to Nagasaki en.wikipedia.org/wiki/1640_Macau_embassy_to_Nagasaki; samurai-archives: 1633 / 1635 edicts samurai-archives.com/wiki/1635; en.wikipedia: Dejima en.wikipedia.org/wiki/Dejima | fixed — open: 1633 edict banned only unlicensed (non-hōshosen) voyages and return after 5+ years abroad; story's 'from 1633 ... from 1635' staging is a simplification but not wrong. |
| ev-korean-war | en.wikipedia: Korean War en.wikipedia.org/wiki/Korean_War; en.wikipedia: Hangang Bridge bombing en.wikipedia.org/wiki/Hangang_Bridge_bombing; en.wikipedia: Hungnam en.wikipedia.org/wiki/Hungnam; ARSOF history: The Refugee Evacuation from Hungnam arsof-history.org/articles/v7n1_hungnam_page_1.html | ok — open: Total deaths (~3 million) and civilian share are estimates (1 million military + 1.5-3 million civilians per en.wikipedia). |
| ev-kenmu-restoration | en.wikipedia: Siege of Kamakura (1333) en.wikipedia.org/wiki/Siege_of_Kamakura_(1333); en.wikipedia: Shikken (Akahashi Moritoki 16th shikken 1326-1333) en.wikipedia.org/wiki/Shikken; en.wikipedia: Battle of Minatogawa en.wikipedia.org/wiki/Battle_of_Minatogawa; en.wikipedia: Mount Senjō / Genkō War en.wikipedia.org/wiki/Genk%C5%8D_War | fixed — open: Escape 'in a fishing boat' and Masashige's rejected advice come from chronicle accounts (Taiheiki, Baishōron); accounts of the vessel differ. The 870 dead at Tōshō-ji is the Taiheiki figure; 'several hundred' is acceptab |
| ev-dejima | en.wikipedia: Dejima en.wikipedia.org/wiki/Dejima; en.wikipedia: Sugita Genpaku en.wikipedia.org/wiki/Sugita_Genpaku; Japan Times: Edo-period weirdness (Kaempfer audience, acting drunk) japantimes.co.jp/news/2020/03/14/national/history/edo-period-era-utte…; Far Outliers: A Shogun Examines Dutchmen faroutliers.com/2004/01/13/a-shogun-examines-dutchmen | ok — open: en.wikipedia credits the shogunate with ordering construction; Nagasaki merchants financed/built it (ja sources) - summary left as is. Typical staff ~ a dozen to twenty; 'a dozen or so' acceptable. |
| ev-ryukyu-disposition | en.wikipedia: Ryukyu Disposition en.wikipedia.org/wiki/Ryukyu_Disposition; Ryukyu Shimpo editorial (4 April 1879 proclamation, ~600 troops and police) ryukyushimpo.jp/editorial/entry-898326.html; en.wikipedia: Shō Tai (d. 19 Aug 1901) en.wikipedia.org/wiki/Sh%C5%8D_Tai; en.wikipedia: Rin Seikō (Fuzhou petitions) en.wikipedia.org/wiki/Rin_Seik%C5%8D | ok — open: en.wikipedia gives 5 April for the Dajōkan announcement and '300 to 400' soldiers; ja sources give 4 April. Exile petitions 'into the 1890s' not specifically verified. |
| ev-japanese-economic-miracle | en.wikipedia: Japanese economic miracle en.wikipedia.org/wiki/Japanese_economic_miracle; Rakuten Securities / JCER on 1956 white paper jcer.or.jp/?p=52192; en.wikipedia: Pollution Diet en.wikipedia.org/wiki/Pollution_Diet | ok — open: 1968 'second-largest economy in the capitalist world' and the 3 treasures / 3Cs not explicitly confirmed by a retrieved source in this pass (standard textbook facts). |
| ev-hwaseong-fortress | en.wikipedia: Hwaseong Fortress en.wikipedia.org/wiki/Hwaseong_Fortress; Suwon City official guide suwon.go.kr/sw-www/sw-visitsuwon/sw-visitsuwon-01/sw-visitsuwon-01-01/sw-visitsuwon-01-01-01.jsp; AKS Sillok wiki: 화성 dh.aks.ac.kr/sillokwiki/index.php/화성(華城) | ok — open: Start/finish dates differ by lunar vs solar calendar (lunar 1st month 1794 = Feb 1794; completion Aug-Sept 1796); 'early 1794' and 'autumn 1796' cover both. |
| ev-june-struggle | en.wikipedia: June Democratic Struggle en.wikipedia.org/wiki/June_Democratic_Struggle; ko.wikipedia: 박종철 고문치사 사건 ko.wikipedia.org/wiki/박종철_고문치사_사건; itwiki: 6·29 선언 (8 points incl. press freedom, Kim Dae-jung amnesty) itwiki.kr/w/6%C2%B729_%EC%84%A0%EC%96%B8 | fixed |
| ev-genpei-war | en.wikipedia: Genpei War en.wikipedia.org/wiki/Genpei_War; Search: Yoritomo escape by boat from Manazuru to Awa after Ishibashiyama (tetsudo-ch.com, serai.jp) tetsudo-ch.com/12194357.html | ok — open: Mochihito's call (May 1180) to his death (June 1180) was about six weeks; 'within weeks' is acceptable. |
| ev-meiji-restoration | en.wikipedia: Meiji Restoration en.wikipedia.org/wiki/Meiji_Restoration; ja.wikipedia: 王政復古 (日本) ja.wikipedia.org/wiki/王政復古_(日本); en.wikipedia: Fall of Edo / Edo Castle en.wikipedia.org/wiki/Fall_of_Edo | fixed — open: The emperor first entered Edo Castle in November 1868, returned to Kyoto, and settled in Tokyo in 1869; 'moved into the shogun's castle' in autumn 1868 is a slight compression. |
| ev-tohoku-earthquake | en.wikipedia: 2011 Tohoku earthquake and tsunami en.wikipedia.org/wiki/2011_T%C5%8Dhoku_earthquake_and_tsunami; en.wikipedia: Okawa Elementary School en.wikipedia.org/wiki/Okawa_Elementary_School; GSI: Oshika 5.3 m ESE displacement gsi.go.jp/chibankansi/chikakukansi_tohoku2.html; Atlas Obscura / Stripes: Miracle pine died, preserved 2013 atlasobscura.com/articles/miracle-tsunami-tree-resurrected-as-sculpture | fixed — open: Summary 'killed about 18,000' counts dead plus missing (~15,900 + ~2,500); official toll incl. disaster-related deaths is ~19,800. |
| ev-kinkaku-ji | en.wikipedia: Kinkaku-ji en.wikipedia.org/wiki/Kinkaku-ji; Search: Ashikaga Yoshimitsu, Ming investiture and tally trade (Wikipedia, samurai-archives) en.wikipedia.org/wiki/Ashikaga_Yoshimitsu | ok — open: The 1394 handover fell in the 12th lunar month (January 1395 Gregorian). Zeami patronage from boyhood not re-fetched, but widely documented. |
| ev-shakushain-revolt | en.wikipedia: Shakushain's revolt en.wikipedia.org/wiki/Shakushain%27s_revolt; ja.wikipedia: シャクシャインの戦い ja.wikipedia.org/wiki/シャクシャインの戦い; Mike Dash, Shakushain's Revolt mikedashhistory.com/2013/06/20/shakushains-revolt/ | softened — open: Rice-per-bale reduction supported only by secondary summaries (2 to down to 7-8 sho). Japanese death toll varies: ~270-273 in most accounts, 356 in ja.wikipedia. |
| ev-meiji-constitution | en.wikipedia: Meiji Constitution en.wikipedia.org/wiki/Meiji_Constitution; en.wikipedia / APJJF: Mori Arinori en.wikipedia.org/wiki/Mori_Arinori | ok — open: Itō's direct study with Gneist and Stein and Roesler's role are standard but not stated in the fetched Wikipedia text; 'Asia's first lasting' wording correctly excludes the suspended 1876 Ottoman constitution. |
| ev-fukushima-daiichi | en.wikipedia: Fukushima nuclear accident en.wikipedia.org/wiki/Fukushima_nuclear_accident | ok — open: Peak evacuees about 164,000 ('more than 150,000' fine). NAIIC 'profoundly manmade' and 2023 water release not re-read in the fetched portion but well known. |
| ev-eulmi-incident | en.wikipedia: Assassination of Empress Myeongseong en.wikipedia.org/wiki/Assassination_of_Empress_Myeongseong | ok — open: Story omits the Japanese-trained Korean Hullyeondae troops who also took part; not an error. 56 men tried at Hiroshima and acquitted. |
| ev-inter-korean-summit-2000 | en.wikipedia: 2000 inter-Korean summit en.wikipedia.org/wiki/2000_inter-Korean_summit; Seoul Shinmun, Aug 2000: reunion of 100 per side resumed after 15 years seoul.co.kr/news/2000/08/18/20000818008001; Southeast Missourian / CSM 2003: special prosecutor on Hyundai payments csmonitor.com/2003/0320/p08s01-woap.html | fixed — open: Nobel announced 13 October, presented 10 December 2000. |
| ev-kamakura-shogunate | en.wikipedia: Minamoto no Yoritomo en.wikipedia.org/wiki/Minamoto_no_Yoritomo; Serai: 源頼朝の死因 serai.jp/hobby/1079845; Serai: 源実朝暗殺 serai.jp/hobby/1100698; Bunshun: 頼朝の征夷大将軍任官 bunshun.jp/articles/-/3883 | softened — open: The exact spot of Sanetomo's murder (on the shrine steps) comes from the Azuma kagami; some writers say the location is uncertain. Left as is. |
| ev-russo-japanese-war | en.wikipedia: Russo-Japanese War en.wikipedia.org/wiki/Russo-Japanese_War; en.wikipedia: Nogi Maresuke en.wikipedia.org/wiki/Nogi_Maresuke; HistoryNet: Spirit of the Samurai historynet.com/spirit-of-the-samurai/ | fixed — open: The night attack was made by destroyers (torpedo-boat destroyers); 'torpedo boats' / 鱼雷艇 is loose but left. Mukden numbers are given as 'about half a million' to ~600,000 depending on source; 'more than half a million' l |
| ev-manyoshu | en.wikipedia: Man'yōshū en.wikipedia.org/wiki/Man%27y%C5%8Dsh%C5%AB; nippon.com: 令和の出典 nippon.com/ja/news/l00250/; Tottori Prefecture PDF on Yakamochi in Inaba pref.tottori.lg.jp/secure/1178238/201910_P02-05.pdf | fixed — open: Reiwa is 'the first era name known to come from a Japanese classic' per the government; the preface itself echoes Zhang Heng's Guitian fu. Left as is. |
| ev-koshamain-war | en.wikipedia: Koshamain's War en.wikipedia.org/wiki/Koshamain%27s_War; ja.wikipedia: コシャマインの戦い ja.wikipedia.org/wiki/コシャマインの戦い; zh.wikipedia search: 胡奢麻尹之战 (name rendering confirmed) | fixed — open: Nobuhiro's marriage into the Kakizaki (adopted heir of Kakizaki Sueshige) is standard but was not confirmed in the pages fetched. |
| ev-tenmei-famine | en.wikipedia: Great Tenmei famine en.wikipedia.org/wiki/Great_Tenmei_famine; ja.wikipedia: 天明の大飢饉 ja.wikipedia.org/wiki/天明の大飢饉 | fixed — open: Tsugaru accounts of eating dogs/straw not individually verified (ja.wikipedia records even cannibalism, so the claim is not overstated). Matsudaira Sadanobu became senior councillor in mid-1787, after the riots; 'success |
| ev-taisho-democracy | en.wikipedia: Taishō Democracy en.wikipedia.org/wiki/Taish%C5%8D_Democracy; en.wikipedia: Hiratsuka Raichō en.wikipedia.org/wiki/Hiratsuka_Raich%C5%8D; Kyoto University thesis abstract on 10 Feb 1913 crowds at the Diet repository.kulib.kyoto-u.ac.jp/dspace/bitstream/2433/174725/1/ybunk006… | ok — open: The number of places hit by the 1918 rice riots ('hundreds') was not confirmed with a figure. |
| ev-bulguksa | en.wikipedia: Bulguksa en.wikipedia.org/wiki/Bulguksa; Encyclopedia of Korean Culture: 불국사 encykorea.aks.ac.kr/Article/E0024933; Kyunghyang Shinmun on the Dharani sutra dating khan.co.kr/article/200904071738165; KoreaScience: 무구정광대다라니경의 간행에 대하여 koreascience.or.kr/article/JAKO200071663777112.page | softened — open: Summary still says 'among the oldest surviving woodblock prints', which is fine as hedged. |
| ev-assassination-of-ito-hirobumi | en.wikipedia: An Jung-geun en.wikipedia.org/wiki/An_Jung-geun; ja.wikipedia: 伊藤博文暗殺事件 ja.wikipedia.org/wiki/伊藤博文暗殺事件; Seoul Shinmun 1992 / Kyunghyang on 단지동맹 of 12 (March 1909) | ok — open: Itō was shot as he turned back from the consular corps after reviewing the guard; 'walked along the platform reviewing the honour guard' is close enough. |
| ev-japan-korea-treaty-1965 | en.wikipedia: Treaty on Basic Relations between Japan and the Republic of Korea en.wikipedia.org/wiki/Treaty_on_Basic_Relations_between_J…; en.wikipedia: June 3 Resistance movement en.wikipedia.org/wiki/June_3_Resistance_movement; Shugiin answer: 併合条約は大韓民国独立時に失効 shugiin.go.jp/internet/itdb_shitsumon.nsf/html/shitsumon/b164324.htm; NPR 6 Mar 2023 compensation plan npr.org/2023/03/06/1161250054/u-s-allies-south-korea-and-japan-move-closer-to-resolve-forced-labor-feud; FRUS 1952-54 on the Kubota remarks history.state.gov/historicaldocuments/frus1952-54v14p2/d624 | ok — open: Some Japanese commentators frame Tokyo's view as 'valid until 1945'; the official Diet answer says the annexation treaty lapsed at Korean independence (1948), matching the text. |

### Corrections

| Record | Field | Old → New | Reason | Source |
|---|---|---|---|---|
| ev-battle-of-baekgang | story.en | “The Chinese histories say the Japanese attacked four times in disordered waves and lost four hundred ships, and that the smoke and flames rose to the sky and the sea turned red.” → “The Chinese histories say the Tang won four engagements and burned four hundred Japanese ships, and that the smoke and flames rose to the sky and the sea turned red.” | Chinese sources say the Tang won four engagements; 'disordered waves' is not their claim | zh.wikipedia 白江口之战 (quotes 新唐书: 四战皆克，焚四百船) zh.wikipedia.org/wiki/白江口之战 |
| ev-battle-of-baekgang | story.zh | “据中国史书记载，倭军队形混乱地四次进攻，损失船只四百艘，烟焰涨天，海水皆赤。” → “据中国史书记载，唐军四战皆捷，焚毁倭船四百艘，烟焰涨天，海水皆赤。” | same as en | zh.wikipedia 白江口之战 (quotes 新唐书: 四战皆克，焚四百船) zh.wikipedia.org/wiki/白江口之战 |
| ev-battle-of-baekgang | story.en | “Korean-style mountain forts and beacons from Tsushima to the Inland Sea.” → “Korean-style mountain forts as far as the Inland Sea, and border guards and beacons on Tsushima, Iki and in Tsukushi.” | beacons were placed on Tsushima, Iki and in Tsukushi, not along the Inland Sea; the forts reached the Inland Sea | Nihon Shoki 664 via tabi-mag tabi-mag.jp/fu0140/ ; zh.wikipedia 白江口之战 (山城 along Seto Inland Sea) |
| ev-battle-of-baekgang | story.zh | “建造朝鲜式山城，并从对马到濑户内海设置烽火台。” → “修建一直延伸到濑户内海沿岸的朝鲜式山城，并在对马、壹岐和筑紫设置防人与烽火台。” | same as en | Nihon Shoki 664 via tabi-mag tabi-mag.jp/fu0140/ ; zh.wikipedia 白江口之战 (山城 along Seto Inland Sea) |
| ev-mongol-invasions-of-japan | story.zh | “摧毁了大部分船只” → “摧毁了大批船只” | zh said 'most' where en says 'much of' | en.wikipedia Mongol invasions of Japan en.wikipedia.org/wiki/Mongol_invasions_of_Japan |
| ev-battle-of-tsushima | story.en | “by the time it reached Asia in May 1905, Port Arthur had already fallen.” → “by the time it reached Asian waters in April 1905, Port Arthur had already fallen, in January.” | the fleet reached Cam Ranh Bay in April, not May | en.wikipedia Battle of Tsushima (fleet at Cam Ranh Bay in April–May 1905; Port Arthur fell 2 January 1905) en.wikipedia.org/wiki/Battle_o… |
| ev-battle-of-tsushima | story.zh | “到1905年5月驶抵亚洲时，旅顺早已陷落。” → “到1905年4月驶抵亚洲海域时，旅顺早已于1月陷落。” | same as en | en.wikipedia Battle of Tsushima (fleet at Cam Ranh Bay in April–May 1905; Port Arthur fell 2 January 1905) en.wikipedia.org/wiki/Battle_o… |
| ev-battle-of-tsushima | story.zh | “罗热斯特文斯基司令” → “罗杰斯特文斯基司令” | standard zh rendering of Rozhestvensky | zh standard name 罗杰斯特文斯基 |
| ev-battle-of-tsushima | story.zh | “罗热斯特文斯基本人被俘” → “罗杰斯特文斯基本人被俘” | standard zh rendering of Rozhestvensky | zh standard name 罗杰斯特文斯基 |
| ev-tokaido-shinkansen | story.en | “whose father had planned a prewar "bullet train" to the continent.” → “whose father had helped plan a prewar "bullet train" on the same corridor.” | the 1939–40 plan was a Tokyo–Shimonoseki line (continental link only a future idea), and Shima Yasujirō was one of its planners, not its sole author | trafficnews 弾丸列車計画 (Tokyo–Shimonoseki plan; Hideo worked on it with his father) trafficnews.jp/post/35906 ; en.wikipedia Tōkaidō Shinkans… |
| ev-tokaido-shinkansen | story.zh | “岛秀雄的父亲曾在战前规划通往大陆的“弹丸列车”。” → “岛秀雄的父亲曾参与规划战前沿同一走廊修建的“弹丸列车”。” | same as en | trafficnews 弾丸列車計画 (Tokyo–Shimonoseki plan; Hideo worked on it with his father) trafficnews.jp/post/35906 ; en.wikipedia Tōkaidō Shinkans… |
| ev-tanegashima-firearms | story.en | “Two of them carried iron tubes that spat fire and could knock a bird from the sky.” → “Two of them, Portuguese, carried long iron tubes that fired shot.” | bird-shooting detail not found in sources on the Teppōki | en.wikipedia Tanegashima (Japanese matchlock) en.wikipedia.org/wiki/Tanegashima_(Japanese_matchlock) ; ja.wikipedia 鉄炮記 https://ja.wikipe… |
| ev-tanegashima-firearms | story.zh | “其中两人携带着能喷火的铁管，可以把飞鸟打下来。” → “其中两名葡萄牙人携带着能发射弹丸的长铁管。” | same as en | en.wikipedia Tanegashima (Japanese matchlock) en.wikipedia.org/wiki/Tanegashima_(Japanese_matchlock) ; ja.wikipedia 鉄炮記 https://ja.wikipe… |
| ev-tanegashima-firearms | story.en | “The sixteen-year-old lord Tanegashima Tokitaka bought” → “The young lord Tanegashima Tokitaka, then about fifteen, bought” | Tokitaka was born in 1528 (15 in 1543; 16 only by traditional count) | en.wikipedia Tanegashima (Japanese matchlock) en.wikipedia.org/wiki/Tanegashima_(Japanese_matchlock) ; ja.wikipedia 鉄炮記 https://ja.wikipe… |
| ev-tanegashima-firearms | story.zh | “年仅十六岁的岛主种子岛时尧” → “年约十五岁的岛主种子岛时尧” | same as en | en.wikipedia Tanegashima (Japanese matchlock) en.wikipedia.org/wiki/Tanegashima_(Japanese_matchlock) ; ja.wikipedia 鉄炮記 https://ja.wikipe… |
| ev-great-wave | story.en | “where Monet, Van Gogh and Debussy admired it;” → “where Van Gogh and Debussy were among its admirers;” | no source ties Monet to this specific print (he collected Japanese prints generally) | en.wikipedia The Great Wave off Kanagawa (Van Gogh's letter; Debussy's 1905 La Mer cover) en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa |
| ev-great-wave | story.zh | “受到莫奈、梵高和德彪西的推崇；” → “受到梵高和德彪西等人的推崇；” | same as en | en.wikipedia The Great Wave off Kanagawa (Van Gogh's letter; Debussy's 1905 La Mer cover) en.wikipedia.org/wiki/The_Great_Wave_off_Kanagawa |
| ev-pacific-war | story.en | “while armies landed in Malaya, Hong Kong and the Philippines.” → “while its armies attacked Malaya, Hong Kong and the Philippines.” | the Hong Kong attack was overland from Guangdong, not a landing | en.wikipedia Battle of Hong Kong (attack crossed the Sham Chun River overland on 8 December) en.wikipedia.org/wiki/Battle_of_Hong_Kong |
| ev-pacific-war | story.zh | “同时陆军在马来亚、香港和菲律宾登陆。” → “同时日军进攻马来亚、香港和菲律宾。” | same as en | en.wikipedia Battle of Hong Kong (attack crossed the Sham Chun River overland on 8 December) en.wikipedia.org/wiki/Battle_of_Hong_Kong |
| ev-cheonghaejin | story.en | “and relied on his men to get home.” → “and relied on Silla traders to get home in 847.” | Ennin returned in 847, after Jang's death, with help from the Silla community in Tang | Encyclopedia of Korean Culture (Ennin returned in 847 with help of Silla people in Tang) encykorea.aks.ac.kr/Article/E0077815 ; en.wikipe… |
| ev-cheonghaejin | story.zh | “回国时也依靠了他部下的帮助。” → “847年回国时也依靠了在唐新罗人的帮助。” | same as en | Encyclopedia of Korean Culture (Ennin returned in 847 with help of Silla people in Tang) encykorea.aks.ac.kr/Article/E0077815 ; en.wikipe… |
| ev-provisional-government-of-korea | story.en | “several rival governments-in-exile had been announced, in Seoul, in Vladivostok and in Shanghai.” → “several rival provisional governments had been announced, in Vladivostok, Shanghai and Seoul.” | the Seoul (Hanseong) government was not in exile; order of proclamation corrected | en.wikipedia Provisional Government of the Republic of Korea (Maritime Province 17 March, Shanghai 11 April, Hanseong/Seoul 23 April 1919… |
| ev-provisional-government-of-korea | story.zh | “汉城、海参崴和上海相继宣布成立了几个互相竞争的流亡政府” → “海参崴、上海和汉城相继宣布成立了几个互相竞争的临时政府” | '相继' implied wrong order; Seoul government was not in exile | en.wikipedia Provisional Government of the Republic of Korea (Maritime Province 17 March, Shanghai 11 April, Hanseong/Seoul 23 April 1919… |
| ev-kono-statement | story.en | “Kim Hak-sun, then 67, became” → “Kim Hak-sun, born in 1924, became” | born October 1924, she was 66 in August 1991 (sources differ) | en.wikipedia Kim Hak-sun (born 20 October 1924; testified 14 August 1991) en.wikipedia.org/wiki/Kim_Hak-sun |
| ev-kono-statement | story.zh | “时年67岁的金学顺” → “生于1924年的金学顺” | same as en | en.wikipedia Kim Hak-sun (born 20 October 1924; testified 14 August 1991) en.wikipedia.org/wiki/Kim_Hak-sun |
| ev-goguryeo-tang-war | story.en | “besieged Ansi for about two months” → “besieged Ansi for about three months” | Siege of Ansi lasted about three months (summer to autumn 645) | en.wikipedia: Siege of Ansi (20 June–18 Sept 645, about three months) en.wikipedia.org/wiki/Siege_of_Ansi |
| ev-goguryeo-tang-war | story.zh | “围攻安市城约两个月” → “围攻安市城约三个月” | Siege of Ansi lasted about three months | en.wikipedia: Siege of Ansi (20 June–18 Sept 645, about three months) en.wikipedia.org/wiki/Siege_of_Ansi |
| ev-goguryeo-tang-war | story.en | “Then Yeon Gaesomun died in 666” → “Then Yeon Gaesomun died in 665 or 666” | Death year disputed (665 vs 666) | ko.wikipedia: 연개소문 (death 665) ko.wikipedia.org/wiki/%EC%97%B0%EA%B0%9C%EC%86%8C%EB%AC%B8 ; en.wikipedia Goguryeo–Tang War (666) |
| ev-goguryeo-tang-war | story.zh | “666年渊盖苏文去世” → “665年或666年渊盖苏文去世” | Death year disputed (665 vs 666) | ko.wikipedia: 연개소문 (death 665) ko.wikipedia.org/wiki/%EC%97%B0%EA%B0%9C%EC%86%8C%EB%AC%B8 ; en.wikipedia Goguryeo–Tang War (666) |
| ev-founding-of-joseon | story.en | “He asked the Ming emperor to choose a name for the new state;” → “He sent the Ming emperor two candidate names for the new state, Joseon and Hwaryeong;” | Yi submitted two candidate names; Hongwu chose between them | Hankyung 생글생글: 조선 건국 — 조선·화령 두 국호를 명에 올려 조선이 선택됨 sgsg.hankyung.com/article/2022021823611 |
| ev-founding-of-joseon | story.zh | “他请明朝皇帝为新国家选定国号；” → “他把“朝鲜”和“和宁”两个候选国号呈请明朝皇帝选定；” | Yi submitted two candidate names | Hankyung 생글생글: 조선 건국 — 조선·화령 두 국호를 명에 올려 조선이 선택됨 sgsg.hankyung.com/article/2022021823611 |
| ev-himiko-embassy-to-wei | story.en | “Japan enters written history through a Chinese report.” → “Japan's first detailed portrait in writing comes from a Chinese report.” | Overstated first: Wa already appear in Han-era Chinese histories; the Wei zhi is the first detailed account | en.wikipedia: Himiko (Records of the Three Kingdoms c. 297; earlier Han-era mentions of Wa; Hashihaka radiocarbon 240–260) en.wikipedia.o… |
| ev-himiko-embassy-to-wei | story.zh | “日本是通过一份中国记录进入成文历史的。” → “关于日本的第一份详细文字记载出自中国史书。” | Overstated first (earlier Han-era mentions of Wa) | en.wikipedia: Himiko (Records of the Three Kingdoms c. 297; earlier Han-era mentions of Wa; Hashihaka radiocarbon 240–260) en.wikipedia.o… |
| ev-himiko-embassy-to-wei | story.en | “compiled by Chen Shou around 280” → “compiled by Chen Shou in the late third century” | Completion date is uncertain (after 280, commonly c. 285–297); 'around 280' too precise | en.wikipedia: Himiko (Records of the Three Kingdoms c. 297; earlier Han-era mentions of Wa; Hashihaka radiocarbon 240–260) en.wikipedia.o… |
| ev-himiko-embassy-to-wei | story.zh | “陈寿约在280年编成的《魏志》” → “陈寿于3世纪后期编成的《魏志》” | Completion date uncertain | en.wikipedia: Himiko (Records of the Three Kingdoms c. 297; earlier Han-era mentions of Wa; Hashihaka radiocarbon 240–260) en.wikipedia.o… |
| ev-himiko-embassy-to-wei | story.en | “the Nara basin has Makimuku and the Hashihaka mound, built about when Himiko died.” → “the Nara basin has Makimuku and the Hashihaka mound, which some radiocarbon dates place about when Himiko died.” | Hashihaka dating (c. 240–260) rests on contested radiocarbon results; hedge | en.wikipedia: Himiko (Records of the Three Kingdoms c. 297; earlier Han-era mentions of Wa; Hashihaka radiocarbon 240–260) en.wikipedia.o… |
| ev-himiko-embassy-to-wei | story.zh | “后者的年代恰与卑弥呼去世时间相近” → “一些放射性碳测年结果显示后者的年代与卑弥呼去世时间相近” | Hedge contested dating | en.wikipedia: Himiko (Records of the Three Kingdoms c. 297; earlier Han-era mentions of Wa; Hashihaka radiocarbon 240–260) en.wikipedia.o… |
| ev-battle-of-nagashino | story.en | “On 29 June Katsuyori's commanders, against the advice of veterans, charged across the wet ground.” → “On 29 June Katsuyori, against the advice of his veteran generals, sent his army charging across the wet ground.” | The decision to attack was Katsuyori's, against his veteran vassals' advice | en.wikipedia: Battle of Nagashino (vassals advised retreat; Katsuyori chose battle) en.wikipedia.org/wiki/Battle_of_Nagashino |
| ev-battle-of-nagashino | story.zh | “6月29日，武田军将领不顾老将劝阻，冲过泥泞的河滩。” → “6月29日，胜赖不顾老将劝阻，命武田军冲过泥泞的河滩。” | Decision to attack was Katsuyori's | en.wikipedia: Battle of Nagashino (vassals advised retreat; Katsuyori chose battle) en.wikipedia.org/wiki/Battle_of_Nagashino |
| ev-boshin-war | story.en | “negotiated the surrender of Edo Castle in May.” → “negotiated the surrender of Edo Castle in April; it was handed over in May.” | Saigō–Katsu talks were on 5–6 April 1868; the castle was handed over on 3 May | tabi-mag: 江戸開城 会見の地 tabi-mag.jp/tk0431/ |
| ev-battle-of-okinawa | story.en | “lists the names of more than 240,000 people of every nationality who died in the battle.” → “lists the names of more than 240,000 people of every nationality who died in the battle, together with Okinawans who died elsewhere in the war.” | Inscription also covers Okinawans who died outside the battle in the 1931–45 war | Okinawa Prefecture: Names to be Inscribed pref.okinawa.jp/site/kodomo/heiwadanjo/heiwa/7797.html |
| ev-battle-of-okinawa | story.zh | “刻着在这场战役中死去的二十四万多名各国人士的名字。” → “刻着二十四万多名各国死者的名字，既有在这场战役中死去的人，也有在其他地方死于战争的冲绳人。” | Inscription also covers Okinawans who died elsewhere in the war | Okinawa Prefecture: Names to be Inscribed pref.okinawa.jp/site/kodomo/heiwadanjo/heiwa/7797.html |
| ev-goryeo-military-regime | story.en | “a civil official set fire to the beard of the general Jeong Jung-bu at a court festival, and at another outing a young courtier slapped an elderly general in front of the king. In the autumn of 1170, during King Uijong's excursion to the Bohyeonwon pavilion, Jeong and his officers fell upon” → “years earlier a civil official had set fire to the beard of the general Jeong Jung-bu at a court festival. In the autumn of 1170, on King Uijong's excursion to the Bohyeonwon pavilion, a civil official slapped an elderly general in front of the king; when the party reached Bohyeonwon, Jeong and his officers fell upon” | Han Roe's slap of Yi So-eung happened on the same 1170 excursion, just before the coup, not at another outing | Encyclopedia of Korean Culture: 무신정변 encykorea.aks.ac.kr/Article/E0023616 |
| ev-goryeo-military-regime | story.zh | “一次宫廷节庆上，一名文臣烧了将军郑仲夫的胡须；另一次出游时，一名年轻文臣当着国王的面掌掴一位老将。1170年秋，毅宗出游普贤院，郑仲夫等武将突然袭击随行文臣，” → “早年在一次宫廷节庆上，一名文臣烧了将军郑仲夫的胡须。1170年秋，毅宗出游普贤院，途中一名文臣当着国王的面掌掴一位老将；一行人抵达普贤院后，郑仲夫等武将突然袭击随行文臣，” | The slap happened on the same 1170 excursion | Encyclopedia of Korean Culture: 무신정변 encykorea.aks.ac.kr/Article/E0023616 |
| ev-heijo-kyo | story.en | “Archaeologists have recovered hundreds of thousands of mokkan” → “Archaeologists have recovered tens of thousands of mokkan” | 'Hundreds of thousands' from the palace unsupported; sources give tens of thousands from the palace site | Bunka-cho/Nabunken on Heijō Palace mokkan bunka.go.jp/prmagazine/rensai/bunkazai/bunkazai_042.html |
| ev-heijo-kyo | story.zh | “出土了数十万枚木简” → “出土了数万枚木简” | 同英文修正 | Bunka-cho/Nabunken bunka.go.jp/prmagazine/rensai/bunkazai/bunkazai_042.html |
| ev-mount-koya | story.en | “holds the graves of emperors, warlords and companies.” → “holds the graves and memorials of monks, warlords and companies.” | No source places emperors' graves at Okunoin; sources name monks, feudal lords and corporate memorials | en.wikipedia: Okunoin en.wikipedia.org/wiki/Okunoin |
| ev-mount-koya | story.zh | “长眠着天皇、武将，甚至还有企业的供养塔” → “长眠着僧侣和武将，甚至还有企业的供养塔” | 同英文修正 | en.wikipedia: Okunoin en.wikipedia.org/wiki/Okunoin |
| ev-honno-ji-incident | story.en | “with only a few dozen attendants” → “with only a small retinue” | Retinue size disputed (sources range from dozens of pages to ~150 men) | en.wikipedia: Honnō-ji incident en.wikipedia.org/wiki/Honn%C5%8D-ji_incident |
| ev-honno-ji-incident | story.zh | “他只带着数十名随从” → “他只带着少量随从” | 同英文修正 | en.wikipedia: Honnō-ji incident en.wikipedia.org/wiki/Honn%C5%8D-ji_incident |
| ev-kaitakushi | story.en | “built Sapporo on a grid in 1871 and hired Americans” → “laid out Sapporo on a grid from 1869, moved its headquarters there in 1871, and hired Americans” | Sapporo's construction began in 1869 under Shima Yoshitake; 1871 is when the office moved there | japanese-wiki-corpus: The Development Commission japanese-wiki-corpus.github.io/history/The%20Development%20Commission.html |
| ev-kaitakushi | story.zh | “1871年，开拓使按棋盘格规划建设札幌，并聘请美国人担任顾问” → “开拓使自1869年起按棋盘格规划建设札幌，1871年将本厅迁至此地，并聘请美国人担任顾问” | 同英文修正 | japanese-wiki-corpus: The Development Commission japanese-wiki-corpus.github.io/history/The%20Development%20Commission.html |
| ev-kaitakushi | story.en | “who founded the Sapporo Agricultural College in 1876” → “who organised the new Sapporo Agricultural College in 1876” | The Kaitakushi founded the college; Clark was hired to organise and run it (as head teacher/vice-president) | en.wikipedia: William S. Clark en.wikipedia.org/wiki/William_S._Clark |
| ev-kaitakushi | story.zh | “1876年创办札幌农学校” → “1876年负责筹办札幌农学校” | 同英文修正 | en.wikipedia: William S. Clark en.wikipedia.org/wiki/William_S._Clark |
| ev-surrender-of-japan | story.en | “Near midnight Prime Minister Suzuki Kantarō asked the emperor to decide” → “At an imperial conference in the early hours of 10 August, Prime Minister Suzuki Kantarō asked the emperor to decide” | The conference began near midnight, but Suzuki asked the emperor around 2 a.m. on 10 August | en.wikipedia: Surrender of Japan en.wikipedia.org/wiki/Surrender_of_Japan |
| ev-surrender-of-japan | story.zh | “接近午夜时，首相铃木贯太郎请天皇裁决” → “8月10日凌晨，首相铃木贯太郎在御前会议上请天皇裁决” | 同英文修正 | en.wikipedia: Surrender of Japan en.wikipedia.org/wiki/Surrender_of_Japan |
| polity-gaya | story.en | “to Daegaya at Goryeong, whose musician Ureuk is credited with the twelve-string gayageum.” → “to Daegaya at Goryeong. The Samguk sagi says a Gaya king, Gasil, had the twelve-string gayageum made and the musician Ureuk composed twelve pieces for it.” | Samguk sagi credits King Gasil with making the gayageum; Ureuk composed twelve pieces for it | Encyclopedia of Korean Culture encykorea.aks.ac.kr/Article/E0077916 |
| polity-gaya | story.zh | “相传十二弦伽倻琴就是大伽倻乐师于勒所创。” → “据《三国史记》记载，伽倻的嘉实王命人制作了十二弦伽倻琴，乐师于勒为之创作了十二首乐曲。” | 同英文修正 | Encyclopedia of Korean Culture encykorea.aks.ac.kr/Article/E0077916 |
| ev-onin-war | story.zh | ““足轨”” → ““足轻”” | Typo: ashigaru is 足轻 in Chinese | en.wikipedia: Ōnin War en.wikipedia.org/wiki/%C5%8Cnin_War |
| ev-atomic-bombing-of-hiroshima | story.en | “many survivors remember black rain falling in the afternoon.” → “many survivors remember black rain falling soon after the blast.” | Black rain began about 20–30 minutes to two hours after the 8.15 explosion and was heaviest mid-morning, not in the afternoon | Hiroshima Peace Media hiroshimapeacemedia.jp/?p=133700 ; en.wikipedia: Atomic bombings of Hiroshima and Nagasaki https://en.wikipedia.org… |
| ev-atomic-bombing-of-hiroshima | story.zh | “许多幸存者记得午后下起了黑雨。” → “许多幸存者记得爆炸后不久便下起了黑雨。” | Matches the en fix: the black rain fell in the morning, soon after the blast | Hiroshima Peace Media hiroshimapeacemedia.jp/?p=133700 |
| ev-atomic-bombing-of-hiroshima | summary.zh | ““艾诺拉·盖”号” → ““艾诺拉·盖伊”号” | Truncated name; standard zh rendering (and the story's) is 艾诺拉·盖伊号 | zh.wikipedia: 广岛市原子弹爆炸 zh.wikipedia.org/zh-cn/广岛市原子弹爆炸 |
| ev-ryukyu-unification | story.en | “and the Ming emperor confirmed his family with the surname Shō.” → “and, the histories add, the Ming emperor granted his family the surname Shō.” | The surname grant comes only from the Ryukyuan official histories; no Ming record supports it | en.wikipedia: Shō Hashi en.wikipedia.org/wiki/Sh%C5%8D_Hashi |
| ev-ryukyu-unification | story.zh | “明朝皇帝赐其家族姓“尚”。” → “史书还称，明朝皇帝赐其家族姓“尚”。” | Matches the en hedge: the surname grant is attested only in the Ryukyuan histories | en.wikipedia: Shō Hashi en.wikipedia.org/wiki/Sh%C5%8D_Hashi |
| ev-ryukyu-unification | story.zh | “石砌的“御城”（古斯库）” → “石砌的城堡（琉球称“城”，读作gusuku）” | “御城/古斯库” is not a standard rendering; gusuku is written 城 and glossed in Chinese as 城堡 | MLIT multilingual explanation (zh) mlit.go.jp/tagengo-db/common/001647355.pdf |
| ev-joseon-tongsinsa | story.en | “the Tsushima domain, which lived on trade with Korea, had forged parts of the correspondence to make both sides appear to have taken the first step.” → “Joseon had insisted that Japan write first, so the Tsushima domain, which lived on trade with Korea, forged that letter.” | Garbled account of the forgery: Joseon demanded that the shogun send a letter first, and Tsushima supplied a forged one | en.wikipedia: Sō Yoshitoshi en.wikipedia.org/wiki/S%C5%8D_Yoshitoshi ; Japanese wiki corpus: Chosen Tsushinshi https://japanese-wiki-corp… |
| ev-joseon-tongsinsa | story.zh | “依靠对朝贸易为生的对马藩，曾篡改部分国书，好让双方都觉得是对方先迈出了第一步。” → “由于朝鲜坚持要日本先递国书，依靠对朝贸易为生的对马藩便伪造了这封国书。” | Matches the en fix | en.wikipedia: Sō Yoshitoshi en.wikipedia.org/wiki/S%C5%8D_Yoshitoshi |
| ev-april-revolution | story.en | “On 11 April a fisherman found the body of Kim Ju-yul, a 17-year-old who had vanished during the protest, floating in Masan harbour with a tear-gas grenade lodged in his eye.” → “On 11 April the body of Kim Ju-yul, a 15-year-old student who had vanished during the protest, was found floating in Masan harbour with a tear-gas grenade lodged in his eye.” | Kim Ju-yul was born on 7 October 1944, so he was 15, not 17. The retrieved sources do not support the fisherman detail | Encyclopedia of Korean Culture: 김주열 encykorea.aks.ac.kr/Article/E0078995 |
| ev-april-revolution | story.zh | “4月11日，一名渔民在马山港发现了抗议中失踪的十七岁学生金朱烈的遗体” → “4月11日，人们在马山港发现了抗议中失踪的十五岁学生金朱烈的遗体” | Matches the en fix (age 15, finder unspecified) | Encyclopedia of Korean Culture: 김주열 encykorea.aks.ac.kr/Article/E0078995 |
| ev-april-revolution | story.en | “marched with a banner demanding that those responsible take responsibility.” → “marched behind a banner calling for the students' blood to be repaid.” | The professors' banner read '학생의 피에 보답하라/보답하자' (repay the students' blood), not a demand for accountability | Pressian pressian.com/pages/articles/116826 ; Kyunghyang https://www.khan.co.kr/article/20100417170339A/ |
| ev-april-revolution | story.zh | “打着要求追究责任的横幅上街游行” → “打着“报答学生的鲜血”的横幅上街游行” | Matches the en fix | Kyunghyang khan.co.kr/article/20100417170339A/ |
| ev-battle-of-sekigahara | story.en | “waited until midday before attacking the Western flank; tradition says Ieyasu's guns fired at his position to force a decision.” → “waited, in the traditional account, until midday before attacking the Western flank, and Ieyasu's guns fired at his position to force a decision; some historians now doubt both details.” | Midday hesitation is the conventional account; modern researchers argue Kobayakawa defected from the start, and the gunfire story is a disputed Edo-period anecdote. | en.wikipedia: Battle of Sekigahara en.wikipedia.org/wiki/Battle_of_Sekigahara |
| ev-battle-of-sekigahara | story.zh | “一直观望到正午，才转而攻击西军侧翼；传说是家康命令铁炮队向他的阵地射击，逼他表态。” → “按传统说法一直观望到正午，才转而攻击西军侧翼，其间家康命铁炮队向他的阵地射击，逼他表态；如今有些史学家对这两点都表示怀疑。” | Match en hedge. | en.wikipedia: Battle of Sekigahara en.wikipedia.org/wiki/Battle_of_Sekigahara |
| ev-atomic-bombing-of-nagasaki | story.en | “the bombardier released the plutonium bomb at 11.02 a.m. It exploded over the Urakami valley,” → “the bombardier released the plutonium bomb; it exploded at 11.02 a.m. over the Urakami valley,” | 11:02 is the detonation time; the target was sighted at 11:01 and the bomb fell for 47 seconds. | en.wikipedia: Atomic bombings of Hiroshima and Nagasaki en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki |
| ev-atomic-bombing-of-nagasaki | story.zh | “投弹手于上午11时02分投下钚弹。它在浦上山谷上空爆炸，” → “投弹手投下钚弹，它于上午11时02分在浦上山谷上空爆炸，” | Match en: 11:02 is detonation, not release. | en.wikipedia: Atomic bombings of Hiroshima and Nagasaki en.wikipedia.org/wiki/Atomic_bombings_of_Hiroshima_and_Nagasaki |
| ev-atomic-bombing-of-nagasaki | story.en | “The cathedral, the largest in East Asia, was destroyed” → “The cathedral, then said to be the largest in East Asia, was destroyed” | Superlative is a commonly repeated claim (mostly church sources) about the time, not a present fact; hedge. | AsiaNews: Asia's largest cathedral asianews.it/news-en/The-60th-anniversary-of-the-Nagasaki-atomic-bomb-attack-is-marked-in-Asias-largest… |
| ev-atomic-bombing-of-nagasaki | story.zh | “当时东亚最大的浦上天主堂” → “当时号称东亚最大的浦上天主堂” | Match en hedge. | AsiaNews asianews.it/news-en/The-60th-anniversary-of-the-Nagasaki-atomic-bomb-attack-is-marked-in-Asias-largest-cathedral-3883.html |
| ev-battle-of-dan-no-ura | story.en | “The Tale of the Heike says that the Taira had the better of the morning, riding the tide, and that the current turned at midday.” → “The Tale of the Heike says that the Taira had the better of the morning, riding the strait's swift tide; the modern theory that a midday turn of the current decided the battle is now widely doubted.” | The tidal-reversal explanation is Kuroita Katsumi's 20th-century theory, not the Heike's, and later research largely rejects it. | ja.wikipedia: 壇ノ浦の戦い ja.wikipedia.org/wiki/壇ノ浦の戦い ; nippon.com https://www.nippon.com/ja/japan-topics/c10509/ |
| ev-battle-of-dan-no-ura | story.zh | “据《平家物语》记载，上午平氏借着潮水占了上风，正午潮流逆转。” → “据《平家物语》记载，上午平氏借着海峡湍急的潮水占了上风；至于正午潮流逆转决定胜负之说，是近代学者提出的，如今多受质疑。” | Match en: tide-reversal is a modern theory, not in the Heike. | ja.wikipedia: 壇ノ浦の戦い ja.wikipedia.org/wiki/壇ノ浦の戦い |
| ev-satsuma-invasion-of-ryukyu | story.en | “Ryukyu had angered the new Tokugawa regime by refusing to help with Hideyoshi's Korean war and to send thanks for the return of shipwrecked sailors.” → “Ryukyu had angered Satsuma and the new Tokugawa regime by ignoring demands for troops and supplies for Hideyoshi's Korean war and by failing to thank Ieyasu for the return of shipwrecked sailors.” | The Korean-war demands came from Hideyoshi and the Shimazu, not the Tokugawa; grievance belonged to Satsuma as well. | en.wikipedia: Invasion of Ryukyu en.wikipedia.org/wiki/Invasion_of_Ryukyu |
| ev-satsuma-invasion-of-ryukyu | story.zh | “琉球曾拒绝为丰臣秀吉的朝鲜战争提供援助，也没有为德川政权送还漂流船员一事遣使致谢，因而得罪了新成立的幕府。” → “琉球曾无视萨摩和丰臣秀吉为朝鲜战争征兵征粮的要求，也没有为德川家康送还漂流船员一事遣使致谢，因而得罪了萨摩和新成立的德川幕府。” | Match en. | en.wikipedia: Invasion of Ryukyu en.wikipedia.org/wiki/Invasion_of_Ryukyu |
| ev-treaty-of-san-francisco | story.en | “The Soviet delegate Andrei Gromyko denounced the treaty and walked out with Poland and Czechoslovakia;” → “The Soviet delegate Andrei Gromyko denounced the treaty, and the Soviet Union, Poland and Czechoslovakia refused to sign;” | Sources agree the three attended and refused to sign; a walkout is not established. | en.wikipedia: Treaty of San Francisco en.wikipedia.org/wiki/Treaty_of_San_Francisco |
| ev-treaty-of-san-francisco | story.zh | “苏联代表葛罗米柯谴责和约，并与波兰、捷克斯洛伐克一同退场；” → “苏联代表葛罗米柯谴责和约，苏联与波兰、捷克斯洛伐克均拒绝签字；” | Match en. | en.wikipedia: Treaty of San Francisco en.wikipedia.org/wiki/Treaty_of_San_Francisco |
| ev-second-manchu-invasion | story.en | “a Qing army of over 100,000 crossed” → “a Qing army reported at over 100,000 crossed” | 100,000-120,000 is the traditional figure; modern estimates go as low as under 50,000. | ko.wikipedia: 병자호란 ko.wikipedia.org/wiki/병자호란 |
| ev-second-manchu-invasion | story.zh | “十余万清军踏冰渡过鸭绿江” → “号称十余万的清军踏冰渡过鸭绿江” | Match en hedge. | ko.wikipedia: 병자호란 ko.wikipedia.org/wiki/병자호란 |
| ev-second-manchu-invasion | story.en | “when Ganghwa fell with the queen and princes in mid-February,” → “when Ganghwa fell in mid-February and the crown princess and princes sheltering there were captured,” | Injo had no queen at the time (Queen Inyeol died in Dec 1635/Jan 1636); those captured on Ganghwa were the crown princess and Grand Prince Bongnim and others. | ko.wikipedia: 병자호란 ko.wikipedia.org/wiki/병자호란 ; Seoul Shinmun https://www.seoul.co.kr/news/newsView.php?id=20080102022001 |
| ev-second-manchu-invasion | story.zh | “1637年2月中旬江华岛连同王妃和王子一起陷落，” → “1637年2月中旬江华岛陷落，避难岛上的世子嫔和王子们被俘，” | Match en: no queen; crown princess captured. | ko.wikipedia: 병자호란 ko.wikipedia.org/wiki/병자호란 |
| ev-tale-of-genji | story.en | “Within a century it was illustrated in the Genji scrolls;” → “In the twelfth century it was illustrated in the Genji scrolls;” | The Genji scrolls date from the 12th century (c. 1120-40), more than a century after 1008. | en.wikipedia: The Tale of Genji (Genji Monogatari Emaki, 12th century) en.wikipedia.org/wiki/The_Tale_of_Genji |
| ev-tale-of-genji | story.zh | “不到一百年，它就被绘成《源氏物语绘卷》；” → “12世纪，它被绘成《源氏物语绘卷》；” | Same fix as en: scrolls are 12th century, not within a century. | en.wikipedia: The Tale of Genji en.wikipedia.org/wiki/The_Tale_of_Genji |
| ev-sakoku | story.en | “Silver, copper, silk, sugar, medicines and books kept arriving,” → “Silk, sugar, medicines and books kept arriving, paid for largely in Japanese silver and copper,” | Silver and copper were Japan's exports, not imports. | en.wikipedia: Sakoku (outflow of silver and copper) en.wikipedia.org/wiki/Sakoku ; en.wikipedia: Dejima (exports copper, silver) https://… |
| ev-sakoku | story.zh | “白银、铜、生丝、砂糖、药材和书籍源源不断地进出，” → “生丝、砂糖、药材和书籍源源不断地输入，日本则主要以白银和铜支付，” | Match en fix; silver and copper flowed out. | en.wikipedia: Sakoku en.wikipedia.org/wiki/Sakoku |
| ev-sakoku | summary.en | “banned Japanese from travelling abroad, expelled the Portuguese and confined Dutch trade to Dejima in Nagasaki.” → “banned Japanese from travelling abroad and expelled the Portuguese; in 1641 Dutch trade was confined to Dejima in Nagasaki.” | The Dutch were moved to Dejima in 1641, not by the 1630s edicts. | en.wikipedia: Dejima (Dutch moved 1641) en.wikipedia.org/wiki/Dejima |
| ev-sakoku | summary.zh | “禁止日本人出海、驱逐葡萄牙人，并将荷兰贸易限制在长崎出岛。” → “禁止日本人出海、驱逐葡萄牙人；1641年荷兰贸易又被限制在长崎出岛。” | Match en fix (1641). | en.wikipedia: Dejima en.wikipedia.org/wiki/Dejima |
| ev-kenmu-restoration | story.en | “the last Hōjō regent, Takatoki,” → “the Hōjō head and former regent, Takatoki,” | Takatoki was 14th shikken (to 1326); the last shikken was Akahashi Moritoki (1326-33). | en.wikipedia: Shikken en.wikipedia.org/wiki/Shikken |
| ev-kenmu-restoration | story.zh | “末代执权北条高时” → “北条氏家督、前执权北条高时” | Match en fix. | en.wikipedia: Shikken en.wikipedia.org/wiki/Shikken |
| ev-june-struggle | story.en | “Doctors and a Catholic priests' group soon showed that he had been tortured with water.” → “Within days a doctor's account and the autopsy forced police to admit he had died under water torture, and in May a Catholic priests' group exposed a cover-up.” | Torture was established by the doctor/autopsy and police admission (19 Jan); the priests' association revealed the cover-up on 18 May. | ko.wikipedia: 박종철 고문치사 사건 ko.wikipedia.org/wiki/박종철_고문치사_사건 ; en.wikipedia: June Democratic Struggle https://en.wikipedia.org/wiki/June_D… |
| ev-june-struggle | story.zh | “医生和天主教正义实现司祭团很快证明他是被水刑折磨致死的。” → “几天之内，医生的证词和尸检结果迫使警方承认他死于水刑；5月，天主教正义实现司祭团又揭露了当局的掩盖行为。” | Match en fix. | ko.wikipedia: 박종철 고문치사 사건 ko.wikipedia.org/wiki/박종철_고문치사_사건 |
| ev-meiji-restoration | story.en | “The young samurai behind the coup, among them Ōkubo Toshimichi, Saigō Takamori and Kido Takayoshi, won the Boshin War against the shogunate” → “The coup was planned by the court noble Iwakura Tomomi with Satsuma's Ōkubo Toshimichi and Saigō Takamori; joined by Chōshū leaders such as Kido Takayoshi, they won the Boshin War against the shogunate” | Kido (Chōshū) was not involved in the 3 Jan 1868 coup; it was carried out by five domains (Satsuma, Tosa, Aki, Owari, Echizen) under Iwakura, Ōkubo and Saigō | ja.wikipedia: 王政復古 (日本) ja.wikipedia.org/wiki/王政復古_(日本) |
| ev-meiji-restoration | story.zh | “策划这次政变的年轻武士包括大久保利通、西乡隆盛和木户孝允，他们在戊辰战争中击败幕府” → “这次政变由公卿岩仓具视与萨摩藩的大久保利通、西乡隆盛策划；他们与木户孝允等长州藩领袖联手，在戊辰战争中击败幕府” | Same as en: Kido was not a planner of the coup | ja.wikipedia: 王政复古 (日本) ja.wikipedia.org/wiki/王政復古_(日本) |
| ev-meiji-restoration | summary.en | “Samurai from Satsuma and Chōshū proclaimed the restoration of imperial rule in Kyoto on 3 January 1868 and defeated the shogunate in the Boshin War.” → “A Satsuma-led coup in Kyoto had the restoration of imperial rule proclaimed on 3 January 1868, and Satsuma and Chōshū forces then defeated the shogunate in the Boshin War.” | Chōshū troops took no part in the 3 Jan 1868 coup, and the proclamation was issued in the emperor's name | ja.wikipedia: 王政復古 (日本) ja.wikipedia.org/wiki/王政復古_(日本) |
| ev-meiji-restoration | summary.zh | “1868年1月3日，萨摩、长州等藩的武士在京都宣布“王政复古”，并在戊辰战争中击败幕府。” → “1868年1月3日，萨摩藩主导的政变使朝廷在京都宣布“王政复古”，随后萨摩、长州等藩的军队在戊辰战争中击败幕府。” | Same as summary.en | ja.wikipedia: 王政復古 (日本) ja.wikipedia.org/wiki/王政復古_(日本) |
| ev-tohoku-earthquake | story.en | “At Ōkawa Elementary School, 74 pupils and 10 teachers were killed while waiting on the playground.” → “At Ōkawa Elementary School, pupils were kept on the playground for over forty minutes; when they finally set off for higher ground the wave caught them, killing 74 pupils and 10 teachers.” | They were not killed while waiting; they were engulfed after finally leaving the schoolyard toward higher ground | en.wikipedia: Okawa Elementary School en.wikipedia.org/wiki/Okawa_Elementary_School |
| ev-tohoku-earthquake | story.zh | “在大川小学，74名学生和10名教师在操场上等待时遇难。” → “在大川小学，学生们在操场上等待了四十多分钟才动身前往高处，随即被海啸吞没，74名学生和10名教师遇难。” | Same as en | en.wikipedia: Okawa Elementary School en.wikipedia.org/wiki/Okawa_Elementary_School |
| ev-tohoku-earthquake | story.en | “one survived, and is preserved as the "miracle pine".” → “one survived the wave; it later died of salt damage but has been preserved as the "miracle pine".” | The surviving pine died in 2012; what stands is the chemically preserved, reinforced trunk re-erected in 2013 | Atlas Obscura: Miracle Tsunami Tree Resurrected as Sculpture atlasobscura.com/articles/miracle-tsunami-tree-resurrected-as-sculpture |
| ev-tohoku-earthquake | story.zh | “只有一棵幸存，被作为“奇迹之松”保存下来。” → “只有一棵在海啸中幸存，后来因盐害枯死，经防腐加固后作为“奇迹之松”保存下来。” | Same as en | Atlas Obscura: Miracle Tsunami Tree Resurrected as Sculpture atlasobscura.com/articles/miracle-tsunami-tree-resurrected-as-sculpture |
| ev-shakushain-revolt | story.en | “and Japanese merchants took over the fisheries.” → “and Japanese merchants gradually took over the trading posts and fisheries.” | Merchant contracting of trading posts (basho ukeoi) developed over the following decades, not at once; matches zh 逐步 | ja.wikipedia: シャクシャインの戦い ja.wikipedia.org/wiki/シャクシャインの戦い |
| ev-shakushain-revolt | note | “(about 270 traders and sailors)” → “(about 270 traders and sailors; some accounts give 356)” | Death toll differs by source; ja.wikipedia gives 356 | ja.wikipedia: シャクシャインの戦い ja.wikipedia.org/wiki/シャクシャインの戦い |
| ev-inter-korean-summit-2000 | story.en | “for the first time in decades,” → “for the first time since 1985,” | Exchange visits of separated families had already taken place in 1985; August 2000 was the first in 15 years | Seoul Shinmun, 18 Aug 2000 seoul.co.kr/news/2000/08/18/20000818008001 |
| ev-inter-korean-summit-2000 | story.zh | “这是几十年来的第一次。” → “这是1985年以来的第一次。” | Same as en | Seoul Shinmun, 18 Aug 2000 seoul.co.kr/news/2000/08/18/20000818008001 |
| ev-kamakura-shogunate | story.en | “Yoritomo died in 1199 after a fall from his horse.” → “Yoritomo died in 1199, reportedly after a fall from his horse; the cause is still debated.” | The fall is recorded only in a later Azuma kagami entry (1212) and the cause of death is disputed; told as fact | Serai/nippon.com articles on Yoritomo's death serai.jp/hobby/1079845 |
| ev-kamakura-shogunate | story.zh | “1199年赖朝坠马后去世。” → “1199年赖朝去世，据说起因是坠马，但死因至今仍有争议。” | Same softening as en | Serai: 源頼朝の死因 serai.jp/hobby/1079845 |
| ev-russo-japanese-war | story.en | “Japan had won Korea's allegiance from China in 1895 but” → “In 1895 Japan had forced China to give up its suzerainty over Korea, but” | Treaty of Shimonoseki made China recognise Korean independence; Japan did not win Korea's 'allegiance' | en.wikipedia: Treaty of Shimonoseki en.wikipedia.org/wiki/Treaty_of_Shimonoseki |
| ev-russo-japanese-war | story.zh | “1895年日本从中国手中夺得了对朝鲜的控制权，却” → “1895年日本迫使中国放弃了对朝鲜的宗主权，却” | Same as en: overstated 'control' | en.wikipedia: Treaty of Shimonoseki en.wikipedia.org/wiki/Treaty_of_Shimonoseki |
| ev-manyoshu | summary.en | “Japan's oldest poetry anthology gathers” → “Japan's oldest surviving anthology of waka gathers” | The Kaifūsō (751), an anthology of Chinese-style poems, is older; the Man'yōshū is the oldest extant waka anthology (zh already says 和歌集) | en.wikipedia: Man'yōshū en.wikipedia.org/wiki/Man%27y%C5%8Dsh%C5%AB |
| ev-koshamain-war | story.en | “Historians read the war as the first large clash in four centuries of conflict over who would control Ezo and its trade.” → “Historians see the war as the start of about a century of intermittent fighting between Ainu and Wajin over Ezo and its trade.” | Sources describe it as opening a century of intermittent Ainu–Wajin warfare, not four centuries | en.wikipedia: Koshamain's War en.wikipedia.org/wiki/Koshamain%27s_War ; ja.wikipedia: コシャマインの戦い https://ja.wikipedia.org/wiki/コシャマインの戦い |
| ev-koshamain-war | story.zh | “史学家把这场战争视为此后四百年间围绕虾夷地及其贸易控制权的冲突中，第一次大规模的交锋。” → “史学家把这场战争视为此后约一个世纪里阿伊努人与和人围绕虾夷地及其贸易断续交战的开端。” | Same as en | ja.wikipedia: コシャマインの戦い ja.wikipedia.org/wiki/コシャマインの戦い |
| ev-tenmei-famine | story.en | “Many domains had sold their rice reserves to Osaka merchants for cash, and could not feed their people.” → “Many domains had shipped their rice reserves to Edo and Osaka to sell for cash, and could not feed their people.” | Sources say domains depleted reserves by sending rice to Edo (and Osaka) markets, not only to Osaka merchants | ja.wikipedia: 天明の大飢饉 ja.wikipedia.org/wiki/天明の大飢饉 |
| ev-tenmei-famine | story.zh | “许多藩此前已把储备米卖给大阪商人换取现金，此时无力赈济百姓。” → “许多藩此前已把储备米运往江户和大阪出售换取现金，此时无力赈济百姓。” | Same as en | ja.wikipedia: 天明の大飢饉 ja.wikipedia.org/wiki/天明の大飢饉 |
| ev-tenmei-famine | story.en | “Japan lost about 900,000 people between 1780 and 1786.” → “Japan lost more than 920,000 people between 1780 and 1786.” | Figure in the sources is over 920,000 (26.01m to 25.09m) | en.wikipedia: Great Tenmei famine en.wikipedia.org/wiki/Great_Tenmei_famine |
| ev-tenmei-famine | story.zh | “1780至1786年间日本人口减少约九十万。” → “1780至1786年间日本人口减少九十二万以上。” | Same as en | ja.wikipedia: 天明の大飢饉 ja.wikipedia.org/wiki/天明の大飢饉 |
| ev-tenmei-famine | note | “fell by roughly 900,000 between 1780 and 1786.” → “fell by more than 920,000 between 1780 and 1786.” | Keep note consistent with corrected figure | en.wikipedia: Great Tenmei famine en.wikipedia.org/wiki/Great_Tenmei_famine |
| ev-bulguksa | story.en | “It must have been printed before the pagoda was finished around 751, making it among the oldest woodblock prints known.” → “It is usually dated to before 751, when the pagoda was built, which would make it among the oldest woodblock prints known, though some scholars argue it was placed there during Goryeo-era repairs.” | Dating is debated: documents found with it record repairs in 1024 and 1038, and some argue a later deposit or Chinese printing; 'must have been' overstated | Kyunghyang Shinmun 2009 on the dating debate khan.co.kr/article/200904071738165 ; en.wikipedia: Bulguksa https://en.wikipedia.org/wiki/Bu… |
| ev-bulguksa | story.zh | “它必定印制于约751年石塔完工之前，因此是已知最古老的雕版印刷品之一。” → “一般认为它印制于751年石塔建成之前，若此说成立，它便是已知最古老的雕版印刷品之一；但也有学者认为它是高丽时期修塔时才被放入塔中的。” | Same as en | Kyunghyang Shinmun 2009 khan.co.kr/article/200904071738165 |
