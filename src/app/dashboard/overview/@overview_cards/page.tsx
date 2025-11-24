'use client';

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

export default function DashboardOverview() {
  return (
    <div className='grid h-full gap-4'>
      {/* Total Revenue Card */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            $12,580.50
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUp className='size-4' />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-foreground line-clamp-1 flex gap-2 font-medium'>
            Trending up this month
            <TrendingUp className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Total revenue increased by 12.5% compared to last month
          </div>
        </CardFooter>
      </Card>

      {/* Total Customers Card */}
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Customers</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            2,847
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingDown className='size-4' />
              -2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='text-foreground line-clamp-1 flex gap-2 font-medium'>
            Trending down this month
            <TrendingDown className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Customer count decreased slightly from previous month
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
