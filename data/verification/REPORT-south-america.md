# Verification report: south-america

Dataset: `data/south-america/`. It holds 89 events, 36 people, 17 places and 32 polities (174 records), with 71 stories.

## Process

1. Records were drafted from standard scholarly works, cited in each record's `sources`: Hemming, Bauer, MacQuarrie, Lynch, Walker, Boxer, Whigham, Sater, Schwarcz & Starling and others. UNESCO, Britannica and Wikipedia are used as secondary checks.
2. Every QID was confirmed against its Wikidata label and description. `ev-fall-of-vilcabamba` has no Wikidata item. The Humboldt event uses the expedition item Q130639025.
3. `wd.mjs enrich` produced 49 auto-diffs, all resolved in `resolutions/south-america.json`: 39 keep-ours and 10 disputed.
   - Most are Wikidata coordinates set at a country centroid (Peru at -9.4,-76 appears four times), at the wrong place (Copenhagen, New Zealand, Patagonia, Santa Catarina), or at a rounded centroid.
   - Others are polity start/end conventions. For example, Wikidata dates modern states from their first junta or declaration, while we start them after separation from Gran Colombia or after recognition.
4. Source URLs were checked:
   - Wikipedia titles: all 115 checked through the MediaWiki API. Two missing titles were replaced.
   - Britannica slugs: checked against Wikidata P1417 and Britannica search. Nine wrong slugs were corrected (Nazca Lines, May Revolution, War of the Triple Alliance, Manco Inca Yupanqui, Garcilaso, Hiram Bingham, Cuzco, Moche, Mapuche). Two unverifiable biography slugs (Túpac Amaru I, Princess Isabel) were replaced with Britannica's history-of-Peru and history-of-Brazil articles.
   - UNESCO list numbers: checked against Wikidata P757.
   - Britannica and UNESCO block scripted fetches with Cloudflare, so their pages could not be fetched directly.

## Spot-check (36 of 174 records, 21%)

Each record below was checked against at least one independent source by web search, beyond the sources already in the record.

| Record | Checked | Result |
| --- | --- | --- |
| ev-nazca-lines | Britannica (Nazca culture c. 200 BCE–600 CE); UNESCO 700 | ok; note gives the 500 BCE–700 CE construction span |
| ev-royal-tombs-of-sipan | Strayer (Macmillan) textbook; Andina | ok (c. 250 CE, medium) |
| ev-lady-of-cao | Wikipedia; Andina | ok (c. 450 CE, medium) |
| ev-pikillacta | McEwan (ed.), *Pikillacta* (2005), dating chapter; Eos | ok; radiocarbon dates span AD 650–1045 |
| ev-el-dorado-guatavita | Rodríguez Freyle; Museo del Oro | ok (low confidence; legend-based) |
| ev-arauco-war | Wikipedia; icarito.cl | disputed periodisation; already medium with a note |
| ev-columbus-reaches-paria | Wikidata Q2843133 (third voyage 1498–1500) | ok; QID added |
| ev-orellana-descends-the-amazon | Wikidata Q15475785; Carvajal's account | ok; QID added; **Wikidata gives the end as 26 Aug 1541, but it was 1542** |
| ev-potosi-silver | Library of Congress blog; Wikipedia | ok (1545; some sources give a first find in 1544) |
| ev-battle-of-tucapel | Wikipedia; Memoria Chilena; Britannica (Lautaro) | ok (25 Dec 1553) |
| ev-palmares | BlackPast; Wikipedia (Zumbi) | ok (fall of Macaco 1694; Zumbi killed 20 Nov 1695) |
| ev-humboldt-climbs-chimborazo | Wikidata Q130639025 (June 1799 – Aug 1804); Wulf | reframed as the whole expedition (1799–1804); climb date in the note |
| ev-may-revolution | Britannica (May Revolution; cabildo abierto) | ok |
| ev-paraguayan-war | Britannica (Paraguay: War of the Triple Alliance) | ok (López killed at Cerro Corá, March 1870) |
| ev-machu-picchu-1911 | Britannica (Hiram Bingham) | ok (24 July 1911, guide Melchor Arteaga) |
| ev-lei-aurea | Encyclopedia.com; Brazilian sources | ok; about 700,000 freed (estimates range 600–720k) |
| ev-1960-valdivia-earthquake | USGS historic summary; Britannica | ok (M9.5; 61 deaths in Hawaii; 138 in Japan) |
| ev-falklands-war | Britannica; SSAFA; Wikipedia (Belgrano) | ok (649 / 255 / 3; 323 on the Belgrano) |
| ev-conquest-of-the-desert | Wikipedia; Rock | ok; **the zh story had 6月25日 for 25 May 1879, now fixed** |
| ev-christ-the-redeemer | Britannica | ok (inaugurated 12 Oct 1931) |
| ev-internal-conflict-in-peru | CVR *Informe Final* | ok (began 17 May 1980 at Chuschi) |
| person-pachacuti | Britannica (reign 1438–71); Encyclopedia.com (c. 1391) | birth year disputed; **the note wrongly credited 1418 to Rowe, now fixed** |
| person-atahualpa | Britannica | ok (c. 1502, disputed) |
| person-aleijadinho | infopedia; UFMG CEIB bulletin; Wikipedia | 1730/1738 dispute recorded |
| person-manco-inca | Britannica (reign 1533–45); several sources | ok (killed 1544) |
| person-tupac-amaru | Britannica (history of Peru) | ok (beheaded in Cuzco, 1572) |
| person-inca-garcilaso | Britannica (Royal Commentaries) | ok (*Comentarios* 1609/1617) |
| person-hiram-bingham | Britannica | ok (1875–1956) |
| person-zumbi | Encyclopedia.com; BlackPast | ok (c. 1655–1695) |
| place-asuncion | Britannica | ok (founded 1537) |
| place-cusco | Britannica (Cuzco); UNESCO 273 | ok |
| polity-moche | Britannica (1st–8th century CE) | ok |
| polity-muisca | Wikipedia chronology table; *Arqueología Iberoamericana* (2024) | disputed chronology; kept 1000 |
| polity-wari | Britannica (Huari); McEwan | ok (collapse c. 1000) |
| polity-neo-inca-state | Wikipedia; Britannica (Manco Inca) | ok (1537–1572) |
| polity-viceroyalty-of-rio-de-la-plata | Wikipedia; Britannica | ok (to 1814, Montevideo) |

