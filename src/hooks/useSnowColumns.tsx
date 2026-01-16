/**
 * Hook for building table columns and handling actions
 */

import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';

import { ActionCell } from '../components/ActionCell';
import { FilterConfig } from '../core/SingleFilterDropdown';
import { getConfirm, getT } from '../registry';
import { ErrorResponse, SnowColumnConfig, TableAction } from '../types';
import { printValue } from '../utils';

// ============================================
// Hook Options
// ============================================

export interface UseSnowColumnsOptions<T extends Record<string, unknown>, K> {
  columnConfig: SnowColumnConfig<T>[];
  actions?: TableAction<T, K>[];
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

export interface UseSnowColumnsReturn<T extends Record<string, unknown>, K> {
  columns: ColumnDef<T, unknown>[];
  handleAction: (action: TableAction<T, K>, item: T) => Promise<void>;
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
 * - Handling action execution with confirmation dialogs and mutations
 */
export const useSnowColumns = <T extends Record<string, unknown>, K>({
  columnConfig,
  actions,
  filters,
  mode,
}: UseSnowColumnsOptions<T, K>): UseSnowColumnsReturn<T, K> => {
  const confirm = getConfirm();
  const t = getT();

  // ============================================
  // Action Mutation
  // ============================================
  const { mutate: mutateEndpoint } = useMutation<K, ErrorResponse, { item: T; endpoint: (item: T) => Promise<K> }>({
    mutationFn: async params => {
      return params.endpoint(params.item);
    },
  });

  // ============================================
  // Action Handler
  // ============================================
  const handleAction = async (a: TableAction<T, K>, item: T) => {
    const action = typeof a === 'function' ? a(item) : a;

    if (action.confirm) {
      const confirmed = await confirm({
        title: action.confirm.title,
        subtitle: action.confirm.subtitle,
        content: action.confirm.content,
      });

      if (!confirmed) return;
    }

    if (action.type === 'endpoint') {
      mutateEndpoint(
        {
          item: item,
          endpoint: action.endpoint,
        },
        {
          onError: (error, variables, context) => action.onError?.(error, variables.item, context),
          onSuccess: (data, variables, context) => action.onSuccess?.(data, variables.item, context),
        }
      );
    } else if (action.type === 'click') {
      action.onClick(item);
    } else if (action.type === 'link') {
      // Link actions are handled by ActionCell directly via <a> tag
      return;
    }
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
