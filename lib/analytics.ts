import { Prisma } from '@prisma/client';
import { getPrisma } from '@/lib/prisma';

const MANILA_TIMEZONE = 'Asia/Manila';
const DEFAULT_PRICE_PER_GALLON = 30;

type AggregateRow = {
  dailyGallons: number | string | bigint | null;
  weeklyGallons: number | string | bigint | null;
  monthlyGallons: number | string | bigint | null;
};

type TrendRow = {
  dayKey: string;
  gallons: number | string | bigint | null;
};

function toNumber(value: number | string | bigint | null | undefined) {
  if (typeof value === 'bigint') {
    return Number(value);
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return Number(value || 0);
}

function getPricePerGallon() {
  const parsed = Number(process.env.GALLON_PRICE_PHP || DEFAULT_PRICE_PER_GALLON);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_PRICE_PER_GALLON;
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

  const aggregateRows = await prisma.$queryRaw<AggregateRow[]>(Prisma.sql`
    SELECT
      COALESCE(SUM(CASE
        WHEN (o."createdAt" AT TIME ZONE ${MANILA_TIMEZONE})::date = (NOW() AT TIME ZONE ${MANILA_TIMEZONE})::date
        THEN o.quantity ELSE 0 END), 0) AS "dailyGallons",
      COALESCE(SUM(CASE
        WHEN (o."createdAt" AT TIME ZONE ${MANILA_TIMEZONE}) >= date_trunc('week', NOW() AT TIME ZONE ${MANILA_TIMEZONE})
        THEN o.quantity ELSE 0 END), 0) AS "weeklyGallons",
      COALESCE(SUM(CASE
        WHEN (o."createdAt" AT TIME ZONE ${MANILA_TIMEZONE}) >= date_trunc('month', NOW() AT TIME ZONE ${MANILA_TIMEZONE})
        THEN o.quantity ELSE 0 END), 0) AS "monthlyGallons"
    FROM "Order" o
    WHERE o.status = 'CONFIRMED'
  `);

  const [aggregate] = aggregateRows;
  const dailyGallons = toNumber(aggregate?.dailyGallons);
  const weeklyGallons = toNumber(aggregate?.weeklyGallons);
  const monthlyGallons = toNumber(aggregate?.monthlyGallons);

  const trendRows = await prisma.$queryRaw<TrendRow[]>(Prisma.sql`
    SELECT
      to_char((o."createdAt" AT TIME ZONE ${MANILA_TIMEZONE})::date, 'YYYY-MM-DD') AS "dayKey",
      COALESCE(SUM(o.quantity), 0) AS "gallons"
    FROM "Order" o
    WHERE o.status = 'CONFIRMED'
      AND (o."createdAt" AT TIME ZONE ${MANILA_TIMEZONE})::date >= ((NOW() AT TIME ZONE ${MANILA_TIMEZONE})::date - INTERVAL '6 days')
    GROUP BY "dayKey"
    ORDER BY "dayKey" ASC
  `);

  const trendMap = new Map(trendRows.map((row) => [row.dayKey, toNumber(row.gallons)]));
  const now = new Date();
  const trend: RevenuePoint[] = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
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
