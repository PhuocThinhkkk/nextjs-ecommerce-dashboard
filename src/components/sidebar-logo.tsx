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
          className='hover:cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex justify-center'
        >
          <div className='text-primary flex aspect-square size-8 items-center justify-center rounded-lg'>
            <Squirrel className='size-8' />
          </div>
          <span className='text-sidebar-accent-foreground text-2xl font-bold'>
            PerDash
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
