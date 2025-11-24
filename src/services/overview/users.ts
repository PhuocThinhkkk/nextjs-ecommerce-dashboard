import db from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function getUserOverview() {
  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [total, thisMonth, lastMonth, withOrders] = await Promise.all([
    db.user.count(),

    db.user.count({
      where: { created_at: { gte: thisMonthStart, lte: thisMonthEnd } }
    }),

    db.user.count({
      where: { created_at: { gte: lastMonthStart, lte: lastMonthEnd } }
    }),

    db.user.count({
      where: { orders: { some: {} } }
    })
  ]);

  const percentChange =
    lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

  return {
    totalUsers: total,
    newUsersThisMonth: thisMonth,
    newUsersLastMonth: lastMonth,
    usersWithOrders: withOrders,
    percentChange,
    trend: percentChange >= 0 ? 'up' : 'down'
  };
}

import { subDays, startOfDay } from 'date-fns';

export async function getDailyNewUsers(days = 90) {
  const startDate = startOfDay(subDays(new Date(), days));

  const result = await db.$queryRaw<{ date: Date; count: bigint }[]>`
    SELECT
      date_trunc('day', "create_at") AS date,
      COUNT(*) AS count
    FROM "User"
    WHERE "create_at" >= ${startDate}
    GROUP BY date
    ORDER BY date ASC
  `;

  return result.map((row) => ({
    date: row.date.toISOString().split('T')[0],
    count: Number(row.count)
  }));
}
