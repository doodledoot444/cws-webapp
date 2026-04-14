import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body?.name ?? '').trim();
    const address = String(body?.address ?? '').trim();
    const phoneValue = body?.phone;
    const phone =
      phoneValue === null || phoneValue === undefined
        ? null
        : String(phoneValue).trim() || null;

    if (!name || !address) {
      return NextResponse.json(
        { message: 'Name and home address are required.' },
        { status: 400 }
      );
    }

    const prisma = getPrisma();
    const updatedUser = await prisma.user.update({
      where: { id: sessionUserId },
      data: {
        name,
        phone,
        address,
      },
      select: {
        name: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json({
      message: 'Account details updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Failed to update account settings:', error);
    return NextResponse.json(
      { message: 'Unable to update account settings right now.' },
      { status: 500 }
    );
  }
}
