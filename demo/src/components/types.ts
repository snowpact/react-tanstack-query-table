export interface DemoConfig {
  mode: 'client' | 'server';
  enableGlobalSearch: boolean;
  enablePagination: boolean;
  enableSorting: boolean;
  enableColumnConfiguration: boolean;
  enableFilters: boolean;
  enablePrefilters: boolean;
  persistState: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  department: string;
  createdAt: string;
}
