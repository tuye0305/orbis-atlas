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

## 2026-11 review

Independent reviewer, separate from the curator. Sample chosen to avoid the curator's own
spot-check list wherever possible.

### What was sampled (about 135 of 173 original records, 78 %)

- **Events (70)**: every summary of the 52 events without a story, plus 37 stories read in full
  (all importance ≥ 4 events, among them Corpus Juris, Nika, Gothic War, 717, Iconoclasm, Moravian
  mission, Preslav, Hungarian conquest, baptism of Poland, Stephen I, 1204, Mongol invasion, Mohi,
  Hussite Wars, Time of Troubles, Khmelnytsky, St Petersburg, Partitions, Crimean War, Emancipation,
  periodic table, 1905, Sarajevo, February Revolution, Civil War, Holodomor, Great Purge, Auschwitz,
  Leningrad, 1956, Prague Spring, Solidarity, Baltic Way, Velvet Revolution, Ukrainian
  independence, Srebrenica, 2022 invasion, plus Kleidion, Kosovo, Mohács).
- **People (24)** and every journey stop: Theodora, Heraclius, Cyril, Methodius, Olga, Vladimir,
  Yaroslav, Nevsky, Stephen I, Matthias, Jogaila, Charles IV, Hus, Ivan III, Ivan IV, Khmelnytsky,
  Kościuszko, Pugachev, Pushkin, Tolstoy, Mendeleev, Stalin, Havel, Gorbachev (plus the stories of
  Olga, Skanderbeg and Shevchenko).
- **Places (11)**: Wrocław, Lviv, Vilnius, Bratislava, Plovdiv, Sofia, Tallinn, Nizhny Novgorod,
  Dnipro, Cluj-Napoca, Ljubljana (name ranges and polities).
- **Polities (30)**: every ruler list and reign.
- All 33 resolution verdicts re-read; the reasons hold up.
- `zh`: all names and roles, and the zh text of every edited record; scanned all zh fields for
  traditional characters (none).

Checked against: Wikidata items via `wd.mjs lookup` (QIDs, dates and the coordinates of every
relocated stop), the standard literature cited in the records and beyond it (Britannica, Oxford
Dictionary of Byzantium, Engel, Davies, Plokhy, Hasegawa, Garton Ash, Leo the Deacon, Thietmar,
the Primary Chronicle), the UN Human Rights Monitoring Mission in Ukraine (civilian casualty
updates to October 2025) and the UN Digital Library (A/RES/ES-11/4).

### Cross-dataset duplicates

