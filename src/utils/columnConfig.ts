/**
 * Column configuration persistence utilities
 */

const COOKIE_DT_CONFIG_PREFIX = 'datatable-config-';

export const saveColumnConfiguration = (configId: string, columnVisibility: Record<string, boolean>) => {
  try {
    const cookieName = `datatable-config-${configId}`;
    const configJson = JSON.stringify(columnVisibility);
    document.cookie = `${cookieName}=${encodeURIComponent(configJson)}; path=/`;
  } catch (error) {
    console.warn('Failed to save column configuration:', error);
  }
};

export const loadColumnConfiguration = (configId: string): Record<string, boolean> | null => {
  try {
    const cookieName = `${COOKIE_DT_CONFIG_PREFIX}${configId}`;
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${cookieName}=`))
      ?.split('=')[1];

    if (cookieValue) {
      const decoded = decodeURIComponent(cookieValue);
      return JSON.parse(decoded);
    }
  } catch (error) {
    console.warn('Failed to load column configuration:', error);
  }
  return null;
};

export const deleteColumnConfiguration = (configId: string) => {
  try {
    const cookieName = `${COOKIE_DT_CONFIG_PREFIX}${configId}`;
    document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch (error) {
    console.warn('Failed to delete column configuration:', error);
  }
};

export const generateColumnConfigurationId = (): string => {
  try {
    // Get the stack trace to find the parent component name
    const stack = new Error().stack;
    if (stack) {
      const lines = stack.split('\n');
      // Look for the calling component (usually 3-4 lines up in the stack)
      for (let i = 2; i < Math.min(lines.length, 6); i++) {
        const line = lines[i];
        // Match React component names (capitalized function names)
        const match = line.match(/at\s+([A-Z][a-zA-Z0-9_]*)/);
        if (match && match[1] !== 'ColumnConfiguration') {
          return match[1].toLowerCase();
        }
      }
    }
  } catch (error) {
    console.warn('Failed to generate config ID from parent component:', error);
  }

  // Fallback: use current pathname
  const pathname = window.location.pathname.replace(/[^a-zA-Z0-9]/g, '-');
  return `datatable-${pathname}`;
};
