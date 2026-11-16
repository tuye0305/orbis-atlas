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

## 2026-11 expansion

Added 90 events, 33 people, 12 places and 32 polities (plus four more Venetian doges on
`polity-republic-of-venice`), and 153 new stories: 44 on existing importance-4/5 events, 36 on new
importance-4/5 events (all of them) and 31 on new importance-3 events, 33 on people, 5 on places,
4 on polities.
The remaining importance-4/5 records without a story (Constantinople 330 and 1453, Kievan Rus',
October Revolution, Eastern Front, Stalingrad, dissolution of the USSR) are in the eastern-europe
agent's scope and were left untouched.

### Auto-diff
27 new differences against Wikidata, all resolved in `resolutions/europe.json` (0 open):
- **Fixed in the record:** `ev-the-holocaust` now spans 1933–1945 (USHMM definition, as Wikidata);
  the curator had 1941–1945.
- **Disputed:** `ev-battle-of-covadonga` (718 vs 722; confidence medium, note).
- **Keep-ours (25):** markers placed on the actual site instead of Wikidata's country centroids
  (Peasants' Revolt, Eighty Years' War, Glorious Revolution, Blenheim, Marsala, Bentley Priory,
  Reichstag, Sorbonne, Béziers, Ypres, Rome for the Donation of Pepin); event years where the
  Wikidata item is a broader or related thing (Tetrarchy 293 vs Diocletian's accession 284,
  Ravenna 493 vs siege start 490, Toledo 1085 vs 1081, Watt 1769 patent vs 1776 engine, L&M
  Railway opening 1830 vs company 1823, Hanse 1356/1669 vs 1358/1862, euro 1999 vs 2002, Brexit
  2016 vs 2020); polity end dates (Castile 1230, Crown of Castile 1516, Florence 1532) and Spain
  since 1975 (Wikidata Q29 is the country).

### QID checks
Every polity and ruler QID (about 240) was checked by `wd.mjs lookup` label, description and
life dates against the intended person or state; one wrong guess (Juan Negrín) was caught and
corrected. Wikidata quirks noted in records: Boabdil is labelled "Muhammad XI" (Q312763); Edington
(Q2305651) coordinates lie north of the village; Trent (Q172991) ends on 21 February 1563 instead
of 4 December. No item exists for the Otto I coronation, the Lombard invasion or Jenner's 1796
inoculation; several records use the item for the building, work or institution (Mosque of
Córdoba, Cluny, Althing, Domesday Book, Brunelleschi's dome, Sistine ceiling, First Folio, euro,
Royal Society, DNA paper).

### Spot-check (43 of 167 new records, 26%)
An independent checker re-read 22 events, 9 people, 4 places and 8 polities against a second
source (dates, coordinates, story claims, stops, name ranges, reigns): 35 ok, 2 fixes, 6 notes.
- **Fixed:** `ev-lindisfarne-raid`: the Anglo-Saxon Chronicle (D/E) reads 8 January; 8 June
  comes from the northern annals. Story and note reworded. `person-emmeline-pankhurst`: Paris
  school stop 1872 → 1873.
- **Applied notes:** Trent sessions also met in Santa Maria Maggiore; `ev-berlin-blockade-and-airlift`
  no longer links the Federal Republic (founded May 1949); East Francia: Charles the Fat from 882
  (sole king); zh names 卡斯蒂利亚王冠 / 阿拉贡联合王国; Dublin's Irish name left in Latin script.
- **Curator corrections from sub-reviews:** Teutoburg note (the month is inferred, not attested);
  penicillin note (28 vs 3 September 1928); Toledo and Las Navas relinked to the new
  `polity-kingdom-of-castile`.
- **Source URLs:** all non-Britannica URLs were requested; two dead links fixed or removed
  (National Archives Domesday, Eduskunta). UNESCO, the British Museum and Chemnitz block scripted
  requests (403) and were left. Britannica blocks all scripted requests, so its URLs follow its
  standard paths and were not individually opened.

### Known gaps
- France 1815–1870 (Restoration, July Monarchy, Second Republic, Second Empire), Vichy and the
  Fourth Republic; the Spanish First Republic (1873–74); the Kingdom of Sardinia and Two Sicilies.
- Few new records for the 1st–2nd and 7th centuries; Scandinavia beyond the Kalmar Union,
  Swedish Empire, Althing and Oslo is still thin.
- `ev-magellan-elcano-circumnavigation` links `person-lapulapu`, which no dataset defines yet.

