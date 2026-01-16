/**
 * Pagination component
 */

import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from '../icons';

import { Button } from '../primitives/Button';

export const DEFAULT_PAGE_SIZES = [25, 50, 100];

export type PaginationProps<Data extends object> = {
  table: Table<Data>;
  isLoading?: boolean;
};

export function Pagination<Data extends object>({ table, isLoading }: PaginationProps<Data>) {
  return (
    <div className="snow-pagination">
      <div className="snow-pagination-controls">
        <Button
          className="snow-btn-icon-lg"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronsLeft />
        </Button>
        <Button
          className="snow-btn-icon-lg"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          <ChevronLeft />
        </Button>
        <div className="snow-pagination-display">
          <div className="snow-pagination-current">
            {isLoading ? <Loader2 className="snow-size-4 snow-animate-spin" /> : table.getState().pagination.pageIndex + 1}
          </div>
          <span className="snow-pagination-total">de {table.getPageCount()}</span>
        </div>
        <Button
          className="snow-btn-icon-lg"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <ChevronRight />
        </Button>
        <Button
          className="snow-btn-icon-lg"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage() || isLoading}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
