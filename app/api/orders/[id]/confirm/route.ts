import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(
  _: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden.' }, { status: 403 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ message: 'Order id is required.' }, { status: 400 });
    }

    const prisma = getPrisma();
    const updated = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({ where: { id } });
      if (!existingOrder) {
        return null;
      }

      const order = await tx.order.update({
        where: { id },
        data: { status: 'CONFIRMED' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      await tx.notification.create({
        data: {
          userId: order.userId,
          type: 'ORDER_CONFIRMED',
          message: 'Your order has been confirmed',
        },
      });

      return order;
    });

    if (!updated) {
      return NextResponse.json({ message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error('Failed to confirm order:', error);
    return NextResponse.json(
      { message: 'Unable to confirm this order right now.' },
      { status: 500 }
    );
  }
}
