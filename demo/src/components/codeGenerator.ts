import type { DemoConfig } from './types';

export function generateInstallCode(): string {
  return `npm install @snowpact/react-tanstack-query-table @tanstack/react-query @tanstack/react-table

# Tailwind CSS is required
# Add to your tailwind.config.js content array:
# './node_modules/@snowpact/react-tanstack-query-table/dist/**/*.js'`;
}

export function generateSetupCode(): string {
  return `import { setupSnowTable } from '@snowpact/react-tanstack-query-table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Setup once in your app entry point
setupSnowTable({
  useTranslation: () => useTranslation(),
  LinkComponent: Link,
  useConfirm: () => ({
    confirm: ({ title, content }) => window.confirm(title),
  }),
});`;
}

export function generateColumnConfigCode(): string {
  return `import { SnowColumnConfig } from '@snowpact/react-tanstack-query-table';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  department: string;
};

const columns: SnowColumnConfig<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
];`;
}

export function generateTableCode(config: DemoConfig): string {
  const Component = config.mode === 'client' ? 'SnowClientDataTable' : 'SnowServerDataTable';
  const fetchProp = config.mode === 'client'
    ? 'fetchAllItemsEndpoint={() => fetchUsers()}'
    : 'fetchServerEndpoint={(params) => fetchUsersServer(params)}';

  const props: string[] = [
    `queryKey={['users']}`,
    fetchProp,
    `columnConfig={columns}`,
  ];

  if (config.enableGlobalSearch) props.push(`enableGlobalSearch`);
  if (config.enablePagination) {
    props.push(`enablePagination`);
    props.push(`paginationSizes={[10, 25, 50, 100]}`);
    props.push(`defaultPageSize={10}`);
  }
  if (config.enableSorting) props.push(`enableSorting`);
  if (config.enableColumnConfiguration) props.push(`enableColumnConfiguration`);
  if (config.persistState) props.push(`persistState`);

  if (config.enableFilters) {
    props.push(`filters={[
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' },
        { value: 'guest', label: 'Guest' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
      ],
    },
  ]}`);
  }

  if (config.enablePrefilters) {
    props.push(`prefilters={[
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
  ]}`);
    if (config.mode === 'client') {
      props.push(`prefilterFn={(item, id) => id === 'all' || item.status === id}`);
    }
  }

  props.push(`actions={[
    {
      type: 'click',
      icon: Edit,
      label: 'Edit',
      onClick: (user) => console.log('Edit', user),
    },
    {
      type: 'endpoint',
      icon: Trash,
      label: 'Delete',
      variant: 'danger',
      endpoint: (user) => deleteUser(user.id),
      confirm: {
        title: 'Delete user?',
        content: 'This action cannot be undone.',
      },
    },
  ]}`);

  const propsStr = props.map(p => `  ${p}`).join('\n');

  return `import { ${Component} } from '@snowpact/react-tanstack-query-table';
import { Edit, Trash } from 'lucide-react';

<${Component}
${propsStr}
/>`;
}

