import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { setupSnowTableConfig, ConfirmDialogProvider } from './config/snowTableSetup';
import { BlogpostTable } from './components/BlogpostTable';

setupSnowTableConfig();

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmDialogProvider>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">SnowTable Demo</h1>
          <BlogpostTable
            domain="example.com"
            onEditClick={item => console.log('Edit:', item)}
          />
        </div>
      </ConfirmDialogProvider>
    </QueryClientProvider>
  );
};

export default App;
