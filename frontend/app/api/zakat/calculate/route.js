import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
import { getServerSession } from 'next-auth';

const NISAB_GOLD_GRAMS = 85;
const ZAKAT_RATE = 0.025; // 2.5%

// Helper to fetch prices
async function fetchPrices() {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/prices`, { next: { revalidate: 60 } });
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error('Failed to fetch prices:', error);
    }
    // Fallback prices
    return {
        btc: 440000,
        eth: 15000,
        gold: { gram999: 385, gram916: 352 },
    };
}

// Helper to fetch stock prices
async function fetchStockPrices(symbols) {
    if (!symbols || symbols.length === 0) return {};

    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/stocks?symbols=${symbols.join(',')}`, {
            next: { revalidate: 60 },
        });
        if (res.ok) {
            const data = await res.json();
            const pricesMap = {};
            data.stocks?.forEach(stock => {
                if (!stock.error) {
                    pricesMap[stock.symbol] = stock.price;
                }
            });
            return pricesMap;
        }
    } catch (error) {
        console.error('Failed to fetch stock prices:', error);
    }
    return {};
}

// POST - Calculate Zakat from portfolio
export async function POST(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            includePortfolio = true,
            manualAssets = {},
            excludeHoldings = [],
        } = body;

        // Fetch prices
        const prices = await fetchPrices();

        let portfolioAssets = {
            savings: { total: 0, holdings: [] },
            stocks: { total: 0, holdings: [] },
            crypto: { total: 0, holdings: [] },
        };

        // Fetch portfolio if requested
        if (includePortfolio) {
            const portfolio = await Portfolio.findOne({ userEmail: session.user.email });

            if (portfolio) {
                // Calculate savings
                portfolio.savings.forEach(saving => {
                    if (!excludeHoldings.includes(saving._id.toString())) {
                        portfolioAssets.savings.holdings.push({
                            id: saving._id.toString(),
                            name: saving.name,
                            value: saving.amount,
                        });
                        portfolioAssets.savings.total += saving.amount;
                    }
                });

                // Calculate stocks
                if (portfolio.stocks.length > 0) {
                    const symbols = portfolio.stocks
                        .filter(s => !excludeHoldings.includes(s._id.toString()))
                        .map(s => s.symbol);

                    const stockPrices = await fetchStockPrices(symbols);

                    portfolio.stocks.forEach(stock => {
                        if (!excludeHoldings.includes(stock._id.toString())) {
                            const price = stockPrices[stock.symbol] || stock.averageCost;
                            const value = stock.quantity * price;
                            portfolioAssets.stocks.holdings.push({
                                id: stock._id.toString(),
                                symbol: stock.symbol,
                                name: stock.name,
                                quantity: stock.quantity,
                                price,
                                value,
                            });
                            portfolioAssets.stocks.total += value;
                        }
                    });
                }

                // Calculate crypto
                portfolio.crypto.forEach(crypto => {
                    if (!excludeHoldings.includes(crypto._id.toString())) {
                        let price = crypto.averageCost;
                        if (crypto.symbol === 'BTC') price = prices.btc;
                        else if (crypto.symbol === 'ETH') price = prices.eth;

                        const value = crypto.quantity * price;
                        portfolioAssets.crypto.holdings.push({
                            id: crypto._id.toString(),
                            symbol: crypto.symbol,
                            name: crypto.name,
                            quantity: crypto.quantity,
                            price,
                            value,
                        });
                        portfolioAssets.crypto.total += value;
                    }
                });
            }
        }

        // Calculate gold from manual input
        const gold999 = manualAssets.gold999 || 0;
        const gold916 = manualAssets.gold916 || 0;
        const goldValue = (gold999 * (prices.gold?.gram999 || 385)) +
                         (gold916 * (prices.gold?.gram916 || 352));

        // Add any additional manual savings
        const additionalSavings = manualAssets.additionalSavings || 0;

        // Calculate totals
        const totalAssets =
            goldValue +
            portfolioAssets.savings.total +
            additionalSavings +
            portfolioAssets.stocks.total +
            portfolioAssets.crypto.total +
            (manualAssets.otherAssets || 0);

        const nisabThreshold = NISAB_GOLD_GRAMS * (prices.gold?.gram999 || 385);
        const aboveNisab = totalAssets >= nisabThreshold;
        const zakatDue = aboveNisab ? Math.round(totalAssets * ZAKAT_RATE * 100) / 100 : 0;

        return NextResponse.json({
            calculation: {
                gold: {
                    grams999: gold999,
                    grams916: gold916,
                    value: goldValue,
                },
                savings: {
                    fromPortfolio: portfolioAssets.savings.total,
                    additional: additionalSavings,
                    total: portfolioAssets.savings.total + additionalSavings,
                    holdings: portfolioAssets.savings.holdings,
                },
                stocks: {
                    total: portfolioAssets.stocks.total,
                    holdings: portfolioAssets.stocks.holdings,
                },
                crypto: {
                    total: portfolioAssets.crypto.total,
                    holdings: portfolioAssets.crypto.holdings,
                },
                otherAssets: manualAssets.otherAssets || 0,
                totalAssets,
                nisabThreshold,
                aboveNisab,
                zakatDue,
            },
            prices: {
                gold999: prices.gold?.gram999 || 385,
                gold916: prices.gold?.gram916 || 352,
                btc: prices.btc,
                eth: prices.eth,
            },
        });

    } catch (error) {
        console.error('Zakat calculate error:', error);
        return NextResponse.json({ error: 'Failed to calculate Zakat' }, { status: 500 });
    }
}
