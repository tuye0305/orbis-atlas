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

## 2026-11 review

Reviewer: independent fact-checker (not the curator). I read every one of the 43 stories that the drafting pass added to existing importance-4/5 events, and checked them claim by claim. I then sampled 48 of the 124 new records (39%) against sources other than the ones the curator cited. Together with the curator's 26, which do not overlap with mine, 74 of 124 new records (60%) now have a second-source check. I also compared the zh name of every new record with its Wikidata or Chinese Wikipedia label. Britannica blocks fetching, so I used search snippets from Britannica and Iranica, World History Encyclopedia, university and museum pages, UN and CIA documents, and Wikipedia together with a second source.

### Corrections to the drafted stories (43 read, 11 corrected)
| Record | Old → New | Reason / source |
| --- | --- | --- |
| ev-first-crusade-levant | "founded four Latin states" → Edessa, Antioch and Jerusalem, with Tripoli added in 1109 | Tripoli was founded after the crusade (standard chronology) |
| ev-hulagu-campaign | Khurshah "surrendered Alamut" → surrendered at Maymun-Diz in Nov 1256, Alamut followed in Dec; "next eighty years" → "until the 1330s" | Wikipedia: Siege of Maymun-Diz / Siege of Alamut (1256); Ilkhanate ended 1335 |
| ev-battle-of-ain-jalut | "roughly equal numbers" → Mamluk army at least as large by most modern estimates | Amitai's estimates as summarised by Medievalists.net and Wikipedia |
| ev-ottoman-mamluk-war | "doubled the Muslim population" (unsupported) → brought Syria, Egypt and the Hejaz under Ottoman rule | No source found for the population claim |
| ev-gallipoli-campaign | French "landed at Cape Helles" on 25 April → diversionary landing at Kum Kale on the Asian shore | AWM "Dawn of the Legend"; Wikipedia: Battle of Kumkale |
| ev-republic-of-turkey | İnönü PM "that same night" → İsmet Pasha (later İnönü) PM the next day | He was appointed on 30 Oct 1923; the surname came in 1934 |
| ev-syrian-civil-war | "UN-documented deaths exceeded 300,000" → OHCHR estimate of ~307,000 *civilian* deaths in 2011–21 | UN News, 28 Jun 2022 |
| ev-battle-of-edessa | "had already beaten two Roman emperors" → defeated Gordian III's army and made Philip pay for peace | Res Gestae Divi Saporis; Philip bought peace and was not beaten |
| ev-battle-of-ankara | cage "is a later embellishment" → "widely doubted by historians as a later embellishment" | JRAS 2011, "Bayezid's Cage" (the question is still debated) |
| ev-iraq-war | "about 100,000 to several hundred thousand" → from 100,000+ documented civilian deaths to survey figures of half a million or more | IBC vs PLOS Medicine 2013 / Lancet 2006 |
| ev-christianization-of-armenia | Rome "still pagan at the time" → Rome, "where Christianity was at best newly tolerated" | With the c. 314 dating, the event falls after the Edict of Milan (313) |

The other 32 stories check out, including every date, number and name in them. Contested topics (Israel 1948, the Armenian genocide, the Iran–Iraq, Gulf, Iraq and Syrian wars, Karbala) are attributed and balanced, and legends are marked as legends.

