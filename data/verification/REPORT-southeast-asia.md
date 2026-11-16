# Verification report — Southeast Asia

Verifier: independent fact-checker agent (separate from the curator).
`node scripts/validate-data.mjs southeast-asia` gives 0 errors.

## 1. Auto-diff resolutions (8)

| Key | Verdict | Basis |
| --- | --- | --- |
| ev-kedukan-bukit-inscription:coord | keep-ours | Wikidata gives the Jakarta museum where the stone is kept; found at Palembang |
| ev-prambanan:year | keep-ours | Shivagrha inscription dated 856; 850 is when building began |
| ev-fall-of-ayutthaya:coord | keep-ours | The city itself |
| ev-philippine-revolution:coord | keep-ours | Pugad Lawin |
| ev-vietnam-war:year | keep-ours | Wikidata's own start is 1955 |
| ev-vietnam-war:coord | keep-ours | Huế (Wikidata's point is in Laos); note added |
| ev-cambodian-genocide:coord | keep-ours | Choeung Ek |
| polity-toungoo:from | **disputed** | Britannica 1486 (or 1531); Wikipedia 1510; Wikidata 1485 |

## 2. Fixes

| # | Record | Change | Source |
| --- | --- | --- | --- |
| S1 | place-manila | Capital spans split at 1948 and 1976 (Quezon City); summary corrected | RA 333 / PD 940 (PTV/PNA) |
| S2 | ev-kedukan-bukit-inscription | thousands / 数万 → some 20,000 / 两万 | ANU Press, *Śrīwijaya*; Coedès |
| S3 | ev-vietnam-war | Peak ~543,000 in 1969 (not 1968); note added | Miller Center; Vietnam War 50th Commemoration |
| S4 | place-bangkok | zh 军贴 → 恭贴 | Chinese-language press usage |
| S5 | place-malacca | 1957 label → Federation of Malaya; Malaysia from 1963 | standard chronology |
| S6 | polity-toungoo | Nanda Bayin zh → 莽应里（南达勃因）; note rewritten | Wikidata Q3182715; Britannica |
| S7 | Borobudur, Prambanan, Angkor Wat, Bayon, Malacca founding, Spanish Manila | Made-up Britannica source titles → real article titles | URLs already present |
| S8 | ev-tet-offensive | Note added for the generic point | — |

## 3. Spot-checks (✓ unless stated)

- Angkor Wat 1113–1150; Prambanan 856; Toungoo (disputed)
- Ngọc Hồi–Đống Đa 1789 (Tết, 30 Jan; Wikidata's 1788 is the lunar year)
- Mactan: Q2091449 is the right item, but its English label is vandalised ("Battle of Six Seven") and should be reverted on Wikidata; date and route ✓
- Kedukan Bukit (S2); Vietnam War (S3); Ayutthaya 1767; Bangkok 1782; Điện Biên Phủ (56 days)
- Cambodian genocide wording; Fall of Saigon (zh gives both names, balanced)
- Java 1293; Mongol invasions of Vietnam; Malacca 1511, Batavia 1619, Manila 1571; Indonesian independence
- Place spans: Manila (S1), Hanoi, Ho Chi Minh City, Jakarta, Yangon, Angkor, Bangkok (S4), Malacca (S5)
- People's stops: Bayinnaung, Lê Lợi, Rizal, Hồ Chí Minh, Jayavarman VII, Gajah Mada
- Rulers: Later Lê, Nguyễn, Khmer, Ayutthaya
- All 131 Southeast Asia QIDs denote the intended item. Proxies: Q772211 is Intramuros, Q2132910 is Rattanakosin Island.

## Open notes

- The Tet Offensive point (11, 107) is still generic.

## 2026-11 expansion

Added 66 events, 33 people (all with stops), 12 places (all with name/capital spans), 33 polities (rulers where known) and appended rulers to 9 existing polities (Srivijaya, Sukhothai, Later Lê, Lý, Trần, Champa, Malacca, Majapahit, Mataram). Stories: every importance-4/5 record in the dataset now has one (57 in all: 26 on existing records, 31 on new ones).

### Checks run

- **QIDs:** every new QID looked up on Wikidata (label, description, dates) before use.
- **Wikipedia links:** all 219 Wikipedia URLs in the dataset resolved through the REST summary endpoint; one 404 fixed (see C1).
- **Other URLs:** non-Wikipedia URLs kept only where the page was confirmed (UNESCO list pages, Britannica, history.state.gov, IMF, ICJ, UN peacekeeping, NHCP, DC-Cam); guessed deep links removed (C2).
- **Auto-diff:** all 26 open diffs resolved in `resolutions/southeast-asia.json` (23 keep-ours, 3 disputed). Most are Wikidata country/regional centroids versus the specific site of the event.
- **Spot-checks:** 27 new records checked against a second, non-dataset source (web search of Wikipedia plus Britannica, UNESCO, journals, government or press reports): 19% of 144 new records directly, plus 22 further records re-examined while resolving diffs, about 34% in all.

### Corrections

| # | Record | Change | Source |
| --- | --- | --- | --- |
| C1 | ev-le-thanh-tong-conquers-vijaya | QID Q10841882 → Q3391315; Wikipedia link → "Champa–Đại Việt War (1471)" | Wikidata; Wikipedia |
| C2 | several 20th-c. events | Removed unverifiable deep links (NLB, state.gov, AWM, UNHCR, NASA, NHM) | — |
| C3 | polity-pyu | Note: urn years 688/695/718 and the kings' order disputed since the 1993 urn find | Wikipedia: Sri Ksetra Kingdom; UNESCO 1444 |
| C4 | ev-cyclone-nargis | "killing about 138,000" → "about 138,000 dead or missing"; note on junta counts | HRW 2008; Tripartite Core Group |
| C5 | ev-batavia-massacre-1740 | Note: estimates 5,000 to 10,000+ | Wikipedia; *Wacana* 2004 |
| C6 | ev-battle-of-nong-sarai | Note: Burmese account (Mingyi Swa shot); Terwiel 2013 doubts a formal duel | *JSS* 101 (2013) |
| C7 | person-fa-ngum | Note: death 1374 (Britannica) vs 1393 (Lao tradition) | Britannica; Universalis |
| C8 | person-iskandar-muda | Confidence high → medium; birth c. 1583 vs 1590 | Wikipedia; Britannica |

### Spot-checks (✓ unless stated)

- Banda massacre 1621 (c. 2,800 killed, 1,700 enslaved; orang kaya executed by Japanese mercenaries)
- Jayavarman II c. 770–850 (Britannica); 802 Kulen consecration (low, note on 834/835 death date)
- Ananda Temple completed 1105; Kyansittha b. 1030, reign 1084–1112/13
- Pyu urns (C3); Pyu embassy 802 and Nanzhao raid 832 not found online, kept low from Xin Tangshu/Manshu
- Cut Nyak Dhien b. 1848 (WD 1850, disputed), captured 1905, d. Sumedang 1908
- Lý Thường Kiệt's 1075–76 siege of Yongzhou (42 days); Như Nguyệt 1077
- Timor-Leste joined ASEAN 26 Oct 2025; East Timor referendum 78.5%, INTERFET 20 Sep 1999
- Nong Sarai (C6); Dutch capture of Malacca 3 Aug 1640–14 Jan 1641 with Johor; Batavia 1740 (C5)
- Bowring Treaty 3% duty, extraterritoriality; Third Anglo-Burmese War Nov 1885, Thibaw to Ratnagiri
- Burma Railway 415 km, c. 12,000 POWs and c. 90,000 Asian labourers dead (labourer toll an estimate)
- Bataan Death March 60,000–80,000 prisoners, c. 100 km; Typhoon Haiyan, Cyclone Nargis (C4)
- Founding of Chiang Mai 1296 after Wiang Kum Kam floods; Zhou Daguan at Angkor Aug 1296–Jul 1297
- Truyện Kiều 3,254 lines of lục bát; Battle of Bubat 1357 (Pararaton, Kidung Sunda)
- Alaungpaya b. 1714 Moksobo, Rangoon 1755 (death 11 May or 13 Apr 1760 by source); Sultan Agung 1593–1645, sieges 1628/1629, calendar 1633; Fa Ngum (C7); Iskandar Muda (C8)

### Open notes

- Still missing: Sulu and Gowa sultanates, the Kingdom of Luang Prabang (1707–1947), the Philippine Commonwealth (1935–46) and Ternate's expulsion of the Portuguese (1575).
- Pyu chronology (urn dates, end date) and the Thaton conquest remain low confidence.
- Several Wikidata items use country centroids for events (see resolutions); worth fixing upstream.
- Web search quota ran out before Taksin, the Mạc end date (1677) and Hayam Wuruk were checked a second time; their records rest on Wikidata plus standard histories.

## 2026-11 review

Reviewer: independent fact-checker (second pass, separate from the curator and the first verifier).
`validate-data southeast-asia`: 0 errors (warnings: cross-dataset ids that live in other datasets,
and one new event without a Wikidata item). `build-data`: 0 open diffs.

### What was sampled

- **All 144 new records read field by field** (dates, reigns, stops, place-name spans, coordinates,
  summaries, zh). Their QIDs were compared with the Wikidata label, description and dates (cache), and
  every zh name with the 中文维基 title Wikidata links to.
- **Records not covered by the first report** checked in detail against standard references
  (Britannica, Wikipedia, 中文维基, standard histories): about 115 of 144 (80%), including all
  importance-4 records. Live web look-ups for the ones in doubt: Taksin, Thonburi, the Mạc end date,
  Hayam Wuruk, Cut Nyak Dhien, the Malayan Emergency, Diponegoro, the Bandung Conference, the
  Indochinese Union, Ram Khamhaeng, plus the five additions below.
- **Stories:** all 57 read in full in English (26 on new records, 31 on existing ones); the zh text of
  the 26 new-record stories read as well.
- **Coordinates:** every event checked against its site; coarse or generic points listed and reviewed.
- **Cross-dataset links:** `person-yijing`, `person-zheng-he` (china), `person-ibn-battuta` (africa)
  and `person-kublai-khan` (central-asia) all exist on `feat/world-regions` and on the pushed
  `data/china`, `data/africa` and `data/central-asia` branches. No QID or subject duplicates another
  dataset (checked against feat/world-regions and every pushed data branch).

### Taksin, the Mạc end date, Hayam Wuruk (left open by the first pass)

- **Taksin:** born 17 April 1734, died 7 April 1782 (Wikidata, 中文维基); took Chanthaburi June 1767,
  beat the Burmese at Pho Sam Ton in November, crowned at Thonburi on **28 December 1767**. The stop
  "Crowned at Thonburi" said 1768 → **1767** (R1).
- **Mạc dynasty:** 1677 holds. Trịnh forces took Cao Bằng in 1667, the Qing had it returned to Mạc
  Kính Vũ in 1669, and the Trịnh took it for good in August 1677 (Wikipedia: Lê–Mạc War; Battle of Cao
  Bằng 1677; Trịnh Tạc). Note rewritten; summary "fought him for sixty years" → "fought the Mạc" (Mạc
  Đăng Dung died in 1541) (R2).
- **Hayam Wuruk:** b. 1334, king 1350 as Rajasanagara, d. 1389 (Britannica: Hayam Wuruk; The
  Majapahit era); Gajah Mada d. 1364; Nagarakretagama 1365, royal progress of 1359. Facts ✓; zh name
  aligned with 中文维基 (R3).

### Disputed verdicts

- `person-cut-nyak-dhien:born` (1848 vs 1850): genuinely disputed; Indonesian sources (and 中文维基)
  give 1848, Wikidata and some references 1850. Record is medium with a note. Capture 1905 and death at
  Sumedang on 6 November 1908 confirmed.
- `polity-pyu:to` (840 vs 1050): genuinely disputed (Nanzhao raids of 832/835 vs Pyu towns lasting into
  the Pagan era). The record's note only discussed the urn dates; a sentence on the end date was added.
- `polity-chenla:to` is **keep-ours**, not disputed: 706 (the Land/Water split) versus 802 is a matter
  of periodisation, explained in the note. Left as is.
- `polity-toungoo:from` (older verdict) still holds.

### Corrections

| # | Record | Old → new | Reason / source |
| --- | --- | --- | --- |
| R1 | person-taksin | coronation stop 1768 → 1767; zh 郑信（达信大帝）→ 郑信（郑昭）; Pho Sam Ton zh 三菩提树营 → 朴讪东 | 中文维基 鄭昭; Wikipedia: Thonburi Kingdom |
| R2 | polity-mac | "fought him" → "fought the Mạc"; note on 1667/1669/1677 | Wikipedia: Lê–Mạc War, Battle of Cao Bằng (1677) |
| R3 | Hayam Wuruk (5 records) | 哈奄·武禄 → 哈亚·乌鲁克 | 中文维基 哈亞·烏魯克 |
| R4 | Iskandar Muda; Coen; Cut Nyak Dhien; Kahuripan; Dvaravati | zh 伊斯坎达·慕达 → 伊斯干达·穆达; 燕·彼得逊·昆 / 昆 → 扬·彼得生·库恩 / 库恩 (all records); 朱·娘·典 → 朱月婷（朱亚典）; 卡胡里潘 → 固里班（卡胡里潘）; 堕罗钵底 → 陀罗钵地（堕罗钵底） | 中文维基 titles |
| R5 | ev-malayan-emergency | zh 双溪大年 (Sungai Petani, Kedah) → 和丰 (Sungai Siput, Perak) | 中文维基 和丰 |
| R6 | person-ram-khamhaeng | zh label "难府昆三春" (Nan) → 达城（孟乔）城主坤三春; Mueang Chot is near Tak, not Nan | 中文维基 兰甘亨 |
| R7 | ev-bandung-conference (story) | Nkrumah listed as attending → Kojo Botsio for the Gold Coast | Final communiqué; Nkrumah did not attend |
| R8 | ev-french-indochina-formed, polity-french-indochina (summary, story) | Laos "added in 1893" → protectorate 1893, formally added 1899 | Wikipedia: French Indochina; WorldStatesmen |
| R9 | person-diponegoro | Makassar stop 1834 → 1833 | Carey (via Kompas); GNFI |
| R10 | place-george-town | 1957–present "Malaysia" → 1957–1963 Federation of Malaya, 1963– Malaysia; zh 1946 span 马来亚联邦，后为马来亚联合邦 | same fix as S5 for Malacca |
| R11 | ev-burmese-independence | "within weeks communist and Karen insurgencies" → communists within three months (March 1948), Karen within a year (Jan 1949) | Thant Myint-U; Smith |
| R12 | ev-philippine-american-war | route out of order (Balangiga Sept 1901 before Palanan March 1901) → reordered; Spanish-Philippines polity tag (wrong after 1898) removed | Linn |
| R13 | ev-bataan-death-march, ev-philippine-independence-1946 | Spanish-Philippines stand-in → new `polity-philippine-commonwealth` | — |
| R14 | ev-tet-offensive | generic point (11, 107) → US embassy, Saigon (10.7826, 106.7005); note | closes the open note |
| R15 | ev-vietnamese-boat-people | "The UN estimates 200,000–400,000 died" → deaths unknown, estimates as high as 200,000–400,000; "expelled" → "pressed … to leave" | estimates vary widely (UNHCR 2000; Robinson 1998) |
| R16 | ev-vietnam-war (story) | "Some three million Vietnamese … died" → estimates from about one million to more than three million | Hirschman et al. 1995; Vietnamese government 1995 |
| R17 | ev-cambodian-genocide (story) | 1.5–2 million stated flatly → "by most estimates" | Kiernan; DC-Cam |
| R18 | ev-indonesian-mass-killings | "murky" → "still-debated"; story "knew and helped" → attributed to declassified records studied by Robinson | Robinson 2018 |
| R19 | ev-8888-uprising | toll attached to the September crackdown → coup of 18 September; "perhaps 3,000 killed in all" | Lintner |
| R20 | ev-doi-moi | "second-largest rice exporter within a few years" → "one of the largest" | third by 1989, second only later |
| R21 | person-vo-nguyen-giap | "directed North Vietnam's war" → defence minister, with Lê Duẩn increasingly setting strategy; 1968 stop "oversees Tet" → "defence minister during Tet" | Lien-Hang Nguyen, Hanoi's War (2012) |
| R22 | person-lee-kuan-yew | Cambridge stop 1946 → 1947 (LSE first, Cambridge from 1947) | Lee, The Singapore Story |
| R23 | person-gia-long | "sole survivor of the Nguyễn lords' family" → only Nguyễn prince to escape 1777 | Taylor |
| R24 | ev-yijing-in-srivijaya (story) | Kedukan Bukit (683, a military record) cited for Buddhist learning → Talang Tuwo (684, Buddhist park) | Cœdès |
| R25 | person-aung-san (story) | "He and thirty young Burmese" → "twenty-nine other" (he was one of the thirty) | — |
| R26 | small wording | Trịnh–Nguyễn walls "built with" → "armed with" Portuguese-made cannon; Java Man "first early human fossil outside Europe" → first fossil of the species; Hồ dynasty "Vietnamese-script examinations" → promotion of Nôm; Lan Xang zh 万象之国 → 百万大象之国; Straits Settlements "run by the East India Company until 1867" → governed from British India; Ayutthaya founding "ruler of a Tai-Chinese trading family" → "possibly of a Chinese merchant family"; Tây Sơn route 1802 label (Phú Xuân fell in 1801); Naresuan's weapon; Champa story 160,000 → 180,000 Cham (2019 census) | Britannica; Wikipedia; census |

### Added (5, each with ≥2 sources)

- `polity-sulu` (Q422065), Sultanate of Sulu 1405–1915: Majul 1973; Warren 1981.
- `polity-gowa` (Q1408641), Sultanate of Gowa 1320–1911: Reid 1983; Andaya 1981; Cummings 2002.
  Tagged on `ev-makassar-war`.
- `polity-kingdom-of-luang-prabang` (Q338248), 1707–1947: Stuart-Fox 1997, 2008. New diff
  `:to` (Wikidata 1893) resolved keep-ours.
- `polity-philippine-commonwealth` (Q146328), 1935–1946: Agoncillo; Brands 1992.
- `ev-ternate-expels-portuguese` (1575, no Wikidata item; point at Benteng Kastela): Andaya 1993;
  Ricklefs.

### Left for a human

- The Mactan item's vandalised English label on Wikidata (from the first pass) and several centroid
  coordinates are worth fixing upstream.
- 雍籍牙 (Alaungpaya) is kept for consistency with the existing Konbaung ruler list; 中文维基 uses 雍笈牙.
- Taksin's and Thonburi's Britannica sources still have no URL (Britannica blocks automated fetches).

## 2026-11 audit (web-sourced)

Independent audit using only pages retrieved during the audit (WebFetch/WebSearch); nothing checked from memory.

- **Seed:** 20261114 (mulberry32 shuffle of the 188 records added or changed against `origin/feat/world-regions`, sorted by id; first 6 records with new stories taken, then filled in shuffle order).
- **Sample (20, 7 with stories):**

| Record | Source(s) retrieved | Result |
|---|---|---|
| person-diponegoro (story) | en.wikipedia Diponegoro | OK (Makassar move July 1833 confirmed) |
| ev-fall-of-saigon (story) | en.wikipedia Fall of Saigon; web search on the Ho Chi Minh Campaign order of battle | **Fixed**: "eighteen divisions" closing on Saigon; sources give 15 infantry divisions (en + zh) |
| ev-philippine-revolution (story) | en.wikipedia Philippine Revolution | OK; **zh fixed**: summary spelled Aguinaldo 阿吉纳尔多 while the story and person record use 阿奎纳多 |
| person-naresuan (story) | en.wikipedia Naresuan | OK (story already flags that Burmese chronicles differ on the duel) |
| ev-zhou-daguan-at-angkor (story) | en.wikipedia Zhou Daguan | OK (left Mingzhou, put to sea at Wenzhou; Aug 1296–Jul 1297; French 1819) |
| ev-yijing-in-srivijaya (story) | en.wikipedia Yijing; zh.wikipedia 义净 | OK |
| ev-palapa-oath | web search: en.wikipedia Palapa oath, UINSA Suluk journal article, detik.com (1336 / 1258 Saka; Pararaton only) | OK (satellite year not checked) |
| person-jayavarman-ii | en.wikipedia Jayavarman II | OK |
| place-vientiane | en.wikipedia Vientiane | OK; note now says sources date the capital move to 1560 or 1563 |
| ev-asian-financial-crisis | web search (baht float 2 Jul 1997; rupiah ~2,600 → ~15,000; Suharto 21 May 1998) | OK |
| person-nguyen-du | en.wikipedia Nguyễn Du | OK |
| ev-canggal-inscription | en.wikipedia Canggal inscription | OK (exact day not in source) |
| polity-hanthawaddy | en.wikipedia Hanthawaddy kingdom | OK |
| polity-gowa | en.wikipedia Sultanate of Gowa | OK |
| ev-trinh-nguyen-war | en.wikipedia Trịnh–Nguyễn War; Vietnamese textbook summary (loigiaihay) | OK (en gives the truce as 1673, Vietnamese sources 1672; kept 1672) |
| polity-french-indochina (story) | en.wikipedia Phan Bội Châu | **Fixed**: story said Phan Bội Châu "came out of" the colonial schools; he was a classically trained laureate of the 1900 regional exams (en + zh) |
| place-ayutthaya | en.wikipedia Ayutthaya (city) | OK; open point: the pre-1351 'Ayothaya' entry starts at 1100, while the source cites evidence of settlement from the late 13th century (the record's note already calls the date approximate) |
| ev-my-son-sanctuary | en.wikipedia Mỹ Sơn archaeological site | OK (Bhadravarman I, over 70 temples, bombing Aug 1969) |
| person-alaungpaya | en.wikipedia Alaungpaya | OK |
| person-ram-khamhaeng | en.wikipedia Ram Khamhaeng | OK (birth year approximate, as the note says) |

**Error rate:** 3 of 20 records (15%) needed a fix: 2 factual (division count, Phan Bội Châu's schooling) and 1 zh rendering inconsistency. Not systematic.

## 2026-11 story verification (web-sourced)

Every story not already checked against a retrieved page (the 7 in the "2026-11 audit": Diponegoro, Fall of Saigon, Philippine Revolution, Naresuan, Zhou Daguan, Yijing, French Indochina) was checked claim by claim against pages retrieved for this pass (WebFetch/WebSearch: en.wikipedia plus a second source such as zh/vi/id/nl.wikipedia, Britannica snippets, UNESCO, asean.org, the German Angkor Imagery Project, museum or university pages). zh names were checked against zh.wikipedia titles via the Wikipedia/Wikidata APIs.

- **Stories checked:** 50 of 57.
- **Result:** 24 stories (48%) had a factual error, an overstated claim or unflagged legend; 5 more (10%) needed only zh fixes (names, consistency). 21 were correct as written.
- validate-data: 0 errors; build-data: 0 open diffs.

### Stories and sources

| Story | Sources retrieved | Result |
| --- | --- | --- |
| ev-trung-sisters-rebellion | Trưng sisters (en.wikipedia.org); Web search: Battle of Lãng Bạc 42 AD Ma Yuan (Trưng sisters' rebellion, en.wikipedia snippets) (en.wikipedia.org) | **fixed** |
| ev-borobudur | Borobudur (en.wikipedia.org) | OK |
| ev-battle-of-bach-dang-938 | Battle of Bạch Đằng (938) (en.wikipedia.org); Web search: Battle of Bạch Đằng 981 Lê Hoàn stakes (Bạch Đằng River, en.wikipedia; 'Understanding the Bach Dang Battlefield from recent research results') (en.wikipedia.org) | OK |
| ev-angkor-wat | Angkor Wat (en.wikipedia.org); Angkor Wat (German Angkor Imagery Project) (khmer-heritage.de); Angkor Wat – The Bas-Relief Galleries (helloangkor.com) | **fixed** |
| ev-mongol-invasions-of-vietnam | Mongol invasions of Vietnam (en.wikipedia.org); Hội nghị Diên Hồng (vi.wikipedia.org) | **fixed** |
| ev-battle-of-bach-dang-1288 | Battle of Bạch Đằng (1288) (en.wikipedia.org); Archeological dig unearths evidence relevant to iconic Vietnamese battle (Tuoi Tre News, 2019) (news.tuoitre.vn) | **fixed** |
| ev-founding-of-malacca | Parameswara (king) (en.wikipedia.org); Web search: Strait of Malacca narrowest point (Phillips Channel, ~2.8 km) (clarksons.com) | **fixed** |
| ev-capture-of-malacca | Capture of Malacca (1511) (en.wikipedia.org) | OK |
| ev-battle-of-mactan | Battle of Mactan (en.wikipedia.org); Massacre in Cebu (Inquirer Opinion) (opinion.inquirer.net) | **fixed** |
| ev-spanish-manila | History of Manila (en.wikipedia.org); Intramuros (en.wikipedia.org) | OK |
| ev-founding-of-batavia | Batavia, Dutch East Indies (en.wikipedia.org); en.wikipedia langlinks API (zh titles: 揚·彼得生·庫恩, 馬爾迪吉基爾人) (en.wikipedia.org) | **fixed** |
| ev-fall-of-ayutthaya | Burmese–Siamese War (1765–1767) (en.wikipedia.org); Web search: Ekkathat tributary offer refused (Fall of Ayutthaya / Ekkathat, en.wikipedia snippets) (wikipedia.org) | OK |
| ev-tambora-eruption | 1815 eruption of Mount Tambora (en.wikipedia.org); Web search: Tambora death estimates, Raffles, kingdoms Tambora and Pekat (wikiwand mirror) (wikiwand.com); Culture destroyed by 1815 volcano rediscovered (NPR, 2006) (npr.org); Scientist Discovers Lost Kingdom Of Tambora (TerraDaily) (terradaily.com) | **fixed** |
| ev-krakatoa-eruption | 1883 eruption of Krakatoa (en.wikipedia.org); Web search: Berouw / 165 villages destroyed, 132 damaged (archived en.wikipedia Krakatoa, UCSB volcanology) (webarchive.library.unt.edu); Web search: Anak Krakatau emergence 1927 (Britannica snippet, NASA) (britannica.com) | **fixed** |
| ev-indonesian-independence | Proclamation of Indonesian Independence (en.wikipedia.org); Rengasdengklok Incident (en.wikipedia.org) | OK |
| ev-vietnam-declaration-of-independence | Proclamation of Independence of the DRV (en.wikipedia.org); August 30, 1945: King Bao Dai abdicates (Nhan Dan) (en.nhandan.vn); On this day, September 2, 1945 (P-38s over Ba Dinh) (advance.hr) | OK |
| ev-battle-of-dien-bien-phu | Battle of Dien Bien Phu (en.wikipedia.org) | OK |
| ev-vietnam-war | Vietnam War (en.wikipedia.org); U.S. Marines Arrive at Da Nang (Vietnam War 50th Commemoration) (vietnamwar50th.com) | OK |
| ev-asean-founded | ASEAN Declaration (en.wikipedia.org); The Founding of ASEAN (asean.org) (asean.org) | **fixed** |
| ev-tet-offensive | Tet Offensive (en.wikipedia.org); Massacre at Huế (en.wikipedia.org); Web search: US embassy attack, Cronkite 27 Feb 1968 (history.com, National Archives) (history.com) | OK |
| ev-cambodian-genocide | Khmer Rouge rule of Cambodia (en.wikipedia.org); Tuol Sleng Genocide Museum (en.wikipedia.org); Last Khmer Rouge leaders guilty of genocide (AP via WJLA) (wjla.com); 康克由 (zh.wikipedia.org); 琼邑克 (zh.wikipedia.org) | **fixed** |
| ev-indian-ocean-tsunami-2004 | 2004 Indian Ocean earthquake and tsunami (en.wikipedia.org); Web search: Aceh Helsinki MoU 15 Aug 2005 and Indonesian toll (Jakarta Post, climate-diplomacy.org) (climate-diplomacy.org) | OK |
| ev-manila-galleon | Manila galleon (en.wikipedia.org); Andrés de Urdaneta (en.wikipedia.org); Web search: Manila galleon San José lost July 1694 off the Philippines (Guam Recorder, Legion Magazine) (issuu.com) | **fixed** |
| ev-samudera-pasai-islam | Samudera Pasai Sultanate (en.wikipedia.org); Hikayat Raja-raja Pasai / Malikussaleh (en.wikipedia.org); Through the Strait of Malacca to China: 1345–1346 (UC Berkeley ORIAS) (orias.berkeley.edu); The Explorer Marco Polo (Aramco World) (archive.aramcoworld.com); 苏木都剌国 (zh.wikipedia.org) | zh fixed |
| ev-jayavarman-ii-phnom-kulen | Sdok Kak Thom (en.wikipedia.org); Jayavarman II (en.wikipedia.org); Mahendraparvata lidar (Antiquity 2019; Live Science 2013) (livescience.com) | **fixed** |
| ev-anawrahta-conquers-thaton | Anawrahta (en.wikipedia.org); Manuha (en.wikipedia.org); King Anawrahta (factsanddetails) (factsanddetails.com) | OK |
| ev-battle-of-nhu-nguyet | Battle of Như Nguyệt River (1077) (en.wikipedia.org); WebSearch: Lý–Song War (Qinzhou, Lianzhou, 42-day Yongzhou siege, Guo Kui keeps five districts) (ipfs.ssi.eecc.de) | OK |
| ev-ram-khamhaeng-inscription | Ram Khamhaeng Inscription (en.wikipedia.org) | OK |
| ev-le-thanh-tong-conquers-vijaya | Cham–Vietnamese War (1471) (en.wikipedia.org); Lê Thánh Tông (vi) (vi.wikipedia.org); jst-ud.vn article on the 1470-71 campaign (Trà Toàn died on the way to Thăng Long) (jst-ud.vn) | OK |
| ev-banda-massacre | Dutch conquest of the Banda Islands (en.wikipedia.org); Banda Islands (en.wikipedia.org); Jan Pieterszoon Coen (nl) (nl.wikipedia.org); Jan Pieterszoon Coen (en) (en.wikipedia.org) | **fixed** |
| ev-siege-of-batavia | Siege of Batavia (en.wikipedia.org); Sultan Agung dari Mataram (id) (id.wikipedia.org); Jan Pieterszoon Coen (nl) (nl.wikipedia.org); WebSearch: Sultan Agung / Blambangan (Britannica snippet, fr wiki) (en.wikipedia.org) | **fixed** |
| ev-batavia-massacre-1740 | 1740 Batavia massacre (en.wikipedia.org) | **fixed** |
| ev-founding-of-singapore-1819 | Founding of modern Singapore (en.wikipedia.org) | OK |
| ev-aceh-war | Aceh War (en.wikipedia.org); Cut Nyak Dhien (en.wikipedia.org); 亚齐战争 (zh) (zh.wikipedia.org) | OK |
| ev-philippine-american-war | Philippine–American War (en.wikipedia.org); WebSearch: first-shot marker moved from San Juan Bridge to Sociego St, Santa Mesa (2003) (en.wikipedia.org); WebSearch: Britannica snippet on Funston's ruse (britannica.com) | **fixed** |
| ev-fall-of-singapore | NLB Infopedia / Roots.gov.sg Former Ford Factory (WebSearch) (roots.gov.sg); WebSearch: chronology of Japanese invasion of Singapore (bukitbrown.com) | OK |
| ev-first-indochina-war | First Indochina War (en.wikipedia.org); Battle of Route Coloniale 4 (en.wikipedia.org); Parallel Narratives: French defeats along RC 4 (Bernard Fall quote) (parallelnarratives.com) | **fixed** |
| ev-burmese-independence | Burma Independence Act 1947 (en.wikipedia.org); CVCE: Anglo-Burmese Treaty, 17 Oct 1947 (cvce.eu); Papers Past: 'Britain Hands Over In Burma' (1948) (paperspast.natlib.govt.nz) | **fixed** |
| ev-bandung-conference | Bandung Conference (en.wikipedia.org); Sukarno opening address (Fordham Modern History Sourcebook / CVCE, via WebSearch) (sourcebooks.web.fordham.edu) | OK |
| ev-indonesian-mass-killings | Indonesian mass killings of 1965–66 (en.wikipedia.org); Operation Merapi / Sarwo Edhie Wibowo (search results) (en.wikipedia.org); Sciences Po Mass Violence: The Indonesian Killings of 1965-1966 (sciencespo.fr) | OK |
| person-andres-bonifacio | Andrés Bonifacio (en.wikipedia.org); ABS-CBN ANCX: Andres Bonifacio lost everything but died for something (news2.abs-cbn.com) | **fixed** |
| person-aung-san | Aung San (en.wikipedia.org); Burma National Army (Wikiwand) (wikiwand.com); New Mandala: Burma in limbo part 1 (newmandala.org) | **fixed** |
| polity-champa | Champa (en.wikipedia.org); 占婆 (zh.wikipedia.org); Nhan Dan: Cham ethnic minority group (2019 census 178,948) (special.nhandan.vn) | zh fixed |
| polity-srivijaya | Srivijaya (en.wikipedia.org); Zabag (ancient territory) (en.wikipedia.org); Univ. Hamburg, Materials for the Medieval History of Indonesia: Abu Zaid (spaetmittelalter.uni-hamburg.de); Wikipedia langlinks API (Nagapattinam, Rajendra I zh titles) (en.wikipedia.org) | **fixed** |
| polity-khmer | EurekAlert: Archaeologists pinpoint population for Greater Angkor (Klassen et al. 2021) (eurekalert.org); Archaeology magazine: Cambodia Angkor population (archaeology.org) | OK |
| polity-majapahit | Majapahit (en.wikipedia.org); 满者伯夷 (zh.wikipedia.org); Flag of Indonesia (en.wikipedia.org); Wikipedia langlinks API (Raden Wijaya, Tribhuwana zh titles) (en.wikipedia.org) | zh fixed |
| polity-ayutthaya | Ayutthaya Kingdom (en.wikipedia.org); Yamada Nagamasa (en.wikipedia.org); Search: Ayutthaya distance (Rough Guides / Wikivoyage: 64–85 km north of Bangkok) (roughguides.com) | **fixed** |
| polity-pyu | Pyu city-states (en.wikipedia.org) | **fixed** |
| polity-singhasari | Ken Arok (en.wikipedia.org); Kertanegara of Singhasari (en.wikipedia.org); Pamalayu expedition (en.wikipedia.org); Mojok: Mencurigai kutukan keris Mpu Gandring (Pararaton text 'olih ratu pipitu') (mojok.co) | zh fixed |
| polity-lan-xang | Fa Ngum (en.wikipedia.org); Lan Xang (en.wikipedia.org); Wikipedia langlinks API (Setthathirath, Sourigna Vongsa zh titles) (en.wikipedia.org) | zh fixed |

### Corrections (en text; each has a matching zh fix unless the row is zh)

| Story | Lang | Old → new | Reason / source |
| --- | --- | --- | --- |
| ev-trung-sisters-rebellion | en | The sisters' forces were defeated at Lãng Bạc in 43. → The sisters' forces were defeated at Lãng Bạc in the spring of 42, and the last resistance was crushed in 43. | Both the Hou Hanshu (Jianwu 18) and the Complete Annals place the Lãng Bạc battle in spring 42; the sisters died in 43 (en.wikipedia Trưng sisters). |
| ev-trung-sisters-rebellion | en | honoured with temples, a national holiday and streets in every city → honoured with temples, an annual commemoration and streets in most cities | en.wikipedia: the February commemoration 'is observed by many Vietnamese' but is not an official public holiday; 'every city' is overstated. |
| ev-angkor-wat | en | some 800 metres of bas-reliefs → some 600 metres of bas-reliefs | The outer-gallery relief panels total about 600 m (German Angkor Imagery Project; 'nearly 600 metres'); 800 m appears only in a travel site. |
| ev-angkor-wat | en | Henri Mouhot's account of 1860 made it famous in Europe → Henri Mouhot's account of his 1860 visit, published after his death, made it famous in Europe | Mouhot visited in 1860; his account was published posthumously in 1863–64 (en.wikipedia Angkor Wat). |
| ev-mongol-invasions-of-vietnam | en | summoned village elders to the Diên Hồng conference → summoned elders from across the country to the Diên Hồng conference | Đại Việt sử ký toàn thư: 'triệu phụ lão trong nước' (elders of the whole country), not specifically village elders (vi.wikipedia). zh already reads 召集各地父老, so no zh change needed. |
| ev-battle-of-bach-dang-1288 | en | in the fields that now cover the old riverbed near Quảng Ninh → in the fields that now cover the old riverbed in Quảng Ninh and Hải Phòng | Quảng Ninh is a province, not a place 'near' the site; the 2019 stake find was at Cao Quỳ, Thủy Nguyên, Hải Phòng (Tuoi Tre); the river runs through Quảng Yên (Quảng Ninh) and Thủy Nguyên (Hải Phòng). |
| ev-battle-of-bach-dang-1288 | en | the battle remains the most celebrated in Vietnamese history → the battle remains one of the most celebrated in Vietnamese history | Unsupported superlative. |
| ev-founding-of-malacca | en | According to the Malay Annals, Parameswara was a prince of Palembang → According to the Portuguese writer Tomé Pires, Parameswara was a prince of Palembang | The revolt against Javanese/Majapahit rule and flight to Temasek under the name Parameswara come from Pires's Suma Oriental (and Barros); the Malay Annals call the founder Iskandar Shah and tell it differently (en.wikipedia Parameswara). |
| ev-founding-of-malacca | en | Resting by a river, he saw → The Malay Annals add that, resting by a river, the founder saw | The mouse-deer founding legend is from the Malay Annals; keep it attributed after the source change above. |
| ev-founding-of-malacca | en | at the narrowest part of the strait → on a narrow stretch of the strait | The strait's narrowest point is the Phillips Channel near Singapore (~2.8 km), not at Malacca. |
| ev-battle-of-mactan | en | accepted baptism with hundreds of his people and received an image of the Christ Child → accepted baptism with hundreds of his people, and his queen received an image of the Christ Child | Magellan gave the Santo Niño to Humabon's queen (baptised Juana), not to Humabon (en.wikipedia Battle of Mactan). |
| ev-founding-of-batavia | en | earning it the name "graveyard of the Dutch" → earning it the name "graveyard of Europeans" | en.wikipedia: malaria epidemics made Batavia known as the 'cemetery of Europeans'. |
| ev-founding-of-batavia | zh | “马尔代克人” → “马尔迪吉基尔人” | zh.wikipedia title for Mardijker people is 馬爾迪吉基爾人 (simplified 马尔迪吉基尔人). |
| ev-tambora-eruption | en | On the evening of 10 April 1815 it exploded. → Its first great blast came on 5 April 1815, and on the evening of 10 April it exploded. | The major eruption began on 5 April; 10 April was the climax (en.wikipedia). |
| ev-tambora-eruption | en | , and British officers in Java thought they were hearing cannon → ; in Java the British had taken the first blasts for cannon fire | The cannon-fire confusion in Java (troops sent out, boats dispatched) followed the 5 April explosions, not the 10 April climax (en.wikipedia). |
| ev-tambora-eruption | en | Raffles's government later estimated that tens of thousands died of starvation and disease → later estimates put the deaths from starvation and disease in the tens of thousands | The death-toll estimates come from Zollinger (1855), Petroeschevsky, Tanguy and others, not Raffles's government; Raffles mainly collected eyewitness reports. |
| ev-krakatoa-eruption | en | The last was heard on Rodrigues island → The third and greatest, just after 10 a.m., was heard on Rodrigues island | Wikipedia: the third and largest explosion (10:02) was heard on Rodrigues; a later explosion/collapse followed, so it was not 'the last'. |
| ev-krakatoa-eruption | en | tsunamis up to 30 metres high → tsunamis more than 30 metres high in places | Wikipedia gives waves over 30 m, up to c. 42 m on Java's west coast (46 m cited at Merak); 30 m is not the maximum. |
| ev-krakatoa-eruption | en | and nearly 300 villages → and some 165 villages, badly damaging 132 more | Colonial records cited by Wikipedia: 165 villages and towns destroyed and 132 seriously damaged; ~300 conflates destroyed and damaged. |
| ev-krakatoa-eruption | en | making Krakatoa the first global media disaster → making Krakatoa one of the first disasters the world followed almost as it happened | Wikipedia only says telegraph spread the news faster than earlier events; 'the first' is an unsupported superlative. |
| ev-asean-founded | en | In August 1967 the foreign ministers of five countries met → In August 1967 ministers from five countries, four of them foreign ministers, met | asean.org and Wikipedia: Malaysia's signatory Tun Abdul Razak was Deputy Prime Minister (and defence minister), not foreign minister. |
| ev-asean-founded | en | signed a two-page Bangkok Declaration → signed a short, five-article Bangkok Declaration | asean.org describes it as a concise document of five articles; no source found for 'two-page'. |
| ev-cambodian-genocide | en | some two million people swollen by refugees → two million or more people swollen by refugees | Wikipedia (Khmer Rouge rule) puts Phnom Penh at about 2.5 million with refugees; 'some two million' understates it. |
| ev-cambodian-genocide | en | some 14,000 people were photographed → an estimated 14,000 to 20,000 people were photographed | Tuol Sleng article: an estimated 20,000 prisoners (ECCC list of 18,145, probably more); 14,000 is an older low figure. |
| ev-cambodian-genocide | zh | 钟屋克 → 琼邑克 | zh.wikipedia title for Choeung Ek is 琼邑克 (alternative 钟屋); 钟屋克 is a nonstandard hybrid. |
| ev-cambodian-genocide | zh | 监狱长杜赫 → 监狱长康克由（杜赫） | zh.wikipedia lists Duch under his real name 康克由; give it, with the alias in brackets. |
| ev-manila-galleon | en | sailed north to about 40 degrees → sailed north to about 38 degrees | en.wikipedia (Urdaneta): the San Pedro sailed north-east to the 38th parallel to catch the westerlies. |
| ev-jayavarman-ii-phnom-kulen | en | Almost everything known about the founding of Angkor comes from one stone. → Most of what is known about the founding of Angkor comes from one stone. | No inscriptions of Jayavarman II survive and accounts rest on later inscriptions, Sdok Kak Thom chief among them but not alone (Jayavarman II article). |
| ev-banda-massacre | en | Their elected elders, the orang kaya, → Their leading men, the orang kaya ("rich men"), | Sources describe the orang kaya as 'rich men' heading districts; nothing supports that they were elected (en.wikipedia Banda Islands). |
| ev-banda-massacre | en | Even the Heeren XVII in Amsterdam rebuked Coen for his methods. → Even some of Coen's contemporaries condemned his methods, though the Heeren XVII in Amsterdam had themselves ordered the conquest. | en.wikipedia (Dutch conquest of the Banda Islands) says the Heeren XVII instructed Coen to subjugate Banda and records no rebuke; nl.wikipedia mentions no reprimand over Banda. Contemporary condemnation of 'Iron Jan' is attested. |
| ev-siege-of-batavia | en | ruled almost all of Java except two places: the old port of Banten and the Dutch fort at Batavia → ruled most of Java; apart from Balinese-backed Blambangan in the far east, the holdouts were the old port of Banten and the Dutch fort at Batavia | Blambangan, a vassal of Bali, remained outside Mataram's control until Agung's campaigns of the later 1630s (Britannica snippet; en.wikipedia Siege of Batavia). |
| ev-siege-of-batavia | en | probably of dysentery → of disease, probably dysentery or cholera | Sources differ: en.wikipedia says probably cholera; nl.wikipedia says acute gastro-enteritis after long-standing dysentery. |
| ev-batavia-massacre-1740 | en | and led to the division of Mataram → and helped set the stage for the later partition of Mataram | The Java War of 1741-43 weakened Mataram, but the partition came only in 1755 (Giyanti) after a separate war of succession; en.wikipedia links the massacre to the 1741-43 war and some 17 years of conflict, not directly to the division. |
| ev-philippine-american-war | en | near the San Juan bridge in Manila → in the Santa Mesa district of Manila | The first shot (Pvt. Grayson) was fired at Sociego Street, Santa Mesa; the National Historical Institute moved the marker off San Juan Bridge in 2003 because the incident did not happen there. |
| ev-philippine-american-war | en | by Frederick Funston, whose men posed as prisoners of Macabebe scouts → by Frederick Funston, who with a few fellow officers posed as prisoners of Macabebe scouts disguised as rebels | Funston and a handful of US officers posed as prisoners; the Macabebe scouts were disguised as insurgents (Britannica snippet, HistoryNet). |
| ev-first-indochina-war | en | France's worst colonial defeat since Montcalm → which the historian Bernard Fall called France's worst colonial defeat since Montcalm | The Montcalm comparison is Bernard Fall's judgement and should be attributed, not stated as fact. |
| ev-burmese-independence | en | Burma chose to leave the Commonwealth altogether, the first former colony to do so. → Unlike most other former British colonies, Burma chose to become independent outside the Commonwealth. | Sources confirm independence outside the Commonwealth 'unlike most other former British colonies', but none supports 'the first former colony to do so'. |
| ev-burmese-independence | en | an hour fixed by court astrologers as auspicious → an hour fixed by astrologers as auspicious | Burma had no royal court in 1948; contemporary reports speak of (Buddhist) astrologers. |
| person-andres-bonifacio | en | Andrés Bonifacio was orphaned at fourteen and supported → According to traditional accounts, Andrés Bonifacio was orphaned at fourteen and supported | Wikipedia: orphaned-at-14 claim is disputed (an 1881 record lists his parents living in Tondo; other research dates their deaths to 1883/1885). |
| person-aung-san | en | On 27 March 1945, now commander of the Burma National Army, Aung San led his troops out of Rangoon in an apparent parade and turned them against the Japanese, a date still marked as Armed Forces Day. → In March 1945, now commander of the Burma National Army, Aung San paraded his troops in Rangoon and marched them out as if to fight the British; on 27 March they turned against the Japanese, a date still marked as Armed Forces Day. | Wikipedia/New Mandala: the Rangoon parade and march-out came days before the revolt; 27 March is the date the BNA turned on the Japanese, not the parade date. |
| polity-champa | zh | 阿摩罗缽底 → 阿摩罗波胝 | '缽' is a traditional character; zh.wikipedia 占婆 renders Amaravati as 阿摩罗波胝. |
| polity-srivijaya | en | Arab geographers knew it as Zabag, ruled by a maharaja so rich that he threw a gold brick into a pond every day. → Arab writers described a realm called Zabag, usually identified with Srivijaya, whose maharaja was said to have a gold brick thrown into a pond every morning. | The gold-brick ritual is an anecdote from Abu Zayd / Ibn Khurdadhbih, regarded as moralising rather than historical; Zabag's identification with Srivijaya is debated (Zabag article). |
| polity-srivijaya | zh | 那格伯蒂纳姆 → 纳加帕蒂南 | zh.wikipedia title for Nagapattinam is 纳加帕蒂南. |
| polity-srivijaya | zh | 拉金德拉一世 → 拉真陀罗一世 | zh.wikipedia title for Rajendra I is 拉真陀罗一世. |
| polity-majapahit | zh | 罗登·威查耶 → 罗登·韦查耶 | zh.wikipedia title for Raden Wijaya is 罗登·韦查耶. |
| polity-majapahit | zh | 特里布瓦纳女王 → 特里布婆那女王 | zh.wikipedia title for Tribhuwana Wijayatunggadewi is 特里布婆那·毗阇耶顿遮提毗. |
| polity-ayutthaya | en | about 80 km up the Chao Phraya from the sea → about 80 km north of present-day Bangkok | 80 km is the distance from Bangkok, which itself lies ~30 km inland; the city is well over 100 km up the river from the Gulf. |
| polity-ayutthaya | en | commanded the royal guard in the 1620s → led the king's Japanese volunteer troops in the 1620s | Wikipedia: Yamada headed the Japanese village and the 'Department of Japanese Volunteers' fighting for King Songtham; not described as commander of the royal guard. |
| polity-pyu | en | a land of round brick cities → a land of walled brick cities | Only Sri Ksetra (and Maingmaw) are circular; Halin is rectangular with rounded corners and Beikthano roughly rectangular (Wikipedia). |
| polity-pyu | en | buried the ashes in inscribed urns → buried the ashes in urns, some of them inscribed | Wikipedia: hundreds/thousands of cremation urns at Sri Ksetra; only a few (royal) urns bear inscriptions. |
| polity-singhasari | zh | 罗登·威查耶 → 罗登·韦查耶 | zh.wikipedia title for Raden Wijaya is 罗登·韦查耶 (same fix as Majapahit for consistency). |
| polity-lan-xang | zh | 塞塔提拉王 → 赛塔提拉王 | zh.wikipedia title for Setthathirath is 赛塔提拉. |
| polity-lan-xang | zh | 苏里亚旺萨 → 苏里雅·翁萨 | zh.wikipedia title for Sourigna Vongsa is 蘇里雅·翁薩 (simplified 苏里雅·翁萨). |
| ev-founding-of-malacca | en, zh | after the Pires fix, second mention "The Portuguese apothecary Tomé Pires wrote" → "Pires also wrote" | avoids naming him twice |
| ev-jayavarman-ii-phnom-kulen | en, zh | Sdok Kak Thom "In 1052" → "In 1052 or 1053" | Saka 974; en.wikipedia gives 8 Feb 1053, other sources 1052 |
| ev-samudera-pasai-islam | zh | story 须文达那 → 须文答剌 | matches the record name |
| dataset-wide | zh | 罗登·威查耶 → 罗登·韦查耶 (also ev-mongol-invasion-of-java); 塞塔提拉 → 赛塔提拉 (also place-vientiane, polity-kingdom-of-vientiane) | zh.wikipedia titles, kept consistent across records |

Rejected suggestion: ev-aceh-war zh 朱月婷 → a phonetic rendering. 朱月婷 is the zh.wikipedia title for Cut Nyak Dhien (Wikidata Q2183970 sitelink; label 朱月亭, aliases 朱月婷, 朱亞典), so it stays. Champa: 阿摩罗缽底 (traditional 缽) → 阿摩罗波胝, the form zh.wikipedia 占婆 uses.

### Doubts left (not changed)

- ev-angkor-wat: the "fifteen parasols" over Suryavarman II not confirmed in a retrieved page.
- ev-manila-galleon: Arellano's San Lucas reached Mexico before Urdaneta in 1565; Urdaneta is kept as the conventional pioneer.
- ev-battle-of-dien-bien-phu: 55 days (en.wikipedia count) vs the Vietnamese "56 days and nights" the story uses.
- ev-samudera-pasai-islam: "remembered as the first sultanate" is hedged, but Perlak also claims priority.
- ev-banda-massacre: Coen landing on Lonthor himself (nl.wikipedia credits Martinus Sonck); the bamboo enclosure and the witnessing officer rest on narrative histories.
- ev-siege-of-batavia: Tegal as a Mataram rice depot (Wikipedia names Cirebon and Karawang).
- ev-le-thanh-tong-conquers-vijaya: army 260,000 (Phan Huy Chú, vi.wikipedia) vs 250,000 (en.wikipedia).
- person-aung-san: exact date of the Rangoon parade varies by source.
- polity-champa: Linyi founding 192 (en) vs 137 (zh.wikipedia body).
- polity-lan-xang: Fa Ngum deposed 1373 (text) vs 1372 (infobox).
- ev-vietnam-declaration-of-independence: P-38 flyover rests on one retrieved source.
