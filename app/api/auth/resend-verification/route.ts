import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/mailer';
import { auth } from '@/auth';
import { resolveVerificationTokenForUser } from '@/lib/emailVerification';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const session = await auth();
    const sessionUserId = session?.user?.id;
    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const result = await resolveVerificationTokenForUser(sessionUserId);
    if (!result.success) {
      if (result.reason === 'user-not-found') {
        return NextResponse.json(
          { message: 'User not found.' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: 'Already verified' },
        { status: 409 }
      );
    }

    await sendVerificationEmail(result.user.email, result.token, result.user.name, origin);

    return NextResponse.json({
      message: result.reused
        ? 'Verification link is still valid. We resent the same link.'
        : 'A new verification email has been sent.',
    });
  } catch (error) {
    console.error('Resend verification failed:', error);
    return NextResponse.json(
      { message: 'Unable to resend verification email right now.' },
      { status: 500 }
    );
  }
}
