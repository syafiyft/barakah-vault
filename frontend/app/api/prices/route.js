import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=myr',
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

        // Transform to expected format if needed, or return as is
        // CoinGecko returns: { bitcoin: { myr: 123456 }, ethereum: { myr: 12345 } }
        return NextResponse.json({
            btc: data.bitcoin.myr,
            eth: data.ethereum.myr
        });

    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Fallback prices in case of error (e.g. rate limiting)
        return NextResponse.json({
            btc: 440000,
            eth: 15000,
            error: 'Using fallback prices'
        }, { status: 200 }); // Return 200 to keep UI working with fallback
    }
}
