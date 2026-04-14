import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const prisma = getPrisma();
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: sessionUserId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.notification.count({
        where: { userId: sessionUserId, isRead: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json(
      { message: 'Unable to fetch notifications right now.' },
      { status: 500 }
    );
  }
}