## 2026-11 review

Independent reviewer (separate from the curator and its checker). Every check below used a
fetched or searched web source, not reference knowledge: Wikidata `wbgetentities` for QIDs, and
for claims Wikipedia plus at least one other site (USHMM, Yad Vashem, Anne Frank House, Fordham
Medieval Sourcebook, LacusCurtius texts of Tacitus, Bundestag, CVCE, CAIN, CWGC/IWM, English
Heritage, Encyclopaedia Romana, university and museum pages, Britannica search snippets).

### Sample
- **124 of the 169 new records (73%)** checked: 116 that the earlier report does not name
  (62 events, 22 people, 8 places, 24 polities) plus the 8 importance-4/5 events it only covered
  through auto-diffs (Las Navas, Hanse, Trent, Eighty Years' War, Glorious Revolution, Watt,
  Holocaust, Berlin airlift). All new importance ≥4 records are now covered.
- **90 stories read in full** (en) and checked claim by claim; zh skimmed for every sampled record
  (a script scan found no traditional characters).
- **QIDs:** about 330 (records plus every ruler of the sampled polities) resolved on Wikidata; all
  are the intended subjects. `ev-the-holocaust` is Q2763 (the genocide) and the eastern-europe
  dataset's `ev-auschwitz` is Q7341 (the camp), so they are distinct items. `person-lapulapu`
  (linked from `ev-magellan-elcano-circumnavigation`) is defined on `data/southeast-asia` as
  Q216275, "Lapulapu, ruler of Mactan", so the link resolves once that PR merges.

