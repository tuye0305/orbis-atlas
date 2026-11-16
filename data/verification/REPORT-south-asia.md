# Verification report: South Asia (`data/south-asia/`)

Verifier: independent fact-checker agent (separate from the curator). `validate-data south-asia` gives 0 errors.

## 1. Auto-diff resolutions: `resolutions/south-asia.json`

Every diff is **keep-ours** except one:

- Keep-ours: Gupta era 320, Xuanzang 630, Kanishka born and died, Sikh Empire 1799, Sri Lanka 1948, and the coordinate diffs.
- `person-shivaji:born` is **disputed**: 1630 vs 1627, and Britannica gives both. The record keeps 1630 at medium confidence, with a reworded note.

The reasons and sources for each verdict are in the resolutions file.

## 2. Fixes

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-second-battle-of-panipat | summary en/zh | "13-year-old" → "14-year-old" | Akbar was born 15 Oct 1542; the battle was on 5 Nov 1556 |
| ev-nepal-becomes-republic | date | 2008-04-10 → 2008-05-28 (the monarchy was abolished that day); note updated | Whelpton; Britannica |
| ev-ceylon-independence | qid | Q2670092 (a polity) → removed; note added | rule for founding events |
| person-alauddin-khalji | Kara stop | 1292 → 1291 | Jackson, *The Delhi Sultanate* |
| person-shivaji | note | reworded to show the 1627/1630 split | Britannica |
| polity-maratha | summary | Panipat (1761) "checked" Maratha power; the power ended in 1818 | Gordon, *The Marathas 1600–1818* |
| Pala, Vijayanagara, Mysore, Sikh and Sri Lanka rulers | rulers[].qid | added Gopala Q3352284, Dharmapala Q3183804, Sadasiva Q1452340, Raja Wodeyar I Q15912370, Sher Singh Q7494639, Senanayake Q663001, Sirimavo Q194291, Jayewardene Q469661 | `wd.mjs lookup` |
| place-colombo | names | 1972–1982 split out as capital (Kotte has been the official capital since 1982) | — |
| place-lahore | names | 1163–1186 split out as capital | Bosworth, *The Later Ghaznavids* |

## 3. Spot-checks (✓)

- **Events:**
  - First Panipat: date (Julian, 21 April), note and route
  - Buxar, 22 Oct 1764
  - Kanishka 127
  - Timur's sack of Delhi and his route
  - da Gama; Goa; Plassey; Third Panipat
  - 1857 (summary neutral); Partition (neutral)
  - Jallianwala; Salt March; Lahore Resolution; Bangladesh 1971; Somnath
- **People:**
  - Stops for Shivaji, Akbar, Ranjit Singh and Tipu
  - The placeholder births for Chandragupta II and Rajendra are flagged in their notes
- **Places:**
  - Mumbai, Chennai, Kolkata, Dhaka, Prayagraj, Varanasi
  - Delhi: the Lodi capital at Agra (1506–26) is left simplified
- **Polities:** reigns for the Mughal, Delhi Sultanate, Vijayanagara, Gupta, Chola and Pakistan rulers. All ruler QIDs were looked up; Bahmani Muhammad Shah III has no clear item, so it is left blank.

## 2026-11 expansion

**New records:** 70 events, 24 people, 12 places (with name genealogies) and 22 polities (with rulers), for 128 in total. 69 stories were added: 35 on new events and 34 on existing importance-4/5 events, so every importance-4/5 record now has one.

**Auto-diff:** the build reported 38 differences against Wikidata, and all are resolved (0 open).
- **Fixed in the data:** Polonnaruwa now ends in 1236 rather than 1215, and Gangaikonda Cholapuram is dated 1022–1035, from Rajendra's Ganges expedition to the temple's first endowment.
- **Kept ours (with reasons):**
  - Wikidata's QID refers to a different referent: Faxian's book rather than the journey; the Changu Narayan temple rather than the inscription; the GIPR company (1849) rather than the first train (1853); modern Bhutan (1949) rather than the Zhabdrung state (1616); Chola Polonnaruwa.
  - The start date falls before the atlas floor: Pandya and Anuradhapura.
  - The birth year is unrecorded, and Wikidata gives the accession year instead: Pulakeshin II, Samudragupta, Iltutmish and Rudrama Devi. Each of these records carries a labelled placeholder.
  - The marker sits at a better anchor: Nalapani, Srinagar, Chawinda, Kargil, Galle and Murshidabad.
- **Disputed:** Samudragupta's death year, which is 375 or 380.

