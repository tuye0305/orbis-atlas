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
