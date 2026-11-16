# Verification report: Oceania (`data/oceania/`)

Verifier: the curator agent, which re-checked its own records against a second source after drafting them.

- Validator: 0 errors, 20 warnings, all for records with no Wikidata item (see "Known gaps").
- Records: 83 events, 30 people, 17 places, 15 polities (145 in all).
- Wikidata enrichment and auto-diff: 19 diffs, all resolved, 0 open.

## Auto-diff resolutions (19): `resolutions/oceania.json`

| Key | Verdict |
| --- | --- |
| 11 coordinate diffs: Wikidata gives a country or archipelago centre, or the wrong site (Bounty mutiny south of NZ instead of off Tofua; He Whakaputanga at Wellington instead of Waitangi; Franco-Tahitian War on Raʻiatea) | keep-ours |
| taupo-hatepe-eruption:year (180 → 232 ± 10, Hogg et al. 2012) | keep-ours |
| spanish-chamorro-wars:year/endYear (1668–1695 per Guampedia) | keep-ours |
| wave-hill-walk-off:endYear (1975 handback), bougainville-conflict:endYear (2019 referendum) | keep-ours (scope choice, noted) |
| tui-tonga:to (1865), kingdom-of-tonga:from (1845), new-zealand:from (1840) | keep-ours (polity scope differs from the Wikidata item's inception) |
| person-te-rauparaha:born (1760 vs 1765; DNZB says "probably 1760s") | **disputed**, medium confidence with a note |

## Fixes made during spot-checks

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-spanish-chamorro-wars | story | Hurao's speech moved to 1671; San Vitores killed April 1672 (Hurao died 1672, so a 1676 speech was impossible) | Guampedia; Rogers, *Destiny's Landfall* |
| ev-hunga-tonga-eruption | story | removed the claim that the blast exceeded Krakatoa's force; now "pressure wave comparable to Krakatoa 1883"; deaths "about six" | NASA Earth Observatory; Smithsonian GVP |
| ev-white-australia-policy | story | the 1901 Act passed under Barton's government with Deakin steering the bill (not "Deakin's government") | NMA Defining Moments; ADB: Deakin |
| ev-hokulea-voyage-1976 | story (en, zh) | Mataiva landfall dated 1 June | Polynesian Voyaging Society; Finney, *Hokule'a* |
| ev-nz-womens-suffrage | story (en, zh) | turnout "more than 90,000 women, over 80% of enrolled" | NZHistory; Te Ara |
| ev-mutiny-on-the-bounty | story (en, zh) | Christian's party: eight other mutineers, six Polynesian men, 11–12 Polynesian women and a baby | Britannica; Pitcairn Islands Study Center |
| ev-blackbirding | story (en, zh) | officially 1,654 allowed to stay after 1906; perhaps 2,000–2,500 remained | NMA; Moore, *Kanaka* |
| ev-mendana-solomon-islands | story (en, zh) | Marquesas named for the viceroy's wife, the Marquesa de Mendoza | Britannica: Marquesas |
| ev-day-of-mourning-1938 | qid | Q1179068 added | Wikidata; AIATSIS |

## Spot-checks (36 of 145 = 25%; ✓ unless listed above)

- **Events ✓:** Murujuga World Heritage (11 July 2025); Kīngitanga founding (1858); bombing of Darwin (19 Feb 1942); Kokoda (Jul–Nov 1942); Bikini tests (from 1946); Maralinga (1956–63); 1967 referendum (27 May, 90.77% yes); Mabo (3 June 1992); apology to the Stolen Generations (13 Feb 2008); Myall Creek (10 June 1838); Black War / Black Line (1830); invasion of Parihaka (5 Nov 1881); cession of Fiji (10 Oct 1874) and the 1875 measles epidemic; Kanak revolt (June 1878); Samoa influenza (Nov 1918, ~22% of the population); Mau and Black Saturday (28 Dec 1929); Cook's death (14 Feb 1779); Batavia (4 June 1629); Moriori of Rēkohu; Nuʻuanu (1795); Eureka (3 Dec 1854); Federation (1 Jan 1901).
- **Events fixed:** Chamorro wars; Hunga Tonga; White Australia; Hōkūleʻa; NZ suffrage; Bounty; blackbirding; Mendaña; Day of Mourning (qid).
- **People ✓:** Tupaia (Raʻiatea, died Batavia 1770); Kamehameha I; Bennelong; Truganini (died 1876); Te Rauparaha (birth disputed).
- **Places ✓:** Kororāreka/Russell (the 2025 decision declining the rename is noted); Melbourne (Naarm/Batmania); Lahaina (capital 1820–1845).
- **Polities ✓:** Saudeleur rulers (Olosohpa, Mwohn Mwehi, Saudemwohl); Tuʻi Tonga span; Kingdom of Hawaiʻi rulers 1795–1893.

## Known gaps

- 20 records have no Wikidata item: early Polynesian settlement, Polynesian–American contact, several European voyages (Magellan at Guam, Mendaña, Duyfken, Tasman, Roggeveen, Bougainville, La Pérouse), the 1789 Sydney smallpox outbreak, the LMS mission to Tahiti, the cession of Fiji, Parihaka, Samoa 1918, Samoan and PNG independence, Parkes/Apollo 11 and the Hawaiʻi Island chiefdom.
- The 3rd–9th centuries are thin (3 events), which matches the archaeological record.
- Not covered: Pearl Harbor (left to the North America / Japan–Korea datasets), Vanuatu independence (1980), the Nouméa Accord (1998).
- Shared events are linked, not duplicated: ev-magellan-elcano-circumnavigation, ev-gallipoli-campaign, ev-pacific-war.

## Notes for curators

- Wikidata coordinates for Pacific events often sit at the archipelago centroid, or at the place where the document is now held rather than where the event happened.
- The Bounty mutiny item (coordinate south of New Zealand) and the He Whakaputanga item (Wellington) look wrong upstream.

## 2026-11 review

Reviewer: an independent fact-checking agent (not the curator). Branch merged with `origin/feat/world-regions` first.

### Sample

- **Sampled 82 of 145 records (57%)**, chosen mostly outside the curator's spot-check log: all 25 people not previously checked plus Tupaia, Kamehameha I, Bennelong and Truganini again; all 14 unchecked places; all 12 unchecked polities (rulers and reigns); 31 events, including every importance ≥ 4 event.
- **Stories read in full: all 56** (44 events, 4 people, 4 polities), against the cited works and at least one other source.
- **Checked against:** Britannica; Te Ara and the Dictionary of New Zealand Biography; NZHistory; Australian Dictionary of Biography; National Museum of Australia (Defining Moments); National Archives of Australia; Australian War Memorial; Guampedia; Wikipedia (as a pointer, not an authority); Wikidata labels, descriptions and dates for every QID (via the enrichment cache). Settlement chronology was checked against Wilmshurst et al. (PNAS 2011, 2008).
- **QIDs:** all 125 record QIDs and every ruler QID resolve to the intended subject. No cross-dataset duplicates (`ev-magellan-elcano-circumnavigation` and `ev-gallipoli-campaign` exist in europe/west-asia; `ev-pacific-war` exists on `data/japan-korea`).
- **Coordinates:** every event point checked; all point at the real site (Tofua, Waitangi, Umatac, Kealakekua, Wairau Bar, Panguna, Hagåtña…). The 19 auto-diff resolutions were re-read and hold up.
- **Indigenous terminology and contested topics:** wording on frontier massacres, the Black War, the Stolen Generations, the overthrow of the Hawaiian Kingdom and nuclear testing is neutral and sourced; ʻokina/kahakō, iwi names and Aboriginal nation names are consistent. Settlement dates follow the short chronology (East Polynesia c. 1025–1300, Aotearoa c. 1250–1300) and are medium confidence with notes; Kupe, the Saudeleur sorcerers, ʻAhoʻeitu and the Kamehameha comet are marked as tradition.

### Corrections

| Record | Field | Old → New | Reason / source |
| --- | --- | --- | --- |
| ev-mendana-solomon-islands | story (en, zh) | "the viceroy of Peru … the governor's nephew" → the governor of Peru, Lope García de Castro, sent his nephew | García de Castro was governor, not viceroy (Britannica: Mendaña) |
| ev-mendana-solomon-islands | story (en, zh) | Solomons "not seen by Europeans again for 200 years" → not until the late 1760s | Carteret, Bougainville and Surville reached them in 1767–69 |
| ev-myall-creek-massacre | summary (en, zh) | "Twelve convict and ex-convict stockmen led by a squatter's overseer" → twelve stockmen, eleven of them convicts or ex-convicts, led by the free-born John Henry Fleming | NMA Defining Moments: Myall Creek |
| ev-eureka-stockade | story (en, zh) | oath implied on 29 Nov → sworn the next day (30 Nov) after another licence hunt | Museum of Australian Democracy at Eureka; PROV |
| ev-australian-federation | story (en, zh) | Parkes's "crimson thread of kinship" 1889 → 1890 | Federation Conference banquet, Melbourne, Feb 1890 (Foundation 1901; Parkes Foundation) |
| ev-white-australia-policy | story (en, zh) | Japan, Britain's "ally" in 1901 → a power whose goodwill Britain was courting | Anglo-Japanese Alliance dates from 1902 |
| ev-first-anzac-day | story (en, zh) | NZ population "under one million" → just over one million; "wounded soldiers marched … watched by the king" → about 2,000 Anzac troops marched to a Westminster Abbey service attended by George V | AWM: The first anniversary of Anzac Day; Westminster Abbey |
| ev-murujuga-world-heritage | story (en) | "fat-tailed Tasmanian tiger" → the thylacine (Tasmanian tiger) | the thylacine is not fat-tailed |
| ev-makassan-trepang-trade | story (en, zh) | "In 1988 Yolŋu sailed a replica prau back to Makassar" → in 1987–88 the replica Hati Marege sailed from Makassar to Arnhem Land and was welcomed at Galiwinʼku | Burningham, *The Beagle* (1988); NT Museum |
| ev-lms-mission-tahiti | summary (en, zh) | Duff "landed thirty missionaries at Matavai" → brought thirty and landed most at Matavai | others were placed on Tonga and the Marquesas (Ellis; LMS histories) |
| ev-settlement-of-east-polynesia | summary (en, zh) | Society Islands settled "around 1000" → between about 1025 and 1120 | Wilmshurst et al. 2011 |
| person-oodgeroo-noonuccal | summary (en, zh) | returned her MBE in 1988 → 1987, in protest at the coming bicentenary | ADB; NAA |
| person-albert-namatjira | summary (en, zh) | "jailed in 1958" → convicted in 1958, served two months' detention in 1959, died that August | ADB: Namatjira |
| person-kamehameha-i, ev-battle-of-nuuanu | story | Isaac Davis called English → Welsh (John Young English; "British advisers") | Britannica: Kamehameha I |
| person-kaahumanu | confidence | high → medium, note "c. 1768" | birth year is an estimate |
| place-lahaina | summary (en, zh) | "first school west of the Rockies to print books" → oldest American school west of the Rockies, whose press printed the region's first newspaper (1834) | Lahaina Restoration Foundation: Hale Paʻi |
| ev-first-fleet | story (en, zh) | youngest convict "about nine" → had been sentenced at about nine; oldest "said to be" in her eighties | John Hudson was c. 13 on sailing; Dorothy Handland's age is uncertain |
| zh names | several | 卡科鲍 → 萨空鲍 (Cakobau, zh-wiki form; Fijian *c* = *th*); 彼得·拉洛尔 → 彼得·罗勒 (Lalor); 蒂诺朗伊阿蒂拉坦加 → 蒂诺·朗阿蒂拉坦加; 雪莉·贝克 → 雪利·贝克 (Shirley Baker was a man) | 中文维基 |

No year, date or coordinate errors were found in the sample beyond those already resolved by the curator.

### Additions

- **Stories (10)** for records that lacked one: James Cook, Te Rauparaha, Liliʻuokalani, Kaʻahumanu (people); Sydney, Honolulu, Auckland (places); Kingdom of Tonga, Kingdom of Tahiti, Kingdom of Fiji (polities). Stories now: 66.
- **Events (4):** `ev-cyclone-tracy` (Q245544, 1974), `ev-vanuatu-independence` (no Wikidata item; 1980, with the Santo "Coconut War"), `ev-noumea-accord` (Q321912, 1998–2021, with Ouvéa, Matignon and the three referendums), `ev-hawaii-statehood` (Q5684233, 1959). Each has ≥ 2 sources and a story. Records now: 149.
- Already present, so not added: Fiji coups 1987, Bougainville conflict.

### Left for a human

- `polity-kingitanga` and `ev-kingitanga-founding` share Q1235723 (the validator allows it; consider splitting if Wikidata gains an item for the 1858 installation).
- Hawaiian chiefdom reigns before 1750 and Saudeleur reigns are genealogical placeholders (low confidence, noted).
- Pearl Harbor and the Coral Sea are not in this dataset; check that the north-america or japan-korea datasets cover them.
