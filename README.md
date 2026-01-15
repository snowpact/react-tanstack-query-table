# @snowpact/react-tanstack-query-table

Ultra-light, registry-based data table for React + TanStack Table + TanStack Query.

## Features

- **Zero heavy dependencies**: No clsx, no tailwind-merge, no lucide-react bundled
- **Registry-based**: Inject your own i18n, Link component, confirmation dialogs
- **TypeScript**: Full type support with generics
- **Two modes**: Client-side and Server-side pagination/filtering/sorting
- **Customizable**: Override styles via registry

## Installation

```bash
npm install @snowpact/react-tanstack-query-table
# or
pnpm add @snowpact/react-tanstack-query-table
```

### Peer Dependencies

```bash
npm install @tanstack/react-query @tanstack/react-table react react-dom
```

### Import Styles

Import the library CSS in your app entry point:

```tsx
import '@snowpact/react-tanstack-query-table/styles.css';
```

### Customization (Optional)

You can customize the library appearance by overriding CSS variables:

```css
:root {
  --snow-background: #ffffff;           /* Main background (table, rows, inputs) */
  --snow-foreground: #0a0a0a;           /* Main text color */
  --snow-secondary: #f5f5f5;            /* Secondary background (headers, hover) */
  --snow-secondary-foreground: #737373; /* Secondary text color */
  --snow-border: #d4d4d4;               /* Border color */
  --snow-ring: #a3a3a3;                 /* Focus ring color */
  --snow-radius: 0.375rem;              /* Border radius */
}
```

**Dark mode example:**

```css
.dark {
  --snow-background: #1a1a2e;
  --snow-foreground: #eaeaea;
  --snow-secondary: #16213e;
  --snow-secondary-foreground: #a0a0a0;
  --snow-border: #0f3460;
  --snow-ring: #3b82f6;
}
```

## Quick Start

### 1. Setup (once in your app)

```tsx
// Import styles first
import '@snowpact/react-tanstack-query-table/styles.css';

import { setupSnowTable } from '@snowpact/react-tanstack-query-table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useConfirm } from './your-confirm-dialog';

setupSnowTable({
  useTranslation: () => useTranslation(),
  LinkComponent: Link,
  useConfirm: () => useConfirm(),
});
```

> **Full setup example**: See [examples/full-setup.md](./examples/full-setup.md) for a complete Shadcn/UI integration with custom `useConfirm` hook and translations.

### 2. Use a Client Table

```tsx
import { SnowClientDataTable, SnowColumnConfig } from '@snowpact/react-tanstack-query-table';
import { Edit, Trash } from 'lucide-react';

type User = { id: string; name: string; email: string };

const columns: SnowColumnConfig<User>[] = [{ key: 'name' }, { key: 'email' }];

<SnowClientDataTable
  queryKey={['users']}
  fetchAllItemsEndpoint={() => fetchUsers()}
  columnConfig={columns}
  actions={[
    { type: 'click', icon: Edit, label: 'Edit', onClick: user => editUser(user) },
    { type: 'endpoint', icon: Trash, label: 'Delete', endpoint: user => deleteUser(user.id) },
  ]}
  enableGlobalSearch
  enablePagination
/>;
```

## Client vs Server Mode

| Mode       | Component         | Use case      | Data handling                                   |
| ---------- | ----------------- | ------------- | ----------------------------------------------- |
| **Client** | `SnowClientDataTable` | < 5,000 items | All data loaded, filtered/sorted locally        |
| **Server** | `SnowServerDataTable` | > 5,000 items | Paginated API, server handles filtering/sorting |

### SnowClientDataTable

Best for small to medium datasets. Fetches all data once via React Query, then handles pagination, search, and sorting entirely in the browser.

```tsx
<SnowClientDataTable
  queryKey={['users']}
  fetchAllItemsEndpoint={() => api.getUsers()} // Returns User[]
  columnConfig={columns}
/>
```

### SnowServerDataTable

Best for large datasets. The server handles pagination, search, filtering, and sorting. Returns paginated results with a total count.

```tsx
import { SnowServerDataTable, ServerFetchParams } from '@snowpact/react-tanstack-query-table';

const fetchUsers = async (params: ServerFetchParams) => {
  // params: { limit, offset, search?, sortBy?, sortOrder?, filters?, prefilter? }
  const response = await api.getUsers(params);
  return {
    items: response.data,
    totalItemCount: response.total,
  };
};

<SnowServerDataTable queryKey={['users']} fetchServerEndpoint={fetchUsers} columnConfig={columns} />;
```

