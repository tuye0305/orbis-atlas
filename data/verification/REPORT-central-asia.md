# Verification report: Central Asia (`data/central-asia/`)

Verifier: independent fact-checker agent (separate from the curator). `validate-data central-asia` gives 0 errors.

## 1. Auto-diff resolutions: `resolutions/central-asia.json`

All diffs are **keep-ours**, including Bibi-Khanym 1399 and the Hephthalites 450–560. Three coordinate diffs (the Khwarazm invasion, the Toluid war and the 1916 revolt) compare against the same generic "Central Asia" point (45.3, 63.9), which Wikidata reaches through a region-level P276 location rather than a real event site.

## 2. Fixes

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| Göktürk ruler Ilterish | qid | Q68221 (that item is the Uyghur founder 怀仁可汗) → Q387151 | `wd.mjs lookup` |
| Uyghur rulers | qid | added Qutlugh Bilge Köl Q68221 and Bögü Q68234 | `wd.mjs lookup` |
| Kara-Khanid ruler Ibrahim Tamghach Khan | from | 1052 → 1040; Satuq Bughra Q3239600 added | — |
| Xiongnu ruler Zhizhi | qid | Q3101072 added | — |
| Bukhara emirs | qid | added Shah Murad Q4521263, Nasrullah Q3870512 and Muzaffar Q4305947 | — |
| person-kublai-khan | 1264 stop | Karakorum → Shangdu (42.36, 116.18), where Ariq Böke surrendered | Rossabi, *Khubilai Khan* |
| ev-gokturk-khaganate-founded, ev-kazakh-khanate-founded, ev-genghis-khan-proclaimed | qid | removed, because the QIDs denote polities; notes updated | rule for founding events |
| 1916 revolt | note | Old Style and New Style dates added | — |
| place-astana | names | 1997–1998 split out as capital (capital from Dec 1997) | — |
| place-samarkand | names | Samanid capital 819–892; Karakhanid capital 1040–1212 | — |
| place-bukhara | names | capital 892–999 | — |

## 3. Spot-checks (✓)

- **Early empires:** Göktürk 552 and Bumin's stops; Gol-Zarriun; Orkhon; Talas; Ordu-Baliq; Dandanaqan; Qatwan.
- **Mongol era:**
  - Otrar, Bukhara, Samarkand, Merv and Indus sieges; Kalka; the Khwarazm invasion route.
  - Timurid monuments.
- **Early modern and modern events:**
  - Zunghar (neutral wording); Tashkent 1865; Geok Tepe; Panjdeh.
  - The 1924 delimitation; the Alma-Ata Protocol; RDS-1; Vostok; the Tashkent earthquake.
- **People:**
  - Genghis Khan's stops. He was not at Zhongdu in person in 1215; the label is left as shorthand.
  - Stops for Timur, Ulugh Beg, Ablai and Shaybani.
- **Places:** Almaty, Tashkent, Bishkek, Dushanbe, Ulaanbaatar, Karakorum, Merv.
- **Ruler reigns:** Mongol Empire, Golden Horde, Chagatai, Timurid, Dzungar and Bukhara.

## Open notes

- The build could skip region-level P276 fallback coordinates when it computes diffs.
- `ev-fall-of-ordu-baliq` points at the city site, not a polity, so its QID was kept.

## 2026-11 expansion

The curator added 64 events, 26 people with stops, 9 places with name genealogies and 14 polities with rulers. There are 81 new long-form stories, 33 of them on existing importance-4/5 records. `validate-data central-asia` gives 0 errors. The remaining warnings are events without a QID and expected cross-dataset references (`place-lhasa`, `place-kashgar`, `person-kangxi-emperor`).

### Auto-diffs

The expansion produced 17 new diffs, all resolved as **keep-ours** in `resolutions/central-asia.json`; 0 remain open.
- **Date diffs** come from Wikidata items scoped differently from our records:
  - Potala site 637 vs the 1645 building.
  - The Diwan's 1266 manuscript copy vs its 1072 composition.
  - The Kalka raid of 1223 counted in Batu's campaign.
  - The whole Arab conquest of Transoxiana vs Qutayba's 705–715 phase.
  - Rouran 330, Ghaznavid 962 and Northern Yuan 1691.
