import { NextResponse } from 'next/server';

// Fetch stock prices from Yahoo Finance
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols'); // comma-separated symbols

    if (!symbols) {
        return NextResponse.json({ error: 'Symbols required' }, { status: 400 });
    }

    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());

    try {
        const stockData = await Promise.all(
            symbolList.map(async (symbol) => {
                try {
                    // Use Yahoo Finance API
                    const response = await fetch(
                        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`,
                        {
                            headers: {
                                'User-Agent': 'Mozilla/5.0',
                            },
                            next: { revalidate: 60 }, // Cache for 60 seconds
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${symbol}`);
                    }

                    const data = await response.json();
                    const result = data.chart.result?.[0];

                    if (!result) {
                        return {
                            symbol,
                            error: 'No data found',
                        };
                    }

                    const meta = result.meta;
                    const quote = result.indicators?.quote?.[0];
                    const timestamps = result.timestamp || [];

                    // Get historical prices for chart
                    const history = timestamps.map((ts, i) => ({
                        date: new Date(ts * 1000).toISOString().split('T')[0],
                        price: quote?.close?.[i] || 0,
                    })).filter(h => h.price > 0);

                    return {
                        symbol: meta.symbol,
                        name: meta.shortName || meta.longName || symbol,
                        price: meta.regularMarketPrice,
                        previousClose: meta.previousClose,
                        change: meta.regularMarketPrice - meta.previousClose,
                        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100),
                        currency: meta.currency,
                        exchange: meta.exchangeName,
                        history,
                    };
                } catch (error) {
                    console.error(`Error fetching ${symbol}:`, error);
                    return {
                        symbol,
                        error: error.message,
                    };
                }
            })
        );

        return NextResponse.json({ stocks: stockData });
    } catch (error) {
        console.error('Stocks API error:', error);
        return NextResponse.json({ error: 'Failed to fetch stock prices' }, { status: 500 });
    }
}

// Search for stocks
export async function POST(request) {
    try {
        const body = await request.json();
        const { query } = body;

        if (!query || query.length < 1) {
            return NextResponse.json({ results: [] });
        }

        const response = await fetch(
            `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const data = await response.json();
        const results = (data.quotes || [])
            .filter(q => q.quoteType === 'EQUITY')
            .map(q => ({
                symbol: q.symbol,
                name: q.shortname || q.longname || q.symbol,
                exchange: q.exchange,
                type: q.quoteType,
            }));

        return NextResponse.json({ results });
    } catch (error) {
        console.error('Stock search error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
