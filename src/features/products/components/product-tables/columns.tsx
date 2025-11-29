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
import { CheckCircle2, Text, XCircle, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { CellAction } from './cell-action';
import { ProductWithCategory } from '@/services/product';

export const columns: Column<ProductWithCategory>[] = [
  {
    key: 'photo_url',
    header: 'IMAGE',
    render: (row) => (
      <div className='relative aspect-square'>
        <Image
          src={'https://picsum.photos/id/237/200/300'}
          alt={row.name}
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
    key: 'category',
    header: 'CATEGORY',
    render: (row) => {
      const Icon = row.category.name === 'active' ? CheckCircle2 : XCircle;
      return (
        <Badge variant='outline' className='capitalize'>
          <Icon />
          {row.category.name}
        </Badge>
      );
    }
  },
  {
    key: 'price',
    header: 'PRICE',
    render: (row) => {
      return (
        <Badge variant='outline' className='border-none capitalize'>
          {row.skus[0].price}
          <DollarSign />
        </Badge>
      );
    }
  },
  {
    key: 'description',
    header: 'DESCRIPTION',
    render: (row) => {
      return <div>{row.description} </div>;
    }
  },
  {
    key: 'actions',
    header: 'ACTIONS',
    render: (row) => <CellAction data={row} />
  }
];
