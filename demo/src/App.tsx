import { useState, useCallback, useEffect } from 'react';
import {
  SnowClientDataTable,
  SnowServerDataTable,
  setupSnowTable,
  type SnowColumnConfig,
  type ServerFetchParams,
  type ServerPaginatedResponse,
} from '@snowpact/react-tanstack-query-table';
import { CodePanel, ConfigPanel, type DemoConfig, type User, type ThemeColors, defaultTheme } from './components';

// Simple icon components (no external dependency)
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// i18n translations for the demo
const translations: Record<string, string> = {
  'dataTable.search': 'Search...',
  'dataTable.elements': 'elements',
  'dataTable.paginationSize': 'per page',
  'dataTable.noResults': 'No results',
  'dataTable.columns': 'Columns',
  'dataTable.columnsConfiguration': 'Columns',
  'dataTable.resetFilters': 'Reset filters',
  'dataTable.searchFilters': 'Search...',
  'dataTable.resetColumns': 'Reset',
  'dataTable.searchEmpty': 'No results found',
};

// Simple t function
const t = (key: string) => translations[key] || key;

// Setup Snow Table (simple setup for demo)
setupSnowTable({
  useTranslation: () => ({ t }),
  LinkComponent: ({ href, children, ...props }) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  ),
  useConfirm: () => ({
    confirm: async ({ title, content }) => {
      const message = typeof content === 'string' ? `${title}\n\n${content}` : title;
      return window.confirm(message);
    },
  }),
});

// Mock data generator
const generateUsers = (count: number): User[] => {
  const names = [
    'Alice Martin',
    'Bob Smith',
    'Charlie Brown',
    'Diana Prince',
    'Edward Norton',
    'Fiona Apple',
    'George Lucas',
    'Helen Troy',
    'Ivan Drago',
    'Julia Roberts',
  ];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Design', 'Support'];
  const roles: User['role'][] = ['admin', 'user', 'guest'];
  const statuses: User['status'][] = ['active', 'inactive', 'pending'];

  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}${i > 9 ? i : ''}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    department: departments[i % departments.length],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

const allUsers = generateUsers(50);

// Fetch functions
const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return allUsers;
};

const fetchUsersServer = async (params: ServerFetchParams): Promise<ServerPaginatedResponse<User>> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  let filtered = [...allUsers];

  // Apply prefilter
  if (params.prefilter && params.prefilter !== 'all') {
    filtered = filtered.filter(u => u.status === params.prefilter);
  }

  // Apply search
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        filtered = filtered.filter(u => values.includes(String(u[key as keyof User])));
      }
    });
  }

  // Apply sorting
  if (params.sortBy) {
    filtered.sort((a, b) => {
      const aVal = String(a[params.sortBy as keyof User] ?? '');
      const bVal = String(b[params.sortBy as keyof User] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return params.sortOrder === 'DESC' ? -cmp : cmp;
    });
  }

  const total = filtered.length;
  const items = filtered.slice(params.offset, params.offset + params.limit);

  return { items, totalItemCount: total };
};

const deleteUser = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Deleted user:', id);
};

// Column configuration
const columns: SnowColumnConfig<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Role',
    render: item => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.role === 'admin'
            ? 'bg-purple-100 text-purple-700'
            : item.role === 'user'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {item.role}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: item => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'active'
            ? 'bg-green-100 text-green-700'
            : item.status === 'inactive'
            ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {item.status}
      </span>
    ),
  },
  { key: 'department', label: 'Department' },
];

