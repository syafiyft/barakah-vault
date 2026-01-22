import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Cache results in memory for 24 hours
let cachedStocks = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const SYSTEM_PROMPT = `
You are an Islamic finance expert. Your task is to provide a list of the TOP 5 publicly traded companies 
that best align with Maqasid al-Shariah (Objectives of Islamic Law).

The 5 Maqasid dimensions are:
1. Faith (Deen): Religious freedom, ethical marketing, privacy protection.
2. Life (Nafs): Worker safety, environmental protection.
3. Intellect (Aql): Innovation, R&D, education support.
4. Lineage (Nasl): Family-friendly policies, sustainability.
5. Wealth (Mal): Fair wages, ethical practices, job creation.

Output strictly in this JSON format:
{
    "stocks": [
        {
            "symbol": "AAPL",
            "name": "Apple Inc.",
            "score": 85,
            "industry": "Technology",
            "reason": "Strong privacy stance, high R&D investment, good labor practices."
        }
    ],
    "generatedAt": "2025-01-22T00:00:00Z"
}

Provide exactly 5 companies, ordered by score (highest first).
Use well-known, real US-traded stocks.
Be realistic with scores - very few companies should be above 90.
`;

export async function GET() {
    try {
        // Check cache first
        if (cachedStocks && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
            return NextResponse.json({
                ...cachedStocks,
                cached: true,
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: "Provide the top 5 Maqasid-compliant stocks for ethical Muslim investors." }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

        const resultRaw = completion.choices[0].message.content;
        const resultJson = JSON.parse(resultRaw);

        // Cache the result
        cachedStocks = resultJson;
        cacheTimestamp = Date.now();

        return NextResponse.json({
            ...resultJson,
            cached: false,
        });

    } catch (error) {
        console.error('Top stocks fetch error:', error);

        // Return fallback data on error
        return NextResponse.json({
            stocks: [
                { symbol: 'MSFT', name: 'Microsoft Corp.', score: 85, industry: 'Technology', reason: 'Strong ESG practices, innovation leader.' },
                { symbol: 'AAPL', name: 'Apple Inc.', score: 83, industry: 'Technology', reason: 'Privacy focus, renewable energy commitment.' },
                { symbol: 'GOOGL', name: 'Alphabet Inc.', score: 80, industry: 'Technology', reason: 'AI innovation, carbon neutral operations.' },
                { symbol: 'COST', name: 'Costco Wholesale', score: 78, industry: 'Retail', reason: 'Fair wages, employee benefits.' },
                { symbol: 'JNJ', name: 'Johnson & Johnson', score: 76, industry: 'Healthcare', reason: 'Healthcare access, community programs.' },
            ],
            generatedAt: new Date().toISOString(),
            cached: false,
            fallback: true,
            error: 'Using fallback data',
        }, { status: 200 });
    }
}
