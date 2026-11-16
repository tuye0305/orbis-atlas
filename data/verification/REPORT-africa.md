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

## 2026-11 review

Independent reviewer, separate from the curator. Checked against Britannica (search snippets; direct fetches are refused), Wikipedia/Wikidata, the Fordham Sourcebook text of Hans Mayr (1505), and standard works (Welsby, Thornton, Vansina, Reefe, Mattingly, Dunn).

### Sample

- **All 49 stories on existing records** re-read claim by claim (39 events, 10 people).
- **All 52 stories on new records** (42 events, 10 people) read claim by claim, plus the summaries, dates, stops, name ranges and ruler lists of the other 56 new records: 108 of 108 new records seen, about 40 of them checked against a second source for a specific date, number or name.
- QIDs of all new records checked against their Wikidata labels and descriptions.

### Corrections

| Record | Field | Old → new | Reason / source |
| --- | --- | --- | --- |
| ev-arab-conquest-of-egypt | story | Fustat had “Africa’s first mosque” → “the first mosque in Egypt” | Contested superlative (Massawa claims older mosques) |
| ev-muslim-conquest-of-the-maghreb, person-dihya | story | Hassan took Carthage “in 698”, then lost to Dihya → “in the 690s” | Chronology of 695/698 and the Meskiana defeat is disputed; 698 is the final capture, after the defeat |
| ev-great-zimbabwe | story | “When Rhodesia became independent in 1980” → “When the country won independence in 1980” | Rhodesia was the name of the UDI state; independence came as Zimbabwe |
| ev-battle-of-kirina | story | Sumanguru “killed Sundiata’s brothers”; “Sundiata’s archer” → removed; Sundiata himself shoots the arrow | Not in Niane’s version; in Niane Sundiata shoots |
| ev-battle-of-isandlwana | story | “As ammunition ran short” → line fell back; ammunition story “now doubted” | Ammunition-supply myth questioned by modern historians (Knight) |
| ev-battle-of-adwa | story | “Around 6,000 … killed” → “More than 6,000” | Britannica: more than 6,000 dead, 3,000–4,000 captured |
| ev-rwandan-genocide | story | gacaca tried “hundreds of thousands” → “nearly two million” cases | Gacaca handled about 1.96 million cases |
| ev-first-heart-transplant | story | Washkansky 54 → 53 | Most reports (e.g. history.com) give 53; his birth year is uncertain (1912 or 1913) |
| person-hypatia | story | Synesius’s letters ask advice on “an astrolabe and a hydroscope” → asks her to have a hydroscope made; credits her teaching for his astrolabe | Letter 15 (hydroscope); the astrolabe is in *On the Gift* to Paeonius |
| ev-martyrdom-of-perpetua | story | Felicity gave birth “two days” → “three days” before the games | *Passio* 15 (prayer three days before the games, labour followed) |
| ev-elmina-castle | story | “ten caravels carrying 600 men” → about a dozen ships (nine caravels and two transports by one count), some 600 soldiers and craftsmen; “Britain bought” → “The Dutch handed it to Britain” (1872) | Fleet counts differ (Pina; secondary sources); 1871 Anglo-Dutch treaty |
| ev-almeida-sacks-kilwa-and-mombasa | story | Mayr counts “1,500 prisoners” → about 1,500 dead, “many prisoners” | Mayr’s text (Fordham Sourcebook) |
| ev-afonso-letters-on-slave-trade | story | “on the throne for seventeen years” → “about two decades” | Accession 1506 (traditional, and the person record) or 1509 (Thornton); the polity record uses 1509 |
| ev-congo-free-state-atrocities | story | “the first great international human-rights campaign” → “one of the first” | Contested superlative (anti-slavery movement) |
| ev-ife-heads | story | “the head he took turned out to be a later copy” → Frobenius had to return it; the head now in Ife is thought to be a copy, the original lost | Fagg and Underwood’s analysis |
| ev-black-death-in-egypt | story, people, note | Now states it is part of the pandemic (ev-black-death, data/europe); links Ibn Battuta (crossed plague-stricken Syria and Egypt in 1348) and Ibn Khaldun (lost his parents in Tunis); Dunn added as a source | Dunn, *Adventures of Ibn Battuta*; Ibn Khaldun’s autobiography |
| ev-franco-hova-war-1895 | qid | Q2638505 (both Franco-Hova wars) → Q4127978 (second Madagascar expedition); new endYear diff resolved keep-ours | More precise item |
| ev-aba-womens-war | image | set explicitly to the Women’s War memorial photograph | The Wikidata item’s label and image were vandalised (“Somorika Women”, an unrelated Edo photograph) |

