import ChartBarDefault from '@/features/overview/components/payment-6-months-bar-graph';
import { getLast6MonthsRevenue } from '@/services/overview/payments';

export default async function OrdersBarChart() {
  const query = await getLast6MonthsRevenue();
  return (
    <ChartBarDefault
      chartData={query.chartData}
      startMonth={query.startMonth}
      endMonth={query.endMonth}
      trendDirection={query.trendDirection}
      trendPercent={query.trendPercent}
    />
  );
}