### Corrections
| Record | Field | Old → new | Source |
| --- | --- | --- | --- |
| ev-nazi-seizure-of-power | story en/zh | Enabling Act "441 votes to 94" → 444 to 94 | Bundestag text archive; Wikipedia *Enabling Act of 1933* |
| ev-march-on-rome | summary en/zh | king asked Mussolini "on 30 October" → invited 29 Oct, appointed 30 Oct | Papers Past (NZ Herald, 31 Oct 1922); Wikipedia |
| polity-dutch-republic | story en/zh, zh | "Grand Pensionary Oldenbarnevelt" → Land's Advocate of Holland (the title Grand Pensionary dates from after 1619); States General zh 三级会议 → 联省议会 | Wikipedia *Land's Advocate of Holland*, *Grand pensionary* |
| ev-battle-of-verdun | story en/zh | "Nine villages … were never rebuilt" → nine destroyed, six never rebuilt; "more than a thousand guns" → some 1,200 massed guns | Connexion France; Wikipedia |
| ev-dunkirk-evacuation | summary en/zh | destroyers carried "most" → "the largest share" | Wikipedia (239,555 from the harbour by many ship types) |
| person-christine-de-pizan | stops | widowed 1390 → 1389 | Wikipedia; Encyclopedia.com |
| person-louis-xiv | stops | 1643 accession stop at the Louvre → Saint-Germain-en-Laye, where Louis XIII died | Britannica facts: Louis XIII; Wikipedia |
| person-otto-von-bismarck | summary en/zh | "Junker from Brandenburg" → from the Altmark in Prussian Saxony (Schönhausen) | Wikipedia |
| place-cordoba | names 1031–1236 polity | adds Abbadid Seville (1070–91) between the taifa and the Almoravids | Wikipedia *Córdoba, Spain* |
| ev-the-holocaust | story en/zh | Anne Frank "was betrayed" → "was discovered and arrested on 4 August 1944" (betrayal unproven) | Anne Frank House |
| ev-watt-steam-engine | story en/zh | first engines "pumping water from mines" → one colliery pump (Tipton), one blowing Wilkinson's furnaces | Grace's Guide (Smiles, *Lives of Boulton and Watt*); the record's own note |
| ev-domesday-book | summary en/zh | results "compiled in 1086" → survey completed 1086, then written up | Wikipedia *Domesday Book* (date of writing-up uncertain) |
| ev-execution-of-charles-i | summary en/zh | Commonwealth "within weeks" → within months (declared 19 May 1649) | Wikipedia |
| ev-first-battle-of-the-marne | summary en/zh | Germans "within about 50 km" of Paris → about 40 km | Wikipedia |
| ev-gregorian-mission | story zh | Augustine 院长 (abbot) → 会长（副院长） (prior) | Wikipedia *Augustine of Canterbury* |
| ev-coronation-of-otto-i | story zh | Adelaide 王太后 (queen mother) → 洛泰尔的遗孀 (King Lothair's widow) | Wikipedia *Otto the Great* |
| person-voltaire | story en | "From Ferney he published Candide" → Candide 1759 (written at Les Délices), Calas case from Ferney | Wikipedia; Britannica |
| place-lisbon | story en/zh | "second city of a Spanish-ruled Iberian Union" (unsupported) → ruled by the Spanish Habsburgs | — (claim removed) |
| polity-swedish-empire | summary en/zh | Baltic and German provinces both credited to the Thirty Years' War → Ingria and Livonia by Gustavus's wars, German provinces in 1648 | Wikipedia *Swedish Empire* |
| polity-papal-states | story en/zh | "swallowed by the new Kingdom of Italy in 1860, leaving only Rome" → lost to Piedmont-Sardinia in 1860, leaving Rome and Lazio | Wikipedia |
| polity-republic-of-genoa | summary en/zh | "colonies … to the Atlantic" → colonies to Chios, merchants and fleets to Seville, Lisbon, Flanders | Wikipedia |
| ev-glorious-revolution | story en | "bloodless in England" → "largely bloodless" | Wikipedia |
| ev-great-mosque-of-cordoba | story en/zh | "the only prominent Umayyad prince to escape" → the most prominent | Wikipedia |
| ev-sutton-hoo-ship-burial | story en/zh | Pretty asked Brown "in the summer of 1939" → Brown (hired 1938) opened Mound 1 in 1939 | Wikipedia *Sutton Hoo*, *Edith Pretty* |
| ev-dutch-east-india-company | note | Oost-Indisch Huis "acquired 1606" → built for the company in 1606 | Wikipedia *Oost-Indisch Huis* |
| ev-lombard-invasion-of-italy | note | Narses' invitation "generally regarded as legend" → contested tradition | Wikipedia *Alboin* |
| ev-expedition-of-the-thousand | polities | `polity-kingdom-of-italy` (anachronistic in 1860) → new `polity-kingdom-of-sardinia`, `polity-kingdom-of-the-two-sicilies` | — |

### Holocaust and Auschwitz
`ev-the-holocaust` (Q2763) stacked exactly on `ev-auschwitz` (Q7341, eastern-europe). Its
marker now sits at the Wannsee villa in Berlin (52.4331, 13.1658; Wikidata Q28144141), where
the deportation of Europe's Jews was coordinated on 20 January 1942. The story names
Auschwitz-Birkenau with its toll (about 1.1 million, nearly a million of them Jews; USHMM,
Auschwitz Museum), and the note points to `ev-auschwitz`. zh 奥斯威辛 → 奥斯维辛 to match the
eastern-europe record. The other branch was not edited.

### Additions (12 records, each with ≥2 sources checked on the web)
- **Polities:** `polity-bourbon-restoration-france` (1814–1830), `polity-july-monarchy`
  (1830–48), `polity-french-second-republic` (1848–52), `polity-second-french-empire`
  (1852–70), `polity-vichy-france` (1940–44), `polity-french-fourth-republic` (1946–58),
  `polity-first-spanish-republic` (1873–74), `polity-kingdom-of-sardinia` (1720–1861, Q2577303),
  `polity-kingdom-of-the-two-sicilies` (1816–61), `polity-denmark-norway` (1536–1814, medium).
  Ruler QIDs were looked up with `wd.mjs search`.
- **Events (1st century):** `ev-boudican-revolt` (60–61, medium: Tacitus gives 61) and
  `ev-great-fire-of-rome` (64), both with stories drawn from Tacitus (LacusCurtius) and a modern
  account (Warwick, Encyclopaedia Romana, Cambridge Companion to the Age of Nero).
- **Auto-diffs:** two new, both keep-ours: Boudica's marker at Camulodunum (Wikidata's point is in
  Bedfordshire) and the Two Sicilies from 1816 (Wikidata's 1738 is the earlier separate crowns).
  0 open.

### Left for a human
- The 7th century is still thin (Sutton Hoo, Whitby); Scandinavia now has Kalmar,
  Denmark–Norway and the Swedish Empire but no Danish or Norwegian medieval kingdom.
- Notes not acted on: West Francia and Ostrogoths omit some short reigns (by design: notable
  rulers only); Dutch-language and Portuguese zh renderings (迪尼什一世) follow 中文维基.
- Britannica URLs for the new polities were confirmed through Britannica's own search; older
  Britannica URLs in the dataset are still unopened (403 to scripts).
