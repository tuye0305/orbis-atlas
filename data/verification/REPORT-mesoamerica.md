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
