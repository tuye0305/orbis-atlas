# Verification

How Orbis checks its facts.

1. **Curate.** A curator agent writes each record with a Wikidata QID, ≥2 sources and a
   `confidence`. When reputable sources disagree, the curator keeps the better-supported value and
   explains the choice in `note`.
2. **Auto-diff.** `node scripts/build-data.mjs` compares each curated year, birth/death year,
   start/end year and coordinate with Wikidata (tolerance: 1 year, 2 for polities, 50 km), then
   writes `auto-diff.json` and `AUTO-DIFF.md`.
3. **Resolve.** A verifier agent, separate from the curator, checks every open difference against at
   least one independent source (Britannica, a standard reference work, or a primary text) and
   records the verdict in `resolutions.json`:

   ```json
   {
     "person-ibn-battuta:died": {
       "verdict": "keep-ours",
       "reason": "Britannica gives 1368/69; Wikidata has 1368. 1369 follows Dunn, The Adventures of Ibn Battuta.",
       "checked": ["https://www.britannica.com/biography/Ibn-Battuta"]
     },
     "ev-x:year": { "verdict": "fix", "apply": 1071, "reason": "…", "checked": ["…"] }
   }
   ```

   Verdicts: `keep-ours` (curated value stands; Wikidata is wrong or uses another convention),
   `fix` (curated value was wrong; `apply` holds the corrected value, which the build applies),
   `disputed` (no consensus; the record must carry `confidence: "medium"` and a `note`).
4. **Spot-check.** Verifiers also sample records with no diff (summaries, journey stops, place-name
   date ranges, ruler reigns) against a second source and log the findings in `REPORT-<dataset>.md`.
5. **Borders.** Anachronistic labels in historical-basemaps snapshots are fixed in
   `data/borders/corrections.json` (`{ "<snapshot year>": { "<source NAME>": "<corrected NAME>" } }`)
   and documented in `REPORT-borders.md`.
