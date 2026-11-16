# Verification report: South Asia (`data/south-asia/`)

Verifier: independent fact-checker agent (separate from the curator). `validate-data south-asia` gives 0 errors.

## 1. Auto-diff resolutions: `resolutions/south-asia.json`

Every diff is **keep-ours** except one:

- Keep-ours: Gupta era 320, Xuanzang 630, Kanishka born and died, Sikh Empire 1799, Sri Lanka 1948, and the coordinate diffs.
- `person-shivaji:born` is **disputed**: 1630 vs 1627, and Britannica gives both. The record keeps 1630 at medium confidence, with a reworded note.

The reasons and sources for each verdict are in the resolutions file.

## 2. Fixes

| Record | Field | Old → New | Source |
| --- | --- | --- | --- |
| ev-second-battle-of-panipat | summary en/zh | "13-year-old" → "14-year-old" | Akbar was born 15 Oct 1542; the battle was on 5 Nov 1556 |
| ev-nepal-becomes-republic | date | 2008-04-10 → 2008-05-28 (the monarchy was abolished that day); note updated | Whelpton; Britannica |
| ev-ceylon-independence | qid | Q2670092 (a polity) → removed; note added | rule for founding events |
| person-alauddin-khalji | Kara stop | 1292 → 1291 | Jackson, *The Delhi Sultanate* |
| person-shivaji | note | reworded to show the 1627/1630 split | Britannica |
| polity-maratha | summary | Panipat (1761) "checked" Maratha power; the power ended in 1818 | Gordon, *The Marathas 1600–1818* |
| Pala, Vijayanagara, Mysore, Sikh and Sri Lanka rulers | rulers[].qid | added Gopala Q3352284, Dharmapala Q3183804, Sadasiva Q1452340, Raja Wodeyar I Q15912370, Sher Singh Q7494639, Senanayake Q663001, Sirimavo Q194291, Jayewardene Q469661 | `wd.mjs lookup` |
| place-colombo | names | 1972–1982 split out as capital (Kotte has been the official capital since 1982) | — |
| place-lahore | names | 1163–1186 split out as capital | Bosworth, *The Later Ghaznavids* |

## 3. Spot-checks (✓)

- **Events:**
  - First Panipat: date (Julian, 21 April), note and route
  - Buxar, 22 Oct 1764
  - Kanishka 127
  - Timur's sack of Delhi and his route
  - da Gama; Goa; Plassey; Third Panipat
  - 1857 (summary neutral); Partition (neutral)
  - Jallianwala; Salt March; Lahore Resolution; Bangladesh 1971; Somnath
- **People:**
  - Stops for Shivaji, Akbar, Ranjit Singh and Tipu
  - The placeholder births for Chandragupta II and Rajendra are flagged in their notes
- **Places:**
  - Mumbai, Chennai, Kolkata, Dhaka, Prayagraj, Varanasi
  - Delhi: the Lodi capital at Agra (1506–26) is left simplified
- **Polities:** reigns for the Mughal, Delhi Sultanate, Vijayanagara, Gupta, Chola and Pakistan rulers. All ruler QIDs were looked up; Bahmani Muhammad Shah III has no clear item, so it is left blank.
