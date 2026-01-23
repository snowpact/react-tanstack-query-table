export interface DemoConfig {
  mode: 'client' | 'server';
  enableGlobalSearch: boolean;
  enablePagination: boolean;
  enableSorting: boolean;
  enableColumnConfiguration: boolean;
  enableFilters: boolean;
  enablePrefilters: boolean;
  persistState: boolean;
  mobilePreview: boolean;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  border: string;
  inputBorder: string;
  active: string;
  activeBackground: string;
  header: string;
  hover: string;
  skeleton: string;
  rowEven: string;
  placeholder: string;
  muted: string;
  radius: string;
  shadow: string;
  actionButton?: string;
}

export const defaultTheme: ThemeColors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  border: '#e5e5e5',
  inputBorder: '#e5e5e5',
  active: '#525252',
  activeBackground: '#f0f0f0',
  header: '#f5f5f5',
  hover: '#f5f5f5',
  skeleton: '#f5f5f5',
  rowEven: 'transparent',
  placeholder: '#a3a3a3',
  muted: '#737373',
  radius: '0.375rem',
  shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
};

export const themes: Record<string, ThemeColors> = {
  default: defaultTheme,
  dark: {
    background: '#1a1a2e',
    foreground: '#eaeaea',
    border: '#0f3460',
    inputBorder: '#0f3460',
    active: '#3b82f6',
    activeBackground: '#1e3a5f',
    header: '#16213e',
    hover: '#16213e',
    skeleton: '#16213e',
    rowEven: '#1f1f3a',
    placeholder: '#6b7280',
    muted: '#a0a0a0',
    radius: '0.375rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  },
  ocean: {
    background: '#f0f9ff',
    foreground: '#0c4a6e',
    border: '#bae6fd',
    inputBorder: '#7dd3fc',
    active: '#0284c7',
    activeBackground: '#e0f2fe',
    header: '#e0f2fe',
    hover: '#e0f2fe',
    skeleton: '#e0f2fe',
    rowEven: '#e0f2fe',
    placeholder: '#0369a1',
    muted: '#0369a1',
    radius: '0.5rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    actionButton: '#bae6fd',
  },
  forest: {
    background: '#f0fdf4',
    foreground: '#14532d',
    border: '#86efac',
    inputBorder: '#86efac',
    active: '#22c55e',
    activeBackground: '#dcfce7',
    header: '#dcfce7',
    hover: '#dcfce7',
    skeleton: '#dcfce7',
    rowEven: '#f0fdf4',
    placeholder: '#166534',
    muted: '#166534',
    radius: '0.25rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  sunset: {
    background: '#fff7ed',
    foreground: '#7c2d12',
    border: '#fdba74',
    inputBorder: '#fdba74',
    active: '#f97316',
    activeBackground: '#ffedd5',
    header: '#ffedd5',
    hover: '#ffedd5',
    skeleton: '#ffedd5',
    rowEven: '#fff7ed',
    placeholder: '#c2410c',
    muted: '#c2410c',
    radius: '0.75rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
};

export interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  department: string;
  createdAt: string;
}
