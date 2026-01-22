import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Zakat from '@/models/Zakat';
import Portfolio from '@/models/Portfolio';
import { getServerSession } from 'next-auth';

const NISAB_GOLD_GRAMS = 85;
const ZAKAT_RATE = 0.025; // 2.5%

// GET - Fetch user's Zakat data
export async function GET(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let zakat = await Zakat.findOne({ userEmail: session.user.email });

        // Create default Zakat document if none exists
        if (!zakat) {
            zakat = await Zakat.create({
                userEmail: session.user.email,
                haulStartDate: new Date(),
                nisabPreference: 'gold',
                records: [],
                currentCalculation: null,
            });
        }

        // Calculate days until Haul
        const daysUntilHaul = zakat.getDaysUntilHaul();

        // Get summary stats
        const currentYear = new Date().getFullYear().toString();
        const thisYearRecords = zakat.records.filter(r => r.haulYear === currentYear);
        const totalPaidThisYear = thisYearRecords.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
        const totalPaidAllTime = zakat.records.reduce((sum, r) => sum + (r.paidAmount || 0), 0);

        return NextResponse.json({
            config: {
                haulStartDate: zakat.haulStartDate,
                nisabPreference: zakat.nisabPreference,
                daysUntilHaul,
            },
            currentCalculation: zakat.currentCalculation,
            records: zakat.records.slice(-10).reverse(), // Last 10 records, newest first
            summary: {
                totalPaidThisYear,
                totalPaidAllTime,
                recordsCount: zakat.records.length,
            },
        });
    } catch (error) {
        console.error('Zakat GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch Zakat data' }, { status: 500 });
    }
}

