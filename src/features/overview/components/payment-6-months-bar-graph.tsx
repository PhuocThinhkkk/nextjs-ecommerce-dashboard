'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { LabelType } from '@/services/overview/payments';

interface ChartBarProps {
  chartData: LabelType[];
  startMonth: string;
  endMonth: string;
  trendPercent: number;
  trendDirection: 'up' | 'down' | 'neutral';
}

const chartConfig = {
  total: {
    label: 'Total',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export default function ChartBarDefault({
  chartData,
  startMonth,
  endMonth,
  trendPercent,
  trendDirection
}: ChartBarProps) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Payment each month in the last 6 months</CardTitle>
        <CardDescription>
          {startMonth} - {endMonth}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='total' fill='var(--primary)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium'>
          {trendDirection === 'up' && (
            <TrendingUp className='h-4 w-4 text-green-500' />
          )}
          {trendDirection === 'down' && (
            <TrendingDown className='h-4 w-4 text-red-500' />
          )}
          {trendDirection === 'neutral' && <span>—</span>}
          {trendPercent}%{' '}
          {trendDirection === 'up'
            ? 'increase'
            : trendDirection === 'down'
              ? 'decrease'
              : 'no change'}{' '}
          compared to previous period
        </div>
        <div className='text-muted-foreground'>
          Showing total revenue for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
