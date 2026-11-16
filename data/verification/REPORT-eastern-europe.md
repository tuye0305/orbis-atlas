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

## 2026-11 audit (web-sourced)

Independent audit using only sources retrieved during the audit (web search results and fetched pages); nothing checked from memory.

- Seed: `20261115` (mulberry32 shuffle over the 183 records new in this PR; first 15 kept, 5 of them with stories).
- Sample: 15 records (7 events, 2 people, 2 places, 4 polities).

| Record | Claims checked | Source(s) retrieved | Result |
| --- | --- | --- | --- |
| ev-coronation-of-stephen-i | Vajk, Géza’s two-way sacrifices (Thietmar), 997, Koppány quartered on four fort gates, crown from Sylvester II with Otto III, 1000/1001, Esztergom and Kalocsa, ten-villages law, canonised 1083, 20 August | en.wikipedia Stephen I of Hungary; Géza; Hungaricana (Békés and Pest county studies) | Confirmed |
| ev-srebrenica-massacre | 1993 safe area, July 1995, Dutch battalion, 11 July, the breakout column, Kravica / Orahovac / Branjevo, reburial, >8,000 victims, convictions | Britannica; ICTY Krstić judgment; Detektor.ba; Srebrenica Memorial Center | Confirmed (the ICTY puts the column at 10,000–15,000; “about 15,000” is at the top of that range) |
| person-olga-of-kiev | Pskov, the four revenges (pigeons and sparrows), tribute posts on the Msta and Luga, baptism c. 955/957 with the emperor as sponsor, 968 Pecheneg siege, died 969, chronicle compiled in the 1110s | en.wikipedia Olga of Kiev | Confirmed |
| ev-battle-of-kosovo | 15 June 1389 (Julian), Vlatko Vuković, Vuk Branković as son-in-law, Murad and Lazar killed, early reports of victory in Florence and Paris, Milica’s vassalage | en.wikipedia Battle of Kosovo; History Today; De Re Militari; Arthur Evans essay (Te Deum at Notre-Dame) | Confirmed |
| ev-velvet-revolution | 17 Nov, Národní, Šmíd rumour, Civic Forum 19 Nov, key-jingling, Dubček on the Melantrich balcony (24 Nov), two-hour strike 27 Nov, Havel elected unanimously 29 Dec, no deaths | en.wikipedia Velvet Revolution; expats.cz chronology; Radio Prague; Columbia Havel site | Confirmed |
| polity-serbian-despotate | Despot title after Ankara, Belgrade then Smederevo (1428–30), fall 1459, ruler dates | en.wikipedia Serbian Despotate; Siege of Smederevo (1459) | Confirmed |
| person-stefan-dusan | c. 1308, Svrčin 8 Sep 1331, Skopje 16 Apr 1346, died 20 Dec 1355, the 1314 exile | en.wikipedia Stefan Dušan; Emperor of the Serbs; Svrčin | Confirmed |
| ev-battle-of-white-mountain | 8 Nov 1620, about an hour, 27 executed on Old Town Square on 21 Jun 1621 | en.wikipedia Battle of White Mountain; Old Town Square execution; Radio Prague | Confirmed |
| polity-kingdom-of-hungary | Pressburg capital 1536–1783, dynasties, rulers | en.wikipedia List of historical capitals of Hungary; Britannica Bratislava snippet | Confirmed |
| ev-november-uprising | Cadets attack the Belweder (29 Nov 1830), dethronement (25 Jan 1831), Grochów (25 Feb), Ostrołęka, fall of Warsaw (Sept 1831) | en.wikipedia November Uprising; polishhistory.pl | Confirmed |
| polity-crimean-khanate | Hacı Giray c. 1441, Ottoman vassal 1475, 1571 fire of Moscow, Şahin Giray, 1783 | en.wikipedia Hacı I Giray; Fire of Moscow (1571) | Confirmed |
| ev-siege-of-belgrade-1456 | Flotilla destroyed 14 Jul, victory 22 Jul, Capistrano, Hunyadi died 11 Aug, noon-bell bull of 29 Jun | New World Encyclopedia; Hungarian Conservative (noon bell) | Confirmed |
| place-vilnius | 1323 letters, Żeligowski 1920, Central Lithuania, return to Lithuania in Oct 1939 | Timeline of Vilnius; Lodz city page; ideoz.fr | Confirmed |
| place-donetsk | Hughes 1869, Yuzovka, Stalin 1924 / Stalino 1929, Donetsk 1961 | en.wikipedia Donetsk; History Hit | Confirmed (the record’s note already flags the 1924/1929 name split) |
| polity-grand-duchy-of-lithuania | 1323 capital, Mindaugas (crowned 1253), rulers, union 1386, Commonwealth 1569 | Vilnius sources above; Britannica Lithuania (print article 343836); en.wikipedia Grand Duchy of Lithuania (mirror); polishhistory.pl | Confirmed (“one of Europe’s largest”, not “the largest”, as the record says) |

**Error rate:** 0 of 15 records (0%). No changes to the data. Validator: 0 errors.

## 2026-11 story verification (web-sourced)

Checked 2026-11-16. Every story not already checked against a retrieved web source (the 2026-11 audit covered 5 stories, which were skipped) was re-read claim by claim against pages retrieved during this check (WebFetch; WebSearch snippets where available). Nothing was accepted from memory. Fixes keep ids; en and zh were corrected together.

**Result:** 41 stories checked; 26 needed a correction or a hedge (63%); 74 text edits (en and zh counted separately). Of the 26, 1 had only a zh fix (polity-novgorod-republic: Vsevolod was prince, not grand prince, of Novgorod); 25 had a factual error or an unsupported claim in en (61%).

Skipped (already checked claim by claim in the 2026-11 audit): ev-coronation-of-stephen-i, ev-srebrenica-massacre, person-olga-of-kiev, ev-battle-of-kosovo, ev-velvet-revolution.

### Stories checked

