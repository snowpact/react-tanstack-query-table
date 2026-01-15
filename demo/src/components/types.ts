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
  secondary: string;
  secondaryForeground: string;
  border: string;
  ring: string;
  radius: string;
}

export const defaultTheme: ThemeColors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  secondary: '#f5f5f5',
  secondaryForeground: '#737373',
  border: '#e5e5e5',
  ring: '#3b82f6',
  radius: '0.375rem',
};

export const themes: Record<string, ThemeColors> = {
  default: defaultTheme,
  neutral: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    secondary: '#f5f5f5',
    secondaryForeground: '#737373',
    border: '#d4d4d4',
    ring: '#a3a3a3',
    radius: '0.375rem',
  },
  dark: {
    background: '#1a1a2e',
    foreground: '#eaeaea',
    secondary: '#16213e',
    secondaryForeground: '#a0a0a0',
    border: '#0f3460',
    ring: '#3b82f6',
    radius: '0.375rem',
  },
  ocean: {
    background: '#f0f9ff',
    foreground: '#0c4a6e',
    secondary: '#e0f2fe',
    secondaryForeground: '#0369a1',
    border: '#7dd3fc',
    ring: '#0284c7',
    radius: '0.5rem',
  },
  forest: {
    background: '#f0fdf4',
    foreground: '#14532d',
    secondary: '#dcfce7',
    secondaryForeground: '#166534',
    border: '#86efac',
    ring: '#22c55e',
    radius: '0.25rem',
  },
  sunset: {
    background: '#fff7ed',
    foreground: '#7c2d12',
    secondary: '#ffedd5',
    secondaryForeground: '#c2410c',
    border: '#fdba74',
    ring: '#f97316',
    radius: '0.75rem',
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
