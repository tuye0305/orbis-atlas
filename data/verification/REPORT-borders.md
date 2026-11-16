# Border label audit: historical-basemaps snapshots

Verifier: independent border-audit agent.

## Scope and method

The audit covers every snapshot from −1 to 2010 in aourednik/historical-basemaps. Regions covered:

- Europe
- Africa
- West Asia
- Central Asia west of about 80°E
- South Asia
- Southeast Asia

East Asia and China are skipped, because those borders come from jiangshan-map.

Method:

1. An audit script printed every feature's NAME, SUBJECTO, PARTOF, area, centroid and bbox for each snapshot.
2. Each snapshot was then read by hand, largest polities first.
3. A validation script confirmed two things: every corrected NAME exists in its snapshot, and every matching feature sits in the intended area.

A rename applies to every feature with that NAME in that snapshot.

Each snapshot applies from its own year until the next snapshot, and each label is judged against the snapshot year. Exception: some labels became correct a few years after the snapshot year. If the polygon fits, the label is kept and listed under "Borderline labels".

**Result:**

- **248 renames in 38 snapshots**, in `data/borders/corrections.json`
- **51 new names** in `data/borders/polity-names.json` (keys added only)

"Source checked" column:

- † means the article was fetched and read during this audit.
- Other rows rely on the standard dates in the named Wikipedia or Britannica article, which was not re-fetched.
- W: = en.wikipedia.org/wiki/

## Corrections

