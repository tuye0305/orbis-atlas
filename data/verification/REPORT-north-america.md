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
