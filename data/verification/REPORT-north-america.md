# Verification report: North America (`data/north-america/`)

Curator and verifier: north-america curator agent.
Scope: `events.json` (124), `people.json` (38), `places.json` (18) and `polities.json` (23), 203 records in all, with 98 stories.
The verdicts for the auto-diffs are in `resolutions/north-america.json`.
After the edits, `node scripts/validate-data.mjs north-america` reports 0 errors and 0 warnings, and `node scripts/build-data.mjs` reports 0 open diffs.

## 1. Auto-diff resolutions (50 of 50 resolved: 48 keep-ours, 2 disputed, 0 fix)

Most differences are of two kinds:
- **Pins at a representative site.** Wikidata gives a centroid, a head office or a placeholder: War of 1812 at (0, −30), HBC at Toronto, the Alaska Purchase at Washington.
- **A QID whose dates cover a broader or neighbouring thing.** For example, Q182323 is the Model T, Q46974 is the CPR company, Q233260 is the whole Great Northern Expedition, Q1296201's 1949 is when the monument was created, and Q11698 carries a bad value of 2026.

| Key | Verdict | Basis |
| --- | --- | --- |
| ev-hohokam-canals:year | keep-ours | The record is the canal system, not the Hohokam culture (the QID): main canal building in the Salt River valley is usually dated from c. AD 600, while 300 is the conventional start of the culture. |
| ev-hohokam-canals:endYear | keep-ours | Abandonment of the Salt and Gila valley canal communities is placed c. 1450 (ASCE landmark gives 1450) |
| ev-haudenosaunee-great-law:year | disputed | No consensus: an eclipse-based 1451 date has the widest support, Mann and Fields argue for 1142 (Wikidata 1190 reflects the early school), and archaeologists such as Dean Snow put it later. Kept at c. |
| ev-beaver-wars:coord | keep-ours | Our pin is a representative site for the event |
| ev-pequot-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-hudsons-bay-company-chartered:coord | keep-ours | Our pin is a representative site for the event |
| ev-king-philips-war:endYear | keep-ours | Fighting in southern New England ended with Metacom's death in August 1676 |
| ev-bering-chirikov-reach-alaska:year | keep-ours | The record is the 1741 landfall in Alaska |
| ev-french-and-indian-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-expulsion-of-the-acadians:year | keep-ours | Wikidata has only a point in time of 1764 (the end) |
| ev-expulsion-of-the-acadians:coord | keep-ours | Our pin is a representative site for the event |
| ev-pontiacs-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-american-revolutionary-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-us-constitution:year | keep-ours | Wikidata's 2026 is a bad value |
| ev-war-of-1812:coord | keep-ours | Our pin is a representative site for the event |
| ev-texas-revolution:coord | keep-ours | Our pin is a representative site for the event |
| ev-oregon-trail:year | keep-ours | The record is the emigrant migration, which began with the first wagon party (Bartleson–Bidwell) in 1841 |
| ev-mexican-american-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-california-gold-rush:year | keep-ours | Wikidata's point in time (1855) is the end |
| ev-american-civil-war:year | keep-ours | Wikidata's point in time (1865) is the end |
| ev-american-civil-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-alaska-purchase:coord | keep-ours | Our pin is a representative site for the event |
| ev-reconstruction-era:year | keep-ours | Britannica and most surveys date Reconstruction 1865–1877 |
| ev-reconstruction-era:coord | keep-ours | Our pin is a representative site for the event |
| ev-first-transcontinental-railroad:coord | keep-ours | Our pin is a representative site for the event |
| ev-red-river-war:coord | keep-ours | Our pin is a representative site for the event |
| ev-canadian-pacific-last-spike:year | keep-ours | The QID is the railway company (founded 1881) |
| ev-canadian-pacific-last-spike:coord | keep-ours | Our pin is a representative site for the event |
| ev-north-west-resistance:coord | keep-ours | Our pin is a representative site for the event |
| ev-ford-assembly-line:year | keep-ours | The QID is the Model T (launched 1908, noted in the summary) |
| ev-wall-street-crash-and-depression:endYear | keep-ours | The QID is the October 1929 crash |
| ev-wall-street-crash-and-depression:coord | keep-ours | Our pin is a representative site for the event |
| ev-new-deal:coord | keep-ours | Our pin is a representative site for the event |
| ev-manhattan-project:year | keep-ours | The Army's Manhattan Engineer District was set up in mid-1942 (named in August) |
| ev-manhattan-project:coord | keep-ours | Our pin is a representative site for the event |
| ev-october-crisis:coord | keep-ours | Our pin is a representative site for the event |
| ev-quebec-referendum-1980:coord | keep-ours | Our pin is a representative site for the event |
| ev-creation-of-nunavut:coord | keep-ours | Our pin is a representative site for the event |
| ev-september-11-attacks:coord | keep-ours | Our pin is a representative site for the event |
| ev-effigy-mounds:year | keep-ours | Wikidata 1949 is the founding of Effigy Mounds National Monument |
| person-leif-erikson:born | disputed | His birth year is unrecorded |
| polity-spanish-florida:from | keep-ours | Spanish claims date from Ponce de León in 1513, but the first lasting settlement and government was St. Augustine in 1565 |
| polity-spanish-florida:to | keep-ours | The Adams–Onís Treaty was signed in 1819 and ratified in 1821, when the US took formal possession |
| polity-nuevo-mexico:to | keep-ours | This record ends at Mexican independence (1821) |
| polity-new-netherland:from | keep-ours | Wikidata 1609 is Hudson's voyage |
| polity-new-netherland:to | keep-ours | The English took New Amsterdam in 1664 |
| polity-russian-america:from | keep-ours | The first permanent Russian settlement was Shelikhov's Three Saints Bay on Kodiak (1784) |
| polity-united-states:from | keep-ours | Declaration of Independence, 4 July 1776 |
| polity-british-north-america:to | keep-ours | This record ends at Confederation (1867), when the core colonies became Canada |
| polity-tecumseh-confederacy:to | keep-ours | The confederacy collapsed with Tecumseh's death at the Thames (October 1813) |

## 2. Spot-check (42 of 203 records = 21%)

Each record below was re-checked against at least one source other than the one it was drafted from (web search and fetch, November 2026).

