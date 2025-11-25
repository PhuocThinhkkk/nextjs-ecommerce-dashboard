import { NextRequest, NextResponse } from 'next/server';
import { getOrdersOverview } from '@/services/overview/orders';

export async function GET(req: NextRequest) {
  try {
    const overview = await getOrdersOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