### Corrections to sampled new records
| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-samarra-capital | lat/lon; summary | 34.3617, 43.8019 (Abu Dulaf Mosque, 15 km north) → 34.2062, 43.8798 (Great Mosque); "was the largest mosque" → "then the largest", built 848–851 | Wikidata Q593115; Archnet |
| ev-battle-of-avarayr | lat/lon; note | 39.34, 45.06 → 38.83, 45.035 (Churs, on the Avarayr plain); note adds Iranica's 2 June date | Wikidata Q5958318; Iranica "Avarayr" |
| place-kayseri | names | Mazaca/Eusebeia until 17 → Mazaca until c. 12 BCE, then Caesarea under Archelaus (client kingdom), then Roman from 17 | Wikipedia: Caesarea (Cappadocia); Britannica |
| place-erzurum | names | Karin, Kingdom of Armenia −50–415 → split at 387 (Roman sector after the partition) | Wikipedia: Erzurum; Peace of Acilisene |
| ev-fall-of-mosul-2014 | summary | Baghdadi "proclaimed a caliphate" from the mosque → first appeared as caliph there after IS declared it | The caliphate was declared on 29 Jun, the sermon given on 4 Jul 2014 |
| ev-roman-arabia-annexed | summary | "province of Arabia Petraea, capital Bostra" → province of Arabia (later called Petraea); governor at Bostra, Petra kept the title metropolis | World History Encyclopedia; Karak Resources Project |
| ev-battle-of-emesa | story | Augusta coins "by 270" → 271–272 | RIC (ric.mom.fr) |
| ev-julian-persian-expedition | summary | "some 65,000 men" → "usually estimated at 65,000 or more" | HistoryNet; Iranica "Jovian" |
| ev-najran-massacre | story | Abraha as "one of" the installed rulers → the commander who overthrew the first one | Wikipedia: Christian community of Najran |
| ev-babak-revolt | summary | executed at Samarra → handed over by an Armenian prince and executed at Samarra in 838 | al-Tabari vol. 33 |
| ev-siege-of-edessa-1144 | story | Edessa "on the upper Euphrates" → east of it | Edessa lies ~45 km from the river |
| ev-battle-of-kose-dag | summary, story | "east of Sivas" → north-east, toward Erzincan; Erzurum taken "1243" → winter 1242–43; Kaykubad's gains made specific (Alanya, Sudak) | Wikipedia: Mongol conquest of Anatolia |
| ev-fall-of-acre-1291 | summary | added that the Templars held Ruad until 1302 | history.co.uk; AramcoWorld review |
| ev-capture-of-hormuz-1622 | summary | "new port of Bandar Abbas" → Gombroon, renamed Bandar Abbas | Kerr, Voyages vol. 9 |
| ev-mount-lebanon-1860 | summary | Mutasarrifate 1861–1915 → 1861–1915, formally until 1918 | Kramer, France and Lebanon |
| ev-iraq-14-july-revolution | summary | left the Baghdad Pact → left it in 1959 | Withdrawal formalised in March 1959 |
| ev-lebanese-civil-war | summary | "some 150,000 … before Taif ended the war" → an estimated 120,000–150,000; Taif 1989, fighting ended Oct 1990 | Wikipedia: War of Liberation (1989–1990); Geopolitical Monitor |
| person-ibn-saud | stops | Kuwait exile 1891 → 1893 (the family left Riyadh in 1891 and reached Kuwait by way of Qatar and Bahrain) | Saudipedia; AramcoWorld |
| person-david-iv-of-georgia | stops | "Crowned at Kutaisi" → "Becomes king at sixteen (capital Kutaisi)" | No source places the coronation there |
| place-konya | summary | Ottomans "absorbed the Karamanid beylik in the 1460s" → took Konya in the 1460s, during their long conquest of Karaman (completed 1474–87) | Wikipedia: Konya |
| polity-nizari-ismaili | summary | Mongols "took its strongholds in 1256" → Alamut and most strongholds; Gerdkuh held out until 1270 | Institute of Ismaili Studies |
| zh names | name.zh | 哈桑·萨巴 → 哈桑·沙巴; 莱赫米王国 → 拉赫姆王国; 加萨尼王国 → 伽珊王国; 巴格拉提德 → 巴格拉图尼; 艾弗里雅·切莱比 → 埃夫利亚·切莱比; 梅斯罗布 → 梅斯罗普 | Chinese Wikipedia titles |

