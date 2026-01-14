import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, type RenderOptions, type RenderHookOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface ProvidersProps {
  children: ReactNode;
}

const createWrapper = () => {
  const queryClient = createTestQueryClient();

  const Providers = ({ children }: ProvidersProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { Providers, queryClient };
};

export const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const { Providers, queryClient } = createWrapper();
  return {
    ...render(ui, { wrapper: Providers, ...options }),
    queryClient,
  };
};

export const renderHookWithProviders = <TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: Omit<RenderHookOptions<TProps>, 'wrapper'>
) => {
  const { Providers, queryClient } = createWrapper();
  return {
    ...renderHook(hook, { wrapper: Providers, ...options }),
    queryClient,
  };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
