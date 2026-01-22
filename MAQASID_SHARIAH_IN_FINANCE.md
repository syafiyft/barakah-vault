# Maqasid al-Shariah Investment Framework & Implementation Guide

## 1. Executive Summary

Traditional Islamic finance screening has historically been "negative"—focusing on what to *avoid* (pork, alcohol, gambling, interest). While this ensures investments are technically *halal* (permissible), it does not guarantee they are *tayyib* (wholesome/good) or aligned with the higher objectives of Islam.

**Maqasid al-Shariah (Objectives of Islamic Law)** provides a "positive" screening framework. It evaluates companies based on how well they preserve and promote human well-being. This document outlines how to move from abstract concepts to a concrete, algorithmic scoring system for the BarakahVault platform.

---

## 2. The 5 Dimensions of Maqasid (The Essentials)

To "really implement" this, we map each of the 5 objectives to specific, measurable modern corporate indicators.

### 🏛️ 1. Preservation of Faith (*Hifz al-Deen*)
**Goal:** Protect religious freedom, morality, and ethical values.
**Metrics for Companies:**
- **Religious Freedom:** Does the company accommodate religious practices (prayer spaces, holidays) for employees?
- **Ethical Marketing:** Does the company avoid sexualized or deceptive advertising?
- **Privacy:** Does the company respect user privacy (as trusted custodians of secrets)?
- **Forbidden Associations:** Does the company indirectly support oppression or anti-religious sentiments?

### ❤️ 2. Preservation of Life (*Hifz al-Nafs*)
**Goal:** Protect physical health, safety, and the environment.
**Metrics for Companies:**
- **Worker Safety:** Fatalities/accidents rate (OSHA violations).
- **Product Safety:** History of recalls or health-related lawsuits.
- **Environmental Impact:** Carbon footprint, waste management, pollution levels (protection of the planetary life).
- **Healthcare:** Quality of health benefits provided to employees.

### 🧠 3. Preservation of Intellect (*Hifz al-Aql*)
**Goal:** Promote knowledge, truth, and innovation; avoid intoxicants (literal and metaphorical).
**Metrics for Companies:**
- **R&D Spending:** Investment in new knowledge and innovation.
- **Truth & Transparency:** Accuracy in financial reporting; avoidance of "fake news" or misinformation (if a media company).
- **Education:** Employee training programs, scholarships, or support for STEM.
- **Addiction Avoidance:** Does the product create harmful addiction (e.g., gambling mechanics in games, social media algorithms)?

### 👶 4. Preservation of Lineage (*Hifz al-Nasl*)
**Goal:** Protect the family unit, dignity, and future generations.
**Metrics for Companies:**
- **Family Policies:** Maternity/paternity leave, childcare support.
- **Work-Life Balance:** Policies preventing overwork that harms family time.
- **Sexual Ethics:** Prevention of sexual harassment in the workplace.
- **Future Sustainability:** Long-term business viability (stewardship for future heirs).

### 💰 5. Preservation of Wealth (*Hifz al-Mal*)
**Goal:** Protect property, ensure fair distribution, and prohibit unjust consumption.
**Metrics for Companies:**
- **Fair Wages:** Living wage vs. minimum wage analysis; CEO-to-worker pay ratio.
- **Economic Contribution:** Job creation and tax payment (versus aggressive avoidance).
- **Financial Stability:** Low risk of bankruptcy (protecting shareholder capital).
- **Anti-Corruption:** Policies against bribery and embezzlement.

---

## 3. Implementation Strategy: "Real" Scoring

To move beyond mock data, we implement an **AI-driven Scoring Pipeline**.

### Data Sources
1.  **Annual Reports (10-K):** For financial stability, R&D spending, and risk factors.
2.  **Sustainability/ESG Reports:** For environmental impact, safety data, and diversity/inclusion (proxy for fairness).
3.  **News & Third-Party Reviews:** For controversies (lawsuits, strikes, recalls).
4.  **Glassdoor/Employee Reviews:** For internal culture checks (work-life balance, harassment).

