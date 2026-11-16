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
