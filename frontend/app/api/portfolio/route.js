import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
import { getServerSession } from 'next-auth';

// GET - Fetch user's portfolio
export async function GET(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let portfolio = await Portfolio.findOne({ userEmail: session.user.email });

        // Create empty portfolio if none exists
        if (!portfolio) {
            portfolio = await Portfolio.create({
                userEmail: session.user.email,
                stocks: [],
                crypto: [],
                savings: [],
                history: [],
            });
        }

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Portfolio GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
    }
}

// POST - Add new holding to portfolio
export async function POST(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, data } = body; // type: 'stock' | 'crypto' | 'savings'

        let portfolio = await Portfolio.findOne({ userEmail: session.user.email });

        if (!portfolio) {
            portfolio = await Portfolio.create({
                userEmail: session.user.email,
                stocks: [],
                crypto: [],
                savings: [],
                history: [],
            });
        }

        switch (type) {
            case 'stock':
                portfolio.stocks.push(data);
                break;
            case 'crypto':
                portfolio.crypto.push(data);
                break;
            case 'savings':
                portfolio.savings.push(data);
                break;
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        await portfolio.save();
        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Portfolio POST error:', error);
        return NextResponse.json({ error: 'Failed to add holding' }, { status: 500 });
    }
}

// PUT - Update existing holding
export async function PUT(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, id, data } = body;

        const portfolio = await Portfolio.findOne({ userEmail: session.user.email });

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        let holding;
        switch (type) {
            case 'stock':
                holding = portfolio.stocks.id(id);
                break;
            case 'crypto':
                holding = portfolio.crypto.id(id);
                break;
            case 'savings':
                holding = portfolio.savings.id(id);
                break;
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        if (!holding) {
            return NextResponse.json({ error: 'Holding not found' }, { status: 404 });
        }

        Object.assign(holding, data);
        await portfolio.save();

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Portfolio PUT error:', error);
        return NextResponse.json({ error: 'Failed to update holding' }, { status: 500 });
    }
}

// DELETE - Remove holding from portfolio
export async function DELETE(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const id = searchParams.get('id');

        const portfolio = await Portfolio.findOne({ userEmail: session.user.email });

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        switch (type) {
            case 'stock':
                portfolio.stocks.pull(id);
                break;
            case 'crypto':
                portfolio.crypto.pull(id);
                break;
            case 'savings':
                portfolio.savings.pull(id);
                break;
            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        await portfolio.save();
        return NextResponse.json(portfolio);
    } catch (error) {
        console.error('Portfolio DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete holding' }, { status: 500 });
    }
}
