# SnowTable Setup Examples

This guide shows how to configure SnowTable with your UI library.

## Table of Contents

- [SnowTable Setup Examples](#snowtable-setup-examples)
  - [Table of Contents](#table-of-contents)
  - [Shadcn/UI Setup](#shadcnui-setup)
  - [App.tsx Integration](#apptsx-integration)
  - [Custom Styles](#custom-styles)
  - [Translation Files](#translation-files)

---

## Shadcn/UI Setup

Create a setup file (e.g., `src/lib/snow-table-setup.ts`) that configures SnowTable:

```tsx
import i18n from '@/i18n';
import { Link } from 'react-router-dom';

import { setupSnowTable } from '@snowpact/react-tanstack-query-table';

// =============================================================================
// Setup Function
// =============================================================================

let isSetup = false;

export function setupSnowTableConfig(): void {
  if (isSetup) return;

  setupSnowTable({
    // Translation function (i18next, next-intl, etc.)
    t: (key: string) => {
      // Map SnowTable keys to your translation keys
      const keyMap: Record<string, string> = {
        'dataTable.search': 'common.search',
        'dataTable.searchEmpty': 'table.empty',
        'dataTable.paginationSize': 'pagination.rowsPerPage',
        'dataTable.columnsConfiguration': 'table.columns',
        'dataTable.resetColumns': 'table.resetColumns',
        'dataTable.resetFilters': 'table.resetFilters',
        'dataTable.searchFilters': 'common.search',
        'dataTable.selectFilter': 'table.selectFilter',
      };
      return i18n.t(keyMap[key] ?? key);
    },

    // Link component (react-router-dom, Next.js Link, etc.)
    LinkComponent: Link,

    // Optional: Custom styles (see Custom Styles section)
    // styles: { ... }
  });

  isSetup = true;
}
```

---

## App.tsx Integration

Call the setup function **once** at app startup, before your app renders:

```tsx
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import { setupSnowTableConfig } from '@/lib/snow-table-setup';

// Initialize SnowTable before rendering
setupSnowTableConfig();

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
```

---

## Actions Examples

Three action types: `click` for custom logic, `link` for navigation, `endpoint` for API calls.

### Click Action

```tsx
{
  type: 'click',
  icon: Edit,
  label: 'Change Status',
  onClick: (item) => {
    openStatusDialog({
      itemId: item.id,
      currentStatus: item.status,
      onSuccess: () => queryClient.invalidateQueries(['items']),
    });
  },
}
```

### Link Action

```tsx
{
  type: 'link',
  icon: Eye,
  label: 'View Details',
  href: (item) => `/items/${item.id}`,
}
```

### Endpoint Action

For API calls with built-in mutation handling:

```tsx
{
  type: 'endpoint',
  icon: Trash,
  label: 'Delete',
  endpoint: (item) => api.deleteItem(item.id),
  onSuccess: () => {
    toast.success('Item deleted');
    queryClient.invalidateQueries(['items']);
  },
  onError: (error) => toast.error(error.message),
}
```

### Endpoint with Confirmation

Use `withConfirm` for optional confirmation before the endpoint is called:

```tsx
{
  type: 'endpoint',
  icon: Trash,
  label: 'Delete',
  endpoint: (item) => api.deleteItem(item.id),
  withConfirm: (item) => myConfirmDialog(`Delete ${item.name}?`),
  onSuccess: () => queryClient.invalidateQueries(['items']),
}
```

If `withConfirm` returns `false`, the endpoint is not called. You provide your own confirm dialog.

### Dynamic Action

```tsx
(item) => ({
  type: 'endpoint',
  icon: item.isActive ? Pause : Play,
  label: item.isActive ? 'Deactivate' : 'Activate',
  endpoint: () => api.toggleStatus(item.id),
  onSuccess: () => queryClient.invalidateQueries(['items']),
  hidden: item.role === 'admin',
})
```

---

## Custom Styles

Override default Tailwind classes to match your design system:

```tsx
setupSnowTable({
  // ... other options
  styles: {
    // Global state styles
    state: {
      active: 'ring-2 ring-inset ring-blue-500/30',
      activeText: 'text-blue-600',
      focus: 'focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2',
    },

    // Button styles
    button: {
      visual: 'border border-gray-300 bg-white rounded-lg shadow-sm',
      hover: 'hover:bg-gray-50 hover:border-gray-400',
      disabled: 'opacity-50',
      danger: 'border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700',
      warning: 'border-transparent bg-yellow-500 text-white shadow-sm hover:bg-yellow-600',
      info: 'border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700',
      success: 'border-transparent bg-green-600 text-white shadow-sm hover:bg-green-700',
    },

    // Input styles
    input: 'rounded-lg border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/50 focus:ring-2',

    // Skeleton loading
    skeleton: 'rounded-lg bg-gray-200 animate-pulse',

    // Dropdown menu
    dropdown: {
      content: 'rounded-lg border border-gray-200 bg-white shadow-lg',
      item: 'rounded-md hover:bg-gray-100',
      checkboxItem: 'rounded-md hover:bg-gray-100',
      separator: 'bg-gray-200',
    },

    // Select component
    select: {
      trigger: 'rounded-lg border border-gray-300 bg-white',
      content: 'rounded-lg border border-gray-200 bg-white shadow-lg',
      item: 'hover:bg-gray-100',
      itemSelected: 'bg-blue-50 text-blue-700',
    },

    // Tabs (prefilters)
    tabs: {
      list: 'rounded-lg bg-gray-100',
      trigger: 'rounded-md',
      triggerActive: 'data-[state=active]:bg-white data-[state=active]:shadow-sm',
    },

    // Data table
    table: {
      container: 'rounded-xl border border-gray-200',
      header: 'bg-gray-50',
      headerCell: 'text-gray-600 font-semibold',
      row: '',
      rowHover: 'hover:bg-blue-50/50',
      rowAlternate: 'bg-gray-50/50',
      rowActive: 'bg-blue-100/50',
      divider: 'divide-y divide-gray-200',
      empty: 'text-gray-500',
      loadingOverlay: 'bg-white/60',
    },
  },
});
```

### Partial Overrides

You only need to provide the styles you want to change. Unspecified styles use defaults:

```tsx
setupSnowTable({
  styles: {
    // Only override button danger color
    button: {
      danger: 'bg-rose-600 text-white hover:bg-rose-700',
    },
    // Only override table container
    table: {
      container: 'rounded-2xl border-2 border-gray-300',
    },
  },
});
```

---

## Translation Files

Example i18next translation structure:

```json
// locales/en/translation.json
{
  "common": {
    "search": "Search...",
    "edit": "Edit",
    "delete": "Delete",
    "view": "View",
    "confirm": "Confirm",
    "cancel": "Cancel"
  },
  "table": {
    "empty": "No results found",
    "elements": "{{count}} element",
    "elements_other": "{{count}} elements",
    "columns": "Columns",
    "resetFilters": "Reset filters"
  },
  "pagination": {
    "previous": "Previous",
    "next": "Next",
    "first": "First page",
    "last": "Last page",
    "page": "Page",
    "of": "of",
    "rowsPerPage": "Rows per page"
  }
}
```

```json
// locales/fr/translation.json
{
  "common": {
    "search": "Rechercher...",
    "edit": "Modifier",
    "delete": "Supprimer",
    "view": "Voir",
    "confirm": "Confirmer",
    "cancel": "Annuler"
  },
  "table": {
    "empty": "Aucun résultat",
    "elements": "{{count}} élément",
    "elements_other": "{{count}} éléments",
    "columns": "Colonnes",
    "resetFilters": "Réinitialiser les filtres"
  },
  "pagination": {
    "previous": "Précédent",
    "next": "Suivant",
    "first": "Première page",
    "last": "Dernière page",
    "page": "Page",
    "of": "sur",
    "rowsPerPage": "Lignes par page"
  }
}
```

---

## Next.js Setup

For Next.js apps, use the Next.js Link component:

```tsx
// src/lib/snow-table-setup.ts
import Link from 'next/link';
import { setupSnowTable } from '@snowpact/react-tanstack-query-table';

setupSnowTable({
  t: (key) => key, // or use next-intl: getTranslations()
  LinkComponent: Link, // Next.js Link
});
```

### With App Router

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { setupSnowTableConfig } from '@/lib/snow-table-setup';

// Initialize once
setupSnowTableConfig();

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```
