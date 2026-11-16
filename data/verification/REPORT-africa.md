# Verification report: Africa (`data/africa/`)

Verifier: independent fact-checker agent (separate from the curator).

- Validator: 0 errors, 3 warnings. The warnings are records with no Wikidata item: Vandal Carthage, Mansa Musa's hajj and Dias's voyage.
- Britannica refuses direct fetches (403), so Britannica checks rest on search-result snippets.

## Auto-diff resolutions (22): `resolutions/africa.json`

| Key | Verdict |
| --- | --- |
| 15 coordinate diffs: Wikidata gives a country or continent centre, or the wrong site (Maji Maji in Rwanda, Mau Mau at Mombasa) | keep-ours |
| fula-jihads:year | keep-ours (QID fixed) |
| Scramble 1881, AU 2002, Ayyubid end 1250, Ghana from 300, Zagwe from 1137, Marinid from 1244 | keep-ours |
| founding-of-marrakesh:year (1062 vs 1070), benin:from | **disputed**; both medium confidence with a note |

## Fixes

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-fula-jihads-sokoto | qid, date | Q2736105 → Q16707899; date 1804-02-21 added | Britannica: Usman dan Fodio |
| ev-tunisian-revolution | date | 2010-12-18 → 2010-12-17 | Wikipedia infobox |
| ev-ezana-adopts-christianity | year | 330 → 340 (consistent with the person record) | Rufinus; Munro-Hay |
| ev-founding-of-marrakesh | note | removed the Britannica misattribution; 1062/1070 dispute stated | Britannica snippet; Bennison |
| ev-ethiopian-adal-war | summary | 400 Portuguese landed in 1541 | Castanhoso; Pankhurst |
| ev-battle-of-tondibi | note | 12 vs 13 March 1591 | Tarikh al-Sudan; calendar check |
| person-ezana | note, summary | life dates stated as placeholders | Munro-Hay |
| person-nzinga | name.zh | 恩东加 → 恩东戈 | standard term |
| person-nelson-mandela | 1990 stop | → −33.8436, 19.0161 | Drakenstein (Victor Verster) prison |
| person-haile-selassie | 1892 stop | → 9.4833, 42.2333 | Ejersa Goro |
| person-gamal-abdel-nasser | 1958 stop | Damascus → Cairo | Gordon |
| person-samori-ture | summary | rifles wording | Person; UNESCO General History of Africa VII |
| place-cairo | names | 969–973 not capital (Fatimid court from 973); Ottoman provincial capital | Brett |
| place-kinshasa / kisangani / lubumbashi | polity 1960–66 | "Democratic Republic of the Congo" only from 1964 | Nzongola-Ntalaja |
| place-ndjamena | summary | "days earlier" → "five weeks earlier" | Battle of Kousséri |
| polity-ayyubid-egypt | record | removed (duplicate of the West Asia Ayyubid record) | — |
| polity-oyo | capital | → 8.9747, 4.3075 | Old Oyo |
| polity-kanem-bornu | capital | → 13.0833, 12.3667 | Ngazargamu |
| polity-mahdist-sudan | ruler qid | Q307678 added (the Khalifa) | Wikidata |
| polity-benin-kingdom | note | start date disputed | Britannica: Benin |

## Spot-checks (58; ✓ unless marked)

- **Events ✓:**
  - Arab conquest of Egypt; Baqt; Maghreb route; Cairo; al-Azhar
  - Mansa Musa route; Dias; Ridaniya; Alcácer Quibir; Mbwila (approximate); Feyiase (approximate)
  - Atlantic trade; Algeria (ends 1903); Great Trek route; Isandlwana; Berlin Conference; Scramble route
  - Adwa; Italo-Ethiopian War (ends 1936); Congo Crisis (ends 1965); OAU; 1994 election
