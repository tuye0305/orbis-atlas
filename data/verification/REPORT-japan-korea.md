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
