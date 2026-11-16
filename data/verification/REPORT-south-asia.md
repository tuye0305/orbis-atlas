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

## 2026-11 audit (web-sourced)

Independent audit using only pages retrieved during the audit (WebFetch/WebSearch); nothing checked from memory.

- **Seed:** 20261117 (mulberry32 shuffle of the 175 records added or changed against `origin/feat/world-regions`, sorted by id; first 5 records with new stories taken, then filled in shuffle order).
- **Sample (15, 6 with stories):**

| Record | Source(s) retrieved | Result |
|---|---|---|
| ev-chola-conquest-of-anuradhapura (story) | en.wikipedia Chola conquest of Anuradhapura | OK (source spells the province Mummudi-sola-mandalam) |
| ev-ibn-battuta-in-south-asia (story) | en.wikipedia Ibn Battuta; web search (Britannica, The Wire, 1911 encyclopedia: six to eight years in Delhi, embassy 1341/1342) | OK, within the spread of sources; note already says dates follow Dunn |
| ev-portuguese-conquest-of-goa (story) | en.wikipedia Portuguese conquest of Goa; web search (Britannica: first capture March 1510; en/Herald Goa: 17 Feb 1510) | OK (first-capture month disputed between sources) |
| ev-kailasa-temple-ellora (story) | en.wikipedia Kailasa temple, Ellora | OK (rock-removal figure not in source) |
| ev-maldives-conversion-to-islam (story) | en.wikipedia Islam in the Maldives | OK (source dates the oldest mosque to 1656; record says the Old Friday Mosque 1658, its usual completion date) |
| person-ram-mohan-roy | en.wikipedia Ram Mohan Roy | OK (Atmiya Sabha 1814 in en, 1815 in record; sailed 1830, in London 1831) |
| polity-western-chalukya | en.wikipedia Western Chalukya Empire; web search | OK |
| polity-pandya | en.wikipedia Pandya dynasty; web search (Kadungon, Arikesari chronologies) | OK (record follows the 590–620 / 670–700 chronology, one of two in use) |
| person-sher-shah-suri | en.wikipedia Sher Shah Suri | OK |
| person-guru-gobind-singh | en.wikipedia Guru Gobind Singh | OK |
| ev-thakurufaanu-expels-portuguese | web search: en.wikipedia Muhammad Thakurufaanu al-Auzam and National Day (Maldives), PSM News | OK |
| person-samudragupta | en.wikipedia Samudragupta | OK |
| ev-faxian-in-india | en.wikipedia Faxian | OK |
| ev-the-emergency (story) | en.wikipedia The Emergency (India) | OK |
| person-kalidasa | (record already marks dates and stops as inferred; nothing checkable beyond the works listed) | OK |

**Error rate:** 0 of 15 records. No fixes needed; data unchanged.

## 2026-11 story verification (web-sourced)

Every claim in each story was checked against pages retrieved during this pass (WebFetch/WebSearch; Britannica only through search snippets). Nothing was accepted from memory.

**Scope:** 65 of the 69 stories. Skipped: ev-chola-conquest-of-anuradhapura, ev-ibn-battuta-in-south-asia, ev-portuguese-conquest-of-goa and ev-the-emergency, which the 2026-11 audit had already checked against retrieved pages. Kailasa and the Maldives conversion were re-checked because the audit left one claim each without a source.

**Result:**
- 34 of 65 stories (52%) had at least one claim that a retrieved source contradicts.
- 51 of 65 (78%) needed some English change, counting softened unsupported claims.
- 2 more needed zh-only fixes.
- 12 were clean.
- 214 substring edits were made in story and summary, en and zh. Every en change is mirrored in zh.

**Other changes:**
- **ev-bakhshali-manuscript:**
  - The University of Oxford radiocarbon report of 2024 (ORA) withdraws the 3rd–4th-century date of 2017. All five tested leaves now date to c. 773–1032.
  - The span changes from 300–900 to 650–1000; 650 is Hayashi’s 7th-century date for the text.
  - The polity-kushan link is removed and the note rewritten. The ORA report is added to the sources.
- **zh name consistency:**
  - 《塞哥里条约》 → 《苏高利条约》 in the name, summary and story (zh.wikipedia).
  - 普里特维拉吉 → 普里特维拉杰 in the Tarain story, matching its summary.
  - 贾利安瓦拉园 → 扎连瓦拉园 in the Jallianwala story, matching its name.

### Sources and corrections per story

**ev-kanishka-accession-rabatak** — sources: Wikipedia: Rabatak inscription; Wikipedia: Kanishka; Wikipedia: Vima Takto.
- story (wrong): “a farmer near the village of Rabatak in Baghlan province, northern Afghanistan, unearthed a limestone block” → “Afghan fighters digging a trench near the village of Rabatak in Baghlan province, northern Afghanistan, unearthed a stone block”. It was found by mujahideen digging a trench, not a farmer; the stone's material is not given in the sources retrieved [Wikipedia: Rabatak inscription]
- story (unsupported): “The last two names solved a long-standing puzzle in the dynasty’s order.” → “The name of Vima Taktu, until then known only as the nameless “Great Saviour” king of the coins, settled the dynasty’s order.”. The puzzle concerned Vima Taktu (the anonymous Soter Megas), not both names; Vima Kadphises was already known [Wikipedia: Vima Takto]
- Open: Retrieved pages call 127 CE Falk's estimate but do not say it is the majority view (story and summary say 'most scholars'); widely cited, left as is. Wikipedia notes it is unclear whether Champa was actually ruled by Kanishka. Translation of the city list varies between readings (Sims-Williams vs Mukherjee).

