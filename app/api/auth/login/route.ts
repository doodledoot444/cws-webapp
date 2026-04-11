import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { isValidEmail, toClientUser, verifyPassword } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password. Please try again.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid email or password. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: toClientUser(user) });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