// Filters configuration
const filters = [
  {
    key: 'role' as const,
    label: 'Role',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
    ],
  },
  {
    key: 'status' as const,
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

// Prefilters configuration
const prefilters = [
  { id: 'all', label: 'All Users' },
  { id: 'active', label: 'Active' },
];

export function App() {
  const [config, setConfig] = useState<DemoConfig>({
    mode: 'client',
    enableGlobalSearch: true,
    enablePagination: true,
    enableSorting: true,
    enableColumnConfiguration: true,
    enableFilters: true,
    enablePrefilters: true,
    persistState: false,
    mobilePreview: false,
  });

  const [currentThemeName, setCurrentThemeName] = useState('default');
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(defaultTheme);

  // Apply theme CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--snow-background', currentTheme.background);
    root.style.setProperty('--snow-foreground', currentTheme.foreground);
    root.style.setProperty('--snow-secondary', currentTheme.secondary);
    root.style.setProperty('--snow-secondary-foreground', currentTheme.secondaryForeground);
    root.style.setProperty('--snow-border', currentTheme.border);
    root.style.setProperty('--snow-ring', currentTheme.ring);
    root.style.setProperty('--snow-radius', currentTheme.radius);
  }, [currentTheme]);

  const handleThemeChange = useCallback((themeName: string, theme: ThemeColors) => {
    setCurrentThemeName(themeName);
    setCurrentTheme(theme);
  }, []);

  const toggleConfig = useCallback((key: keyof DemoConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const setMode = useCallback((mode: 'client' | 'server') => {
    setConfig(prev => ({ ...prev, mode }));
  }, []);

  const actions = [
    {
      type: 'link' as const,
      icon: EyeIcon,
      label: 'View',
      href: (user: User) => `#/users/${user.id}`,
    },
    {
      type: 'click' as const,
      icon: EditIcon,
      label: 'Edit',
      onClick: (user: User) => {
        alert(`Edit user: ${user.name}`);
      },
    },
    {
      type: 'endpoint' as const,
      icon: TrashIcon,
      label: 'Delete',
      variant: 'danger' as const,
      endpoint: (user: User) => deleteUser(user.id),
      confirm: {
        title: 'Delete user?',
        content: `Are you sure you want to delete "${config.mode}"? This action cannot be undone.`,
      },
    },
  ];

  const tableProps = {
    queryKey: ['users', config.mode],
    columnConfig: columns,
    actions,
    enableGlobalSearch: config.enableGlobalSearch,
    enablePagination: config.enablePagination,
    enableSorting: config.enableSorting,
    enableColumnConfiguration: config.enableColumnConfiguration,
    persistState: config.persistState,
    defaultPageSize: 10,
    paginationSizes: [10, 25, 50, 100],
    displayTotalNumber: true,
    ...(config.enableFilters && { filters }),
    ...(config.enablePrefilters && { prefilters }),
    ...(config.enablePrefilters &&
      config.mode === 'client' && {
        prefilterFn: (item: User, id: string) => id === 'all' || item.status === id,
      }),
  };

  return (
    <div className="min-h-screen flex">
      {/* Code Panel - Left Side */}
      <div className="w-96 flex-shrink-0 h-screen sticky top-0">
        <CodePanel config={config} theme={currentTheme} />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">@snowpact/react-tanstack-query-table</h1>
          <p className="text-gray-600 mb-8">
            Ultra-light, registry-based data table for React + TanStack Table + TanStack Query
          </p>

          <div className={`bg-white rounded-lg shadow-md p-6 mb-8 overflow-visible transition-all ${
            config.mobilePreview ? 'max-w-[375px] mx-auto ring-2 ring-purple-500' : ''
          }`}>
            <div className="mb-4 flex items-center gap-2 text-sm flex-wrap">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  config.mode === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}
              >
                {config.mode === 'client' ? 'SnowClientDataTable' : 'SnowServerDataTable'}
              </span>
              <span className="text-gray-500">
                {config.mode === 'client' ? '50 items loaded, filtered locally' : 'Server-side pagination & filtering'}
              </span>
              {config.mobilePreview && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                  📱 Mobile Preview (375px)
                </span>
              )}
            </div>

            {config.mode === 'client' ? (
              <SnowClientDataTable
                key={`client-${config.persistState}`}
                {...tableProps}
                fetchAllItemsEndpoint={fetchUsers}
              />
            ) : (
              <SnowServerDataTable
                key={`server-${config.persistState}`}
                {...tableProps}
                fetchServerEndpoint={fetchUsersServer}
              />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Features Enabled</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(config)
                .filter(([key]) => key !== 'mode' && key !== 'mobilePreview')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Config Panel - Right Side Fixed */}
      <div className="w-72 flex-shrink-0 h-screen sticky top-0">
        <ConfigPanel
          config={config}
          onToggle={toggleConfig}
          onModeChange={setMode}
          currentTheme={currentThemeName}
          onThemeChange={handleThemeChange}
        />
      </div>
    </div>
  );
}