| Record | Second source | Result |
| --- | --- | --- |
| `ev-haudenosaunee-great-law` | The Canadian Encyclopedia (Iroquois); Britannica | Founding date is disputed (1142 vs c. 1451 vs 16th c.). Kept c. 1450 with low confidence and a disputed verdict. |
| `ev-king-philips-war` | History.com; Treaty of Casco 1678 | Southern war ended Aug 1676, so the 1676 end is correct. Maine fighting went on to 1678. |
| `ev-hohokam-canals` | ASCE Historic Landmark; US Bureau of Reclamation | Main canal building began c. 600 and abandonment came c. 1450. Confirmed. |
| `ev-reconstruction-era` | Britannica; NPS | 1865–1877 confirmed. 1863 is Lincoln's amnesty proclamation. |
| `ev-oregon-trail` | BLM Oregon Trail Center; Utah History to Go | First emigrant wagon party was 1841. Confirmed. |
| `ev-manhattan-project` | OSTI/DOE history | The Army district was set up in mid-1942 and the Einstein letter dates from 1939. Confirmed. |
| `ev-ford-assembly-line` | History.com; Ford heritage | Moving chassis line began 7 Oct 1913 and the Model T in 1908. Confirmed. |
| `ev-great-peace-of-montreal` | The Canadian Encyclopedia | 4 Aug 1701, with 39 nations and Haudenosaunee neutrality. Confirmed. |
| `ev-battle-of-the-plains-of-abraham` | The Canadian Encyclopedia | 1759, and both Wolfe and Montcalm died. Confirmed. |
| `ev-pontiacs-war` | The Canadian Encyclopedia | 1763, with Pontiac's treaty in 1766. Confirmed. |
| `ev-north-west-resistance` | The Canadian Encyclopedia | 1885, opening at Duck Lake on 26 March. Confirmed. |
| `ev-battle-of-the-thames` | The Canadian Encyclopedia | 5 Oct 1813, and Tecumseh was killed. Confirmed. |
| `ev-expulsion-of-the-acadians` | The Canadian Encyclopedia | About 10,000 were deported in 1755–1763/64. Confirmed. |
| `ev-norse-at-lanse-aux-meadows` | Kuitems et al., Nature (2021) via Science News/NPR | The 1021 tree-ring date is confirmed. |
| `ev-halifax-explosion` | Britannica; Nova Scotia Archives | About 2,925 t of explosives, roughly 2,000 deaths (estimates run 1,650–2,000) and about 9,000 injured. Within range. |
| `ev-pueblo-revolt` | New Mexico History; LOC Law blog | 10 Aug 1680, about 400 killed, 21 of them friars. Confirmed. |
| `ev-cherokee-syllabary` | Britannica; History.com | Completed 1821 with 86 characters and adopted 1825. Confirmed. |
| `ev-klondike-gold-rush` | Parks Canada Discovery Claim; Canadian Mysteries | Gold was found on Bonanza (Rabbit) Creek in Aug 1896 by Keish, Dawson Charlie and Carmack. Confirmed. |
| `ev-persons-case` | The Canadian Encyclopedia; Britannica | The Supreme Court ruled in 1928 and the Privy Council on 18 Oct 1929. Confirmed. |
| `ev-trail-of-tears` | Web search (partial) | 1838–39 dates confirmed. The figures of about 16,000 removed and 4,000 dead were not re-found this pass; they are the commonly cited estimate (NPS) and are retained. |
| `ev-wounded-knee-massacre` | World History Encyclopedia; History.com | 29 Dec 1890, with about 250–300 Lakota dead. Confirmed. |
| `ev-red-river-war` | EBSCO Research Starters; Texas Monthly | The war ran 1874–75, Palo Duro was fought on 28 Sep 1874, and Quanah surrendered on 2 Jun 1875. Confirmed. |
| `person-leif-erikson` | Mariners' Museum; Britannica Kids | Born c. 970. Disputed against Wikidata's 972. |
| `person-louis-riel` | The Canadian Encyclopedia; Manitoba government | Born 1844 at Red River, led the provisional government from Dec 1869 and was hanged at Regina on 16 Nov 1885. Confirmed. |
| `person-sitting-bull` | NPS Little Bighorn; ND Studies | Wood Mountain 1877, Fort Buford 1881, the Wild West show 1885 and death on 15 Dec 1890 are confirmed. **Fixed**: the birthplace label no longer says "Dakota Territory", which did not exist in 1831. |
| `person-sacagawea` | History.com; Biography.com | Fort Mandan in 1804–05, the reunion with Cameahwait in Aug 1805 and death at Fort Manuel in Dec 1812 are confirmed. The Wyoming tradition is a minority view. |
| `person-harriet-tubman` | NPS; National Archives | Combahee raid of 1–2 Jun 1863, which freed about 750. Confirmed. |
| `person-quanah-parker` | EBSCO; Britannica | Surrendered at Fort Sill in June 1875. Confirmed. |
| `place-iqaluit` | The Canadian Encyclopedia; City of Iqaluit | US base built in 1942; residents voted in 1984 for the 1 Jan 1987 rename; the name means "place of many fish". Confirmed. |
| `place-kingston` | The Canadian Encyclopedia; Kingston timeline | Fort Frontenac in 1673, Loyalists in the 1780s and capital in 1841–44. Confirmed. |
| `place-sitka` | Britannica; City of Sitka | Novo-Arkhangelsk in 1804, capital of Russian America from 1808 and US capital until 1906. Confirmed. |
| `place-nuuk` | Nuuk history sources | **Fixed**: the summary had credited Egede with the 1728 founding. Governor Claus Paarss moved the colony to the mainland as Godthåb; the note records that some sources credit Egede. |
| `place-los-angeles` | El Pueblo Historical Monument; History of LA sources | Founded 1781 by 44 settlers of largely African, Indigenous and mixed descent, beside Yaanga. Confirmed. |
| `polity-republic-of-texas` | TSHA Handbook of Texas | Presidents Burnet, Houston, Lamar, Houston and Jones; government handed over on 19 Feb 1846. Confirmed. |
| `polity-new-france` | Governor lists (ULaval CEFAN) | Frontenac 1672–82 and 1689–98, Vaudreuil 1703–25, Vaudreuil-Cavagnial 1755–60. Beauharnois ended in 1746 or 1747 (sources differ), within tolerance. |
| `polity-new-netherland` | NY Courts history; Archontology | Minuit 1626–31, van Twiller 1633–38, Kieft 1638–47, Stuyvesant 1647–64. Confirmed. |
| `polity-cherokee-nation` | Cherokee Nation; Gaston Litton (Chronicles of Oklahoma) | Little Turkey 1794–1801 and John Ross in office in the 1830s–40s confirmed. Pathkiller's and Downing's dates were only partly checked. |
| `polity-russian-america` | Britannica (Sitka); NPS Sitka | Capital moved to Novo-Arkhangelsk in 1808 (Britannica's Alaska history says Kodiak until 1806). Within tolerance. |
| `polity-norse-greenland` | Hvalsey sources; Garðar diocese sources | Bishopric 1124/1126, Norwegian overlordship 1261, Hvalsey wedding 16 Sep 1408. Confirmed. |
| `polity-comancheria` | EBSCO; Texas Monthly | Independence ended with the June 1875 surrender. Confirmed. The 1706 first record was not re-found and is retained from Hämäläinen. |
| `polity-powhatan` | Virginia Places; EBSCO | Attacks of 1622 and 1644, Opechancanough captured in 1646, and Necotowance's treaty of October 1646. Confirmed. |
| `polity-haudenosaunee` | The Canadian Encyclopedia | Founding date is disputed. Low confidence with a note. |

## 3. Corrections made during verification

- **`place-nuuk`.** The summary said Hans Egede founded Godthåb in 1728. It now credits governor Claus Paarss with the 1728 move to the mainland, and the note says some sources credit Egede.
- **`person-sitting-bull`.** The birthplace label said "Dakota Territory", which was anachronistic for 1831 (the territory was created in 1861). It is now "present-day South Dakota".
- **Notes added.** `ev-etowah-mounds`, `ev-moundville` and `ev-spiro-mounds` were medium-confidence records with no note. Each now has a note on how its archaeological dates were derived.
- **Broken URLs.**
  - Every non-Wikipedia source URL was requested with curl.
  - 18 broken links (404) were replaced with working pages, for example Canadian Encyclopedia slugs such as `north-west-rebellion`, `iroquois-wars` and `peace-of-montreal-1701`, and NPS park home pages.
  - Three URLs with no working equivalent were removed, keeping the source title.
- **Corrections made while drafting**, before the records were saved. These include:
  - Mayflower Separatists were about a third of the passengers.
  - Pueblo Revolt executions.
  - Halifax explosives figure: nearly 3,000 t.
  - Persons Case pinned at Edmonton.
  - Riel's asylum and exile years.
  - Oppenheimer's PhD year (1927).
  - Pickett's Charge distance.

## 4. Known limits

- **Britannica URLs were not confirmed.** About 160 britannica.com URLs return 403 to scripted requests, so their slugs could not be checked automatically. They are standard topic/place/event/biography slugs.
- **Some sites timed out or errored:** natmus.gl, encyclopediavirginia.org, washingtonpapers.org and naalakkersuisut.gl.
- **Pre-contact dates are low or medium confidence.** This covers Hopewell, Hohokam, Chaco, Cahokia/Mississippian, the Great Law and Lakota origins, and each of these records carries a note.
- **Rulers of non-state peoples are prominent leaders.** For the Haudenosaunee, Comanche and Lakota, the "rulers" are spokesmen and war or peace chiefs with approximate dates of prominence, not monarchs.

## 2026-11 review

Independent reviewer: fact-checking agent, PR #23. Commits `c038f87` (corrections) and `08ca2bb` (additions).

### Sample and method

- **110 of 203 records (54%) were checked against retrieved sources**, 102 of them outside the curator's 42-record spot-check. The other 8 were rechecked for the Indigenous-history priority: `ev-haudenosaunee-great-law`, `ev-king-philips-war`, `ev-trail-of-tears`, `ev-wounded-knee-massacre`, `ev-klondike-gold-rush`, `place-iqaluit`, `polity-haudenosaunee` and `polity-comancheria`.
  - 64 events: colonial era through the 2000s, including `ev-beaver-wars`, `ev-pequot-war`, `ev-first-africans-in-virginia`, `ev-loyalist-migration`, `ev-red-river-resistance`, `ev-japanese-american-incarceration`, `ev-october-crisis` and `ev-creation-of-nunavut`.
  - 21 people, 8 places and 5 polities, among them `polity-lakota`, `polity-haudenosaunee` and `polity-comancheria` with their leader lists.
- **All 98 stories were read in full**, along with their zh text where a fix touched it.
- **What the claims were checked against.** Each claim was compared with pages retrieved in this review via WebSearch or WebFetch, never with memory:
  - NPS park and history pages, the Library of Congress, the National Archives and the Smithsonian
  - the Dictionary of Canadian Biography, The Canadian Encyclopedia (snippets, since the site blocks fetches) and Parks Canada
  - TSHA Handbook of Texas, Encyclopedia Virginia, Monticello and Mount Vernon
  - DOE and LANL, USGS, the King Institute, the NCTR and university pages
  - Britannica, via search snippets only
- **Cross-dataset overlap.** No North America QID duplicates a record in any other dataset branch.
  - Mesoamerica's Q128160 (Cuban Missile Crisis) and Q12583 (Spanish–American War) are not used here.
  - The Mexican–American War appears only here.
  - Pearl Harbor and Cook's voyages are left to Oceania.

### Corrections (old → new)

| Record | Old | New | Reason / source |
| --- | --- | --- | --- |
| `ev-hopewell-earthworks` | Newark circle + octagon "some fifty hectares" | about 28 ha | Octagon about 50 acres + circle about 20 acres (Ohio History Connection) |
| `ev-founding-of-jamestown` | starving time "about 300 to some 60" | most died; about 60 alive in spring 1610, note on 250–500 | Starting figure disputed (Historic Jamestowne) |
| `ev-trail-of-tears` | Jackson "ignored the ruling"; "thirteen overland detachments" | "did nothing to enforce it"; "more than a dozen, most overland" | Worcester v. Georgia did not require enforcement action; some parties went by water (NPS Trail of Tears) |
| `ev-battle-of-the-little-bighorn` | 1980 Court "ruled the seizure illegal" | land taken without just compensation; damages refused, Lakota seek the Black Hills | United States v. Sioux Nation (1980) |
| `ev-klondike-gold-rush` | "largest city in western Canada"; "perhaps 30,000" | "largest Canadian community west of Winnipeg"; 16,000–30,000, with a note | NWMP count of July 1898 |
| `ev-september-11-attacks` | both towers down "within an hour and a half" | "within an hour and three-quarters" | North Tower fell 102 min after impact (9/11 Commission Report) |
| `ev-pearl-street-station` | "85 customers" | "several dozen", with a note | Sources give 59–85 |
| `ev-serpent-mound` | note "Fagan et al. (1996)" | "Fletcher et al. (1996)" | Author of the 1996 radiocarbon study |
| `ev-king-philips-war` | wife and son "sold into slavery in the West Indies" | son probably shipped to Bermuda; wife's fate uncertain | Sources disagree; overstated certainty |
| `ev-wounded-knee-massacre` | medals "long asked to be rescinded" | adds the 2025 Defense Department decision to keep them | Missouri Independent / States Newsroom, 26 Sep 2025 (source added) |
| `ev-residential-schools` | "a figure research continues to raise" | NCTR has since recorded more than 4,000 | NCTR memorial register |
| `polity-confederate-states` | "Eleven slave states seceded after Lincoln's election" | seven, then four more after Fort Sumter | Standard chronology (NPS) |
| `person-tecumseh` | birthplace stop | Scioto valley near Chillicothe (39.33, -82.98), with a note on Old Piqua | Disputed birthplace |
| `person-knud-rasmussen` | "some 18,000 kilometres" | distance removed | Not confirmed by any retrieved source |
| `place-iqaluit` | "US Air Force base in 1942" | US Army Air Forces | USAF created only in 1947 |
| `place-quebec-city` | "beside the Iroquoian village of Stadacona" | "near the site of the vanished… Stadacona" | Stadacona was gone by 1608 (DCB) |
| `ev-ozette-mudslide` | note "c. 1700; some say c. 1750" | c. 1700 usual; range c. 1560 (radiocarbon) to c. 1750 | Published dates vary |
| `polity-lakota` | QID Q4421193, name "Lakota" | Q333049, "Lakota (Teton Sioux)", note on the Oceti Sakowin | The old QID was not the Lakota people |
| `polity-haudenosaunee` | zh ruler names | 约瑟夫·布兰特（塔延达尼加）, 种玉米者（塞内卡） | Consistent zh naming |
| `ev-election-of-barack-obama` | zh 巴拉克 | 贝拉克 | Standard Xinhua form |
| `ev-hudsons-bay-company-chartered` | "survives today as one of the oldest companies" | 2025 creditor protection and store closures; "Toronto head office" dropped from note | BNN Bloomberg (source added), Retail Insider |
| `ev-french-and-indian-war` | "Horace Walpole later wrote…" | "A line later attributed to Horace Walpole, probably wrongly…" | J. L. Bell, Boston 1775: phrase not in Walpole's letters |
| `ev-mesa-verde-cliff-dwellings` | last beams "late 1270s" | "early 1280s" | NPS tree-ring page (1281); repair beam of 1282 |
| `ev-chaco-canyon-great-houses` | Pueblo Bonito builders carried 200,000 beams up to 80 km | estimate is for all great houses; 75–80 km | Smarthistory; NM Architecture Guide |
| `ev-salem-witch-trials` | "several judges… repented" | "the judge Samuel Sewall"; note on 150–200+ accused | Sewall alone apologised (14 Jan 1697) |
| `ev-first-africans-in-virginia` | dead Encyclopedia Virginia URL | `/entries/africans-virginias-first/` | 404 |
| `ev-founding-of-montreal` | — | note on 17 May landing / 18 May Mass | The Canadian Encyclopedia gives both |
| `ev-bering-chirikov-reach-alaska` | — | note that dates are Old Style | NPS landing-site NHL report |
| `ev-purchase-of-manhattan` | "Director Peter Minuit"; "a 19th-century historian"; "a visitor in the 1640s" | "traditionally identified as Peter Minuit"; "19th-century writers"; Isaac Jogues 1643 | Schagen letter names no buyer; Jogues' account |
| `place-new-york` | names 1776–1785 British; "first US capital 1785–1790" | 1776–1783 British-occupied, 1783–1785 State of New York; Confederation seat from 1785, first capital under the Constitution 1789–90 | British evacuation 25 Nov 1783 |
| `place-toronto` | name "first applied to the Seneca village of Teiaiagon" | name from the weirs at the Narrows, spread down the Carrying-Place | Ramara Historical Society; TCE |
| `place-chicago` | name "Fort Dearborn" for 1803–1833 | "Chicago (settlement at Fort Dearborn)" | Encyclopedia of Chicago |
| `place-san-francisco` | 1847– United States | 1847–1848 US-occupied Mexico, 1848– United States | Treaty of Guadalupe Hidalgo |
| `person-pope` | death c. 1688 | note c. 1688–1692 | Britannica (1692), encyclopedia.com (c. 1690) |
| `person-joseph-brant` | 1776 stop "presented to George III" | presses Mohawk grievances with Lord Germain; note on 1742/43 birth | DCB, Thayendanegea |
| `person-alexander-graham-bell` | 1880 Volta Laboratory; 1886 builds Beinn Bhreagh | 1881 Volta Laboratory; 1885 first visit to Baddeck | LOC; Parks Canada |
| `person-franklin-d-roosevelt` | "paralysed by polio"; Atlantic Charter at (47, -53) | "an illness diagnosed as polio"; Argentia (47.30, -53.99); Guillain-Barré note | Goldman 2003; FRUS 1941 |
| `person-rene-levesque` | 1968 PQ stop at Montréal; WWII stop | Québec City; US Office of War Information, London | DCB, Lévesque |
| `person-hernando-de-soto` | — | note on the disputed site of Guachoya | NPS; Encyclopedia of Arkansas |
| `person-ulysses-s-grant` | Mount McGregor at (43.07, -73.73) | (43.201, -73.746) | Grant Cottage location |
| `person-john-a-macdonald` | 1886 CPR stop at Vancouver | Port Moody (49.283, -122.857) | City of Vancouver Archives |
| `person-pocahontas` | 1616 "meets James I" | arrives 1616; received at court January 1617 | UK National Archives blog |
| `person-abraham-lincoln` | "about a year" of school; "272 words" | "less than a year"; "about 270 words" | NPS; copies vary 271–272 |
| `person-louis-armstrong` | 1956 "world tour" | plays in Accra, Gold Coast (filmed by CBS) | Georgetown University Library |
| `ev-nineteenth-amendment` | Tennessee "made it law" | decisive 36th state; certified 26 August | NPS, Harry T. Burn |
| `ev-japanese-american-incarceration` | unquoted commission phrase | quoted and attributed to CWRIC (1983) | Verbatim phrase |
| `ev-trinity-test` | about 21 kt | about 25 kt, with a note (18.6 / 21 / 24.8 ± 2 kt) | LANL 2021 reanalysis |
| `ev-brown-v-board` | D.C. case "joined" | Bolling v. Sharpe a companion case | National Archives |
| `ev-march-on-washington` | "King spoke last" | "the last major speaker" | Randolph and Mays followed |
| `ev-apollo-11` | Smithsonian source had a nasa.gov URL | airandspace.si.edu command-module page | Duplicate URL |
| `ev-october-crisis` | "nearly 500 detained without charge"; note "both kidnappings in Montréal" | 450–500 arrested, most released without charge; Laporte taken in Saint-Lambert | historyofrights.ca; Legion Magazine |
| `ev-greenland-home-rule` | 2009 transferred "mineral resources and the police" | minerals from 2010; policing and justice only in principle | LOC Law blog; Self-Government Act Schedule II |
| `ev-quebec-referendum-1995` | "charismatic"; "some 100,000"; "support has not since come close" | removed; "tens of thousands"; "no further referendum has been held" | Evaluative or unsourced |
| `person-la-salle` | "returning by sea in 1685 … some 300" | sailed 1684 with about 320; landed early 1685 | DCB |
| `ev-1906-san-francisco-earthquake` | "founded modern earthquake science" | "laid foundations of" | Overstatement |
| `ev-louisiana-purchase` | Barbé-Marbois made the offer | Talleyrand asked on 11 April; Barbé-Marbois negotiated | Monticello |
| `ev-erie-canal-opens` | news in "about 90 minutes" | "about 80 minutes" | Sources give 81 min |
| `ev-shermans-march-to-the-sea` | Sherman entered and telegraphed on 21 Dec | troops occupied 21 Dec; telegram 22 Dec | American Battlefield Trust |
| `ev-loyalist-migration` | "some 14,000" at Saint John | about 10,000 by end of 1783 | Parks Canada; no source for 14,000 |
| `ev-alaska-purchase` | "mocked as Seward's Folly"; "Newspapers mocked" | "later remembered as…"; "Some newspapers" | Hill, Western Historical Quarterly (2019) |
| `ev-ellis-island-opens` | "four in ten" | "an estimated 40 percent"; note on Annie Moore's age | NPS archive; ellisisland.org |
| `ev-declaration-of-independence` | Jefferson "sulked" | "resented" | Editorial wording |
| `ev-emancipation-proclamation` | "hand trembled" | "arm nearly numb" | Lincoln's own account |

### Additions (8 records and 1 story; each has at least 2 sources)

- **`ev-sand-creek-massacre`** (Q2164344, 1864, story). Sources: NPS Sand Creek timeline and the Silas Soule page, the Sand Creek Massacre Foundation, and the Northwestern John Evans Committee report (2014). The casualty range is given in a note.
- **`ev-carlisle-indian-school`** (Q5041396, 1879–1918, story). This is the first record for the US boarding-school system. Sources: Dickinson's Carlisle Indian School Digital Resource Center, the Interior Department's Federal Indian Boarding School Initiative report (vol. II, 2024), NABS and Spotlight PA.
- **`ev-1862-smallpox-epidemic`** (Q2100118, story, medium confidence). Sources: UVic's Victoria's Victoria, HistoryLink, Maclean's, and Boyd (1999). The death toll is given in a note as an estimate.
- **`ev-nootka-crisis`** (Q1648404, 1789–1790). Sources: the DCB entries for Martínez, Muquinna and Colnett.
- **`ev-vancouver-expedition`** (Q3044451, 1791–1795, with a route). Sources: DCB, Vancouver, and Vancouver's own *Voyage* (1798).
- **`ev-indian-act`** (Q1516058, 1876). Sources: The Canadian Encyclopedia (Indian Act; Potlatch) and the Justice Laws text.
- **`ev-2008-financial-crisis`** (Q896666, story). Sources: Federal Reserve History (two essays) and the FCIC report (2011).
- **`person-alexander-mackenzie`** (Q319657, 1764–1820, with stops). Sources: DCB and BC Parks.
- **New story for `ev-truth-and-reconciliation-commission`.** Sources: an NCTR history page (added) and the existing TCE source.

After these changes, `validate-data` gives 0 errors and 0 warnings. `wd.mjs enrich` fetched 9 new QIDs, and `build-data` reports 50 north-america diffs with 0 unresolved; the additions created no new diffs.

### Left for a human

- **Not confirmed by any retrieved source.** These are still in the records:
  - Hamilton leading the American assault on Redoubt 10 (`ev-siege-of-yorktown`)
  - Antony and Isabella's son William (`ev-first-africans-in-virginia`)
  - the Van Horne "in earnest only in 1881" date (`ev-canadian-pacific-last-spike`)
  - the 1821 Sequoyah demonstration site and the move west, for which sources give 1822–1825
- **Hudson's Bay Company status** was current as of March 2026 (still under court protection). Recheck it before release.
- **`ev-rise-of-cahokia` calls Cahokia the largest city in what is now the US "before the 1780s".** That holds only for the upper population estimates (about 20,000).
- **Buffalo Hump's death date** (`polity-comancheria` leaders) varies between c. 1867 and 1870 across sources.
- **Further gaps:** the 1500s are still thin outside Spanish expeditions, the Subarctic has no record of its own, and a fuller Haida or Nuu-chah-nulth record would be worth adding.

## 2026-11 completion check (web-sourced)

Checker: fact-checking agent, PR #23, after the review above. This check covers every record that neither the curator's spot-check (§2) nor the 2026-11 review had named. It also resolves the review's open doubts.

### Scope and method

- **97 records were checked**: the 96 that nobody but the curator had seen (58 events, 18 people, 8 places, 12 polities), plus the re-read TRC record.
- **Every date, stop, name range, ruler span, number and summary/story claim** was compared with pages retrieved in this check via WebSearch or WebFetch, never with memory.
- **Sources used:**
  - NPS park and history pages, NPS Historical Handbooks, the National Archives, the Library of Congress, the US Census Bureau, USGS and the State Department Office of the Historian
  - The Canadian Encyclopedia, the Dictionary of Canadian Biography, Parks Canada and Library and Archives Canada
  - the Manitoba Historical Society, the City of Winnipeg and the Montréal city archives
  - Mount Vernon, Monticello, the King Institute and the Atomic Heritage Foundation
  - the Encyclopedia of Alabama, the Encyclopedia of Oklahoma History, the New Georgia Encyclopedia, the Wisconsin Historical Society and the Handbook of Texas
  - American Battlefield Trust, Élections Québec, UCLA, NASA and Purdue
  - Retail Insider and the court filings of the Hudson's Bay monitor (Alvarez & Marsal)
  - Wikipedia, always alongside a second source
  - Britannica, through search snippets only
- **Rename.** `ev-truth-and-reconciliation-commission` (Canada, Q6021399) is now `ev-truth-and-reconciliation-commission-canada`. The Africa dataset uses the old id for South Africa's TRC (Q373032). No resolution or auto-diff key referred to the old id. Mentions of the old id earlier in this report are historical.

### Result

- **49 of the 96 records (51%) needed a correction.**
  - About 20 were substantive: wrong facts, counts or attributions.
  - The rest were overstated certainty, anachronistic labels, or pins several kilometres off.
- **No systemic error was found**, and no year or QID changed in a way that creates a new auto-diff.

| Record | Old | New | Source |
| --- | --- | --- | --- |
| `ev-thule-migration` | "4,000 kilometres to the east"; route start "Birnirk homeland" | "thousands of kilometres"; "Thule origins (Birnirk area)" | Friesen & Arnold 2008; TCE (Thule culture) |
| `ev-end-of-norse-greenland` | wedding "letters they later carried home" | wedding documents written in Greenland, confirmed by witnesses in Iceland | Hvalsey sources; Nunatsiaq News |
| `ev-coronado-expedition` | lands "left alone by Spain for half a century" | "no attempt to settle" them | Chamuscado–Rodríguez (1581) and Espejo (1582) entries |
| `ev-mayflower-and-plymouth` | Separatists "first fled to Leiden" | fled to the Netherlands, settled in Leiden | Pilgrim Hall; Plimoth Patuxet |
| `ev-founding-of-new-orleans` | "passed to Spain in 1763" | ceded in 1762–63 | 64 Parishes; American Battlefield Trust |
| `ev-lexington-and-concord` | "minutemen" on Lexington Green | the town militia | NPS Minute Man; American Battlefield Trust |
| `ev-american-revolutionary-war` | Delaware crossing "the night after Christmas" | Christmas night | American Battlefield Trust (Trenton) |
| `ev-texas-revolution` | Anglo settlers outnumbered Tejanos "many times over"; Goliad "about 340" | perhaps four to one; more than 340 | Almonte's 1834 report; TSHA; American Battlefield Trust |
| `ev-california-gold-rush` | "Swiss-born" Sutter; Brannan "within weeks"; Native population "150,000 in 1846" | Swiss emigrant (born in Baden); "in May"; 1848 | HLS-DHS-DSS; Smithsonian; LOC |
| `ev-american-civil-war` | Antietam: 23,000 "killed or wounded" | killed, wounded or missing | American Battlefield Trust |
| `ev-canadian-confederation` | Canadians "arrived uninvited" at Charlottetown | had asked to attend; champagne "it is said" | LAC; Britannica snippet |
| `ev-first-transcontinental-railroad` | tunnelling "a few centimetres a day"; Stanford missed the spike | about 15–35 cm a day; "by some accounts" | PBS American Experience; Utah History to Go |
| `ev-great-chicago-fire` | "about 300" dead; "100,000 homeless" | an estimated 300; 90,000–100,000 | History.com; National Geographic |
| `ev-numbered-treaties` | pin 50.15, −96.88 | Lower Fort Garry (50.112, −96.932) | TCE (Treaties 1 and 2) |
| `ev-chinese-exclusion-act` | "the first US law to bar immigrants by nationality" | "the first major" such law (the Page Act came in 1875) | National Archives |
| `ev-wall-street-crash-and-depression` | tariff "helped cut world trade by about two thirds" | added to a collapse; trade fell by about two thirds in value, 1929–34 | State Dept Office of the Historian |
| `ev-dust-bowl` | SCS planted shelterbelts; "200,000 or more" Okies; dust on the Capitol during Bennett's testimony; "farm families" | Forest Service planted shelterbelts; more than 250,000, many from outside the Dust Bowl; Bennett story hedged; "people" | Oklahoma Historical Society; NWS Norman |
| `ev-patriation-and-charter` | Indigenous lobbying "in London" won s. 35; ministers' kitchen compromise "overnight" | dropped in November, restored with "existing" after protests and lobbying; three justice ministers sketched it, and the delegations finished it overnight | Canada's History; UBCIC; Nov 1981 motion |
| `ev-hurricane-katrina` | note "about 1,200 to over 1,800" | NHC 2023 revision: 1,392 (520 direct) | Fox Weather / WGNO on the NHC update |
| `ev-ipiutak-point-hope` | "more than 600" house pits; Scytho-Siberian link stated as fact; "one of the oldest continuously occupied" | 500–600; attributed to Larsen and Rainey, "treated with caution"; "often described as" | NPS Cape Krusenstern; EBSCO |
| `ev-kolomoki-mounds` | "one of the most populous" | "perhaps one of" | New Georgia Encyclopedia |
| `ev-effigy-mounds` | "some 200 survive" (implying effigies) | more than 200 mounds, 31 of them effigies; the note gives date ranges of 650–1200 | NPS; Wisconsin Historical Society |
| `ev-etowah-mounds` | "seated man and woman"; de Soto's "visit" | cross-legged man and kneeling woman; Itaba identification debated | Etowah sources |
| `ev-moundville` | "32-hectare plaza"; necropolis "by c. 1450" | "large central plaza" (no figure found); necropolis after c. 1300 | Encyclopedia of Alabama |
| `ev-spiro-mounds` | "one dealer" blew up the mound; goods "from the Rockies" | the diggers blasted the chamber; goods from "as far as Mexico" | Encyclopedia of Oklahoma History |
| `person-erik-the-red` | "twice exiled, first to Iceland"; Thorsnes pin in Dalir | went to Iceland with his exiled father; later outlawed himself; Þórsnes (65.06, −22.72) | Saga summaries; Erik the Red sources |
| `person-jacques-cartier` | "nine-metre cross"; Charlesbourg-Royal pin | about 10 m (30 ft); Cap-Rouge (46.748, −71.341) | Parks Canada; DCB (Donnacona) |
| `person-samuel-de-champlain` | "governed the colony" | led it, from 1633 as Richelieu's lieutenant; note on the 1574 baptism record; Port-Royal pin moved | Canadian Museum of History |
| `person-benjamin-franklin` | 1752 stop "Kite experiment; Poor Richard's Almanack" | kite experiment only (the Almanack dates from 1732) | Founders Online |
| `person-sequoyah` | "Tuskegee in Tennessee"; Horseshoe Bend pin; "Indian Territory" in 1829; death pin at Piedras Negras | present-day Tennessee; battlefield pin; Cherokee Nation West; San Fernando de Rosas | NPS Horseshoe Bend; Encyclopedia of Alabama |
| `person-william-t-sherman`, `person-martin-luther-king-jr`, `person-neil-armstrong` | pins at Durham, Court Square and downtown Cincinnati | Bennett Place, Dexter Avenue church, Fairfield (Ohio) | NC Historic Sites; Space.com |
| `person-mark-twain` | 1874 "writes his major novels at Hartford" | moves into the Hartford house (much of the drafting was done at Elmira) | Mark Twain Study (Elmira) |
| `place-montreal` | Hochelaga 1535–1642; New France to 1763; "French missionaries"; capital "until 1849" | Hochelaga to 1600, then no town until 1642; British military rule 1760–63; lay colonists under Maisonneuve and Mance; capital 1844–49 | Montréal city archives; TCE |
| `place-winnipeg` | Fort Garry 1822–70 flagged as capital of Rupert's Land; 1870–73 not a capital | seat of the District of Assiniboia; capital of Manitoba from 1870; note on Fort Douglas (c. 1813–15) | Manitoba Historical Society; City of Winnipeg |
| `place-detroit` | "British (Quebec, then Upper Canada)" from 1760 | military post; Quebec from 1774; Upper Canada from 1791 | Detroit Historical Society |
| `place-halifax` | "the main North Atlantic base of the Royal Navy" | a principal base, station headquarters until 1819 | Nova Scotia Archives; Parks Canada |
| `place-new-orleans`, `place-ottawa` | — | notes: Spanish officials arrived only in 1766; the name Bytown dates from 1827 | LOC; Ottawa city documents |
| `polity-nuevo-mexico` | Oñate to 1610; Otermín from 1677 | 1608; 1679, titular to 1683 | List of Spanish governors of New Mexico |
| `polity-hopewell` | flourished "1 to 500"; note "clipped to the atlas range" | 1–400 (NPS), some to 500; note corrected | NPS Hopewell Culture NHP |
| `polity-hohokam`, `polity-mississippian-cahokia` | confidence low | medium (approximate archaeological dates, not legend, per SCHEMA); Cahokia's estimate range and the Etowah and Moundville end dates corrected | NPS; Encyclopedia of Alabama |
| `polity-united-states`, `polity-british-north-america`, `polity-tecumseh-confederacy`, `polity-danish-greenland` | Wikidata "1784"; "New York and Philadelphia"; capitals lacked Ottawa, Greenville and Håbets Ø | both Wikidata inceptions; "several cities"; Ottawa from 1866; Greenville, then Prophetstown from 1808; Godthåb from 1728 | Wikidata API; Senate (nine capitals); TCE (Tenskwatawa); worldstatesmen |

### The reviewer's open doubts

| Doubt | Finding | Change |
| --- | --- | --- |
| Hamilton at Yorktown (`ev-siege-of-yorktown`) | **Confirmed.** Lt. Col. Hamilton led about 400 of Lafayette's light infantry against Redoubt 10, which fell in about ten minutes (NPS Historical Handbook 14; Army Heritage Center; American Battlefield Trust). | Wording made precise and the NPS handbook added as a source |
| Antony and Isabella's son (`ev-first-africans-in-virginia`) | **Supported by the 1624 census.** It lists "Antoney", "Isabell" and "William theire child baptised" in Capt. William Tucker's household at Elizabeth City. Which ship brought the parents is unknown (NPS ethnography; BlackPast). | The story now cites the census and the Tucker household and states the uncertainty; BlackPast added |
| Van Horne's "1881" (`ev-canadian-pacific-last-spike`) | **Wrong.** The syndicate took over in 1881, but Van Horne became general manager in January 1882, after a poor 1881 season of about 130 miles (TCE; DCB; Manitoba Historical Society). | Fixed; DCB added |
| Sequoyah's dates (`person-sequoyah`) | **The 1821 demonstration** was before the Cherokee National Council, at Sauta, Jackson County, Alabama, according to the Encyclopedia of Alabama. The old pin was at the later New Echota. **The move west** is dated 1822, 1823 or 1824 in different references; 1824 follows the Oklahoma Historical Society and SNAC. | Stop moved and relabelled "by one account"; 1824 kept, with the range given in the note; two sources added |
| HBC in 2025–26 (`ev-hudsons-bay-company-chartered`) | **Liquidated.** It filed for CCAA on 7 March 2025, closed its last stores on 1 June 2025, and sold its trademarks and stripes, but not the Royal Charter, to Canadian Tire. The court approved the sale on 3 June 2025 for about C$30 million. Monitor filings show a court-supervised wind-down still running in July 2026. | Story updated; Retail Insider added |
| Cahokia "largest city" (`ev-rise-of-cahokia`) | **Holds only on the top estimates.** The 1790 census counted 44,096 in Philadelphia and its suburbs (28,522 in the city proper), so Cahokia outranks every later US city before c. 1790 only on the top estimate of about 40,000. At the usual 10,000–20,000 it was the largest town north of Mexico, but Philadelphia passed that size earlier. | Summary reframed, census figure added to the note, Census Bureau source added |

### Left open

- **Claims searched for and not confirmed.** All are hedged or plausible and were left in place:
  - Coronado's paraphrase that the friar "told the truth about nothing"
  - the St. Augustine feast-day sighting
  - "about 40,000" boycotters in Montgomery
  - the Dow having "nearly quadrupled since 1924"
  - Spiro's Great Mortuary "around 1400"
  - the jet-inlaid Ipiutak mask eyes
  - George III's remark on Washington (already marked "reportedly")
- **Buffalo Hump's death year** (`polity-comancheria`) is still c. 1867–1870, from the review.
- **A dozen Wikipedia-only checks.** These include Trudeau's biography and the Oñate/Otermín terms. Each agrees with the existing or corrected value, but none has a second source.

## 2026-11 story verification (web-sourced)

Every claim in each story was checked against pages retrieved during this pass, never from memory. Midway through, the WebSearch quota ran out, so most checks used WebFetch: en, fr, es and ru Wikipedia, NPS, DCB, USGS, NARA, OHS and others. Claims that no retrieved page supports were softened, or, where minor and standard, logged as open.

**Method:**
- **Priority (8 stories):**
  - the 5 stories added after the review: TRC Canada, 1862 smallpox, Sand Creek, Carlisle and the 2008 crisis
  - 3 stories rewritten in the completion check: first Africans in Virginia, HBC and the CP last spike
- **Sample (30 stories):** the remaining 94, sorted by id, were shuffled with mulberry32, seed 20261116, and the first 30 taken.
- **Sample result:** 18 of 30 (60%) had a claim contradicted by a retrieved source, and 24 of 30 (80%) needed an English change. That is above the 25% threshold, so the other 64 stories were checked too.

**Result:**

| Set | Stories | Contradicted claim | Any en change | Clean |
|---|---|---|---|---|
| Priority | 8 | 2 | 3 (+1 zh-only) | 4 |
| Sample | 30 | 18 (60%) | 24 | 6 |
| Remainder | 64 | 25 | 50 (+1 zh-only) | 13 |
| **All** | **102** | **45 (44%)** | **77 (75%)** | **23** |

In all, 282 substring edits were made in story and summary, en and zh; every en change is mirrored in zh. **Other change:** the ev-sand-creek-massacre note now gives the NPS figure of about 230 killed; the old note said 165–200 (NPS Sand Creek history page). **Current-status check:** the Quebec 1995 story now notes that the PQ won the 5 October 2026 election, as a minority with 60 of 127 seats, and has promised a referendum, not before 20 January 2029 (en.wikipedia: 2026 Quebec general election, fetched 2026-11-16).

### Sources and corrections per story

#### Priority

**ev-first-africans-in-virginia** — sources: Encyclopedia Virginia: Africans, Virginia's First; Wikipedia: White Lion (ship); Wikipedia: William Tucker (Virginia colony) (via search snippets).
- story (wrong): “The 1624 census lists a couple” → “The muster of 1624–25 lists a couple”. Encyclopedia Virginia: the February 1624 census lists Antony and Isabella in Tucker's household but no William; the baptised son William first appears in the 1624/25 muster. [https://encyclopediavirginia.org/entries/africans-virginias-first/]
- Open: The 'nearly four million enslaved by 1860' figure (census: about 3.95 million) was not re-fetched; it is standard. The Wikipedia White Lion article gives 24 captives sold; Rolfe's '20 and odd' is the primary wording and is kept.

**ev-hudsons-bay-company-chartered** — sources: Wikipedia: Hudson's Bay Company; Wikipedia: Médard des Groseilliers; Dictionary of Canadian Biography: Chouart des Groseilliers, Médard; Wikipedia: Pierre-Esprit Radisson; Wikipedia: Prince Rupert of the Rhine; Wikipedia: Charles II of England.
- zh: Groseilliers married Radisson's half-sister Marguerite Hayet, a widow already in 1653 when Radisson (b. 1636 or 1640) was a teenager, so she was the elder sister: 姐夫, not 妹夫.; Rupert (b. 1619) was older than Charles II (b. 1630): 表兄, not 表弟.
- Open: 'sold Rupert's Land to the new Dominion' simplifies a surrender to the Crown and transfer to Canada with £300,000 compensation; acceptable shorthand.

**ev-canadian-pacific-last-spike** — sources: Wikipedia: Canadian Pacific Railway; Wikipedia: Last spike (Canadian Pacific Railway); Dictionary of Canadian Biography: Van Horne, Sir William Cornelius; Wikipedia: Andrew Onderdonk; Wikipedia: Eagle Pass (British Columbia).
- story (unsupported): “Asked for a speech, Van Horne said only that” → “Asked for a speech, Van Horne reportedly said only that”. None of the retrieved pages (Wikipedia, DCB) records Van Horne's words; the line is the traditional account, so mark it as reported. [https://www.biographi.ca/en/bio/van_horne_william_cornelius_14E.html]
- Open: Could not retrieve The Canadian Encyclopedia (page too large) or run a search (quota exhausted) to confirm Van Horne's quoted words; the wording is widely cited and may be kept unsoftened if a source is found.

**ev-truth-and-reconciliation-commission-canada** — sources: Wikipedia: Truth and Reconciliation Commission of Canada; Wikipedia: Indian Residential Schools Settlement Agreement; Wikipedia: Murray Sinclair; Wikipedia: National Day for Truth and Reconciliation. No errors found.
- Open: The phrase 'from Winnipeg to Edmonton' and the 2010-2014 span of national events were not confirmed on a retrieved page (NCTR and CBC pages failed to load); they match the commonly cited first (Winnipeg 2010) and last (Edmonton 2014) events.

**ev-1862-smallpox-epidemic** — sources: Wikipedia: 1862 Pacific Northwest smallpox epidemic; HistoryLink.org: Smallpox epidemic of 1862 among Northwest Coast and Puget Sound Indians.
- story (wrong): “the police evicted the northern camps from May onward” → “the police evicted the northern camps from late April onward”. Police Commissioner Pemberton ordered the Tsimshian camp out on 28 April 1862 and most had left by 30 April; the gunboat-escorted removals followed in May and June. [https://www.historylink.org/File/5171]
- Open: Sources differ on the date of the Forward's towing of 26 canoes (11 May per Wikipedia, 11 June per HistoryLink); the story does not give a date. Wikipedia cites Boyd for about 20,000 deaths (two-thirds of BC First Nations) as a wider figure; the story's 14,000 coastal figure matches HistoryLink's account of Boyd and the record's note.

**ev-sand-creek-massacre** — sources: Wikipedia: Sand Creek massacre; National Park Service: The Life of Silas Soule; National Park Service: Sand Creek history and culture; Sand Creek Massacre Foundation: Aftermath; Wikipedia: Silas Soule; Oklahoma State University Tribal Treaties Database: Treaty with the Cheyenne and Arapaho, 1865. No errors found.
- Open: Not a story/summary field, but the record's note says NPS gives about 165-200 killed; the NPS history page now says around 230.

**ev-carlisle-indian-school** — sources: Wikipedia: Carlisle Indian Industrial School; Dickinson College: 'Kill the Indian in him, and save the man' (Pratt, 1892); Wikipedia: Federal Indian Boarding School Initiative; Bureau of Indian Affairs: Federal Indian Boarding School Initiative; Wikipedia: American Indian boarding schools; Spotlight PA (November 2025); Wikipedia: Deb Haaland. No errors found.
- Open: Not retrieved on a fetched page: the exact Volume II wording '417 schools in 37 states' (the report says 37 states or then-territories, which would be slightly more precise), the Rosebud/Pine Ridge origin of the first arrivals (Wikipedia mentions Pine Ridge recruiting and a Rosebud student), and the Gila River Indian Community as the apology venue. All are consistent with standard accounts; search quota was exhausted.

**ev-2008-financial-crisis** — sources: Federal Reserve History: The Great Recession and Its Aftermath; Wikipedia: Bankruptcy of Lehman Brothers; Wikipedia: Emergency Economic Stabilization Act of 2008; Wikipedia: Great Recession in the United States; Wikipedia: Bear Stearns. No errors found.

#### Sample (seed 20261116)

**ev-new-deal** — sources: Wikipedia: New Deal; Wikipedia: First 100 days of the Franklin D. Roosevelt presidency; Wikipedia: Fireside chats; Federal Reserve History: Bank Holiday of 1933; Wikipedia: Emergency Banking Act of 1933; Wikipedia: Civilian Conservation Corps; Wikipedia: Social Security Act. No errors found.
- Open: WPA's 1935 founding year and its arts programmes were not stated in the retrieved part of the New Deal article; standard fact.

**ev-rise-of-cahokia** — sources: Wikipedia: Cahokia; Wikipedia: Monks Mound; Wikipedia: Mound 72.
- story (wrong): “and in Mound 72 were buried a high-status man on a bed of shell beads together with dozens of sacrificed young women.” → “and Mound 72 held an elite burial on a bed of thousands of shell beads, long described as a single man but found in a 2016 re-study to include a woman, near the graves of dozens of sacrificed young women.”. The 'beaded burial' is now read as a male/female pair (Emerson et al. 2016), and the 53 sacrificed women lay in a separate mass grave in the mound, not in the same burial. [https://en.wikipedia.org/wiki/Mound_72]
- Open: Wikipedia's Monks Mound article calls the base 'roughly the same size' as the Great Pyramid while its own figures (about 15 vs 13.1 acres) make it larger; 'covers more ground' is supported by the numbers. Wikipedia does not explicitly credit Pauketat with the 'Big Bang' term (it is his usage in his 2009 book).

**ev-great-peace-of-montreal** — sources: Wikipedia: Great Peace of Montreal; Wikipédia (fr): Grande paix de Montréal; Wikipedia: Kondiaronk.
- story (unsupported): “the largest diplomatic gathering the colony had ever seen” → “probably the largest diplomatic gathering the colony had ever seen”. Superlative not stated in the retrieved sources; soften. [Wikipedia: Great Peace of Montreal]
- story (unsupported): “An epidemic was raging and many fell ill on the way.” → “An epidemic was raging in Montréal, and many delegates fell ill and died there.”. Sources place the epidemic in Montréal during the conference, killing many delegates; illness 'on the way' is not supported. [Wikipédia (fr): Grande paix de Montréal]
- Open: The en Wikipedia page says 39 nations in the lead but 'over 40' elsewhere; the story uses neither. The en page calls the peace fragile (an Odawa attack within three years), while fr says it held among signatories until 1760; 'held in the Great Lakes for decades' sits within that spread.

**ev-american-civil-war** — sources: Wikipedia: American Civil War; Wikipedia: 1860 United States presidential election; Wikipedia: Battle of Antietam; Wikipedia: Siege of Vicksburg; Wikipedia: Military history of African Americans in the American Civil War; Wikipedia: Cornerstone Speech.
- story (wrong): “declaring slavery the cornerstone of their new Confederacy” → “openly defending slavery; the Confederacy's vice-president soon called it the new nation's cornerstone”. The 'cornerstone' phrase comes from Alexander Stephens's speech of 21 March 1861, after Lincoln took office, not from the secession declarations. [Wikipedia: Cornerstone Speech]
- Open: 'Nearly 200,000 Black soldiers and sailors': Wikipedia gives 186,097 soldiers plus about 20,000 sailors (slightly over 200,000), while other common figures (about 179,000 + 19,000) give just under. Within the spread; 'about 200,000' would be safer if you want to change it.

**ev-montgomery-bus-boycott** — sources: Wikipedia: Montgomery bus boycott; Stanford King Institute: Montgomery Bus Boycott; Wikipedia: Jo Ann Robinson.
- story (unsupported): “had trained at the Highlander Folk School in organising” → “had attended a workshop on race relations at the Highlander Folk School that summer”. Sources describe a 1955 race-relations/desegregation course at Highlander, not organising training. [Wikipedia: Montgomery bus boycott]
- story (unsupported): “had planned a boycott for years” → “had discussed a boycott for years”. Sources show earlier proposals and threats (1949, 1954 letter); the actual planning began after Parks's arrest. [Wikipedia: Jo Ann Robinson]
- story (wrong): “Robinson and her students secretly ran off tens of thousands of leaflets” → “Robinson, a colleague and two students secretly ran off some 35,000 leaflets”. She was helped by the business department chairman John Cannon and two students; the figure was 35,000. [Wikipedia: Jo Ann Robinson]
- Open: 'About 40,000 people' was not found in the retrieved pages (the King Institute gives about 90 percent of Black riders); it is a commonly cited figure. 'Secretly' comes from Robinson's memoir and was not in the retrieved pages.

**ev-october-crisis** — sources: Wikipedia: October Crisis.
- story (wrong): “Asked by a reporter how far he would go, Pierre Trudeau replied” → “On 13 October, asked by a reporter how far he would go, Pierre Trudeau had replied”. As written, the remark follows the student rallies (15 Oct) and the requests for help (15–16 Oct); it was made on 13 Oct. [Wikipedia: October Crisis]
- zh: Radio-Canada is the CBC's French-language service (TV as well as radio); '加拿大广播电台' is imprecise.

**ev-salem-witch-trials** — sources: Wikipedia: Salem witch trials; Wikipedia: Sarah Osborne; Wikipedia: Betty Parris; Wikipedia: Rebecca Nurse.
- story (unsupported): “In January 1692” → “In the winter of 1692”. Sources disagree on the month the fits began (Wikipedia: February; others: January); use a span that covers both. [Wikipedia: Salem witch trials]
- story (wrong): “two poor local women” → “two local women on the margins of village life”. Sarah Good was poor, but Sarah Osborne was not; she held a disputed farm. [Wikipedia: Sarah Osborne]
- story (wrong): “Accusations spread to dozens of villages.” → “Accusations spread to some two dozen towns and villages.”. The accused can be traced to about 25 New England communities, so 'dozens' overstates it. [Wikipedia: Salem witch trials]
- Open: The execution site is now identified as Proctor's Ledge at the foot of Gallows Hill; 'on Gallows Hill' is the traditional wording and acceptable.

**ev-hohokam-canals** — sources: Wikipedia: Hohokam; Wikipedia: History of Phoenix, Arizona; SRP: Canal history; Wikipedia: Climate of Phoenix; Wikipedia: Jack Swilling.
- story (unsupported): “Using digging sticks and baskets, Hohokam communities cut main canals up to twenty metres wide” → “Using only simple tools, Hohokam communities cut broad main canals”. No retrieved source gives a 20 m width or names the tools; Wikipedia says only 'relatively simple tools' and the canals were 'shallow and wide'. [Wikipedia: Hohokam]
- story (unsupported): “early Anglo settlers of Phoenix reopened some of the old channels; modern canals still follow their lines” → “the early Anglo canals of Phoenix were inspired by the old channels; many modern canals still follow their lines”. Sources say Swilling's canals were inspired by the Hohokam ruins and that modern canals follow many of the same paths; they do not say the old channels were reopened. [Wikipedia: Jack Swilling; SRP canal history]
- Open: Wikipedia names floods as the cause and calls drought speculative ('periods of drought and severe floods'); the story's 'floods and droughts' is acceptable. Wikipedia warns that the O'odham word huhugam means past life/ancestors generally rather than the archaeological Hohokam, so equating 'Hohokam (Huhugam)' is common usage but slightly loose. Digging sticks and baskets are standard in the archaeology literature but were not in the retrieved pages; keep them if the editor has Fish & Fish (2008) to hand.

**ev-founding-of-quebec** — sources: Wikipedia: Samuel de Champlain; Wikipédia (fr): Habitation de Québec; Dictionary of Canadian Biography: Duval, Jean; Wikipedia: Quebec City. No errors found.
- Open: The river width of about one kilometre was not given in the retrieved pages (it is a commonly cited figure). Fr Wikipedia gives scurvy as the main cause; dysentery is supported only for one man (Natel), so 'scurvy and dysentery' is acceptable but scurvy dominates.

**ev-texas-revolution** — sources: Wikipedia: Texas Revolution; Wikipedia: Battle of the Alamo; Handbook of Texas: Goliad Massacre; Wikipedia: Battle of San Jacinto.
- story (wrong): “Meanwhile delegates at Washington-on-the-Brazos declared independence.” → “On 2 March, while the Alamo was still under siege, delegates at Washington-on-the-Brazos had declared independence.”. Placed after Goliad, the sentence implies the declaration came later; it was made on 2 March, before the Alamo fell. [Wikipedia: Battle of the Alamo]
- story (wrong): “signed treaties recognising Texas” → “signed treaties ending the war and pledging to work for Texan independence”. The Treaties of Velasco did not themselves recognise Texas; the secret treaty only bound Santa Anna to press Mexico's congress for recognition. [Wikipedia: Battle of San Jacinto]
- Open: The Goliad toll ranges from 342 (TSHA man-by-man study) to 425–445 (Wikipedia); 'more than 340' sits at the low end of the range and is acceptable. The siesta is traditional; Wikipedia says Santa Anna let his men rest in the afternoon.

**ev-patriation-and-charter** — sources: Wikipedia: Patriation; Wikipedia: Constitution Act, 1982; UBC Indigenous Foundations: Constitution Act, 1982 Section 35; The Canadian Encyclopedia: Patriation, the Constitution Comes Home (search snippet). No errors found.
- Open: The Patriation article notes that the 1949 BNA (No. 2) Act gave Ottawa limited power to amend purely federal matters, so 'could only be amended by the Parliament at Westminster' is a slight simplification (the Constitution Act, 1982 article uses the same wording). That Aboriginal rights were dropped specifically from the November 1981 accord is standard history but was not spelled out in the retrieved pages.

**ev-wall-street-crash-and-depression** — sources: Wikipedia: Wall Street crash of 1929; Federal Reserve History: Stock Market Crash of 1929; Wikipedia: Great Depression; Wikipedia: Great Depression in Canada; Wikipedia: On-to-Ottawa Trek; Wikipedia: Margin (finance).
- story (wrong): “unemployed men rode freight trains west; their On-to-Ottawa Trek ended in a riot in Regina in 1935” → “unemployed men rode freight trains in search of work; in 1935 relief-camp workers rode them east from Vancouver on the On-to-Ottawa Trek, which ended in a riot in Regina”. The trek travelled east from Vancouver toward Ottawa; 'west ... their trek' misstates the direction. [Wikipedia: On-to-Ottawa Trek]
- Open: Not confirmed in retrieved pages: that the bankers met at J. P. Morgan's offices (Wikipedia names Lamont of the Morgan bank but not the venue); that the volume record 'stood for decades' (commonly given as until 1968); 'nearly quadrupled since 1924' (consistent with Dow about 95–100 in 1924 vs 381, but not stated). Wikipedia gives world trade at one third of its 1929 level by 1933, consistent with 'about two thirds' decline by 1934. The web search quota ran out, so these could not be checked further.

**ev-hurricane-katrina** — sources: Wikipedia: Hurricane Katrina; Wikipedia: Effects of Hurricane Katrina in New Orleans; Wikipedia: New Orleans.
- story (wrong): “Thousands sheltered for days in the Superdome” → “Tens of thousands sheltered for days in the Superdome”. Superdome held about 15,000-25,000 and the Convention Center up to about 20,000; 'thousands' understates [Wikipedia: Effects of Hurricane Katrina in New Orleans]

**ev-spiro-mounds** — sources: Wikipedia: Spiro Mounds; Oklahoma Historical Society Encyclopedia: Spiro Mounds; Oklahoma Historical Society: Spiro Mounds Archaeological Center.
- story (wrong): “Spiro was not a large town, but for two centuries it was a religious centre” → “After about 1250 most of Spiro's residents moved away, but for two more centuries it remained a religious centre”. Spiro had a large resident population until about 1250, then served as a ceremonial and burial centre until about 1450 [Wikipedia: Spiro Mounds]
- story (unsupported): “wooden masks” → “wood carvings”. retrieved sources mention wood artefacts and shell-inlaid wood carvings, not masks specifically [Wikipedia: Spiro Mounds]
- story (wrong): “before they were stopped, the diggers reportedly blasted part of the burial chamber with explosives” → “when they had finished, the diggers reportedly blasted the burial chamber with explosives”. Wikipedia says the chamber was dynamited when the commercial excavators finished, not before they were stopped [Wikipedia: Spiro Mounds]
- story (unsupported): “Oklahoma passed its first antiquities law in response, and” → “In response Oklahoma passed a licensing law that shut the diggers down in 1935, and”. sources describe a licensing requirement that closed the Pocola company in November 1935 and make Oklahoma 'one of the first states' to protect sites; none says it was the state's first antiquities law [Oklahoma Historical Society Encyclopedia: Spiro Mounds]
- Open: Wikipedia's Spiro article says the lease was in 1936, contradicting the OHS Encyclopedia (1933-1935, consistent with the 1936 start of OU excavation); the story's 1933 follows OHS and is kept. Cedar masks from Spiro do exist in museum collections as I recall, but no retrieved page confirms it, hence the softening. 'Uniquely, stayed open and dry' is plausible (the Great Mortuary is often called unique) but not explicitly confirmed. Summary 'around 1400' sits within Wikipedia's 950-1450 range for Craig Mound burials.

**ev-nineteenth-amendment** — sources: Wikipedia: Nineteenth Amendment to the United States Constitution; National Archives: 19th Amendment; Wikipedia: Harry T. Burn. No errors found.
- Open: No retrieved page states outright that Anthony and Stanton drafted the text in the 1870s (only that it was introduced in 1878 and called the Anthony Amendment); this is the standard account and was left. Burn was the youngest legislator when elected in 1918; that he was still the youngest in 1920 is the usual claim but not confirmed.

**ev-wounded-knee-massacre** — sources: Wikipedia: Wounded Knee Massacre; AP via Military Times: Hegseth says Wounded Knee soldiers will keep their Medals of Honor (26 Sep 2025).
- story (wrong): “Twenty soldiers received the Medal of Honor” → “Nineteen soldiers (often counted as twenty) received the Medal of Honor”. Wikipedia counts 19 medals specifically for Wounded Knee, and AP corrected its 2025 story from 20 to 19 [Wikipedia: Wounded Knee Massacre; AP 26 Sep 2025]
- Open: 'Congress had just cut beef rations' is not confirmed by the retrieved Wikipedia page (which cites reduced, half or two-thirds rations without naming Congress); it is the account in Richardson's book listed as a source, so it was left. If you would rather hedge, use 'where beef rations had just been cut' / zh '在牛肉配给刚被削减、'.

**ev-king-philips-war** — sources: Wikipedia: King Philip's War; Wikipedia: Mary Rowlandson.
- story (wrong): “more than half of New England's ninety towns” → “more than half of New England's towns”. Wikipedia counts 110 New England towns at the time; the older figure of 90 conflicts with it, so drop the number [Wikipedia: King Philip's War]
- Open: 'Some twenty years' for the head on display sits within the usual range (Wikipedia: 'for a generation'; other accounts say about 20-25 years). Metacom's wife's fate is not covered by retrieved pages; the story already calls it uncertain.

**ev-battle-of-the-little-bighorn** — sources: Wikipedia: Battle of the Little Bighorn; Wikipedia: Great Sioux War of 1876; Wikipedia: United States v. Sioux Nation of Indians. No errors found.
- Open: Village population (~7,000) is not given in the retrieved page (it counts about 1,800 lodges), but it is a common estimate. The 'upside down' detail of the vision is widely repeated but Wikipedia words it 'like grasshoppers from the sky'. The news reached the East just after the 4 July centennial; 'was celebrating its centennial' is fair for the centennial year.

**ev-ipiutak-point-hope** — sources: Wikipedia: Ipiutak site; Time (1940): Science: Arctic Metropolis; Penn Museum Expedition: Ipiutak article; EBSCO Research Starters: Ipiutak culture.
- story (unsupported): “They called it a lost Arctic city.” → “The press hailed it as a lost Arctic city.”. the 'lost Arctic city' phrase is from Time magazine's 1940 report, not attributed to the archaeologists in retrieved sources [Time (1940): Arctic Metropolis]
- story (unsupported): “interlocking ivory chains carved from a single tusk” → “interlocking ivory chains”. no retrieved source says the chains were carved from a single tusk [museum citation of Wardwell via WebSearch]
- story (wrong): “burial masks with eyes of inlaid jet and ivory” → “burial masks, and ivory eyeballs with jet pupils set in the skulls of the dead”. sources describe the jet-inlaid ivory eyes as placed in skulls in the graves, not as mask eyes [Time (1940); Penn Museum Expedition]
- summary (wrong): “and masks with jet eyes” → “masks, and ivory eyes with jet pupils”. same as story: jet-pupilled ivory eyes were set in skulls [Time (1940); Penn Museum Expedition]
- Open: Some Ipiutak mortuary masks may also have jet inlays (I could not confirm either way), so the change keeps masks but moves the jet eyes to the skull finds. 'One of the oldest continuously occupied places in North America' is hedged ('often described') and not checked.

**ev-trinity-test** — sources: Wikipedia: Trinity (nuclear test); OSTI Manhattan Project history: Trinity Test; DOE Legacy Management: Trinity Site.
- story (wrong): “Observers lay face-down in trenches ten kilometres away, some watching through welding glass.” → “Observers in shelters nine kilometres away and at more distant camps lay on the ground, feet towards the tower, some watching through welding glass.”. sources place observers in shelters 10,000 yards (9.1 km) out and at base camp and Compania Hill farther away, lying on the ground feet towards the blast; no trenches mentioned [Wikipedia: Trinity (nuclear test); OSTI]
- Open: 'Perhaps after a sonnet by John Donne' is hedged; Wikipedia only says the name is often attributed to Donne's poetry (Oppenheimer's later letter cited the Holy Sonnet 'Batter my heart'). 'Thunderstorms' is fine (rain and lightning).

**ev-alaska-purchase** — sources: Wikipedia: Alaska Purchase; Wikipedia: Russian-American Company.
- story (wrong): “a sailor had to climb up to free it” → “Russian soldiers had to climb the pole to free it”. Wikipedia says Russian soldiers climbed the pole; the third one brought the flag down [Wikipedia: Alaska Purchase]
- story (wrong): “run since 1799 by the Russian-American Company from Novo-Arkhangelsk (Sitka),” → “run since 1799 by the Russian-American Company, later from Novo-Arkhangelsk (Sitka),”. New Archangel was only founded in 1804; the company was first based at Kodiak [Wikipedia: Russian-American Company]
- Open: 'Oil in the 1960s' (Prudhoe Bay, 1968) is not confirmed by retrieved pages but is standard.

**ev-september-11-attacks** — sources: Wikipedia: September 11 attacks; Wikipedia: United Airlines Flight 93; Wikipedia: Operation Yellow Ribbon.
- story (unsupported): “hijackers armed with box cutters” → “hijackers armed with knives and box cutters”. sources report boxcutters on Flight 11 but knives on Flights 77 and 93 [Wikipedia: September 11 attacks; Wikipedia: United Airlines Flight 93]
- Open: Gander's ~6,600 includes 473 crew (6,122 passengers per one count, 6,656 per another), so 'some 6,600 stranded passengers' is within the spread.

**ev-end-of-norse-greenland** — sources: Wikipedia: Hvalsey Church; Wikipedia: History of Greenland; Wikipedia: Greenlandic Norse; Wikipedia: Hans Egede; Wikipedia: Eastern Settlement. No errors found.
- Open: Sea ice 'choking the fjords' not explicitly covered by the retrieved pages, but uncontroversial. Isotope studies show a rising marine diet (seal especially per Arneborg et al.); the pages fetched speak of marine foods generally.

**ev-erie-canal-opens** — sources: Wikipedia: Erie Canal; Wikipedia: DeWitt Clinton; NYS Canals: Canal History; Erie Canalway: Building a Nation; eriecanal.org: 1825 celebration texts; History.com: Erie Canal construction.
- story (wrong): “When Governor DeWitt Clinton pushed” → “When DeWitt Clinton, soon to be governor, pushed”. The canal act passed on 15 April 1817; Clinton only took office as governor on 1 July 1817. [NYS Canals: Canal History; Wikipedia: DeWitt Clinton]
- story (wrong): “travelled to New York City in about 80 minutes” → “travelled to New York City in about an hour and a half”. Sources give 85 minutes (contemporary account) or 90 minutes (Wikipedia), not about 80. [eriecanal.org; Wikipedia: Erie Canal]
- story (unsupported): “fell from about 100 dollars a ton to under 10” → “fell to roughly a tenth of what they had been”. No retrieved source gives the $100/$10 per-ton figures; sources speak of a cut of about 90-95 percent. [Wikipedia: Erie Canal]
- Open: The $100 to $10 per ton figure is widely repeated in popular sources but I could not retrieve one (search quota exhausted); if the editors have Bernstein or Britannica at hand it may be restored. Sandy Hook vs 'New York Harbor': the ceremony was in the lower bay near Sandy Hook, so fine.

**ev-thule-migration** — sources: Wikipedia: Thule people; Wikipedia: History of Greenland.
- story (unsupported): “began one of the fastest long-distance migrations in human history” → “began a remarkably rapid long-distance migration”. Superlative not supported by retrieved sources. [Wikipedia: Thule people]
- story (unsupported): “dog sleds, and snow houses.” → “dog sleds, and warm semi-subterranean winter houses.”. Sources describe Thule winter houses as semi-subterranean, covered with skins and sod; snow houses are not attested for them in the retrieved source. [Wikipedia: Thule people]
- Open: 'Within about a century' for Dorset disappearance: Wikipedia says 'within a few centuries' in one place but the 2014 genetic study puts replacement by c. 1300, consistent with the story under the rapid 13th-century model. Story says 'little intermixing' between Thule and Dorset; Raghavan 2014 found essentially none, so fine.

**person-knud-rasmussen** — sources: Wikipedia: Knud Rasmussen; Wikipedia (da): Knud Rasmussen; Wikipedia: Arnarulunnguaq; Wikipedia: Inughuit; Wikipedia: Aua (shaman).
- story (wrong): “among the Inughuit, the world's northernmost people,” → “among the Inughuit, the northernmost Inuit,”. Sources call the Inughuit the northernmost people of North America / northernmost Inuit, not of the world. [Wikipedia: Inughuit]
- story (unsupported): “a team of Danish and Greenlandic scientists” → “a team of Danish scientists and Greenlandic hunters”. The Greenlandic members were hunters and helpers (e.g. Miteq, Arnarulunnguaq), not scientists. [Wikipedia: Arnarulunnguaq]
- story (unsupported): “he could talk with every Inuit group he met, proving the unity of Inuit language and culture” → “he could make himself understood by the Inuit groups he met, showing how closely related Inuit languages and cultures were”. 'Every group' and 'proving the unity' overstate; softened. [Wikipedia: Knud Rasmussen]
- story (unsupported): “Arnarulunnguaq, the only woman on the journey, is now honoured in Greenland as a pioneer in her own right.” → “Arnarulunnguaq, the only woman on the sled journey west, is now recognised as a pioneer in her own right.”. Other Greenlandic women took part in the expedition's first phase; she was the only woman in the three-person westward party. Specific Greenlandic honours not found (she is to feature on a Danish banknote). [Wikipedia: Arnarulunnguaq]
- Open: 'In 1923' start of the westward journey and 'its profits paid for his expeditions' were not stated on retrieved pages (search quota exhausted); 1923 is consistent with a 16-month journey ending in 1924 and the funding claim is widely repeated. zh name 克努兹·拉斯穆森 is acceptable (克努德·拉斯穆森 also common).

**ev-great-migration** — sources: Wikipedia: Great Migration (African American); Wikipedia: Chicago Defender; Wikipedia: Chicago race riot of 1919; Wikipedia: Louis Armstrong.
- story (unsupported): “jobs paying several times what a sharecropper could earn” → “jobs paying two or three times what a sharecropper could earn”. Source says northern wages could be more than twice southern ones; 'several times' overstates. [Wikipedia: Great Migration (African American)]
- Open: Illinois Central route and night departures to avoid creditors come from Wilkerson's account; not on retrieved pages but well known.

**ev-battle-of-gettysburg** — sources: Wikipedia: Battle of Gettysburg; American Battlefield Trust: Gettysburg.
- summary (unsupported): “it was the largest battle of the war” → “it was the costliest battle of the war”. Sources call it the bloodiest battle of the war; 'largest' by troops engaged is disputed. [Wikipedia: Battle of Gettysburg]
- story (unsupported): “a market town where ten roads met” → “a market town where roads from every direction met”. Retrieved sources say major roads converged at the town but give no count of ten. [American Battlefield Trust; Wikipedia: Battle of Gettysburg]
- Open: 'Fewer than half returned': Wikipedia says nearly half did not return, ABT gives casualties approaching 60%; story sits within the spread. 'Out of ammunition' for the 20th Maine is the standard account but not on the fetched page. The ten-roads figure is often quoted (NPS) and could be kept if editors have a source.

**ev-north-west-resistance** — sources: Wikipedia: North-West Rebellion; Wikipedia: Louis Riel.
- story (wrong): “But the new railway brought some 5,000 troops west,” → “But the new railway rushed troops west, and Canada put some 5,000 men in the field,”. Middleton brought about 3,000 troops west and added about 2,000 more raised in the region; not all 5,000 came by rail. [Wikipedia: North-West Rebellion]
- Open: zh renders Riel as 里埃尔; 路易·瑞尔 is more common in Chinese sources but 里埃尔 is acceptable.

**ev-seneca-falls-convention** — sources: Wikipedia: Seneca Falls Convention; Wikipedia: World Anti-Slavery Convention; NPS: The First Women's Rights Convention.
- story (legend): “had been made to sit behind a curtain because they were women” → “had been kept off the floor and seated apart because they were women”. Sources say women were confined to a spectators' section and could not take part; the 'behind a curtain' detail is not supported (Stanton was not even a delegate). [Wikipedia: World Anti-Slavery Convention]
- story (unsupported): “and it narrowly passed.” → “and it passed.”. Wikipedia says the suffrage resolution passed by a large majority; other accounts call it narrow. Drop the qualifier. [Wikipedia: Seneca Falls Convention]
- Open: Sources disagree on the margin of the suffrage vote (Wikipedia: 'large majority'; many popular accounts: 'narrowly'). The tea was at Waterloo, a few miles from Seneca Falls, so 'near Seneca Falls' is fine.

#### Remainder

**ev-pontiacs-war** — sources: Wikipedia: Pontiac's War; Wikipedia: Pontiac (Ottawa leader); Wikipédia (fr): Rébellion de Pontiac.
- story (unsupported): “an episode documented in the fort's records” → “an episode documented in the journal and accounts of the militia commander William Trent”. The documentation is Trent's journal and his invoice (approved by Ecuyer and later Gage), not generic fort records [Wikipedia: Pontiac's War]
- story (unsupported): “The war pushed London to issue the Proclamation of 1763, reserving the western lands for Indigenous peoples, and to restore gift-giving diplomacy.” → “The war hastened London's Proclamation of 1763, reserving the western lands for Indigenous peoples, and forced a change in British policy toward the western nations.”. Proclamation was already being drafted and was issued quickly once news of the rising arrived; no retrieved source says gift-giving was restored (fr wiki: treaties only mention powder and lead; London 'forced to change policy') [Wikipedia: Pontiac's War; fr.wikipedia: Rébellion de Pontiac]
- Open: Restoration of gift-giving is asserted by Dowd and others but was not found in a retrieved page; if the editor can confirm from Dowd (2002), the original clause may be kept. 'Cloth and tools' as cut gifts not specifically confirmed (sources list guns, knives, tobacco, clothing, powder).

**ev-mexican-american-war** — sources: Wikipedia: Mexican–American War.
- story (unsupported): “fought his way along Cortés's route to Mexico City” → “fought his way inland to Mexico City”. No retrieved source states Scott followed Cortés's route (he went via Cerro Gordo and Puebla) [Wikipedia: Mexican–American War]
- Open: Cession list omits parts of Colorado and Wyoming (acceptable simplification). Details of the Niños Héroes story are not fully confirmed by historians, but the story only says cadets died defending the castle.

**ev-roanoke-colony** — sources: Wikipedia: Roanoke Colony; Wikipedia: Virginia Dare; NPS: Fort Raleigh history.
- story (wrong): “kept him in England for three years.” → “kept him from returning for three years.”. White did sail in 1588 with two small ships but was attacked near Morocco and turned back, so he was not simply kept in England [Wikipedia: Roanoke Colony]
- Open: 'England's first attempts at an American colony' is standard but Frobisher (1578) and Gilbert (1583) had earlier colonising plans/claims; acceptable as is. Summary 'only the word CROATOAN' omits the 'CRO' tree carving (minor).

**ev-residential-schools** — sources: Wikipedia: Canadian Indian residential school system; Wikipedia: Peter Bryce; Wikipedia: Truth and Reconciliation Commission of Canada; Wikipedia: Gordon's Indian Residential School; Wikipedia: 2022 visit by Pope Francis to Canada.
- story (unsupported): “reported death rates from tuberculosis that would be a national scandal anywhere else, and his report was largely buried.” → “reported alarming death rates among pupils, and the report was published without his recommendations.”. The 1907 report was published (minus its recommendations); his findings were pressed publicly only in 1922's The Story of a National Crime; 'national scandal anywhere else' is unsourced editorialising [Wikipedia: Peter Bryce]
- Open: Kivalliq Hall (1997) is sometimes cited as the last school; 1996 (Gordon's, last federally funded) is the standard date. 'In the House of Commons' for Harper's apology not confirmed by a retrieved page (standard fact). Tuberculosis as main cause is widely cited and could be re-added if the editor confirms.

**person-tecumseh** — sources: Wikipedia: Tecumseh; Wikipedia: Battle of the Thames.
- story (unsupported): “he refused to sign and moved west” → “he stayed away from the signing and moved west”. Wikipedia says Tecumseh did not attend the signing; no retrieved source says he refused to sign [Wikipedia: Tecumseh]
- story (unsupported): “bought three million acres” → “bought some three million acres”. Sources give 2.5 to 3 million acres [Wikipedia: Tecumseh]
- story (wrong): “who called him a brave and able warrior” → “who wrote that no more sagacious or gallant warrior existed”. Brock's actual words: 'A more sagacious or a more gallant warrior does not I believe exist' [Wikipedia: Tecumseh]
- story (wrong): “Tecumseh made him stand at the Thames, and died there; his body was never identified.” → “Tecumseh pressed him to turn and fight; at the Thames the British line broke and Tecumseh was killed. Where his remains lie is unknown.”. Procter chose the Moraviantown position himself; Tecumseh had urged him to fight. Wikipedia says the body was identified the next day (and mutilated); it is the burial place that is unknown [Wikipedia: Tecumseh; Wikipedia: Battle of the Thames]
- Open: Some Native traditions hold the mutilated body was not Tecumseh's, so 'identified' is itself contested; the proposed wording avoids the issue. The 1805 'vision' is standard but the retrieved page only says he began preaching in 1805.

**ev-march-on-washington** — sources: Wikipedia: March on Washington for Jobs and Freedom; Wikipedia: Civil Rights Act of 1964; Wikipedia: Birmingham campaign; Wikipedia: 16th Street Baptist Church bombing.
- story (wrong): “and President Kennedy had sent a civil rights bill to Congress.” → “and in June President Kennedy had sent a civil rights bill to Congress.”. Kennedy's bill went to Congress on 19 June 1963 (summer, not 'that spring') [Wikipedia: Civil Rights Act of 1964]
- Open: 'First-aid stations and toilets' and 'under two months' are standard (Rustin took charge c. early July) but not explicitly in the retrieved pages. Lewis's age 23 (born Feb 1940) not on the retrieved page.

**ev-halifax-explosion** — sources: Wikipedia: Halifax Explosion.
- story (unsupported): “to telegraph a warning that stopped an incoming passenger train, and was killed.” → “to telegraph a warning to incoming trains, and was killed.”. Wikipedia says it is uncertain whether his warning actually stopped the Saint John overnight train [Wikipedia: Halifax Explosion]
- summary (unsupported): “in the largest human-made explosion before the atomic bomb” → “in the largest human-made explosion up to that time”. Source calls it the largest human-made explosion at the time [Wikipedia: Halifax Explosion]
- Open: 'Clear morning' not confirmed in the retrieved page (standard). The modern tree is sent by the Province of Nova Scotia, consistent with the story.

**ev-coronado-expedition** — sources: Wikipedia: Coronado expedition; Wikipedia (es): Francisco Vázquez de Coronado; Wikipedia: Marcos de Niza; NPS: Coronado National Memorial history; Wikipedia: Juan de Oñate.
- story (unsupported): “he wrote bitterly that the friar had told the truth about nothing” → “he wrote bitterly that the friar's reports had proved false”. Retrieved pages confirm Coronado reported to the Crown that de Niza's account was inaccurate but do not give the 'truth about nothing' wording [es.wikipedia: Francisco Vázquez de Coronado; Wikipedia: Marcos de Niza]
- story (unsupported): “Spain made no attempt to settle the lands he had crossed for more than half a century.” → “Spain did not plant a colony in the lands he had crossed until 1598, more than half a century later.”. Oñate's colony dates from 1598; 'no attempt' is too absolute given smaller later entradas [Wikipedia: Juan de Oñate]
- Open: The 'not told the truth in a single thing' line is a well-known paraphrase of Coronado's 3 Aug 1540 letter; if the editor can cite the letter, the original may stay. Coronado's own letter is the source of the original quote but was not retrieved.

**ev-red-river-war** — sources: Wikipedia: Red River War; Wikipedia: Quanah Parker.
- story (unsupported): “and the most influential Comanche leader of the reservation era.” → “and the government-appointed principal chief of the Comanche in the reservation era.”. Superlative not supported by retrieved source; it confirms he was appointed principal chief and was the key negotiator [Wikipedia: Quanah Parker]
- Open: Adobe Walls attackers: Wikipedia ~250, other accounts up to ~700; 'several hundred' sits within the spread. 'Millions' of bison killed in the early 1870s is standard but no figure on retrieved page.

**ev-trail-of-tears** — sources: Wikipedia: Trail of Tears; Wikipedia: Treaty of New Echota.
- story (wrong): “they sued, and in 1832 the Supreme Court under John Marshall ruled in Worcester v. Georgia that” → “they went to court; in 1832, in Worcester v. Georgia, a case brought by a missionary, the Supreme Court under John Marshall ruled that”. The Cherokee's own suit (Cherokee Nation v. Georgia, 1831) was dismissed; Worcester was brought by missionary Samuel Worcester [Wikipedia: Trail of Tears]
- zh: en says 'the trail where they cried' (matches Cherokee nu na hi du na tlo hi lu i)
- Open: Treaty of New Echota article carries accuracy tags; the one-vote Senate margin is standard. 'Stockades' not on the retrieved page (camps); standard in NPS accounts.

**ev-norse-at-lanse-aux-meadows** — sources: Wikipedia: L'Anse aux Meadows; Wikipedia: Vinland; Wikipedia: Norse colonization of North America; Wikipedia: Miyake event.
- zh: Use the standard Chinese renderings of Helluland and Markland.
- Open: The metal-blade cut marks on the dated wood come from the Nature paper (Kuitems et al. 2021), which could not be fetched (paywall redirect); no retrieved page mentions them, but this is the paper's central evidence and is standard. The Miyake spike is dated 993/994.

**ev-canadian-confederation** — sources: Wikipedia: Canadian Confederation; Wikipedia: George-Étienne Cartier.
- story (unsupported): “the United States had just raised the largest army in the world” → “the United States had just raised a vast army in its Civil War”. No retrieved source calls the Union army the largest in the world; keep the claim modest. [Wikipedia: Canadian Confederation]
- story (wrong): “Within six years it had bought Rupert's Land and stretched to the Pacific.” → “Within four years it had acquired Rupert's Land and, with British Columbia, stretched to the Pacific.”. Rupert's Land was transferred in 1870 and BC joined in 1871, four years after 1867; 'six years' is imprecise. [Wikipedia: Canadian Confederation]
- Open: Cartier 'securing a province of Québec with its own civil law' is standard (provincial jurisdiction over property and civil rights) but the Cartier article frames his Civil Code work as pre-Confederation; left as is. 'Bells and bonfires' on 1 July not checked against a retrieved page (minor, standard).

**ev-expulsion-of-the-acadians** — sources: Wikipedia: Expulsion of the Acadians; Wikipedia: Acadians; Wikipedia: Bay of Fundy campaign (1755); Wikipedia: Aboiteau; Wikipedia: Royal Proclamation of 2003; Wikipedia: John Winslow (British Army officer).
- story (unsupported): “since the 1630s” → “since the 17th century”. Retrieved sources date Acadian dyking only to the 17th century generally (aboiteaux at Grand-Pré from the 1680s); no source gives the 1630s. [Wikipedia: Aboiteau; Wikipedia: Acadians]
- story (unsupported): “shipwreck and smallpox killed many” → “shipwreck and disease killed many”. Sources give disease, starvation and shipwreck; smallpox is not named in retrieved pages. [Wikipedia: Expulsion of the Acadians]
- story (unsupported): “a royal proclamation acknowledged the wrongs done to them” → “a royal proclamation acknowledged the deportation and the suffering it caused”. The 2003 proclamation acknowledged the deportation and its suffering but made no apology and admitted no legal responsibility; 'wrongs' overstates it. [Wikipedia: Royal Proclamation of 2003]
- Open: Expulsion article gives about 11,500 of 14,100 (about four-fifths) while the Acadians article says about three-quarters of Nova Scotia's Acadians; the story's 'about three-quarters' sits within that spread.

**ev-lewis-and-clark-expedition** — sources: Wikipedia: Lewis and Clark Expedition; Wikipedia: Meriwether Lewis; Wikipedia: Sacagawea; Wikipedia: Cameahwait; Wikipedia: Nez Perce; NPS: Lewis and Clark National Historic Trail.
- story (wrong): “The party of about thirty-three included” → “The party, more than forty strong at the start, included”. About 33 was the permanent party that left Fort Mandan; the group that went up the Missouri in 1804, including the French boatmen, numbered some 40-45. [Wikipedia: Lewis and Clark Expedition]
- story (unsupported): “their journals described some 178 plants and 122 animals new to science” → “their journals described more than 200 plants and animals new to science”. Retrieved sources give 'more than 200 new plant and animal species'; the 178/122 split could not be verified. [Wikipedia: Lewis and Clark Expedition]
- Open: The 178 plants / 122 animals count is a widely repeated figure (from P. R. Cutright) and may be fine if the editor can cite it; it is consistent with 'more than 200'. 'Even before the Louisiana Purchase' (secret message of January 1803) is standard but the Wikipedia article is ambiguous and no retrieved page gives the date.

**ev-chaco-canyon-great-houses** — sources: Wikipedia: Chaco Culture National Historical Park; Wikipedia: Pueblo Bonito; PubMed listing: Watson et al. 2015, Early procurement of scarlet macaws ... Chaco Canyon (PNAS).
- story (unsupported): “from mountains 75–80 kilometres away” → “from mountains 75 kilometres or more away”. Wikipedia gives distances of up to about 110 km; the fixed 75–80 km range is too narrow. [Wikipedia: Chaco Culture National Historical Park]
- Open: Room count for Pueblo Bonito varies (650 to about 800); story's 650 is within range. Dispersal to Aztec and Mesa Verde is standard (Lekson) but the retrieved page names other destinations (Little Colorado, Rio Puerco, Rio Grande); left as is.

**person-george-washington** — sources: Wikipedia: George Washington; Wikipedia: Newburgh Conspiracy; Wikipedia: Valley Forge; Wikipedia: George Washington and slavery; Wikipedia: Maryland State House.
- story (unsupported): “talked of marching on Congress” → “hinted at defying Congress”. Sources describe an anonymous call for an ultimatum and talk of refusing to disband; no march on Congress is recorded. [Wikipedia: Newburgh Conspiracy]
- story (wrong): “he had grown grey and almost blind in their service” → “he had grown grey and almost blind in the service of his country”. His recorded words were 'in the service of my country', not the officers' service. [Wikipedia: Newburgh Conspiracy]
- Open: 'Lost more battles than he won' is a common judgement; not checked against a tally. Wikipedia's Washington article gives 2,000-3,000 Valley Forge deaths; story's 'some 2,000' is within the spread.

**ev-founding-of-montreal** — sources: Dictionary of Canadian Biography: Chomedey de Maisonneuve, Paul de; Wikipedia: Montreal; Wikipedia: Jeanne Mance; Wikipedia: Marguerite Bourgeoys. No errors found.
- Open: 'First school' is framed by Wikipedia as the beginning of public schooling in Montreal; acceptable.

**ev-ellis-island-opens** — sources: Wikipedia: Ellis Island; Wikipedia: Annie Moore (immigrant); NPS: Ellis Island history and culture. No errors found.
- Open: Wikipedia says first- and second-class passengers bypassed Ellis Island rather than explicitly 'inspected on board'; the story's wording is standard NPS phrasing and acceptable.

**ev-manhattan-project** — sources: Wikipedia: Manhattan Project; Wikipedia: Franck Report; Wikipedia: Szilárd petition.
- story (unsupported): “Little happened until 1942, when the army took over” → “Research moved slowly until 1942, when the army took over”. Between 1939 and 1942 the Uranium Committee, NDRC, OSRD and S-1 committee were set up and Roosevelt approved acceleration in Oct 1941; 'little happened' overstates it. [Wikipedia: Manhattan Project]
- Open: Oppenheimer's postwar advocacy of international control not verified from the retrieved part of the article (standard: Acheson–Lilienthal Report).

**ev-1906-san-francisco-earthquake** — sources: Wikipedia: 1906 San Francisco earthquake; USGS: The Great 1906 San Francisco Earthquake; Wikipedia: Elastic-rebound theory.
- story (wrong): “Half the city's population, about 250,000 people, were left homeless” → “More than half the city's population, some 227,000–300,000 people, were left homeless”. Between 227,000 and 300,000 of about 410,000 people were left homeless, i.e. well over half. [Wikipedia: 1906 San Francisco earthquake]
- story (unsupported): “produced the first detailed study of fault movement” → “produced a landmark study of the fault rupture”. USGS calls the Lawson report arguably the most important study of a single earthquake; 'first' is not supported. [USGS: The Great 1906 San Francisco Earthquake]
- Open: Summary's 28,000 buildings: Wikipedia gives about 25,000; 28,000 is also commonly cited, so within the spread. Fires: story says three days, Wikipedia says four days and nights (fires were out on 21 April); acceptable. 'Wrong explosives' (black powder) not explicitly confirmed; Wikipedia says dynamiting often started fires.

**ev-cascadia-earthquake-1700** — sources: Wikipedia: 1700 Cascadia earthquake; Wikipedia: Cascadia subduction zone.
- story (unsupported): “The discovery transformed building codes and tsunami planning in the region.” → “The discovery helped reshape building codes and tsunami planning in the region.”. Neither retrieved page discusses building codes; 'transformed' is overstated without a source [https://en.wikipedia.org/wiki/1700_Cascadia_earthquake]
- Open: Building-code impact is widely stated (Oregon/Washington seismic codes upgraded in the 1990s) but not confirmed from a retrieved page; USGS PP1707 returned 403.

**ev-founding-of-st-augustine** — sources: Wikipedia: St. Augustine, Florida; Wikipedia: Fort Caroline; Wikipedia: Castillo de San Marcos.
- story (unsupported): “Philip II sent his best admiral, Pedro Menéndez de Avilés,” → “Philip II sent the experienced admiral Pedro Menéndez de Avilés”. 'his best admiral' is an unsourced superlative [https://en.wikipedia.org/wiki/St._Augustine,_Florida]
- zh: en says one transfer to Britain and back (1763, 1783); '几度' implies several
- Open: Wikipedia calls the storm that wrecked Ribault's fleet a 'violent storm'; 'hurricane' is the usual description in secondary literature, so left as is. Fort Caroline was taken 12 days after the founding; 'days later' in the summary is fine. Note the en replacement drops the comma after the name, so the sentence reads 'sent the experienced admiral Pedro Menéndez de Avilés to remove them'.

**person-martin-luther-king-jr** — sources: Stanford King Institute: Montgomery Bus Boycott; Stanford King Institute: Letter from Birmingham Jail; Wikipedia: Montgomery bus boycott; Wikipedia: Letter from Birmingham Jail; Wikipedia: Birmingham campaign; Wikipedia: Assassination of Martin Luther King Jr.; Wikipedia: Martin Luther King Jr.. No errors found.

**ev-loyalist-migration** — sources: Wikipedia: United Empire Loyalist; Wikipedia: Book of Negroes; Wikipedia: Black Loyalist; Wikipedia: Shelburne, Nova Scotia; Wikipedia: Saint John, New Brunswick; Wikipedia: Joseph Brant. No errors found.
- Open: Sierra Leone figure varies by source (1,192 / nearly 1,200 / around 1,300); 'nearly 1,200' is the common figure. Summary's 'about half' of 60,000 to NS/NB is at the low end (UEL article gives 35,000-40,000), but the note's 60,000-80,000 range covers it.

**ev-dust-bowl** — sources: Wikipedia: Dust Bowl; Wikipedia: Black Sunday (storm); Oklahoma Historical Society Encyclopedia: Dust Bowl; Wikipedia: Okie; Wikipedia: Great Plains Shelterbelt; Wikipedia: Hugh Hammond Bennett.
- story (unsupported): “plough up tens of millions of acres of the shortgrass prairie” → “plough up millions of acres of the shortgrass prairie”. The 32 million acres figure covers the whole Great Plains 1909-29, not just the five southern states named [https://www.okhistory.org/publications/enc/entry?entry=DU011]
- story (unsupported): “a wall of dust hundreds of kilometres long rolled across the Panhandle” → “a towering wall of dust rolled across the Oklahoma and Texas panhandles”. No retrieved source gives the front's length; the storm hit both panhandles [https://en.wikipedia.org/wiki/Black_Sunday_(storm)]
- story (wrong): “a reporter's dispatch about it gave the region its name” → “an Associated Press report about it gave the region its name”. The term came from AP: Geiger's story, with the phrase coined by AP editor Edward Stanley while rewriting it [https://en.wikipedia.org/wiki/Dust_Bowl]
- story (unsupported): “More than 250,000 migrants from Oklahoma” → “Hundreds of thousands of migrants from Oklahoma”. Retrieved sources give inconsistent totals (3.5 million left the Plains; over a million to California per one article); the precise 250,000 is unsourced [https://en.wikipedia.org/wiki/Okie]
- Open: 'Dust pneumonia' deaths and dust landing on ships in the Atlantic (May 1934 storm) are standard but not confirmed on a retrieved page. The Bennett anecdote is already framed as 'a well-known account' (it concerns early April 1935, just before Black Sunday). WebSearch quota was exhausted, so Worster's southern-Plains acreage could not be checked.

**ev-california-gold-rush** — sources: Wikipedia: California gold rush; Wikipedia: James W. Marshall; Wikipedia: John Sutter; Museum of the City of San Francisco: chronology 1846-1849; Wikipedia: California genocide.
- story (wrong): “Some 20,000 Chinese miners arrived by 1852” → “In 1852 alone some 20,000 Chinese arrived”. Source: more than 20,000 Chinese landed in San Francisco in 1852 alone (several hundred from 1849), not 20,000 cumulatively, and not all were miners [https://en.wikipedia.org/wiki/California_gold_rush]
- story (unsupported): “The forty-niners came by three routes:” → “The forty-niners came by three main routes:”. Source also lists a route across Mexico via Veracruz [https://en.wikipedia.org/wiki/California_gold_rush]
- Open: Levi Strauss as an example of a merchant who did well is standard but was not checked on a retrieved page. Wikipedia dates Brannan's confirmation to 'March 1848', but the SF Museum chronology gives 12 May 1848 for the street scene, so 'in May' stands.

**ev-american-revolutionary-war** — sources: Wikipedia: American Revolutionary War; Wikipedia: Battle of Trenton; Wikipedia: Battles of Saratoga; Wikipedia: Southern theater of the American Revolutionary War; Wikipedia: Joseph Brant. No errors found.
- Open: The battle at Trenton was fought on the morning of 26 December, after the Christmas-night crossing; the story's wording is acceptable.

**ev-cherokee-syllabary** — sources: Wikipedia: Sequoyah; Wikipedia: Cherokee syllabary; Wikipedia: Cherokee Phoenix.
- story (unsupported): “The syllabary could be learned in days,” → “The syllabary could be learned within weeks,”. Source cites Gallatin: a Cherokee could learn it in 'a few weeks' [https://en.wikipedia.org/wiki/Cherokee_syllabary]
- Open: Some popular sources say 'a few days'; the retrieved page says weeks.

**ev-haudenosaunee-great-law** — sources: Wikipedia: Iroquois Confederacy; Wikipedia: Great Peacemaker; Wikipedia: Hiawatha; Wikipedia: Wampum.
- story (unsupported): “A Huron-born prophet, remembered as the Peacemaker,” → “A prophet said to be Huron-born, remembered as the Peacemaker,”. Accounts differ: Huron (Wendat) or Onondaga-born and adopted by the Mohawk [https://en.wikipedia.org/wiki/Great_Peacemaker]
- story (legend): “the Peacemaker consoled him with strings of shell beads, the origin of the condolence ceremony and of wampum.” → “the Peacemaker consoled him with words and strings of shell beads, remembered as the origin of the condolence ceremony and its use of wampum.”. Shell beads predate the league (New York finds before 1510); in the tradition Hiawatha himself was stringing wampum and the Peacemaker spoke the words of consolation [https://en.wikipedia.org/wiki/Hiawatha]
- Open: The white stone canoe and the white pine are standard parts of the tradition but were not confirmed on retrieved pages (Great Peacemaker page mentions a 'Tree of Peace' without naming the species). Versions differ on whether the Seneca or the Onondaga came last; the story follows the Hiawatha-page version (Onondaga last).

**ev-greenland-home-rule** — sources: Wikipedia: History of Greenland; Wikipedia: 1979 Greenlandic home rule referendum; Wikipedia: Greenland; Wikipedia: Pituffik Space Base; Wikipedia: Greenlandic language; Wikipedia: Jonathan Motzfeldt; Wikipedia: 2008 Greenlandic self-government referendum.
- story (unsupported): “and many children were sent to be schooled in Danish” → “and schooling increasingly took place in Danish”. The only documented sending-away is the 1951 experiment with 22 children; 'many children were sent' is not supported [https://en.wikipedia.org/wiki/History_of_Greenland]
- story (unsupported): “A generation of young Greenlanders educated in Copenhagen,” → “A generation of young Greenlanders, many of them educated in Denmark,”. Only Motzfeldt's Copenhagen study is confirmed; the Siumut page does not name founders or their schooling [https://en.wikipedia.org/wiki/Jonathan_Motzfeldt]
- Open: Summary 'about 70 percent': 73.06% of valid votes, about 70% of all ballots cast, so it is within range. The 1 Jan 2010 takeover of mineral resources is standard but no retrieved page gives the date. 'Parties broadly agree on eventual independence' holds for most parties after the 2025 election (Demokraatit-led coalition), but Atassut is unionist-leaning.

**ev-brown-v-board** — sources: Wikipedia: Brown v. Board of Education; NPS: Brown v. Board of Education (Kansas case); NPS: Brown v. Board history & culture.
- story (unsupported): “had to cross railway tracks and ride a bus to a segregated school although a white school stood a few blocks from home” → “had to walk six blocks to a bus stop and ride to a segregated school a mile away, although a white school stood seven blocks from home”. Railway-track crossing not in retrieved sources; Wikipedia gives six-block walk to bus, Monroe 1 mile, Sumner seven blocks [Wikipedia: Brown v. Board of Education]
- Open: Linda Brown later recalled walking through a railroad switchyard; this is widely repeated but not in the pages retrieved, so the softer wording is proposed. Bolling v. Sharpe same-day decision (17 May 1954) is standard but not explicitly confirmed by the fetched text.

**ev-hopewell-earthworks** — sources: Wikipedia: Hopewell Ceremonial Earthworks; Wikipedia: Newark Earthworks; Wikipedia: Hopewell tradition; NPS: Hopewell Culture NHP history.
- story (unsupported): “the octagon at Newark survived partly because it became a golf course” → “the octagon at Newark survived as a militia camp and then, from 1910 to 2025, a golf course”. Octagon was a state militia camp 1892-1908 before the 1910 golf lease; the country club left on 1 January 2025 [Wikipedia: Newark Earthworks]
- Open: Lake Superior copper, southern Appalachian mica and Gulf shells are standard attributions but the retrieved pages name only Yellowstone obsidian and generic 'copper, mica, marine shells'. 'First to fifth centuries' slightly overshoots the NPS 1-400 CE range but matches Wikipedia's 100 BCE-500 CE. 'Later farmers mostly ignored the old enclosures' not checked.

**ev-pueblo-revolt** — sources: Wikipedia: Pueblo Revolt; Wikipedia: Popé; Wikipedia (es): Rebelión de los indios pueblo. No errors found.
- Open: The 2,500 besiegers is a Spanish estimate (Popé article says 'estimated (or overestimated)'); 'some 2,500' is acceptable. Vargas's 1692 entry was bloodless but the 1693 return involved executions; the story's compression is acceptable.

**ev-boston-tea-party** — sources: Wikipedia: Boston Tea Party; Massachusetts Historical Society: The Boston Tea Party.
- story (wrong): “refused to let the ships leave without unloading” → “refused to let the ships leave without paying the duty”. Hutchinson refused clearance for the Dartmouth to leave without paying the duty [Wikipedia: Boston Tea Party]
- story (unsupported): “a hundred or more men” → “somewhere between 30 and 130 men”. Estimates range from 30-60 (MHS) to 30-130 or more (Wikipedia); 'a hundred or more' sits at the top [Wikipedia: Boston Tea Party; Massachusetts Historical Society]
- Open: The replaced padlock and soot/blanket disguises are traditional details (from participant recollections) not in the retrieved pages; the padlock is already hedged with 'reportedly'.

**ev-purchase-of-manhattan** — sources: Wikipedia: Peter Minuit; Wikipedia: New Amsterdam; Wikipedia: Kieft's War; Wikipedia: Isaac Jogues.
- story (wrong): “killed hundreds” → “killed more than a thousand Native people”. Kieft's forces killed more than 1,000 Indians (500-700 at Pound Ridge alone); 'hundreds' understates [Wikipedia: Kieft's War]
- Open: Jogues's 'eighteen languages' report and Schagen's wording 'wild men' are standard but not in retrieved pages (already attributed to Jogues). Wikipedia dates the Schagen letter 7 November 1626 while the record's source list says 5 November; the story only says November. Kieft's War also targeted Wappinger groups (e.g. Weckquaesgeek), not only Lenape.

**ev-first-transcontinental-railroad** — sources: Wikipedia: First transcontinental railroad; Wikipedia: Golden spike; Stanford Chinese Railroad Workers in North America Project: FAQs.
- story (unsupported): “sometimes advancing only about 15 to 35 centimetres a day” → “often advancing only about 25 to 35 centimetres a day at each rock face”. Wikipedia gives about 0.85-1.18 ft (26-36 cm) per day per face, rising above 1.5 ft with nitroglycerin; 15 cm not supported [Wikipedia: First transcontinental railroad]
- story (unsupported): “the companies hired hunters who helped destroy the bison herds” → “the companies hired hunters to feed the crews on bison, an early step in the destruction of the herds”. Sources say UP hired hunters to supply bison meat; the herds' destruction came mainly from later commercial hunting [Wikipedia: First transcontinental railroad]
- story (wrong): “Leland Stanford swung at the ceremonial golden spike and missed” → “Leland Stanford swung at the last spike and missed”. The golden spike was dropped into a pre-drilled hole and gently tapped; the missed blow was at the final spike [Wikipedia: Golden spike]
- story (wrong): “Chinese workers were absent from the famous photograph.” → “Few Chinese workers attended, and they barely appear in the famous photographs.”. Wikipedia calls total absence from the Russell photograph a misconception: Stanford research identified two Chinese labourers in it, and eight Chinese laid the last rail [Wikipedia: Golden spike]
- Open: 'Lakota and Cheyenne' as the attackers of UP survey crews is standard but the retrieved page says only 'raiding Native Americans'. 12,000-15,000 is within the 10,000-15,000 range given by the Stanford project. 'About a week' is the usual figure; Wikipedia says 'a matter of days'.

**ev-red-river-resistance** — sources: Wikipedia: Red River Rebellion; Wikipedia: Louis Riel; Wikipedia: Manitoba Act, 1870; Wikipedia: Thomas Scott (Orangeman).
- story (wrong): “an Orange Ontarian prisoner” → “an Irish-born Orangeman from Ontario”. Scott was born in County Down, Ireland, and emigrated to Ontario in 1863 [Wikipedia: Thomas Scott (Orangeman)]
- Open: Wikipedia says the survey was stopped by a group 'that included Riel'; standing on the chain is the standard account (Canadian Encyclopedia) but not in the retrieved text. Riel did sign the Commons register in disguise in 1874 before expulsion; 'could not take his seat' is acceptable.

**ev-declaration-of-independence** — sources: Wikipedia: United States Declaration of Independence; Wikipedia: Thomas Jefferson and slavery.
- story (unsupported): “in about two weeks” → “in a little over two weeks”. Wikipedia gives 11-28 June, 17 days [Wikipedia: United States Declaration of Independence]
- Open: Jefferson's autobiography says northern delegates whose merchants carried slaves also backed the deletion; the story's 'South Carolina and Georgia' matches the main account. Seneca Falls 1848 not checked in the fetched text (standard).

**ev-war-of-1812** — sources: Wikipedia: War of 1812; Wikipedia: Siege of Detroit; Wikipedia: Battle of Queenston Heights; Wikipedia: Burning of Washington; Wikipedia: Treaty of Ghent.
- story (wrong): “into surrendering Detroit without a fight” → “into surrendering Detroit after only a brief bombardment”. There was an artillery exchange that killed several American soldiers before Hull surrendered; there was no infantry battle [Wikipedia: Siege of Detroit]
- story (wrong): “but the invaders were driven back across the Niagara” → “but the invaders were defeated and more than 900 of them captured”. The surrounded Americans surrendered; the British took 955 prisoners [Wikipedia: Battle of Queenston Heights]
- Open: Jefferson's 'mere matter of marching' (letter to William Duane, August 1812) is standard but not found in the retrieved pages. Fewer than half of the 1814 reinforcements were Peninsular veterans; 'sent veterans' is acceptable.

**person-la-salle** — sources: Wikipedia: René-Robert Cavelier, Sieur de La Salle; Dictionary of Canadian Biography: Cavelier de La Salle, René-Robert; Wikipedia: Le Griffon. No errors found.
- Open: Arrival age 23 depends on DCB's 1667 date (Wikipedia: 1666, age 22); within the spread. The Indigenous members' identity as Abenaki and Mahican with families is standard but not in the retrieved pages (DCB gives only '18 Indians'). The Karankawa killing of the last colonists came in 1688-89, after La Salle's death; the story's sequence is loose but not stated as before.

**ev-erik-the-red-settles-greenland** — sources: Wikipedia: Erik the Red; Wikipedia: Norse colonization of North America. No errors found.
- Open: 'A land glimpsed decades earlier': Wikipedia says Gunnbjörn's sighting was nearly a century before; 'decades' is loose but not wrong. 'Head of a sheltered fjord' not explicitly sourced (Qassiarsuk on Tunulliarfik/Eriksfjord).

**ev-founding-of-jamestown** — sources: Wikipedia: Jamestown, Virginia; Wikipedia: Starving Time; Historic Jamestowne: History of Jamestown.
- story (wrong): “archaeologists have confirmed Smith's grim reports of cannibalism” → “archaeologists have confirmed survivors' grim reports of cannibalism”. John Smith left for England in October 1609 and was not there during the Starving Time; the cannibalism accounts come from George Percy and other survivors [Wikipedia: Starving Time]
- Open: Story says 'marshy island', summary says 'peninsula'; it was a peninsula in 1607 (now Jamestown Island). Historic Jamestowne calls it an island; Wikipedia uses both. Consider 'marshy peninsula' for consistency. 'Fewer than forty' after the first winter (usually 38) is consistent with Wikipedia's 'two-thirds died', not stated exactly. Starving Time starting number varies (about 300 Historic Jamestowne vs about 500 Wikipedia); story avoids it.

**ev-quebec-referendum-1995** — sources: Wikipedia: 1995 Quebec referendum; Wikipédia: Référendum de 1995 au Québec; Wikipedia: Jacques Parizeau; Wikipedia: Clarity Act; Wikipedia: 2026 Quebec general election.
- story (unsupported): “On the night of 30 October the result hung on a few thousand votes for hours.” → “On 30 October No won by barely one percentage point.”. No retrieved source says the count hung on a few thousand votes for hours; the final margin was about 54,000 votes [Wikipedia: 1995 Quebec referendum]
- story (unsupported): “and resigned the next day” → “and announced his resignation the next day”. He announced it on 31 October but stayed premier until Bouchard replaced him on 29 January 1996 [Wikipedia: Jacques Parizeau]
- story (unsupported): “No further referendum on sovereignty has been held.” → “No further referendum on sovereignty has been held, though the Parti Québécois, back in power after the October 2026 election, has promised one.”. Current status: the PQ won the 5 October 2026 election and is committed to a referendum in its first term (not before 20 January 2029) [Wikipedia: 2026 Quebec general election]
- Open: The 2026 election outcome (PQ 60 of 127 seats, St-Pierre Plamondon premier) comes from the Wikipedia article as fetched; reconfirm before publishing. The year of Bouchard's illness (1994) is only implied by a citation title.

**ev-arpanet-first-message** — sources: Wikipedia: ARPANET; Wikipedia: Leonard Kleinrock; Wikipedia: Interface Message Processor; Wikipedia: Raytheon BBN.
- story (wrong): “560 kilometres away” → “some 500 kilometres away”. UCLA (Westwood) to SRI (Menlo Park) is about 505 km in a straight line; 560 km overstates it [great-circle calculation from the two campuses' coordinates; no retrieved page gives a figure]
- Open: 'Refrigerator-sized' IMPs is a common description but not stated in the retrieved pages (they describe a ruggedised Honeywell DDP-516). The 'no single point of failure' motivation is Baran's; Davies's motive was efficient time-sharing; acceptable as a simplification.

**ev-wright-brothers-first-flight** — sources: Wikipedia: Wright brothers.
- story (unsupported): “Few newspapers believed the story” → “Few newspapers reported it accurately”. Sources say papers ignored it or printed an inaccurate leaked version; nothing says they disbelieved it [Wikipedia: Wright brothers]
- Open: 'Only after public flights in France in 1908 did the world accept it' is standard; the retrieved part mentions Archdeacon's 1908 retraction but not a full account.

**ev-bering-chirikov-reach-alaska** — sources: Wikipedia: Vitus Bering; Wikipedia: First Kamchatka expedition; Wikipedia: Second Kamchatka expedition; Wikipedia: Georg Wilhelm Steller; Wikipedia: Aleksei Chirikov; Wikipedia (ru): Беринг, Витус.
- story (unsupported): “but fog hid the American shore” → “but he never sighted the American shore”. Retrieved sources say he turned back because of advancing ice and did not see America; none mentions fog in 1728 [Wikipedia: First Kamchatka expedition]
- story (unsupported): “took a decade of hauling” → “took nearly a decade of hauling”. Ordered in 1732, left St Petersburg 1733, sailed 1741: eight to nine years [Wikipedia: Second Kamchatka expedition]
- story (unsupported): “dozens of plants new to science” → “many plant specimens”. No retrieved source gives a count of new plant species from Kayak Island [Wikipedia: Georg Wilhelm Steller; Wikipedia: Kayak Island]
- Open: 'Complained bitterly' about ten hours: Wikipedia only says Steller 'noted' the ratio, though his journal is known for this grievance. Steller's jay was named for him later (consistent). Dates are Old Style per the record note.

**ev-mayflower-and-plymouth** — sources: Wikipedia: Mayflower; Wikipedia: Mayflower Compact; Wikipedia: Plymouth Colony; Wikipedia: Samoset.
- story (unsupported): “about a third of them religious Separatists” → “more than a third of them religious Separatists”. Mayflower article: 'more than one third'; Plymouth Colony: Leiden group about 40% of the adults [Wikipedia: Mayflower]
- story (wrong): “Storms blew them far north of their Virginia patent.” → “Storms and shoals left them at Cape Cod, north of the lands their patent covered.”. Their patent aimed at the Hudson mouth area; after the crossing, the Pollock Rip shoals turned them back from sailing south; 'far north' overstates the distance [Wikipedia: Plymouth Colony; Wikipedia: Mayflower Compact]
- story (wrong): “Half the colonists died the first winter.” → “Nearly half the colonists died the first winter.”. 45 of the 102 passengers died, just under half [Wikipedia: Plymouth Colony]
- Open: Massasoit came with the 22 March delegation that Samoset and Squanto accompanied; 'he brought ... Massasoit' is a slight compression but acceptable.

**ev-reconstruction-era** — sources: Wikipedia: Reconstruction era; Wikipedia: List of African-American officeholders during Reconstruction; Wikipedia: Hiram R. Revels; Wikipedia: List of United States senators from Mississippi; Wikipedia: Colfax massacre; Wikipedia: Compromise of 1877; Wikipedia: Freedmen's Bureau.
- story (wrong): “Some 2,000 Black men held public office during Reconstruction” → “More than 1,500 Black men held public office during Reconstruction”. Wikipedia (citing Foner's directory) gives more than 1,500 officeholders [Wikipedia: Reconstruction era]
- story (wrong): “Hiram Revels of Mississippi took the Senate seat once held by Jefferson Davis.” → “In 1870 Hiram Revels of Mississippi became the first Black US senator.”. Revels held Mississippi's Class 2 seat, left by Albert G. Brown in 1861; Davis had held the Class 1 seat (later Adelbert Ames) [Wikipedia: List of United States senators from Mississippi; Wikipedia: Hiram R. Revels]
- story (unsupported): “Republicans kept the presidency for Rutherford B. Hayes by agreeing to withdraw the last federal troops” → “Republicans kept the presidency for Rutherford B. Hayes, who then withdrew the last federal troops in what is usually seen as a bargain with Southern Democrats”. No written record of the deal exists and historians debate whether a formal bargain was made [Wikipedia: Compromise of 1877]
- Open: The Revels-Davis seat claim is widely repeated (contemporary cartoons showed Revels 'in Davis's seat'), but the official seat lists contradict it. 'Hundreds of schools' is an understatement and not directly sourced; Fisk's founding year (1866) not confirmed in the retrieved text. The 'rifle clubs' (South Carolina, 1876) are not named in the retrieved pages but are standard. The Colfax victims were freedmen and state militia, so 'militiamen' is roughly right.

**ev-apollo-11** — sources: Wikipedia: Apollo 11; Wikipedia: Apollo program.
- story (wrong): “landing with roughly half a minute of usable fuel left before an abort would have been called” → “landing with what controllers believed was under half a minute of usable fuel left before an abort would have been called; later analysis found nearer 50 seconds”. Controllers thought about 25 seconds remained, but post-mission analysis put the margin closer to 50 seconds [Wikipedia: Apollo 11]
- Open: The Bay of Pigs timing (17-20 April 1961, five weeks before the speech) is not mentioned in the retrieved pages but is standard.

**person-abraham-lincoln** — sources: Wikipedia: Abraham Lincoln; Wikipedia: Gettysburg Address; Wikipedia: Assassination of Abraham Lincoln; Wikipedia: Petersen House; Wikipedia: Funeral and burial of Abraham Lincoln.
- story (unsupported): “his funeral train retraced in reverse his journey from Springfield to Washington” → “his funeral train largely retraced, in reverse, his 1861 journey from Springfield to Washington”. The route only largely followed the 1861 inaugural journey [Wikipedia: Funeral and burial of Abraham Lincoln]
- Open: 'Read borrowed books by firelight' is traditional biography and not checked in detail.

**ev-mesa-verde-cliff-dwellings** — sources: Wikipedia: Mesa Verde National Park; Wikipedia: Cliff Palace; NPS: Cliff Palace. No errors found.
- Open: WP says the area was 'nearly uninhabited' by 1300 with the last inhabitants leaving c. 1285; 'by about 1285' sits within that spread.

**ev-creation-of-nunavut** — sources: Wikipedia: Nunavut Land Claims Agreement; Wikipedia: History of Nunavut; Wikipedia: Nunavut; Wikipedia: Canadian Eskimo Dog (sled dog slaughter and 2019 apology); Wikipedia: Flag of Nunavut; Wikipedia: Iqaluit; Wikipédia (fr): Nunavut. No errors found.
- Open: The 1992 boundary plebiscite's result is not stated on the retrieved pages (only its existence). WP gives the capital transfer as $1.9 billion over 15 years, other sources about $1.15 billion; 'more than a billion' covers both. Population now ~43,000, so 'about 40,000' is fine.

**ev-ford-assembly-line** — sources: Wikipedia: Ford Model T; Wikipedia (de): Ford Modell T; Wikipedia: Assembly line; Wikipedia: Henry Ford; Wikipedia: Highland Park Ford Plant; Wikipedia: Fordism; Ford Motor Company: The moving assembly line.
- summary (unsupported): “became the first car for ordinary buyers” → “is generally regarded as the first car ordinary buyers could afford”. 'First car for ordinary buyers' overstates; WP: 'generally regarded as the first mass-affordable automobile'. [Wikipedia: Ford Model T]
- summary (unsupported): “more than 15 million Model Ts were sold by 1927” → “about 15 million Model Ts had been built by 1927”. Sources give about 15 million built (Ford called the last car the 15 millionth); 'more than ... sold' overstates. [Wikipedia: Ford Model T]
- Open: The April 1913 date of the magneto experiment and the Sociological Department's home visits are standard (Hounshell) but not stated on any retrieved page. The 370% turnover figure is not on a retrieved page; Fordism article says turnover 'approached 400%', while the Highland Park Plant article oddly gives 31.9%. Web search quota was exhausted, so these could not be settled further.

**ev-louisiana-purchase** — sources: Wikipedia: Louisiana Purchase; Wikipédia (fr): Vente de la Louisiane; US Office of the Historian: Louisiana Purchase; National Archives: Louisiana Purchase Treaty.
- story (unsupported): “the foreign minister, Talleyrand, astonished Livingston by asking what the United States would pay for all of Louisiana; the finance minister, François Barbé-Marbois, then negotiated the sale.” → “Napoleon's ministers astonished Livingston by asking what the United States would pay for all of Louisiana; the treasury minister, François Barbé-Marbois, then negotiated the sale.”. Retrieved en and fr Wikipedia credit the 11 April offer to Barbé-Marbois, not Talleyrand; he was treasury (Trésor public) minister. [Wikipedia: Louisiana Purchase; Wikipédia: Vente de la Louisiane]
- Open: Many classic accounts (based on Livingston's letter of 11 April 1803) say Talleyrand asked the question that day; the retrieved Wikipedia pages credit Barbé-Marbois. The neutral wording covers both. Leclerc's aim to restore slavery is widely held but not stated on the retrieved pages. Per-acre price: sources give 3 to 4 cents; 'roughly three cents' is within the spread.

**ev-us-constitution** — sources: Wikipedia: Constitutional Convention (United States); Wikipedia: Constitution of the United States; Wikipedia: The Federalist Papers.
- story (unsupported): “Fifty-five delegates gathered in Philadelphia in May 1787, officially to revise the Articles.” → “The convention opened in Philadelphia in May 1787, officially to revise the Articles; fifty-five delegates took part over the summer.”. Fifty-five attended in total, but only 30-40 were present on most days and they did not all gather in May. [Wikipedia: Constitutional Convention (United States)]
- story (unsupported): “the sun carved on Washington's chair” → “the sun on the back of Washington's chair”. Madison's notes, which record the remark, describe the sun as painted on the chair's back; avoid 'carved'. [Wikipedia: Constitutional Convention (United States)]
- Open: Franklin's age 81 follows from his January 1706 birth (not re-fetched). The 'windows nailed shut' detail is often called lore, but WP states it; 'behind closed windows' is acceptable.

**ev-shermans-march-to-the-sea** — sources: Wikipedia: Sherman's March to the Sea; New Georgia Encyclopedia: Sherman's March to the Sea; Wikipedia: Sherman's Field Order No. 15; Wikiquote: William Tecumseh Sherman. No errors found.
- Open: Distance: WP gives about 300 miles (480 km); 460 km (~285 mi) is within the usual range. The 'up to 100 km' (60 mi) swath is the common figure but not on a retrieved page (NGE says the wings were 20-40 miles apart). Confederate deserters' plundering not confirmed on retrieved pages; minor.

**person-jacques-cartier** — sources: Wikipedia: Jacques Cartier; Wikipedia: Donnacona; Wikipedia: Hochelaga (village).
- story (wrong): “a palisaded town of perhaps 1,500 people on an island he named for the mountain above it, Mont Royal” → “a palisaded town of perhaps 1,500 to 3,000 people below a mountain he named Mont Royal”. Cartier named the mountain, not the island (the island's name Montreal came later); WP estimates Hochelaga at about 3,000, so give a range. [Wikipedia: Hochelaga (village)]
- Open: WP Donnacona notes that the 1534 account does not name the Gaspé leader, though most accounts identify him as Donnacona. Champlain first came in 1603 (governor 1608), roughly 60-70 years after Cartier; '60 years later' is acceptable.

**ev-battle-of-the-plains-of-abraham** — sources: Wikipedia: Battle of the Plains of Abraham; Wikipédia (fr): Bataille des plaines d'Abraham.
- summary (unsupported): “in a battle of about fifteen minutes” → “in a battle whose decisive clash lasted only about fifteen minutes”. en WP says the battle lasted about an hour; fr WP says the French charge itself lasted 15 minutes, the fighting about two hours. [Wikipedia: Battle of the Plains of Abraham; Wikipédia: Bataille des plaines d'Abraham]

**ev-siege-of-yorktown** — sources: Wikipedia: Siege of Yorktown. No errors found.
- Open: The ~700 km march distance is not given on the page; it is plausible for the Hudson-to-Virginia route.

**ev-klondike-gold-rush** — sources: Wikipedia: Klondike Gold Rush; Wikipedia: Skookum Jim Mason; Wikipedia: Dawson City.
- story (wrong): “News reached the outside world only in July 1897, when the steamer Portland docked in Seattle with miners carrying gold worth about a million dollars.” → “News reached the outside world only in July 1897, when the steamers Excelsior and Portland docked at San Francisco and Seattle with miners carrying more than a million dollars in gold.”. The Excelsior reached San Francisco on 14 July, three days before the Portland; the ~$1.14 million figure is for both ships. [Wikipedia: Klondike Gold Rush]
- summary (unsupported): “Dawson City briefly became the largest Canadian community west of Winnipeg.” → “Dawson City briefly swelled to a town of perhaps 16,000 or more.”. No retrieved source supports the superlative; the NWMP count (~16,000-17,000) would put Dawson below Vancouver and Victoria at the time. [Wikipedia: Dawson City]
- zh: 汉族 means Han Chinese; the Hän are a Yukon First Nation.
- Open: zh '外甥' for Káa Goox assumes he was a sister's son; sources say only 'nephew'. The Vancouver/Victoria comparison is from general knowledge, which is why the superlative is cut rather than corrected.

**ev-french-and-indian-war** — sources: Wikipedia: Battle of Jumonville Glen; Wikipedia: French and Indian War; Wikipedia: Military career of George Washington; Wikipedia: Tanacharison.
- story (wrong): “a 22-year-old Virginia militia officer, George Washington,” → “a 22-year-old Virginia officer, Lieutenant Colonel George Washington,”. In May 1754 Washington was lieutenant colonel of the Virginia Regiment, a provincial unit, not a militia officer [Wikipedia: Military career of George Washington]
- story (wrong): “By the Treaty of Paris (1763) France gave up New France; Spain took Louisiana west of the Mississippi.” → “By the Treaty of Paris (1763) France gave up New France; it had already handed Louisiana west of the Mississippi to Spain in 1762.”. Western Louisiana went to Spain under the Treaty of Fontainebleau (1762), not the Treaty of Paris [Wikipedia: French and Indian War]
- Open: Walpole line: no retrieved page (Wikiquote Walpole, Jumonville Glen, Walpole articles) mentions it at all, so neither the attribution nor the story's 'probably wrongly' could be checked; the story already hedges, so it is left as is. Tanacharison is labelled Seneca in Wikipedia's infobox but described as a Mingo leader, possibly Catawba-born; 'Seneca ally' is conventional. Summary 'land east of the Mississippi' omits that New Orleans went to Spain (acceptable simplification).

**ev-japanese-american-incarceration** — sources: Wikipedia: Internment of Japanese Americans; Wikipedia: Japanese American service in World War II; Wikipedia: Korematsu v. United States; Wikipedia: Commission on Wartime Relocation and Internment of Civilians; National Archives: Personal Justice Denied; Wikipedia: Internment of Japanese Canadians.
- story (unsupported): “concluded that the removal had been caused by "race prejudice, war hysteria and a failure of political leadership".” → “concluded that the removal had been caused by race prejudice, war hysteria and a failure of political leadership.”. Exact report wording could not be retrieved; Wikipedia gives 'racial prejudice, wartime hysteria...' (the Civil Liberties Act's wording), so paraphrase rather than quote [Wikipedia: Commission on Wartime Relocation and Internment of Civilians]
- Open: Report date: National Archives dates Part 1 of Personal Justice Denied December 1982 (recommendations June 1983); Wikipedia's CWRIC article says the findings were issued in 1983. The story's 'In 1983' is within that spread. Canada paid $21,000 per survivor (not stated in the story, fine).

**ev-beaver-wars** — sources: Wikipedia: Beaver Wars; Wikipédia (fr): Hurons-Wendat; Wikipedia: Sainte-Marie among the Hurons; Wikipedia: Jean de Brébeuf; Wikipedia: Wyandot people. No errors found.
- Open: 'Perhaps 20,000' sits within estimates (18,000 in 1634; 20,000-30,000 earlier). zh '基督徒岛' for Christian Island is a literal rendering; acceptable.

**ev-emancipation-proclamation** — sources: Wikipedia: Emancipation Proclamation; National Archives: The Emancipation Proclamation; Wikipedia: Juneteenth.
- story (wrong): “His cabinet advised him to wait for a victory” → “Secretary of State William Seward advised him to wait for a victory”. The advice to wait came from Seward (warning of a 'last shriek of retreat'); the cabinet was divided, Stanton supported immediate issue [Wikipedia: Emancipation Proclamation]
- story (unsupported): “and he remarked that if his name” → “and he reportedly remarked that if his name”. The remark comes from later recollections (not found in retrieved sources); hedge [not retrieved]
- story (unsupported): “The proclamation did not apply to the loyal border states,” → “The proclamation did not apply to the loyal border states or to Union-held Tennessee and parts of Louisiana and Virginia,”. Exemptions also covered Tennessee, New Orleans and 13 Louisiana parishes, and Virginia counties incl. future West Virginia [Wikipedia: Emancipation Proclamation]
- summary (unsupported): “It freed few people at once” → “It immediately freed only some tens of thousands of people”. Wikipedia: about 25,000-75,000 freed at once where the army was present; 'few' understates [Wikipedia: Emancipation Proclamation]
- zh: '南方邦联' is the standard, unambiguous rendering of the Confederacy
- Open: Could not retrieve a source for the 1 January reception/handshake story, the numb arm, or Douglass waiting at Tremont Temple for late-evening telegraph news (Wikipedia Emancipation Proclamation, Tremont Temple, Frederick Douglass and Wikiquote checked; NPS/Wikisource/Gutenberg URLs failed). These are standard (Frederick Seward's recollection; Douglass's Life and Times) and left in place, with the Lincoln remark hedged.