- **Coordinate diffs** are mostly country centroids (Afghanistan, Kazakhstan), plus two clearly wrong points:
  - Bengal for the 1903–04 Tibet expedition.
  - Transoxiana for the Terek battle.

### Spot-checks (45 of 113 new records, 40%)

- **Events (23)**, checked against the cited literature and web references:
  - Xiongnu split 48, An Shigao, the Sogdian Ancient Letters, Herat 484, Zemarchus, Jokhang, the Samye debate, Devashtich, Balkh 900, Kutadgu Bilig.
  - Carpini, Clavijo, Sher-Dor, Dolon Nor, Ahmad Shah 1747, Stoddart and Conolly, Ak-Mechet, Khiva 1873.
  - Durand Line (≈2,640 km), Hujum, the Korean deportation (≈172,000), Jeltoqsan, Andijan (official toll 187).
- **People (5):** dates and summaries for Tonyukuk (Wikidata 646–724), Gawhar Shad, Zanabazar, Yaqub Beg and Sükhbaatar.
- **Places (3):**
  - Kyzylorda: Kokand fort, Russian 1853, capital 1925–29.
  - Semey: renamed by decree in June 2007.
  - Ashgabat: Poltoratsk 1919–27.
- **Polities (14):** every ruler QID was checked against the Wikidata label, and every span against Wikidata inception and dissolution.

### Corrections made during checking

| Record | Field | Change |
| --- | --- | --- |
| ev-jokhang-founded / ev-samye-founded | year | 647 → 639, 775 → 779 (traditional dates matching Wikidata); notes give the alternatives |
| ev-gawhar-shad-musalla story | text | Abu Sa‘id is described as the Timurid prince, not her descendant |
| ev-altan-khan-meets-sonam-gyatso story | text | Laws stated precisely: blood sacrifice and funeral killings banned, ongghot images burned |
| ev-tokhtamysh-timur-war | note | Removed the claim that the Terek marker is Wikidata's coordinate |
| place-khujand | note | Reversion from Leninabad dated 1990–92 (sources differ) |
| place-semey | note | Rename decree of June 2007 recorded |
| 18 source URLs | url | Britannica and Iranica slugs corrected to the live article paths (for example `Batu-Mongol-ruler`, `Willem-van-Ruysbroeck`, `Orhon-inscriptions`, `herat-iii`). The Dēwāštīč citation was replaced by Grenet & de la Vaissière (2002). |
| place-samarkand (existing) | url | Britannica `place/Samarkand` → `place/Samarkand-Uzbekistan` |

### Open notes

- Britannica, Iranica and UNESCO return 403 to scripted requests. Links were confirmed through search-engine results, not by fetching the pages.
- The china dataset (`data/china`) added Ban Chao in the Western Regions, Dafei River, Jao Modo, the Qing reconquest of Xinjiang, Kumarajiva and Ürümqi in parallel. Central-asia's drafts were dropped in favour of china's records, and `ev-lu-guang-takes-kucha` now links to `person-kumarajiva` there.
- Qocho's start (843 vs 866) and the end of Durrani rule (1818/1823/1826) remain debated; both have `confidence` below high.

## 2026-11 review

Reviewer: a second, independent fact-checker. It works on top of the curator's expansion and avoids the records the curator logged above.

### Sample

I checked 82 of the 113 new records (73%). None of them is in the curator's spot-check list.

