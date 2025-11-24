import db from '@/lib/db';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export async function getOrderOverview() {
  const now = new Date();

  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [totals, thisMonth, lastMonth] = await Promise.all([
    db.orderDetails.groupBy({
      by: ['status'],
      _count: true
    }),

    db.orderDetails.count({
      where: {
        status: 'COMPLETED',
        created_at: { gte: thisMonthStart, lte: thisMonthEnd }
      }
    }),

    db.orderDetails.count({
      where: {
        status: 'COMPLETED',
        created_at: { gte: lastMonthStart, lte: lastMonthEnd }
      }
    })
  ]);

  const parseStatus = (status: string) =>
    totals.find((t) => t.status === status)?._count || 0;

  const percentChange =
    lastMonth === 0 ? 100 : ((thisMonth - lastMonth) / lastMonth) * 100;

  return {
    totalOrders: totals.reduce((acc, x) => acc + x._count, 0),
    completed: parseStatus('COMPLETED'),
    cancelled: parseStatus('CANCELLED'),
    pending: parseStatus('PENDING'),
    thisMonthCompleted: thisMonth,
    lastMonthCompleted: lastMonth,
    percentChange,
    trend: percentChange >= 0 ? 'up' : 'down'
  };
}
