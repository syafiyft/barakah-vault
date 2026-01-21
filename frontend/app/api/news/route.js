import { NextResponse } from 'next/server';

// Fetch market news from Yahoo Finance
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'market'; // market, stock, crypto
    const symbol = searchParams.get('symbol'); // Optional specific stock symbol

    try {
        let newsData = [];

        if (symbol) {
            // Fetch news for specific stock
            const response = await fetch(
                `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}&quotesCount=0&newsCount=10`,
                {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    next: { revalidate: 300 }, // Cache for 5 minutes
                }
            );

            if (response.ok) {
                const data = await response.json();
                newsData = (data.news || []).map(formatNewsItem);
            }
        } else {
            // Fetch general market news
            const response = await fetch(
                'https://query1.finance.yahoo.com/v1/finance/search?q=stock%20market&quotesCount=0&newsCount=15',
                {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    next: { revalidate: 300 },
                }
            );

            if (response.ok) {
                const data = await response.json();
                newsData = (data.news || []).map(formatNewsItem);
            }
        }

        // If Yahoo API fails or returns empty, use fallback news
        if (newsData.length === 0) {
            newsData = getFallbackNews();
        }

        return NextResponse.json({ news: newsData });
    } catch (error) {
        console.error('News API error:', error);
        return NextResponse.json({ news: getFallbackNews() });
    }
}

function formatNewsItem(item) {
    return {
        id: item.uuid || Math.random().toString(36).substr(2, 9),
        title: item.title,
        summary: item.publisher || '',
        source: item.publisher || 'Yahoo Finance',
        url: item.link,
        thumbnail: item.thumbnail?.resolutions?.[0]?.url || null,
        publishedAt: item.providerPublishTime
            ? new Date(item.providerPublishTime * 1000).toISOString()
            : new Date().toISOString(),
        relatedTickers: item.relatedTickers || [],
    };
}

function getFallbackNews() {
    // Fallback news for when API fails
    const now = new Date();
    return [
        {
            id: '1',
            title: 'Global Markets Show Mixed Signals Amid Economic Data',
            summary: 'Investors analyze latest employment figures and inflation reports',
            source: 'Market Watch',
            url: '#',
            thumbnail: null,
            publishedAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
            relatedTickers: ['SPY', 'QQQ'],
        },
        {
            id: '2',
            title: 'Tech Sector Leads Market Rally on AI Optimism',
            summary: 'Major tech companies see gains as AI investments continue',
            source: 'Financial Times',
            url: '#',
            thumbnail: null,
            publishedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            relatedTickers: ['NVDA', 'MSFT', 'GOOGL'],
        },
        {
            id: '3',
            title: 'Asian Markets Close Higher Following Wall Street Gains',
            summary: 'Regional indices benefit from positive overnight sentiment',
            source: 'Reuters',
            url: '#',
            thumbnail: null,
            publishedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
            relatedTickers: [],
        },
        {
            id: '4',
            title: 'Bitcoin Holds Steady Above Key Support Level',
            summary: 'Cryptocurrency market shows resilience amid regulatory discussions',
            source: 'CoinDesk',
            url: '#',
            thumbnail: null,
            publishedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
            relatedTickers: ['BTC-USD', 'ETH-USD'],
        },
        {
            id: '5',
            title: 'Energy Stocks Rise on Oil Price Recovery',
            summary: 'OPEC+ production decisions impact global energy markets',
            source: 'Bloomberg',
            url: '#',
            thumbnail: null,
            publishedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
            relatedTickers: ['XOM', 'CVX'],
        },
    ];
}