- **Events (41):**
  - Huns on the Pontic steppe, Lü Guang at Kucha, Qutayba's conquest, Uyghur Manichaeism, Samye, the fall of the Tibetan Empire, Bezeklik, the Karakhanid conversion and the fall of the Samanids.
  - The Diwan, Batu's campaign, Sakya Pandita and Köden, Rubruck at Karakorum, Özbeg, the Tokhtamysh–Timur war, Ganden and Monlam 1409, Gawhar Shad's Musalla, Babur at Kabul and Altan Khan with Sonam Gyatso.
  - Erdene Zuu, the Ganden Phodrang, the Potala, the Barefooted Flight, the first, second and third Anglo-Afghan wars, Samarkand 1868, Kokand 1876, Loulan, the Younghusband expedition and Mongolia 1911.
  - The Kazakh famine, the Mongolian purges, Khalkhin Gol, the Saur Revolution, the Soviet–Afghan war, Mongolia 1990, Afghanistan 2001–21, the fall of Kabul 2021, the Kazakh unrest of 2022 and the first East Turkestan republic.
- **People (21):** every new person except the five the curator checked. I covered dates, every stop and the summary.
- **Places (6):** Kabul, Herat, Balkh, Kandahar, Khujand and Gaochang, including every name period.
- **Polities (14):** summaries, capitals and ruler reigns. The curator had checked only the ruler QIDs and spans.
- **QIDs:** I ran `wd.mjs lookup` on every QID among the new records in the sample (50 QIDs). All of them are the intended subject.

**Stories read in full: 42.** That is 32 of the new stories (31 events and Abai) plus 10 on existing records: Talas, Genghis Khan proclaimed, Otrar, the Khwarazm invasion, Samarkand 1220, the Zunghar war, the Chüy valley plague, Genghis Khan and Timur as people, and the Mongol Empire polity.

- **Death tolls:** Mongol-era figures are given as the chroniclers' figures. Examples are Juvaini's 110,000-man garrison at Samarkand, Changchun's "a quarter remained" and the Merv note saying the counts of over a million are not credible. Modern tolls give a range in `note`: the Kazakh famine (1.5–2.3 million), the Soviet–Afghan war (0.5–2 million), the Mongolian purges (20,000–30,000+), Andijan and the 2022 unrest.
- **Checked against:** Hou Hanshu (Hill translation), Juvaini, Rubruck (Jackson & Morgan), Baburnama (Thackston), Perdue, Wei Yuan, Morrison, Barfield, Dalrymple, Goldman/Coox (Khalkhin Gol), Cameron (Kazakh famine), Bosworth, Biran, Golden, van Schaik, Elverskog and Iranica, plus live Wikipedia and Wikidata pages for dates and coordinates.
- **Coordinates:** every new event was checked against the actual site. Only `ev-kazakh-famine-1930` sits on a country centroid, which is deliberate for a nationwide famine and stated in its note. I checked Paykand (39.6, 64.0) and the Terek battlefield (43.58, 47.45) against published coordinates, and both are correct.
- **Source URLs:** I fetched all 81 non-Britannica/Iranica/UNESCO URLs on the new records. Four returned 404 and are fixed below.

### Corrections

| Record | Field | Old → new | Reason / source |
| --- | --- | --- | --- |
| ev-zunghar-genocide | story | "Wei Yuan estimated that of some 600,000 Dzungars…" → Wei Yuan's "several hundred thousand households" with his 4/2/3-tenths split, framed as a later estimate. The c. 600,000 population is attributed to modern historians. | The 600,000 figure is not Wei Yuan's. Wei Yuan, *Shengwuji*: 数十万户…十之四/十之二/十之三. Perdue, *China Marches West*. |
| person-bilge-qaghan | summary | "raised the Orkhon inscriptions" → "set up the Orkhon memorial to Kül Tegin in 732; his own stele was raised after his death" | His own stele was erected in 735 by his successor. Tonyukuk's inscription is not his. |
| person-mahmud-of-ghazni | summary | Ferdowsi "drawn to his court" → Unsuri at court, Ferdowsi presented the Shahnameh, al-Biruni brought to Ghazni after Khwarazm fell | Ferdowsi's residence at Ghazni is legendary (Bosworth; Britannica, Ferdowsi). |
| ev-altan-khan-meets-sonam-gyatso | story | "his two predecessors as abbots" → the rebirth of Gendun Drup and Gendun Gyatso, counted retroactively | Gendun Drup was never abbot of Drepung (van Schaik). |
| ev-ganden-and-monlam-1409 | story | "his disciples founded Ganden" → "he and his disciples founded Ganden" | It now matches the summary (Jinpa, *Tsongkhapa*). |
| ev-genghis-khan-proclaimed, person-genghis-khan | story | The poisoning of Yesügei by Tatars is now attributed to the Secret History | It is known only from that source. |
| person-tokhtamysh | role.zh | 金帐汗国大汗 → 金帐汗国可汗 | 大汗 denotes the Great Khan. |
| ev-chuy-valley-plague | summary | 'pestilence' → “pestilence” | House style. |
| ev-samye-debate, ev-karakhanid-conversion-to-islam, ev-sher-dor-madrasa | source url | `Samye_debate`, `Satuq_Bughra_Khan`, `Sher-Dor_Madrasah` (404) → `Samye_Debate`, `Sultan_Satuq_Bughra_Khan`, `Sherdar_Madrasa` | Dead links. |
| ev-sogdian-ancient-letters | source | Wikipedia "Ancient_Letters" (no such article) → Encyclopaedia Iranica, "Ancient Letters" (Sims-Williams) | Dead link. |

