/**
 * SnowTable types
 */

import { ColumnMeta } from '@tanstack/react-table';
import type { ComponentType, ReactNode, SVGProps } from 'react';

/**
 * Icon component type - compatible with IconComponent
 * Users can use lucide-react icons or any SVG component with this signature
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

import type { PreFilter } from './core/PrefilterTabs';
import type { FilterConfig } from './core/SingleFilterDropdown';

// ============================================
// Shared Types
// ============================================

export type ErrorResponse = {
  message: string;
  status: number;
};

export type SnowColumnConfig<T extends object> = {
  key: keyof T | '_extra' | '_extra_' | `_extra_${string}`;
  label?: string;
  hidden?: boolean;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  searchableValue?: (item: T) => string;
  meta?: ColumnMeta<T, unknown>;
};

// ============================================
// Action Types
// ============================================

/**
 * Button variants supported by actions
 */
export type ActionButtonVariant = 'default' | 'warning' | 'danger' | 'info' | 'success';

export type BaseAction = {
  icon: IconComponent;
  label: string;
  variant?: ActionButtonVariant;
  display?: 'button' | 'dropdown';
  hidden?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
};

export type ClickAction<T> = BaseAction & {
  type: 'click';
  onClick: (item: T) => void;
};

export type LinkAction<T> = BaseAction & {
  type: 'link';
  href: (item: T) => string;
  external?: boolean; // true = target="_blank" + rel="noopener noreferrer"
};

export type TableAction<T> = ClickAction<T> | LinkAction<T> | ((item: T) => ClickAction<T>) | ((item: T) => LinkAction<T>);

// ============================================
// UI Options (passed through to DataTable)
// ============================================

/**
 * UI options that can be passed through to the underlying DataTable
 */
export interface DataTableUIOptions<T extends object> {
  onRowClick?: (data: T) => void;
  activeRowId?: string | number;
  displayTotalNumber?: boolean;
  enableElementLabel?: boolean;
  enableGlobalSearch?: boolean;
  enableSorting?: boolean;
  enableColumnConfiguration?: boolean;
  enablePagination?: boolean;
  paginationSizes?: number[];
  texts?: {
    searchPlaceholder?: string;
    emptyTitle?: string;
  };
}

// ============================================
// Base Props (shared between Client and Server)
// ============================================

/**
 * Base props shared between SnowClientDataTable and SnowServerDataTable
 */
export interface BaseSnowTableProps<T extends Record<string, unknown>> extends DataTableUIOptions<T> {
  queryKey: string[];
  columnConfig: SnowColumnConfig<T>[];
  actions?: TableAction<T>[];
  filters?: FilterConfig<T>[];
  prefilters?: PreFilter[];
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
  defaultPageSize?: number;
  /**
   * Persist table state (prefilter, pagination, search, filters, sorting) in URL query params.
   */
  persistState?: boolean;
}

// ============================================
// SnowClientDataTable Props (Client Mode)
// ============================================

/**
 * Props for SnowClientDataTable component (client-side filtering/sorting)
 */
export interface SnowClientDataTableProps<T extends Record<string, unknown>> extends BaseSnowTableProps<T> {
  fetchAllItemsEndpoint: () => Promise<T[]>;
  /** Optional function to filter items based on active prefilter */
  prefilterFn?: (item: T, prefilterId: string) => boolean;
}

// ============================================
// SnowServerDataTable Props (Server Mode)
// ============================================

/**
 * Response structure for server-side paginated endpoints
 */
export interface ServerPaginatedResponse<T> {
  items: T[];
  totalItemCount: number;
}

/**
 * Parameters sent to the server for pagination, search, and filtering
 */
export interface ServerFetchParams {
  limit: number;
  offset: number;
  search?: string;
  prefilter?: string;
  filters?: Record<string, string[]>;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Props for SnowServerDataTable component (server-side pagination/filtering/sorting)
 */
export interface SnowServerDataTableProps<T extends Record<string, unknown>> extends BaseSnowTableProps<T> {
  fetchServerEndpoint: (params: ServerFetchParams) => Promise<ServerPaginatedResponse<T>>;
  filters?: FilterConfig<Record<string, unknown>>[];
}
