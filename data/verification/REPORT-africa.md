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
