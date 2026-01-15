# Demo - SnowClientDataTable

This folder contains a complete example demonstrating how to use `@snowpact/react-tanstack-query-table`.

> **Note**: This folder is not built with the library. It's for reference/testing purposes only.

## Structure

```
demo/
├── App.tsx                          # Main app component with providers
├── index.ts                         # Exports
├── README.md
├── config/
│   └── snowTableSetup.tsx           # SnowTable configuration
├── components/
│   ├── BlogpostTable.tsx            # Main table component example
│   ├── StatusBlogpost.tsx           # Status badge component
│   ├── BlogpostStatusForm.tsx       # Status update form
│   ├── Badge.tsx                    # Badge component
│   └── CountryCodeToEmoji.tsx       # Language flag helper
└── mocks/
    ├── types.ts                     # TypeScript types
    └── data.ts                      # Mock data and API functions
```

## Key Features Demonstrated

### 1. Setup Configuration (`config/snowTableSetup.tsx`)

- Translation hook integration (mocked i18next)
- Link component (mocked react-router-dom)
- Confirm dialog provider
- Custom styles

### 2. Column Configuration (`components/BlogpostTable.tsx`)

- Image column with fallback
- Sortable columns
- Searchable columns with custom `searchableValue`
- Custom renderers for complex data (tags, author, date)
- Hidden columns by default (`meta.defaultHidden`)
- Extra columns not in data type (`_extra_url`)

### 3. Actions

- **Click action**: Edit button that triggers a callback
- **Dynamic action**: Status change with custom form in confirm dialog
- **Endpoint action**: Delete with confirmation

### 4. Table Features

- Global search (`enableGlobalSearch`)
- Pagination (`enablePagination`)
- Sorting (`enableSorting`)
- Column configuration (`enableColumnConfiguration`)
- Active row highlighting (`activeRowId`)

## Usage in Your Project

1. **Install dependencies**:
   ```bash
   npm install @snowpact/react-tanstack-query-table @tanstack/react-query @tanstack/react-table
   ```

2. **Set up configuration** (once at app startup):
   ```tsx
   import { setupSnowTable } from '@snowpact/react-tanstack-query-table';
   import { useTranslation } from 'react-i18next';
   import { Link } from 'react-router-dom';

   setupSnowTable({
     useTranslation: () => {
       const { t } = useTranslation();
       return { t };
     },
     LinkComponent: Link,
     useConfirm: () => useYourConfirmDialog(),
   });
   ```

3. **Create your table component**:
   ```tsx
   import { SnowClientDataTable, SnowColumnConfig } from '@snowpact/react-tanstack-query-table';

   const columns: SnowColumnConfig<YourDataType>[] = [
     { key: 'name', sortable: true },
     { key: 'email', searchableValue: item => item.email },
     // ... more columns
   ];

   <SnowClientDataTable
     queryKey={['your-data']}
     fetchAllItemsEndpoint={fetchYourData}
     columnConfig={columns}
     enablePagination
     enableSorting
     enableGlobalSearch
   />
   ```

## Confirm Dialog Integration

The example shows how to integrate a custom confirm dialog that supports:

- Static content (string/ReactNode)
- Dynamic content with close helper (function)
- Hidden buttons for custom forms

```tsx
// In your setup
useConfirm: () => {
  const { confirm } = useYourDialog();
  return {
    confirm: async (options) => {
      const content = typeof options.content === 'function'
        ? options.content({ close: closeDialog })
        : options.content;
      return confirm({ ...options, content });
    }
  };
}
```

## Styling

Custom styles can be applied via the setup:

```tsx
setupSnowTable({
  styles: {
    state: {
      active: 'ring-2 ring-blue-500/40',
      activeText: 'text-blue-600',
    },
    table: {
      rowActive: 'bg-blue-50',
    },
  },
});
```
