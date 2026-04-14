import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getRevenueAnalytics } from '@/lib/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const analytics = await getRevenueAnalytics();
    return NextResponse.json(analytics, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Failed to load admin analytics:', error);
    return NextResponse.json(
      { message: 'Unable to load analytics right now.' },
      { status: 500 }
    );
  }
}
