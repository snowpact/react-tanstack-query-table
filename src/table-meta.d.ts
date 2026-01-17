/**
 * TanStack Table ColumnMeta augmentation
 * Adds custom properties used by SnowTable
 */
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends unknown, TValue> {
    /** Column width (CSS value) */
    width?: string | number;
    /** Column minimum width (CSS value) */
    minWidth?: string | number;
    /** Column maximum width (CSS value) */
    maxWidth?: string | number;
    /** Whether the column is hidden by default in column configuration */
    defaultHidden?: boolean;
    /** Disable row click handler for this column (e.g., for action columns) */
    disableColumnClick?: boolean;
    /** Center the content of this column */
    center?: boolean;
  }
}