### The Technical Workflow
1.  **Ingestion:** Scrape or fetch the latest PDF reports for a target company (e.g., Apple).
2.  **Extraction (RAG):** Use a Large Language Model (LLM) with specific prompts to extract evidence for each of the 5 dimensions.
    *   *Prompt:* "Analyze the provided Sustainability Report and extract details regarding 'Parental Leave Policies' and 'Worker Safety Statistics'. Return as JSON."
3.  **Scoring Algorithm:**
    *   Assign a weight to each sub-metric (0-10).
    *   Normalize qualitative data to a score (e.g., "Industry Leading Policies" = 10, "Legal Minimum" = 5, "Violations" = 0).
    *   Calculate weighted average for the final **Maqasid Score**.

### Proposed Database Schema Update
We need to store the granular breakdown to justify the score to the user.

```javascript
const MaqasidSchema = new Schema({
  ticker: String,
  company: String,
  dateScored: Date,
  totalScore: Number,
  breakdown: {
    faith: { score: Number, reasoning: String },
    life: { score: Number, reasoning: String },
    intellect: { score: Number, reasoning: String },
    lineage: { score: Number, reasoning: String },
    wealth: { score: Number, reasoning: String }
  },
  alternatives: [{
    company: String,
    ticker: String,
    score: Number,
    reason: String
  }],
  sources: [{
    name: String,      // e.g. "Apple Sustainability Report 2024"
    publisher: String, // e.g. "Apple Inc."
    type: String       // "Report" | "News" | "Official"
  }]
});
```

### Source Citations System
To build trust and allow users to verify AI-generated scores, we include **searchable references** rather than direct URLs (which LLMs often hallucinate).

**Why Searchable References?**
- LLMs frequently generate plausible but non-existent URLs
- Real document names (e.g., "Tesla Impact Report 2023") can be easily Googled
- Users can verify claims independently
- Builds credibility for the platform

**Source Types:**
1. **Report:** Annual reports, sustainability reports, ESG ratings (e.g., "MSCI ESG Rating - Microsoft")
2. **News:** Coverage from reputable outlets (e.g., "Reuters", "Bloomberg")
3. **Official:** SEC filings, press releases, official company statements

---

## 4. Recommended Reading & References

For deep dives into the Shariah reasoning:

1.  **Securities Commission Malaysia**: "Islamic Fund and Wealth Management Blueprint" – Excellent resource on the transition from "Halal" to "Tayyib".
2.  **AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions)**: Look for governance standards regarding "Maqasid al-Shariah".
3.  **Tawhid-Based Methodology**: Academic papers discussing the "Hifz" framework applied to economics.
4.  **Global Reporting Initiative (GRI)**: While secular, their standards for sustainability reporting map 80% effectively to *Maqasid* dimensions (Life, Wealth, Lineage).

---

## 5. Implementation Status for BarakahVault

### Completed Features ✅
1.  **OpenAI Integration**: Connected `/api/maqasid/analyze` endpoint to `gpt-4o` with structured JSON output.
2.  **Dynamic Scoring**: AI generates scores in real-time based on its knowledge of the company.
3.  **5-Dimension Breakdown**: Each Maqasid dimension (Faith, Life, Intellect, Lineage, Wealth) has individual scores and reasoning.
4.  **Halal Alternatives**: If a company scores < 75, the AI suggests 2-3 better-rated alternatives in the same sector.
5.  **Source Citations**: AI provides searchable references (report names, publishers) that users can Google to verify claims.
6.  **Visual Indicators**: Color-coded scores (green/yellow/red) and progress bars for each dimension.
7.  **Info Modal**: Educational tooltips explaining each Maqasid dimension.

### Future Enhancements 🚀
1.  **RAG Pipeline**: Feed the LLM with actual company reports (10-K, sustainability reports) for more accurate scoring.
2.  **News Integration**: Incorporate recent news sentiment into the scoring algorithm.
3.  **Historical Tracking**: Store and compare scores over time to show improvement/decline.
4.  **User Feedback Loop**: Allow users to flag inaccurate scores for review.