Sampled and confirmed without change: Masada, Zanj, Qarmatians 930, Baghdad 1638, Isfahan 1722, Gulistan, Hamidian massacres, First Nagorno-Karabakh War, Ani 1064 (16 Aug), Holy Sepulchre 1009, Selim I ("nearly doubling" the empire; the Setton/Wisconsin Crusades history gives "doubling"), Ardashir I, Khalid ibn al-Walid, al-Tabari, al-Tusi, Saadi, Rashid al-Din, Evliya Çelebi, Faisal I, Forough Farrokhzad, Mosaddegh (doctorate 1913/14; thesis published 1914), Aleppo, Beirut, Qara Qoyunlu, Zand (a Lak branch of the Lurs), Bagratid Armenia, Lakhmids and Hamdanids.

### Cross-dataset check
No new West Asia record shares an id or QID with any other dataset on this branch, or in the other dataset worktrees (pending PRs). `person-baybars` (Q192960) exists only here. The Africa PR (#14) names Baybars only as a ruler, by QID, inside its Mamluk polity, so there is no duplicate.

### Added (5 records, ≥2 sources each)
- `ev-seljuk-entry-into-baghdad` (1055, importance 4, with story). Wikidata has no item for it, so the record carries one "no qid" warning.
- `ev-ghaznavid-capture-of-rayy` (1029). Its QID is a proxy for the Ghaznavid campaigns in Persia; the year and coordinate diffs are resolved.
- `ev-kuwait-independence-1961`. Its QID is a proxy for Operation Vantage.
- `ev-oman-coup-1970`.
- `polity-al-bu-said` (Oman, 1744–present).
They are not yet linked to `polity-ghaznavid`, `person-mahmud-of-ghazni` or `polity-zanzibar-sultanate`, because those ids exist only in the unmerged Central Asia (#16) and Africa (#14) PRs.

`validate-data` gives 0 errors; the only new West Asia warning is the missing QID above. The build reports 0 open diffs.

## 2026-11 audit (web-sourced)

Independent audit using only pages retrieved during the audit (WebFetch/WebSearch); nothing checked from memory.

- **Seed:** 20261118 (mulberry32 shuffle of the 176 records added or changed against `origin/feat/world-regions`, sorted by id; first 5 records with new stories taken, then filled in shuffle order).
- **Sample (15, 5 with stories):**

| Record | Source(s) retrieved | Result |
|---|---|---|
| ev-battle-of-edessa (story) | en.wikipedia Battle of Edessa | OK (source names Bishapur and Band-e Kaisar; Gundeshapur from the wider tradition) |
| ev-babylonian-talmud (story) | en.wikipedia Babylonian Talmud | OK; **zh fixed**: story rendered the Mishnah 《密释纳》 while the summary uses 《密西拿》 |
| ev-dome-of-the-rock (story) | en.wikipedia Dome of the Rock | OK |
| ev-oil-masjed-soleyman (story) | en.wikipedia William Knox D'Arcy | OK (1914 government stake not in that page) |
| ev-founding-of-baghdad (story) | en.wikipedia Round city of Baghdad | OK (c. 1 km radius; four gates; 100,000 workers per the chroniclers) |
| ev-oman-coup-1970 | en.wikipedia 1970 Omani coup d'état | OK |
| ev-samarra-capital | en.wikipedia Great Mosque of Samarra | OK |
| ev-tehran-conference | en.wikipedia Tehran Conference | OK |
| ev-hamidian-massacres | web search (Études arméniennes contemporaines 2022, Facing History, Wikipedia mirrors) | OK |
| polity-ghassanid | en.wikipedia Ghassanids | OK |
| person-hasan-i-sabbah | en.wikipedia Hasan-i Sabbah | OK |
| ev-kuwait-independence-1961 | en.wikipedia Operation Vantage | OK |
| ev-julian-persian-expedition | en.wikipedia Julian's Persian expedition | OK (five provinces, Corduene among them, plus Nisibis) |
| ev-treaty-of-georgievsk | en.wikipedia Treaty of Georgievsk; search (Iranica, en.wikipedia Georgia within the Russian Empire: 1787 withdrawal, renunciation of Persian ties) | OK |
| person-mani | en.wikipedia Mani | OK |

**Error rate:** 1 of 15 records (7%), a zh rendering inconsistency; no factual errors.
