import { NextRequest, NextResponse } from 'next/server';
import { getDailyNewUsers } from '@/services/overview/users';

export async function GET(req: NextRequest) {
  try {
    const daysParam = req.nextUrl.searchParams.get('days');
    const days = daysParam ? Number(daysParam) : 90;
    const dailyUsers = await getDailyNewUsers(days);
    return NextResponse.json(dailyUsers);
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
