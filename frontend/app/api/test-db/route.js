import dbConnect from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const conn = await dbConnect();
        return NextResponse.json({
            status: 'success',
            message: 'MongoDB Connected Successfully',
            connectionState: conn.connection.readyState
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to MongoDB',
            error: error.message
        }, { status: 500 });
    }
}
