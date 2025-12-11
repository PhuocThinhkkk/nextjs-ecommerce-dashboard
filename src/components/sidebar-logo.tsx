'use client';

import { Squirrel } from 'lucide-react';
import * as React from 'react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex justify-center hover:cursor-pointer'
        >
          <div className='text-primary mr-1 flex aspect-square size-8 items-center justify-center rounded-lg'>
            <Squirrel className='size-8' />
          </div>
          <span className='text-sidebar-accent-foreground text-2xl font-bold group-data-[state=collapsed]:hidden'>
            PerDash
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
