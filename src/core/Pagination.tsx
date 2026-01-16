/**
 * Pagination component
 */

import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from '../icons';

import { Button } from '../primitives/Button';
import { cn } from '../utils';

export const DEFAULT_PAGE_SIZES = [25, 50, 100];

export type PaginationProps<Data extends object> = {
  table: Table<Data>;
  isLoading?: boolean;
};

export function Pagination<Data extends object>({ table, isLoading }: PaginationProps<Data>) {
  return (
    <div className={cn('flex items-center justify-center px-2 py-4')}>
      <div className={cn('flex items-center gap-2')}>
        <Button
          className={cn('h-9 w-9 p-0')}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronsLeft className={cn('h-4 w-4')} />
        </Button>
        <Button
          className={cn('h-9 w-9 p-0')}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronLeft className={cn('h-4 w-4')} />
        </Button>
        <div className={cn('flex items-center gap-2 px-4')}>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-md border bg-background')}>
            {isLoading ? <Loader2 className={cn('h-4 w-4 animate-spin')} /> : table.getState().pagination.pageIndex + 1}
          </div>
          <span className={cn('text-sm text-muted-foreground')}>de {table.getPageCount()}</span>
        </div>
        <Button
          className={cn('h-9 w-9 p-0')}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <ChevronRight className={cn('h-4 w-4')} />
        </Button>
        <Button
          className={cn('h-9 w-9 p-0')}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <ChevronsRight className={cn('h-4 w-4')} />
        </Button>
      </div>
    </div>
  );
}
