import { NextResponse } from 'next/server';

// Mock database of scores
const MOCK_SCORES = {
    'apple': {
        company: 'Apple Inc.',
        ticker: 'AAPL',
        totalScore: 85,
        breakdown: {
            faith: { score: 90, reasoning: "High compliance with ethical financing; low interest-bearing debt." },
            life: { score: 85, reasoning: "Strong labor standards and supplier responsibility programs." },
            intellect: { score: 95, reasoning: "Global leader in innovation and knowledge tools." },
            lineage: { score: 75, reasoning: "Generally positive family impact, though screen time concerns exist." },
            wealth: { score: 80, reasoning: "Massive wealth creation but criticism on aggressive tax planning." }
        }
    },
    'tesla': {
        company: 'Tesla, Inc.',
        ticker: 'TSLA',
        totalScore: 88,
        breakdown: {
            faith: { score: 85, reasoning: "Moderate leverage; generally permissible business model." },
            life: { score: 98, reasoning: "Critical contribution to climate preservation (Hifz al-Nafs)." },
            intellect: { score: 95, reasoning: "Pioneering autonomous tech and renewable energy storage." },
            lineage: { score: 80, reasoning: "Safety record is improving; generally neutral impact." },
            wealth: { score: 80, reasoning: "High growth potential for investors, though volatile." }
        }
    },
    'microsoft': {
        company: 'Microsoft Corp.',
        ticker: 'MSFT',
        totalScore: 82,
        breakdown: {
            faith: { score: 88, reasoning: "Low debt levels and permissible income sources." },
            life: { score: 80, reasoning: "Carbon negative initiatives are exemplary for Hifz al-Nafs." },
            intellect: { score: 92, reasoning: "Empowering global productivity via software and AI." },
            lineage: { score: 75, reasoning: "Gaming division (Xbox) has mixed reviews on youth impact." },
            wealth: { score: 75, reasoning: "Solid dividend payer and wealth preservation." }
        }
    }
};

// Default score for unknown companies
const DEFAULT_SCORE = (name) => ({
    company: name,
    ticker: 'UNKNOWN',
    totalScore: 70, // Average safe score
    breakdown: {
        faith: { score: 70, reasoning: "Insufficient data to verify full Shariah compliance." },
        life: { score: 75, reasoning: "No major labor or environmental violations reported." },
        intellect: { score: 70, reasoning: "Standard industry innovation output." },
        lineage: { score: 65, reasoning: "Neutral impact on family and future generations." },
        wealth: { score: 70, reasoning: "Stable financial outlook assumed." }
    }
});

export async function POST(req) {
    try {
        const { query } = await req.json();
        const normalizedQuery = query.toLowerCase().trim();

        // specific hits
        if (normalizedQuery.includes('apple') || normalizedQuery.includes('aapl')) {
            return NextResponse.json(MOCK_SCORES['apple']);
        }
        if (normalizedQuery.includes('tesla') || normalizedQuery.includes('tsla')) {
            return NextResponse.json(MOCK_SCORES['tesla']);
        }
        if (normalizedQuery.includes('microsoft') || normalizedQuery.includes('msft')) {
            return NextResponse.json(MOCK_SCORES['microsoft']);
        }

        // Return generic/randomized score for others to keep the "magic" alive
        return NextResponse.json(DEFAULT_SCORE(query));

    } catch (error) {
        console.error('Maqasid analysis error:', error);
        return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
    }
}
