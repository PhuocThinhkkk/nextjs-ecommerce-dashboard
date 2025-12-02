import db from '@/lib/db';

export interface LabelType {
  month: string;
  total: number;
}

export interface RevenueWithTrend {
  chartData: LabelType[];
  startMonth: string;
  endMonth: string;
  trendPercent: number; // positive = up, negative = down
  trendDirection: 'up' | 'down' | 'neutral';
}

export async function getLast6MonthsRevenue(): Promise<RevenueWithTrend> {
  const now = new Date();
  const monthMap = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Current 6 months
  const startCurrent = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0); // end of this month

  const payments = await db.paymentDetails.findMany({
    where: {
      created_at: {
        gte: startCurrent
      },
      status: 'PAID'
    },
    select: {
      created_at: true,
      amount: true
    }
  });

  // Initialize last 6 months with 0
  const chartData: LabelType[] = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      month: monthMap[d.getMonth()],
      total: 0
    };
  });

  // Aggregate payments per month
  for (const p of payments) {
    const month = monthMap[p.created_at.getMonth()];
    const item = chartData.find((r) => r.month === month);
    if (item) item.total += p.amount;
  }

  // Calculate trend compared to previous 6 months
  const startPrev = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const endPrev = new Date(now.getFullYear(), now.getMonth() - 5, 0);

  const prevPayments = await db.paymentDetails.findMany({
    where: {
      created_at: {
        gte: startPrev,
        lte: endPrev
      },
      status: 'PAID'
    },
    select: { amount: true }
  });

  const totalCurrent = chartData.reduce((acc, cur) => acc + cur.total, 0);
  const totalPrev = prevPayments.reduce((acc, cur) => acc + cur.amount, 0);

  let trendPercent = 0;
  let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';

  if (totalPrev === 0) {
    if (totalCurrent === 0) {
      trendDirection = 'neutral'; // nothing happened in both periods
      trendPercent = 0;
    } else {
      trendDirection = 'up'; // something happened now, previous nothing
      trendPercent = 100; // can set as 100% or "new" growth
    }
  } else {
    trendPercent = ((totalCurrent - totalPrev) / totalPrev) * 100;
    trendDirection =
      trendPercent > 0 ? 'up' : trendPercent < 0 ? 'down' : 'neutral';
    trendPercent = Math.abs(trendPercent);
  }

  return {
    chartData,
    startMonth: chartData[0].month,
    endMonth: chartData[chartData.length - 1].month,
    trendPercent: Math.round(trendPercent * 10) / 10, // round to 1 decimal
    trendDirection
  };
}
