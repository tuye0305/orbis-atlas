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
