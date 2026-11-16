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
