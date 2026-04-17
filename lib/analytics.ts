import { OrderStatus } from '@prisma/client';
import { getPrisma } from '@/lib/prisma';

const MANILA_TIMEZONE = 'Asia/Manila';
const DEFAULT_PRICE_PER_GALLON = 30;

function getPricePerGallon() {
  const parsed = Number(process.env.GALLON_PRICE_PHP || DEFAULT_PRICE_PER_GALLON);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PRICE_PER_GALLON;
}

function getManilaDateKey(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: MANILA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function getStartOfManilaDay(offsetDays = 0) {
  const now = new Date();
  const manilaDate = getManilaDateKey(now).split('-').map(Number);
  const [year, month, day] = manilaDate;
  return new Date(Date.UTC(year, month - 1, day + offsetDays, -8, 0, 0, 0));
}

function sumOrderQuantity(orders: Array<{ quantity: number }>) {
  return orders.reduce((total, order) => total + order.quantity, 0);
}

export type RevenuePoint = {
  date: string;
  gallons: number;
  revenue: number;
};

export type RevenueAnalytics = {
  timezone: string;
  pricePerGallon: number;
  daily: { gallons: number; revenue: number };
  weekly: { gallons: number; revenue: number };
  monthly: { gallons: number; revenue: number };
  trend: RevenuePoint[];
  generatedAt: string;
};

export async function getRevenueAnalytics(): Promise<RevenueAnalytics> {
  const prisma = getPrisma();
  const pricePerGallon = getPricePerGallon();

  const todayStart = getStartOfManilaDay();
  const tomorrowStart = getStartOfManilaDay(1);
  const trendStart = getStartOfManilaDay(-6);
  const weekStart = getStartOfManilaDay(-((todayStart.getUTCDay() + 6) % 7));
  const monthStart = new Date(Date.UTC(todayStart.getUTCFullYear(), todayStart.getUTCMonth(), 1, 16, 0, 0, 0));

  const [dailyOrders, weeklyOrders, monthlyOrders, trendOrders] = await Promise.all([
    prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
      select: { quantity: true },
    }),
    prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: {
          gte: weekStart,
        },
      },
      select: { quantity: true },
    }),
    prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: {
          gte: monthStart,
        },
      },
      select: { quantity: true },
    }),
    prisma.order.findMany({
      where: {
        status: OrderStatus.CONFIRMED,
        createdAt: {
          gte: trendStart,
          lt: tomorrowStart,
        },
      },
      select: {
        createdAt: true,
        quantity: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const dailyGallons = sumOrderQuantity(dailyOrders);
  const weeklyGallons = sumOrderQuantity(weeklyOrders);
  const monthlyGallons = sumOrderQuantity(monthlyOrders);

  const trendMap = new Map<string, number>();
  for (const order of trendOrders) {
    const dateKey = getManilaDateKey(order.createdAt);
    trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + order.quantity);
  }

  const trend: RevenuePoint[] = Array.from({ length: 7 }).map((_, index) => {
    const date = getStartOfManilaDay(index - 6);
    const dateKey = getManilaDateKey(date);
    const gallons = trendMap.get(dateKey) || 0;
    return {
      date: dateKey,
      gallons,
      revenue: gallons * pricePerGallon,
    };
  });

  return {
    timezone: MANILA_TIMEZONE,
    pricePerGallon,
    daily: {
      gallons: dailyGallons,
      revenue: dailyGallons * pricePerGallon,
    },
    weekly: {
      gallons: weeklyGallons,
      revenue: weeklyGallons * pricePerGallon,
    },
    monthly: {
      gallons: monthlyGallons,
      revenue: monthlyGallons * pricePerGallon,
    },
    trend,
    generatedAt: new Date().toISOString(),
  };
}
