import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChartBarSkeleton() {
  return (
    <Card className='h-full animate-pulse'>
      {/* Header */}
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-48' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='mt-1 h-4 w-32' />
        </CardDescription>
      </CardHeader>

      {/* Chart placeholder for 6 bars */}
      <CardContent className='flex h-48 items-end justify-between gap-2'>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className='h-24 w-6 rounded-md' />
        ))}
      </CardContent>

      {/* Footer */}
      <CardFooter className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-4 rounded-full' /> {/* Trend icon */}
          <Skeleton className='h-4 w-24' />
        </div>
        <Skeleton className='h-4 w-40' />
      </CardFooter>
    </Card>
  );
}
