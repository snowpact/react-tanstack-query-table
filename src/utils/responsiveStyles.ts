/**
 * Responsive styles for mobile card layout.
 *
 * Applied only on mobile screens (< 640px), table layout on sm+ screens.
 * This object is readonly and cannot be modified at runtime.
 *
 * @example
 * ```tsx
 * import { RESPONSIVE_STYLES } from '../utils/responsiveStyles';
 *
 * <div className={cn(enableResponsive && RESPONSIVE_STYLES.container.base)}>
 *   ...
 * </div>
 * ```
 */
export const RESPONSIVE_STYLES = {
  /** Container wrapper styles */
  container: {
    base: 'border-none sm:border-solid overflow-visible',
  },
  /** Table header styles - hidden on mobile */
  thead: {
    base: 'hidden sm:table-header-group',
  },
  /** Table body styles - flex column on mobile */
  tbody: {
    base: 'flex flex-col gap-4 sm:table-row-group sm:divide-y',
  },
  /** Individual row styles - card layout on mobile */
  row: {
    base: 'flex flex-col gap-1 border rounded-lg p-4 bg-card sm:table-row sm:border-0 sm:rounded-none sm:p-0 sm:bg-transparent',
  },
  /** Cell styles - stacked on mobile */
  cell: {
    base: 'flex flex-col py-2 border-b border-border sm:table-cell sm:border-b-0 sm:px-4 sm:py-3',
    last: 'border-b-0',
  },
  /** Cell label - header shown in mobile card, hidden on desktop */
  cellLabel: {
    base: 'text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 sm:hidden',
  },
  /** Cell content wrapper */
  cellContent: {
    base: 'w-full',
  },
} as const;

/** Type for RESPONSIVE_STYLES keys */
export type ResponsiveStyleKey = keyof typeof RESPONSIVE_STYLES;
