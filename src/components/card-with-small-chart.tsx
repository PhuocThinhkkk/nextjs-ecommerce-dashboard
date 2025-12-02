'use client';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MetricResponse } from '@/types/response';
interface MetricProps {
  data: MetricResponse;
}

export function MetricCard({ data }: MetricProps) {
  const {
    title,
    value,
    change,
    changeType = 'up',
    peakDay,
    sparklineData
  } = data;
  // Normalize data to 0-100 range for visual display
  const maxValue = Math.max(...sparklineData);
  const normalizedData = sparklineData.map((v) => (v / maxValue) * 100);

  return (
    <div className='bg-card border-border w-full rounded-lg border p-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-foreground text-sm font-medium'>{title}</h3>
      </div>

      <div className='flex items-end justify-between'>
        <div>
          <div className='text-foreground mb-2 text-4xl font-bold'>{value}</div>
          {peakDay && (
            <div className='bg-secondary text-secondary-foreground inline-block rounded px-2 py-1 text-xs font-medium'>
              Peak: {peakDay}
            </div>
          )}
        </div>

        <div className='flex flex-col items-end gap-2'>
          <div className='flex items-end gap-1'>
            {normalizedData.map((height, index) => (
              <div
                key={index}
                className='rounded-sm bg-green-400'
                style={{
                  width: '6px',
                  height: `${Math.max(height * 0.6, 4)}px`
                }}
              />
            ))}
          </div>

          <div className='text-right'>
            <div className='text-muted-foreground mb-1 text-xs'>
              vs last period
            </div>
            <div
              className={`text-sm font-semibold ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}
            >
              {changeType === 'up' ? '+' : '-'}
              {change}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
