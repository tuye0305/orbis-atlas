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

## 2026-11 expansion

Curator: west-asia deepening agent. Added 66 events, 28 people, 12 places and 18 polities, and wrote 58 event stories: all 51 importance-4/5 events (43 existing, 8 new) plus 7 new importance-3 events. Existing events also gained 25 people and polity links. `validate-data` (all datasets) gives 0 errors and no west-asia warnings. The build reports 0 open diffs.

### Auto-diff (26 new diffs, all resolved)
- **Coordinates (19):** Wikidata gives a country or region centroid, or a clearly wrong point: Lebanon for the 1920 Iraqi revolt and for the Gaza war, the Saudi desert for the Six-Day War. Ours marks the decisive or emblematic site. Each choice is recorded in `resolutions/west-asia.json`, and the record notes where it matters.
- **Dates (7):**
  - Bursa: Wikidata 1317 is the start of the blockade; the city surrendered on 6 April 1326 (Turkish Ministry of Culture).
  - Celali revolts: the record covers only the great wave of 1595–1610.
  - Turkish War of Independence: Wikidata 1922 is a point in time; the war began on 19 May 1919.
  - Marib Dam: Wikidata 1986 is the modern dam.
  - al-Mutanabbi born 915 (Britannica).
  - Hasan-i Sabbah born in the 1050s (Daftary, Iranica).
  - Osman I died 1324 (Britannica; tradition says 1326; low confidence).
  - First Saudi State from 1727 (2022 Founding Day decree; note gives 1744).

### Spot-check: 26 of 124 new records (21%) checked against a second source
| Record | Checked | Result |
| --- | --- | --- |
| person-al-mutanabbi | Britannica (born 915 Kufa, died 23 Sep 965 near Dayr al-ʿAqul) | matches |
| person-osman-i | Britannica: died 1324 or 1326; reburial at Bursa | matches (low confidence, note) |
| person-hasan-i-sabbah | Iranica (Daftary): Qom, 1050s; Alamut 1124 | matches |
| ev-ottoman-capture-of-bursa, place-bursa | Turkish Ministry of Culture: 6 Apr 1326; capital moved to Edirne 1363–66 | matches; note on capital date |
| polity-first-saudi-state | Saudi MOFA, Founding Day: 22 Feb 1727 | matches |
| place-gyumri | Britannica, Wikipedia: Leninakan 1924, then Kumayri 1990, then Gyumri 1992; Alexandropol 1837 or 1840 | **corrected**: added the Kumayri 1990–92 span (had Gyumri from 1990); note on 1837/1840 |
| place-ganja | Azerbaijan Presidential Library, Iranica: Elisavetpol 1804, Kirovabad 1935, Ganja 1989 | matches |
| place-diyarbakir | Diyarbakır municipality, provincial government: renamed Dec 1937 | matches |
| ev-dammam-oil-1938 (story) | Aramco Life, Saudipedia: early March 1938, ~1,440 m, 1,585 bbl/d initially, Steineke, first tanker 1 May 1939 at Ras Tanura | matches |
| ev-gaza-war-2023 (story) | AP/WTOP (Gaza MoH passed 67,000 in Oct 2025); WHO/UNICEF/FAO (IPC famine confirmed in Gaza Governorate, 22 Aug 2025); AP (20 living hostages freed 13 Oct 2025) | **corrected**: "more than 65,000 by late 2025" became "more than 67,000 by October 2025"; "Gaza City" became "Gaza Governorate"; Israel's dispute of the IPC finding added |
| ev-siege-of-kut | 1914-1918-online: 147 days, ~13,000 surrendered 29 Apr 1916, ~23,000 relief casualties | matches |
| ev-izmit-earthquake-1999, ev-bam-earthquake-2003 | PreventionWeb/EBSCO (17,127 official dead, M7.6 USGS); Statistical Centre of Iran via Wikipedia, BBC (26,271 dead, Mw 6.6) | matches |
| polity-kingdom-of-iberia (Vakhtang I) | Wikipedia, Toumanoff/Javakhishvili summaries: reign c. 447/449–502/522, dating problematic | matches; note already flags it |
| person-mesrop-mashtots | Koriun via World History Encyclopedia, encyclopedia.com: Edessa 404, refined at Samosata with the scribe Rufinus 405/406, 36 letters | matches |
| person-baybars, person-nur-al-din | Siege of Antioch 18 May 1268; Krak 1271 (HistoryNet); Inab 29 June 1149 | matches |
| person-mimar-sinan | ArchEyes timeline, B-TU lexicon: Ağırnas, chief architect 1538, Süleymaniye 1557, Selimiye 1575, died 17 Jul 1588 | matches |
| ev-siege-of-acre-1189 | HistoryofWar.org, Medievalists.net: surrender 12 Jul 1191; Muslim prisoners (c. 2,500–3,000) killed 20 Aug 1191 at Ayyadieh | matches (story says "some 2,700") |
| ev-treaty-of-georgievsk, polity-kartli-kakheti | New World Encyclopedia, Georgian Encyclopedia: signed 24 Jul 1783 at Georgievsk; Russia gave no help in 1795 | matches |
| ev-battle-of-krtsanisi | Wikipedia, Georgian Encyclopedia: 8–11 Sep 1795; Tbilisi sacked | matches (Georgian sources call the field battle a draw; the sack is undisputed) |
| ev-halabja-chemical-attack | PBS Frontline, Human Rights Watch via Tufts Atrocity Endings: 16 Mar 1988, 3,200–5,000 dead; often treated as separate from Anfal | **corrected**: 3,000–5,000 became 3,200–5,000; Anfal wording hedged |
| ev-tobacco-protest | encyclopedia.com, Iranica: Talbot concession of 1890; Shirazi fatwa Dec 1891; concession cancelled | matches |

Count: 26 records checked against a fresh web source (21% of 124). A further set was checked against the cited reference works without a new fetch, so it is not counted above: Hafez, Saadi, Rashid al-Din and Mani dates (Iranica), the 1291 siege of Acre, Masada, Najran, and the Zand and Turkmen ruler reigns (Bosworth, Woods).

### Story review
A parallel drafting pass wrote the 43 stories for existing events from each record's summary, sources and note. Four were read in full (Edessa 260, House of Wisdom, Armenian genocide, Masjed Soleyman), and all 58 pass the length and format checks. Their specific details have not been re-checked line by line; they are listed as a follow-up for a verifier. Contested topics are framed with attribution: the Armenian genocide gives the scholarly consensus and Turkey's official denial; Israel 1948 and 1967 cover both Israeli and Palestinian narratives; the Gaza war attributes casualty figures. Legends are flagged as legends: Valerian as footstool, the Tigris running black with ink, Bayezid's cage, the speech at Masada, Hunayn paid in gold.

### Known gaps
- No standalone records yet for the Seljuk entry into Baghdad (1055), Timur's Syrian campaign (1400–01; left to central-asia), the Ghaznavids in Iran, the Muzaffarids, the Afsharid–Zand transition at Mashhad, the Kurdish emirates, or the modern Gulf states besides the UAE.
- The early Nabataean, Himyarite, Lakhmid and Iberian reign dates are approximate.
