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
- **124 of the curator's 167 new records (74%)** checked: 116 that the earlier report does not name
  (62 events, 22 people, 8 places, 24 polities) plus the 8 importance-4/5 events it only covered
  through auto-diffs (Las Navas, Hanse, Trent, Eighty Years' War, Glorious Revolution, Watt,
  Holocaust, Berlin airlift). All new importance ≥4 records are now covered.
- **90 stories read in full** (en) and checked claim by claim; zh skimmed for every sampled record
  (a script scan found no traditional characters).
- **QIDs:** about 270 (sampled records, every ruler of the sampled polities, and the 12 additions with their rulers) resolved on Wikidata; all
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
  rulers only); the zh rendering 迪尼什一世 (Denis of Portugal) was kept; 阿奎斯格拉尼 for Aquae Granni is a loose transliteration.
- Britannica URLs for the new polities were confirmed through Britannica's own search; older
  Britannica URLs in the dataset are still unopened (403 to scripts).

## 2026-11 story verification (web-sourced)

A second pass over the `story` texts. Every checkable claim (dates, numbers, names, places, order of events, attributions, superlatives) was checked against a source retrieved in this pass: Wikipedia article text in en/es/de/it via WebFetch, plus Wikisource (Tacitus, *Annals* 15), Wikimedia Commons, PMC (Riedel 2005 on Jenner), the US National Archives and historyplace.com. Nothing was checked from memory.

- **Scope:** 66 of the 156 stories. Skipped: the 90 stories the 2026-11 reviewer had already checked against retrieved web sources (review batches A–E). All the others were checked, including the 1st-century and expansion records.
- **Result:** 15 of 66 stories (23%) needed a correction or a softened claim. The other 51 were confirmed as written. There are 48 edits (24 en, each with a matching zh edit).
  - **Wrong numbers or dates:** the Seven Weeks' War actually lasted under six weeks. The Nazi–Soviet pact was signed nine days before 1 September 1939, not a week. The Santa María ran aground early on Christmas Day. About three-quarters of Ireland's 1846 potato crop was lost, not nearly all. The figure of 7,000 D-Day vessels is not supported.
  - **Overreach:** horses did not reach the Great Plains "within a century" of 1493; they arrived in the 1700s. Toledo became the Visigothic capital under Leovigild, not Athanagild. Prasutagus named Nero co-heir; the "half each" split is not in the sources. The idea that Prussia was "merged" into Germany is gone. Avicenna was dropped from Gerard of Cremona's translations.
  - **Softened to match the sources:** Ball's release from Maidstone, Richard II's "I will be your leader", Michelangelo's scaffold and the secret removal of his body, the number of shots Cervantes took, and the Cummins letter's addressee.
- **zh:** every zh story was compared with its en text. Each en change has a matching zh change. No traditional characters, calques or mismatches were found beyond those fixed.
- **Not resolved** (left as written or softened; plausible, but no retrieved source):
  - Wilhelm I snubbing Bismarck at Versailles. It is kept as "reportedly".
  - Fleming's 1929 remark on white blood cells, which was removed.
  - The Cummins letter's addressee (the Duke of Wellington) and its printing in *The Times*, both removed.
  - Whether the landslide at Covadonga is in the Chronicle of Alfonso III itself or is a later gloss.
- **Pipeline:** `fmt-data`, then `validate-data europe` (0 errors, 4 warnings as before), then `build-data` (0 open diffs). No QID, image or date field changed, so no enrich run was needed.

### Stories checked and sources