| Story | Sources retrieved | Result |
|---|---|---|
| ev-corpus-juris-civilis | en.wikipedia: Corpus Juris Civilis en.wikipedia.org/wiki/Corpus_Juris_Civilis; en.wikipedia: Digest (Roman law) en.wikipedia.org/wiki/Digest_(Roman_law); en.wikipedia: Tribonian en.wikipedia.org/wiki/Tribonian; Scott tr. of constitution Tanta (Grenoble droit romain) droitromain.univ-grenoble-alpes.fr/Anglica/Digeste_Pre2_Scott.gr.html | fixed — open: "Some two thousand books" is Justinian's own figure in Tanta (en.wiki Digest says over 1,500). The first Code commission (528) included Tribonian but he did not lead it; he led the Digest and second Code work. |
| ev-siege-of-constantinople-717 | en.wikipedia: Siege of Constantinople (717–718) en.wikipedia.org/wiki/Siege_of_Constantinople_(717%E2%80%93718); en.wikipedia: Leo III the Isaurian en.wikipedia.org/wiki/Leo_III_the_Isaurian; Search snippets quoting Theophanes (horses, asses, camels) | fixed — open: Theophanes was unsure whether the Bulgars were led by Tervel or Kormesiy; sources differ on whether the Bulgars attacked the siege camp. "Almost seven centuries" to the Ottoman siege of 1394 not separately fetched. |
| ev-preslav-literary-school | en.wikipedia: Council of Preslav en.wikipedia.org/wiki/Council_of_Preslav; en.wikipedia: Clement of Ohrid en.wikipedia.org/wiki/Clement_of_Ohrid; en.wikipedia: Archbishopric of Moravia en.wikipedia.org/wiki/Archbishopric_of_Moravia; en.wikipedia: Preslav Literary School en.wikipedia.org/wiki/Preslav_Literary_School | ok — open: The 3,500 pupils figure comes from the hagiography; the story already attributes it to "his biography". |
| ev-battle-of-kleidion | en.wikipedia: Battle of Kleidion en.wikipedia.org/wiki/Battle_of_Kleidion; en.wikipedia: Samuel of Bulgaria en.wikipedia.org/wiki/Samuel_of_Bulgaria; bg.wikipedia: Битка при Беласица bg.wikipedia.org/wiki/Битка_при_Беласица; Stephenson, The Legend of Basil the Bulgar-Slayer (CUP 2003), via search snippets; Panov, Studia Ceranea | softened — open: Where Samuel saw the blinded men is unclear: bg.wiki says he was taken to Prilep but died at Prespa (6 Oct 1014). "About seventy years later" for Skylitzes (fl. c.1080s) is approximate. |
| ev-battle-of-mohi | en.wikipedia: Battle of Mohi en.wikipedia.org/wiki/Battle_of_Mohi; hu.wikipedia: Muhi csata hu.wikipedia.org/wiki/Muhi_csata; en.wikipedia: Béla IV of Hungary en.wikipedia.org/wiki/B%C3%A9la_IV_of_Hungary | fixed — open: "Wagons chained" not confirmed (en.wiki: fortified wagon camp). The "stones in a quarry" quotation and the "two days" pursuit could not be found in any source. |
| ev-time-of-troubles | en.wikipedia: Time of Troubles en.wikipedia.org/wiki/Time_of_Troubles; en.wikipedia: Rurik dynasty en.wikipedia.org/wiki/Rurik_dynasty | fixed |
| ev-partitions-of-poland | en.wikipedia: Partitions of Poland en.wikipedia.org/wiki/Partitions_of_Poland; en.wikipedia: Constitution of 3 May 1791 en.wikipedia.org/wiki/Constitution_of_3_May_1791; en.wikipedia: Kościuszko Uprising en.wikipedia.org/wiki/Ko%C5%9Bciuszko_Uprising; en.wikipedia: Third Partition of Poland en.wikipedia.org/wiki/Third_Partition_of_Poland; en.wikipedia: Battle of Racławice en.wikipedia.org/wiki/Battle_of_Rac%C5%82awice | ok — open: First partition: en.wiki gives about 30% of territory (and about half the population), which matches "about a third". "First codified national constitution in Europe" is close to en.wiki's "first codified, modern constit |
| ev-periodic-table | en.wikipedia: Dmitri Mendeleev en.wikipedia.org/wiki/Dmitri_Mendeleev; ru.wikipedia: Периодический закон ru.wikipedia.org/wiki/Периодический_закон; en.wikipedia: Gallium en.wikipedia.org/wiki/Gallium; Science History Institute, An Element of Order sciencehistory.org/distillations/magazine/an-element-of-order; W. B. Jensen, "Flu or Cheese?" homepages.uc.edu/~jensenwb/reprints/143.%20Flu%20or%20Cheese.pdf (via search snippet) | softened — open: Jensen disputes Gordin's version of the cheese-trip story. The eka- names date from 1871, not the 1869 table; the claim that the "surviving drafts show a day of hard working-out" is attributed to Gordin but was not verif |
| ev-february-revolution | en.wikipedia: February Revolution en.wikipedia.org/wiki/February_Revolution; en.wikipedia: Petrograd Soviet en.wikipedia.org/wiki/Petrograd_Soviet; Search snippets (Vyborg textile workers, 23 Feb; Volynsky mutiny, 27 Feb) | ok |
| ev-great-purge | en.wikipedia: Great Purge en.wikipedia.org/wiki/Great_Purge; en.wikipedia: Nikolai Yezhov en.wikipedia.org/wiki/Nikolai_Yezhov | ok — open: Arrest totals for 1937–38 vary by source (en.wiki Yezhov: at least 1.3 million; the NKVD figure is about 1.55 million). 681,692 executions confirmed. |
| ev-siege-of-leningrad | en.wikipedia: Siege of Leningrad en.wikipedia.org/wiki/Siege_of_Leningrad; ru.wikipedia: Блокада Ленинграда ru.wikipedia.org/wiki/Блокада_Ленинграда; en.wikipedia: Tanya Savicheva en.wikipedia.org/wiki/Tanya_Savicheva; en.wikipedia: Leningrad première of Shostakovich's Symphony No. 7 en.wikipedia.org/wiki/Leningrad_premi%C3%A8re_of_Shostakovich%27s_Symph… | fixed — open: The 125 g ration applied to dependants, employees and children from 20 Nov 1941; en.wiki gives only 125 g without categories. |
| ev-solidarity | en.wikipedia: Solidarity (Polish trade union) en.wikipedia.org/wiki/Solidarity_(Polish_trade_union); en.wikipedia: 1989 Polish parliamentary election en.wikipedia.org/wiki/1989_Polish_parliamentary_election; en.wikipedia: Gdańsk Agreement en.wikipedia.org/wiki/Gda%C5%84sk_Agreement; en.wikipedia: Lech Wałęsa en.wikipedia.org/wiki/Lech_Wa%C5%82%C4%99sa; pl.wikipedia: 21 postulatów MKS pl.wikipedia.org/wiki/21_postulat%C3%B3w_MKS | fixed — open: "A quarter of the population" is roughly right (10 million out of about 35.6 million is about 28%); en.wiki gives one-third of the working-age population. |
| ev-russian-invasion-of-ukraine-2022 | en.wikipedia: Russian invasion of Ukraine en.wikipedia.org/wiki/Russian_invasion_of_Ukraine; en.wikipedia: Siege of Mariupol en.wikipedia.org/wiki/Siege_of_Mariupol; en.wikipedia: UNGA Resolution ES-11/4 en.wikipedia.org/wiki/United_Nations_General_Assembly_Resolution_ES-11/4; UN News Nov 2025 (14,534 killed, 53,006 casualties to end Oct 2025) news.un.org/en/story/2025/11/1166343; Moscow Times 16 May 2025; IntelliNews 24 Jul 2025 (Istanbul talks, POW swaps, no ceasefire) | ok |
| person-taras-shevchenko | en.wikipedia: Taras Shevchenko en.wikipedia.org/wiki/Taras_Shevchenko; ru.wikipedia: Манифест 19 февраля 1861 года ru.wikipedia.org/wiki/Манифест_19_февраля_1861_года | fixed — open: He grew up under Vasily Engelhardt; Pavel inherited the estate in 1828. The story names only Pavel. |
| ev-nika-riots | en.wikipedia: Nika riots en.wikipedia.org/wiki/Nika_riots; en.wikipedia: Hagia Sophia (rebuilding begun 23 Feb 532) en.wikipedia.org/wiki/Hagia_Sophia | ok — open: Wikipedia says the riot lasted 'a week' (13-18 Jan); 'five days' is the common figure in other accounts. |
| ev-byzantine-iconoclasm | en.wikipedia: Byzantine Iconoclasm en.wikipedia.org/wiki/Byzantine_Iconoclasm; en.wikipedia: Constantine V en.wikipedia.org/wiki/Constantine_V; en.wikipedia: Chalke Gate en.wikipedia.org/wiki/Chalke_Gate | ok — open: Women killing the officer comes from Theophanes and later iconophile sources; the story already frames it that way. |
| ev-hungarian-conquest | en.wikipedia: Hungarian conquest of the Carpathian Basin en.wikipedia.org/wiki/Hungarian_conquest_of_the_Carpathian_Basin; en.wikipedia: Hungarian invasions of Europe en.wikipedia.org/wiki/Hungarian_invasions_of_Europe; en.wikipedia: Stephen I of Hungary en.wikipedia.org/wiki/Stephen_I_of_Hungary | ok — open: Stephen's coronation is dated 25 Dec 1000 or 1 Jan 1001; '1000' is the conventional date. |
| ev-sack-of-constantinople-1204 | en.wikipedia: Fourth Crusade en.wikipedia.org/wiki/Fourth_Crusade; en.wikipedia: Sack of Constantinople en.wikipedia.org/wiki/Sack_of_Constantinople; Fordham Medieval Sourcebook: Nicetas Choniates, Sack of Constantinople sourcebooks.fordham.edu/source/choniates1.asp | softened — open: Choniates was in the city during the sack, but nothing shows he personally saw the scenes in Hagia Sophia. |
| ev-hussite-wars | en.wikipedia: Hussite Wars en.wikipedia.org/wiki/Hussite_Wars; en.wikipedia: Jan Žižka en.wikipedia.org/wiki/Jan_%C5%BDi%C5%BEka; en.wikipedia: Jan Hus en.wikipedia.org/wiki/Jan_Hus; en.wikipedia: First Defenestration of Prague en.wikipedia.org/wiki/First_Defenestration_of_Prague | fixed — open: Domažlice flight at the hymn is legend; already hedged with 'reportedly'. 'Squire' loosely renders Žižka's lower-gentry (zeman) status. |
| ev-khmelnytsky-uprising | en.wikipedia: Khmelnytsky Uprising en.wikipedia.org/wiki/Khmelnytsky_Uprising; en.wikipedia: Bohdan Khmelnytsky en.wikipedia.org/wiki/Bohdan_Khmelnytsky | fixed — open: Kyiv entry: en.wikipedia gives 2 January 1649 (New Style); Ukrainian accounts often say late December 1648 (Old Style). |
| ev-crimean-war | en.wikipedia: Crimean War en.wikipedia.org/wiki/Crimean_War; ru.wikipedia: Оборона Севастополя (1854—1855) (349 days) ru.wikipedia.org/wiki/Оборона_Севастополя_(1854—1855); en.wikipedia: War photography en.wikipedia.org/wiki/War_photography; en.wikipedia: Florence Nightingale en.wikipedia.org/wiki/Florence_Nightingale; en.wikipedia: William Howard Russell en.wikipedia.org/wiki/William_Howard_Russell; en.wikipedia: Leo Tolstoy en.wikipedia.org/wiki/Leo_Tolstoy | fixed — open: The story sets the British and French declarations of war right after Sinop (1853); they came in March 1854. |
| ev-russian-revolution-1905 | en.wikipedia: Bloody Sunday (1905) en.wikipedia.org/wiki/Bloody_Sunday_(1905); ru.wikipedia: Кровавое воскресенье (1905) ru.wikipedia.org/wiki/Кровавое_воскресенье_(1905); en.wikipedia: Russian battleship Potemkin en.wikipedia.org/wiki/Russian_battleship_Potemkin; en.wikipedia: Saint Petersburg Soviet en.wikipedia.org/wiki/Saint_Petersburg_Soviet; marxists.org: Lenin, Left-Wing Communism ch. 3 marxists.org/archive/lenin/works/1920/lwc/ch03.htm | fixed — open: Marcher numbers are disputed (police about 3,000; organisers up to 50,000 or more), but 'tens of thousands' is the usual figure. |
| ev-russian-civil-war | en.wikipedia: Russian Civil War en.wikipedia.org/wiki/Russian_Civil_War; en.wikipedia: Execution of the Romanov family en.wikipedia.org/wiki/Execution_of_the_Romanov_family | fixed — open: Trotsky's armoured train is well known but was not on the pages fetched. |
| ev-katyn-massacre | en.wikipedia: Katyn massacre en.wikipedia.org/wiki/Katyn_massacre; pl.wikipedia: Zbrodnia katyńska pl.wikipedia.org/wiki/Zbrodnia_katyńska | softened — open: en.wikipedia gives 250,000–454,700 POWs; 250,000 is the low end. The 1992 handover is shown by a pl.wikipedia section heading, not by its text. |
| ev-hungarian-revolution-1956 | en.wikipedia: Hungarian Revolution of 1956 en.wikipedia.org/wiki/Hungarian_Revolution_of_1956; en.wikipedia: Stalin Monument (Budapest) en.wikipedia.org/wiki/Stalin_Monument_(Budapest); en.wikipedia: Imre Nagy en.wikipedia.org/wiki/Imre_Nagy | ok — open: The statue stood on the edge of the City Park. 'Read out sixteen demands' is loose: the students tried to broadcast them. |
| ev-baltic-way | en.wikipedia: Baltic Way en.wikipedia.org/wiki/Baltic_Way; lt.wikipedia: Baltijos kelias lt.wikipedia.org/wiki/Baltijos_kelias; en.wikipedia: Molotov–Ribbentrop Pact en.wikipedia.org/wiki/Molotov%E2%80%93Ribbentrop_Pact | fixed — open: lt.wikipedia names the Tallinn end as the Hermann Tower (Toompea Castle). |
| ev-siege-of-dorostolon | en.wikipedia: Sviatoslav's invasion of Bulgaria en.wikipedia.org/wiki/Sviatoslav%27s_invasion_of_Bulgaria; en.wikipedia: Siege of Dorostolon en.wikipedia.org/wiki/Siege_of_Dorostolon; en.wikipedia: Sviatoslav I en.wikipedia.org/wiki/Sviatoslav_I; en.wikipedia: Leo the Deacon en.wikipedia.org/wiki/Leo_the_Deacon | ok — open: Siege length is given as 65 days or about three months. Whether Leo the Deacon was an eyewitness himself is disputed, and 'knew eyewitnesses' is a fair hedge. Translations give one or two sidelocks. |
| polity-novgorod-republic | en.wikipedia: Novgorod Republic en.wikipedia.org/wiki/Novgorod_Republic; en.wikipedia: Birch bark manuscript en.wikipedia.org/wiki/Birch_bark_manuscript; ru.wikipedia: Ярославово дворище ru.wikipedia.org/wiki/Ярославово_дворище | fixed — open: Cloth/silver for furs/wax, and the debt notes and love letters, were not explicitly on the pages fetched. |
| ev-gothic-war-535 | en.wikipedia: Gothic War (535–554) en.wikipedia.org/wiki/Gothic_War_(535%E2%80%93554); en.wikipedia: Siege of Naples (536) en.wikipedia.org/wiki/Siege_of_Naples_(536) | ok — open: en.wikipedia dates the plague in the empire to 542 (it reached Egypt in 541); Narses's age and army size not stated in the article but consistent with standard accounts. |
| ev-moravian-mission | en.wikipedia: Saints Cyril and Methodius en.wikipedia.org/wiki/Saints_Cyril_and_Methodius; ru.wikipedia: Кирилл и Мефодий ru.wikipedia.org/wiki/Кирилл_и_Мефодий; BTA: The blessing of the Slavonic books in Rome bta.bg/en/news/381007-the-blessing-of-the-slavonic-books-in-rome | softened — open: Creating the alphabet before departure and the altar blessing both come from the hagiographic Vita Constantini; ru.wikipedia places the creation after leaving for Moravia. |
| ev-baptism-of-poland | en.wikipedia: Baptism of Poland en.wikipedia.org/wiki/Baptism_of_Poland; pl.wikipedia: Chrzest Polski pl.wikipedia.org/wiki/Chrzest_Polski | softened — open: pl.wikipedia notes the 965/966 dates are conventional rather than certain and rejects the older German-threat thesis; Dagome iudex c. 991 not covered by fetched pages (standard dating). |
| ev-mongol-invasion-of-rus | en.wikipedia: Mongol invasion of Kievan Rus' en.wikipedia.org/wiki/Mongol_invasion_of_Kievan_Rus%27; ru.wikipedia: Монгольское нашествие на Русь ru.wikipedia.org/wiki/Монгольское_нашествие_на_Русь; ru.wikipedia: Оборона Киева (1240) ru.wikipedia.org/wiki/Оборона_Киева_(1240) | softened — open: Kyiv's fall: 6 December (Laurentian Chronicle) vs 19 November 1240 (Pskov Chronicle); kept 6 December as the usual date. |
| ev-battle-of-mohacs | en.wikipedia: Battle of Mohács en.wikipedia.org/wiki/Battle_of_Moh%C3%A1cs | fixed — open: Ottoman strength is very uncertain (infobox 50,000–100,000; c. 45,000 combatants on the field per text); hedged "perhaps 50,000 to 60,000" left as is. |
| ev-founding-of-saint-petersburg | en.wikipedia: Saint Petersburg en.wikipedia.org/wiki/Saint_Petersburg; ru.wikipedia: История Санкт-Петербурга ru.wikipedia.org/wiki/История_Санкт-Петербурга | fixed — open: The turf/bayonet version of the founding legend is not in the fetched pages (ru.wikipedia gives an eagle-and-first-stone legend and rejects it); story already labels it legend. |
| ev-emancipation-of-the-serfs | en.wikipedia: Emancipation reform of 1861 en.wikipedia.org/wiki/Emancipation_reform_of_1861; ru.wikipedia: Крестьянская реформа в России ru.wikipedia.org/wiki/Крестьянская_реформа_в_России; search snippets (alphahistory, Britannica) on the sixth anniversary of accession | ok — open: Bezdna toll: official report 70 dead (en.wikipedia); "dozens" is consistent. Redemption ended 1 Jan 1907 under the Nov 1905 manifesto. |
| ev-assassination-of-franz-ferdinand | en.wikipedia: Assassination of Archduke Franz Ferdinand en.wikipedia.org/wiki/Assassination_of_Archduke_Franz_Ferdinand | ok — open: Ilić placed six assassins along the route (Ilić himself made a seventh); bomb wounded 16–20 people including bystanders, not only officers. |
| ev-holodomor | en.wikipedia: Holodomor en.wikipedia.org/wiki/Holodomor | ok — open: Children abandoned at railway stations not found in the fetched text; several scholarly estimates (Wheatcroft, Snyder) fall below 3.5 million, though the 3.5–5 million range is given in the article. |
| ev-auschwitz | en.wikipedia: Auschwitz concentration camp en.wikipedia.org/wiki/Auschwitz_concentration_camp | fixed — open: First Zyklon B victims also included sick Polish prisoners (Sept 1941, Block 11 of Auschwitz I). |
| ev-prague-spring | en.wikipedia: Prague Spring en.wikipedia.org/wiki/Prague_Spring; en.wikipedia: Warsaw Pact invasion of Czechoslovakia en.wikipedia.org/wiki/Warsaw_Pact_invasion_of_Czechoslovakia; mok.sk on 1970 KSČ screenings mok.sk/?p=1648 | fixed — open: Purge figures from a single Slovak secondary source (326,817 expelled/struck off in 1970; 473,731 total fall incl. voluntary departures). |
| ev-ukrainian-independence | en.wikipedia: Declaration of Independence of Ukraine en.wikipedia.org/wiki/Declaration_of_Independence_of_Ukraine; en.wikipedia: 1991 Ukrainian independence referendum en.wikipedia.org/wiki/1991_Ukrainian_independence_referendum; en.wikipedia: Chicken Kiev speech en.wikipedia.org/wiki/Chicken_Kiev_speech | ok — open: Referendum yes share 90.3% of votes cast per Declaration article (92.3% of valid votes per referendum article); "over 90 percent" holds either way. |
| person-skanderbeg | en.wikipedia: Skanderbeg en.wikipedia.org/wiki/Skanderbeg | softened — open: Hostage status disputed; Kunsthistorisches Museum (Imperial Armoury) location of helmet stated only indirectly in the fetched text. |

