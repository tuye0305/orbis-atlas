# Verification report: eastern-europe

## 2026-11 expansion

New dataset `data/eastern-europe/` (navigation region `europe`): Byzantium, the Balkans, Hungary,
Bohemia, Poland, Lithuania, the Baltics, Rus', Russia, Ukraine and Belarus, 101–2025 CE.

- 93 events, 35 people (226 journey stops), 15 places (name genealogies), 30 polities (145 rulers),
  44 stories (every event of importance ≥ 4 has one).
- Confidence: 116 high, 55 medium, 2 low (Calling of the Varangians, Olga of Kiev); every non-high
  record carries a `note`.
- Records that already existed in other datasets were linked by id, not duplicated: e.g.
  `person-justinian-i`, `person-peter-the-great`, `person-catherine-the-great`, `person-vladimir-lenin`,
  `person-mehmed-ii`, `person-suleiman-the-magnificent`, `person-subutai`, `person-ogedei`,
  `place-istanbul`, `place-kyiv`, `place-moscow`, `place-saint-petersburg`, `place-belgrade`,
  `place-gdansk`, `polity-byzantine-empire`, `polity-kievan-rus`, `polity-grand-principality-of-moscow`,
  `polity-tsardom-of-russia`, `polity-russian-empire`, `polity-soviet-union`,
  `polity-polish-lithuanian-commonwealth`, `polity-habsburg-monarchy`, `polity-ottoman`,
  `polity-golden-horde`, `polity-mongol-empire`. Existing events (Hagia Sophia, Christianisation of
  Rus', siege of Kyiv 1240, Grunwald, fall of Constantinople, Union of Lublin, Vienna 1683, Poltava,
  1812, Stalingrad, Chernobyl, dissolution of the USSR, Kalka, Manzikert) were not re-added.

### Auto-diff

Fixed in the data after the first build (3): `person-vladimir-the-great` born 958 → 956
(Britannica c. 956); `ev-battle-of-ongal` moved to the Danube-delta point (45.2, 29.5);
`ev-battle-on-the-ice` moved to Lake Lämmijärv (58.23, 27.5), the usual identification.

The remaining 33 differences have verdicts in `resolutions/eastern-europe.json` (32 `keep-ours`,
1 `disputed`); 0 open. Most `keep-ours` verdicts concern Wikidata coordinates that are country or
region centroids (the Great Purge at the centre of Siberia, the 1905 revolution at the centre of
Russia) or polity ranges where this dataset ends a state at a union to avoid overlapping records
(Crown of Poland and Grand Duchy of Lithuania end in 1569, the Kingdom of Hungary in 1918).
`ev-saint-sophia-kyiv:year` is `disputed` (chronicle 1037 vs. architectural dating 1011–1018).

### Spot-checks (second source, 56 records ≈ 32 %)

Checked against Wikipedia article leads and the Wikidata facts fetched by `wd.mjs`, in addition to
the sources cited in each record:

- Events (24): Kleidion (29 Jul 1014), Mohács (29 Aug 1526), Belgrade 1456 (4–22 Jul), Kosovo 1389,
  Union of Krewo (14 Aug 1385), Varna (10 Nov 1444), Ostrog Bible (1581, Fedorov, Ostrozky), Union of
  Brest (1595–96), Karlowitz (26 Jan 1699), Szigetvár (1566, Zrinski), Pliska (26 Jul 811), Nika
  (532, ~30,000 dead), Golden Bull (1222, diet of Fehérvár), Legnica (9 Apr 1241), Mohi (Sajó),
  Gniezno (11 Mar 1000), Ugra (1480), Kazan (1552), Kyiv Pechersk Lavra, St Sophia Kyiv, walls of
  Constantinople, Wulfila Bible, Ongal (680, Danube delta), Baltic Way (2 million, 675 km).
- People (11): Basil II (976–1025), Clement of Ohrid, Simeon I (893–927), Anna Komnene (plot against
  John II), Stefan Dušan (king 1331, emperor 16 Apr 1346), Skanderbeg (League of Lezhë), Hunyadi
  (regent 1446–1453), Žižka, Vytautas (1392/1401–1430), Jadwiga (crowned 16 Oct 1384, born in Buda),
  Shevchenko (Kobzar).
- Ruler reigns (16, across 12 polities): Basarab I, Bogdan I, Kyrylo Rozumovsky, Hacı I Giray,
  Yaroslav of Tver, Tomislav, Lev I, Yuri II Boleslav, Roman the Great, Andrey Bogolyubsky, Hermann
  von Salza, Mojmír I, Taksony, Ivan Vladislav, Milica (regent 1389–1393), Euthymius II (1429–1458).
- Places and modern events (5): Tartu (Dorpat/Yuryev), Podgorica, Donetsk (Yuzovka/Stalino),
  Yekaterinburg (Sverdlovsk 1924–1991), Ukrainian declaration of independence (24 Aug 1991).

Corrections made during the spot-check:
- Battle of Kosovo: date changed from 28 June to 15 June 1389 (Julian); 28 June is the modern
  Gregorian date of Vidovdan. Story and note updated.
- Battle of Achelous: a source wrongly cited Leo the Deacon (who covers 959–976); replaced by
  Skylitzes and Theophanes Continuatus.
- Journey stops relocated: Matthias Corvinus elected king of Bohemia at Olomouc (not Brno); Žižka
  lost his second eye at Rabí; Stephen I defeated Koppány near Veszprém; Clement received at Pliska;
  Olga's revenge at Iskorosten (Korosten); Alexander Nevsky died at Gorodets; Basil II's Varangian
  victory placed at Chrysopolis (988).
- Wrong QIDs caught before use: seven first-guess event QIDs pointed to unrelated items and were
  replaced after search (e.g. Trajan's Dacian Wars Q723608, Diocletian's Palace Q322287, Corpus
  Juris Civilis Q187719, Calling of the Varangians Q4378226).
- Lech Wałęsa was dropped as a person record (the schema needs a death year and he is alive);
  Putin and Zelenskyy appear only as polity rulers.
- WWII events in occupied Poland and Leningrad were first linked to `polity-german-empire`
  (1871–1918); the anachronistic link was removed.

### Known gaps

- No Wikidata item for the coronation of Stephen I (the record has no QID).
- Thin coverage for the 5th, 10th and 12th centuries and for Belarus, Moldova and Albania after 1500.
- No modern-state polities for Poland, Hungary, Czechia, Slovakia, the Baltic states or Belarus
  after 1989–1991, and no Third Reich polity in any dataset.
- Ongoing-war content (Russian invasion of Ukraine) is summarised conservatively with UN/OHCHR
  sources and should be revisited as figures change.
