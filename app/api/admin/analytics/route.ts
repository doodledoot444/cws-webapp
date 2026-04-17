import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getRevenueAnalytics } from '@/lib/analytics';
import { getRequiredOneOfEnv } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authSecret = getRequiredOneOfEnv(
      ['NEXTAUTH_SECRET', 'AUTH_SECRET'],
      'admin analytics authentication'
    );
    const token = await getToken({ req: request, secret: authSecret });
    const userId = token?.id ?? token?.sub;
    const role = token?.role;

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
