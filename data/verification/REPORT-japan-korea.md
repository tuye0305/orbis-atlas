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