| Record | Result | Source(s) retrieved |
| --- | --- | --- |
| ev-battle-of-teutoburg-forest | fixed | en.wikipedia Battle of the Teutoburg Forest |
| ev-eruption-of-vesuvius-79 | ok | en.wikipedia Eruption of Mount Vesuvius in 79 AD |
| ev-edict-of-milan | ok | en.wikipedia Edict of Milan |
| ev-battle-of-adrianople | ok | en.wikipedia Battle of Adrianople |
| ev-sack-of-rome-410 | ok | en.wikipedia Sack of Rome (410) |
| ev-battle-of-the-catalaunian-plains | ok | en.wikipedia Battle of the Catalaunian Plains |
| ev-fall-of-the-western-roman-empire | ok | en.wikipedia Romulus Augustulus; Odoacer (Anonymus Valesianus, Placentia) |
| ev-umayyad-conquest-of-hispania | ok | en.wikipedia Umayyad conquest of Hispania |
| ev-battle-of-tours | ok | en.wikipedia Battle of Tours |
| ev-viking-expansion | ok | en.wikipedia Viking Age |
| ev-coronation-of-charlemagne | ok | en.wikipedia Coronation of Charlemagne |
| ev-treaty-of-verdun | ok | en.wikipedia Treaty of Verdun; Oaths of Strasbourg |
| ev-east-west-schism | ok | en.wikipedia East–West Schism |
| ev-battle-of-hastings | ok | en.wikipedia Battle of Hastings |
| ev-first-crusade | ok | en.wikipedia First Crusade |
| ev-magna-carta | fixed | en.wikipedia Magna Carta |
| ev-hundred-years-war | ok | en.wikipedia Hundred Years' War; Burghers of Calais |
| ev-black-death | ok | en.wikipedia Black Death |
| ev-gutenberg-bible | ok | en.wikipedia Gutenberg Bible |
| ev-columbus-first-voyage | fixed | en.wikipedia Voyages of Christopher Columbus |
| ev-ninety-five-theses | ok | en.wikipedia Ninety-five Theses |
| ev-de-revolutionibus | ok | en.wikipedia De revolutionibus orbium coelestium |
| ev-thirty-years-war | ok | en.wikipedia Defenestrations of Prague; Thirty Years' War |
| ev-peace-of-westphalia | ok | en.wikipedia Peace of Westphalia |
| ev-principia | ok | en.wikipedia Philosophiæ Naturalis Principia Mathematica |
| ev-french-revolution | ok | en.wikipedia Storming of the Bastille; French Revolution |
| ev-french-invasion-of-russia | ok | en.wikipedia French invasion of Russia |
| ev-congress-of-vienna | ok | en.wikipedia Congress of Vienna |
| ev-battle-of-waterloo | ok | en.wikipedia Battle of Waterloo; Thomas Creevey |
| ev-origin-of-species | ok | en.wikipedia On the Origin of Species; 1860 Oxford evolution debate |
| ev-unification-of-italy | ok | en.wikipedia Italian unification; Giuseppe Garibaldi; Camillo Benso, Count of Cavour; Capture of Rome; en.wikiquote Metternich |
| ev-unification-of-germany | fixed | en.wikipedia Austro-Prussian War; Blood and Iron (speech); Ems Dispatch; Proclamation of the German Empire; Wilhelm I; de.wikipedia Deutsche Reichsgründung |
| ev-world-war-i | ok | en.wikipedia World War I; First day on the Somme; Battle of Verdun; Armistice of 11 November 1918; UK declaration of war on Germany (1914) |
| ev-treaty-of-versailles | ok | en.wikipedia Treaty of Versailles; Scuttling of the German fleet at Scapa Flow |
| ev-world-war-ii | fixed | en.wikipedia Molotov–Ribbentrop Pact; Battle of Westerplatte; Dunkirk evacuation; German Instrument of Surrender; World War II casualties of the Soviet Union |
| ev-normandy-landings | fixed | en.wikipedia Normandy landings; Operation Neptune; James Stagg; archives.gov D-Day lesson ("In Case of Failure" note) |
| ev-fall-of-the-berlin-wall | ok | en.wikipedia Fall of the Berlin Wall; Berlin Wall; Pan-European Picnic; Harald Jäger; de.wikipedia Todesopfer an der Berliner Mauer; Mauerfall |
| ev-monte-cassino | ok | en.wikipedia Monte Cassino; Benedict of Nursia; Saint Scholastica; Rule of Saint Benedict |
| ev-columbian-exchange | fixed | en.wikipedia Columbian exchange; History of sugar; Mustang; Horses in the United States; es.wikipedia Segundo viaje de Colón |
| ev-magellan-elcano-circumnavigation | ok | en.wikipedia Magellan expedition; Battle of Mactan |
| ev-industrial-revolution | ok | en.wikipedia Industrial Revolution; Watt steam engine; Robert C. Allen |
| ev-jenner-smallpox-vaccination | ok | en.wikipedia Edward Jenner; James Phipps; Riedel 2005 (PMC1200696) |
| ev-great-irish-famine | fixed | en.wikipedia Great Famine (Ireland); historyplace.com Irish Potato Famine |
| ev-discovery-of-penicillin | fixed | en.wikipedia Discovery of penicillin; Penicillin; Norman Heatley; Alexander Fleming |
| ev-world-wide-web | ok | en.wikipedia History of the World Wide Web; Tim Berners-Lee; Robert Cailliau; commons File:First Web Server.jpg |
| ev-theodoric-takes-ravenna | ok | en.wikipedia Odoacer; Theodoric the Great |
| ev-battle-of-covadonga | ok | en.wikipedia Battle of Covadonga; es.wikipedia Batalla de Covadonga |
| ev-lindisfarne-raid | ok | en.wikipedia Lindisfarne; Viking raid on Lindisfarne |
| ev-albigensian-crusade | ok | en.wikipedia Albigensian Crusade; Caedite eos. Novit enim Dominus qui sunt eius. |
| ev-peasants-revolt-1381 | fixed | en.wikipedia Peasants' Revolt |
| ev-liverpool-and-manchester-railway | ok | en.wikipedia Liverpool and Manchester Railway; Chat Moss; Rainhill trials; William Huskisson |
| ev-boudican-revolt | fixed | en.wikipedia Boudica; Battle of Watling Street |
| ev-great-fire-of-rome | ok | en.wikipedia Great Fire of Rome; en.wikisource Tacitus, Annals Book 15 |
| person-michelangelo | fixed | en.wikipedia Michelangelo; Pietà (Michelangelo); Sistine Chapel ceiling; it.wikipedia Michelangelo Buonarroti |
| person-miguel-de-cervantes | fixed | en.wikipedia Miguel de Cervantes; es.wikipedia Miguel de Cervantes |
| person-william-shakespeare | ok | en.wikipedia William Shakespeare; The Theatre; First Folio |
| person-oliver-cromwell | ok | en.wikipedia Oliver Cromwell |
| person-wolfgang-amadeus-mozart | ok | en.wikipedia Wolfgang Amadeus Mozart |
| person-james-watt | ok | en.wikipedia James Watt; Watt steam engine |
| person-charles-darwin | ok | en.wikipedia Charles Darwin; On the Origin of Species |
| person-karl-marx | ok | en.wikipedia Karl Marx; Rheinische Zeitung; Das Kapital |
| person-emmeline-pankhurst | ok | en.wikipedia Emmeline Pankhurst; Richard Pankhurst (politician) |
| person-albert-einstein | ok | en.wikipedia Albert Einstein; Eddington experiment |
| person-adolf-hitler | ok | en.wikipedia Adolf Hitler; Gleichschaltung |
| place-toledo | fixed | en.wikipedia History of Toledo, Spain; Toledo, Spain; Taifa of Toledo; Gerard of Cremona; es.wikipedia Toledo |
| polity-nasrid-granada | fixed | en.wikipedia Emirate of Granada; Alhambra |

