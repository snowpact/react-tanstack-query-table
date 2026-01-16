/**
 * HTML Snapshot tests for DataTable
 * These tests capture the rendered HTML structure to detect unexpected changes
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SnowClientDataTable } from '../SnowClientDataTable';
import { SnowColumnConfig } from '../types';
import { renderWithProviders, waitFor } from '../test/test-utils';
import { setupSnowTable } from '../registry';

// Mock Link component for tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockLink = ({ to, children, ...props }: any) => (
  <a href={to} {...props}>
    {children}
  </a>
);

// Setup SnowTable
// translate returns key as-is, built-in defaults are used for dataTable.* keys
setupSnowTable({
  translate: (key) => key,
  LinkComponent: MockLink,
});

// Test data types
type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  department: string;
};

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Martin',
    email: 'alice@example.com',
    role: 'admin',
    status: 'active',
    department: 'Engineering',
  },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user', status: 'inactive', department: 'Marketing' },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'guest',
    status: 'pending',
    department: 'Sales',
  },
];

// Column configuration (similar to demo)
const columns: SnowColumnConfig<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
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
    multipleSelection: true,
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

// Mock fetch function
const fetchUsers = vi.fn().mockResolvedValue(mockUsers);

// Simple icon component for actions (must be a proper component)
const TestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="test-icon" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

describe('DataTable HTML Snapshots', () => {
  it('should match snapshot with full configuration (like demo)', async () => {
    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-test']}
        columnConfig={columns}
        fetchAllItemsEndpoint={fetchUsers}
        enableGlobalSearch={true}
        enablePagination={true}
        enableSorting={true}
        enableColumnConfiguration={true}
        filters={filters}
        prefilters={prefilters}
        prefilterFn={(item, id) => id === 'all' || item.status === id}
        defaultPageSize={10}
        paginationSizes={[10, 25, 50]}
        displayTotalNumber={true}
        actions={[
          {
            type: 'link',
            icon: TestIcon,
            label: 'View',
            href: user => `#/users/${user.id}`,
          },
          {
            type: 'click',
            icon: TestIcon,
            label: 'Edit',
            onClick: () => {},
          },
          {
            type: 'click',
            icon: TestIcon,
            label: 'Delete',
            variant: 'danger',
            onClick: () => {},
          },
        ]}
      />
    );

    // Wait for data to load
    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalled();
    });

    // Wait for table to render with data
    await waitFor(() => {
      expect(container.querySelector('.snow-table-root')).toBeInTheDocument();
    });

    // Snapshot the entire table structure
    expect(container.innerHTML).toMatchSnapshot('full-table-with-all-features');
  });

  it('should match snapshot with minimal configuration', async () => {
    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-minimal']}
        columnConfig={columns}
        fetchAllItemsEndpoint={fetchUsers}
        enableGlobalSearch={false}
        enablePagination={false}
        enableSorting={false}
        enableColumnConfiguration={false}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.snow-table-root')).toBeInTheDocument();
    });

    expect(container.innerHTML).toMatchSnapshot('minimal-table');
  });

  it('should match snapshot with search and pagination only', async () => {
    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-search-pagination']}
        columnConfig={columns}
        fetchAllItemsEndpoint={fetchUsers}
        enableGlobalSearch={true}
        enablePagination={true}
        enableSorting={false}
        enableColumnConfiguration={false}
        defaultPageSize={10}
        displayTotalNumber={true}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.snow-table-root')).toBeInTheDocument();
    });

    expect(container.innerHTML).toMatchSnapshot('table-with-search-and-pagination');
  });

  it('should match snapshot with filters only', async () => {
    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-filters']}
        columnConfig={columns}
        fetchAllItemsEndpoint={fetchUsers}
        enableGlobalSearch={false}
        enablePagination={false}
        filters={filters}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.snow-table-root')).toBeInTheDocument();
    });

    expect(container.innerHTML).toMatchSnapshot('table-with-filters');
  });

  it('should match snapshot with prefilters (tabs)', async () => {
    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-prefilters']}
        columnConfig={columns}
        fetchAllItemsEndpoint={fetchUsers}
        enableGlobalSearch={false}
        enablePagination={false}
        prefilters={prefilters}
        prefilterFn={(item, id) => id === 'all' || item.status === id}
      />
    );

    await waitFor(() => {
      expect(container.querySelector('.snow-table-root')).toBeInTheDocument();
    });

    expect(container.innerHTML).toMatchSnapshot('table-with-prefilters');
  });

  it('should match snapshot in loading state', () => {
    // Never resolving promise to keep loading state
    const neverResolve = () => new Promise<User[]>(() => {});

    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-loading']}
        columnConfig={columns}
        fetchAllItemsEndpoint={neverResolve}
        enableGlobalSearch={true}
        enablePagination={true}
      />
    );

    expect(container.innerHTML).toMatchSnapshot('table-loading-state');
  });

  it('should match snapshot with empty data', async () => {
    const fetchEmpty = vi.fn().mockResolvedValue([]);

    const { container } = renderWithProviders(
      <SnowClientDataTable
        queryKey={['snapshot-empty']}
        columnConfig={columns}
        fetchAllItemsEndpoint={fetchEmpty}
        enableGlobalSearch={true}
        enablePagination={true}
      />
    );

    await waitFor(() => {
      expect(fetchEmpty).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(container.querySelector('.snow-table-empty')).toBeInTheDocument();
    });

    expect(container.innerHTML).toMatchSnapshot('table-empty-state');
  });
});
