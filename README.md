# @snowpact/react-tanstack-query-table

Ultra-light, registry-based data table for React + TanStack Table + TanStack Query.

**[Live Demo](https://snowpact.github.io/react-tanstack-query-table/)**

## Features

- **Zero heavy dependencies**: Only `@tanstack/react-query` and `@tanstack/react-table` as peer dependencies
- **Registry-based**: Inject your own i18n and Link component
- **TypeScript**: Full type support with generics
- **Two modes**: Client-side and Server-side pagination/filtering/sorting
- **Customizable**: Override styles via CSS variables

## Quick Setup

### 1. Install

```bash
npm install @tanstack/react-query @tanstack/react-table
npm install @snowpact/react-tanstack-query-table
```

### 2. Import styles

```tsx
// In your app entry point (main.tsx or App.tsx)
import '@snowpact/react-tanstack-query-table/styles.css';
```

### 3. Setup once

```tsx
// In your app entry point (main.tsx or App.tsx)
import { setupSnowTable } from '@snowpact/react-tanstack-query-table';
import { Link } from 'react-router-dom';
import { t } from './i18n'; // Your translation function

setupSnowTable({
  translate: (key) => t(key),
  LinkComponent: Link,
});
```

**Translation keys:**
- **Dynamic keys** (column labels, etc.) - Your `translate` function handles these
- **Static UI keys** (`dataTable.*`) - Built-in English defaults if `translate` returns the key unchanged

| Key                              | Default            |
| -------------------------------- | ------------------ |
| `dataTable.search`               | "Search..."        |
| `dataTable.elements`             | "elements"         |
| `dataTable.paginationSize`       | "per page"         |
| `dataTable.columnsConfiguration` | "Columns"          |
| `dataTable.resetFilters`         | "Reset filters"    |
| `dataTable.resetColumns`         | "Reset"            |
| `dataTable.searchFilters`        | "Search..."        |
| `dataTable.searchEmpty`          | "No results found" |
| `dataTable.selectFilter`         | "Select..."        |

Override static keys without i18n:
```tsx
setupSnowTable({
  translate: (key) => key,
  LinkComponent: Link,
  translations: { 'dataTable.search': 'Rechercher...' },
});
```

### 4. Use the table

```tsx
import { SnowClientDataTable, SnowColumnConfig } from '@snowpact/react-tanstack-query-table';

type User = { id: string; name: string; email: string; status: string };

const columns: SnowColumnConfig<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status', render: (item) => <Badge>{item.status}</Badge> },
];

<SnowClientDataTable
  queryKey={['users']}
  fetchAllItemsEndpoint={() => fetchUsers()}
  columnConfig={columns}
  enableGlobalSearch
  enablePagination
  enableSorting
  enableColumnConfiguration
  defaultPageSize={20}
  defaultSortBy="name"
  defaultSortOrder="asc"
  persistState
/>
```

That's it! You have a working data table.

---

## Advanced Configuration

### Theme Customization

Override CSS variables to match your design. Variables use `@property` so they won't override values you set before importing the styles.

```css
:root {
  /* Base colors */
  --snow-table-background: #ffffff;
  --snow-table-foreground: #0a0a0a;
  --snow-table-border: #e5e5e5;        /* Table borders, row separators */
  --snow-table-input-border: #e5e5e5;  /* Inputs, buttons, dropdowns */
  --snow-table-active: #525252;                /* Focus ring, active filter border */
  --snow-table-active-background: #f5f5f5; /* Active filter background */

  /* UI-specific colors */
  --snow-table-header: #f5f5f5;      /* Table headers, tab list */
  --snow-table-hover: #f5f5f5;       /* Hover states */
  --snow-table-skeleton: #f5f5f5;    /* Skeleton loader */
  --snow-table-placeholder: #a3a3a3; /* Input placeholders */
  --snow-table-muted: #737373;       /* Secondary text (counts, pagination, inactive tabs) */

  /* Optional (transparent/inherited by default) */
  --snow-table-row-even: #fafafa;         /* Alternating rows - zebra striping */
  --snow-table-action-button: #f0f0f0;    /* Action button background */

  /* Other */
  --snow-table-radius: 0.375rem;
  --snow-table-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Dark mode example */
.dark {
  --snow-table-background: #1a1a2e;
  --snow-table-foreground: #eaeaea;
  --snow-table-border: #0f3460;
  --snow-table-input-border: #0f3460;
  --snow-table-active: #3b82f6;
  --snow-table-active-background: #1e3a5f;
  --snow-table-header: #16213e;
  --snow-table-hover: #16213e;
  --snow-table-skeleton: #16213e;
  --snow-table-row-even: #1f1f3a;
  --snow-table-placeholder: #6b7280;
  --snow-table-muted: #a0a0a0;
  --snow-table-action-button: #16213e;
}
```

---

## Client vs Server Mode

| Mode       | Component             | Use case      | Data handling                            |
| ---------- | --------------------- | ------------- | ---------------------------------------- |
| **Client** | `SnowClientDataTable` | < 5,000 items | All data loaded, filtered/sorted locally |
| **Server** | `SnowServerDataTable` | > 5,000 items | Server handles pagination/filtering      |

### SnowClientDataTable

Fetches all data once, handles everything in the browser:

```tsx
<SnowClientDataTable
  queryKey={['users']}
  fetchAllItemsEndpoint={() => api.getUsers()}
  columnConfig={columns}
/>
```

### SnowServerDataTable

Server handles pagination, search, filtering, and sorting:

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

<SnowServerDataTable
  queryKey={['users']}
  fetchServerEndpoint={fetchUsers}
  columnConfig={columns}
/>
```

---

## Actions

Actions appear as buttons in each row:

### Click Action

```tsx
{
  type: 'click',
  icon: EditIcon,
  label: 'Edit',
  onClick: (item) => openEditModal(item),
}
```

### Link Action

```tsx
{
  type: 'link',
  icon: EyeIcon,
  label: 'View',
  href: (item) => `/users/${item.id}`,
  external: false,  // true for target="_blank"
}
```

### Endpoint Action

For API calls with built-in mutation handling:

```tsx
{
  type: 'endpoint',
  icon: TrashIcon,
  label: 'Delete',
  className: 'my-danger-btn',  // Optional: add custom styling
  endpoint: (item) => api.deleteUser(item.id),
  onSuccess: () => {
    toast.success('User deleted');
    queryClient.invalidateQueries(['users']);
  },
  onError: (error) => toast.error(error.message),
}
```

### Endpoint with Confirmation

Use `withConfirm` to show a confirmation dialog before the endpoint is called:

```tsx
{
  type: 'endpoint',
  icon: TrashIcon,
  label: 'Delete',
  endpoint: (item) => api.deleteUser(item.id),
  withConfirm: async (item) => {
    // Return true to proceed, false to cancel
    return window.confirm(`Delete ${item.name}?`);
    // Or use your own dialog library (e.g., sweetalert2, radix-ui/dialog)
  },
  onSuccess: () => queryClient.invalidateQueries(['users']),
}
```

The endpoint is only called if `withConfirm` returns `true` (or a truthy Promise).

### Dynamic Actions

```tsx
actions={[
  (item) => ({
    type: 'click',
    icon: item.isActive ? PauseIcon : PlayIcon,
    label: item.isActive ? 'Deactivate' : 'Activate',
    onClick: () => toggleStatus(item),
    hidden: item.role === 'admin',
  }),
]}
```

---

## Filters

### Global Search

```tsx
<SnowClientDataTable
  enableGlobalSearch
  texts={{ searchPlaceholder: 'Search users...' }}
/>
```

### Column Filters

```tsx
<SnowClientDataTable
  filters={[
    {
      key: 'status',
      label: 'Status',
      multipleSelection: true,  // Allow multiple values
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

```tsx
<SnowClientDataTable
  prefilters={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
  ]}
  prefilterFn={(item, prefilterId) => {
    if (prefilterId === 'all') return true;
    return item.status === prefilterId;
  }}
/>
```

---

## Other Features

### URL State Persistence

```tsx
<SnowClientDataTable persistState />
```

Saves pagination, search, filters, and sorting in URL params.

### Column Configuration

```tsx
<SnowClientDataTable
  enableColumnConfiguration
  columnConfig={[
    { key: 'name' },
    { key: 'details', meta: { defaultHidden: true } },
  ]}
/>
```

### Sorting

```tsx
<SnowClientDataTable
  enableSorting
  defaultSortBy="createdAt"
  defaultSortOrder="desc"
/>
```

### Row Click

```tsx
<SnowClientDataTable
  onRowClick={(item) => navigate(`/users/${item.id}`)}
  activeRowId={selectedUserId}
/>
```

### Custom Column Rendering

```tsx
const columns: SnowColumnConfig<User>[] = [
  { key: 'name', label: 'Name' },
  {
    key: 'status',
    label: 'Status',
    render: (item) => (
      <span className={item.status === 'active' ? 'text-green-500' : 'text-red-500'}>
        {item.status}
      </span>
    ),
  },
  {
    key: '_extra_fullName',  // Use _extra_ prefix for computed columns
    label: 'Full Name',
    render: (item) => `${item.firstName} ${item.lastName}`,
    searchableValue: (item) => `${item.firstName} ${item.lastName}`,
  },
];
```

### Column Metadata (meta)

Use `meta` to customize column appearance and behavior:

```tsx
import { SnowColumnConfig, SnowColumnMeta } from '@snowpact/react-tanstack-query-table';

const columns: SnowColumnConfig<User>[] = [
  {
    key: 'id',
    label: 'ID',
    meta: {
      width: '80px',
      center: true,
    },
  },
  {
    key: 'name',
    label: 'Name',
    meta: {
      minWidth: '150px',
      maxWidth: '300px',
    },
  },
  {
    key: 'description',
    label: 'Description',
    meta: {
      defaultHidden: true,  // Hidden by default in column configuration
    },
  },
  {
    key: 'actions',
    label: '',
    meta: {
      width: 'auto',
      disableColumnClick: true,  // Don't trigger onRowClick for this column
    },
  },
];
```

#### SnowColumnMeta options

| Option               | Type               | Description                                               |
| -------------------- | ------------------ | --------------------------------------------------------- |
| `width`              | `string \| number` | Column width (e.g., `'200px'`, `'20%'`, `'auto'`)         |
| `minWidth`           | `string \| number` | Minimum column width                                      |
| `maxWidth`           | `string \| number` | Maximum column width                                      |
| `defaultHidden`      | `boolean`          | Hide column by default (with `enableColumnConfiguration`) |
| `disableColumnClick` | `boolean`          | Disable `onRowClick` for this column                      |
| `center`             | `boolean`          | Center column content                                     |

---

## API Reference

### SnowClientDataTable Props

| Prop                        | Type                    | Default  | Description                     |
| --------------------------- | ----------------------- | -------- | ------------------------------- |
| `queryKey`                  | `string[]`              | Required | React Query cache key           |
| `fetchAllItemsEndpoint`     | `() => Promise<T[]>`    | Required | Data fetching function          |
| `columnConfig`              | `SnowColumnConfig<T>[]` | Required | Column definitions              |
| `actions`                   | `TableAction<T>[]`      | -        | Row actions                     |
| `filters`                   | `FilterConfig<T>[]`     | -        | Column filters                  |
| `prefilters`                | `PreFilter[]`           | -        | Tab filters                     |
| `prefilterFn`               | `(item, id) => boolean` | -        | Client-side prefilter logic     |
| `persistState`              | `boolean`               | `false`  | Persist state in URL            |
| `enableGlobalSearch`        | `boolean`               | `false`  | Enable search bar               |
| `enablePagination`          | `boolean`               | `true`   | Enable pagination               |
| `enableSorting`             | `boolean`               | `true`   | Enable column sorting           |
| `enableColumnConfiguration` | `boolean`               | `false`  | Enable column visibility toggle |
| `defaultPageSize`           | `number`                | `10`     | Initial page size               |
| `defaultSortBy`             | `string`                | -        | Initial sort column             |
| `defaultSortOrder`          | `'asc' \| 'desc'`       | `'asc'`  | Initial sort direction          |

### SnowServerDataTable Props

Same as `SnowClientDataTable`, plus:

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
