import type * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { type Column } from '@/features/products/components/product-tables/columns';
import { PageTableFilterData, PageTableOnEvent } from '@/types/data-table';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> {
  pageData: PageTableFilterData;
  data: TData[];
  columns: Column<TData>[];
  pageEvent: PageTableOnEvent;
  children?: React.ReactNode;
}

export function DataTable<TData>({
  pageData,
  data,
  columns,
  pageEvent,
  children
}: DataTableProps<TData>) {
  return (
    <div className='flex min-h-150 flex-1 flex-col space-y-4'>
      {children}
      <div className='relative flex flex-1'>
        <div className='absolute inset-0 flex overflow-hidden rounded-lg border'>
          <ScrollArea className='h-full w-full'>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={String(col.key)}>{col.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length ? (
                  data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((col) => (
                        <TableCell key={String(col.key)}>
                          {col.render && col.render(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
      <div className='flex flex-col gap-2.5'>
        {/* If you have pagination, you need to implement it manually */}
        {data.length > 0 && (
          <DataTablePagination pageData={pageData} pageEvent={pageEvent} />
        )}
      </div>
    </div>
  );
}
