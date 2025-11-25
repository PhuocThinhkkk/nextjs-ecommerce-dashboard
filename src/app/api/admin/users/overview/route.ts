import { NextRequest, NextResponse } from 'next/server';
import { getUserOverview } from '@/services/overview/users';

export async function GET(req: NextRequest) {
  try {
    const overview = await getUserOverview();
    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
