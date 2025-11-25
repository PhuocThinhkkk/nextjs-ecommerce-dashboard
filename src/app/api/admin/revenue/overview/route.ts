import { NextRequest, NextResponse } from 'next/server';
import { getRevenueOverview } from '@/services/overview/revenue';

export async function GET(req: NextRequest) {
  try {
    const overview = await getRevenueOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