### Corrections

Each en change has a matching zh change unless noted. Old → new is quoted in short form.

| Record | Old → new | Why | Source |
| --- | --- | --- | --- |
| ev-battle-of-teutoburg-forest | “Rome never again tried to rule east of the Rhine.” → “After Germanicus's punitive campaigns of 14–16, Rome gave up the province and made the Rhine its frontier.” | Overstated: Germanicus campaigned east of the Rhine until 16, and Rome later held the Agri Decumates east of the upper Rhine; what ended was the planned province to the Elbe | en.wikipedia Battle of the Teutoburg Forest |
| ev-magna-carta | “and the 1225 version became part of English law.” → “and the 1225 version, confirmed as statute in 1297, became part of English law.” | The 1225 reissue was granted for a tax; it entered statute law through Edward I's confirmation of 1297 | en.wikipedia Magna Carta |
| ev-columbus-first-voyage | “On Christmas Eve the Santa María ran aground off Hispaniola,” → “In the early hours of Christmas Day the Santa María ran aground off Hispaniola,” | The grounding is dated 25 December 1492 (just after midnight) | en.wikipedia Voyages of Christopher Columbus |
| ev-unification-of-germany | “in a war of seven weeks” → “in a war of barely six weeks” | The 'Seven Weeks' War' ran 14 June to 22 July 1866, about five and a half weeks | en.wikipedia Austro-Prussian War |
| ev-unification-of-germany | “unhappy with the title and with seeing Prussia merged into Germany,” → “unhappy with the title and with seeing his Prussian crown overshadowed,” | Wilhelm's complaint was that the imperial title eclipsed the Prussian crown; Prussia was not merged into the federal Reich | en.wikipedia Wilhelm I; de.wikipedia Deutsche Reichsgründung |
| ev-world-war-ii | “A week after Nazi Germany and the Soviet Union signed” → “Nine days after Nazi Germany and the Soviet Union signed” | Pact signed 23 August 1939; attack began 1 September | en.wikipedia Molotov–Ribbentrop Pact |
| ev-normandy-landings | “a fleet of some 7,000 vessels carried troops” → “a fleet of thousands of warships, transports and landing craft carried troops” | Counts vary (Wikipedia gives about 5,000 ships); the 7,000 figure is not supported | en.wikipedia Normandy landings; Operation Neptune |
| ev-columbian-exchange | “brought horses, cattle, pigs, wheat and sugar cane to Hispaniola. Within a century there were horses on the Great Plains and the pampas,” → “brought horses, livestock, seeds and sugar-cane cuttings to Hispaniola. Horses later ran wild on the pampas and, by the 18th century, had…” | Horses reached the Great Plains in numbers only after the 1680 Pueblo Revolt (1700s), not within a century of 1493; the voyage's cargo list is only partly documented | en.wikipedia Mustang; History of sugar; Horses in the United States; es.wikipedia Segundo viaje de Colón |
| ev-great-irish-famine | “in 1846 it destroyed nearly all of it.” → “in 1846 it destroyed about three-quarters of it.” | Wikipedia gives a loss of three-quarters of the 1846 harvest | en.wikipedia Great Famine (Ireland) |
| ev-great-irish-famine | “described starving families in the cabins around Skibbereen in a letter to the Duke of Wellington that was printed in The Times.” → “described in a letter the starving families he had found in the cabins around Skibbereen.” | Cummins's Skibbereen account is confirmed; the addressee and newspaper could not be confirmed in a retrieved source | historyplace.com Irish Potato Famine (Cummins at Skibbereen) |
| ev-discovery-of-penicillin | “reported that it killed many disease-causing bacteria without harming white blood cells.” → “reported that it killed many disease-causing bacteria.” | The white-blood-cell claim could not be confirmed in a retrieved source; the antibacterial range is confirmed | en.wikipedia Alexander Fleming; Discovery of penicillin |
| ev-peasants-revolt-1381 | “and freed the radical priest John Ball from prison in Maidstone.” → “and, by most accounts, freed the radical priest John Ball from prison in Maidstone.” | Ball's release from Maidstone is reported but uncertain; he may already have been free | en.wikipedia Peasants' Revolt |
| ev-peasants-revolt-1381 | “Richard rode forward, told the rebels he would be their leader, and led them away.” → “Richard rode forward and, the chroniclers say, told the rebels he would be their leader, then led them away to Clerkenwell.” | The offer to lead them rests on chronicle accounts that differ | en.wikipedia Peasants' Revolt |
| ev-boudican-revolt | “he left half his kingdom to the emperor Nero and half to his two daughters, hoping to protect his family.” → “he named the emperor Nero co-heir with his two daughters, hoping to protect his family.” | Tacitus says Prasutagus made the emperor joint heir with his daughters; no half-and-half split is recorded | en.wikipedia Boudica; Battle of Watling Street |
| ev-boudican-revolt | “Rome sent an inquiry, recalled Suetonius,” → “Nero sent an inquiry and soon replaced Suetonius,” | Suetonius was replaced by Petronius Turpilianus after Polyclitus's inquiry | en.wikipedia Battle of Watling Street |
| person-michelangelo | “standing on a scaffold of his own design rather than lying on his back, as legend has it.” → “standing on a free-standing scaffold rather than lying on his back, as legend has it.” | The free-standing scaffold replaced Bramante's and was built by Piero Roselli; 'his own design' is not supported | en.wikipedia Sistine Chapel ceiling |
| person-michelangelo | “his nephew had the body carried secretly to Florence for burial in Santa Croce.” → “his nephew Lionardo had the body taken to Florence, reportedly in secret, for burial in Santa Croce.” | Transfer to Santa Croce confirmed; the secret removal is a report not confirmed in retrieved sources | en.wikipedia Michelangelo |
| person-miguel-de-cervantes | “was hit by three arquebus shots, losing the use of his left hand,” → “was wounded by arquebus fire in the chest and left hand, losing the use of that hand,” | Sources differ on the number of shots (two per the 1571 testimony, three wounds in other accounts) | es.wikipedia Miguel de Cervantes; en.wikipedia Miguel de Cervantes |
| person-miguel-de-cervantes | “and, according to fellow captives, took the blame each time;” → “and took the blame on himself each time to shield his companions;” | Sources say he made himself responsible to protect the others; testimony by fellow captives was not confirmed | es.wikipedia Miguel de Cervantes |
| place-toledo | “King Athanagild made it the Visigothic capital in the 560s,” → “King Athanagild set up his court there in the 560s, and under Leovigild it became the Visigothic capital;” | Athanagild based his court in Toledo, but it became the kingdom's capital under Leovigild | es.wikipedia Toledo; en.wikipedia History of Toledo, Spain |
| place-toledo | “and from 1035 the capital of its own taifa kingdom.” → “and in the 11th century the capital of its own taifa kingdom.” | Founding dates for the taifa vary (de facto independence 1018; Dhu l-Nunid rule later); 1035 is not supported | en.wikipedia Taifa of Toledo; es.wikipedia Toledo |
| place-toledo | “he guaranteed its Muslim and Jewish inhabitants their property and worship, a promise later only partly kept.” → “he guaranteed its Muslim inhabitants their lives and property, but the tolerance did not last: the main mosque soon became the cathedral.” | The capitulation guaranteed Muslims' persons and property; Jewish and worship guarantees are not in retrieved sources; the cathedral replaced the main mosque | es.wikipedia Toledo |
| place-toledo | “rendered Ptolemy, Avicenna and al-Khwarizmi into Latin,” → “rendered Ptolemy's Almagest and al-Khwarizmi's algebra into Latin,” | The Latin Canon of Avicenna is attributed by some to a later 'second Gerard'; Almagest and al-Khwarizmi are confirmed | en.wikipedia Gerard of Cremona |
| polity-nasrid-granada | “Yusuf I and Muhammad V built most of the palaces visitors see today,” → “Building on the work of Ismail I, Yusuf I and Muhammad V created most of the palaces visitors see today,” | Ismail I began the Comares Palace; Yusuf I and Muhammad V extended and built most of the rest | en.wikipedia Alhambra; Emirate of Granada |