// POST - Calculate Zakat or save a record
export async function POST(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action } = body;

        let zakat = await Zakat.findOne({ userEmail: session.user.email });

        if (!zakat) {
            zakat = await Zakat.create({
                userEmail: session.user.email,
                haulStartDate: new Date(),
                nisabPreference: 'gold',
                records: [],
            });
        }

        if (action === 'calculate') {
            // Calculate Zakat from provided data
            const { assets, prices } = body;

            const goldValue = (assets.gold?.grams999 || 0) * (prices.gold999 || 0) +
                             (assets.gold?.grams916 || 0) * (prices.gold916 || 0);
            const savingsValue = assets.savings || 0;
            const stocksValue = assets.stocks?.totalValue || 0;
            const cryptoValue = assets.crypto?.totalValue || 0;
            const otherValue = assets.otherAssets || 0;

            const totalAssets = goldValue + savingsValue + stocksValue + cryptoValue + otherValue;
            const nisabThreshold = NISAB_GOLD_GRAMS * (prices.gold999 || 385);
            const aboveNisab = totalAssets >= nisabThreshold;
            const zakatDue = aboveNisab ? totalAssets * ZAKAT_RATE : 0;

            // Update current calculation
            zakat.currentCalculation = {
                calculatedAt: new Date(),
                totalAssets,
                zakatDue,
                status: 'pending',
            };
            await zakat.save();

            return NextResponse.json({
                calculation: {
                    assets: {
                        gold: { value: goldValue, grams999: assets.gold?.grams999 || 0, grams916: assets.gold?.grams916 || 0 },
                        savings: savingsValue,
                        stocks: stocksValue,
                        crypto: cryptoValue,
                        other: otherValue,
                    },
                    totalAssets,
                    nisabThreshold,
                    aboveNisab,
                    zakatDue,
                },
                prices,
            });

        } else if (action === 'save') {
            // Save a Zakat record
            const { calculation, assets, prices } = body;
            const currentYear = new Date().getFullYear().toString();

            const newRecord = {
                calculatedAt: new Date(),
                haulYear: currentYear,
                assets: {
                    gold: {
                        grams999: assets.gold?.grams999 || 0,
                        grams916: assets.gold?.grams916 || 0,
                        totalValue: assets.gold?.value || 0,
                    },
                    savings: assets.savings || 0,
                    stocks: {
                        totalValue: assets.stocks?.totalValue || 0,
                        holdings: assets.stocks?.holdings || [],
                    },
                    crypto: {
                        totalValue: assets.crypto?.totalValue || 0,
                        holdings: assets.crypto?.holdings || [],
                    },
                    otherAssets: assets.otherAssets || 0,
                },
                totalAssets: calculation.totalAssets,
                nisabThreshold: calculation.nisabThreshold,
                nisabGoldPrice: prices.gold999 || 385,
                zakatDue: calculation.zakatDue,
                status: 'pending',
                paidAmount: 0,
            };

            zakat.records.push(newRecord);
            zakat.currentCalculation = {
                calculatedAt: newRecord.calculatedAt,
                totalAssets: newRecord.totalAssets,
                zakatDue: newRecord.zakatDue,
                status: 'pending',
            };
            await zakat.save();

            return NextResponse.json({
                message: 'Zakat record saved',
                record: newRecord,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Zakat POST error:', error);
        return NextResponse.json({ error: 'Failed to process Zakat' }, { status: 500 });
    }
}

// PUT - Update config or mark as paid
export async function PUT(request) {
    try {
        await dbConnect();

        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { action } = body;

        const zakat = await Zakat.findOne({ userEmail: session.user.email });

        if (!zakat) {
            return NextResponse.json({ error: 'Zakat record not found' }, { status: 404 });
        }

        if (action === 'updateConfig') {
            const { haulStartDate, nisabPreference } = body;

            if (haulStartDate) {
                zakat.haulStartDate = new Date(haulStartDate);
            }
            if (nisabPreference) {
                zakat.nisabPreference = nisabPreference;
            }

            await zakat.save();

            return NextResponse.json({
                message: 'Config updated',
                config: {
                    haulStartDate: zakat.haulStartDate,
                    nisabPreference: zakat.nisabPreference,
                },
            });

        } else if (action === 'markPaid') {
            const { recordId, paidAmount, paymentMethod, paymentNotes } = body;

            const record = zakat.records.id(recordId);
            if (!record) {
                return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            }

            record.paidAmount = (record.paidAmount || 0) + paidAmount;
            record.paidDate = new Date();
            record.paymentMethod = paymentMethod;
            record.paymentNotes = paymentNotes;

            // Update status based on payment
            if (record.paidAmount >= record.zakatDue) {
                record.status = 'paid';
            } else if (record.paidAmount > 0) {
                record.status = 'partial';
            }

            // Update current calculation status if this is the latest record
            if (zakat.currentCalculation &&
                record.calculatedAt.getTime() === new Date(zakat.currentCalculation.calculatedAt).getTime()) {
                zakat.currentCalculation.status = record.status;
            }

            await zakat.save();

            return NextResponse.json({
                message: 'Payment recorded',
                record,
            });

        } else if (action === 'deleteRecord') {
            const { recordId } = body;

            const record = zakat.records.id(recordId);
            if (!record) {
                return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            }

            // Remove the record
            zakat.records.pull(recordId);

            // If this was the current calculation, clear it or set to the latest record
            if (zakat.currentCalculation &&
                record.calculatedAt.getTime() === new Date(zakat.currentCalculation.calculatedAt).getTime()) {
                if (zakat.records.length > 0) {
                    const latestRecord = zakat.records[zakat.records.length - 1];
                    zakat.currentCalculation = {
                        calculatedAt: latestRecord.calculatedAt,
                        totalAssets: latestRecord.totalAssets,
                        zakatDue: latestRecord.zakatDue,
                        status: latestRecord.status,
                    };
                } else {
                    zakat.currentCalculation = null;
                }
            }

            await zakat.save();

            return NextResponse.json({
                message: 'Record deleted',
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Zakat PUT error:', error);
        return NextResponse.json({ error: 'Failed to update Zakat' }, { status: 500 });
    }
}
