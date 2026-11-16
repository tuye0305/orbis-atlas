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