| Snapshot(s) | Source label | Problem | Correction | Source checked |
| --- | --- | --- | --- | --- |
| −1, 100, 200 | Satavahanihara | Garbled name | Satavahana Empire | W:Satavahana_dynasty |
| 300, 400 | Satavahanihara | The Satavahanas ended c. 220–230; the Deccan was under the Vakatakas | Vakataka | W:Vakataka_dynasty |
| −1 … 400 | Dumonii | Typo | Dumnonii | W:Dumnonii |
| 300 | Parthian Empire | Arsacid Parthia fell in 224; the Sasanians ruled from then on | Sasanian Empire | W:Sasanian_Empire |
| 300 | Rome (Constantinus) | The western caesar of 293–305 (Gaul, Britain) was Constantius I; Constantine rose only in 306 | Rome (Constantius) | W:Tetrarchy † |
| 500 | Kushan Principalities | Kidarite rule in Gandhara/Punjab ended c. 460–470, when the Alchon took over | Alchon Huns | W:Alchon_Huns † |
| 500 | Western Roman Empire (Wales/Cornwall/Cumbria) | The WRE was gone by 476 and Britain was abandoned c. 410; these are sub-Roman British kingdoms | Britons | W:Sub-Roman_Britain |
| 600 | Shaskanka | A king's name, misspelt (Shashanka), used as the state name | Gauda Kingdom | W:Gauda_Kingdom |
| 700 | Sasanian Empire; Sasanian dependencies; Hejaz | The Sasanian Empire fell in 651; Iran, Yemen and Hejaz were Umayyad in 700 | Umayyad Caliphate | W:Umayyad_Caliphate |
| 800 | Rajput Clans and Small States | The polygon is mainland Southeast Asia (92–107°E), not Rajasthan | minor Hindu and Buddhist states (a label already used in the same snapshot) | location check |
| 800, 900 | Irlanda | Italian/Spanish spelling | Ireland | — |
| 900 | Avars (eastern Carpathian lowlands) | Avar power was destroyed in 791–796; the Magyars took the eastern basin from 895 | Magyars | W:Hungarian_conquest_of_the_Carpathian_Basin † |
| 900 | Magyars (Etelköz) | The Magyars left Etelköz after the Pecheneg attacks of c. 895, and the Pechenegs then held it. The article does not name later occupiers | Pechenegs | same † |
| 900 | Picts; Scots | The Pictish and Dál Riata kingdoms had merged; Donald II (d. 900) was the first *rí Alban* | Kingdom of Alba | W:Kingdom_of_Alba † |
| 1000 | Peshemegs | Typo | Pechenegs | — |
| 1000 | Bulgar Khanate | Bulgaria was a Christian tsardom from 864/913, not a khanate | First Bulgarian Empire | W:First_Bulgarian_Empire |
| 1100 | Bulgar Khanate | Bulgaria was a Byzantine province 1018–1185 | Byzantine Empire | W:Theme_of_Bulgaria |
| 1200, 1279, 1300 | Bulgar Khanate | The Asen state (1185–1396) is mislabelled as a khanate | Second Bulgarian Empire | W:Second_Bulgarian_Empire |
| 1400 | Bulgar Khanate (Danube, S=Ottoman) | The Tsardom of Vidin fell to the Ottomans in 1396 | Ottoman Empire | W:Tsardom_of_Vidin |
| 1000, 1100 | Senas (Assam/Manipur, 91–95°E) | The Senas rose c. 1070 in Bengal; this area was Kamarupa (Pala dynasty, c. 900–1100) | Kamarupa | W:Kamarupa † |
| 1000, 1100, 1200 | Burgandy | Typo | Kingdom of Burgundy | — |
| 1000 … 1500 (8 snapshots) | Merina Kingdom | The Merina kingdom began c. 1540 (Andriamanelo); before that the highlands were Vazimba | Vazimba | W:Merina_Kingdom |
| 1100 | Karkhanids; Paramas; Klachuris | Typos | Karakhanid Khanate; Paramaras; Kalachuris | — |
| 1100, 1200 | Pyu state; Mon state | The Pyu city-states ended in the 9th century; Thaton fell to Pagan in 1057 | Kingdom of Pagan | W:Pagan_Kingdom |
| 1100 | Kingdom of Sukhotai | Sukhothai was founded in 1238 | minor Hindu and Buddhist states | W:Sukhothai_Kingdom |
| 1100 | Duchy of Benevento (southern Italy) | Southern Italy was Norman by 1100; Benevento was papal from 1077 | Duchy of Apulia and Calabria | W:Duchy_of_Apulia_and_Calabria |
| 1200 | Duchy of Benevento | Same area, now the Kingdom of Sicily (from 1130) | Kingdom of Sicily | W:Kingdom_of_Sicily |
| 1200 | Fatimid Caliphate | The Fatimids ended in 1171 and the Ayyubids ruled Egypt and Syria. The polygon also reaches too far west (see geometry) | Ayyubid Sultanate | W:Ayyubid_dynasty |
| 1200 | Ghaznavid Emirate; Buyid dynasty (Gandhara) | The Ghaznavids ended in 1186 and the Buyids in 1062; both areas were Ghurid in 1200 | Ghurid Sultanate | W:Ghurid_dynasty |
| 1200 | Ifat | Ifat dates from c. 1275–85; the Ethiopian highlands were under the Zagwe (1137–1270) | Zagwe dynasty | W:Zagwe_dynasty † |
| 1279, 1300 | Seljuk Caliphate | Misnomer for the Sultanate of Rum | Sultanate of Rum | W:Sultanate_of_Rum |
| 1279, 1300 | Ryazan (21–46°E, all of Rus') | One small principality's name on the whole Rus' polygon | Rus principalities | W:Grand_Duchy_of_Ryazan |
| 1279 | Kediri | Kediri fell to Singhasari in 1222 | Singhasari | W:Singhasari † |
| 1300, 1400 | Kediri | Majapahit from 1293 | Majapahit | W:Singhasari †, W:Majapahit |
| 1279, 1300, 1400 | Aceh | The Aceh Sultanate dates from c. 1496; northern Sumatra was Samudera Pasai (from 1267) | Samudera Pasai | W:Samudera_Pasai_Sultanate † |
| 1300 | Chola Empire (Kanchi) | The Cholas ended in 1279; Tondaimandalam was Pandya | Pandya state | W:Pandya_dynasty |
| 1400 | Chola Empire | Vijayanagara held the Tamil country from the 1360s–1378 | Vijayanagara | W:Vijayanagara_Empire |
| 1300, 1400 | Shoa | The Makhzumi Shewa sultanate was absorbed by Ifat in 1285 | Ifat | W:Sultanate_of_Ifat |
| 1400 | Pagan | Pagan collapsed 1287–97; Ava (1365–1555) was the Upper Burma state | Ava | W:Ava_Kingdom |
| 1492, 1500 | Imperial Hungary | A term for Habsburg Royal Hungary after 1526; under the Jagiellons this was the Kingdom of Hungary | Kingdom of Hungary | W:Royal_Hungary |
| 1492, 1500 | Rajastan | Modern-province spelling | Rajput kingdoms | — |
| 1492, 1500, 1715, 1783, 1800, 1878, 1880 | Papua New Guinea | Modern state name (1975) | Papuans | — |
| 1530 | Tsardom of Muscovy | The tsardom was proclaimed in 1547; in 1530 this was the Grand Duchy | Grand Duchy of Moscow | W:Grand_Duchy_of_Moscow |
| 1530 | central Asian khanates (on Novaya Zemlya) | The polygon is at 54–69°E, 73–77°N | Nenets | location check |
| 1530, 1600 | Malacca | Portugal took Malacca in 1511; the sultanate continued as Johor (1528) | Johor Sultanate | W:Johor_Sultanate † |
| 1600 | Watassid Morocco | The Wattasids ended 1549–54; the Saadi dynasty ruled | Saadi Sultanate | W:Saadi_Sultanate |
| 1600 | Songhai (Niger bend) | Songhai fell in 1591 (Tondibi); the Moroccan Pashalik of Timbuktu followed | Arma | W:Pashalik_of_Timbuktu |
| 1600 | Adal | Adal ended in 1577 and moved to Aussa | Awsa (the label used from 1650) | W:Imamate_of_Aussa |
| 1650 | Ahmadnagar | Annexed by the Mughals in 1636 | Mughal Empire | W:Ahmadnagar_Sultanate |
| 1650 | Bidar | Annexed by Bijapur in 1619 | Bijapur | W:Bidar_Sultanate † |
| 1650, 1700 | Luxembourg (2–7°E, 49–52°N) | The polygon is the whole Spanish Netherlands | Habsburg Netherlands | W:Spanish_Netherlands |
| 1650, 1700, 1715 | Sardinia-Piedmont | Savoy gained Sardinia only in 1720 | Savoy | W:Duchy_of_Savoy |
| 1650, 1700, 1715 | Nogai Horde (51–61°E) | The Kalmyks displaced the Nogai from 1630 | Kalmyk Khanate | W:Kalmyk_Khanate † |
| 1700, 1715, 1783, 1800 | Austrian Empire | The Austrian Empire was proclaimed in 1804 | Habsburg Monarchy | W:Habsburg_monarchy |
| 1700, 1715 | Arakan (Indian princely state) | Mrauk U was independent until 1784 and never an Indian princely state | Arakan | W:Kingdom_of_Mrauk_U |
| 1715, 1783 | United Kingdom | The United Kingdom dates from 1801; the Kingdom of Great Britain covers 1707–1800 | Kingdom of Great Britain | W:Kingdom_of_Great_Britain |
| 1783 | Venetia | The Republic of Venice existed until 1797 | Venice | W:Republic_of_Venice |
| 1783 | Golconda | Annexed in 1687; this is the Nizam's Hyderabad | Nizam's Dominions (the label used in 1800) | W:Hyderabad_State |
| 1783, 1800 | Kingdom of the Two Sicilies | Created in 1816 | Naples | W:Kingdom_of_Naples |
| 1800 | Austrian Netherlands | Annexed by France in 1795 | France | W:Austrian_Netherlands |
| 1815 | "       " (blank, S=United Kingdom of Netherlands) | The name is only spaces, so the label renders empty | United Kingdom of the Netherlands | — |
| 1878 | Sultinate of Zanzibar | Typo | Sultanate of Zanzibar | — |
| 1900 | Tukular Caliphate; First/Second Samori Empire; Futa Toro; Futa Jalon; Kong | Conquered by France 1890–98 (Samori captured 1898) | French West Africa | W:Toucouleur_Empire, W:Wassoulou_Empire |
| 1900 | Sultanate of Utetera; Yeke; Luba; Lunda; Yaka | Absorbed into the Congo Free State by the 1890s (Msiri killed 1891) | Congo Free State | W:Congo_Free_State |
| 1900 | Mirambo Unyanyembe Ukimbu; Nguni | Part of German East Africa | German E. Africa (Tanganyika) | W:German_East_Africa |
| 1900 | Harer (Egypt) | Menelik took Harar in 1887 | Ethiopia | W:Emirate_of_Harar |
| 1900 | Imerina | French annexation 1896; the monarchy was abolished in 1897 | Madagascar (France) | W:French_Madagascar |
| 1900 | Shona; Ndebele | BSAC Rhodesia (1890–97) | Rhodesia | W:Company_rule_in_Rhodesia |
| 1900 | Griqualand West; Zululand; Ngwato; Accra; Teke | Annexed to the Cape (1880), Natal (1897), the Bechuanaland Protectorate (1885), the Gold Coast, and French Congo | Cape Colony; Natal; Bechuanaland; Gold Coast; Congo (France) | standard colonial dates |
| 1914 | Georgia; Azerbaijan; Armenia | Part of the Russian Empire until 1917–18 | Russian Empire | W:Caucasus_Viceroyalty |
| 1914–1960 | Fifteen post-independence names; see the list after this table | Post-independence names on colonial territories. Each is fixed only in snapshots before its independence or renaming | the colonial names in the same list | standard independence dates |
| 1920, 1930 (Zaire (Belgium)); 1945 (Zaire) | Zaire | Zaire is the 1971–97 name | Belgian Congo | W:Belgian_Congo |
| 1960 | Zaire | Same | Congo-Léopoldville | W:Republic_of_the_Congo_(Léopoldville) |
| 2000, 2010 | Zaire | Renamed in 1997 | Democratic Republic of the Congo | — |
| 1920–1945 | Sudan | An Anglo-Egyptian condominium until 1956 | Anglo-Egyptian Sudan | — |
| 1920, 1930 | Iran | Persia until 1935 | Persia | W:Pahlavi_Iran |
| 1920 | USSR | The USSR was formed in December 1922 | Soviet Russia | W:Russian_SFSR |
| 1920 | Yugoslavia | Name adopted in 1929 | Kingdom of Serbs, Croats and Slovenes | W:Kingdom_of_Yugoslavia |
| 1930 | White Russia (26–180°E: the whole USSR) | Belarus's name is on the entire Soviet polygon | USSR | location check |
| 1920 | Emirate of Bin Shal'an (40–56°E: central Arabia) | A Ruwala chief's name on Ibn Saud's Nejd | Nejd | W:Emirate_of_Nejd_and_Hasa |
| 1930 | Hejaz; Hail; Emirate of Bin Shal'an | Hail was conquered in 1921 and Hejaz in 1925; a united kingdom 1926–32 | Kingdom of Hejaz and Nejd | W:Kingdom_of_Hejaz_and_Nejd † |
| 1938 | Hejaz; Hail; Emirate of Bin Shal'an | Saudi Arabia from 1932 | Saudi Arabia | same † |
| 1938 | Mesopotamia (GB) | Independent Kingdom of Iraq from 1932 | Iraq | W:Kingdom_of_Iraq |
| 1938, 1945 | Israel | The state was founded in 1948 | Mandatory Palestine (GB) | — |
| 1938 | Walbis Bay | Typo | Walvis Bay | — |
| 1945 | India; Pakistan; Bangladesh | Partition was in 1947 (Bangladesh in 1971) | British Raj | — |
| 1945 | Jordan; Mali; Benin; Burkina Faso; Central African Republic; Cameroon; Oman; Rhodesia | Later state names | Transjordan; French Sudan; French Dahomey; French West Africa (Upper Volta was dissolved 1932–47); Ubangi-Shari; French Cameroons; Muscat and Oman; Southern Rhodesia | standard dates |
| 1945 | Cyraneica (UK Lybia); Tripolitana (UK Lybia); Fezzan (Frech Lybia) | Typos | Cyrenaica (UK); Tripolitania (UK); Fezzan (France) | — |
| 1960 | Benin; Burkina Faso; Oman | Dahomey until 1975, Upper Volta until 1984, Muscat and Oman until 1970 | Republic of Dahomey; Upper Volta; Muscat and Oman | — |
| 1994, 2000 | Serbia; Montenegro | Federal Republic of Yugoslavia 1992–2003 | Federal Republic of Yugoslavia | W:Serbia_and_Montenegro |
| 1994, 2000, 2010 | Byelarus | Obsolete spelling | Belarus | — |

The fifteen post-independence names fixed in the 1914–1960 snapshots:

| Source label | Correction |
| --- | --- |
| Botswana | Bechuanaland |
| Malawi | Nyasaland |
| Lesotho | Basutoland |
| Equatorial Guinea | Spanish Guinea |
| Djibouti | French Somaliland |
| Guinea-Bissau | Portuguese Guinea |
| Zambia | Northern Rhodesia |
| Zimbabwe | Southern Rhodesia |
| Ghana | Gold Coast |
| Tanzania, United Republic of | Tanganyika Territory |
| Namibia | South West Africa |
| Sri Lanka | Ceylon |
| Western Sahara | Spanish Sahara |
| United Arab Emirates | Trucial Oman |
| Malaysia | British Malaya (1920–45); Malaya (1960) |

## Problems seen but not fixed

These are cases where the geometry is wrong, or where no single polity name would be correct.

### Antiquity to 700

- **200 *Magadha* and 300 *Gupta Empire*:** the polygon is one unified Ganges plain. At 200 the area was fragmented. At 300 the Guptas were still a small Magadhan house; the empire began c. 320.
- **300–400 *Suren Kingdom* (Sistan/Sindh):** Indo-Parthian rule had ended, and by 300 this was Sasanian Sakastan.
- **400 *Meroe*:** Meroë fell c. 350; this should be post-Meroitic Nubia.
- **600 *Ostrogoths* in Austria/Pannonia:** the Ostrogoths were gone by 553.
- **600–700 *Mataram* covers all of Java:** Mataram dates from 716/732; Tarumanagara and Kalingga came earlier.
- **700 *Western Gokturk Khaganate* (47–76°E, down to 34°N):** it fell in 657. By 700 the area was Türgesh, Sogdian city-states and the Tokharistan yabghus.
- **700 *Palas*:** the Pala dynasty began c. 750.
- **700 *Nan-Zhao* in northern Thailand and Shan (96–100°E, 18–24°N):** wrong place, and Nanzhao began in 738.
- **800–900 *Vallabhi*:** the Maitrakas fell c. 776.
- **800 *Avars*:** the polygon reaches 41°N, which is too large. (The 900 label is renamed above.)

### 900–1300

- **900 *Carolingian Empire* (Lotharingia, Burgundy, Italy):** the empire dissolved in 888 into several kingdoms.
- **900 England:** *Mercia*, *Essex*, *Northumbria* and a tiny *Wessex* are a pre-Danelaw layout.
- **1000 *Khazars* (38–48°E):** the khaganate was destroyed 965–969.
- **1100 Anatolia is all *Byzantine Empire*:** Rum, the Danishmendids and the Crusader states (1098–99) are missing.
- **1100 *Fatimid Caliphate*:** still includes Ifriqiya, although the Zirids and Hammadids were independent from 1048.
- **1100 *Ghaznavid Emirate*:** still includes Khorasan, which was Seljuk from 1040.
- **1100 *Alans*:** the label also sits on a Wallachia/Moldavia polygon, which was Cuman land. It cannot be split by name.
- **1100 *Prussians*:** the polygon spans Pomerania (10–23°E).
- **1100 *Pratiharas* (77–94°E):** the Pratiharas ended c. 1036, and Kannauj was Gahadavala by c. 1090. The polygon also reaches Assam.
- **1200 *Buwayhid Emirates* (Iran + Iraq):** the Buyids ended in 1062. In 1200 Iran was mostly Khwarazmian and Eldiguzid, and Iraq was Abbasid. This is a major anachronism, but the polygon fits no single polity.
- **1200 *Khwarazmian dynasty*:** drawn in Baluchistan instead of Khwarazm.
- **1200 *Kamarupa*:** drawn in Kachin/northern Burma.
- **1200 *Bhutan*:** Bhutan was unified only in 1616.
- **1200 *Norway*:** includes Iceland, which joined only in 1262.
- **1300 Burma:** all *Pagan*, although Pagan collapsed 1287–97.
- **1300:** there are no Ottomans or Anatolian beyliks.
- **1300–1400 *Srivijaya Empire*:** it persists, although Srivijaya was effectively gone by the 13th–14th century.

### 1400–1650

- **1400 *Sultanate of Delhi* (66–90°E, 11–34°N):** this is the Tughlaq peak of 1335. By 1400 Bahmani, Vijayanagara, Bengal, Jaunpur, Gujarat and Malwa were independent.
- **1400 *Seljuk Caliphate* (central Anatolia):** Rum ended c. 1308. In 1400 the area was Eretnid/Kadi Burhan al-Din land, then Ottoman.
- **1400 *Byzantine Empire*:** covers mainland Greece, but by 1400 Byzantium held only Constantinople and the Morea.
- **1400 *Bosnia*:** the polygon sits over Serbia (it reuses the Raška geometry), and the Serbian Despotate is missing.
- **1400 *Sicily*:** the label is also on mainland southern Italy, which was the Kingdom of Naples.
- **1400 *Sukhothai*:** the label is also on Lan Xang and on the peninsula.
- **1492:** there are no Naples, Milan or Florence in Italy.
- **1492–1500 *Golkonda*:** independent only from 1518.
- **1530 *Bukara Khanate*:** drawn over Fergana/Kashgar (69–84°E).
- **1600–1715 *Khiva Khanate*:** the polygon spans 50–107°E and up to 76°N, which is absurd, and Bukhara is missing.
- **1650 *Vijayanagara*:** the empire had ended in 1646.
- **1650 and 1700:** a tiny *Austrian Empire* fragment sits in Warmia.
- **1650–1800 *Dutch East Indies*:** covers all of Indonesia (95–141°E). The VOC held only Batavia, the Moluccas and a few ports; Mataram, Banten, Aceh and Gowa are missing.

### 1715–1900

- **1715 *Ethiopia*:** the label also sits on the Funj Sultanate (Sudan, 29–35°E). It cannot be split by name.
- **1783–1815 *Sotho*:** drawn in the Niger Delta (5–7°E, 4–7°N).
- **1783–1815 *Lozi*:** drawn in Kasai (20°E, 5°S).
- **1783–1815 *central Asian khanates*:** the label is also on the Caucasus khanates.
- **1783 *Zulu*:** the kingdom dates from 1816.
- **1800 *Bundelkhand*:** the polygon covers Bihar and Bengal.
- **1800 *United Kingdom* (formed 1801):** kept, because it is correct for 1801–14.
- **1815 *Maratha Confederacy*:** spans 67–87°E and up to 37°N, and the Sikh Empire is missing.
- **1815 *Dutch East Indies*:** the label sits on the South African interior, while Java (British-occupied 1811–16) is unlabelled.
- **1815 *Turan*:** a non-polity label for the Central Asian khanates.
- **1815 *Somalia*:** a modern name on a pre-colonial polygon.
- **1878 *French Indochina*:** the union formed only in 1887.
- **1878–1900 *Bokhara Khanate*:** drawn over the Turkmen oases (57–66°E).
- **1900 Africa is essentially the 1880 map.**
  - Still drawn as independent: Kanem-Bornu (Rabih), Mossi, Asante, Dahomey, Benin, Oyo/Ibadan, Borgu, Ovimbundu, Kuba, Lozi, Rwanda/Burundi, Buganda/Bunyoro and the Niger Delta states.
  - Missing: Kamerun, Togoland, German South-West Africa, Eritrea, the Somalilands, Nigeria and a separate Anglo-Egyptian Sudan.
  - Zanzibar still holds the mainland coast.
  - Only clearly extinct polities were renamed.
- **1900 *India*:** a fragment sits at 61–63°E, 26–30°N (Sistan).
- **1938 *Cambodia* and *Cochin China*:** SUBJECTO is Empire of Japan, but the Japanese occupation came only in 1940–41.

### 1945–2010

- **1960 *Vietnam*:** a single polygon, although the country was divided in 1954.
- **1960 *Yemen*:** includes the Aden Protectorate.
- **1960 *Eritrea*:** shown separately, although it was federated with Ethiopia 1952–62.
- ***Mascat/Muscat*:** used for Oman from 1 BC to 1400, an anachronistic city-state name. Left because there is no better generic label.

### Borderline labels, kept

| Snapshot | Label | Became correct |
| --- | --- | --- |
| 100 | Dacia | 106 |
| 1000 | Mali | — |
| 1000 | Great Zimbabwe | — |
| 1200 | Sultanate of Delhi | 1206 |
| 1492 | Funj | 1504 |
| 1492 | Aceh | c. 1496 |
| 1530 | Luba/Lunda | — |
| 1650 | Rozwi | — |
| 1815 | Kingdom of the Two Sicilies | 1816 |
| 1880 | French Indochina | 1887 |
| 1945 | Indonesia | proclaimed Aug 1945 |
| 1945 | Somalia | — |
| 1945, 1960 | Rwanda, Burundi | — |

## Overall quality by region

- **Europe:** good from 1492 on. Most errors were state-type misnomers and typos:
  - "Bulgar Khanate" for Christian and Byzantine Bulgaria
  - "Austrian Empire" before 1804
  - "United Kingdom" before 1801
  - "Sardinia-Piedmont" before 1720

  Early medieval Britain and Italy are coarse, and Anatolia in 1100–1400 is badly wrong.
- **Africa:** before 1500 the map is mostly generic (cultures and peoples), with some anachronistic kingdoms (Merina, Ifat, Shoa). 1600–1880 is reasonable. 1900 is the worst snapshot in the dataset: Africa is drawn as before the Scramble. In 1914–1960, post-independence names on colonies are now corrected.
- **West Asia:** the main failure is dynasties outliving their end by decades or centuries: the Sasanians in 700, the Fatimids and Buyids in 1200, and "Seljuk Caliphate" up to 1400. In 20th-century Arabia, the Saudi polygons carried wrong emir names.
- **Central Asia (west of 80°E):** the weakest geometry. From 1530 to 1878, the Khiva and Bukhara polygons are in the wrong place or hugely oversized, and generic labels ("central Asian khanates", "Turan") cover large areas.
- **South Asia:** many dynasty labels are copied forward past the dynasty's end: the Cholas to 1400, Vijayanagara to 1650, and Ahmadnagar, Bidar and Golconda after their annexation. Delhi in 1400 shows its 1335 extent, and 1945 already showed the partition.
- **Southeast Asia:** island Southeast Asia is coarse throughout. Mainland labels lagged badly (Pyu/Mon to 1200, Pagan in 1400, Kediri to 1400); all are now renamed.

## Follow-up

The unfixed geometry problems above need redrawn polygons, not label renames. Candidates for a future pass, in priority order:

1. Africa 1900
2. Delhi 1400
3. Anatolia 1100–1400
4. Khiva/Bukhara 1530–1878
5. The VOC polygon 1650–1800
