# Implementation Plan - Halal Alternatives Recommendation

## Goal Description
Enhance the Maqasid AI Screener to provide actionable alternatives. If a user searches for a company, the AI should not only score it but also suggest better-rated companies in the same sector (Halal Alternatives), effectively guiding the user towards more ethical investments.

## Proposed Changes

### Backend
#### [MODIFY] [route.js](file:///c:/Projects/barakah-vault/frontend/app/api/maqasid/analyze/route.js)
- Update `SYSTEM_PROMPT` to include an `alternatives` field in the JSON schema.
- Logic: "If the totalScore is < 80, provide 2-3 alternative companies in the same industry with higher Maqasid scores. If the score is high (>80), provide similar high-scoring peers."
- **[NEW] Add `sources` field**: Request `[{ title: string, url: string, type: 'Report' | 'News' }]` to verify claims.

### Frontend
#### [MODIFY] [ScoreCard.js](file:///c:/Projects/barakah-vault/frontend/components/ScoreCard.js)
- Add a "Better Alternatives" or "Top Peers" section at the bottom of the card.
- Map through `data.alternatives` and display them.
- **[NEW] Add Citations Section**: A small, trustworthy footer section listing the sources with external links.

## Verification Plan
1.  **Restart Server**: `npm run dev` to reload API.
2.  **Test Low Score**: Search for a controversial company (e.g., "Nestle" or "Meta").
    *   Verify low score.
    *   Verify "Halal Alternatives" section appears with competitors (e.g., "Danone" or "Pinterest/LinkedIn" with higher scores).
3.  **Test High Score**: Search for "Texas Instruments" or "Adobe".
    *   Verify "Top Peers" (or similar) are shown.
