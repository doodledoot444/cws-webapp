import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function PATCH(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { message: 'Notification id is required.' },
        { status: 400 }
      );
    }

    const prisma = getPrisma();
    const existing = await prisma.notification.findUnique({ where: { id } });
    if (!existing || existing.userId !== sessionUserId) {
      return NextResponse.json({ message: 'Not found.' }, { status: 404 });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ notification });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { message: 'Unable to update notification right now.' },
      { status: 500 }
    );
  }
}
