import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getPrisma } from '@/lib/prisma';
import {
  hashPassword,
  isValidEmail,
  toClientUser,
} from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const prisma = getPrisma();
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const address = body.address ? String(body.address).trim() : null;

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

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already in use. Please sign in instead.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) =>
      tx.user.create({
        data: {
          email,
          passwordHash,
          name: name || null,
          phone,
          address,
          isVerified: false,
        },
      })
    );

    return NextResponse.json(
      {
        message:
          'Account created successfully. Sign in and request verification when ready.',
        user: toClientUser(created),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