**Spot-check:** 33 of 128 new records were checked against a second source (26%). The second source was always outside Wikipedia and Wikidata: Britannica entries via search, UNESCO, or standard monographs.
- **Polities:** Polonnaruwa, Pandya, Chera, Anuradhapura, Bhutan, Ahom, Kandy, Golconda, Kakatiya and Hyderabad State.
- **People:** Samudragupta, Pulakeshin II, Iltutmish, Rudrama Devi, Madhava, Nur Jahan and Prithvi Narayan Shah.
- **Events:** Changu Narayan inscription, Gangaikonda, Faxian, Unification of Nepal, Bengal famine of 1770, GIPR first train, Ibn Battuta in Bengal, Dharmasvamin at Nalanda, Tarain, Talikota, Lachit and Saraighat, Language Movement and the 2015 Nepal earthquake.
- **Places:** Thanjavur, Peshawar and Kandy.

**Corrections made:**
- **Changu Narayan inscription:** the summary was rewritten. It is no longer called the oldest inscription in Nepal, because older finds exist.
- **Ibn Battuta:** his route now runs Sudkawan → Sylhet → Sonargaon.
- **Dharmasvamin:** "about seventy students".
- **Smaller fixes:**
  - The Bengal Language Movement event is now dated 1952.
  - The Tarain anecdote is now attributed to Firishta.
  - Vasco da Gama's crossing is given as "nearly four weeks".
  - Rama Raya is now described as "aged".
  - Lachit "died the following year".
  - The 2015 Nepal earthquake zh text had a border error, now fixed.
- **Removed as unverified:**
  - A Maldives "national day" claim.
  - The claim that Jung Bahadur was the first South Asian ruler in Europe.
  - A dangling polity link.
- **Weak citations replaced:** for Thanjavur and Peshawar.

**Known gaps:**
- No QID exists for the Licchavis of Nepal, Bakhtiyar's raids, the Maldives conversion or Ibn Battuta's South Asian leg.
- Maldives and Bhutan coverage is still thin.
- The Ghaznavid and Ghurid polities belong to central-asia and are not duplicated here.
- The Kakatiya start (1163, Hanamkonda inscription) is given as 1158 or 1162 in some secondary sources.

## 2026-11 review

Reviewer: independent fact-checker, separate from the curator. After the fixes below, `validate-data south-asia` reports 0 errors and the auto-diff 38 differences, 0 open.

**What was sampled and how:**
- **Stories:** all 69 stories (34 on existing records, 35 on new ones) were read in full in English. The Chinese text of 18 of them was also compared line by line, and those 18 include every story that was corrected.
- **New records:** all 128 were read, including summaries, stops, `names` ranges and ruler lists. All 125 new QIDs were re-checked with `wd.mjs lookup` (label, description, dates).
- **Claim-by-claim checks:** 59 new records got these: the 35 new events with stories and all 24 new people. That is 46% of the 128, above the 30% target. Where a claim was doubtful, it was checked against a source the curator did not cite: Wikipedia articles with their footnoted monographs (Sastry 1978; Ramasubramanian et al. 1994), UNESCO, Indian census figures and Nepali press. Britannica pages were blocked to the fetcher (HTTP 403) and were used only through search snippets.
- **Cross-dataset duplicates:** every new QID was grepped across the other `data/*/` folders. None are duplicated. The Faxian, Ibn Battuta, Mahmud and Timur subjects stay linked to the china, africa and central-asia datasets.

**Placeholder birth years.** The word "placeholder" no longer appears in the dataset. Each estimate now states its basis.

| Record | Old → new | Basis |
| --- | --- | --- |
| person-rudrama-devi | born 1240 → **1210**; confidence low | P. V. P. Sastry, *The Kākatīyas of Warangal* (1978), p. 125, puts her at about eighty when she died in 1289. A marriage soon after 1240 (Talbot) is compatible with this. The death stop no longer asserts a death in battle; the inscription only shows she had died before 27 Nov 1289. |
| person-samudragupta | 318 kept; note rewritten | Inferred from an adult accession c. 335 (Basham c. 335–376; Altekar c. 330–370). The figure 318 itself is uncited in Wikipedia, and the note says so. |
| person-pulakeshin-ii | 590 kept; note rewritten | He was a minor when Kirtivarman I died (c. 592–597), hence Mangalesha's rule, and he took the throne c. 610. |
| person-iltutmish | 1180 kept; note rewritten; confidence medium → low | Minhaj says Aibak bought him as a boy c. 1197; he was amir of Gwalior after 1200 and commanded the Badaun troops in 1205–06. Wikidata's uncited 1192 would make him a governor at eight. |
| Kanishka, Chandragupta II, Rajendra I, Kalidasa, Razia, Muhammad bin Tughluq | values kept; notes rewritten | The word "placeholder" is replaced by the reasoning behind each estimate. |

**Story and summary corrections:**