### Corrections

| Record | Field | Old → New | Reason | Source |
|---|---|---|---|---|
| ev-corpus-juris-civilis | summary.en | “Rediscovered in 11th-century Bologna,” → “Rediscovered in 11th-century Italy and taught at Bologna,” | The Digest manuscript resurfaced elsewhere in Italy (Amalfi/Pisa, c.1070) and was then taught at Bologna; the story itself says this | en.wikipedia Corpus Juris Civilis en.wikipedia.org/wiki/Corpus_Juris_Civilis |
| ev-corpus-juris-civilis | summary.zh | “这部法律汇编11世纪在博洛尼亚被重新发现，” → “这部法律汇编11世纪在意大利被重新发现、在博洛尼亚得到讲授，” | Matches the en fix | en.wikipedia Corpus Juris Civilis en.wikipedia.org/wiki/Corpus_Juris_Civilis |
| ev-siege-of-constantinople-717 | story.en | “Leo III, crowned only that March, had stocked the city with grain.” → “Leo III, crowned only that March, held a city already stocked with grain for a long siege.” | The walls were repaired and food stockpiled mainly under his predecessor Anastasius II | en.wikipedia Siege of Constantinople (717–718) en.wikipedia.org/wiki/Siege_of_Constantinople_(717%E2%80%93718) |
| ev-siege-of-constantinople-717 | story.zh | “当年三月刚刚加冕的利奥三世已在城中囤积了粮食。” → “当年三月刚刚加冕的利奥三世坐镇的这座城市早已为长期围城囤积了粮食。” | Matches the en fix | en.wikipedia Siege of Constantinople (717–718) |
| ev-siege-of-constantinople-717 | story.en | “When the Arab ships tried to pass into the Golden Horn, Byzantine fire-ships sprayed them with Greek fire, the secret incendiary that burned even on water.” → “As the Arab fleet sailed past the city into the Bosporus, a Byzantine squadron attacked its rearguard with Greek fire, the secret incendiary that burned even on water.” | The Greek-fire attack hit the fleet's rearguard in the Bosporus; Leo had closed the Golden Horn with a chain | en.wikipedia Siege of Constantinople (717–718) en.wikipedia.org/wiki/Siege_of_Constantinople_(717%E2%80%93718) |
| ev-siege-of-constantinople-717 | story.zh | “阿拉伯船只企图驶入金角湾时，拜占庭的火船向它们喷射希腊火——这种秘密燃烧剂甚至能在水面上燃烧。” → “阿拉伯舰队驶过城下进入博斯普鲁斯海峡时，一支拜占庭分舰队用希腊火袭击了它的后卫——这种秘密燃烧剂甚至能在水面上燃烧。” | Matches the en fix | en.wikipedia Siege of Constantinople (717–718) |
| ev-battle-of-kleidion | story.en | “When they reached Samuel at Prilep, he collapsed at the sight and died two days later.” → “When they reached Samuel, he collapsed at the sight and died two days later, on 6 October.” | Unverified location (bg.wiki puts his death at Prespa); added the attested date | en.wikipedia Samuel of Bulgaria en.wikipedia.org/wiki/Samuel_of_Bulgaria; bg.wikipedia Битка при Беласица |
| ev-battle-of-kleidion | story.zh | “他们来到普里莱普时，萨穆伊尔见状昏厥，两天后死去。” → “他们回到萨穆伊尔身边时，他见状昏厥，两天后即10月6日死去。” | Matches the en fix | en.wikipedia Samuel of Bulgaria |
| ev-battle-of-mohi | story.en | “but when Hungarian nobles murdered the Cuman khan Köten,” → “but when a mob in Pest killed the Cuman khan Köten,” | Köten was killed by a mob of Pest townspeople, not specifically by nobles | en.wikipedia Béla IV of Hungary en.wikipedia.org/wiki/B%C3%A9la_IV_of_Hungary; en.wikipedia Battle of Mohi |
| ev-battle-of-mohi | story.zh | “但匈牙利贵族杀害了库曼可汗科腾” → “但佩斯的暴民杀害了库曼可汗科腾” | Matches the en fix | en.wikipedia Béla IV of Hungary |
| ev-battle-of-mohi | story.en | “On the night of 10–11 April the Mongols seized the bridge with the help of catapults throwing missiles and fire, while Subutai forded the river downstream.” → “After a night attack on the bridge was beaten back, at dawn on 11 April the Mongols cleared it with stone-throwing catapults, while Subutai crossed the river further south.” | The night attack failed; the bridge was taken at dawn with stone-throwers; fire/gunpowder use is speculative | en.wikipedia Battle of Mohi en.wikipedia.org/wiki/Battle_of_Mohi; hu.wikipedia Muhi csata https://hu.wikipedia.org/wiki/Muhi_csata |
| ev-battle-of-mohi | story.zh | “4月10日夜至11日，蒙古人以投石机发射弹丸和火药夺取桥梁，速不台则在下游涉水渡河。” → “蒙古人夜袭桥梁被击退后，于4月11日黎明用投石机驱散守桥的匈牙利军，速不台则在更南面渡河。” | Matches the en fix; also drops the unsupported 火药 (gunpowder), which the en text never claimed | en.wikipedia Battle of Mohi; hu.wikipedia Muhi csata |
| ev-battle-of-mohi | story.en | “the fleeing Hungarians were cut down on the road to Pest for two days.” → “the fleeing Hungarians were cut down along the road to Pest.” | The two-day figure was not found in any source (hu.wiki footnote: "several days") | en.wikipedia Battle of Mohi; hu.wikipedia Muhi csata |
| ev-battle-of-mohi | story.zh | “溃逃的匈牙利人在通往佩斯的路上被追杀了两天。” → “溃逃的匈牙利人在通往佩斯的路上遭到追杀。” | Matches the en fix | en.wikipedia Battle of Mohi |
| ev-battle-of-mohi | story.en | “Thomas of Split described corpses scattered over the countryside "like stones in a quarry".” → “Thomas of Split wrote that the road was strewn with corpses and the ground dyed red with blood.” | The quoted simile could not be found in any source; replaced with the description en.wiki attributes to Thomas | en.wikipedia Battle of Mohi en.wikipedia.org/wiki/Battle_of_Mohi |
| ev-battle-of-mohi | story.zh | “斯普利特的托马斯形容尸体散落原野，“如同采石场里的石块”。” → “斯普利特的托马斯写道，沿路尸横遍野，大地被鲜血染红。” | Matches the en fix | en.wikipedia Battle of Mohi |
| ev-time-of-troubles | story.en | “the six-century line of Rurik ended” → “the Rurikid line, which traced its rule back more than seven centuries, ended” | The Rurikids ruled from 862 (traditional) to 1598, over 700 years, not six centuries | en.wikipedia Rurik dynasty en.wikipedia.org/wiki/Rurik_dynasty |
| ev-time-of-troubles | story.zh | “延续六个世纪的留里克世系就此断绝” → “可追溯七百多年的留里克世系就此断绝” | Matches the en fix | en.wikipedia Rurik dynasty |
| ev-periodic-table | story.en | “On 17 February (Old Style) he cancelled a trip to inspect cheese dairies and spent the day arranging cards.” → “On 17 February (Old Style), according to the usual account, he put off a trip to inspect cheese dairies and spent the day on the table; the image of him laying out element cards like patience is unconfirmed.” | The cheese-trip timing is disputed (Jensen vs Gordin) and the card-sorting story may be a myth; told as fact | W. B. Jensen, "Flu or Cheese?" homepages.uc.edu/~jensenwb/reprints/143.%20Flu%20or%20Cheese.pdf; Science History Institute https://www.sc… |
| ev-periodic-table | story.zh | “2月17日（旧历），他取消了视察奶酪厂的行程，花了一整天排列卡片。” → “按通常的说法，2月17日（旧历）他推迟了视察奶酪厂的行程，用一整天推敲这张表；至于他像玩纸牌接龙那样摆放元素卡片的情景，则无从证实。” | Matches the en fix | Jensen, "Flu or Cheese?" |
| ev-siege-of-leningrad | story.en | “In January and February 1942 tens of thousands died every month.” → “In January and February 1942 about 100,000 people died every month.” | Deaths peaked at about 100,000 a month; "tens of thousands" badly understates this | en.wikipedia Siege of Leningrad en.wikipedia.org/wiki/Siege_of_Leningrad |
| ev-siege-of-leningrad | story.zh | “1942年1月和2月，每月有数以万计的人死去。” → “1942年1月和2月，每月约有10万人死去。” | Matches the en fix | en.wikipedia Siege of Leningrad |
| ev-siege-of-leningrad | summary.en | “killed around 800,000 civilians or more;” → “killed an estimated 650,000 to over a million civilians;” | The lower bound was overstated: ru.wiki infobox gives about 649,000 (632,253 starved and 16,747 killed by shelling), with other estimates higher; this also matches the record note | ru.wikipedia Блокада Ленинграда ru.wikipedia.org/wiki/Блокада_Ленинграда; en.wikipedia Siege of Leningrad |
| ev-siege-of-leningrad | summary.zh | “造成约80万甚至更多平民死亡；” → “估计造成65万至逾百万平民死亡；” | Matches the en fix | ru.wikipedia Блокада Ленинграда |
| ev-solidarity | story.en | “it won 160 of the 161 freely contested seats in the Sejm” → “it won all 161 freely contested seats in the Sejm” | Solidarity won 160 in the first round and the last seat in the second round: 161 of 161 | en.wikipedia 1989 Polish parliamentary election en.wikipedia.org/wiki/1989_Polish_parliamentary_election |
| ev-solidarity | story.zh | “团结工会赢得众议院161个自由竞选席位中的160席” → “团结工会赢得众议院全部161个自由竞选席位” | Matches the en fix | en.wikipedia 1989 Polish parliamentary election |
| person-taras-shevchenko | story.en | “who noticed his drawing and took him to St Petersburg as a house painter.” → “who made him a house servant, noticed his drawing and had him apprenticed to a decorative painter in St Petersburg.” | Engelhardt took him as a servant (kozachok) and apprenticed him to the painter-decorator Shiryaev; he did not take him on as a house painter | en.wikipedia Taras Shevchenko en.wikipedia.org/wiki/Taras_Shevchenko |
| person-taras-shevchenko | story.zh | “地主发现他擅长绘画，便把他带到圣彼得堡当油漆匠。” → “地主让他当家仆，发现他擅长绘画后，又送他到圣彼得堡跟一位装饰画匠当学徒。” | Matches the en fix | en.wikipedia Taras Shevchenko |
| ev-sack-of-constantinople-1204 | story.en | “the historian Niketas Choniates watched soldiers strip the altar of Hagia Sophia and seat a prostitute on the patriarch's throne.” → “the historian Niketas Choniates, who lived through the sack, described soldiers breaking up the altar of Hagia Sophia and a prostitute seated on the patriarch's throne.” | Nothing shows that Choniates personally watched the scenes in Hagia Sophia. He describes the altar being broken up and shared out. | Fordham Sourcebook, Choniates sourcebooks.fordham.edu/source/choniates1.asp |
| ev-sack-of-constantinople-1204 | story.zh | “史家尼基塔斯·侯尼亚提斯亲眼看见士兵剥走圣索菲亚大教堂祭坛上的珍宝，还让一名妓女坐上牧首的宝座。” → “亲历这场浩劫的史家尼基塔斯·侯尼亚提斯记述，士兵把圣索菲亚大教堂的祭坛砸碎瓜分，一名妓女还坐上了牧首的宝座。” | Matches the en fix. | Fordham Sourcebook, Choniates sourcebooks.fordham.edu/source/choniates1.asp |
| ev-hussite-wars | story.en | “Žižka died of plague in 1424, blind by then.” → “Žižka, totally blind by then, died in 1424, traditionally of plague, though modern historians doubt it.” | Plague is only the tradition. Modern historians reject it and think a carbuncle more likely. | en.wikipedia: Jan Žižka en.wikipedia.org/wiki/Jan_%C5%BDi%C5%BEka |
| ev-hussite-wars | story.zh | “杰式卡1424年死于瘟疫，那时他已双目失明。” → “杰式卡1424年去世，那时他已双目失明；传统说法称他死于瘟疫，但现代史家对此存疑。” | Matches the en fix. | en.wikipedia: Jan Žižka en.wikipedia.org/wiki/Jan_%C5%BDi%C5%BEka |
| ev-khmelnytsky-uprising | story.en | “In early 1648 he fled to the Zaporozhian Sich” → “Late in 1647 he fled to the Zaporozhian Sich” | He fled after his arrest in autumn 1647 and was elected hetman at the end of January 1648. | en.wikipedia: Bohdan Khmelnytsky en.wikipedia.org/wiki/Bohdan_Khmelnytsky |
| ev-khmelnytsky-uprising | story.zh | “1648年初，他逃往” → “1647年底，他逃往” | Matches the en fix. | en.wikipedia: Bohdan Khmelnytsky en.wikipedia.org/wiki/Bohdan_Khmelnytsky |
| ev-khmelnytsky-uprising | story.en | “modern estimates of Jewish deaths vary widely but run into the tens of thousands” → “modern estimates of Jewish deaths vary widely, recent studies putting them at about 18,000–20,000” | Modern estimates include Pelenski's 6,000–14,000 and Stampfer's 18,000–20,000, so they do not all run into the tens of thousands. | en.wikipedia: Khmelnytsky Uprising (casualties) en.wikipedia.org/wiki/Khmelnytsky_Uprising |
| ev-khmelnytsky-uprising | story.zh | “现代学者对犹太人死亡人数的估计差别很大，但都在数万之谱” → “现代学者对犹太人死亡人数的估计差别很大，近年研究多认为约在1.8万至2万人之间” | Matches the en fix. | en.wikipedia: Khmelnytsky Uprising en.wikipedia.org/wiki/Khmelnytsky_Uprising |
| ev-khmelnytsky-uprising | story.en | “Khmelnytsky entered Kyiv in triumph in December 1648” → “Khmelnytsky entered Kyiv in triumph at the start of 1649” | en.wikipedia dates the entry to 2 January 1649. | en.wikipedia: Khmelnytsky Uprising en.wikipedia.org/wiki/Khmelnytsky_Uprising |
| ev-khmelnytsky-uprising | story.zh | “1648年12月，赫梅利尼茨基凯旋进入基辅” → “1649年初，赫梅利尼茨基凯旋进入基辅” | Matches the en fix. | en.wikipedia: Khmelnytsky Uprising en.wikipedia.org/wiki/Khmelnytsky_Uprising |
| ev-khmelnytsky-uprising | note | “about 15,000–20,000 (Stampfer)” → “about 18,000–20,000 (Stampfer)” | Stampfer's estimate is 18,000–20,000. | en.wikipedia: Khmelnytsky Uprising en.wikipedia.org/wiki/Khmelnytsky_Uprising |
| ev-crimean-war | summary.en | “the first war photographs” → “some of the earliest war photographs” | Earlier war photographs exist (Mexican–American War c. 1847; John McCosh 1848–49). Fenton was the first official war photographer. | en.wikipedia: War photography en.wikipedia.org/wiki/War_photography |
| ev-crimean-war | summary.zh | “最早的战地照片” → “最早一批战地照片” | Matches the en fix. | en.wikipedia: War photography en.wikipedia.org/wiki/War_photography |
| ev-russian-revolution-1905 | story.en | “the sailors of the battleship Potemkin mutinied at Odessa” → “the sailors of the battleship Potemkin mutinied and steamed into Odessa” | The mutiny began off Tendra Spit, and the ship reached Odessa that evening. | en.wikipedia: Russian battleship Potemkin en.wikipedia.org/wiki/Russian_battleship_Potemkin |
| ev-russian-revolution-1905 | story.zh | ““波将金”号战舰水兵在敖德萨哗变” → ““波将金”号战舰水兵哗变后驶入敖德萨” | Matches the en fix. | en.wikipedia: Russian battleship Potemkin en.wikipedia.org/wiki/Russian_battleship_Potemkin |
| ev-russian-revolution-1905 | story.en | “official figures gave about 130 dead” → “official figures gave about 96 to 130 dead” | The tsarist official figure was 96 dead (333 injured). About 130 is the count that includes later deaths, as given by Lopukhin. | en.wikipedia: Bloody Sunday (1905) en.wikipedia.org/wiki/Bloody_Sunday_(1905) |
| ev-russian-revolution-1905 | story.zh | “官方公布约130人死亡” → “官方公布的死亡人数约为96至130人” | Matches the en fix. | en.wikipedia: Bloody Sunday (1905) en.wikipedia.org/wiki/Bloody_Sunday_(1905) |
| ev-russian-revolution-1905 | story.en | “the most famous led in St Petersburg by Leon Trotsky” → “the most famous in St Petersburg, where Leon Trotsky was a leading figure” | The soviet's chairman was Khrustalev-Nosar. Trotsky joined a collegial chairmanship only after Khrustalev-Nosar's arrest in late November. | en.wikipedia: Saint Petersburg Soviet en.wikipedia.org/wiki/Saint_Petersburg_Soviet |
| ev-russian-revolution-1905 | story.zh | “其中最著名的是托洛茨基领导的圣彼得堡苏维埃” → “其中最著名的是圣彼得堡苏维埃，托洛茨基是其主要领导人之一” | Matches the en fix. | en.wikipedia: Saint Petersburg Soviet en.wikipedia.org/wiki/Saint_Petersburg_Soviet |
| ev-russian-civil-war | story.en | “Seven to ten million people had died, mostly of hunger and disease.” → “Estimates of the dead run from about seven to twelve million, mostly civilians, many of hunger and disease.” | en.wikipedia gives 7–12 million casualties, mostly civilians. | en.wikipedia: Russian Civil War en.wikipedia.org/wiki/Russian_Civil_War |
| ev-russian-civil-war | story.zh | “约七百万至一千万人在内战中死去，大多死于饥饿和疾病。” → “据估计，内战死亡人数约七百万至一千二百万，大多是平民，许多人死于饥饿和疾病。” | Matches the en fix. | en.wikipedia: Russian Civil War en.wikipedia.org/wiki/Russian_Civil_War |
| ev-katyn-massacre | story.en | “Most were released, but about 15,000” → “Many rank-and-file soldiers were released or handed over to the Germans, but about 15,000” | 'Most were released' is unsupported. About 125,000 were held in NKVD camps, and the others were released, handed to Germany or sent to labour camps. | en.wikipedia: Katyn massacre en.wikipedia.org/wiki/Katyn_massacre; pl.wikipedia: Zbrodnia katyńska |
| ev-katyn-massacre | story.zh | “大多数人获释，但约1.5万名” → “许多普通士兵获释或被移交德方，但约1.5万名” | Matches the en fix. | en.wikipedia: Katyn massacre en.wikipedia.org/wiki/Katyn_massacre |
| ev-baltic-way | story.en | “The secret protocol of the Nazi–Soviet pact of 23 August 1939 had assigned” → “The secret protocols of the Nazi–Soviet pact of 23 August 1939, as revised that September, had assigned” | The 23 August protocol put Lithuania in the German sphere. Most of Lithuania moved to the Soviet sphere only in the 28 September 1939 revision. | en.wikipedia: Molotov–Ribbentrop Pact en.wikipedia.org/wiki/Molotov%E2%80%93Ribbentrop_Pact |
| ev-baltic-way | story.zh | “1939年8月23日纳粹—苏联条约的秘密议定书把” → “1939年8月23日纳粹—苏联条约的秘密议定书及同年9月的修订把” | Matches the en fix. | en.wikipedia: Molotov–Ribbentrop Pact en.wikipedia.org/wiki/Molotov%E2%80%93Ribbentrop_Pact |
| polity-novgorod-republic | summary.zh | “1136年诺夫哥罗德市民驱逐弗谢沃洛德大公” → “1136年诺夫哥罗德市民驱逐弗谢沃洛德王公” | Mistranslation: Vsevolod Mstislavich was Prince of Novgorod, not a grand prince (en says 'Prince'). | en.wikipedia: Novgorod Republic en.wikipedia.org/wiki/Novgorod_Republic |
| ev-moravian-mission | story.en | “Before setting out Constantine devised a new alphabet” → “According to his Life, before setting out Constantine devised a new alphabet” | Creation before departure rests on the hagiographic Vita; ru.wikipedia places it after leaving | ru.wikipedia: Кирилл и Мефодий ru.wikipedia.org/wiki/Кирилл_и_Мефодий |
| ev-moravian-mission | story.zh | “出发前，君士坦丁创制了” → “据其传记记载，出发前，君士坦丁创制了” | 同上：此说出自圣徒传 | ru.wikipedia: Кирилл и Мефодий ru.wikipedia.org/wiki/Кирилл_и_Мефодий |
| ev-baptism-of-poland | story.en | “A Christian ruler could deal with the Empire as an equal and deprive German margraves of the excuse of missionary war.” → “Baptism sealed his alliance with Bohemia against the Veleti and raised his standing in Europe; older histories also saw it as denying German margraves a pretext for missionary war.” | Stated as fact an older interpretation that modern Polish historiography rejects; the documented context is the Bohemian alliance against the Veleti | pl.wikipedia: Chrzest Polski pl.wikipedia.org/wiki/Chrzest_Polski |
| ev-baptism-of-poland | story.zh | “基督教君主可以与帝国平起平坐，也使德意志边伯失去发动“传教战争”的借口。” → “受洗巩固了他与波希米亚结成的对抗维莱蒂人的同盟，提高了他在欧洲的地位；较早的史家还认为，这使德意志边伯失去了发动“传教战争”的借口。” | 同上 | pl.wikipedia: Chrzest Polski pl.wikipedia.org/wiki/Chrzest_Polski |
| ev-mongol-invasion-of-rus | story.en | “The spring thaw saved Novgorod, but the little town of Kozelsk held out for seven weeks and was called by the Mongols the "evil city".” → “By the traditional account the spring thaw saved Novgorod, but the little town of Kozelsk held out for seven weeks; the chronicles say the Mongols called it the "evil city".” | Thaw is only one of several explanations for sparing Novgorod; "evil city" is a chronicle report | ru.wikipedia: Монгольское нашествие на Русь ru.wikipedia.org/wiki/Монгольское_нашествие_на_Русь |
| ev-mongol-invasion-of-rus | story.zh | “春季解冻使诺夫哥罗德幸免于难，小城科泽利斯克却坚守了七个星期，被蒙古人称为“恶城”。” → “按传统说法，春季解冻使诺夫哥罗德幸免于难；小城科泽利斯克则坚守了七个星期，据编年史记载，蒙古人称之为“恶城”。” | 同上 | ru.wikipedia: Монгольское нашествие на Русь ru.wikipedia.org/wiki/Монгольское_нашествие_на_Русь |
| ev-battle-of-mohacs | story.en | “Archbishop Pál Tomori, a friar turned general, chose to give battle on the open plain south of Mohács rather than wait for Transylvanian reinforcements.” → “With Archbishop Pál Tomori, a friar turned general, in command, the war council chose to give battle on the open plain south of Mohács rather than wait for reinforcements from Transylvania and Croatia.” | The decision to fight was the war council's (pushed by impetuous nobles), not Tomori's alone; awaited reinforcements were Croatian as well as Transylvanian | en.wikipedia: Battle of Mohács en.wikipedia.org/wiki/Battle_of_Moh%C3%A1cs |
| ev-battle-of-mohacs | story.zh | “由修士转任将领的大主教托莫里·帕尔决定在莫哈奇以南的开阔平原上决战，而不等待特兰西瓦尼亚的援军。” → “由修士转任将领的大主教托莫里·帕尔统领全军，作战会议决定在莫哈奇以南的开阔平原上决战，而不等待特兰西瓦尼亚和克罗地亚的援军。” | 同上 | en.wikipedia: Battle of Mohács en.wikipedia.org/wiki/Battle_of_Moh%C3%A1cs |
| ev-battle-of-mohacs | story.en | “the guns and janissaries chained behind them” → “the guns and janissaries waiting in prepared positions behind it” | "Chained" guns is an unsupported embellishment; sources describe Janissaries and artillery firing from prepared positions | en.wikipedia: Battle of Mohács en.wikipedia.org/wiki/Battle_of_Moh%C3%A1cs |
| ev-battle-of-mohacs | story.zh | “却被后方以铁链相连的火炮和禁卫军撕得粉碎” → “却被阵后预设阵地中的火炮和禁卫军撕得粉碎” | 同上 | en.wikipedia: Battle of Mohács en.wikipedia.org/wiki/Battle_of_Moh%C3%A1cs |
| ev-founding-of-saint-petersburg | story.en | “the number is unknown, though later legend inflated it to the hundreds of thousands” → “the number is unknown, and later claims of 30,000 to 100,000 dead are probably exaggerated” | The legendary figures cited by historians are 30,000–100,000, not hundreds of thousands; ru.wikipedia treats them as exaggerated | ru.wikipedia: История Санкт-Петербурга ru.wikipedia.org/wiki/История_Санкт-Петербурга |
| ev-founding-of-saint-petersburg | story.zh | “后世传说更把它夸大到数十万” → “后世所说的三万至十万死者恐怕言过其实” | 同上 | ru.wikipedia: История Санкт-Петербурга ru.wikipedia.org/wiki/История_Санкт-Петербурга |
| ev-auschwitz | story.en | “the SS marched about 56,000 prisoners west” → “the SS marched some 56,000–58,000 prisoners west” | en.wikipedia gives some 58,000 evacuated from 17 January; figures vary | en.wikipedia: Auschwitz concentration camp en.wikipedia.org/wiki/Auschwitz_concentration_camp |
| ev-auschwitz | story.zh | “约5.6万名囚犯” → “约5.6万至5.8万名囚犯” | 同上 | en.wikipedia: Auschwitz concentration camp en.wikipedia.org/wiki/Auschwitz_concentration_camp |
| ev-prague-spring | story.en | “and nearly half a million party members were purged.” → “and through purges and resignations the party lost nearly half a million members.” | About 327,000 were expelled or struck off in 1970; the ~474,000 total includes some 147,000 who left voluntarily | mok.sk on the 1970 KSČ screenings mok.sk/?p=1648 |
| ev-prague-spring | story.zh | “近五十万党员遭到清洗。” → “党在清洗和退党中失去了近五十万名党员。” | 同上 | mok.sk mok.sk/?p=1648 |
| person-skanderbeg | story.en | “As a boy George Kastrioti was handed over by his father, an Albanian lord, as a hostage to Sultan Murad II. Raised at the Ottoman court, he converted” → “Probably at about eighteen, George Kastrioti was sent by his father, an Albanian lord, to the court of Sultan Murad II, traditionally as a hostage. There he converted” | Recent historians think he was sent at about 18 and his hostage status is disputed (only Barleti has all the brothers taken) | en.wikipedia: Skanderbeg en.wikipedia.org/wiki/Skanderbeg |
| person-skanderbeg | story.zh | “格尔吉·卡斯特里奥蒂幼年被身为阿尔巴尼亚领主的父亲送给苏丹穆拉德二世作人质。他在奥斯曼宫廷长大，改信伊斯兰教” → “格尔吉·卡斯特里奥蒂大约十八岁时被身为阿尔巴尼亚领主的父亲送到苏丹穆拉德二世的宫廷，传统说法称是作为人质。他在那里改信伊斯兰教” | 同上 | en.wikipedia: Skanderbeg en.wikipedia.org/wiki/Skanderbeg |
| person-skanderbeg | summary.en | “George Kastrioti was taken as a hostage to the Ottoman court,” → “George Kastrioti was sent to the Ottoman court, traditionally as a hostage,” | Hostage status disputed | en.wikipedia: Skanderbeg en.wikipedia.org/wiki/Skanderbeg |
| person-skanderbeg | summary.zh | “幼年被送往奥斯曼宫廷为人质，” → “被送往奥斯曼宫廷（传统说法称是作为人质），” | 同上 | en.wikipedia: Skanderbeg en.wikipedia.org/wiki/Skanderbeg |
