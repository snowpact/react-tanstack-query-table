/**
 * Hook for building table columns and handling actions
 */

import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { ActionCell } from '../components/ActionCell';
import { FilterConfig } from '../core/SingleFilterDropdown';
import { getT } from '../registry';
import { SnowColumnConfig, TableAction } from '../types';
import { printValue } from '../utils';

// ============================================
// Hook Options
// ============================================

export interface UseSnowColumnsOptions<T extends Record<string, unknown>> {
  columnConfig: SnowColumnConfig<T>[];
  actions?: TableAction<T>[];
  filters?: FilterConfig<T>[];
  /**
   * Mode determines how global filter behaves:
   * - 'client': enableGlobalFilter based on searchableValue
   * - 'server': enableGlobalFilter always false (server handles search)
   */
  mode: 'client' | 'server';
}

// ============================================
// Hook Return Type
// ============================================

export interface UseSnowColumnsReturn<T extends Record<string, unknown>> {
  columns: ColumnDef<T, unknown>[];
  handleAction: (action: TableAction<T>, item: T) => void;
}

// ============================================
// Hook Implementation
// ============================================

/**
 * Shared hook for building columns and handling actions in SnowClientDataTable and SnowServerDataTable.
 *
 * Extracts the common logic for:
 * - Transforming SnowColumnConfig into TanStack Table ColumnDef
 * - Adding action column with ActionCell
 * - Handling action execution (click actions)
 */
export const useSnowColumns = <T extends Record<string, unknown>>({
  columnConfig,
  actions,
  filters,
  mode,
}: UseSnowColumnsOptions<T>): UseSnowColumnsReturn<T> => {
  const t = getT();

  // ============================================
  // Action Handler
  // ============================================
  const handleAction = (a: TableAction<T>, item: T) => {
    const action = typeof a === 'function' ? a(item) : a;

    if (action.type === 'click') {
      action.onClick(item);
    }
    // Link actions are handled by ActionCell directly via <a> tag
  };

  // ============================================
  // Columns
  // ============================================
  const columns = useMemo<ColumnDef<T, unknown>[]>(() => {
    const cols = columnConfig
      .filter(column => !column.hidden)
      .map(column => {
        const hasFilter = filters?.some(f => f.key === column.key);

        return {
          accessorKey: column.key as string,
          accessorFn: column.searchableValue ? (row: T) => column.searchableValue!(row) : undefined,
          header: column.label ?? t(`data.${column.key as string}`),
          enableSorting: column.sortable ?? true,
          enableColumnFilter: hasFilter,
          // Client mode: enable global filter by default (use searchableValue if defined, otherwise use accessor)
          // Server mode: always false (server handles search)
          enableGlobalFilter: mode === 'client',
          filterFn: hasFilter ? 'multiSelect' : undefined,
          meta: column.meta,
          cell: ({ row }: { row: { original: T } }) => {
            const value = row.original[column.key];
            return column.render ? column.render(row.original) : printValue(value);
          },
        };
      }) as ColumnDef<T, unknown>[];

    if (actions?.length) {
      cols.push({
        accessorKey: 'actions',
        header: '',
        meta: {
          width: 'auto',
        },
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }: { row: { original: T } }) => (
          <ActionCell item={row.original} actions={actions} onAction={handleAction} />
        ),
      });
    }

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnConfig, actions, filters, mode, t]);

  return {
    columns,
    handleAction,
  };
};
