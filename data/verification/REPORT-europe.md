# Verification report: Europe (`data/europe/`)

Verifier: independent fact-checker agent (separate from the curator).
Scope: `events.json` (62), `people.json` (25), `places.json` (15) and `polities.json` (23).
The verdicts for the auto-diffs are in `resolutions/europe.json`.
After the edits, `node scripts/validate-data.mjs europe` reports 0 errors and 0 warnings.

## 1. Auto-diff resolutions (26 of 26 resolved, all keep-ours)

| Key | Verdict | Basis |
| --- | --- | --- |
| ev-dedication-of-hagia-sophia:year | keep-ours | Dedicated on 27 Dec 537 (Procopius, *Buildings* I.1). Wikidata's 532 is when the rebuilding began. |
| ev-plague-of-justinian:endYear | keep-ours | 549 ends the first wave. Wikidata's 750 covers the recurrences (Little 2007). |
| ev-umayyad-conquest-of-hispania:coord | keep-ours | Placed at Guadalete. Wikidata gives a centroid of Iberia. |
| ev-first-crusade:coord | keep-ours | Placed at Clermont, with the full route in `route[]`. Wikidata gives a placeholder in the Levant. |
| ev-hundred-years-war:coord | keep-ours | Orléans (1429). Wikidata gives a centroid of France. |
| ev-black-death:coord | keep-ours | Messina (Oct 1347, Benedictow). Wikidata gives a point in China. |
| ev-fall-of-granada:coord | keep-ours | Wikidata's coordinate is Madrid. |
| ev-columbus-first-voyage:endYear | keep-ours | The record covers the first voyage only (1492–93). |
| ev-columbus-first-voyage:coord | keep-ours | Palos. Wikidata gives a placeholder in the Caribbean. |
| ev-thirty-years-war:coord | keep-ours | Prague Castle (1618). Wikidata gives a centroid of Germany. |
| ev-trial-of-galileo:year | keep-ours | The sentence was passed in 1633 (Finocchiaro). 1610 is when the wider "affair" began. |
| ev-principia:year | keep-ours | Published July 1687 (Westfall). 1680 is Wikidata's inception date. |
| ev-lisbon-earthquake-1755:coord | keep-ours | Placed at the city that was destroyed rather than at the offshore epicentre. |
| ev-french-revolution:coord | keep-ours | The Bastille. Wikidata gives a centroid of France. |
| ev-french-invasion-of-russia:coord | keep-ours | Borodino. Wikidata's point is in Siberia. |
| ev-revolutions-of-1848:coord | keep-ours | Paris (the February Revolution). |
| ev-unification-of-italy:year | keep-ours | 1861 is when the kingdom was proclaimed. 1815 marks the start of the Risorgimento (Riall). |
| ev-unification-of-italy:coord | keep-ours | Turin. Wikidata gives a centroid of Italy. |
| ev-world-war-i:year | keep-ours | The war began on 28 Jul 1914. Wikidata's 1918 is its "point in time", the Armistice. |
| ev-world-war-i:coord | keep-ours | Verdun. Wikidata gives a point in Pomerania. |
| ev-world-war-ii:coord | keep-ours | Westerplatte. Wikidata gives a point in Siberia. |
| ev-eastern-front-wwii:coord | keep-ours | Brest Fortress. Wikidata gives a centroid of the USSR. |
| ev-dissolution-of-the-soviet-union:coord | keep-ours | The Kremlin. Wikidata gives a centroid of the USSR. |
| polity-visigothic-kingdom:from | keep-ours | The foedus of 418 (Collins; *Cambridge Medieval History*). Wikidata's own description gives 418–720. |
| polity-visigothic-kingdom:to | keep-ours | 711 follows Collins, *Visigothic Spain 409–711*. The record is medium confidence, and its note covers Septimania (c. 720). |
| polity-united-kingdom:from | keep-ours | The Acts of Union 1800 took effect on 1 Jan 1801. |

One verdict was added in advance: `person-eleanor-of-aquitaine:born` (keep-ours). The fix below makes her birth year 1122, which opens a new 2-year diff with Wikidata.

