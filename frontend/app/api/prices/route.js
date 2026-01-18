import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,pax-gold&vs_currencies=myr',
            {
                headers: {
                    'Accept': 'application/json',
                },
                next: { revalidate: 60 } // Cache for 60 seconds
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch prices');
        }

        const data = await response.json();

        // Gold Calculations
        // 1 Troy Oz = 31.1035 grams
        const goldPricePerOz = data['pax-gold'].myr;
        const goldPricePerGram999 = goldPricePerOz / 31.1035;
        const goldPricePerGram916 = goldPricePerGram999 * 0.916;

        return NextResponse.json({
            btc: data.bitcoin.myr,
            eth: data.ethereum.myr,
            gold: {
                oz: goldPricePerOz,
                gram999: goldPricePerGram999,
                gram916: goldPricePerGram916
            },
            currency: {
                code: 'MYR',
                rate: 1.0 // Base currency
            }
        });

    } catch (error) {
        console.error('Error fetching prices:', error);
        // Fallback prices
        return NextResponse.json({
            btc: 440000,
            eth: 15000,
            gold: {
                oz: 12000,
                gram999: 385, // Approx fallback
                gram916: 352
            },
            error: 'Using fallback prices'
        }, { status: 200 });
    }
}
