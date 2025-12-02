import { RecentSales } from '@/features/overview/components/recent-sales';
import { getUserRecentPayment } from '@/services/overview/users';

export default async function Sales() {
  const data = await getUserRecentPayment(6);
  return <RecentSales sales={data} />;
}
