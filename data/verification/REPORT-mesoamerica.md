# Verification report: mesoamerica

## 2026-11 expansion

New dataset covering Mexico, Central America and the Caribbean, 1–2025 CE: 124 events, 37 people, 17 places, 33 polities (211 records), 85 stories.

### 1. Pipeline

- `validate-data mesoamerica`: 0 errors. 32 warnings: 31 "no qid" (events with no Wikidata item, e.g. individual Classic Maya wars, the Maní auto-da-fé) and 1 cross-dataset link to `person-christopher-columbus` (europe).
- `wd.mjs enrich mesoamerica`: 284 QIDs, 144 Commons images.
- `build-data`: 48 auto-diffs, all resolved in `resolutions/mesoamerica.json` (0 open): 41 keep-ours, 7 disputed (Lady Six Sky born, Malintzin died, Sor Juana born, Teotihuacan from/to, Chichen Itza from/to; all carry confidence medium/low and a note).
  - 25 coordinate diffs: mostly Wikidata country centroids versus our marker at the real locus; three Wikidata coordinates are plainly wrong (Noche Triste in Sonora, Tacky's Revolt in Brazil, Mexican War of Independence in Canada); Yaxchilan Lintel 24's Wikidata item is the object in the British Museum.
  - Date diffs: Wikidata records another phase (Citadelle completion 1820, Haitian Revolution 1804, Cuban Revolution 1959, Guatemala conquest to 1697, cocoliztli 1545–1631 as a group) or another polity convention (New Spain 1521 vs 1535, Mexico 1810, Cuba 1898, Saint-Domingue 1626).

### 2. Source URLs

- Wikipedia: all 151 en.wikipedia URLs checked against Wikidata sitelinks via SPARQL (the Wikipedia API was rate-limited). 15 titles corrected: Maya names now use the ʼ (U+02BC) spelling of the article titles; "Secession of Panama from Colombia", "Purépecha Empire", "Haitian independence debt", "Siege of Havana", "Tetzcoco (altepetl)", "Zacatecas (city)", "La Respuesta a Sor Filotea de la Cruz", "Juana Inés de la Cruz". "Hieroglyphic Stairway" (no article) replaced with "Copán".
- Britannica (blocks automated fetches, HTTP 403): every path was checked against Wikidata P1417 (Britannica Online ID). 63 paths confirmed, several after correction (`place/Palenque-ancient-city-Mexico`, `biography/Cesar-Augusto-Sandino`, `biography/Henry-Morgan-Welsh-buccaneer`, `biography/Pancho-Villa-Mexican-revolutionary`, `place/Viceroyalty-of-New-Spain`, `place/Juarez-Mexico`, `place/Morelia-Mexico`, `place/United-Provinces-of-Central-America`; country "History" sub-pages replaced by the country article). 6 unconfirmable paths turned into title-only citations (muralism, Pacal, Oaxaca city, Yaxchilán, Tarascan, maroon).
- UNESCO: all 19 World Heritage list IDs confirmed via Wikidata P757.
- Three dead links (Texas A&M Port Royal project, Newberry Popol Vuh page, NASA 2012 page) became title-only citations.

### 3. Spot-check (46 of 211 new records, about 22%, beyond the 48 diff resolutions)

**Ruler reigns: all 33 polities (128 rulers with QIDs) against Wikidata P39 start/end.** 30 flags, mostly from aggregation across several offices (Weyler, Balaguer, Juárez as governor, AMLO as mayor). Where we keep Martin & Grube over Wikidata: Yik'in Chan K'awiil ends 746 (not 755), Yuknoom Took' K'awiil 702–731 (not 701–736), K'an Joy Chitam II to c. 721 (Wikidata stops at his capture by Toniná in 711). Tariácuri 1300–1350 kept (Wikidata 1350–1408; the Relación de Michoacán chronology is uncertain, polity confidence medium). Wikidata has impossible birth years for Spearthrower Owl (400), Yohl Ik'nal (600) and Acamapichtli (1400); our records do not use them.

**Places (6) against Wikipedia:**
- San Cristóbal de las Casas: Villa Real 1528, Ciudad Real 1536, San Cristóbal 1829, "de las Casas" 1848, full name restored 1943. Confirmed.
- Port-au-Prince: founded 1749, capital 1770, Port-Républicain from 1793. Confirmed.
- Calakmul: named by Lundell in 1931; ancient names Ox Te' Tuun / Chiik Naab'. Confirmed.
- Morelia: Nueva Ciudad de Michoacán 1541, Valladolid 1545, Morelia 1828. Confirmed.
- **Oaxaca, corrected:** Antequera now starts at the 1529 refoundation (was 1526), with a 1521–1529 conquest entry and a note.
- **Havana, corrected:** capital flag now from 1553, when the governors moved there (was 1607); a note gives 1607 as the formal date.

**Events (4):**
- Tierra Blanca Joven: 431 ± 2 CE attributed to Smith et al., PNAS 2020, confirmed against the article itself; the rival 539/540 date is cited.
- Founding and fall of Mayapan: 1220s founding, 1441 Xiu-led revolt, population about 15,000. Confirmed.
- **Cocoliztli, corrected:** the resolution had cited the wrong article URL; it now cites Vågene et al. 2018.

**People (3):**
- Sandino: Niquinohomo, the Tampico refinery, Ocotal on 16 July 1927, El Chipote, killed in Managua in 1934 on Somoza's orders. Confirmed.
- Óscar Romero: ordained in Rome 1942, bishop of Santiago de María 1974, archbishop February 1977, killed in the hospital chapel 1980, canonised 2018. Confirmed.
- Frida Kahlo: accident 1925, marriage 1929, Detroit 1932, Julien Levy show 1938, Paris and the Louvre's purchase of *The Frame* 1939, died in Coyoacán 1954. Confirmed.

**Other corrections during curation:**
- Pakal's QID: Q641749 was the wrong item, now Q371384.
- Empress Carlota's QID: Q232402 was Louise of Sweden, now Q154971.
- A Jasaw Chan K'awiil person record was dropped because Wikidata's dates were unreliable.
- Long verbatim quotations in stories (Montesinos, Landa, the Popol Vuh, the Tlatelolco plaque, Romero, Boisrond-Tonnerre, Sor Juana) were replaced with paraphrase.
- Stories were added to the two importance-4 events that lacked one.

### 4. Known gaps

- Pre-Columbian dates rest on the GMT Long Count correlation and on post-conquest chronicles. Toltec and Mixtec rulers are marked as legend or low confidence.
- Monte Albán and Mayapan have no named rulers; Teotihuacan has only Spearthrower Owl, known from Tikal inscriptions.
- The 12th–14th centuries are thin (1–2 events per century).
- Not yet covered: the Lesser Antilles beyond Barbados and St Kitts; Belize, Honduras, El Salvador, Nicaragua and Costa Rica as polities (Somoza era included); British, Dutch and Danish Caribbean colonies as polities.

## 2026-11 review

Independent reviewer, branch `data/mesoamerica` (PR #21). The branch was merged with `origin/feat/world-regions` (living people, Wikidata back-off) before editing.

### Sample

- **Structured fields and summaries of all 211 curated records** (124 events, 37 people, 17 places, 33 polities): years, end years, ISO dates, born/died, journey stops, place-name ranges, every ruler reign, coordinates and zh renderings. This is well beyond the 30% target and includes every importance ≥4 record. The 46 records in the curator's spot-check were not re-counted toward the target.
- **30 stories read in full**: Arrival of strangers at Tikal, founding of the Copán dynasty, burning of Teotihuacan, Caracol defeats Tikal, Dos Pilas, Tikal defeats Calakmul, execution of 18 Rabbit, Classic Maya collapse, rise of Tula, Dresden Codex, founding of Tenochtitlan, Triple Alliance, Tarascan defeat of Axayacatl, Spanish conquest of the Aztec Empire, Noche Triste, fall of Tenochtitlan, apparitions of Guadalupe, auto-da-fé at Maní, Haitian Revolution, Haitian Declaration of Independence, Grito de Dolores, Panama Canal, Mexican Revolution, Cuban Revolution, Cuban Missile Crisis, Guatemalan Civil War, Pakal, Eight Deer, Toussaint Louverture, Benito Juárez.
- **Checked against**: Martin & Grube, *Chronicle of the Maya Kings and Queens* (2nd ed.) and Mesoweb conventions for Maya reigns and day dates; every quoted Long Count recomputed with GMT 584283/584285/584286 in both calendars; English Wikipedia article text (API extracts) for contested dates; Wikidata entity JSON for every claimed Wikidata error; zh.wikipedia zh-cn variant titles (via en→zh langlinks) for Nahuatl, Maya, Mixtec and Taíno names; UNESCO list IDs against site names.

### Resolutions reviewed

- The 7 `disputed` verdicts (Lady Six Sky born, Malintzin died, Sor Juana born, Teotihuacan from/to, Chichen Itza from/to) hold: each record carries confidence medium/low and a note.
- **Claimed Wikidata errors, corrected statement.** The birth "years" 400 (Spearthrower Owl, Q1291562), 600 (Yohl Ik'nal, Q1151465) and 1400 (Acamapichtli, Q335525) are **century-precision** values (precision 7), meaning "4th / 6th / 14th century". They are coarse, not impossible, and the build already ignores them (precision < 9). The §3 statement above that Wikidata has "impossible birth years" is therefore wrong.
- Confirmed Wikidata errors: Noche Triste P625 = 30.664 N, 109.235 W (Sonora); Tacky's War P625 = 2.85 N, 51.13 W (Amapá, Brazil); Mexican War of Independence P580 = 1800-09-16 (should be 1810). The war's "coordinate in Canada" is not a P625 value: it comes from P276 = Q19464773 ("Northern America and Mexico"), a macro-region centred at 50 N, 110 W; the resolution reason was rewritten to say so.
- `polity-guatemala:from` resolution rewritten for the corrected start year (below).

### Corrections

| Record | Old | New | Reason / source |
| --- | --- | --- | --- |
| `ev-tikal-defeats-calakmul` date, summary, story | 5 August 695 | 8 August 695 | 9.13.3.7.18 given as in Martin & Grube (Gregorian, 584285), the convention the dataset already uses for 18 Rabbit (3 May 738) and Pakal's accession (29 July 615). The note gives the Julian (5 Aug) and 584283 (3 Aug) equivalents. |
| `ev-tikal-defeats-calakmul` story | victory rites "exactly 260 days after the anniversary of Siyaj K'ahk's arrival" | rites 13 days later, with Jasaw shown in Teotihuacan-style war dress | The 260-day claim was unsupported (no source found; the arithmetic does not work). The 13-day interval (9.13.3.7.18 to 9.13.3.8.11) is kept. |
| `person-pakal` story | died 28 August 683 | 31 August 683 | Same convention as above (Martin & Grube); a note now gives the Julian date. |
| `ev-execution-of-18-rabbit` story | captured and beheaded "the same day" | captured and had him decapitated | Only one date (9.15.6.14.6) is recorded. A note on the date convention was added. |
| `ev-founding-of-dos-pilas` summary | "fought his own brother" | "his probable half-brother, the king of Tikal" | The relationship is inferred (Martin & Grube), and the record's own story already says half-brother. |
| `ev-burning-of-teotihuacan` story zh | 后古典早期（Epiclassic） | 末古典期（Epiclassic） | Mistranslation: Epiclassic is not the Early Postclassic. The en wording was also fixed. |
| `ev-panama-canal-opens` | "some 25,000" died; "about 150,000" Caribbean workers; opened "eleven days after the First World War began" | "more than 25,000"; "tens of thousands"; "less than three weeks after the war broke out in Europe" | The record's own note gives about 22,000 + 5,600 deaths. The 150,000 figure has no source in the record. The war began on 28 July 1914, 18 days before the opening. |
| `ev-haitian-declaration-of-independence` summary | "second independent republic" | "second independent state … first Black-led republic" | Haiti became an empire in 1804. The zh text already said 国家. |
| `polity-first-mexican-empire` summary | "from Oregon country" | "from the 42nd parallel (the border with Oregon Country)" | The Adams–Onís line formed the northern border. |
| `polity-tarascan` summary; `ev-tarascan-defeat-of-axayacatl` story | "the only one the Aztecs never conquered" | "the largest the Aztecs never conquered" | Tlaxcala, Metztitlan, Yopitzinco and Tututepec also stayed independent. |
| `polity-guatemala` from | 1841 | 1839 | Guatemala declared itself separate from the federation on 17 April 1839 (Britannica; Woodward). |
| `person-henry-morgan` zh | 太子港（今卡马圭） | 普林西比港（今卡马圭） | 太子港 is Port-au-Prince. |
| `person-eight-deer` stop 1097 | "Nose pierced as a lord; rules Tilantongo" at Tilantongo | "Becomes lord of Tilantongo after his nose-piercing" | The nose-piercing by Four Jaguar did not take place at Tilantongo. |
| `person-eight-deer` story | Lady Thirteen Serpent "a granddaughter of his half-brother's killer" | "a princess of a rival royal house" | The genealogical claim could not be confirmed. |
| `person-frida-kahlo` summary | "Crippled by polio" | "Left with a limp by childhood polio" | Wording. |
| `person-rigoberta-menchu` | died 2025 (placeholder) | died null (living) | Uses the new living-people support. |
| `ev-battle-of-santiago-de-cuba` note | Spanish–American War "left to north-america" | links to the new record | The war is now in this dataset. |

**zh names, per 中文维基 (zh-cn variant titles) and made consistent across records and stories.** These were global replacements in zh text only:
- 特诺奇蒂特兰→特诺奇提特兰; 阿哈雅卡特尔→阿萨亚卡特尔; 伊兹/伊茨科阿特尔→伊斯科阿特尔; 阿维索/阿维措特尔→阿维特索特尔; 特乔特拉拉钦→特乔特拉拉特辛; 卡卡马钦→卡卡马特辛; 坦加霍安→坦加苏安; 阿土伊/阿图埃伊→哈土依.
- 瓦沙克拉胡恩→瓦沙克拉洪; 卡克·蒂利夫·陈·约帕特→卡克·蒂利乌·钱·约帕特; ·陈·→·钱· and 卡威尔→卡维尔 for K'awiil names; 哈萨夫/哈索→哈萨乌 (Jasaw); 尤克努姆·奇恩二世→尤克努姆·钦二世; 伊恰克→伊查克; 卡阿努尔→卡努尔; 齐班切→济班切; 佩特斯巴顿→佩特斯巴通; 投矛器猫头鹰→掷矛器猫头鹰.
- 三方同盟→三国同盟 (阿兹特克三国同盟 is the zh redirect); 埃尔塔津→埃尔塔欣; 博南帕克→波南帕克; 霍亚德塞伦→霍亚德赛伦; 德拉克鲁斯→德拉克鲁兹 (Sor Juana); 韦蒂埃→韦尔蒂埃尔; 拉费里埃尔城堡→拉费里埃城堡; 帕卡尔→巴加尔; 钦祖坦→钦聪灿 (one form for Tzintzuntzan).
- Names now show the zh-wiki form in brackets: 荣冠战争（花之战争）; 八鹿·美洲豹爪（鹿八日虎爪）; Copán founder （亚克库毛）.
- Kept: 蒙特祖马二世 (as briefed; zh-cn title 蒙特苏马二世) and 巴加尔大帝 (this *is* the zh-wiki title; 帕卡尔 is not used there).

### Additions (10 records, all with ≥2 sources, bilingual)

- `ev-spanish-american-war-cuba` (Q12583; Cuban theatre, importance 4, route and story; links Martí and Maceo). The brief assigned it here; the north-america dataset should not add Q12583.
- `person-antonio-maceo` (Q554264), linked from the Ten Years' War and the Cuban War of Independence.
- `ev-mount-pelee-eruption-1902` (Q386230, with story).
- `ev-codex-zouche-nuttall` (Q1106134; 14th century, Mixtec codices).
- Polities `polity-honduras` (1838), `polity-el-salvador` (1841), `polity-nicaragua` (1838), `polity-costa-rica` (1838), `polity-british-jamaica` (Q2526023, 1655–1962) and `polity-martinique` (Q17054, 1635–).
- Related events now link the new polities.
- 6 new auto-diffs, all resolved keep-ours: generic Wikidata points for the war and the codex (London), and polity start years 1821 or 1946 versus the federation exit or the 1635 settlement.

### Pipeline

- `validate-data mesoamerica`: 0 errors.
- `wd.mjs enrich`: 352 entities, 152 images.
- `build-data`: 196 diffs in all, 0 open.

### Left for a human

- The Maya day-date convention (Gregorian/584285, as in Martin & Grube) is now applied to the three day-dated Classic events. Readers used to Wikipedia's Julian dates will see a 3–4-day offset.
- Barbados and Saint-Domingue-era French Antilles beyond Martinique still have no polity; the 12th–14th centuries remain thin.
- UNESCO, British Museum, Library of Congress and Smithsonian URLs return HTTP 403 to automated fetches. Their IDs were checked against the site names, not opened.

## 2026-11 audit (web-sourced)

This is an independent audit. Every check used a source retrieved during the audit (web search results or fetched pages); nothing was checked from memory.

- Seed: `20261118`. A mulberry32 shuffle ran over the 221 records new in this PR, and the first 15 were kept; 6 of them have stories.
- Sample: 15 records (9 events, 3 people, 2 places, 2 polities).

| Record | Claims checked | Source(s) retrieved | Result |
| --- | --- | --- | --- |
| ev-execution-of-18-rabbit | 13th king of Copán; installed K'ak' Tiliw in 724; captured/beheaded 3 May 738; Quiriguá ~48–50 km north; Motagua jade route; Calakmul suspicion; Copán's terse "flint and shield" record; Stela E ~10.6 m | en.wikipedia Uaxaclajuun Ubʼaah Kʼawiil; Quiriguá; Kʼakʼ Tiliw Chan Yopaat; search snippets (Martin & Grube via secondary sites) | Confirmed. The story compresses the taking of the gods (c. 27 Apr) and the beheading (3 May) into one day, which is acceptable at story level |
| polity-chichen-itza | c. 750–1200, dominance to c. 1100, council hypothesis (hedged), K'ak'upakal 869–890 | en.wikipedia Chichen Itza; K'ak'upakal; Penn Museum *Expedition* | Confirmed |
| ev-el-castillo-chichen-itza | 4×91 steps + platform = 365, nine terraces / 18 sections, equinox serpent, 10th–11th c., inner pyramid with chacmool and red jaguar throne inlaid with jade (1930s), Great Ballcourt 168 m, Caracol and Venus, cenote offerings | en.wikipedia El Castillo; Chichen Itza; Lonely Planet | Confirmed |
| person-siyaj-kahk | "Fire Is Born"; Tikal in Jan 378 on the day of the king's death; El Perú, Uaxactun; Yax Nuun Ahiin installed 379 | en.wikipedia Siyaj Kʼakʼ; Chak Tok Ichʼaak I; Stuart, "The Arrival of Strangers" (Mesoweb) | Confirmed. The "last mentioned c. 402" placeholder is not corroborated, but it is already flagged low confidence in the note |
| ev-hieroglyphic-stairway-copan | Temple 26, 62 steps, ~2,200 glyphs, longest Maya text, K'ak' Yipyaj Chan K'awiil, 755 | en.wikipedia Copán; Kʼakʼ Yipyaj Chan Kʼawiil | Confirmed |
| ev-abandonment-of-el-mirador | La Danta among largest by volume; abandonment c. 150 CE; environmental causes | en.wikipedia El Mirador; Guinness (La Danta) | Confirmed |
| ev-arrival-of-strangers-tikal | 8.17.1.4.12, mid-Jan 378, El Perú earlier, "entered the water", Yax Nuun Ahiin 379, Spearthrower Owl, Uaxactun | Stuart (Mesoweb); en.wikipedia Chak Tok Ichʼaak I; Spearthrower Owl; El Perú | Confirmed. Sources put the El Perú arrival 8 or 10 days earlier; the story's "eight days" is within that range |
| ev-founding-of-santo-domingo | 1496 Bartholomew Columbus, east bank of the Ozama, 1502 hurricane and Ovando's move to the west bank, Audiencia 1511 | en.wikipedia Santo Domingo; es.wikipedia Real Audiencia de Santo Domingo (real cédula 5 Oct 1511) | Confirmed |
| place-oaxaca | Huaxyacac garrison 1486, Antequera 1529, Oaxaca after 1821, "de Juárez" 1872 | INAH *Lugares*; en.wikipedia Oaxaca City; Oaxaca | Fixed: the summary glossed Huaxyacac as "among the gourd trees". The tree is the huaje (*Leucaena leucocephala*), so the gloss now reads "among the huaje trees" (zh 瓦赫树（银合欢）之间) |
| person-las-casas | Seville 1484; Hispaniola 1502; Caonao 1513 as chaplain; renunciation at Sancti Spíritus 1514 (Pentecost sermon, Sirach 34); Dominican 1522; Cumaná; Verapaz; Chiapas 1545–46, refusal of absolution; Valladolid 1550–51; *Brevísima* 1552; Madrid 1566; regret over African slavery | en.wikipedia Bartolomé de las Casas; es.wikipedia Matanza de Caonao; Cervantes Virtual; Las Casas timeline | Confirmed |
| ev-decline-of-monte-alban | founded c. 500 BCE, 400 m above the valley, Building J, Danzantes, ~25,000 at peak, Oaxacan barrio at Teotihuacan, decline c. 750–850, Zaachila/Mitla/Lambityeco, Tomb 7 (Caso 1932) | en.wikipedia Monte Albán; EBSCO research starter | Confirmed. Decline dates vary by phase scheme, and the note already says so |
| person-jose-maria-morelos | Valladolid 1765, muleteer, Carácuaro 1799, met Hidalgo at Charo/Indaparapeo on 20 Oct 1810, Cuautla breakout 2 May 1812, Oaxaca Nov 1812, Acapulco 1813, Chilpancingo 1813, shot at San Cristóbal Ecatepec on 22 Dec 1815 | en.wikipedia José María Morelos; Encyclopedia.com ("mestizo"); Mexican commemorative pages on the Charo meeting | Confirmed. His caste label is debated; "mestizo" follows Encyclopedia.com and Oxford Reference |
| polity-guatemala | Secession 17 Apr 1839, republic 21 Mar 1847, rulers' terms, 1944–54, 1954 coup, civil war 1960–96 | en.wikipedia History of Guatemala; Guatemala; Encyclopedia.com | Confirmed |
| place-port-royal | 1655, Cagway, renamed c. 1660 at the Restoration, buccaneers and Morgan, wealth, 7 Jun 1692 earthquake (about two-thirds lost) | en.wikipedia Port Royal; Pitt *Names* journal (1988) | Confirmed |
| ev-aztec-triple-alliance | 1428, Itzcoatl/Nezahualcoyotl/Tlacopan vs Maxtla, Tezozomoc died 1426, Chimalpopoca, siege of more than 100 days, 2:2:1 tribute, Huexotzinco, burning of the histories, Ixtlilxochitl killed in 1418 | en.wikipedia Aztec Triple Alliance; Itzcoatl; Ixtlilxochitl I; History Crunch | Confirmed |

**Error rate:** 1 of 15 records (about 7%), a minor wording error in an etymology. No date, QID, coordinate or zh name needed changing.

The validator reports 0 errors. Enrich and build are clean, with no new auto-diff and 0 open diffs.

## 2026-11 story verification (web-sourced)

A second pass over the `story` texts, every claim checked against a source retrieved in this pass (Wikipedia article text via WebFetch in en/es, plus museum, university, INAH and press pages; search snippets for Britannica-style facts). Nothing was checked from memory.

- **Scope:** 81 of the 87 stories. Skipped: the 6 stories already checked against retrieved sources in the "2026-11 audit (web-sourced)" above (`ev-execution-of-18-rabbit`, `ev-el-castillo-chichen-itza`, `ev-arrival-of-strangers-tikal`, `ev-decline-of-monte-alban`, `ev-aztec-triple-alliance`, `person-las-casas`). The reviewer's 30 stories were re-checked, because that review relied on Martin & Grube and Wikipedia extracts only for contested dates.
- **Result:** 39 of 81 stories (48%) needed a correction or a softened claim; 42 were confirmed as written. The 101 edits (en and zh together) cover wrong numbers (Florentine Codex 60 days, not 70; Puebla 131 French dead, not 460; Maine about 260; Moncada 136 attackers), misattributions (Rosalila is a 571 temple of the 10th king, not a building of the founder; Hidalgo's Guadalupe banner came from Atotonilco), unsupported superlatives ("first building dedicated to a woman", "largest English town after Boston", "last Indigenous community", "hero of Jamaican independence"), wrong dates (Ruz found the stair in 1949; Sor Juana's library 1694; last Haitian debt payment 1947) and legend told as fact (the eagle on the cactus).
- **zh:** every zh story was compared with its en text; each en correction has a matching zh edit. No traditional characters or calques found beyond those fixed.
- **Not resolved (left as written, plausible but no retrieved source):** Geggus's reading of the Lenormand de Mézy meeting (Bois Caïman); the soldiers in plain clothes (Parsley massacre); Landa's informants' cave find (Maní); Carlota's breakdown in Rome. The web-search quota for this session ran out midway, so later checks relied on fetched pages only.
- **Pipeline:** `fmt-data`, `validate-data mesoamerica` (0 errors, 32 warnings as before), `build-data` (0 open diffs). No QID, image or date field changed, so no enrich was needed.

### Stories checked and sources

| Record | Result | Source(s) retrieved |
| --- | --- | --- |
| ev-pyramid-of-the-sun | ok | en.wikipedia Teotihuacan; Šprajc, Latin American Antiquity (15.5° axis; Heyden cave) |
| ev-founding-of-copan-dynasty | fixed | Copán Association (Rosalila); Penn Museum Expedition; en.wikipedia Copán Altar Q, K'inich Yax K'uk' Mo'; Science News (isotopes) |
| ev-tierra-blanca-joven-eruption | ok | en.wikipedia Tierra Blanca Joven eruption (Smith et al. 2020) |
| ev-burning-of-teotihuacan | ok | en.wikipedia Teotihuacan; phys.org on Manzanilla, PNAS 2015 |
| ev-caracol-defeats-tikal | ok | en.wikipedia Caracol (553, 556, 562, Altar 21, hiatus, population) |
| ev-joya-de-ceren-buried | ok | en.wikipedia Joya de Cerén; Discover "New World Pompeii"; Mental Floss |
| ev-founding-of-dos-pilas | ok | en.wikipedia Dos Pilas (629, 648, 679, 761, Vanderbilt palisades) |
| ev-tomb-of-pakal | fixed | en.wikipedia Temple of the Inscriptions; INAH Lakamha' and bulletin 372; ArtDaily (lid) |
| ev-tikal-defeats-calakmul | ok | Mesoweb, "Star War" (Tikal Lintel 3); en.wikipedia Jasaw Chan K'awiil I |
| ev-yaxchilan-lintels | fixed | en.wikipedia Yaxchilan Lintel 24, Lady Xoc; Mesoweb lintel files |
| ev-bonampak-murals | fixed | en.wikipedia Bonampak, Giles Healey; mayaruins.com |
| ev-classic-maya-collapse | ok | Met Heilbrunn timeline (Toniná Mon. 101, 909); en.wikipedia Classic Maya collapse; Cambridge/Hodell drought coverage |
| ev-rise-of-tula | fixed | en.wikipedia Tula; INAH Tula guide (tzompantli); Toltec Empire |
| ev-dresden-codex | fixed | en.wikipedia Dresden Codex; Thompson/Goodman base-date literature |
| ev-fall-of-mayapan | fixed | Archaeology magazine 2022 (Kennett et al.); Sapiens; en.wikipedia Mayapan, Nachi Cocom (Otzmal 1536) |
| ev-founding-of-tenochtitlan | fixed | en.wikipedia Tenochtitlan; Codex Mendoza |
| ev-famine-of-one-rabbit | ok | Therrell & Stahle 2004 (Aztec drought and the curse of One Rabbit); INAH bulletin 696 (2024); Hassig 1981 |
| ev-tarascan-defeat-of-axayacatl | fixed | Encyclopedia.com Axayacatl; en.wikipedia Tangáxuan II, Purépecha Empire |
| ev-templo-mayor-rededication | fixed | en.wikipedia Templo Mayor; phys.org 2010 (Tlaltecuhtli, found Oct 2006) |
| ev-founding-of-la-isabela | fixed | en.wikipedia La Isabela; University of Florida news 2007 (Deagan & Cruxent) |
| ev-montesinos-sermon | ok | en.wikipedia Antonio de Montesinos (21 Dec 1511, Advent IV; Las Casas a witness) |
| ev-spanish-conquest-of-cuba | ok | en.wikipedia Hatuey (Guahabá, basket of gold, Yara 1512, Las Casas) |
| ev-balboa-sights-the-pacific | ok | en.wikipedia Vasco Núñez de Balboa; EBSCO research starter; biography.com (Pizarro in 1513) |
| ev-spanish-conquest-of-the-aztec-empire | fixed | Britannica snippet (22 May–13 Aug 1521); en.wikipedia Fall of Tenochtitlan |
| ev-toxcatl-massacre | fixed | history.com; worldhistory.org; brewminate (Toxcatl) |
| ev-noche-triste | ok | en.wikipedia Fall of Tenochtitlan (1 July 1520, 450–860 Spanish dead); worldhistory.org |
| ev-smallpox-epidemic-of-1520 | fixed | Florentine Codex Bk 12 ch. 29 (wired-humanities); Zócalo Public Square (Bowles) |
| ev-fall-of-tenochtitlan | ok | en.wikipedia Fall of Tenochtitlan; Britannica snippet; worldhistory.org |
| ev-spanish-conquest-of-guatemala | fixed | en.wikipedia Spanish conquest of Guatemala; Iximche |
| ev-apparitions-of-guadalupe | fixed | en.wikipedia Sanctuary of Atotonilco; Our Lady of Guadalupe |
| ev-viceroyalty-of-new-spain-established | ok | en.wikipedia Antonio de Mendoza; Viceroyalty of New Spain |
| ev-cocoliztli-epidemic-of-1545 | fixed | en.wikipedia Cocoliztli epidemics (Acuña-Soto; Vågene et al. 2018) |
| ev-silver-discovered-at-zacatecas | ok | en.wikipedia Zacatecas City (Tolosa, La Bufa, 1546) |
| ev-popol-vuh-written | ok | en.wikipedia Popol Vuh (Ximénez c. 1701, Newberry, 1554–58) |
| ev-auto-de-fe-at-mani | fixed | en.wikipedia Diego de Landa; es.wikipedia Auto de fe de Maní |
| ev-tornaviaje-reaches-acapulco | fixed | en.wikipedia Andrés de Urdaneta |
| ev-kalinago-genocide-of-1626 | fixed | en.wikipedia Kalinago genocide |
| ev-sugar-revolution-in-barbados | ok | en.wikipedia History of Barbados (1673/1684 censuses); Barbados Slave Code |
| ev-morgan-sacks-panama | ok | en.wikipedia Henry Morgan |
| ev-port-royal-earthquake | fixed | en.wikipedia 1692 Jamaica earthquake |
| ev-tackys-revolt | fixed | en.wikipedia Tacky's Revolt |
| ev-british-capture-of-havana | fixed | en.wikipedia Siege of Havana |
| ev-haitian-revolution | fixed | en.wikipedia Saint-Domingue; Haitian Revolution |
| ev-haitian-declaration-of-independence | ok | en.wikipedia Haitian Declaration of Independence (Gaffield 2010, Kew) |
| ev-grito-de-dolores | ok | en.wikipedia Sanctuary of Atotonilco; Grito de Dolores |
| ev-independence-of-central-america | ok | en.wikipedia Act of Independence of Central America |
| ev-haiti-independence-debt | fixed | en.wikipedia Haiti indemnity controversy (NYT 2022) |
| ev-caste-war-of-yucatan | ok | en.wikipedia Caste War of Yucatán |
| ev-filibuster-war | fixed | en.wikipedia William Walker (filibuster) |
| ev-execution-of-maximilian | ok | en.wikipedia Maximilian I of Mexico |
| ev-mexican-muralism | fixed | en.wikipedia Diego Rivera |
| ev-panama-canal-opens | ok | en.wikipedia Panama Canal; William C. Gorgas |
| ev-cuban-war-of-independence | ok | en.wikipedia Cuban War of Independence (Tone: 155–170,000 reconcentration deaths) |
| ev-bois-caiman-ceremony | fixed | en.wikipedia Bois Caïman; Dutty Boukman |
| ev-battle-of-puebla | fixed | en.wikipedia Battle of Puebla |
| ev-mexican-war-of-independence | fixed | en.wikipedia Mexican War of Independence |
| ev-mexican-revolution | ok | en.wikipedia Mexican Revolution |
| ev-us-occupation-of-haiti | ok | en.wikipedia United States occupation of Haiti |
| ev-parsley-massacre | fixed | en.wikipedia Parsley massacre (Turits, Derby) |
| ev-mexican-oil-expropriation | fixed | en.wikipedia Mexican oil expropriation |
| ev-1954-guatemalan-coup | ok | en.wikipedia 1954 Guatemalan coup d'état |
| ev-cuban-revolution | fixed | en.wikipedia Attack on the Moncada Barracks; Granma (yacht); Cuban Revolution |
| ev-cuban-missile-crisis | ok | en.wikipedia Cuban Missile Crisis |
| ev-guatemalan-civil-war | ok | en.wikipedia Guatemalan genocide (440 villages; CEH 1999; Ríos Montt 2013) |
| ev-tlatelolco-massacre | ok | en.wikipedia Tlatelolco massacre |
| ev-nicaraguan-revolution | fixed | en.wikipedia Nicaraguan Revolution |
| ev-assassination-of-oscar-romero | ok | en.wikipedia Óscar Romero |
| ev-1985-mexico-city-earthquake | ok | en.wikipedia 1985 Mexico City earthquake |
| ev-decipherment-of-maya-script | ok | en.wikipedia Maya script; Tatiana Proskouriakoff |
| ev-zapatista-uprising | ok | en.wikipedia Zapatista uprising |
| ev-2010-haiti-earthquake | fixed | en.wikipedia 2010 Haiti earthquake; 2010s Haiti cholera outbreak |
| ev-spanish-american-war-cuba | fixed | en.wikipedia USS Maine (1889); Cuban War of Independence |
| ev-mount-pelee-eruption-1902 | fixed | en.wikipedia 1902 eruption of Mount Pelée |
| person-pakal | fixed | en.wikipedia K'inich Janaab' Pakal |
| person-eight-deer | ok | en.wikipedia Eight Deer Jaguar Claw (legend-based; already framed "according to the codices") |
| person-malintzin | ok | en.wikipedia La Malinche (Townsend; Cholula plot framed as Spanish claim) |
| person-sor-juana | fixed | en.wikipedia Juana Inés de la Cruz |
| person-nanny-of-the-maroons | ok | en.wikipedia Queen Nanny |
| person-toussaint-louverture | ok | en.wikipedia Toussaint Louverture |
| person-benito-juarez | ok | en.wikipedia Benito Juárez |
| person-emiliano-zapata | ok | en.wikipedia Emiliano Zapata |

### Corrections

Each en change has a matching zh change unless noted. Old → new is quoted in short form.

| Record | Old → new | Why | Source |
| --- | --- | --- | --- |
| ev-founding-of-copan-dynasty | “Tunnelling inside the Acropolis in the 1990s, archaeologists of the University of Pennsylvania found the founder's own buildings buried u…” → “Tunnelling inside the Acropolis from 1989 on, archaeologists found the brightly painted Rosalila temple, raised by the tenth king in 571 …” | Rosalila is not one of the founder's buildings: it was dedicated in 571 by the 10th ruler (Moon Jaguar) and found by Ricardo Agurcia in 1989; Sharer's Penn team found Hunal and its tomb in 1995 | asociacioncopan.org (The Importance of Rosalila); Penn Museum Expedition (Hunal); en.wikipedia K'inich Yax K'uk' Mo' |
| ev-tomb-of-pakal | “In 1948 the Mexican archaeologist” → “In 1949 the Mexican archaeologist” | Ruz found the slab and the hidden stairway in 1949, his first season | INAH, Lakamha' (revistas.inah.gob.mx); INAH bulletin 372 (2023) |
| ev-tomb-of-pakal | “covered by a five-tonne lid” → “covered by a carved lid of five to seven tonnes” | Sources give 5 t or 7 t (INAH's 2010s handling: 7 t) | ArtDaily on INAH lowering the slab; search snippets |
| ev-yaxchilan-lintels | “is the first Maya building known to have been dedicated to a woman” → “is one of the very few Maya buildings known to have been dedicated to a woman: in 726 Shield Jaguar consecrated it as the house of his wife” | 'first' unsupported; Inomata and Houston list only two buildings owned by women (Structures 11 and 23); dedication 23 June 726 on Lintel 23 | Mesoweb Yaxchilan lintels; en.wikipedia Lady Xoc |
| ev-yaxchilan-lintels | “in 1882 and shipped Lintels 24 and 25 to London” → “in 1882–83 and shipped Lintels 24 and 25 to London” | Lintel 24 was removed in 1882, Lintel 25 in 1883 | en.wikipedia Yaxchilan Lintel 24 |
| ev-bonampak-murals | “naked captives, their fingernails torn out and bleeding, plead” → “naked captives, blood dripping from their fingers, plead” | Sources describe bleeding fingers; torn-out nails is an interpretation | en.wikipedia Bonampak; mayaruins.com |
| ev-bonampak-murals | “The murals were painted around 791, only” → “The murals were painted around 790–791, perhaps never finished, only” | Ceremonies 790–792; Mary Miller argues the murals were left unfinished | en.wikipedia Bonampak; Carnegie/INAH summaries |
| ev-rise-of-tula | “those of Chichen Itza, 1,200 km away” → “those of Chichen Itza, some 1,100 km away” | Great-circle distance Tula–Chichen Itza is about 1,125 km | coordinates in the dataset (Tula 20.06 N 99.34 W; Chichen Itza 20.68 N 88.57 W) |
| ev-dresden-codex | “and the Long Count of days from a starting point in 3114 BCE.” → “and the Long Count of days from a fixed base date, 4 Ajaw 8 Kumk'u, which later correlations placed in 3114 BCE.” | Förstemann identified the 4 Ajaw 8 Kumk'u base (1887); the 3114 BCE equivalence comes from the later GMT correlation | Thompson/Goodman priority literature (escholarship); GMT correlation summaries |
| ev-fall-of-mayapan | “and a mass grave of dismembered bodies near the main temple, dated to the mid-1400s.” → “and mass graves of hacked and burned bodies, one at the foot of the main temple, dated to the decades of the city's fall.” | Radiocarbon dates on the graves fall in the decades before the fall (Kennett et al. 2022 put the killings 50–100 years before abandonment); 'mid-1400s' too precise | Archaeology magazine 2022 (Kennett et al., Nature Communications); Sapiens, Mayapán radiocarbon |
| ev-founding-of-tenochtitlan | “On a rocky islet in the lake they found the sign the god had promised:” → “On a rocky islet in the lake, the tradition goes, they found the sign the god had promised:” | The eagle-on-cactus sign is founding legend told as fact | en.wikipedia Tenochtitlan; Codex Mendoza fol. 2r |
| ev-tarascan-defeat-of-axayacatl | “In 1520, when Moctezuma's envoys asked the Tarascans for help” → “In 1520, when Mexica envoys asked the Tarascans for help” | The embassy is variously dated 1519–1520 and, if in late 1520, came after Moctezuma's death; the sender is uncertain | en.wikipedia Tangáxuan II; Purépecha Empire |
| ev-templo-mayor-rededication | “The Templo Mayor was rebuilt at least seven times,” → “The Templo Mayor was built in seven main stages,” | Seven temples, i.e. rebuilt six times after the first | en.wikipedia Templo Mayor |
| ev-templo-mayor-rededication | “electricians digging behind the cathedral” → “workers of the electricity company digging behind the cathedral” | They were Comisión Federal de Electricidad workers, not specifically electricians | en.wikipedia Templo Mayor |
| ev-founding-of-la-isabela | “Excavations led by Kathleen Deagan and José María Cruxent in the 1990s” → “Excavations led by Kathleen Deagan and José María Cruxent from the late 1980s” | Intensive excavation began in the late 1980s | University of Florida news 2007; Florida Museum, La Isabela |
| ev-spanish-conquest-of-the-aztec-empire | “Cortés besieged the island city for 93 days” → “Cortés besieged the island city for nearly three months” | Siege dates 22 May–13 August 1521 (83 days); the popular '93 days' does not fit those dates | Britannica (22 May–13 Aug 1521, search snippet); worldhistory.org |
| ev-toxcatl-massacre | “left in command of about 120 Spaniards” → “left in command of a small garrison (80 to 120 Spaniards by different counts)” | Bernal Díaz and others give 80, some accounts 120 | history.com; worldhistory.org; New World Encyclopedia |
| ev-smallpox-epidemic-of-1520 | “It lasted seventy days in Tenochtitlan.” → “Its full force lasted sixty days before it moved on toward Chalco.” | The Florentine Codex (Book 12, ch. 29) gives sixty days | Florentine Codex Book 12 ch. 29 (enl.wired-humanities.org); Virginia Tech DHR excerpt |
| ev-spanish-conquest-of-guatemala | “at their capital, Iximché, on 25 July 1524.” → “at their capital, Iximché, in late July 1524.” | Sources differ: 25 July (feast of St James) in tradition, 27 July 1524 in the conquest narratives | en.wikipedia Iximche; Spanish conquest of Guatemala |
| ev-apparitions-of-guadalupe | “In 1810 Miguel Hidalgo raised a banner of Guadalupe at Dolores,” → “In 1810 Miguel Hidalgo's insurgents took up a banner of Guadalupe at the sanctuary of Atotonilco, days after the cry of Dolores,” | The banner was taken from Atotonilco on 16 September 1810, not raised at Dolores | en.wikipedia Sanctuary of Atotonilco |
| ev-cocoliztli-epidemic-of-1545 | “bled from the nose, ears and eyes, turned yellow, and died within days. The Franciscan Juan de Torquemada later wrote that in 1545 some 8…” → “bled from the nose, eyes and mouth, turned yellow, and often died within a week. Colonial accounts put the dead at some 800,000 in the Va…” | Symptoms per sources are nose/eyes/mouth; the 800,000 figure is cited from colonial accounts (Warinner et al. 2012) and its attribution to Torquemada could not be confirmed; Europeans had lower, not negligible, mortality | en.wikipedia Cocoliztli epidemics |
| ev-auto-de-fe-at-mani | “over three months some 4,500 people were questioned under torture” → “over three months, by one historian's count, some 4,500 people were questioned under torture” | 4,500 questioned / 158 dead are a modern historian's (Clendinnen) reckoning, not in the record's other sources | en.wikipedia Diego de Landa (no figures; 'scores of nobles jailed, many examined'); es.wikipedia Auto de fe de Maní |
| ev-tornaviaje-reaches-acapulco | “Scurvy killed 16 of the crew.” → “Scurvy laid most of the crew low, and only a handful were fit to work the ship.” | No source found for the death toll of 16; Wikipedia says most had scurvy and only 18 could sail the ship | en.wikipedia Andrés de Urdaneta |
| ev-kalinago-genocide-of-1626 | “the last Indigenous community of the eastern Caribbean.” → “the largest surviving Indigenous community of the eastern Caribbean.” | 'last' overstated (Kalinago/Garifuna descendants also live on St Vincent and elsewhere) | en.wikipedia Kalinago genocide; Kalinago |
| ev-port-royal-earthquake | “it had grown into the largest English town in the Americas after Boston, with perhaps 6,500 people” → “it had grown into one of the largest English towns in the Americas, with perhaps 6,500 people in some 2,000 buildings” | 'second only to Boston' not found in sources; population and building count confirmed | en.wikipedia 1692 Jamaica earthquake |
| ev-port-royal-earthquake | “Underwater excavations from the 1960s, and by Texas A&M University in the 1980s,” → “Underwater excavations from 1959 on, notably by Texas A&M University in the 1980s,” | Edwin Link's first excavation, which found the 11:43 watch, was in 1959 | en.wikipedia 1692 Jamaica earthquake |
| ev-tackys-revolt | “Tacky became a hero of Jamaican independence.” → “Tacky is remembered in Jamaica as a hero of resistance, with a monument at Port Maria.” | He is not one of Jamaica's national heroes and had no role in independence; he is commemorated by a monument | en.wikipedia Tacky's Revolt |
| ev-tackys-revolt | “he and his followers broke into the fort at Port Maria” → “he and his followers seized the Frontier and Trinity estates and broke into Fort Haldane at Port Maria” | Precision: the rising began on two estates before the fort | en.wikipedia Tacky's Revolt |
| ev-british-capture-of-havana | “Britain sent more than 50 warships and about 12,000 soldiers.” → “Britain sent some 45 warships, over 160 transports and about 12,800 soldiers.” | 21 ships of the line + 24 lesser warships, 168 other vessels, 12,826 regulars | en.wikipedia Siege of Havana |
| ev-british-capture-of-havana | “In eleven months British merchants” → “During the occupation British merchants” | Occupation lasted about ten to eleven months (Aug 1762 – mid-1763); wording neutralised | en.wikipedia Siege of Havana |
| ev-haitian-revolution | “In 1789 Saint-Domingue produced about a third of the world's sugar and much of its coffee, worked by nearly half a million enslaved peopl…” → “In the 1780s Saint-Domingue supplied about 40 per cent of the sugar and 60 per cent of the coffee consumed in Europe, worked by nearly ha…” | Share stated as 'a third of the world's sugar' is not what sources give (40% of Europe's sugar, 60% of its coffee); white population estimates run 30–45,000, free people of colour 28–32,000 | en.wikipedia Saint-Domingue |
| ev-haiti-independence-debt | “The sum was about ten times Haiti's annual revenue.” → “The first instalment alone was about six times Haiti's annual revenue.” | Sources compare the 30-million first instalment to about six years of revenue; 'ten times' for the total is not supported | en.wikipedia Haiti indemnity controversy (citing NYT 2022) |
| ev-haiti-independence-debt | “the last payments on the related loans were made only in the 1940s and 1950s.” → “the last payments on the related loans were made only in 1947.” | NYT 2022 dates the last payment to creditors to 1947 | en.wikipedia Haiti indemnity controversy |
| ev-haiti-independence-debt | “In July 1825 a French squadron of fourteen warships anchored off Port-au-Prince.” → “In July 1825 the French envoy reached Port-au-Prince, soon backed by a squadron of fourteen warships.” | Mackau arrived on 3 July with La Circé and two men-of-war; the fleet grew to fourteen ships | en.wikipedia Haiti indemnity controversy |
| ev-filibuster-war | “After a third expedition he was captured by the British” → “On a final expedition, in 1860, he was captured by the British” | The 1860 Honduras venture was his fourth (Baja 1853, Nicaragua 1855, 1857 attempt stopped by the US Navy) | en.wikipedia William Walker (filibuster) |
| ev-mexican-muralism | “covered the ministry's two courtyards with 235 panels:” → “covered the ministry's two courtyards with 124 frescoes (1922–1928):” | Rivera's SEP cycle comprises 124 frescoes, finished 1928 | en.wikipedia Diego Rivera |
| ev-battle-of-puebla | “had some 4,000 to 5,000 men, many poorly armed.” → “had about 4,000 men, many poorly armed.” | Battle strength tables give about 3,800 Mexican troops | en.wikipedia Battle of Puebla |
| ev-battle-of-puebla | “Lorencez lost around 460 dead.” → “Lorencez lost some 470 men killed or wounded.” | French losses: 131 killed, 345 wounded (476 casualties), not 460 dead | en.wikipedia Battle of Puebla |
| ev-mexican-war-of-independence | “Perhaps 200,000 to 500,000 people had died in eleven years of war.” → “Estimates of the dead in eleven years of war run from about 250,000 to 600,000.” | Aligned with the range cited in the standard sources | en.wikipedia Mexican War of Independence (infobox) |
| ev-bois-caiman-ceremony | “The French colonist Antoine Dalmas, writing in 1793, described the scene:” → “The French colonist Antoine Dalmas, in a history published in 1814, described the scene:” | Dalmas's account appeared in print in 1814 (written in the 1790s) | en.wikipedia Bois Caïman |
| ev-bois-caiman-ceremony (note) | “(Dalmas, 1793)” → “(Dalmas, published 1814)” | same | same |
| ev-parsley-massacre | “to pay Haiti 750,000 dollars, of which only a fraction was paid.” → “to pay Haiti 750,000 dollars; 525,000 was paid, and almost none of it reached survivors.” | The Dominican government paid $525,000 (about 70%); survivors received about 2 cents each | en.wikipedia Parsley massacre (Turits) |
| ev-mexican-oil-expropriation | “Britain broke off relations and the companies organised a boycott,” → “Diplomatic relations with Britain were broken off and the companies organised a boycott,” | Britain withdrew its ambassador and Mexico then broke relations; it was not a unilateral British break | en.wikipedia Mexican oil expropriation |
| ev-cuban-revolution | “led about 160 young men in an attack on the Moncada barracks in Santiago de Cuba,” → “led some 135 young men in an attack on the Moncada barracks in Santiago de Cuba (two dozen more struck at Bayamo),” | 136 rebels attacked Moncada; 24 more were assigned to Bayamo (160 in all) | en.wikipedia Attack on the Moncada Barracks |
| ev-nicaraguan-revolution | “and a war costing some 30,000 lives followed.” → “and a war costing some 30,000 to 40,000 lives followed.” | Contra war deaths 1981–1990 are estimated at 32,000–43,000 | en.wikipedia Nicaraguan Revolution |
| ev-2010-haiti-earthquake | “and lasted about 35 seconds.” → “and lasted less than half a minute.” | Shaking lasted under 30 seconds | en.wikipedia 2010 Haiti earthquake |
| ev-spanish-american-war-cuba | “killing 266 American sailors.” → “killing some 260 American sailors.” | Counts vary (261 in the casualty breakdown, 266/268 including later deaths) | en.wikipedia USS Maine (1889) |
| ev-mount-pelee-eruption-1902 | “buried a sugar works and killed dozens of workers.” → “buried a sugar works and killed as many as 150 people.” | The 5 May lahar buried about 150 people at the sugar works | en.wikipedia 1902 eruption of Mount Pelée |
| person-pakal | “Over seven decades he raised the Palace with its unique four-storey tower, its galleries of stucco and its sculpted captives in the East …” → “Over seven decades he greatly enlarged the Palace, adding houses with stucco galleries and, in the East Court, sculpted captives,” | Pakal built Houses A–E of the Palace; the four-storey tower is not attributed to him in the sources (generally dated to his successors) | en.wikipedia K'inich Janaab' Pakal |
| person-pakal | “he had outlived most of his children.” → “he had outlived his wife and at least one of his sons.” | Two sons survived him and ruled; he presided over the burial of a third son, Tiwol Chan Mat | en.wikipedia K'inich Janaab' Pakal |
| person-sor-juana | “she sold her library around 1693, signed a renewal of her vows in blood, and died two years later” → “she gave up her library in 1693–94, renewed her vows in a text signed in her own blood, and died in 1695” | The library and instruments were sold (or confiscated) in 1694; she died in April 1695 | en.wikipedia Juana Inés de la Cruz |
