/**
 * Core DataTable component with registry-based dependencies
 *
 * STRUCTURE (fixed): flex layout, overflow, padding, transitions
 * VISUAL (customizable via registry): bg colors, borders, text colors, hover states
 */

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FunnelX } from '../icons';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '../primitives/Button';
import { Skeleton } from '../primitives/Skeleton';
import { getStyles, useTranslation } from '../registry';
import { cn, fuzzyFilter, RESPONSIVE_STYLES } from '../utils';

import { ColumnConfiguration } from './ColumnConfiguration';
import { PageSizeSelector } from './PageSizeSelector';
import { DEFAULT_PAGE_SIZES, Pagination } from './Pagination';
import { PreFilter, PrefilterTabs } from './PrefilterTabs';
import { SearchBar } from './SearchBar';
import type { FilterConfig } from './SingleFilterDropdown';
import { SingleFilterDropdown } from './SingleFilterDropdown';
import { SortButton } from './SortButton';

export type DataTableProps<T extends object> = {
  // === DATA ===
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  isFetching?: boolean;

  // === MODE ===
  mode?: 'client' | 'server'; // Explicit mode (default: 'client')

  // === PAGINATION (controlled or uncontrolled) ===
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  totalCount?: number; // Total number of items (required when mode='server')

  // === SEARCH (controlled or uncontrolled) ===
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  enableGlobalSearch?: boolean;

  // === COLUMN FILTERS (controlled or uncontrolled) ===
  filters?: FilterConfig<T>[];
  columnFilters?: Record<string, string[]>;
  onColumnFiltersChange?: (filters: Record<string, string[]>) => void;

  // === PREFILTERS (controlled) ===
  prefilters?: PreFilter[];
  activePrefilter?: string;
  onPrefilterChange?: (key: string) => void;

  // === SORTING (controlled or uncontrolled) ===
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  enableSorting?: boolean;

  // === COLUMN VISIBILITY (controlled or uncontrolled) ===
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
  enableColumnConfiguration?: boolean;

  // === UI OPTIONS ===
  onRowClick?: (data: T) => void;
  activeRowId?: string | number;
  displayTotalNumber?: boolean;
  enableElementLabel?: boolean;
  enablePagination?: boolean;
  paginationSizes?: number[];
  enableResponsive?: boolean;
  texts?: {
    searchPlaceholder?: string;
    emptyTitle?: string;
  };

  // === RESET ===
  onResetFilters?: () => void;
};

