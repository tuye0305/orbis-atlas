# Verification report — West Asia

Verifier: independent fact-checker agent (separate from the curator).
`node scripts/validate-data.mjs west-asia` gives 0 errors and 0 warnings.

## 1. Auto-diff resolutions (22)

| Key | Verdict | Basis |
| --- | --- | --- |
| ev-bar-kokhba-revolt:coord | keep-ours | Betar (Battir), the last stronghold; note added |
| ev-byzantine-sasanian-war-602:coord | keep-ours | Nineveh 627 |
| ev-early-muslim-conquests:year | keep-ours | The conquests outside Arabia begin in 632/633 (Kennedy) |
| ev-battle-of-nahavand:coord | keep-ours | Wikidata copies the al-Qadisiyyah coordinates |
| ev-abbasid-revolution:coord | keep-ours | Kufa (749); route starts at Merv (Iranica: June 747); note added |
| ev-shahnameh:year | keep-ours | Iranica: 400 AH = 8 March 1010 |
| ev-first-crusade-levant:coord | keep-ours | Antioch; new id |
| ev-ottoman-mamluk-war:coord | keep-ours | Marj Dabiq |
| ev-isfahan-capital:year | keep-ours | 1591 is when the square was begun; Iranica gives the transfer as 1598 |
| ev-treaty-of-turkmenchay:coord | keep-ours | Torkamanchay village, not Tabriz |
| ev-persian-constitutional-revolution / ev-iranian-revolution:coord | keep-ours | Tehran, not Iran's centroid |
| ev-young-turk-revolution:coord | keep-ours | Salonica (symbolic, noted) |
| ev-armenian-genocide:coord | keep-ours | Deir ez-Zor (symbolic, noted) |
| ev-arab-revolt:year | keep-ours | Began 10 June 1916 |
| ev-saudi-arabia-1932:year / :coord | keep-ours | Proclaimed 23 Sep 1932 in Riyadh; Wikidata's item is the unification process |
| ev-iran-iraq-war:coord | keep-ours | Khorramshahr |
| ev-iraq-war:coord | keep-ours | Baghdad |
| polity-arsacid-armenia:from | **disputed** | 12 (Vonones I) vs 52/53–66 (Tiridates I, Iranica) |
| polity-kingdom-of-georgia:to | keep-ours | Partition of 1490–91 |
| polity-saudi-arabia:from | keep-ours | 1727 is the Emirate of Diriyah |

## 2. Fixes

| # | Record | Field | Old → New | Source |
| --- | --- | --- | --- | --- |
| W1 | ev-first-crusade | id | → ev-first-crusade-levant | collided with data/europe |
| W2 | ev-conquest-of-mecca | name.zh | 光复麦加 → 征服麦加 | Wikidata zh label Q2092033 |
| W3 | ev-israel-independence | place | place-jerusalem → removed | declared in Tel Aviv (Britannica: Israel) |
| W4 | place-tabriz | names | 1265–1335 [capital] → 1265–1313 [capital] + 1313–1335 | Leiden Iran–Turan: Sultaniyya; Britannica: Soltaniyeh |
| W5 | place-antakya | names[0].capital | true → removed | provincial capital only |
| W6 | place-trabzon, ev-fall-of-trebizond, person-tamar-of-georgia, person-mehmed-ii | zh | 特拉比宗 / 特拉布宗帝国 → 特拉比松 / 特拉比松帝国 | Wikidata zh label Q178913 |
| W7 | polity-islamic-republic-of-iran | note, sources | Khamenei's 2026 end confirmed (killed 28 Feb 2026) | Axios; AP |
| W8–W10 | polity-arsacid-armenia note; notes on bar-kokhba, abbasid-revolution, syrian-civil-war; Tabriz source added | | | |

## 3. Spot-checks (✓ unless stated)

- Mecca 630 (zh name fixed, W2); Abbasid Revolution 747; House of Wisdom c. 830; Shahnameh 1010; Isfahan 1598
- Shapur I born c. 215 (Iranica gives death 270; noted); Georgia 1490; Khamenei 2026 (W7); Nahavand coordinates
- Four symbolic placements — conquests generic point, Sykes–Picot at Damascus, Young Turks at Salonica, genocide at Deir ez-Zor — all defensible and noted
- Israel declaration (fixed, W3); Armenian genocide wording (neutral); Karbala; first revelation and Jesus (claims attributed to tradition)
- Chalcedon; Dead Sea Scrolls (the cited Iranica entry exists); Jerusalem 1099; Hattin; Turkmenchay date; 1953 coup
- Place spans: Jerusalem; Tabriz (W4); Antakya (W5); Tehran; Mecca; Damascus; Trabzon (W6)
- People's stops: Ali, Abbas I, Atatürk, Saladin, Nader Shah
- Rulers: Safavid, Umayyad, Sasanian
- All 200 West Asia QIDs denote the intended item. Proxies: Q4519 is the square, Q251600 the unification, Q6556445 the oil field.

## Open notes

- The build merges all resolution files into one map, hence the new key for the First Crusade.
- The Gulf War "42 countries" figure was not checked against a second source.
