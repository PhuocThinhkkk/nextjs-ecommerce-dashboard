'use client';

import {
  Card,
  CardHeader,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardOverviewSkeleton() {
  return (
    <div className='grid h-full gap-4'>
      {/* Total Revenue Skeleton */}
      <Card className='@container/card'>
        <CardHeader className='space-y-2'>
          <Skeleton className='h-4 w-32' /> {/* Description */}
          <Skeleton className='h-8 w-40 @[250px]/card:h-9' /> {/* Title */}
          <Skeleton className='h-6 w-20 rounded-full' /> {/* Badge */}
        </CardHeader>

        <CardFooter className='flex-col items-start gap-2'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='h-4 w-72' />
        </CardFooter>
      </Card>

      {/* Total Customers Skeleton */}
      <Card className='@container/card'>
        <CardHeader className='space-y-2'>
          <Skeleton className='h-4 w-36' /> {/* Description */}
          <Skeleton className='h-8 w-32 @[250px]/card:h-9' /> {/* Title */}
          <Skeleton className='h-6 w-20 rounded-full' /> {/* Badge */}
        </CardHeader>

        <CardFooter className='flex-col items-start gap-2'>
          <Skeleton className='h-4 w-52' />
          <Skeleton className='h-4 w-80' />
        </CardFooter>
      </Card>
    </div>
  );
}
