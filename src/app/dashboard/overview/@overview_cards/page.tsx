import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getRevenueOverview } from '@/services/overview/revenue';
import { getUserOverview } from '@/services/overview/users';

export default async function DashboardOverview() {
  const [revenueOverview, userOverview] = await Promise.all([
    getRevenueOverview(),
    getUserOverview()
  ]);

  const userOverviewIsUp = userOverview.trend === 'up';

  return (
    <div className='grid h-full gap-4'>
      {/* Total Revenue Card */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Revenue in one month</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {revenueOverview.totalRevenue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              {revenueOverview.trend == 'up' ? (
                <TrendingUp className='size-4' />
              ) : (
                <TrendingDown className='size-4' />
              )}
              {revenueOverview.percentChange}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-foreground line-clamp-1 flex gap-2 font-medium'>
            Trending {revenueOverview.trend} this month
            {revenueOverview.trend == 'up' ? (
              <TrendingUp className='size-4' />
            ) : (
              <TrendingDown className='size-4' />
            )}
          </div>
          <div className='text-muted-foreground'>
            Total revenue
            {revenueOverview.trend == 'up' ? 'increased' : 'decreased'}by{' '}
            {revenueOverview.percentChange}% compared to last month
          </div>
        </CardFooter>
      </Card>

      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Customers in 1 month</CardDescription>

          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {userOverview.totalUsers.toLocaleString()}
          </CardTitle>

          <CardAction>
            <Badge variant='outline'>
              {userOverviewIsUp ? (
                <TrendingUp className='size-4' />
              ) : (
                <TrendingDown className='size-4' />
              )}
              {userOverviewIsUp ? '+' : '-'}
              {Math.abs(userOverview.percentChange).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>

        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-foreground line-clamp-1 flex gap-2 font-medium'>
            {userOverviewIsUp
              ? 'Trending up this month'
              : 'Trending down this month'}
            {userOverviewIsUp ? (
              <TrendingUp className='size-4' />
            ) : (
              <TrendingDown className='size-4' />
            )}
          </div>

          <div className='text-muted-foreground'>
            {userOverviewIsUp
              ? 'Customer count increased compared to last month'
              : 'Customer count decreased compared to last month'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
