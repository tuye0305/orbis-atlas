# Data schema

All curated data lives in `data/<region>/*.json`. Each file is a JSON **array**.
Regions: `europe`, `africa`, `west-asia`, `south-asia`, `central-asia`, `east-asia`
(China, Japan, Korea, Mongolia's sedentary neighbours), `southeast-asia`.

Common rules:

- `id`: kebab-case, globally unique, permanent (e.g. `battle-of-hastings`, `person-ibn-battuta`,
  `place-istanbul`, `polity-tang`). Prefixes: `ev-`, `person-`, `place-`, `polity-`.
- `qid`: the Wikidata item id (e.g. `"Q83224"`). **Required whenever such an item exists.** It is how
  the build pulls canonical dates, coordinates and images and how verifiers diff your values.
  Check that the QID really is the item you mean (open `https://www.wikidata.org/wiki/<QID>`).
- `name`, `summary`, etc. are bilingual: `{ "en": "...", "zh": "..." }` (简体中文). Summaries: 1–3
  sentences, factual, your own words (never copy text), ≤ 60 words en.
- Years are integers, astronomical-free: `-44` = 44 BCE, `1066` = 1066 CE. Keep within
  `-50 … 2025` (the atlas spans the last ~2,000 years).
- `lat`, `lon`: decimal degrees, WGS84.
- `sources`: at least **two** entries, at least one not Wikipedia/Wikidata when possible:
  `{ "title": "Britannica: Battle of Hastings", "url": "https://www.britannica.com/event/Battle-of-Hastings" }`
  or a primary/secondary work `{ "title": "Procopius, History of the Wars, Book VIII", "url": "…optional" }`.
- `confidence`: `"high"` (dates/places undisputed), `"medium"` (approximate or debated),
  `"low"` (traditional/legendary). Add `"note"` when it is not high.
- Images: `image` is a **Wikimedia Commons file name** without the `File:` prefix
  (e.g. `"Bayeux Tapestry scene57 Harold death.jpg"`). Optional if the Wikidata item has P18 —
  the build fills it in.

## events.json

```json
{
  "id": "ev-battle-of-hastings",
  "qid": "Q83224",
  "type": "battle",            // battle | war | political | founding | fall | cultural | religious | science | exploration | disaster | treaty
  "year": 1066,
  "endYear": 1066,             // optional, for wars / long events
  "date": "1066-10-14",        // optional ISO date when known
  "name": { "en": "Battle of Hastings", "zh": "黑斯廷斯战役" },
  "summary": { "en": "...", "zh": "..." },
  "lat": 50.9116, "lon": 0.4875,
  "region": "europe",
  "importance": 5,             // 1–5; 5 = world-historical, shown at all zooms
  "people": ["person-william-the-conqueror"],
  "place": "place-london",     // optional link to a places.json id
  "polities": ["polity-normandy", "polity-anglo-saxon-england"],
  "route": [                   // optional campaign path for wars / expeditions, in order
    { "year": 1066, "lat": 49.18, "lon": -0.37, "label": { "en": "Caen", "zh": "卡昂" } }
  ],
  "image": "Bayeux Tapestry scene57 Harold death.jpg",
  "sources": [ { "title": "...", "url": "..." } ],
  "confidence": "high"
}
```

## people.json

```json
{
  "id": "person-ibn-battuta",
  "qid": "Q7331",
  "name": { "en": "Ibn Battuta", "zh": "伊本·白图泰" },
  "born": 1304, "died": 1369,
  "role": { "en": "Traveller and scholar", "zh": "旅行家、学者" },
  "region": "africa",
  "summary": { "en": "...", "zh": "..." },
  "image": "…",                // optional; filled from Wikidata P18
  "stops": [                   // 3–12 life/journey stops in time order
    { "year": 1325, "lat": 35.77, "lon": -5.80, "label": { "en": "Leaves Tangier", "zh": "离开丹吉尔" } }
  ],
  "sources": [ ... ], "confidence": "high"
}
```

## places.json (place-name genealogy)

```json
{
  "id": "place-istanbul",
  "qid": "Q406",
  "lat": 41.0122, "lon": 28.9760,
  "region": "europe",
  "modern": { "en": "Istanbul", "zh": "伊斯坦布尔" },
  "names": [                   // contiguous, time-ordered; `to` may be null = today
    { "from": -660, "to": 330,  "name": { "en": "Byzantion", "zh": "拜占庭" }, "polity": { "en": "Roman Empire", "zh": "罗马帝国" } },
    { "from": 330,  "to": 1453, "name": { "en": "Constantinople", "zh": "君士坦丁堡" }, "polity": { "en": "Byzantine Empire", "zh": "拜占庭帝国" }, "capital": true },
    { "from": 1453, "to": 1930, "name": { "en": "Kostantiniyye / Istanbul", "zh": "君士坦丁堡 / 伊斯坦布尔" }, "polity": { "en": "Ottoman Empire", "zh": "奥斯曼帝国" }, "capital": true },
    { "from": 1930, "to": null, "name": { "en": "Istanbul", "zh": "伊斯坦布尔" }, "polity": { "en": "Turkey", "zh": "土耳其" } }
  ],
  "summary": { "en": "...", "zh": "..." },
  "sources": [ ... ], "confidence": "high"
}
```

## polities.json (dynasties / states, for the succession band and "who ruled here")

```json
{
  "id": "polity-tang",
  "qid": "Q9683",
  "name": { "en": "Tang dynasty", "zh": "唐" },
  "region": "east-asia",
  "from": 618, "to": 907,
  "capital": { "en": "Chang'an", "zh": "长安" },
  "capitalLat": 34.27, "capitalLon": 108.94,
  "color": "#b5523b",          // optional; the build assigns one otherwise
  "summary": { "en": "...", "zh": "..." },
  "rulers": [                  // notable rulers only (3–10), time-ordered
    { "name": { "en": "Emperor Taizong", "zh": "唐太宗" }, "from": 626, "to": 649, "qid": "Q9701" }
  ],
  "sources": [ ... ], "confidence": "high"
}
```
