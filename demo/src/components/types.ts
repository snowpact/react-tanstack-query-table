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
  ring: string;
  header: string;
  hover: string;
  skeleton: string;
  separator: string;
  rowEven: string;
  placeholder: string;
  text: string;
  radius: string;
  shadow: string;
}

export const defaultTheme: ThemeColors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  border: '#e5e5e5',
  ring: '#a3a3a3',
  header: '#f5f5f5',
  hover: '#f5f5f5',
  skeleton: '#f5f5f5',
  separator: '#e5e5e5',
  rowEven: 'transparent',
  placeholder: '#a3a3a3',
  text: '#737373',
  radius: '0.375rem',
  shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
};

export const themes: Record<string, ThemeColors> = {
  default: defaultTheme,
  dark: {
    background: '#1a1a2e',
    foreground: '#eaeaea',
    border: '#0f3460',
    ring: '#3b82f6',
    header: '#16213e',
    hover: '#16213e',
    skeleton: '#16213e',
    separator: '#0f3460',
    rowEven: '#1f1f3a',
    placeholder: '#6b7280',
    text: '#a0a0a0',
    radius: '0.375rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  },
  ocean: {
    background: '#f0f9ff',
    foreground: '#0c4a6e',
    border: '#7dd3fc',
    ring: '#0284c7',
    header: '#e0f2fe',
    hover: '#e0f2fe',
    skeleton: '#e0f2fe',
    separator: '#7dd3fc',
    rowEven: '#f0f9ff',
    placeholder: '#0369a1',
    text: '#0369a1',
    radius: '0.5rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  forest: {
    background: '#f0fdf4',
    foreground: '#14532d',
    border: '#86efac',
    ring: '#22c55e',
    header: '#dcfce7',
    hover: '#dcfce7',
    skeleton: '#dcfce7',
    separator: '#86efac',
    rowEven: '#f0fdf4',
    placeholder: '#166534',
    text: '#166534',
    radius: '0.25rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },
  sunset: {
    background: '#fff7ed',
    foreground: '#7c2d12',
    border: '#fdba74',
    ring: '#f97316',
    header: '#ffedd5',
    hover: '#ffedd5',
    skeleton: '#ffedd5',
    separator: '#fdba74',
    rowEven: '#fff7ed',
    placeholder: '#c2410c',
    text: '#c2410c',
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
