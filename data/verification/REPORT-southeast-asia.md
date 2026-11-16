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
