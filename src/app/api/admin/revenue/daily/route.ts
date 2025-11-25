import { NextRequest, NextResponse } from 'next/server';
import { getDailyRevenue } from '@/services/overview/revenue';

export async function GET(req: NextRequest) {
  try {
    const daysParam = req.nextUrl.searchParams.get('days');
    const days = daysParam ? Number(daysParam) : 90;
    const dailyRevenue = await getDailyRevenue(days);
    return NextResponse.json(dailyRevenue);
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