| Record | Old → new | Reason / source |
| --- | --- | --- |
| ev-xuanzang-in-india | He toured the south after the Prayaga assembly → he toured the south c. 638–640, before the Kannauj and Prayaga assemblies (c. 642–643) | Xuanzang's own itinerary (Beal tr.) |
| ev-vasco-da-gama-calicut | "four ships" reached India → three; the store ship was broken up after the Cape | Velho's *Roteiro* |
| ev-first-battle-of-panipat | "12,000, memoir puts it higher" → the memoir's own count of about 12,000 includes followers. "Two cannon under Ustad Ali Quli" → cannon under Ustad Ali Quli and Mustafa | *Baburnama* (Thackston tr.) |
| ev-nepal-earthquake-2015 | Kasthamandap reopened 2021 → April 2022 | *Himalayan Times*, Apr 2022 |
| ev-hampi-vijayanagara | ruins "some 25 km²" → "more than 40 km²" | UNESCO WHC 241 (4,187 ha) |
| ev-ambedkar-conversion | Buddhists "a few tens of thousands" → about 180,000 in 1951, about 3.25 million in 1961 | Census of India 1951/1961 |
| ev-tagore-nobel-prize | "first non-European laureate" → first non-European literature laureate and first Asian laureate | Roosevelt (1906) and Michelson (1907) were earlier non-European laureates |
| ev-tantrasangraha | "inner planets" circle the sun → the five planets | Ramasubramanian, Srinivas & Sriram, *Current Science* 66 (1994) |
| ev-battle-of-takkolam | Chola recovery "under Rajaraja I" → under Parantaka II (Sundara Chola) | Nilakanta Sastri, *The Cōḷas* |
| ev-battle-of-raichur | Nunes "who was present" → his chronicle, written in the 1530s | Sewell, *A Forgotten Empire* (1900), introduction |
| ev-bhopal-disaster | "3,800 within days by official count … tens of thousands" → about 3,800 by the later Madhya Pradesh figure; about 8,000 in the first days by other estimates | Wording aligned to the sources |
| ev-chandrayaan-3 | "the closest any spacecraft had come" to the pole → "then the closest … had landed" | IM-1 landed nearer the pole in 2024 |
| place-anuradhapura | Chola period 1017–1070 → 993–1070; summary "Chola sack of 1017" → "Chola conquest (993–1017)" | The city was sacked in 993, as the dataset's own Chola event says |
| polity-western-satraps | rulers out of time order | Re-sorted |

**Wording made more careful:**
- **Bangladesh 1971:** "hundreds of thousands, perhaps far more" now gives the stated range of 300,000 to 3 million. "India invaded" now reads "entered the war openly". The 93,000 are described as prisoners of war.
- **Partition:** Pakistan "celebrated its independence on 14 August".
- **Sri Lankan Civil War:** "most ruthless" now reads "dominant, eliminating rival Tamil groups". The UN panel's findings against both sides are added.
- **Somnath:** the "later national trauma" reading is attributed to Romila Thapar, with the other view noted.
- **Timur:** the unsourced "a century to recover" is replaced by the chroniclers' description of a deserted city.
- **Srivijaya raid:** "the only known" overseas campaign now reads "the most far-reaching".
- **Bakhtiyar Khalji:** the summary no longer claims he "ended Buddhism's institutional life"; Nalanda and Vikramashila were "probably" also struck.
- **Smaller fixes:** in the Talikota story, the copper-coin grapeshot is marked as a later account. The Nalanda story now credits the Shakraditya attribution to Xuanzang and the seals only with the king's name. The Periplus story no longer has its author advising "which kings to bribe".

Every English change was mirrored in `zh`.

**QIDs:**
- **Licchavi Nepal:** given Q3242360 ("ancient kingdom of Kathmandu valley").
- **Searched, no event item:**
  - Bakhtiyar Khalji's raids: Q2698200 is the man himself and Q27628354 his 1206 Tibet campaign.
  - Conversion of the Maldives: Q7293385 is the Rannamaari legend and Q3081535 the general topic.
  - Ceylon's independence: Q2670092 is the polity and Q6016023 the national holiday.
  - Each of these records says so in its note.

**Additions (9 records, each with at least 2 sources):**
- **Bhutan:**
  - `ev-paro-taktsang` (1692, Q2209873)
  - `ev-duar-war` (1864–65, Q2564664)
  - `ev-wangchuck-monarchy-1907` (no event item exists)
  - `ev-bhutan-constitution-2008` (Q4231519)
  - `person-ugyen-wangchuck` (Q333866)
- **Maldives:**
  - `ev-thakurufaanu-expels-portuguese` (1573, no item exists)
  - `ev-male-friday-mosque` (1658, Q4385992)
  - `ev-maldives-independence-1965` (Q124692827)
  - `ev-operation-cactus` (1988, Q1634613)

**Left for a human:**
- **Rudrama Devi's birth:** c. 1210 rests on a single scholar's estimate as reported secondhand. A reader with Sastry (1978) to hand should confirm p. 125.
- **Iltutmish and Samudragupta:** their birth years remain inferences; no published estimate was found.
- **Britannica claims:** these could not be re-opened directly because the site returned 403 to the fetcher.