## Actions

Actions appear as buttons in each row. Three types are available:

### Click Action

Simple callback when clicked.

```tsx
{
  type: 'click',
  icon: Edit,
  label: 'Edit',
  onClick: (item) => openEditModal(item),
}
```

### Link Action

Navigates to a URL. Uses your registered `LinkComponent`.

```tsx
{
  type: 'link',
  icon: Eye,
  label: 'View',
  href: (item) => `/users/${item.id}`,
  external: false,  // true for target="_blank"
}
```

### Endpoint Action

Calls an async endpoint (API mutation). Integrates with React Query invalidation.

```tsx
{
  type: 'endpoint',
  icon: Trash,
  label: 'Delete',
  endpoint: (item) => api.deleteUser(item.id),
  onSuccess: () => queryClient.invalidateQueries(['users']),
  onError: (error) => toast.error(error.message),
}
```

### Confirmation Dialog

Any action can require confirmation before executing:

```tsx
{
  type: 'endpoint',
  icon: Trash,
  label: 'Delete',
  variant: 'danger',
  endpoint: (item) => api.deleteUser(item.id),
  confirm: {
    title: 'Delete user?',
    content: 'This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  },
}
```

For forms inside confirm dialogs, use a function to access the `close` helper:

```tsx
{
  type: 'click',
  icon: Edit,
  label: 'Change Status',
  onClick: () => {},
  confirm: {
    title: 'Change Status',
    hideButtons: true,  // Form handles its own buttons
    content: ({ close }) => (
      <StatusForm
        onSuccess={() => {
          queryClient.invalidateQueries(['users']);
          close();
        }}
      />
    ),
  },
}
```

### Action Options

| Option      | Type                                                        | Description                              |
| ----------- | ----------------------------------------------------------- | ---------------------------------------- |
| `icon`      | `ComponentType<SVGProps>`                                   | Icon component (lucide-react or any SVG) |
| `label`     | `string`                                                    | Button label (used for tooltip)          |
| `variant`   | `'default' \| 'danger' \| 'warning' \| 'info' \| 'success'` | Button color variant                     |
| `display`   | `'button' \| 'dropdown'`                                    | Show as button or in dropdown menu       |
| `hidden`    | `boolean`                                                   | Conditionally hide the action            |
| `disabled`  | `boolean`                                                   | Disable the action                       |
| `showLabel` | `boolean`                                                   | Show label text next to icon             |

### Dynamic Actions

Actions can be functions that return the action config, allowing per-row customization:

```tsx
actions={[
  (item) => ({
    type: 'click',
    icon: item.isActive ? Pause : Play,
    label: item.isActive ? 'Deactivate' : 'Activate',
    onClick: () => toggleStatus(item),
    hidden: item.role === 'admin',  // Hide for admins
  }),
]}
```

## Search & Filtering

### Global Search

Enable fuzzy search across all columns:

```tsx
<SnowClientDataTable enableGlobalSearch texts={{ searchPlaceholder: 'Search users...' }} />
```

For custom search values (computed columns):

```tsx
const columns: SnowColumnConfig<User>[] = [
  {
    key: '_extra_fullName',
    label: 'Full Name',
    render: item => `${item.firstName} ${item.lastName}`,
    searchableValue: item => `${item.firstName} ${item.lastName}`,
  },
];
```

### Column Filters

Multi-select dropdown filters:

```tsx
<SnowClientDataTable
  filters={[
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
      ],
    },
  ]}
/>
```

### Prefilters (Tabs)

Quick segmentation via tabs:

```tsx
<SnowClientDataTable
  prefilters={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'archived', label: 'Archived' },
  ]}
  prefilterFn={(item, prefilterId) => {
    if (prefilterId === 'all') return true;
    return item.status === prefilterId;
  }}
/>
```

For server mode, the `prefilter` value is sent to your endpoint.

## Advanced Configuration

### Column Configuration

Users can show/hide columns via a settings button. Configuration is saved in cookies.