Checked and confirmed with no change: Ezana (Constantius letter c. 356), Vandal Carthage (19 Oct 439; 80,000), Cairo (raven legend marked as legend), Lalibela, Mansa Musa’s hajj and Atlantic-voyage story, Dias, Adal war, Alcácer Quibir, Tondibi, Atlantic trade (12.5 / 10.7 million), Sokoto, Algeria, Great Trek, Suez (44% stake), Berlin, Scramble, Boer War camps (26,000 / at least 14,000), Herero and Nama (80,000 → 15,000; €1.1 billion), Italo-Ethiopian war, Egypt 1952, Algerian war, Ghana, Year of Africa (Resolution 1514, 89–0–9), Congo crisis, OAU, Biafra, 1994 election (62.6%), Tunisia, Optics, trans-Saharan trade, Timbuktu manuscripts (350,000; c. 4,000 burned); the people stories of Sundiata (epic marked as tradition), Mansa Musa, Ibn Battuta, Njinga, Kimpa Vita, Shaka, Menelik, Taytu and Mandela; Fort Jesus (captain, nine soldiers and a priest; relief a week later), and all other new stories.

### QIDs added (26)

- Events: ev-vandals-capture-carthage Q30742713; ev-ottoman-conquest-of-tunis-1574 Q2664371; ev-aba-womens-war Q4663118; ev-igbo-ukwu-bronzes Q4785495 (the site item; note added).
- Rulers: Yetbarak Q342847, Matope Q96051706, Abd al-Malik I Q335118, Muhammad ibn Idris Q2737233, Yahya ibn Muhammad Q681523, Yahya ibn Idris ibn Umar Q3141238, al-Hasan ibn Kannun Q253605, Muhammad I (Aghlabid) Q321847, Abu Ibrahim Ahmad Q324776, al-Mansur ibn Buluggin Q341992, Badis Q778316, al-Hasan ibn Ali Q294307, Abu Yahya Abu Bakr II Q324785, Abu al-Abbas Ahmad II Q335558, Muhammad VI Q2822167, Badi VII Q4840914, Sulayman Solongdungu Q7636047, Bagauda Q107530811, Muhammad Kisoki Q96338251, Mbandi Ngola Kiluanje Q142077728, Andriamanelo Q2846855, Kintu Q1636788.
- Still no item (searched Wikidata full-text and English Wikipedia): Mansa Musa’s hajj, Dias’s voyage, first heart transplant, Balbus, the Kushite–Roman war, Aksum and Meroë, the Nubian missions, al-Bakri, Kanem’s conversion, the Solomonic restoration, Black Death in Egypt (only a broader Middle East item, Q92159855), Sunni Ali at Timbuktu, the 1491 baptism, Afonso’s letters, Njinga’s embassy, Dahomey and Ouidah, Zanzibar as Omani capital, Sennar’s founding, Rumfa’s reforms; rulers Zirid/Hafsid/Darfur gaps such as Abd al-Rahman al-Rashid, Ngola Kiluanje kia Samba, João Hari II.

### Added (6 polities)

polity-nobatia (Q568523), polity-alodia (Q449639), polity-garamantes (Q839034), polity-ife (Q110051642, classical period c. 1000–1420), polity-luba (Q1768252, rulers after Stewart), polity-lunda (Q1796223). Linked from the Nubian missions, Balbus, Ife heads and Sennar events. Ruler lists are kept short where reigns are not dated (Nobatia: Silko only; Garamantes, Ife and Lunda: none). New diff polity-lunda:to resolved keep-ours. A Hausa state was not added: Kano already exists, with rulers.

### Cross-dataset

The West Asia branch has `person-baybars` (a ruler entry of the Mamluk polity here, not a duplicate record), `person-selim-i` and `ev-ottoman-mamluk-war`. Africa has no duplicate Mamluk or Fatimid person or event records; `ev-battle-of-ridaniya` (a battle within that war, its own QID) now links `person-selim-i`, which will resolve when West Asia merges (validator warning until then, like Justinian and Napoleon from Europe).

## 2026-11 audit (web-sourced)

Independent audit using only sources retrieved during the audit (web search results and fetched pages); nothing checked from memory.

- Seed: `20261114` (mulberry32 shuffle over the 163 records that are new in this PR or gained a story; first 15 kept, 10 of them with stories).
- Sample: 15 records (9 events, 3 people, 2 places, 2 polities; overlap counted once).

