import { MetricCard } from '@/components/card-with-small-chart';
import {
  getOrderCountMetrics,
  getOrderMetrics
} from '@/services/overview/orders';
import { getUserMetrics } from '@/services/overview/users';

export default async function WeeklyUsersAndPaymentMetric() {
  const [usersData, ordersData, revenueFromOrders] = await Promise.all([
    getUserMetrics(),
    getOrderCountMetrics(),
    getOrderMetrics()
  ]);
  return (
    <div className='grid h-full w-full grid-rows-3 gap-4'>
      <MetricCard data={usersData} />
      <MetricCard data={ordersData} />
      <MetricCard data={revenueFromOrders} />
    </div>
  );
}
