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
