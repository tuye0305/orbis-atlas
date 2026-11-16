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
