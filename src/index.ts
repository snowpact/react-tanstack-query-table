/**
 * @snowpact/react-tanstack-table-react
 * Ultra-light, registry-based data table for React + TanStack Table
 *
 * Setup:
 * ```
 * import { setupSnowTable } from '@snowpact/react-tanstack-table-react';
 *
 * setupSnowTable({
 *   useTranslation: () => useTranslation(),
 *   LinkComponent: Link,
 *   useConfirm: () => useConfirm(),
 *   onActionHover: ({ label, element }) => { ... },
 *   onActionUnhover: () => { ... },
 * });
 * ```
 */

// Main components
export { SnowClientTable } from './SnowClientTable';
export { SnowServerTable } from './SnowServerTable';

// Core DataTable (for advanced usage)
export { DataTable, DEFAULT_PAGE_SIZES } from './core';
export type { DataTableProps } from './core';

// Core sub-components (for advanced usage)
export {
  ColumnConfiguration,
  PageSizeSelector,
  Pagination,
  PrefilterTabs,
  SearchBar,
  SingleFilterDropdown,
  SortButton,
} from './core';
export type {
  ColumnConfigurationProps,
  PageSizeSelectorProps,
  PaginationProps,
  PreFilter,
  PrefilterTabsProps,
  SearchBarProps,
  FilterOption,
  FilterConfig,
  SingleFilterDropdownProps,
  SortButtonProps,
} from './core';

// Types
export type {
  IconComponent,
  SnowColumnConfig,
  SnowClientTableProps,
  SnowServerTableProps,
  ServerPaginatedResponse,
  ServerFetchParams,
  TableAction,
  ClickAction,
  EndpointAction,
  LinkAction,
  BaseAction,
  ActionButtonVariant,
  ActionConfirmContent,
  ErrorResponse,
  DataTableUIOptions,
  BaseSnowTableProps,
} from './types';

// Hooks
export { useSnowColumns, useTableStatePersist } from './hooks';
export type { UseSnowColumnsOptions, UseSnowColumnsReturn } from './hooks';

// Utils
export { redirectToPageWithParam } from './utils';

// Registry (for setup)
export { setupSnowTable, isSnowTableSetup } from './registry';
export type { SetupSnowTableOptions, ConfirmContent, ConfirmCloseHelper, ActionHoverInfo } from './registry';

// Internal (for customization)
export { ActionCell } from './components';
