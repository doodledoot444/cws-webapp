import { NextResponse } from 'next/server';
import { OrderStatus } from '@prisma/client';
import { auth } from '@/auth';
import { getPrisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function parseStatus(value: string | null): OrderStatus | null {
  if (value === 'PENDING' || value === 'CONFIRMED') {
    return value;
  }

  return null;
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;
    const sessionRole = session?.user?.role;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const status = parseStatus(searchParams.get('status'));
    const where = {
      ...(status ? { status } : {}),
      ...(sessionRole === 'ADMIN' ? {} : { userId: sessionUserId }),
    };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { message: 'Unable to fetch orders right now.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;

    if (!sessionUserId) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const quantity = Number(body.quantity);
    const total = Number(body.total);
    const address = body.address;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { message: 'Quantity must be a positive whole number.' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(total) || total <= 0) {
      return NextResponse.json(
        { message: 'Total must be a positive amount.' },
        { status: 400 }
      );
    }

    if (!address || typeof address !== 'object') {
      return NextResponse.json(
        { message: 'Valid delivery address is required.' },
        { status: 400 }
      );
    }

    const prisma = getPrisma();
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: sessionUserId,
          quantity,
          total,
          address,
          status: 'PENDING',
        },
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
          userId: sessionUserId,
          type: 'ORDER_CREATED',
          message: 'Your order has been placed',
        },
      });

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { message: 'Unable to place order right now.' },
      { status: 500 }
    );
  }
}
