/**
 * Styles Registry
 *
 * ONLY visual styles are customizable (colors, borders, shadows, rounded).
 * Structural styles (layout, sizing, positioning) are fixed in the components.
 */

export interface ButtonStyles {
  visual: string; // bg, border, text color, rounded, shadow
  hover: string; // hover state colors
  disabled: string; // disabled state opacity
  danger: string; // danger variant (overrides visual + hover)
  warning: string;
  info: string;
  success: string;
}

export interface StateStyles {
  active: string; // global active state style (ring, shadow, etc.)
  activeText: string; // text/icon color when active
  focus: string; // focus ring style (used by inputs, buttons, tabs)
}

export interface DropdownStyles {
  content: string; // bg, border, rounded, shadow
  item: string; // hover state, rounded
  checkboxItem: string; // checkbox item hover/focus state
  separator: string; // bg color
}

export interface SelectStyles {
  trigger: string; // bg, border, rounded
  content: string; // bg, border, rounded, shadow
  item: string; // hover state
  itemSelected: string; // selected state colors
}

export interface TabsStyles {
  list: string; // bg, rounded
  trigger: string; // rounded
  triggerActive: string; // active state colors, shadow
}

export interface DataTableStyles {
  root: string; // wrapper width (w-full, max-w-4xl, etc.)
  container: string; // table container: rounded, border
  header: string; // bg color
  headerCell: string; // text color
  row: string; // base row styles
  rowHover: string; // hover state
  rowAlternate: string; // alternating row bg
  rowActive: string; // active/selected row
  divider: string; // row dividers
  empty: string; // empty state text color
  loadingOverlay: string; // loading overlay bg
}

export interface SnowTableStyles {
  state: StateStyles;
  button: ButtonStyles;
  input: string;
  skeleton: string;
  dropdown: DropdownStyles;
  select: SelectStyles;
  tabs: TabsStyles;
  table: DataTableStyles;
}

const defaultStyles: SnowTableStyles = {
  state: {
    active: 'ring-2 ring-ring/30',
    activeText: 'text-foreground',
    focus: 'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
  },

  button: {
    visual: 'border border-input bg-background rounded-md shadow-xs',
    hover: 'hover:bg-accent hover:text-accent-foreground',
    disabled: 'opacity-50',
    danger: 'border-transparent bg-red-500 text-white shadow-xs hover:bg-red-600',
    warning: 'border-transparent bg-amber-500 text-white shadow-xs hover:bg-amber-600',
    info: 'border-transparent bg-blue-500 text-white shadow-xs hover:bg-blue-600',
    success: 'border-transparent bg-green-500 text-white shadow-xs hover:bg-green-600',
  },

  input:
    'rounded-md border border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',

  skeleton: 'rounded-md bg-muted animate-pulse',

  dropdown: {
    content: 'rounded-md border bg-popover text-popover-foreground shadow-md',
    item: 'rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
    checkboxItem:
      'rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
    separator: 'bg-muted',
  },

  select: {
    trigger: 'rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
    content: 'rounded-md border bg-popover text-popover-foreground shadow-md',
    item: 'hover:bg-accent hover:text-accent-foreground',
    itemSelected: 'bg-accent text-accent-foreground',
  },

  tabs: {
    list: 'rounded-lg bg-muted',
    trigger: 'rounded-md',
    triggerActive: 'data-[state=active]:bg-background data-[state=active]:text-foreground',
  },

  table: {
    root: 'w-full',
    container: 'rounded-lg border',
    header: 'bg-muted',
    headerCell: 'text-muted-foreground',
    row: '',
    rowHover: 'hover:bg-accent/60',
    rowAlternate: 'bg-muted/20',
    rowActive: 'bg-accent/20',
    divider: 'divide-y divide-border',
    empty: 'text-muted-foreground',
    loadingOverlay: 'bg-background/50',
  },
};

let styles: SnowTableStyles = JSON.parse(JSON.stringify(defaultStyles));

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? Partial<T[P]> : T[P];
};

const deepMerge = (target: SnowTableStyles, source: DeepPartial<SnowTableStyles>): SnowTableStyles => {
  const result = JSON.parse(JSON.stringify(target));
  for (const key in source) {
    const sourceValue = source[key as keyof typeof source];
    const targetValue = target[key as keyof typeof target];
    if (typeof sourceValue === 'object' && sourceValue !== null && typeof targetValue === 'object') {
      result[key] = { ...targetValue, ...sourceValue };
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue;
    }
  }
  return result;
};

export const registerStyles = (customStyles: DeepPartial<SnowTableStyles>) => {
  styles = deepMerge(styles, customStyles);
};

export const getStyles = (): SnowTableStyles => styles;

export const resetStylesRegistry = () => {
  styles = JSON.parse(JSON.stringify(defaultStyles));
};
