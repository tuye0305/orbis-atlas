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
