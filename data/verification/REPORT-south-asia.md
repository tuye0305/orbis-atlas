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

## 2026-11 expansion

**New records:** 70 events, 24 people, 12 places (with name genealogies) and 22 polities (with rulers), for 128 in total. 69 stories were added: 35 on new events and 34 on existing importance-4/5 events, so every importance-4/5 record now has one.

**Auto-diff:** the build reported 38 differences against Wikidata, and all are resolved (0 open).
- **Fixed in the data:** Polonnaruwa now ends in 1236 rather than 1215, and Gangaikonda Cholapuram is dated 1022–1035, from Rajendra's Ganges expedition to the temple's first endowment.
- **Kept ours (with reasons):**
  - Wikidata's QID refers to a different referent: Faxian's book rather than the journey; the Changu Narayan temple rather than the inscription; the GIPR company (1849) rather than the first train (1853); modern Bhutan (1949) rather than the Zhabdrung state (1616); Chola Polonnaruwa.
  - The start date falls before the atlas floor: Pandya and Anuradhapura.
  - The birth year is unrecorded, and Wikidata gives the accession year instead: Pulakeshin II, Samudragupta, Iltutmish and Rudrama Devi. Each of these records carries a labelled placeholder.
  - The marker sits at a better anchor: Nalapani, Srinagar, Chawinda, Kargil, Galle and Murshidabad.
- **Disputed:** Samudragupta's death year, which is 375 or 380.

**Spot-check:** 33 of 128 new records were checked against a second source (26%). The second source was always outside Wikipedia and Wikidata: Britannica entries via search, UNESCO, or standard monographs.
- **Polities:** Polonnaruwa, Pandya, Chera, Anuradhapura, Bhutan, Ahom, Kandy, Golconda, Kakatiya and Hyderabad State.
- **People:** Samudragupta, Pulakeshin II, Iltutmish, Rudrama Devi, Madhava, Nur Jahan and Prithvi Narayan Shah.
- **Events:** Changu Narayan inscription, Gangaikonda, Faxian, Unification of Nepal, Bengal famine of 1770, GIPR first train, Ibn Battuta in Bengal, Dharmasvamin at Nalanda, Tarain, Talikota, Lachit and Saraighat, Language Movement and the 2015 Nepal earthquake.
- **Places:** Thanjavur, Peshawar and Kandy.

**Corrections made:**
- **Changu Narayan inscription:** the summary was rewritten. It is no longer called the oldest inscription in Nepal, because older finds exist.
- **Ibn Battuta:** his route now runs Sudkawan → Sylhet → Sonargaon.
- **Dharmasvamin:** "about seventy students".
- **Smaller fixes:**
  - The Bengal Language Movement event is now dated 1952.
  - The Tarain anecdote is now attributed to Firishta.
  - Vasco da Gama's crossing is given as "nearly four weeks".
  - Rama Raya is now described as "aged".
  - Lachit "died the following year".
  - The 2015 Nepal earthquake zh text had a border error, now fixed.
- **Removed as unverified:**
  - A Maldives "national day" claim.
  - The claim that Jung Bahadur was the first South Asian ruler in Europe.
  - A dangling polity link.
- **Weak citations replaced:** for Thanjavur and Peshawar.

**Known gaps:**
- No QID exists for the Licchavis of Nepal, Bakhtiyar's raids, the Maldives conversion or Ibn Battuta's South Asian leg.
- Maldives and Bhutan coverage is still thin.
- The Ghaznavid and Ghurid polities belong to central-asia and are not duplicated here.
- The Kakatiya start (1163, Hanamkonda inscription) is given as 1158 or 1162 in some secondary sources.
