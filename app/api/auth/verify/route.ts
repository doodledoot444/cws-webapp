import { NextResponse } from 'next/server';
import { toClientUser } from '@/lib/auth';
import { verifyEmailToken } from '@/lib/emailVerification';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Invalid link' }, { status: 400 });
    }

    const result = await verifyEmailToken(token);
    if (!result.success) {
      if (result.reason === 'invalid') {
        return NextResponse.json({ message: 'Invalid link' }, { status: 400 });
      }

      if (result.reason === 'expired') {
        return NextResponse.json({ message: 'Link expired' }, { status: 400 });
      }

      return NextResponse.json({ message: 'Already verified' }, { status: 409 });
    }

    return NextResponse.json({
      message: 'Email verified successfully. You can now place orders.',
      user: toClientUser(result.user),
    });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json(
      { message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
