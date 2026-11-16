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
