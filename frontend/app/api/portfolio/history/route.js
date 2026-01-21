import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
import { getServerSession } from 'next-auth';

// POST - Record portfolio snapshot for history
export async function POST(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { totalValue, stocksValue, cryptoValue, savingsValue } = body;

        const portfolio = await Portfolio.findOne({ userEmail: session.user.email });

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        // Add new history entry
        const historyEntry = {
            date: new Date(),
            totalValue,
            stocksValue,
            cryptoValue,
            savingsValue,
        };

        portfolio.history.push(historyEntry);

        // Keep only last 365 days of history
        if (portfolio.history.length > 365) {
            portfolio.history = portfolio.history.slice(-365);
        }

        await portfolio.save();

        return NextResponse.json({ success: true, history: portfolio.history });
    } catch (error) {
        console.error('Portfolio history POST error:', error);
        return NextResponse.json({ error: 'Failed to record history' }, { status: 500 });
    }
}