| Record | Claims checked | Source(s) retrieved | Result |
| --- | --- | --- | --- |
| ev-elmina-castle | Azambuja, Dec 1481 / Jan 1482, ~600 men, Caramansa and the sacred rock, Dutch 1637, Britain 1872 | en.wikipedia Elmina Castle; History of Elmina; colonialvoyage.com | Fixed: “the walls rose in about three weeks” overstated; the sources say the first tower was finished in about twenty days |
| ev-benin-expedition-1897 | Phillips party ambushed Jan 1897, Igue/Ague festival, ~1,200 men, entry 18 Feb, palace fire 21 Feb, Ovonramwen’s surrender (Aug) and exile to Calabar, died 1914 | en.wikipedia Benin Expedition of 1897; Ovonramwen; Art Institute of Chicago Benin pages | Confirmed |
| ev-south-sudan-independence | CPA 2005, Jan 2011 referendum (98.83%), 9 Jul 2011, war from Dec 2013 | Al Jazeera timeline; en.wikipedia 2011 referendum | Confirmed |
| ev-battle-of-haydaran | Break with Fatimids (1048), al-Yazuri, camel-and-money story, 14 Apr 1052, Kairouan abandoned 1057, move to Mahdia | en.wikipedia Battle of Haydaran; Hilalian invasion of Ifriqiya; Zirid dynasty; Univ. of Wisconsin digitised *Cambridge History* chapter | Confirmed (the per-man gold coin is only in the chronicle tradition, which the story already flags) |
| ev-founding-of-cairo | Jawhar, 6 Jul 969 (17 Shaʿban 358), raven-and-bells legend, al-Azhar 970, al-Muʿizz 973 with his predecessors’ coffins | Ismaili heritage pages; MIT 4.615 notes; Institute of Ismaili Studies | Confirmed |
| place-mbanza-kongo | São Salvador from c. 1570, cathedral name, abandoned in the civil wars, Pedro IV 1709, name restored 1975, UNESCO 2017 | en.wikipedia M’banza-Kongo; Pedro IV of Kongo; Battle of São Salvador; dzieje.pl | Confirmed |
| polity-zirid | 972–1148, ruler dates, Mahdia 1057, Normans 1148 | en.wikipedia Zirid dynasty; Wikidata Q3571331, Q13195390 | Fixed: ruler list jumped from Tamim (to 1108) to al-Hasan (from 1121); added Yahya ibn Tamim 1108–1116 and Ali ibn Yahya 1116–1121 |
| person-nzinga | Born c. 1582/83, Luanda embassy to Correia de Sousa, mat-and-servant anecdote, baptism as Ana de Sousa, 1624, Matamba 1631, Dutch 1641–48, peace 1656/57, sister Barbara, died 1663, Kinaxixi statue | en.wikipedia Nzinga of Ndongo and Matamba; Mukambu of Matamba; History Hit | Confirmed (sources split 1621/1622 for the embassy and 1656/1657 for the peace; the record’s years are within the range) |
| ev-pachomius-founds-tabennisi | Conscription, Christians feeding conscripts at Thebes, Tabennisi c. 318–323, died 346, nine monasteries, Jerome’s Latin rule (404), Benedict | en.wikipedia Pachomius the Great; Britannica snippet (died 346); Cambridge Medieval History excerpt (nine men’s houses); encyclopedia.com | Confirmed (Wikipedia gives 348 and eight houses; Britannica and the Cambridge history support the record) |
| person-muhammad-ahmad-mahdi | Born 1844 on Labab island, boat-builders, Sammaniyya, quarrel over the circumcision feast, 29 Jun 1881, Aba, Jebel Qadir, Shaykan (Nov 1883, c. 8,000 men), Khartoum 26 Jan 1885, relief two days later, typhus, June 1885 | en.wikipedia Muhammad Ahmad; Battle of Shaykan; New World Encyclopedia | Confirmed (Wikipedia says 1843, most sources 1844) |
| ev-scramble-for-africa | Tunisia 1881, Egypt 1882, Angra Pequena 1884, Belloc 1898, Omdurman dead, Adwa, Liberia/Ethiopia | en.wikipedia Battle of Omdurman; World History Encyclopedia; warhistoryonline | Confirmed (Omdurman estimates run c. 9,700–12,000; “some 10,000” is within) |
| person-shaka | Born 1787, chief 1816, Port Natal traders, Nandi’s death 1827, killed Sept 1828 by Dingane and Mhlangana at KwaDukuza | history.com; countrystudies.us (Library of Congress); BlackPast | Confirmed |
| place-luanda | 1576 Dias de Novais, Dutch 1641–48, Correia de Sá’s Brazilian fleet 1648, capital since 1975 | en.wikipedia Timeline of Luanda; Infopedia; EBSCO | Confirmed |
| polity-ndongo | Ngola title, ruler dates, Hari client kings, Pungo Andongo 1671 | countrystudies.us; en.wikipedia List of Ngolas of Ndongo; Battle of Pungo Andongo; EBSCO | Confirmed |
| ev-muslim-conquest-of-the-maghreb | Kairouan 670, ʿUqba’s death at Vescera, Carthage 698, Dihya c. 701–703, Musa by 709 | en.wikipedia Battle of Vescera; Kusaila; Uqba ibn Nafi | Fixed: route point dated ʿUqba’s death 682 while the story says 683; route aligned to 683 (sources give 682 or 683) |

**Error rate:** 3 of 15 records needed a fix (20%); 1 substantive (the Zirid ruler gap), 2 minor (an overstated building time, an internal date mismatch). No wrong QIDs, names or zh renderings found. Validator 0 errors; enrich and build clean; 0 open diffs.