## Wikidata problems noticed (outside this dataset)

- Q311436 (Juan Manuel de Rosas): the English label has been vandalised to "Juan Manuel de Rosas meow".
- Q1508820 (Battle of Junín) is dated 1825; the battle was on 6 August 1824.
- Q15475785 (Orellana's descent of the Amazon) ends on 26 Aug 1541; the correct year is 1542.
- Q2620036, Q1763918, Q152004 and Q852133 use a Peru centroid as their coordinate. Q852133 also has 2002 as its start.

## Known gaps

- There is no `person-charles-darwin`: `data/europe` had no Darwin person record, and I avoided creating one in parallel with the Europe agent. The Beagle event points to `ev-origin-of-species` in its note.
- No Humboldt or Che Guevara person records, to avoid cross-region id collisions.
- Guyana, Suriname and French Guiana are covered thinly.
- Amazonian societies after 1500 and 20th-century Indigenous movements could be deepened.

## 2026-11 review

Independent reviewer, working on top of the curator's branch. The curator's spot-check covered 38 records. This review sampled **108 other records (62% of 174)**:
- all 50 stories that the curator had not sampled, read in full in English, with the zh text read for the 9 records corrected below;
- 17 people, 15 polities (with ruler lists), 16 events without stories and 10 places, at field level (years, stops, `names` ranges, rulers, coordinates, summary claims).

Every QID label and description was compared with the cached Wikidata entity, and every zh name with its 中文维基 title and zh label. Every event coordinate was checked against the site it names. The checks used Britannica, Wikipedia (as a second source only), the Darwin Correspondence Project, OpenStreetMap/Nominatim for coordinates, and the works cited below.

### Corrections

| Record | Old | New | Reason / source |
| --- | --- | --- | --- |
| ev-cabral-reaches-brazil (story) | "His letter lay forgotten…" (reads as Cabral's) | "Caminha's letter…" | The letter rediscovered in 1773 is Pero Vaz de Caminha's; the zh text already said so. |
| ev-chaco-war (story) | fighting "broke out at Boquerón in 1932" | the Pitiantuta clash of June 1932 escalated into war; first great battle at Boquerón in September | Britannica (Chaco War); Encyclopedia.com (Pitiantuta). |
| ev-rebellion-of-tupac-amaru-ii (story) | La Paz besieged "for a total of more than 100 days" | the first siege lasted 109 days from March, the second ran from August to October | Thomson, *We Alone Will Rule*; Wikipedia (Túpac Katari). The old wording understated the sieges, which lasted about six months in all. |
| person-eva-peron (story) | body "hidden in Italy for 16 years" | hidden for 16 years, most of them in a Milan grave under a false name; handed to Perón in 1971; back in Argentina in 1974 | Fraser & Navarro, *Evita*: seized 1955, buried in Milan 1957–71. |
| person-pedro-ii-of-brazil | "corresponded with Darwin, Pasteur and Victor Hugo"; 1840 stop "Declared of age and crowned" | Darwin dropped; stop reads "Declared of age (crowned in July 1841)" | The Darwin Correspondence Project has no letters between them, only Hooker's 1877 letters about the Emperor wishing to meet Darwin. He was crowned on 18 July 1841. |
| person-pachacuti, ev-machu-picchu (stories) | a 1568 document "found in Cusco archives in the 1980s" "shows" Machu Picchu was Pachacuti's | land records of 1568, published by John Rowe in 1990, place the Picchu valley fields in Pachacuti's estate; most scholars infer the site was too | Rowe, *Histórica* 14 (1990). The attribution is an inference, and Rowe was an archaeologist, not a historian. |
| ev-guayaquil-conference | San Martín "left South America" after Guayaquil | withdrew from the war and later left for Europe | He went to Chile and Argentina first and sailed for Europe only in 1824 (Lynch). |
| ev-huacas-de-moche | "tens of millions of marked bricks" | "an estimated 140 million" | Hastings & Moseley, *American Antiquity* 40 (1975), estimate more than 143 million; source added. |
| place-salvador | "which made it the most African city of the Americas" | "often called the most African city…" | The superlative is a characterisation, not a fact. |
| person-francisco-de-orellana | royal licence stop dated 1543 | 1544 | His capitulation for New Andalusia was signed in Valladolid in February 1544. |
| person-pedro-de-valdivia | confidence high, born 1497 | medium, with a note | Sources give 1497 to c. 1502; Britannica gives c. 1498. |
| polity-empire-of-brazil | rulers listed Pedro I, Feijó (1835), Pedro II (1831) | sorted by start year | The schema requires rulers in time order. |
| ev-parliament-of-quilin | -38.05, -72.65 (about 40 km north of the Quillén river) | -38.46, -72.50, with a note | The parliament met on the plain of the Quillén river in Cautín province (es.wikipedia, Río Quillén; OSM). |
| zh names | 尊比 / 阿莱雅丁尼奥 / 米凯拉 / 库埃拉普 | 祖比 (祖比·多斯帕尔马雷斯) / 阿莱雅迪尼奥 / 米卡埃拉 / 奎拉普 | Changed throughout the dataset to the 中文维基 renderings. |
| ev-voyage-of-the-beagle | `people` empty; note pointed to ev-origin-of-species | `people: ["person-charles-darwin"]` | That id exists on the Europe branch (`data/europe/people.json`). Until that branch merges, the validator shows an "unknown person" warning. |

Every other zh name matched 中文维基 or a standard rendering. Some kept renderings differ from the zhwiki title: 皮萨罗 (zhwiki 皮泽洛), 庇隆 (zhwiki 裴隆, a Taiwan form), 帕查库蒂 (zhwiki 帕查库特克), 瓦曼·波马 (zh label 瓜曼·波马) and 蒂瓦纳库 (zhwiki 蒂亚瓦纳科). All of these are standard mainland forms or closer transliterations, so they stay.

### Disputed verdicts

`resolutions/south-america.json` holds **7** disputed verdicts, not the 10 the curator's summary reported; the file has 42 keep-ours. Each was rechecked:
- **ev-arauco-war (start and end):** a matter of periodisation, so no source can settle it.
- **person-pachacuti (born), person-atahualpa (born):** neither date is documented, and the chroniclers conflict.
- **person-aleijadinho (born):** the 1730 baptism record and the 1814 age at death cannot both be right.
- **polity-chachapoya (from), polity-muisca (from):** archaeological chronologies.

All seven are genuinely disputed. Each record carries medium or low confidence with a note, which is correct.

### Pre-Columbian chronology

Every Moche, Nazca, Tiwanaku, Wari, Chimú, Sicán, Chachapoya, Muisca and Kingdom of Cusco record carries medium or low confidence. polity-inca-empire (from 1438) and the Pachacuti, Topa Inca and Huayna Capac records note that their dates follow Rowe's Cabello Valboa-based chronology. ev-machu-picchu notes the Burger et al. (2021) AMS dates.

### Coordinates

The Peru-centroid items (Q2890406, Q1763918, Q152004, Q852133, and Q923516 for polity-wari) all have markers at the real sites: Anta plain/Cusco, Quipaipan, Antofagasta, Ayacucho and Huari. Every other event was checked against the site it names. Only Quilín needed a fix. San José mine (Copiapó) matches the mine's coordinates.

### Additions (4 new records, 3 with stories)

- `person-che-guevara` (Q5809, 1928–1967): 9 stops, from Rosario to La Higuera, and a story. The disputed number of La Cabaña executions is stated as a range. Sources: Britannica; Anderson (1997).
- `ev-berbice-slave-uprising` (Q3337680, 1763–64, Guyana), with a story. Sources: Kars, *Blood on the River* (2020); Britannica. Its coordinate diff is resolved keep-ours (Fort Nassau rather than New Amsterdam).
- `ev-french-guiana-penal-colony` (Q15974702, 1852–1953), with a story. Sources: Britannica; Toth, *Beyond Papillon* (2006); Criminocorpus.
- `place-paramaribo` (Q3001), with a name genealogy from 1650 to today. Sources: UNESCO 940; Britannica.
- `ev-humboldt-climbs-chimborazo`: the route now includes the departure from Guayaquil (1803) and the return to Bordeaux (1804). This event already covers the journey, so no separate Humboldt person record was added.

### Left for a human

- `person-charles-darwin` is on the Europe branch. Merge both branches before release, or the Beagle link stays a validator warning.
- ev-columbus-reaches-paria links `person-christopher-columbus`, which another dataset defines.
- The modern state polities (Paraguay to Brazil) were checked for dates only.
