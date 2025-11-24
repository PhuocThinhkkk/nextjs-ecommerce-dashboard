'use client';
import PageContainer from '@/components/layout/page-container';
import { useUser } from '@clerk/nextjs';
import React from 'react';

export default function OverViewLayout({
  sales,
  overview_cards,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  overview_cards: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const { user } = useUser();
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back {user?.lastName} 👋
          </h2>
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <div className='col-span-1 lg:col-span-5'>{bar_stats}</div>
          <div className='col-span-1 lg:col-span-2'>
            {/* sales arallel routes */}
            {overview_cards}
          </div>
          <div className='col-span-1 lg:col-span-4'>{area_stats}</div>
          <div className='col-span-1 lg:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