Compared all eastern-europe QIDs, ids and English names with `origin/data/west-asia` (PR #10) and
with the Western Europe worktree (including its 88 new work-in-progress events) and every other
dataset: **no duplicate QID, id or name**. Kosovo, Nicopolis, Varna, Mohács, Auschwitz and the
Balkan/Eastern Front events exist only here; Vienna 1683, Napoleon in Russia, Stalingrad, the
Eastern Front, Grunwald, Poltava and Chernobyl exist only in `europe` and are linked, not repeated.
Near-overlaps left for the Western Europe curator: `ev-the-holocaust` (Q2763) is plotted at the
Birkenau coordinates (50.0343, 19.1784) already used by `ev-auschwitz` (Q7341), so the two markers
stack; it would be better placed elsewhere (e.g. Berlin or Wannsee) with Auschwitz linked.

### Corrections

| Record | Old → new | Reason / source |
| --- | --- | --- |
| `person-bohdan-khmelnytsky` 1620 | (48.03, 28.07) → (47.13, 27.79) | Cecora is Țuțora near Iași (Wikidata Q2287554) |
| `person-bohdan-khmelnytsky` 1630 | (49.03, 32.12) → (49.10, 32.56) | Subotiv near Chyhyryn (Q2661769) |
| `person-bohdan-khmelnytsky` 1651, `ev-khmelnytsky-uprising` route | (50.18, 25.73) → (50.35, 25.12) | Berestechko (Q819126) |
| `person-jan-zizka` 1360 / 1424 | (49.17, 14.15) → (48.91, 14.60); (49.60, 15.92) → (49.58, 15.74) | Trocnov (Q655554); Přibyslav (Q161060) |
| `person-ivan-iii` 1471 | (58.3, 31.3) → (58.12, 30.32) | Battle of the Shelon was fought near Soltsy (Q196390) |
| `person-ivan-iii` 1480, `ev-great-stand-on-the-ugra` | (54.5, 35.75) → (54.57, 36.05) | Ugra crossings near Kaluga (Q25628) |
| `person-stefan-dusan` 1355 | (42.65, 20.29) → (42.20, 20.76) | Holy Archangels monastery is near Prizren, not Peć (Q1365953) |
| `person-cyril` 861 | (45, 34) → (44.61, 33.49) | Crimean centroid replaced by Chersonesos, where Cyril stopped (Q638445; Vita Constantini) |
| `person-john-hunyadi` 1430 | Turin → Milan | Filippo Maria Visconti was duke of Milan |
| `person-alexander-nevsky` 1242 | aligned with `ev-battle-on-the-ice` (58.23, 27.5) | consistency with the event's Lake Lämmijärv point |
| `person-kosciuszko` 1746, `person-pushkin` 1830, `person-tolstoy` 1910, `person-shevchenko` 1814 | moved 6–25 km | Mieračoŭščyna (Q2579602), Bolshoye Boldino (Q4092262), Astapovo/Lev Tolstoy (Q599866), Moryntsi (Q2180620) |
| `ev-great-purge` summary | "680,000 shot … well over a million sent to the Gulag" → "some 1.5 million arrested, about 680,000 of them shot" | NKVD figures for 1937–38 (1.55 m arrests, 682,000 executions; Khlevniuk) |
| `ev-russian-invasion-of-ukraine-2022` | summary, story, note | brought to late 2025: UN-verified c. 14,500 civilian deaths (Oct 2025), the September 2022 annexation claim and UNGA ES-11/4, 2025 talks with no ceasefire; "recaptured Kharkiv and Kherson regions" → "much of Kharkiv region and the city of Kherson" |
| `ev-christianization-of-bulgaria` | "autocephalous" → "autonomous" archbishopric (870) | autocephaly came only in the 10th century (Curta) |
| `ev-oprichnina` | "massacred much of Novgorod's population" → "killed thousands" | estimates for 1570 range from c. 2,000–3,000 to 15,000 (de Madariaga) |
| `ev-november-uprising` | "including Chopin's circle" → the émigré political and cultural elite | Chopin had left Poland before the rising |
| `ev-partitions-of-poland` story | abolition of the name Poland dated 1795 → 1797 | St Petersburg convention of January 1797 |
| `ev-assassination-of-franz-ferdinand` story | archduke "chose" 28 June → the visit "fell on" Vidovdan | the date followed the manoeuvres (Clark) |
| `ev-solidarity` story | "won all but one of the seats it was allowed to contest" → 160 of 161 Sejm seats and 99 of 100 Senate seats | June 1989 results |
| `ev-velvet-revolution` story | Civic Forum founded "in the Magic Lantern" → founded at the Drama Club, then headquartered in the Magic Lantern | Garton Ash, Krapfl |
| `person-olga-of-kiev` story | "three revenges" → four (adds the funeral feast); baptism attributed to the chronicle, reception to the Book of Ceremonies | Primary Chronicle 945–946; De ceremoniis II.15 |
| `person-taras-shevchenko` story | died "a week after his 47th birthday, days before the serfs were emancipated" → the day after, a week before the emancipation was proclaimed | born 25 Feb / died 26 Feb 1861 O.S.; manifesto signed 19 Feb, proclaimed 5 Mar O.S. |
| `place-dnipro` zh | 第聂伯 (the river) → 第聂伯罗 | standard zh name of the city |
| `place-donetsk` 2014– | "under Russian control" → "held by Russian-backed forces since 2014; annexation claimed in 2022" | more precise for 2014–2022 |

### Additions (10 records, 2 stories)

- Events: `ev-codex-theodosianus` (438), `ev-battle-of-nedao` (454, medium), `ev-siege-of-dorostolon`
  (971, with story), `ev-battle-of-beroia` (1122, medium), `ev-first-mention-of-moscow` (1147, no
  Wikidata item), `ev-battle-of-sirmium` (1167) — filling the thin 5th, 10th and 12th centuries.
- Polities: `polity-third-polish-republic` (1989–), `polity-czech-republic` (1993–),
  `polity-slovakia` (1993–), `polity-belarus` (1991–), rulers = heads of state.
- Story for `ev-katyn-massacre`.
- One new auto-diff (`polity-third-polish-republic:from`, Wikidata 1918) resolved `keep-ours`.

### Left for a human

- No Hungarian People's Republic or post-1989 Hungary, Baltic-state or Moldovan polities yet;
  1956 Hungary is still linked to `polity-kingdom-of-hungary`.
- The ongoing-war figures in `ev-russian-invasion-of-ukraine-2022` should be refreshed as the UN
  updates them.
- `ev-the-holocaust` (europe) stacks on `ev-auschwitz`; see above.