export function DataTable<Data extends object>({
  // Data
  data,
  columns,
  isLoading,
  isFetching,
  // Mode
  mode = 'client',
  // Pagination (external props with internal fallback)
  pagination: externalPagination,
  onPaginationChange: externalOnPaginationChange,
  totalCount: externalTotalCount,
  // Search (external props with internal fallback)
  globalFilter: externalGlobalFilter,
  onGlobalFilterChange: externalOnGlobalFilterChange,
  enableGlobalSearch = false,
  // Column filters (external props with internal fallback)
  filters,
  columnFilters: externalColumnFilters,
  onColumnFiltersChange: externalOnColumnFiltersChange,
  // Prefilters
  prefilters,
  activePrefilter,
  onPrefilterChange,
  // Sorting (external props with internal fallback)
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  enableSorting = true,
  // Column visibility (external props with internal fallback)
  columnVisibility: externalColumnVisibility,
  onColumnVisibilityChange: externalOnColumnVisibilityChange,
  enableColumnConfiguration = false,
  // UI options
  onRowClick,
  activeRowId,
  displayTotalNumber = true,
  enableElementLabel = true,
  enablePagination = true,
  paginationSizes,
  enableResponsive = true,
  texts,
  // Reset
  onResetFilters,
}: DataTableProps<Data>) {
  const { t } = useTranslation();
  const styles = getStyles();

  // Internal state (used if external props not provided)
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZES[0],
  });
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('');
  const [internalColumnFilters, setInternalColumnFilters] = useState<Record<string, string[]>>({});
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({});

  // Effective values (external prop OR internal state)
  const pagination = externalPagination ?? internalPagination;
  const onPaginationChange = externalOnPaginationChange ?? setInternalPagination;
  const globalFilter = externalGlobalFilter ?? internalGlobalFilter;
  const onGlobalFilterChange = externalOnGlobalFilterChange ?? setInternalGlobalFilter;
  const columnFilters = externalColumnFilters ?? internalColumnFilters;
  const onColumnFiltersChange = externalOnColumnFiltersChange ?? setInternalColumnFilters;
  const sorting = externalSorting ?? internalSorting;
  const onSortingChange = externalOnSortingChange ?? setInternalSorting;
  const columnVisibility = externalColumnVisibility ?? internalColumnVisibility;
  const onColumnVisibilityChange = externalOnColumnVisibilityChange ?? setInternalColumnVisibility;

  // Wrapper to reset pagination when globalFilter changes
  const handleGlobalFilterChangeWithReset = useCallback(
    (value: string) => {
      onGlobalFilterChange(value);
      onPaginationChange(prev => ({ ...prev, pageIndex: 0 }));
    },
    [onGlobalFilterChange, onPaginationChange]
  );

  // Track previous values to detect actual changes (not just reference changes)
  const columnFiltersJson = useMemo(() => JSON.stringify(columnFilters), [columnFilters]);

  // Reset pagination when prefilter or columnFilters change
  useEffect(() => {
    onPaginationChange(prev => {
      if (prev.pageIndex === 0) return prev; // Skip if already at 0
      return { ...prev, pageIndex: 0 };
    });
  }, [activePrefilter, columnFiltersJson, onPaginationChange]);

  // Server-side mode: when mode='server', DataTable delegates pagination/filtering/sorting to server
  // When 'client' (default), DataTable handles filtering/sorting internally using data array
  const serverSideMode = mode === 'server';

  // Calculate pageCount from totalCount (only for server mode)
  const pageCount = externalTotalCount !== undefined ? Math.ceil(externalTotalCount / pagination.pageSize) : undefined;

  // Pagination is possible in client mode, or in server mode only if totalCount is provided
  const isPaginationPossible = !serverSideMode || externalTotalCount !== undefined;

  // Convert Record<string, string[]> to ColumnFiltersState for TanStack Table
  const tanstackColumnFilters = useMemo<ColumnFiltersState>(() => {
    return Object.entries(columnFilters).map(([id, value]) => ({ id, value }));
  }, [columnFilters]);

  // Custom filter function for multi-select filters
  const multiSelectFilter = useCallback((row: Row<Data>, columnId: string, filterValue: string[]) => {
    const cellValue = row.getValue(columnId);
    return filterValue.includes(String(cellValue));
  }, []);

  const table = useReactTable({
    data,
    columns,
    pageCount: serverSideMode ? pageCount : undefined,
    state: {
      pagination,
      sorting: enableSorting ? sorting : undefined,
      globalFilter: !serverSideMode && enableGlobalSearch ? globalFilter : undefined,
      columnFilters: !serverSideMode && filters?.length ? tanstackColumnFilters : undefined,
      columnVisibility: enableColumnConfiguration ? columnVisibility : undefined,
    },
    onPaginationChange,
    onSortingChange: enableSorting ? onSortingChange : undefined,
    onColumnVisibilityChange: enableColumnConfiguration ? onColumnVisibilityChange : undefined,
    // Manual modes (when pageCount is provided)
    manualPagination: serverSideMode,
    manualFiltering: serverSideMode,
    manualSorting: serverSideMode,
    // Row models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    // Client-side filtering (only when not in manual mode)
    ...(!serverSideMode && (filters?.length || enableGlobalSearch)
      ? {
          getFilteredRowModel: getFilteredRowModel(),
          filterFns: {
            multiSelect: multiSelectFilter,
          },
          globalFilterFn: enableGlobalSearch ? fuzzyFilter : undefined,
        }
      : {}),
  });

  const handleFilterChange = (key: keyof Data, selectedValues: string[]) => {
    const columnId = String(key);
    const newFilters = { ...columnFilters };

    if (selectedValues.length === 0) {
      delete newFilters[columnId];
    } else {
      newFilters[columnId] = selectedValues;
    }

    onColumnFiltersChange(newFilters);
  };

  const displayAdvancedBar =
    enableGlobalSearch || displayTotalNumber || (filters && filters.length > 0) || enableColumnConfiguration;

  // For client-side, get count from current page rows; for manual mode, just use data length
  const itemCount = useMemo(() => {
    if (serverSideMode) {
      return data.length;
    }
    return table.getRowModel().rows.length;
  }, [serverSideMode, data.length, table]);

  // Total count: for server mode use externalTotalCount directly, for client-side use filtered data length
  const totalCount = useMemo(() => {
    if (serverSideMode && externalTotalCount !== undefined) {
      return externalTotalCount;
    }
    return table.getFilteredRowModel().rows.length;
  }, [serverSideMode, externalTotalCount, table]);

  return (
    <div className={cn('snow-table-container relative flex flex-col flex-1 text-foreground', styles.table.root)} data-testid="datatable">
      {/* Loading overlay during fetching (server-side) */}
      {isFetching && !isLoading && (
        <div className={cn('absolute inset-0 z-10 pointer-events-none', styles.table.loadingOverlay)} />
      )}

      {displayAdvancedBar && (
        <div className="snow-table-top-bar grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] py-4 gap-4 items-center">
          {/* Prefilter tabs */}
          <div className="snow-table-prefilters flex items-center gap-2">
            {prefilters && prefilters.length > 0 && onPrefilterChange && (
              <PrefilterTabs
                prefilters={prefilters}
                activePrefilter={activePrefilter ?? prefilters[0]?.id ?? ''}
                onPrefilterChange={onPrefilterChange}
              />
            )}
          </div>

          {/* Search bar */}
          <div className="snow-table-search flex justify-center">
            {enableGlobalSearch && (
              <div className="w-full max-w-sm">
                <SearchBar
                  value={globalFilter}
                  onDebouncedChange={handleGlobalFilterChangeWithReset}
                  placeholder={texts?.searchPlaceholder || t('dataTable.search')}
                />
              </div>
            )}
          </div>

          {/* Filters and actions */}
          <div className="snow-table-filters grid grid-cols-1 sm:flex sm:flex-row gap-2 items-center">
            {filters?.map(filter => (
              <SingleFilterDropdown
                key={String(filter.key)}
                filter={filter}
                selectedValues={columnFilters[String(filter.key)]}
                onFilterChange={handleFilterChange}
              />
            ))}
            <div className="snow-table-actions flex items-center gap-2 justify-end lg:justify-start">
              {enableColumnConfiguration && <ColumnConfiguration table={table} />}
              {(enableGlobalSearch || (prefilters && prefilters.length > 0) || (filters && filters.length > 0)) && onResetFilters && (
                <Button
                  onClick={onResetFilters}
                  title={t('dataTable.resetFilters')}
                  data-testid="datatable-reset-filters"
                >
                  <FunnelX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          'sm:overflow-x-auto',
          styles.table.container,
          enableResponsive && RESPONSIVE_STYLES.container.base
        )}
      >
        <table className={cn('w-full text-sm')} data-testid="datatable-table">
          <thead className={cn(styles.table.header, enableResponsive && RESPONSIVE_STYLES.thead.base)}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={cn(
                      'px-4 py-3 text-left align-middle',
                      styles.table.headerCell,
                      enableSorting && 'cursor-pointer'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      width: header.column.columnDef?.meta?.width,
                      minWidth: header.column.columnDef?.meta?.minWidth,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <span className="flex gap-2 items-center justify-between w-full">
                        <h3>{flexRender(header.column.columnDef.header, header.getContext())}</h3>
                        {enableSorting && <SortButton column={header.column} />}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {isLoading ? (
            <tbody className={styles.table.divider} data-testid="datatable-loading">
              {Array.from({ length: pagination.pageSize > 10 ? 10 : pagination.pageSize }).map((_, index) => (
                <tr key={index} className={cn({ [styles.table.rowAlternate]: index % 2 === 1 })}>
                  {columns.map((_column, colIndex) => (
                    <td key={`skeleton-table-${colIndex}`} className="px-4 py-3 align-middle">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : itemCount > 0 ? (
            <tbody
              className={cn(styles.table.divider, enableResponsive && RESPONSIVE_STYLES.tbody.base)}
              data-testid="datatable-body"
            >
              {table.getRowModel().rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  data-testid={`datatable-row-${row.id}`}
                  className={cn(
                    styles.table.row,
                    styles.table.rowHover,
                    'transition-all ease-in-out duration-300',
                    {
                      [styles.table.rowAlternate]: rowIndex % 2 === 1,
                      [styles.table.rowActive]:
                        activeRowId !== undefined && 'id' in row.original && activeRowId === row.original.id,
                    },
                    enableResponsive && RESPONSIVE_STYLES.row.base
                  )}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    const headerLabel =
                      typeof cell.column.columnDef.header === 'string' ? cell.column.columnDef.header : cell.column.id;
                    const isLastCell = cellIndex === row.getVisibleCells().length - 1;

                    return (
                      <td
                        key={cell.id}
                        onClick={() =>
                          onRowClick && !cell.column.columnDef?.meta?.disableColumnClick && onRowClick(row.original)
                        }
                        className={cn(
                          onRowClick && !cell.column.columnDef?.meta?.disableColumnClick && 'cursor-pointer',
                          cell.column.columnDef?.meta?.center && 'align-middle text-center',
                          enableResponsive
                            ? cn(RESPONSIVE_STYLES.cell.base, isLastCell && RESPONSIVE_STYLES.cell.last)
                            : 'px-4 py-3'
                        )}
                      >
                        {enableResponsive && <span className={RESPONSIVE_STYLES.cellLabel.base}>{headerLabel}</span>}
                        <span className={cn(enableResponsive && RESPONSIVE_STYLES.cellContent.base)}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ) : (
            <caption
              className={cn('h-24 flex items-center justify-center w-full pl-10', styles.table.empty)}
              data-testid="datatable-empty"
            >
              {texts?.emptyTitle || t('dataTable.searchEmpty')}
            </caption>
          )}
        </table>
      </div>

      {/* Bottom bar */}
      <div className="snow-table-bottom-bar grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 py-4 items-center">
        {/* Item count */}
        {displayTotalNumber && (
          <div className={cn('snow-table-count text-sm order-3 lg:order-1 text-center lg:text-left', styles.table.empty)} data-testid="datatable-count">
            {totalCount} {t('dataTable.elements')}
          </div>
        )}

        {/* Pagination */}
        <div className="snow-table-pagination flex justify-center order-1 lg:order-2">
          {enablePagination && isPaginationPossible && <Pagination table={table} isLoading={isFetching} />}
        </div>

        {/* Page size selector */}
        {enablePagination && (
          <div className="snow-table-pagesize order-2 lg:order-3 flex justify-center lg:justify-end">
            <PageSizeSelector table={table} enableElementLabel={enableElementLabel} paginationSizes={paginationSizes} />
          </div>
        )}
      </div>
    </div>
  );
}
