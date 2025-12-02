import { BarGraph } from '@/features/overview/components/bar-graph';
import { getDailyRevenue } from '@/services/overview/revenue';

export default async function BarStats() {
  const data = await getDailyRevenue(89);

  return <BarGraph chartData={data} />;
}