## 2. Fixes

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-battle-of-tours | lat/lon, note | [46.9876, 0.5344] → [46.7811, 0.5406] (Moussais-la-Bataille) | The old point was the Tours–Poitiers midpoint, although the note called it Moussais. Britannica *Battle of Tours*; en.wikipedia infobox |
| ev-black-death | route Marseille year | 1348 → 1347 | The plague arrived c. 1 Nov 1347 (Benedictow 2004) |
| ev-principia | date, note | 1687-07-05 → 1687-07-15 | 5 July is the Julian (O.S.) date; the atlas uses Gregorian dates after 1582 |
| ev-sack-of-rome-410 | polities | polity-visigothic-kingdom removed | That polity begins in 418 |
| ev-battle-of-the-catalaunian-plains | note | "between Châlons and Troyes" → "by the 'Camp d'Attila', La Cheppe, NE of Châlons" | The coordinates (49.0, 4.5) lie NE of Châlons |
| person-eleanor-of-aquitaine | born, note | 1124 → 1122 | Britannica c. 1122, which fits her age of 82 at death |
| place-paris | names[1792→] polity | "republics and empires" → "republics, empires and restored monarchies" | The old label left out the monarchies of 1814–48 |
| place-belgrade | names, note | 1521–1867 Ottoman / 1867–1918 Serbia → five spans (see below) | First Serbian Uprising: Belgrade taken Dec 1806, lost Oct 1813. Capital from 1841, with an Ottoman garrison until 1867 |
| place-thessaloniki | names, note | 1387–1403 Ottoman (Selanik) added | Surrendered Apr 1387; returned under the 1403 treaty with Süleyman |
| place-gdansk | 1807–14 capital | none → true | Consistent with the 1920–39 Free City |
| polity-holy-roman-empire | summary en/zh | "crowned in Rome from Otto I onward" → "crowned by the pope from Otto I to Charles V (1530)" | Charles V was crowned at Bologna, Maximilian I was never crowned, and no later emperor had a papal coronation |

The new Belgrade spans are:

- 1521–1806 Ottoman, with Habsburg occupations in 1688–90, 1717–39 and 1789–91
- 1806–13 Revolutionary Serbia (capital)
- 1813–41 Ottoman (seat at Kragujevac)
- 1841–1918 Principality, then Kingdom, of Serbia (capital)

## 3. Spot-checks

**QIDs:** all 252 (125 records and 127 rulers) were checked against the build's Wikidata cache (`data/cache/wikidata.json`), not a live lookup. All denote the intended items; the broader items are noted in their records.

**Events ✓:**

- Teutoburg, Adrianople, Clovis (c. 496, medium), Hagia Sophia, Bologna (low), Milan, 476
- The 800 coronation, the Schism, Hastings, Magna Carta, the First Crusade route, Constantinople 1453
- The Gutenberg Bible, the 95 Theses, the Columbus route, the Armada route, Westphalia, the Thirty Years' War
- Poltava: 1709-07-08 = 27 Jun O.S.; the note agrees
- October Revolution: 1917-11-07 = 25 Oct O.S.; the note agrees
- Lisbon, the 1812 route, the WWII and Eastern Front routes, Italy 1861–71

**People ✓:** Napoleon, Charlemagne (748; Britannica gives "747?", which the note covers), Luther, Joan of Arc, Columbus, Attila (c. 406), Gutenberg (c. 1400), Peter I, Newton.

**Places ✓:** Istanbul, St Petersburg, Volgograd, Kaliningrad, Kyiv (482), Moscow, Rome, Vienna.

**Polities and reigns ✓:** Kingdom of France (ends 1792), UK and GB, Visigoths, Venice (697), HRE, Kievan Rus', Tsardom of Russia, Russian Empire, Habsburg Monarchy, USSR.

**Fixed:** Tours, Catalaunian Plains, Black Death, Principia, Sack of Rome 410, Eleanor, Paris, Belgrade, Thessaloniki, Gdańsk, HRE.

## 4. Open notes

- **Istanbul:** the genealogy switches to "Istanbul" in 1923 with the change of polity, but the summary gives 1930 as the year it became the sole official name.
- **ev-october-revolution:** it links the Russian Empire, which ended in March 1917, and the Soviet Union, founded in 1922. The curator may want to drop both links.
- **Thessaloniki:** "Jewish majority" is defensible (Mazower).
- **Wartime occupations:** for Belgrade and Thessaloniki they are noted in the record but not split into their own spans. Paris and Rome are handled the same way.
- **Britannica:** it returns HTTP 403 to direct fetches, so these checks rely on search snippets and its facts/summary pages.
