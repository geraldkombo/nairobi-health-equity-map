# Audit: All User-Facing Source Files

Review every `.tsx` file in `src/app/` and `src/components/` for the following issues. For each file found, list the file path, line number, current text, and suggested fix.

## Files to Audit

- `src/app/page.tsx`
- `src/app/brief/page.tsx`
- `src/app/compare/CompareClient.tsx`
- `src/app/compare/page.tsx`
- `src/app/dua/page.tsx`
- `src/app/forum/page.tsx`
- `src/app/method/page.tsx`
- `src/app/not-found.tsx`
- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/components/CompareView.tsx`
- `src/components/CountyDetails.tsx`
- `src/components/CountyRankings.tsx`
- `src/components/Header.tsx`
- `src/components/HowToUse.tsx`
- `src/components/InsightsDashboard.tsx`
- `src/components/MapView.tsx`
- `src/components/SearchBar.tsx`
- `src/components/ShareButton.tsx`
- `src/components/SourcesPanel.tsx`
- `src/components/WeightsControl.tsx`

## Checks

### 1. Second-Person Pronouns
Flag any instance of "you", "your", "yourself" in user-facing prose (not code comments).

### 2. Em Dashes (U+2014)
Flag any U+2014 em dash character. Acceptable: nothing. Replace with rephrasing.

### 3. Unspelled Abbreviations
Flag any abbreviation that appears in user-facing text without being spelled out on its first occurrence in that file or section. Examples:
- WHO -> World Health Organization (WHO)
- KEMRI -> Kenya Medical Research Institute (KEMRI)
- KNBS -> Kenya National Bureau of Statistics (KNBS)
- KIHBS -> Kenya Integrated Household Budget Survey (KIHBS)
- KDHS -> Kenya Demographic and Health Survey (KDHS)
- ICPAC -> IGAD Climate Prediction and Applications Centre (ICPAC)
- OSM -> OpenStreetMap (OSM)
- ESA -> European Space Agency (ESA)
- CHMT -> County Health Management Team (CHMT)
- SBA -> Skilled Birth Attendance (SBA)
- PGS -> Priority Gap Score (PGS) -- only if not already introduced
- DPG -> Digital Public Good (DPG)

### 4. Casual or Lay Language
Flag phrasing that is too casual for a professional public-health register:
- "just" used as a filler ("just click here", "just drop a pin")
- "need" where "required" or "necessary" reads more professionally
- "Or" at the start of a sentence
- Contractions like "don't", "can't", "won't", "it's" (use "do not", "cannot", "will not", "it is")
- "harder", "easier", "better", "worse" used without precision
- Tilde (~) used instead of "approximately"
- Conversational fragments or interjections

### 5. Rhetorical Questions
Flag any user-facing rhetorical question (e.g. "can a person reach care when needed?") and suggest converting to a declarative statement.

### 6. Grammar & Punctuation
- Missing or extra spaces around punctuation
- Double spaces
- Missing periods at end of sentences in prose
- Incorrect use of apostrophes (it's vs its)

### 7. Tone Consistency
- Flag any second-person address, lay phrasing, or marketing-like language
- The register should be: professional, public-health, evidence-based, Kenya-system accurate

## Report Format

For each issue:

```
**File:** path/to/file.tsx:LINENUM
**Current:** "exact text from the file"
**Issue:** (which check it violates)
**Fix:** "suggested replacement"
```

If a file is clean (no issues), say "CLEAR" after the filename.
