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

### Tailwind CSS Configuration

Tailwind CSS is required. You must configure Tailwind to scan the package's classes:

**In your `tailwind.config.css` (Tailwind v4):**

```css
/* Include SnowTable classes for Tailwind scanning */
@source "node_modules/@snowpact/react-tanstack-query-table/dist";
```

**Or in `tailwind.config.js` (Tailwind v3):**

```js
module.exports = {
  content: [
    // ... your app files
    './node_modules/@snowpact/react-tanstack-query-table/dist/**/*.js',
  ],
};
```

> **Note**: The path may vary depending on your project structure. If using a monorepo or workspace, adjust the path accordingly (e.g., `../../node_modules/...`).

## Quick Start

### 1. Setup (once in your app)

```tsx
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

> **Full setup example**: See [examples/full-setup.md](./examples/full-setup.md) for a complete Shadcn/UI integration with custom `useConfirm` hook, tooltips, and translations.

### 2. Use a Client Table

```tsx
import { SnowClientTable, SnowColumnConfig } from '@snowpact/react-tanstack-query-table';
import { Edit, Trash } from 'lucide-react';

type User = { id: string; name: string; email: string };

const columns: SnowColumnConfig<User>[] = [{ key: 'name' }, { key: 'email' }];

<SnowClientTable
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
| **Client** | `SnowClientTable` | < 5,000 items | All data loaded, filtered/sorted locally        |
| **Server** | `SnowServerTable` | > 5,000 items | Paginated API, server handles filtering/sorting |

### SnowClientTable

Best for small to medium datasets. Fetches all data once via React Query, then handles pagination, search, and sorting entirely in the browser.

```tsx
<SnowClientTable
  queryKey={['users']}
  fetchAllItemsEndpoint={() => api.getUsers()} // Returns User[]
  columnConfig={columns}
/>
```

### SnowServerTable

Best for large datasets. The server handles pagination, search, filtering, and sorting. Returns paginated results with a total count.

```tsx
import { SnowServerTable, ServerFetchParams } from '@snowpact/react-tanstack-query-table';

const fetchUsers = async (params: ServerFetchParams) => {
  // params: { limit, offset, search?, sortBy?, sortOrder?, filters?, prefilter? }
  const response = await api.getUsers(params);
  return {
    items: response.data,
    totalItemCount: response.total,
  };
};

<SnowServerTable queryKey={['users']} fetchServerEndpoint={fetchUsers} columnConfig={columns} />;
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
<SnowClientTable enableGlobalSearch texts={{ searchPlaceholder: 'Search users...' }} />
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
<SnowClientTable
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
<SnowClientTable
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
<SnowClientTable
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
<SnowClientTable
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
<SnowClientTable enableSorting defaultSortBy="createdAt" defaultSortOrder="desc" />
```

### Pagination

```tsx
<SnowClientTable
  enablePagination
  defaultPageSize={25}
  displayTotalNumber // Show "X elements"
  enableElementLabel // Show element label
/>
```

### Row Click

```tsx
<SnowClientTable
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

### Action Hover (Tooltips)

Integrate with your tooltip system:

```tsx
setupSnowTable({
  // ... other options
  onActionHover: ({ label, element }) => showTooltip(label, element),
  onActionUnhover: () => hideTooltip(),
});
```

## API Reference

### SnowClientTable Props

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

### SnowServerTable Props

Same as `SnowClientTable`, except:

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
