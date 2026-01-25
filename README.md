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
  --snow-table-background: #ffffff;   /* Main background */
  --snow-table-foreground: #0a0a0a;   /* Main text color */
  --snow-table-primary: #525252;      /* Accent (focus rings, active states) */
  --snow-table-muted: #737373;        /* Secondary text */
  --snow-table-surface: #f5f5f5;      /* Headers, hover, skeleton */
  --snow-table-border: #e5e5e5;       /* All borders */
  --snow-table-radius: 0.375rem;

  /* Optional */
  --snow-table-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --snow-table-row-even: transparent;           /* Alternate row background */
  --snow-table-action-surface: #f5f5f5;         /* Action buttons background (falls back to surface) */
}

/* Dark mode */
.dark {
  --snow-table-background: #1a1a2e;
  --snow-table-foreground: #eaeaea;
  --snow-table-primary: #3b82f6;
  --snow-table-muted: #a0a0a0;
  --snow-table-surface: #16213e;
  --snow-table-border: #0f3460;
  --snow-table-row-even: #1f1f3a;
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

## Custom Component Classes

Add your own CSS classes (e.g., Tailwind) to specific components without overriding existing styles:

```tsx
setupSnowTable({
  translate: (key) => t(key),
  LinkComponent: Link,
  styles: {
    searchBar: 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  },
});
```

| Key         | Component       |
| ----------- | --------------- |
| `searchBar` | SearchBar input |

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
  className: 'destructive-button',  // Add custom styling
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
