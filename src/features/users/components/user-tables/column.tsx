'use client';

export interface Column<T> {
  key: keyof T | string; // property name or special id (like 'actions')
  header: React.ReactNode; // header text or component
  render?: (row: T) => React.ReactNode; // optional custom cell render
  filter?: FilterLable;
}

interface FilterLable {
  type: string;
  label: string;
  placeholder: string;
}

import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Text,
  XCircle,
  DollarSign,
  Crown,
  User
} from 'lucide-react';
import Image from 'next/image';
import { CellAction } from '@/features/products/components/product-tables/cell-action';
import { UserWithPaymentAndRole } from '@/services/user';
import { formatVietnamTime } from '@/lib/format';

export const columns: Column<UserWithPaymentAndRole>[] = [
  {
    key: 'photo_url',
    header: 'AVATAR',
    render: (row) => (
      <div className='relative aspect-square'>
        <Image
          src={
            row.avatar_url || 'https://robohash.org/mail@ashallendesign.co.uk'
          }
          alt={row.name || 'No Name'}
          fill
          className='rounded-lg'
        />
      </div>
    )
  },
  {
    key: 'name',
    header: 'NAME',
    render: (row) => <div>{row.name}</div>,
    filter: { type: 'text', label: 'name ', placeholder: 'Search by name' }
  },
  {
    key: 'role',
    header: 'ROLE',
    render: (row) => {
      const Icon = row.role == 'ADMIN' ? <Crown /> : <User />;
      return (
        <Badge variant='outline' className='capitalize'>
          {Icon}
          {row.role}
        </Badge>
      );
    }
  },
  {
    key: 'paid',
    header: 'PAID',
    render: (row) => {
      const amount =
        row.payments?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;

      return (
        <Badge variant='outline' className='border-none capitalize'>
          {amount.toFixed(2)}
          <DollarSign />
        </Badge>
      );
    }
  },
  {
    key: 'email',
    header: 'EMAIL',
    render: (row) => {
      return <div>{row.email}</div>;
    }
  },
  {
    key: 'created_at',
    header: 'CREATED AT',
    render: (row) => {
      return <div>{formatVietnamTime(row.created_at)} </div>;
    }
  },
  {
    key: 'actions',
    header: 'ACTIONS',
    render: (row) => <CellAction data={row} />
  }
];