- **Events fixed:** Ezana; Adal war; Tondibi (note only); Tunisia.
- **People ✓:** Ibn Battuta; Ibn Khaldun; Mansa Musa; Askia Muhammad; Leo Africanus; Ahmad Baba; Usman dan Fodio; Shaka; Menelik/Taytu; Nkrumah; Lumumba; Maathai.
- **People fixed:** Nzinga (zh); Mandela, Haile Selassie, Nasser (stops).
- **Places ✓:** Tunis; Harare; Timbuktu; Djenné.
- **Places fixed:** Cairo; the three Congo cities; N'Djamena.
- **Polities ✓:** rulers of the Ethiopian Empire, Mamluks, Fatimids, Songhai, Mali, Zulu and Dahomey; Aksum span; Kanem–Bornu span; capitals of Mutapa, Asante, Adal and Ghana.
- **Polities fixed:** Kanem–Bornu capital; Oyo; Mahdist.

## Notes for curators

- The schema should allow omitting `born`/`died` for people whose life dates are unknown.
- Kongo's end date of 1888 is the date of Portuguese vassalage; the kingdom lasted in name until 1914.
- Muhammad Ali's dynasty is given as ruling "until 1952", but the monarchy was formally abolished in 1953.

## 2026-11 expansion

Added 56 events, 23 people, 12 places and 17 polities (108 records), filled ruler gaps in 6 existing polities (Saadi, Zagwe, Mutapa, Adal, Oyo, Sokoto) and wrote 101 stories (52 on new records, 49 on existing importance-4/5 events and key people). Diffs: 23 new auto-diffs, all resolved (0 open); most were generic country centroids in Wikidata or QIDs for objects (Rosetta Stone, Lucy) whose Wikidata dates are the object's age, not the event.

### Spot-checks (28 of 108 new records, 26%, against a second source)

- **Places:** Mbanza Kongo (name São Salvador first used by Álvaro I, c. 1570; reverted 1975), Sousse (Hadrumetum → Hunericopolis → Justinianopolis → Susa; Vandal/Byzantine dates uncertain, noted), Luanda (Dutch 1641–48), Gqeberha (renamed 2021), Banjul (Bathurst 1816–1973).
- **Polities:** Ndongo capital Kabasa near N'dalatando (approximate coords, noted); Ndongo end 1671 at Pungo Andongo (Lara 2016, EBSCO): last ruler corrected to João Hari II, who turned against Portugal; Vandal kings; Hafsid and Alaouite reigns; Zanzibar sultans; Muhammad Ali dynasty (abolition 1953 noted).
- **People:** Tippu Tip birth corrected 1832 → 1837 (Britannica); Yaa Asantewaa c. 1840 kept (sources range 1832–1850, disputed); Sunni Ali, Idris Alooma and Dihya birth years marked as placeholders (Wikidata gives accession or impossible years); Funmilayo Ransome-Kuti's visit to China and meeting with Mao confirmed.
- **Event stories:** Fort Jesus: "eleven men and two women" at the fall was not supported; corrected to the captain, nine soldiers and a priest, with the relief fleet arriving a week later. French conquest of Madagascar: combat deaths corrected to "about twenty to twenty-five" (6,000 died of disease). Napier's 44 elephants confirmed (Hansard gives 42; kept 44, the usual figure). Rosetta Stone: "nephew's account" softened to "family story"; an unsupported "since 1972" date for Egypt's restitution requests removed. Rhodesian UDI wording ("phrase by phrase") softened to "deliberately echoed". Haydaran moved to Wikidata's site near Gabès.
- **Stories on existing records:** Mansa Musa, Tondibi, Adwa, Isandlwana, Great Zimbabwe and Dias were re-read against Britannica; no changes needed. Nkrumah's "PG" cap and Barnard's words were web-checked when written.

### Known gaps

- No Nubian polity records for Nobatia and Alodia yet (only Makuria); Garamantes covered by one event, not a polity (no named rulers).
- Hausa states other than Kano, Ife, Luba/Lunda, Rozvi, Ajuran and the Swahili city-states beyond Kilwa have no polity records.
- Several new events have no Wikidata item (e.g. Kanem's conversion, the Nubian missions, Afonso's letters).