**ev-gupta-era-begins** — sources: Wikipedia: Gupta era; Wikipedia: Chandragupta I.
- story (unsupported): “and his accession became year one of a new era” → “and his accession is usually taken as year one of a new era”. Linking the epoch to Chandragupta I is the prevailing theory, but Sircar, Majumdar and Goyal tie it to Samudragupta or Chandragupta II [Wikipedia: Gupta era]
- summary (unsupported): “The accession of Chandragupta I at Pataliputra, linked” → “The accession of Chandragupta I, linked”. Sources do not establish Pataliputra as his seat; his territory is disputed [Wikipedia: Chandragupta I]
- zh: Use the standard rendering 离车 (as in the zh summary) instead of 李查维; Consistent rendering of Licchavi; Consistent rendering of Licchavi
- Open: Wikipedia gives the epoch as c. 318-319 CE (al-Biruni's Shaka 241), while Smith and others give 319-320; the story's 319-320 is within the spread. Al-Biruni actually said the era marked the end of the 'wicked' Guptas, which the story does not mention.

**ev-nalanda-founded** — sources: Wikipedia: Nalanda mahavihara; Wikipedia (zh): 那烂陀寺; WebSearch: Xuanzang on Nalanda gatekeeper (anantamias.com, theprint.in).
- story (unsupported): “whose name appears on seals found at the site” → “and a seal found at the site also names Shakraditya as founder”. The founding seal names Shakraditya; no retrieved source says seals name Kumaragupta I (the illustrated seal is of Kumaragupta III) [Wikipedia: Nalanda mahavihara]
- story (unsupported): “towering libraries” → “lofty towers”. The multi-storey libraries come from later Tibetan accounts (Taranatha), not Xuanzang [Wikipedia: Nalanda mahavihara]
- story (unsupported): “logic, grammar and medicine” → “logic and grammar”. Retrieved sources list Yogacara, logic, grammar and Sanskrit; medicine not supported [Wikipedia: Nalanda mahavihara]
- story (unsupported): “Nalanda’s scholars carried Buddhism to Tibet in the 8th century.” → “In the 8th century Nalanda scholars such as Shantarakshita helped establish Buddhism in Tibet.”. Buddhism had reached Tibet earlier; Shantarakshita founded Samye at Trisong Detsen's invitation [Wikipedia: Nalanda mahavihara]
- Open: Length of Xuanzang's stay: en Wikipedia says about two years in total (637 and 642), zh Wikipedia says about five years; story's 'about five years in the 630s' sits within the spread but the decade is uncertain. 'Several thousand monks' is conservative (Xuanzang 10,000; Yijing 3,000+). Main text of en Wikipedia dates the destruction c. 1202, zh 1193; 'around 1200' fine.

**ev-aryabhatiya** — sources: Wikipedia: Aryabhata; Wikipedia: Aryabhatiya; Wikipedia: Aryabhata (satellite). No errors found.
- Open: Wikipedia notes the text was not necessarily composed in 499, so the summary's 'Writing ... aged 23' slightly overstates. The 'school ... in south India and Kerala for a thousand years' is only loosely supported (Kerala commentaries); acceptable.

**ev-xuanzang-in-india** — sources: Wikipedia: Xuanzang; Wikipedia (zh): 玄奘; Wikipedia (zh): 大唐西域记; Wikipedia: Great Tang Records on the Western Regions; Wikipedia: Harsha.
- story (wrong): “He crossed the Taklamakan and the Tian Shan” → “He crossed the Gobi and the Tian Shan”. Outbound he crossed the Gobi to Hami and Turfan and followed the Tian Shan; the Taklamakan was skirted, not crossed [WebSearch: encyclopediaofbuddhism.org / Wikipedia: Xuanzang]
- story (unsupported): “Around 638–640 he toured the south as far as the Pallava country” → “Later he toured the south as far as Kanchi, the Pallava capital”. No retrieved source gives these dates; Kanchi is confirmed [Wikipedia: Xuanzang]
- Open: Kannauj assembly: zh Wikipedia dates it 643, story says 'about 642' (within spread). 138 kingdoms = 110 visited + 28 heard of (zh Wikipedia); en Wikipedia says 110, so the figure depends on counting. The night crossing of watchtowers comes from Huili's biography; retrieved sources only say he travelled under cover of darkness.

**ev-chola-expedition-srivijaya** — sources: South Indian Inscriptions vol. 2 no. 20 (Tanjore, Rajendra yr 19), whatisindia.com; Wikipedia: Chola invasion of Srivijaya; Wikipedia: Rajendra I; Wikipedia: Virarajendra Chola.
- story (wrong): “Srivijaya itself, Malaiyur, Pannai,” → “Srivijaya itself, Pannai, Malaiyur,”. The inscription's sequence is Vijayam, Pannai, Malaiyur [SII vol. 2 no. 20]
- story (unsupported): “and Kadaram (Kedah), where the king Sangrama Vijayottungavarman was captured with his elephants and his treasure” → “and Kadaram (Kedah), whose king, Sangrama Vijayottungavarman, it says was captured with his elephants and his treasure”. The inscription calls him king of Kadaram but does not say where he was captured [SII vol. 2 no. 20]
- story (unsupported): “most historians think” → “many historians think”. Several motives are proposed (trade, digvijaya prestige, Khmer–Tambralinga alliance) [Wikipedia: Chola invasion of Srivijaya]
- story (wrong): “Srivijaya recovered, and later Cholas sent embassies rather than fleets.” → “Srivijaya survived, and when Virarajendra sent a fleet to Kedah around 1068 it was to restore a friendly king.”. Virarajendra's inscriptions record a naval conquest of Kadaram c. 1068, handed back to its king [Wikipedia: Virarajendra Chola]
- story (unsupported): “it was the most far-reaching overseas naval campaign known from any premodern Indian state” → “it was without parallel among the overseas campaigns of premodern Indian states”. Wikipedia calls it 'a unique event in India's history'; no source makes the superlative claim [Wikipedia: Chola invasion of Srivijaya]
- zh: Use the renderings in the zh summary (拉金德拉, 坦贾武尔)
- Open: 'Tamil merchant guilds remained active ... for two centuries': Wikipedia says Tamil influence in the Straits lasted about a century, though guild records continue later; consider 'for generations'. Inscription date: 19th regnal year, c. 1030-31 (some cite 1030). Wikipedia's Rajendra I page dates the expedition 1023-24 / coin of 1025; story has no date.

**ev-sack-of-somnath** — sources: Wikipedia: Sack of Somnath; Wikipedia: Somnath temple; Wikipedia: Mahmud of Ghazni.
- story (unsupported): “using its temple treasuries to pay for wars in Central Asia” → “using its temple treasuries to fund his wars and adorn his capital”. Retrieved source says the booty built up Ghazni; the Central Asian link is not stated [Wikipedia: Mahmud of Ghazni]
- story (unsupported): “Mahmud broke the idol with his own mace” → “Mahmud broke the idol”. Mace detail is later tradition; not in retrieved accounts [Wikipedia: Sack of Somnath]
- story (wrong): “On the way home his army got lost in the Rann of Kutch and suffered badly.” → “On the way home, avoiding hostile Hindu chiefs, his army took a hard route through Kutch, Sindh and the desert and suffered badly.”. Sources say he avoided blocked land routes by going through Kutch and Sindh, with losses to thirst and hunger in the desert; no 'lost in the Rann' [Wikipedia: Sack of Somnath; Wikipedia: Mahmud of Ghazni]
- Open: 'Defenders fought on the walls for days' not confirmed in retrieved pages. Sack of Somnath article counts Somnath as the 15th invasion while Mahmud's article gives 17 in total; summary's 'some seventeen' is fine. zh uses 伽色尼 in the story but the zh name field has 加兹尼; consider harmonising.

**ev-second-battle-of-tarain** — sources: Wikipedia: Second Battle of Tarain; Wikipedia: Prithviraj Chauhan; Wikipedia: First Battle of Tarain; Wikipedia: Qutb ud-Din Aibak.
- story (unsupported): “Muhammad threw in 12,000 fresh heavy cavalry” → “Muhammad threw in a fresh reserve of 10,000–12,000 horsemen”. Sources give 12,000 (Second Battle article) or 10,000 mounted archers (Jawami ul-Hikayat); 'heavy' not supported [Wikipedia: Second Battle of Tarain; Wikipedia: Prithviraj Chauhan]
- story (wrong): “Prithviraj fled on horseback, was captured near the Sarsuti river and put to death.” → “Prithviraj fled on horseback and was captured near Sarsuti (probably modern Sirsa); most accounts say he was later executed at Ajmer.”. Sarsuti is a fort/town, not a river; most sources say he was first kept as a vassal at Ajmer and executed later [Wikipedia: Prithviraj Chauhan]
- story (wrong): “Within a few years Ghurid generals held” → “Within about a decade Ghurid generals held”. Delhi 1193, but Kannauj 1198-99 and Bihar (Bakhtiyar Khalji) c. 1200-03 [Wikipedia: Qutb ud-Din Aibak]
- Open: Firishta's anecdote of Muhammad's shame (not sleeping with his wives, not changing clothes) could not be verified in retrieved sources; it is attributed in the text, so left. Whether Delhi was part of Prithviraj's kingdom is disputed (Majumdar: its northern boundary). Aibak's sultan title is uncertain (no coins), though he is conventionally the first sultan. zh name is 普里特维拉杰 in the summary but 普里特维拉吉 in the story; consider harmonising.

**ev-timur-sack-of-delhi** — sources: Wikipedia: Sack of Delhi (1398); Wikipedia: Timur; Wikipedia: Tughlaq dynasty; Wikipedia: Bibi-Khanym Mosque; Wikipedia: Nasir-ud-Din Mahmud Shah Tughluq.
- story (unsupported): “whose war elephants were thrown into panic by caltrops and burning camels, says one account” → “whose war elephants, one account says, were thrown into panic by burning camels”. Caltrops not in retrieved sources; burning camels are [Wikipedia: Sack of Delhi (1398)]
- story (unsupported): “The sultan fled to Gujarat.” → “The sultan fled.”. Retrieved sources say he fled but not where [Wikipedia: Tughlaq dynasty]
- zh: Use the same rendering as the zh summary (纳绥尔丁)
- Open: The ransom-for-protection detail is not confirmed in retrieved pages (they describe an uprising followed by a massacre). Britannica places the battle at Panipat, others outside Delhi. If a source for the sultan's flight to Gujarat (then Malwa) is available, the original sentence can stay.

**ev-vasco-da-gama-calicut** — sources: Fordham Internet History Sourcebook: Vasco da Gama, Round Africa to India (Velho's journal); Wikipedia: Vasco da Gama.
- story (unsupported): “met two Tunisian merchants who asked him” → “met two Muslims from Tunis who asked him”. The journal calls them two Moors from Tunis; it does not call them merchants [Fordham Sourcebook (Velho journal)]
- Open: 'The cargo paid for the expedition many times over' (often given as sixty times) is not stated in the retrieved pages, which only say the goods showed great profit potential. Cargo named as pepper and cinnamon is not itemised in retrieved sources.

**ev-first-battle-of-panipat** — sources: Wikipedia: First Battle of Panipat; Wikipedia: Babur; WebSearch: Baburnama on Hindustan (scroll.in, dawn.com, Smithsonian 'memoir 07'). No errors found.
- Open: The count of four earlier raids on the Punjab is the traditional count (Panipat as the fifth expedition) but no retrieved page gives a number. That Humayun was sent specifically to seize the Agra treasury is only partly supported (sources say sent to secure Agra; treasure distributed later).

**ev-second-battle-of-panipat** — sources: Wikipedia: Second Battle of Panipat; Wikipedia: Hemu; Wikipedia: Akbar; Wikipedia: Humayun; Chinese Wikipedia: 第二次帕尼帕特战役.
- story (wrong): “his son Akbar was 13 and Mughal rule was confined to the Punjab.” → “his son Akbar was 13 and campaigning in the Punjab, and Mughal rule, restored in Delhi and Agra only the year before, was still fragile.”. The Mughals held Delhi and Agra (as well as the Punjab) when Humayun died; Hemu took them later in 1556. [Wikipedia: Hemu; Wikipedia: Akbar]
- zh: Summary uses 希穆 but story and zh Wikipedia use 赫穆.
- Open: Who struck the blow is disputed: Abu'l-Fazl says Akbar refused and Bairam Khan killed Hemu; the contemporary Qandhari says Akbar did it on Bairam's advice. The story mentions both, which is acceptable. "Merchant" for Hemu is fair (saltpetre trader, market superintendent) though his caste/origin is debated.

**ev-battle-of-talikota** — sources: Wikipedia: Battle of Talikota; Wikipedia: Vijayanagara Empire; New World Encyclopedia: Battle of Talikota.
- story (wrong): “at Rakkasa-Tangadi north of Talikota” → “at Rakkasa-Tangadi south of Talikota”. The battlefield villages lie on the Krishna, roughly 25 miles south of Talikota town, where the sultans camped. [New World Encyclopedia / search results on Rakkasagi-Tangadagi]
- story (unsupported): “but the great city was never reoccupied.” → “but the great city was abandoned and never recovered.”. Tirumala briefly tried to rule from Vijayanagara before moving to Penukonda; "never reoccupied" overstates. [Wikipedia: Battle of Talikota]
- zh: Summary renders Rama Raya as 罗摩·罗阇, story as 罗摩·罗耶; make consistent.
- Open: Copper-coin grapeshot (from Ferishta) not found in retrieved pages; story already hedges it as "later accounts say". Length of the sack ("for months") rests on older accounts of a six-month stay; later historians question the extent of destruction. Date 23 vs 26 Jan 1565 disputed (story says only January).

**ev-taj-mahal** — sources: Wikipedia: Taj Mahal; Wikipedia: Mumtaz Mahal; Search results on Taj Mahal pietra dura (Britannica, PBS).
- story (unsupported): “wore white and gave up music for a time.” → “withdrew into mourning and gave up music and fine dress for two years.”. Chroniclers (Qazvini, Lahori, Kamboh) record a week away from affairs and two years without music or lavish dress; white clothing is not in the sources retrieved. [Wikipedia: Taj Mahal]
- story (unsupported): “the only asymmetrical element in the design.” → “the one conspicuous break in the design’s symmetry.”. Overstated "only": the main dome is also slightly asymmetrical; the cenotaph is the obvious break. [Wikipedia: Taj Mahal]
- zh: Summary uses 慕塔芝·玛哈 (standard zh rendering); story uses 玛哈尔.
- Open: Black Taj idea goes back to Tavernier (1660s), i.e. in Shah Jahan's lifetime; "later legend" is loosely acceptable. UNESCO page returned 403.

**ev-battle-of-karnal** — sources: Wikipedia: Battle of Karnal; Wikipedia: Nader Shah; Britannica: Nadir Shah (search snippet).
- story (unsupported): “and the emperor surrendered.” → “and the emperor soon submitted.”. No surrender on the field: Muhammad Shah withdrew to camp and submitted after negotiations, meeting Nader on 26 February. [Wikipedia: Battle of Karnal]
- zh: Story writes 穆罕默德·沙; make consistent.
- Open: Wikipedia gives 13 Feb 1739 in the narrative (Julian) and 24 Feb in the infobox (Gregorian); 24 Feb is fine.

**ev-battle-of-plassey** — sources: Wikipedia: Battle of Plassey; Wikipedia: Robert Clive.
- story (wrong): “and after a few hours the nawab’s army melted away.” → “and by the end of the day the nawab’s army had melted away.”. The engagement lasted the whole day (Wikipedia lead: about 11 hours), though with little hard fighting. [Wikipedia: Robert Clive; Wikipedia: Battle of Plassey]
- zh: Summary renders nawab/Siraj differently from the story (纳瓦布, 西拉吉·乌德-达乌拉).
- Open: The story says "Some of the British prisoners died"; numbers (146 in, 23 out per Holwell) are disputed, and the story avoids them, fine.

**ev-third-battle-of-panipat** — sources: Wikipedia: Third Battle of Panipat; Wikipedia: Ibrahim Khan Gardi; Wikisource: History of India Vol. 8 (message to the Peshwa); Panipat district (Govt of Haryana): Third Battle of Panipat.
- story (unsupported): “Their artillery, trained in the French style by Ibrahim Khan Gardi, did great damage” → “Their guns and musketeers under Ibrahim Khan Gardi, who had learnt French methods under Bussy, did great damage”. Ibrahim Khan himself was trained in French discipline under Bussy; his Gardi force was chiefly musketeers (who cut down about 12,000 Rohillas) with artillery. [Wikipedia: Ibrahim Khan Gardi; Wikipedia: Third Battle of Panipat]
- zh: Story writes 艾哈迈德·沙·杜兰尼; make consistent.
- Open: Order of Vishwasrao's death relative to the reserves is not fixed by the sources retrieved; story's afternoon sequence is plausible. Bhau's body was later found and cremated; "disappeared" describes the battle moment, acceptable.

**ev-battle-of-buxar** — sources: Wikipedia: Battle of Buxar; Wikipedia: Mir Qasim; Wikipedia: Treaty of Allahabad; Wikipedia: Robert Clive.
- story (unsupported): “governing some 20 million people.” → “governing tens of millions of people.”. No retrieved source gives 20 million; the Robert Clive article says the diwani made the Company ruler of thirty million. [Wikipedia: Robert Clive]
- zh: Story writes 舒贾·乌德-达乌拉; make consistent.
- Open: "fled west to Awadh": Mir Qasim did take refuge with Shuja in Awadh before Buxar (the Mir Qasim article covers his later wanderings after Oct 1764); acceptable. Tribute paid by the Company is described as "in return for an annual tribute", fine.

**ev-indian-rebellion-1857** — sources: Wikipedia: Indian Rebellion of 1857; Milestone Documents: Queen Victoria's Proclamation concerning India (text). No errors found.

**ev-indian-national-congress-founded** — sources: Wikipedia: Indian National Congress; Wikipedia: Ilbert Bill. No errors found.
- Open: Naoroji is credited with the drain theory alongside R. C. Dutt and Wacha; story's "developed" is fine.

**ev-jallianwala-bagh-massacre** — sources: Wikipedia: Jallianwala Bagh massacre.
- story (wrong): “in which several Europeans were killed and a woman missionary beaten.” → “in which several Europeans were killed; the next day a woman missionary was beaten.”. Marcella Sherwood was attacked on 11 April, not in the 10 April riots. [Wikipedia: Jallianwala Bagh massacre]
- story (wrong): “a crowd of perhaps 15,000 to 20,000” → “a crowd of perhaps 10,000 to 20,000”. The Hunter Commission put the crowd at 10,000-20,000 (Dyer estimated 6,000). [Wikipedia: Jallianwala Bagh massacre]
- story (unsupported): “Indian estimates were over a thousand.” → “Indian estimates were around a thousand or more.”. Congress inquiry and Malaviya estimated about 1,000 killed; "over a thousand" overstates. [Wikipedia: Jallianwala Bagh massacre]
- Open: "turned Gandhi ... against the Empire": retrieved page links public anger to the 1920-22 non-cooperation movement but does not describe Gandhi's own turn; widely stated by historians, left as is. The record name uses 扎连瓦拉园 while the story uses 贾利安瓦拉园; consider unifying (name field outside this check).

**ev-salt-march** — sources: Wikipedia: Salt March; Wikipedia: Mahatma Gandhi. No errors found.
- Open: Village speeches on untouchability and liquor supported only by general accounts (History.com snippet, mkgandhi.org); Wikipedia describes speeches attacking the salt tax. Distance given variously as 385-400 km; "about 390" is within spread. Wikipedia marcher list gives Gandhi as 61, which is wrong by his birth date; 60 is correct.

**ev-lahore-resolution** — sources: Wikipedia: Lahore Resolution; Wikipedia: Delhi Resolution; Wikipedia: 1937 Indian provincial elections; Wikipedia: Muhammad Ali Jinnah; GKToday: Two-Nation Theory (1940).
- story (unsupported): “Its plural “states” would later be cited by Bengali nationalists.” → “Bengali politicians would later argue that its plural “states” had promised a separate eastern state.”. Sources show Bengali League leaders (Abul Hashim, 1946) reading it as two states; none found for 'Bengali nationalists citing the plural'. [Wikipedia: Delhi Resolution; Wikipedia: Lahore Resolution]
- Open: Wikipedia is internally inconsistent on whether the resolution was moved/adopted on 23 or 24 March; the story avoids a single date, fine. 'Congress refused to share power in the UP' is the standard reading (Jinnah article mentions only the 'failed attempt' at a UP coalition); left as is.

**ev-independence-and-partition-1947** — sources: Wikipedia: Partition of India; Wikipedia: Radcliffe Line; Gandhi Heritage Portal / news accounts of Gandhi at Beliaghata on 15 August 1947 (via search). No errors found.
- Open: Nehru's 'awake to life and freedom' wording not retrieved from a fetched page but is the well-known Tryst with Destiny text; trains of dead not explicitly in fetched text.

**ev-constitution-of-india** — sources: Wikipedia: Constituent Assembly of India; Wikipedia: Purna Swaraj; Wikipedia: B. R. Ambedkar; Supreme Court Observer: The Doctor's wise words on 25 November 1949. No errors found.
- Open: Wikipedia lists 15 women initially and 17 by 1948 (Renuka Ray and Annie Mascarene elected later); '15 women' is the commonly quoted figure, left as is but could read 'about 15'.

**ev-bangladesh-liberation-war** — sources: Wikipedia: Bangladesh Liberation War; Wikipedia: Operation Searchlight; Wikipedia: Sheikh Mujibur Rahman; Wikipedia: 1970 Pakistani general election.
- story (unsupported): “won 160 of East Pakistan’s 162 seats” → “won 160 of East Pakistan’s 162 general seats”. 160/162 counts only general seats; with reserved women's seats it was 167/169. [Wikipedia: 1970 Pakistani general election]

**ev-sri-lankan-civil-war** — sources: Wikipedia: Sri Lankan civil war; Wikipedia: Black July.
- summary (wrong): “killed tens of thousands;” → “killed an estimated 80,000 to 100,000 or more people;”. Overall toll estimates are 80,000-100,000+ (UN, 2009), not 'tens of thousands'. [Wikipedia: Sri Lankan civil war]
- Open: Norway's role and the ~300,000 trapped civilians not in the fetched portion (UN panel commonly gives ~330,000); left as is.

**ev-bhopal-disaster** — sources: Wikipedia: Bhopal disaster.
- story (wrong): “other estimates put deaths in the first days near 8,000” → “other estimates put deaths in the first weeks near 8,000”. The 8,000 estimate (Sambhavna) is for the first weeks. [Wikipedia: Bhopal disaster]
- Open: 'By 1984 it was losing money' not explicitly checked in the fetched portion.

**ev-periplus-erythraean-sea** — sources: Fordham Internet History Sourcebooks: The Periplus of the Erythraean Sea; Wikipedia: Periplus of the Erythraean Sea; Wikipedia: Muziris; Wikipedia: Pattanam; Wikipedia: Arikamedu; NYRB: Garum Masala (Muziris papyrus, Vienna).
- story (unsupported): “The key, he explains, was the monsoon.” → “The key was the monsoon.”. The Periplus gives the July departure and Hippalus wind but no return season for the India route, so the whole explanation should not be attributed to him. [Fordham Sourcebook text, §§56-57]
- story (unsupported): “At Muziris Romans paid in gold coin and wine for” → “At Muziris Romans paid mainly in gold coin, with some wine, for”. Periplus: 'a great quantity of coin'; wine 'not much'. [Fordham Sourcebook text, §56]
- story (wrong): “Roman amphorae and coins have been dug up at Pattanam” → “Roman amphorae and other Mediterranean wares have been dug up at Pattanam”. Coins found at Pattanam are Chera; no Roman coins reported at Pattanam or Arikamedu (a Roman hoard was found ~10 km from Pattanam). [Wikipedia: Pattanam; Wikipedia: Arikamedu; Wikipedia: Muziris]
- story (wrong): “worth about seven million sesterces” → “worth, by modern reckoning, almost nine million sesterces”. Modern accounts value the Hermapollon cargo at about 9 million sesterces (the surviving three-quarter valuation is ~1,154 talents). [Wikipedia: Muziris; NYRB review]
- Open: The papyrus is mid-2nd century CE, about a century after the Periplus; the story does not claim otherwise.

**ev-brahmasphutasiddhanta** — sources: Wikipedia: Brahmagupta; Wikipedia: Brāhmasphuṭasiddhānta; arXiv: Much ado about Zero (2016).
- story (unsupported): “There, for the first time anywhere, zero is treated” → “There, for the first time in any surviving text, zero is treated”. Sources say it is the earliest known text to do so. [Wikipedia: Brahmagupta]
- zh: Use the same renderings as the zh name/summary; '修正' (revised) mistranslates sphuṭa ('correctly established').
- Open: The ~771 date for the Baghdad translation is not in the fetched Wikipedia pages (they say only al-Mansur's reign, 754-775) and MacTutor was unreachable; 'about 771' is within that reign. European parallel for whole-number equations (17th c., Fermat/Brouncker) not checked in a fetched page.

**ev-kailasa-temple-ellora** — sources: Wikipedia: Kailasa temple, Ellora; Wikipedia: Ellora Caves; UNESCO Ellora Caves (via search snippet); Indian Antiquary / Epigraphia Indica discussion of the Baroda plates (via search). No errors found.
- Open: Block size 'about 50 m long and 30 m high' not confirmed by a retrieved page (Wikipedia gives a 30-32.6 m height and an 82 x 46 m courtyard; secondary sites vary); suggest adding Higham (via Wikipedia: Ellora Caves) to sources for the 200,000-tonne figure. 'Five centuries' is slightly broad versus UNESCO's 600-1000 CE but within the spread of other datings.

**ev-bengal-famine-1943** — sources: Wikipedia: Bengal famine of 1943; Open magazine: In Memory of the Three Million (on Sen, deaths before well-stocked shops); Nobel Prize: Amartya Sen biographical.
- story (unsupported): “Bengal had no catastrophic harvest failure in 1943. What it had was a war.” → “Bengal’s food supply fell short in 1943, though historians still debate by how much. What it certainly had was a war.”. The size of the shortfall is disputed (Sen ~5% below average; Aykroyd 25%, Pinnell 20%). [Wikipedia: Bengal famine of 1943]
- story (wrong): “seized boats and destroyed rice stocks” → “seized boats and removed or destroyed rice stocks”. The order was for surplus paddy to be 'removed or destroyed'. [Wikipedia: Bengal famine of 1943]
- story (unsupported): “where they died on the pavements while restaurants stayed open” → “where many died on the pavements, often in front of well-stocked food shops”. No source found for restaurants; Sen documents deaths in front of well-stocked, state-protected food shops. [Open magazine (on Sen, Poverty and Famines)]
- Open: Wikipedia's overall range is 0.8-3.8 million; summary's 2.1-3 million is the Devereux range, acceptable.

**ev-bhola-cyclone** — sources: Wikipedia: 1970 Bhola cyclone.
- story (unsupported): “The Pakistani government, based 1,600 km away in the West, was slow and grudging with relief; foreign aid arrived faster.” → “The Pakistani government, based in the West on the far side of India, was slow and grudging with relief, while foreign governments sent large amounts of aid.”. No retrieved source gives the 1,600 km figure (the capital was ~2,000+ km away) or says foreign aid arrived faster. [Wikipedia: 1970 Bhola cyclone]

**ev-sangam-literature** — sources: Wikipedia: Sangam literature; Wikipedia: Muziris; Wikipedia: Avvaiyar; Down to Earth: The Porunai in Sangam literature (Puram 56 Yavana wine).
- story (wrong): “Puram poems praise kings, mourn heroes and beg patrons for gifts, and mention Roman wine and the gold that Yavana ships brought to the Chera port of Muziris.” → “Puram poems praise kings, mourn heroes and beg patrons for gifts. Poems of both kinds mention wine brought by the Yavanas (westerners, mostly Roman subjects) and the gold their ships carried to the Chera port of Muziris.”. The gold at Muziris is in Akananuru 149, an akam poem; the Yavana wine is in Purananuru 56. So the references are not all in puram poems. [Wikipedia: Muziris; Down to Earth (Puram 56)]
- summary (unsupported): “They are the oldest body of literature in a living Indian language other than Sanskrit.” → “They are the earliest known literature of South India.”. No retrieved source makes the 'oldest apart from Sanskrit' claim, and Sanskrit is not usually called a living language. Wikipedia calls Sangam 'the earliest known literature of South India'. [Wikipedia: Sangam literature]
- Open: I could not check against a retrieved source that A. K. Ramanujan’s translations 'brought them a world readership'. It is a fair characterisation. The legend: tradition also puts the second academy at Kapatapuram, lost to the sea; Wikipedia says 'floods'. 'Swallowed by the sea' for both is acceptable.

**ev-bakhshali-manuscript** — sources: Wikipedia: Bakhshali manuscript; Oxford GLAM: Carbon dating finds Bakhshali manuscript contains oldest recorded origins of the symbol 'zero' (2017); Chivall, Lladó-Buisán, Howell & Evison, Radiocarbon dating of the Bakhshālī manuscript (Oxford, 14 Oct 2024); Wikipedia: Brahmagupta.
- story (wrong): “Critics soon pointed out that the leaves gave three widely separated dates and that a text is usually copied onto bark rather than composed on it.” → “Critics soon pointed out that the three leaves tested gave widely separated dates. In 2024 the Oxford laboratory reported that a retest had shown the early result to be wrong: five leaves now date to the late 8th to early 11th centuries.”. The 2024 Oxford radiocarbon report says a second test on folio 16 showed the 2017 result was inaccurate. It treats folio 17 as an outlier and gives 773–1032 CE for folios 15, 16, 23, 33 and 55. No retrieved source supports the copying argument. [Oxford radiocarbon report 2024 (ORA); Wikipedia: Bakhshali manuscript]
- summary (wrong): “Radiocarbon dating in 2017 gave some leaves dates as early as the 3rd–4th centuries.” → “Radiocarbon dating in 2017 seemed to place some leaves as early as the 3rd–4th centuries, but a 2024 retest put all the tested leaves in the 8th–11th centuries.”. Superseded by the 2024 Oxford retest (773–1032 CE). [Oxford radiocarbon report 2024 (ORA)]
- Open: The record's note still gives the 2017 ranges and should be updated to the 2024 ranges. Wikipedia summarises the 2024 revision as 799–1102 CE (folio 16: 931–1032), but the report's own table gives 773–986, 901–1032, 890–1014, 885–995 and 774–991 CE (95.4%). The 'Whatever its date' paragraph still works. The opening could also say 'the earliest known Indian use of a zero symbol until 2024' if wanted. The 2017 claim of 'oldest recorded zero' no longer holds, but the story does not repeat it.

**ev-allahabad-pillar-prashasti** — sources: Wikipedia: Allahabad Pillar; Wikipedia: Samudragupta.
- story (wrong): “Nine kings of Aryavarta, the Ganges heartland, were” → “Eight named kings of Aryavarta, the Ganges heartland, were”. The Aryavarta list in the inscription names eight kings (Rudradeva, Matila, Nagadatta, Chandravarman, Ganapatinaga, Nagasena, Achyuta-nandin, Balavarman). [Wikipedia: Allahabad Pillar; Wikipedia: Samudragupta]
- Open: Some textbooks count nine Aryavarta kings, adding a Kota-family king named in an earlier verse, so 'eight named' is the safe wording. Simhala's 'tribute' is a court boast: Wikipedia notes that Meghavarna's gifts funded a monastery at Bodh Gaya. The story already says 'are said to'.

**ev-mahabalipuram-monuments** — sources: Wikipedia: Mahabalipuram; Wikipedia: Narasimhavarman I; Wikipedia: Descent of the Ganges (Mahabalipuram); Wikipedia: Shore Temple; Wikipedia: Pancha Rathas.
- story (unsupported): “The great relief on a 27-metre rock face shows” → “The great relief, on a rock face nearly 30 metres long, shows”. Wikipedia gives the relief as 96 × 43 ft (29 × 13 m). Other figures circulate, so the rounded wording is safer. [Wikipedia: Descent of the Ganges (Mahabalipuram)]
- story (unsupported): “Around 700 the king Rajasimha built the Shore Temple” → “Early in the 8th century the king Rajasimha built the Shore Temple”. Wikipedia says the Shore Temple was completed around 725, under Rajasimha (r. c. 690–728). [Wikipedia: Shore Temple]
- story (unsupported): “In 2004 the Indian Ocean tsunami briefly pulled the sea back and exposed the remains of older structures offshore.” → “In 2004 the Indian Ocean tsunami exposed the remains of older structures on the shore and offshore.”. Retrieved sources say the tsunami exposed a collapsed granite temple and sculptures, and outlines of temples offshore. None mentions the sea pulling back. [Wikipedia: Shore Temple]
- Open: The summary calls the Shore Temple 'the seed of Dravidian temple architecture'. That is arguable: it is among the earliest structural stone temples of the south, and the rathas are also called prototypes. 'An early landmark of Dravidian temple architecture' would be safer. UNESCO's page could not be fetched (403).

**ev-khajuraho-temples** — sources: Wikipedia: Khajuraho Group of Monuments; Wikipedia: Kandariya Mahadeva Temple; Wikipedia: Yashovarman (Chandela dynasty); Wikipedia: Lakshmana Temple, Khajuraho.
- story (wrong): “installed a Vishnu image taken from the Pratiharas” → “installed a Vishnu image obtained from his Pratihara overlord”. Sources say Yashovarman acquired the Vaikuntha image from his overlord, the Pratihara king Devapala. 'Taken' implies it was seized. [Wikipedia: Yashovarman (Chandela dynasty)]
- Open: The construction span varies by source: Wikipedia gives 'mostly 885–1000' and 'many 970–1030', and UNESCO (403, not fetched) is usually quoted as 950–1050. The story is within that spread. The retrieved pages do not explicitly tie the 954 inscription to the Lakshmana temple, though that is the standard identification (Epigraphia Indica I). Wikipedia gives Mahoba as the political capital, so 'ritual capital' is reasonable.

**ev-gangaikonda-cholapuram** — sources: Wikipedia: Gangaikonda Cholapuram; Wikipedia: Rajendra I; Wikipedia: Brihadisvara Temple, Gangaikonda Cholapuram; Epigraphia Indica vol. 18 (jainqq.org page text) on Tiruvalangadu grant.
- zh: Uses the standard Chinese name of the World Heritage site 'Great Living Chola Temples'.
- Open: Wikipedia's Rajendra I article (poorly sourced) says Rajendra waited at Sakkarakkottam and credits a younger brother as leader. Sastri and the plates are usually summarised as the general meeting the king on the Godavari, which the story follows. 'Through Vengi' is plausible (Vengi was a Chola ally on the route) but was not confirmed in a retrieved source.

**ev-parakrama-samudra** — sources: Wikipedia: Parakrama Samudra; Wikipedia: Parakramabahu I; Wikipedia: Kingdom of Dambadeniya; Daily Mirror (Sri Lanka): SAVE Parakrama Samudra.
- summary (wrong): “behind a bund over 13 km long” → “behind a bund about 12.5 km long”. Bund length is given as 12.3–12.8 km (Sri Lankan press, colonial survey) or 12.4 km (Wikipedia); no source found gives over 13 km apart from a travel site's 14 km. [Wikipedia: Parakrama Samudra; Daily Mirror]
- Open: Sources differ on how many older tanks were joined: three (Topa, Dumbutulu, Erabadu) in older accounts and the Sunday Observer, five in Wikipedia. 'Three older tanks' sits within that spread. The retrieved source gives no direction for the move to Dambadeniya, but it lies south-west of Polonnaruwa geographically.

**ev-bakhtiyar-khalji-bihar-bengal** — sources: Wikipedia: Muhammad Bakhtiyar Khalji; Wikipedia: Odantapuri; Wikipedia: Dharmasvamin; Banglapedia: Bakhtiyar Khalji; Wikipedia: Tabaqat-i Nasiri; Wikipedia: Lakshmana Sena.
- story (wrong): “Minhaj-i Siraj, writing about forty years later, heard the story from one of Bakhtiyar’s veterans.” → “Minhaj-i Siraj, who visited Bengal about forty years later and finished his chronicle in 1260, heard the story from one of Bakhtiyar’s veterans.”. Minhaj was in Bengal about 40 years after the raids but completed the Tabaqat-i Nasiri in 1260, some 60 years later. [Wikipedia: Bakhtiyar Khalji; Wikipedia: Tabaqat-i Nasiri]
- story (wrong): “rode into the Sena capital at Nadia” → “rode into the Sena king’s residence at Nadia”. Banglapedia and Wikipedia (Lakshmana Sena) say Nadia was not the capital; Lakhnauti/Gaur was. Some sources do call Nadia a capital. [Banglapedia: Bakhtiyar Khalji; Wikipedia: Lakshmana Sena]
- Open: I found no retrieved source that names the veteran informant: Raverty's notes are usually cited for Samsam-ud-din, whom Minhaj met at Lakhnauti in 1243. The 'two hundred horsemen' comes from Vincent Smith's paraphrase and a polemical site, not a primary text I read. Banglapedia dates the Bihar raid to 1203 and the fall of Nadia to early 1205, so 'about 1204' is within the spread.

**ev-konark-sun-temple** — sources: Wikipedia: Konark Sun Temple; Wikipedia: Narasingha Deva I (via search).
- story (unsupported): “The main tower, perhaps 60 metres high,” → “The main tower, perhaps 60 to 70 metres high,”. Wikipedia gives two figures for the vimana: 'over 61 m' and an estimated 70 m (229 ft). [Wikipedia: Konark Sun Temple]
- story (wrong): “The tower had fallen by the 19th century;” → “The tower had fallen by the mid-19th century;”. Sailors still saw the tower in the 17th century, and Wikipedia says the main vimana fell in 1837. 'By the 19th century' implies it fell before 1800. [Wikipedia: Konark Sun Temple]
- Open: The specific collapse theories (weak foundations, lightning, deliberate damage) are not in the retrieved text, though Wikipedia confirms the cause is 'unclear and controversial'. They are commonly cited.

**ev-daulatabad-capital** — sources: Wikipedia: Muhammad bin Tughluq; Wikipedia: Daulatabad, Maharashtra; Wikipedia: Bahmani Sultanate; Fran Pritchett: Ibn Battuta in Delhi (via search).
- story (wrong): “in 1347 their descendants rebelled” → “in 1347 these settlers and their sons rebelled”. Only 20 years after the move; the Bahmani founder Zafar Khan (Hasan Gangu) was himself among the Delhi migrants. [Wikipedia: Bahmani Sultanate]
- story (unsupported): “with its spiral tunnels and moat” → “with its dark rock-cut passages and moat”. Wikipedia describes a rock-cut gallery, dark passages and false gates, not spiral tunnels. [Wikipedia: Daulatabad, Maharashtra]
- story (unsupported): “he returned and let people go back.” → “he moved the court back to Delhi and many of the migrants returned north.”. Accounts differ: Barani speaks of permission to return, while Wikipedia says he forced people back. The neutral wording avoids picking a side. [Wikipedia: Muhammad bin Tughluq]
- Open: The summary's '1,100 km' was not confirmed. The straight-line distance is about 1,000 km; Ibn Battuta calls it forty days' journey. It is plausible by road, so I left it.

**ev-hampi-vijayanagara** — sources: Wikipedia: Hampi; Wikipedia: Vijayanagara Empire; Wikipedia: Domingo Paes; Wikipedia: Abd-al-Razzaq Samarqandi.
- story (unsupported): “the Portuguese horse trader Domingo Paes (c. 1520) compared it to Rome and described markets heaped with rubies and diamonds,” → “the Portuguese visitor Domingo Paes (c. 1520) compared it to Rome and described markets heaped with precious stones,”. Wikipedia says Paes travelled with a group of traders from Goa but does not call him a horse trader. It mentions a busy market for precious stones, without specifying rubies and diamonds. [Wikipedia: Domingo Paes]
- Open: I did not confirm Abdur Razzaq's 1443 visit year or his 'no equal' praise in a retrieved page. Both are standard (his mission ran 1442–45). The Kakatiya-captivity origin is one of two scholarly theories; the other has them as Hoysala officers. The story frames it as 'tradition', which is acceptable.

**ev-maldives-conversion-to-islam** — sources: Wikipedia: Malé Friday Mosque; Wikipedia: Rannamaari; Wikipedia: Islam in the Maldives; Wikipedia: History of the Maldives; ORIAS Berkeley: Ibn Battuta, Maldives and Sri Lanka 1341-1344.
- story (unsupported): “the Old Friday Mosque of Malé (1658)” → “the Old Friday Mosque of Malé (completed 1658)”. Clarify: building began in 1656 and was completed in 1658, which explains the 1656/1658 discrepancy [Wikipedia: Malé Friday Mosque]
- summary (unsupported): “a sultanate that lasted until 1968” → “a sultanate that lasted, apart from a brief republic in 1953, until 1968”. The monarchy was briefly replaced by the first republic in 1953 before the 1968 republic [Wikipedia: History of the Maldives]
- Open: Wikipedia's exact year of the first republic is muddled (1952 abolition / 1953 republic, monarchy restored 1953-54); 'brief republic in 1953' is the common formulation. Ibn Battuta's stay: sources give 1343-44 with some variance; story is within the spread.

**ev-tantrasangraha** — sources: Wikipedia: Kerala school of astronomy and mathematics; Wikipedia: Madhava of Sangamagrama; Wikipedia: Tantrasamgraha; Wikipedia: Madhava series; Wikipedia: Charles Whish.
- story (unsupported): “taught one another for six generations” → “passed their learning from teacher to pupil over several generations”. No source gives a count of six generations; Sarma's six-link chain starts with Govinda, not Madhava [Wikipedia: Kerala school of astronomy and mathematics]
- story (wrong): “and devised correction terms so that a few dozen terms gave π to eleven decimal places.” → “and devised correction terms and faster-converging series; with 21 terms of one such series he obtained π to eleven decimal places.”. The 11-decimal value came from the first 21 terms of a faster series, not 'a few dozen' terms of 1-1/3+1/5... [Wikipedia: Madhava of Sangamagrama]
- story (wrong): “Similar series for sine and cosine later carried the names of Newton, Gregory and Leibniz.” → “Similar series for sine, cosine and arctangent were found again in 17th-century Europe by Newton, Gregory and Leibniz.”. Newton rediscovered the sine/cosine series (1669); Gregory (1671) and Leibniz (1673) the arctangent series, not sine and cosine [Wikipedia: Madhava series]
- story (wrong): “Nilakantha’s Tantrasangraha of 1500 also proposed a planetary model” → “Nilakantha, who completed the Tantrasangraha around 1500, also proposed, in his commentary on the Aryabhatiya, a planetary model”. The Tychonic-like model is set out in Nilakantha's Aryabhatiyabhasya, not the Tantrasangraha (which revised Mercury and Venus); completion dated 1500-01 [Wikipedia: Tantrasamgraha]
- Open: Yuktibhasha is dated c. 1530 by the Kerala-school article but c. 1550 by the Tantrasamgraha article; summary's c. 1530 is within the spread. Whish's paper: published 1834 (Charles Whish article, Madhava article) though the Kerala-school and Tantrasamgraha articles say 1835; 1834 kept.

**ev-temple-of-the-tooth** — sources: Wikipedia: Temple of the Tooth; Wikipedia: Relic of the tooth of the Buddha; Wikipedia: Kandy Esala Perahera; Wikipedia: 1998 Temple of the Tooth attack; Manushi: The Dalada (on the 1561 destruction in Goa).
- story (wrong): “In 1560 the Portuguese announced that they had captured the tooth at Jaffna and that Archbishop Gaspar of Goa had ground it to powder and burned it.” → “In 1560 the Portuguese seized what they said was the tooth at Jaffna, and in 1561 Archbishop Gaspar of Goa publicly ground it to powder and burned it.”. Capture was 1560, but the destruction in Goa took place in 1561 after debate over a ransom offer [Wikipedia: Relic of the tooth of the Buddha; Manushi]
- Open: Who ordered the destruction is attributed variously to Viceroy Constantino de Bragança (Strong) and Archbishop Gaspar (who carried it out); 'holiest Buddhist site' is a common but unsourced superlative.

**ev-battle-of-saraighat** — sources: Wikipedia: Battle of Saraighat; Wikipedia: Lachit Borphukan; Republic World: NDA's Lachit Borphukan award.
- story (wrong): “Ahom chronicles (buranjis) record that while earthworks” → “According to Assamese tradition, while earthworks”. Wikipedia notes no historical document mentions the uncle's execution; it is tradition, not a buranji record [Wikipedia: Battle of Saraighat]
- story (legend): “The story may be embellished, but it is central” → “No contemporary document records it, but it is central”. Make clear the episode is unattested tradition [Wikipedia: Battle of Saraighat]
- summary (wrong): “The river battle ended the Mughal attempts to conquer Assam.” → “The river battle defeated the last major Mughal attempt to conquer Assam.”. Mughals briefly regained Guwahati in 1679-82 after Laluk Sola Borphukan's defection; Saraighat was the last major attempt [Wikipedia: Battle of Saraighat]
- Open: Mughal army size varies (infobox ~100,000 incl. militia); 'tens of thousands' is safe.

**ev-shivaji-coronation** — sources: Wikipedia: Shivaji; Wikipedia: Shivrai; Wikipedia: Sir Henry Oxenden, 3rd Baronet; GKToday: treaty with Shivaji 1674.
- story (wrong): “weighed against gold that was given away” → “weighed against gold and other metals that were given away”. He was weighed against seven metals and other goods, not gold alone [Wikipedia: Shivaji]
- Open: Oxenden's treaty/trading rights (12 June 1674) found only in weaker sources (GKToday; Wikipedia Oxenden article tags his attendance 'citation needed'); likely right per Sarkar but not verified from a strong page. A second, Tantric coronation followed on 24 September 1674, not mentioned (fine). Summary's 'Vedic ceremony': Wikipedia says Vedic chants were partly omitted at Brahmin insistence; acceptable simplification.

**ev-founding-of-the-khalsa** — sources: Wikipedia: Khalsa; Wikipedia: Guru Tegh Bahadur; Wikipedia: Panj Pyare.
- story (wrong): “Men of the Khalsa took the name Singh (lion) and women Kaur (princess);” → “Men of the Khalsa took the name Singh (lion); the name Kaur (princess) for women became standard later;”. Whether women were initiated and named Kaur in 1699 is disputed; Kaur became the compulsory identifier only in the 20th century [Wikipedia: Khalsa]
- summary (wrong): “Members took the names Singh and Kaur and the five outward signs of the faith.” → “Men took the name Singh (women later Kaur), and members adopted the five outward signs of the faith.”. Same: Kaur's adoption at the founding is disputed [Wikipedia: Khalsa]
- Open: Note field gives 30 March 1699; Wikipedia gives 13 April 1699 and says early sources vary (1689, 1695-98). Scholars such as McLeod date the formal Five Ks set later than 1699; story states them as the Guru's rule, which matches Wikipedia's wording, left as is.

**ev-unification-of-nepal** — sources: Wikipedia: Prithvi Narayan Shah; Wikipedia: Battle of Kirtipur.
- story (unsupported): “he bought muskets in Banaras” → “he obtained firearms in Banaras”. Wikipedia says his father-in-law procured firearms for him at Varanasi; 'bought' is not stated [Wikipedia: Prithvi Narayan Shah]
- story (unsupported): “its men are said to have had their noses and lips cut off” → “its men are said to have had their noses cut off”. Accounts differ on what else was cut (Wikipedia: ears and noses; other accounts lips); noses is common to all [Wikipedia: Battle of Kirtipur]
- story (legend): “and Prithvi Narayan took the seat prepared for the king” → “and Prithvi Narayan is said to have taken the seat prepared for the king”. Throne-seat detail is tradition, not in retrieved sources [Wikipedia: Prithvi Narayan Shah]
- Open: Kirtipur's fall is dated 1765, March 1766 and 1767 in different Wikipedia passages; story and summary's 1767 match the Battle of Kirtipur article.

**ev-great-bengal-famine-1770** — sources: Wikipedia: Great Bengal famine of 1770; GKToday: Regulating Act and constitutional control.
- story (wrong): “the rice harvest collapsed across lower Bengal and Bihar” → “the rice harvest collapsed across much of Bengal and Bihar”. The worst-hit areas were north Bengal and Bihar; south-east and south-central (lower) Bengal largely escaped [Wikipedia: Great Bengal famine of 1770]
- story (unsupported): “By 1770 people were selling their children” → “By 1770, contemporary accounts say, people were selling their children”. Child-selling, leaf-eating and Hooghly corpses are from contemporary/Hunter accounts, not confirmed in retrieved sources; attribute them [Wikipedia: Great Bengal famine of 1770]
- Open: 'Because the survivors were made to pay for the dead' is Hunter's interpretation; the 1771>1768 revenue comparison was found only via a Wikipedia-mirror snippet citing McLane, not the current article.

**ev-anglo-nepalese-war** — sources: Wikipedia: Anglo-Nepalese War; Wikipedia: Battle of Nalapani; Wikipedia: Treaty of Sugauli; Chinese Wikipedia: 英尼战争.
- story (unsupported): “and, unusually, another to “our gallant adversary”.” → “and, unusually, another honouring Balbhadra and his men as brave adversaries.”. Inscription wording differs between sources ('our brave adversary Bul Buddur and his gallant men' per Wikipedia); avoid a quote [Wikipedia: Battle of Nalapani]
- story (wrong): “A second campaign under David Ochterlony in 1815–16 outflanked the Nepalese and forced the Treaty of Sugauli.” → “David Ochterlony drove the Nepalese from the western hills in 1815, and when Nepal balked at the peace terms his 1816 advance towards Kathmandu forced it to ratify the Treaty of Sugauli.”. Treaty drafted Dec 1815; Nepal refused, and Ochterlony's 1816 campaign (Makwanpur) forced ratification on 4 March 1816; his 1815 campaign was part of the first war [Wikipedia: Treaty of Sugauli]
- summary (wrong): “ceding Sikkim, Kumaon, Garhwal and much of the Terai” → “ceding Kumaon, Garhwal, much of the Terai and the lands it had taken from Sikkim”. Nepal gave up the Mechi-Teesta lands conquered from Sikkim, not Sikkim itself [Wikipedia: Anglo-Nepalese War]
- zh: standard zh name 苏高利条约 (zh.wikipedia); Standard zh rendering used by zh.wikipedia
- Open: British strength at Nalapani: infobox 3,500 (Gillespie's division 3,513), lead says >5,000; story's 3,500 is defensible. The record's zh name field also uses 塞哥里条约 and should become 苏高利条约 (name field outside story/summary).

**ev-kandyan-convention** — sources: Wikipedia: Kandyan Convention; Wikipedia: Sri Vikrama Rajasinha; Sunday Observer: King Sri Wickrama Rajasinghe's lonely cell.
- story (unsupported): “had Ehelepola’s wife and children executed, an act remembered in Sinhalese ballads.” → “had Ehelepola’s wife and children executed.”. No retrieved source mentions ballads about the episode [Wikipedia: Sri Vikrama Rajasinha]
- summary (wrong): “It ended over two thousand years of Sinhalese monarchy” → “It ended over two thousand years of monarchy on the island”. The last Kandyan dynasty was of south Indian (Telugu) Nayak origin; Wikipedia speaks of 2,358 years of self-rule on the island [Wikipedia: Kandyan Convention]
- Open: Capture date given as 17 or 18 Feb 1815 by different sources (story gives none). Wikipedia notes the authenticity of some chiefs' signatures has been questioned.

**ev-bengal-sati-regulation** — sources: Wikipedia: Bengal Sati Regulation, 1829; Wikipedia: Ram Mohan Roy; Wikipedia: Sati (practice); Wikipedia: Lord William Bentinck; Banglapedia: Dharma Sabha.
- zh: 'Culpable homicide' is not negligent homicide (过失杀人); use a neutral rendering
- Open: Exact case total varies by source (7,941 / 8,134 / 8,135); 'over 8,000' is within the spread. Strictly the regulation made abetting sati culpable homicide; acceptable shorthand.

**ev-kot-massacre** — sources: Wikipedia: Kot massacre; Wikipedia: Jung Bahadur Rana; Wikipedia: Rajya Lakshmi Devi; Wikipedia: Gagan Singh Bhandari; Wikipedia: Rana dynasty; Wikipedia: 1951 Nepalese revolution; Britannica: Jung Bahadur (search snippet).
- story (wrong): “Within months he had exiled the queen and then the king.” → “Within months he had exiled the queen, whom the king followed to Benares, and in 1847 he deposed the king.”. The king went into exile with the queen voluntarily; in May 1847 he was dethroned, and after a failed comeback he was held under house arrest in Bhaktapur, not exiled. [Wikipedia: Jung Bahadur Rana; Rajya Lakshmi Devi]
- Open: The retrieved pages say Gagan Singh was killed at prayer but not explicitly that he was shot (widely reported elsewhere). The Kot massacre article itself gives an inconsistent 16 Sept date in one section; the 14 Sept date is supported by the Jung Bahadur and Gagan Singh articles.

**ev-great-famine-1876** — sources: Wikipedia: Great Famine of 1876–1878. No errors found.
- Open: 'Death rates in the camps soared' and the Delhi Durbar date are not stated on the retrieved page (they come from Davis); left as is. The Temple wage also included one anna in cash, which the story omits; acceptable simplification.

**ev-raman-effect** — sources: Wikipedia: C. V. Raman; Optica OPN: C. V. Raman and the Raman effect (search snippet); Raman & Krishnan, Nature 121, 501 (1928), as quoted in search snippets.
- story (wrong): “On a voyage to Britain in 1921 he studied” → “On the voyage home from Britain in 1921 he studied”. The sea-colour observations were made aboard S.S. Narkunda on the return voyage to India in September 1921, after his Oxford lecture. [Wikipedia: C. V. Raman]

**ev-quit-india-movement** — sources: Wikipedia: Quit India Movement; Banglapedia: Quit India Movement, 1942.
- summary (unsupported): “with tens of thousands jailed” → “with about 100,000 people jailed”. British figures give over 100,000 arrests; aligns the summary with the story. [Wikipedia: Quit India Movement]
- Open: The full 'We shall either free India or die in the attempt' sentence is quoted on Wikipedia only in a stamp caption; it matches the standard text of the speech.

**ev-first-kashmir-war** — sources: Wikipedia: Indo-Pakistani war of 1947–1948; ThePrint: 75 years of Indian Army landing at Srinagar airfield (search snippet). No errors found.
- Open: Some accounts (e.g. Mahajan) put the signing of accession on 27 Oct; the story's 26 Oct follows the official date.

**ev-bengali-language-movement** — sources: Wikipedia: Bengali language movement; Banglapedia: Language Movement; Wikipedia: International Mother Language Day.
- summary (unsupported): “Police fired on demonstrators at Dhaka University on 21 February 1952” → “Police fired on demonstrators near Dhaka University on 21 February 1952”. The firing took place outside the campus, by the Medical College and the Assembly building, as students marched out. [Banglapedia: Language Movement; Wikipedia: Bengali language movement]
- Open: Sources place the firing near the Assembly (in the Jagannath Hall area) rather than naming the medical college hostel; the two were adjacent, so the story's 'near the medical college hostel' is left as is. Jinnah's speech is dated 21 March (Wikipedia) or 19 March meetings (Banglapedia); the story only says March.

**ev-ambedkar-conversion** — sources: Wikipedia: Deekshabhoomi; Wikipedia: B. R. Ambedkar; Wikipedia: Dalit Buddhist movement; IndiaSpend: Dalits are still converting to Buddhism (search snippet, census figures).
- story (wrong): “the day Hindus celebrate Ashoka’s legendary conversion” → “Vijayadashami, the day traditionally held to be that of Ashoka’s conversion”. Hindus celebrate the day as Dussehra/Vijayadashami; it is the Buddhist tradition (Ashoka Vijayadashami) that dates Ashoka's conversion to it. [Wikipedia: Deekshabhoomi]
- summary (unsupported): “revived Buddhism as a living religion in India” → “gave Buddhism a mass following in India again”. Buddhism had never died out entirely in India (Himalayan regions, Bengal Baruas); 'revived as a living religion' overstates it. [Wikipedia: Buddhism in India]

**ev-economic-liberalisation-1991** — sources: Wikipedia: 1991 Indian economic crisis; The Quint fact-check / Business Standard on the 1991 gold pledge (search snippets); ISAS/ThePrint on the 24 July 1991 budget speech (search snippets). No errors found.
- Open: The fall in Gulf remittances is not on the retrieved page, though it is widely cited. The '6 per cent average' growth figure was not checked against a specific source; it is roughly right for 1992-2012.

**ev-nepal-earthquake-2015** — sources: Wikipedia: April 2015 Nepal earthquake; Wikipedia: Dharahara; Wikipedia: 2015 Nepal blockade; The Himalayan Times: Kashthamandap temple inaugurated (April 2022); Nepal PDNA Volume B (search snippet); Avouac et al., Nature Geoscience 2015 (search snippet).
- summary (wrong): “destroyed or damaged over 800,000 houses” → “destroyed or damaged some 750,000 houses”. The PDNA counts 498,852 houses destroyed and 256,697 damaged (about 755,000); even earlier government counts were about 785,000. [Nepal PDNA Volume B]
- story (unsupported): “the nine-storey Dharahara tower fell with tourists on its viewing deck” → “the nine-storey Dharahara tower, crowded with Saturday visitors, fell, killing some 180 people”. No retrieved source places tourists on the viewing deck; sources say it was busier than usual on a Saturday and about 180 bodies were recovered. [Wikipedia: Dharahara; Nepali Times (search snippet)]
- story (unsupported): “The Kasthamandap was rebuilt with traditional techniques and reopened in April 2022” → “The Kasthamandap was rebuilt and reopened in April 2022”. The retrieved report confirms the April 2022 inauguration but not the methods; it notes an earlier contractor's use of cement and iron rods caused protests. [The Himalayan Times: Kashthamandap temple inaugurated]
- Open: The 'some 150 km' rupture length sits within the published spread (about 140 km eastward, 150-170 km fault models). The blockade is described neutrally as 'on the Indian border'; India denied imposing it.

**ev-july-revolution-2024** — sources: Wikipedia: 2024 Bangladesh quota reform movement; Wikipedia: July Revolution (Bangladesh); Wikipedia: Killing of Abu Sayed; Wikipedia: Resignation of Sheikh Hasina; Reuters exclusive via The Star: Bangladesh army refused to suppress protest (search snippet); Dawn: Yunus arrives in Bangladesh to lead interim govt. No errors found.
- Open: Crowd size 'hundreds of thousands' on 5 Aug not stated numerically in retrieved sources. Wikipedia's Hasina resignation article says she left by helicopter (lead) but also mentions a C-130 to Hindan; 'by helicopter' is acceptable.

