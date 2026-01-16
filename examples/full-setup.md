# SnowTable Setup Examples

This guide shows how to configure SnowTable with your UI library.

## Table of Contents

- [SnowTable Setup Examples](#snowtable-setup-examples)
  - [Table of Contents](#table-of-contents)
  - [Shadcn/UI Setup](#shadcnui-setup)
  - [App.tsx Integration](#apptsx-integration)
  - [Custom useConfirm Hook](#custom-useconfirm-hook)
  - [Custom Styles](#custom-styles)
  - [Translation Files](#translation-files)

---

## Shadcn/UI Setup

Create a setup file (e.g., `src/lib/snow-table-setup.ts`) that configures SnowTable:

```tsx
import i18n from '@/i18n';
import { Link } from 'react-router-dom';

import { setupSnowTable } from '@snowpact/react-tanstack-query-table';

import { useConfirm } from '@/hooks/useConfirm';

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

    // Confirm dialog hook (see implementation below)
    useConfirm: () => useConfirm(),

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
import { ConfirmDialogProvider } from '@/components/ConfirmDialog';

// Initialize SnowTable before rendering
setupSnowTableConfig();

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfirmDialogProvider>
          <Routes />
        </ConfirmDialogProvider>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
```

---

## Custom useConfirm Hook

SnowTable requires a `useConfirm` hook that returns a `confirm` function. Here's a complete implementation using Shadcn/UI Dialog:

### ConfirmDialogProvider.tsx

```tsx
// src/components/ConfirmDialog/ConfirmDialogProvider.tsx
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// =============================================================================
// Types
// =============================================================================

interface ConfirmHelpers {
  close: () => void;    // Close + resolve false (cancel)
  confirm: () => void;  // Close + resolve true (confirm)
}

type ConfirmContent = (helpers: ConfirmHelpers) => ReactNode;

interface ConfirmOptions {
  title: string;
  subtitle?: string;
  content: ConfirmContent;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// =============================================================================
// Context
// =============================================================================

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

// =============================================================================
// Provider
// =============================================================================

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise<boolean>(resolve => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(false);
  }, [resolvePromise]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolvePromise?.(true);
  }, [resolvePromise]);

  // Helpers for custom content
  const helpers: ConfirmHelpers = {
    close: handleClose,
    confirm: handleConfirm,
  };

  // Render content (always a function)
  const renderContent = () => {
    if (!options?.content) return null;
    return options.content(helpers);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{options?.title}</DialogTitle>
            {options?.subtitle && <DialogDescription>{options.subtitle}</DialogDescription>}
          </DialogHeader>

          <div className="py-4">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

export function useConfirm(): ConfirmContextValue {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  }
  return context;
}
```

### Usage Examples

Content is always a function that receives `{ close, confirm }` helpers. You control the buttons:

```tsx
// Simple confirmation with custom buttons
{
  type: 'endpoint',
  icon: Trash,
  label: 'Delete',
  variant: 'danger',
  endpoint: (item) => deleteItem(item.id),
  confirm: {
    title: 'Delete item?',
    content: ({ close, confirm }) => (
      <div className="space-y-4">
        <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button variant="destructive" onClick={confirm}>Delete</Button>
        </div>
      </div>
    ),
  },
}
```

### Usage with Forms

When using forms inside confirm dialogs, use the `close` helper:

```tsx
// In your table actions
{
  type: 'click',
  icon: Edit,
  label: 'Change Status',
  onClick: () => {},
  confirm: {
    title: 'Change Status',
    content: ({ close }) => (
      <StatusForm
        itemId={item.id}
        onSuccess={() => {
          queryClient.invalidateQueries(['items']);
          close(); // Close the dialog (resolves false, but action already done)
        }}
        onCancel={close}
      />
    ),
  },
}
```

### Helper Component for Simple Cases

For simple confirmations, create a reusable helper:

```tsx
// src/components/SimpleConfirmContent.tsx
interface SimpleConfirmContentProps {
  message: string;
  close: () => void;
  confirm: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: 'default' | 'destructive';
}

export function SimpleConfirmContent({
  message,
  close,
  confirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  confirmVariant = 'default',
}: SimpleConfirmContentProps) {
  return (
    <div className="space-y-4">
      <p>{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={close}>{cancelText}</Button>
        <Button variant={confirmVariant} onClick={confirm}>{confirmText}</Button>
      </div>
    </div>
  );
}

// Usage
confirm: {
  title: 'Delete?',
  content: ({ close, confirm }) => (
    <SimpleConfirmContent
      message="Are you sure?"
      close={close}
      confirm={confirm}
      confirmText="Delete"
      confirmVariant="destructive"
    />
  ),
}
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
  useConfirm: () => useConfirm(),
});
```

### With App Router

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { setupSnowTableConfig } from '@/lib/snow-table-setup';
import { ConfirmDialogProvider } from '@/components/ConfirmDialog';

// Initialize once
setupSnowTableConfig();

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
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
