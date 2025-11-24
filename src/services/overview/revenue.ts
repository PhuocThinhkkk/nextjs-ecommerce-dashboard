import db from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function getRevenueOverview() {
  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [totalRevenue, thisMonthRevenue, lastMonthRevenue] = await Promise.all([
    // total revenue
    db.paymentDetails.aggregate({
      _sum: { amount: true }
    }),

    // revenue for this month
    db.paymentDetails.aggregate({
      where: { created_at: { gte: thisMonthStart, lte: thisMonthEnd } },
      _sum: { amount: true }
    }),

    // revenue for last month
    db.paymentDetails.aggregate({
      where: { created_at: { gte: lastMonthStart, lte: lastMonthEnd } },
      _sum: { amount: true }
    })
  ]);

  const thisMonth = thisMonthRevenue._sum.amount || 0;
  const lastMonth = lastMonthRevenue._sum.amount || 0;

  const percentChange =
    lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    thisMonthRevenue: thisMonth,
    lastMonthRevenue: lastMonth,
    percentChange,
    trend: percentChange >= 0 ? 'up' : 'down'
  };
}

import { subDays, startOfDay } from 'date-fns';

export async function getDailyRevenue(days = 90) {
  const startDate = startOfDay(subDays(new Date(), days));

  // Raw SQL because prisma groupBy cannot truncate date
  const result = await db.$queryRaw<{ date: Date; money: number }[]>`
    SELECT
      date_trunc('day', "create_at") AS date,
      SUM(amount) AS money
    FROM "PaymentDetails"
    WHERE "create_at" >= ${startDate}
    GROUP BY date
    ORDER BY date ASC
  `;

  return result.map((row) => ({
    date: row.date.toISOString().split('T')[0], // YYYY-MM-DD
    money: Number(row.money)
  }));
}
