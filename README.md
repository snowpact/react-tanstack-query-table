# @snowpact/react-tanstack-query-table

Ultra-light, registry-based data table for React + TanStack Table + TanStack Query.

**[Live Demo](https://snowpact.github.io/react-tanstack-query-table/)**

## Features

- **Zero heavy dependencies**: Only `@tanstack/react-query` and `@tanstack/react-table` as peer dependencies
- **Registry-based**: Inject your own i18n, Link component, confirmation dialogs
- **TypeScript**: Full type support with generics
- **Two modes**: Client-side and Server-side pagination/filtering/sorting
- **Customizable**: Override styles via CSS variables or registry

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

// Your translation function (or just return the key)
const t = (key: string) => translations[key] || key;

setupSnowTable({
  t,
  LinkComponent: Link,
  confirm: ({ title }) => window.confirm(title),
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

Override CSS variables to match your design:

```css
:root {
  --snow-background: #ffffff;
  --snow-foreground: #0a0a0a;
  --snow-secondary: #f5f5f5;
  --snow-secondary-foreground: #737373;
  --snow-border: #d4d4d4;
  --snow-ring: #a3a3a3;
  --snow-radius: 0.375rem;
}

/* Dark mode */
.dark {
  --snow-background: #1a1a2e;
  --snow-foreground: #eaeaea;
  --snow-secondary: #16213e;
  --snow-secondary-foreground: #a0a0a0;
  --snow-border: #0f3460;
  --snow-ring: #3b82f6;
}
```

### Setup with i18n (react-i18next)

```tsx
import { useTranslation } from 'react-i18next';

// Get t function at module level or use a hook wrapper
const { t } = i18n;

setupSnowTable({
  t: (key) => t(key),
  LinkComponent: Link,
  confirm: ({ title, content }) => {
    const message = typeof content === 'string' ? `${title}\n\n${content}` : title;
    return window.confirm(message);
  },
});
```

The `t` function is automatically called with:
- All column `key` values from your `columnConfig` (e.g., `t('name')`, `t('email')`, `t('status')`)
- Internal UI keys:
  - `dataTable.search` - Search placeholder
  - `dataTable.elements` - "elements" label
  - `dataTable.searchEmpty` - Empty state text
  - `dataTable.resetFilters` - Reset button tooltip
  - `dataTable.columns` - Columns button label

### Setup with custom confirm dialog

```tsx
import { useConfirmDialog } from './your-confirm-hook';

// If you have a hook-based confirm dialog
const confirmDialog = useConfirmDialog();

setupSnowTable({
  t,
  LinkComponent: Link,
  confirm: async ({ title, content, confirmText, cancelText }) => {
    return confirmDialog.open({
      title,
      description: content,
      confirmLabel: confirmText,
      cancelLabel: cancelText,
    });
  },
});
```

### Override component styles (rare)

For deep customization, override internal Tailwind classes:

```tsx
setupSnowTable({
  t,
  LinkComponent: Link,
  confirm: ({ title }) => window.confirm(title),
  styles: {
    button: {
      visual: 'rounded-full bg-primary text-primary-foreground',
      hover: 'hover:bg-primary/90',
    },
    table: {
      header: 'bg-slate-100 dark:bg-slate-800',
      rowHover: 'hover:bg-slate-50',
    },
    input: 'rounded-full border-2 border-primary',
  },
});
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

```tsx
{
  type: 'endpoint',
  icon: TrashIcon,
  label: 'Delete',
  variant: 'danger',
  endpoint: (item) => api.deleteUser(item.id),
  onSuccess: () => queryClient.invalidateQueries(['users']),
  confirm: {
    title: 'Delete user?',
    content: 'This action cannot be undone.',
  },
}
```

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