```tsx
<SnowClientDataTable
  enableColumnConfiguration
  columnConfig={[
    { key: 'name' }, // Always visible
    { key: 'email' },
    { key: 'details', meta: { defaultHidden: true } }, // Hidden by default
  ]}
/>
```

### URL State Persistence

Persist table state (pagination, search, filters, sorting) in URL query params:

```tsx
<SnowClientDataTable
  persistState // State saved in URL
/>
```

URL params used:

- `dt_page`, `dt_pageSize` - Pagination
- `dt_search` - Search query
- `dt_prefilter` - Active prefilter
- `dt_filters` - Column filters
- `dt_sortBy`, `dt_sortDesc` - Sorting

### Column Meta Properties

```tsx
{
  key: 'actions',
  meta: {
    width: '100px',           // Fixed width
    minWidth: '80px',         // Minimum width
    center: true,             // Center content
    defaultHidden: true,      // Hidden by default
    disableColumnClick: true, // Disable row click for this column
  },
}
```

### Sorting

```tsx
<SnowClientDataTable enableSorting defaultSortBy="createdAt" defaultSortOrder="desc" />
```

### Pagination

```tsx
<SnowClientDataTable
  enablePagination
  defaultPageSize={25}
  displayTotalNumber // Show "X elements"
  enableElementLabel // Show element label
/>
```

### Row Click

```tsx
<SnowClientDataTable
  onRowClick={item => navigate(`/users/${item.id}`)}
  activeRowId={selectedUserId} // Highlight active row
/>
```

### Custom Styles

Override default Tailwind classes via the registry:

```tsx
setupSnowTable({
  // ... other options
  styles: {
    table: {
      wrapper: 'border border-gray-200 rounded-lg',
      header: 'bg-gray-50',
      row: 'hover:bg-gray-100',
    },
    button: {
      visual: 'bg-blue-500 text-white',
      hover: 'hover:bg-blue-600',
    },
  },
});
```

### Action Tooltips

Action buttons automatically display tooltips on hover. The tooltip uses your theme's CSS variables (`--snow-foreground`, `--snow-background`, `--snow-radius`) for consistent styling.

## API Reference

### SnowClientDataTable Props

| Prop                        | Type                    | Default  | Description                     |
| --------------------------- | ----------------------- | -------- | ------------------------------- |
| `queryKey`                  | `string[]`              | Required | React Query cache key           |
| `fetchAllItemsEndpoint`     | `() => Promise<T[]>`    | Required | Data fetching function          |
| `columnConfig`              | `SnowColumnConfig<T>[]` | Required | Column definitions              |
| `actions`                   | `TableAction<T>[]`      | `[]`     | Row actions                     |
| `filters`                   | `FilterConfig<T>[]`     | `[]`     | Column filters                  |
| `prefilters`                | `PreFilter[]`           | `[]`     | Tab filters                     |
| `prefilterFn`               | `(item, id) => boolean` | -        | Client-side prefilter logic     |
| `persistState`              | `boolean`               | `false`  | Persist state in URL            |
| `enableGlobalSearch`        | `boolean`               | `false`  | Enable search bar               |
| `enablePagination`          | `boolean`               | `false`  | Enable pagination               |
| `enableSorting`             | `boolean`               | `false`  | Enable column sorting           |
| `enableColumnConfiguration` | `boolean`               | `false`  | Enable column visibility toggle |
| `enableResetFilters`        | `boolean`               | `false`  | Show reset filters button       |
| `defaultPageSize`           | `number`                | `10`     | Initial page size               |
| `defaultSortBy`             | `string`                | -        | Initial sort column             |
| `defaultSortOrder`          | `'asc' \| 'desc'`       | `'asc'`  | Initial sort direction          |

### SnowServerDataTable Props

Same as `SnowClientDataTable`, except:

| Prop                  | Type                                                                 | Description              |
| --------------------- | -------------------------------------------------------------------- | ------------------------ |
| `fetchServerEndpoint` | `(params: ServerFetchParams) => Promise<ServerPaginatedResponse<T>>` | Paginated fetch function |

### ServerFetchParams

```typescript
interface ServerFetchParams {
  limit: number;
  offset: number;
  search?: string;
  prefilter?: string;
  filters?: Record<string, string[]>;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

### ServerPaginatedResponse

```typescript
interface ServerPaginatedResponse<T> {
  items: T[];
  totalItemCount: number;
}
```

## License

MIT