### Additions (6 records, all with ≥2 sources)

The brief called the Kushans "absent", but `polity-kushan`, `person-kanishka` and `ev-kanishka-accession-rabatak` already exist in `data/south-asia/` on the base branch. The new Kushan records therefore link to those ids instead of duplicating them.

- **ev-kujula-unites-the-kushans** (c. 30, importance 4, story): the five *xihou*, Kujula's unification and conquests, and the 90 CE Yuezhi army against Ban Chao. Sources: Hou Hanshu ch. 88 (Hill), Britannica, and Sims-Williams & Cribb (Rabatak).
- **ev-surkh-kotal-sanctuary** (Q1799523, story): Kanishka's dynastic temple and the 1957 Bactrian inscription (Nokonzoko, year 31). Sources: Schlumberger, Le Berre & Fussman (MDAFA 25) and Rosenfield.
- **ev-lokaksema-luoyang** (178–189, story): the first Mahayana translations, including the *Daoxing banruo jing* of 179 and the earliest datable mention of Amitābha. Sources: Zürcher and Nattier.
- **ev-junior-juz-oath-1731** (story): Anna's charter of 19 February 1731, Tevkelev, the oath on the Irgiz on 10 October (O.S.), and the competing historiographies. Sources: Olcott, Presidential Library, Wikipedia.
- **ev-anglo-russian-convention-1907** (Q1129893, 31 August 1907, importance 4, story): Persia's zones, Afghanistan, Tibet. Sources: Britannica, Siegel's *Endgame*, Wikipedia.
- **person-nursultan-nazarbayev** (Q57394, `died: null`): a living person, added after merging `origin/feat/world-regions`. Linked from `ev-kazakh-unrest-2022`.

After these changes, `validate-data central-asia` gives 0 errors, and `build-data` shows 26 diffs with 0 open. The new records add no diffs.

### Cross-dataset (origin/data/china #13, south-asia #11, west-asia #10)

- **QIDs:** no record-level QID is duplicated between central-asia and those branches.
- **Rulers:** some ruler QIDs overlap, which is legitimate (a ruler entry pointing at a person record):
  - Songtsen Gampo and Trisong Detsen in china's `polity-tibetan-empire`.
  - Kublai and Toghon Temür in `polity-yuan`.
  - Hulagu in west-asia's `polity-ilkhanate`.
- **References into central-asia:** every central-asia id that those branches reference resolves: `polity-xiongnu`, `polity-dzungar-khanate`, `polity-mongol-empire`, `person-genghis-khan`, `person-kublai-khan`, `polity-chagatai-khanate`, `polity-timurid` and `person-hulagu-khan`.
- **References out of central-asia:** these resolve only once china is merged: `polity-eastern-han`, `polity-former-qin`, `person-kumarajiva`, `place-lhasa`, `place-kashgar`, `place-dunhuang`, `place-wuwei` and `person-kangxi-emperor`.
