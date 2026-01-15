import React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { SnowClientDataTable, SnowColumnConfig } from '../../src';
import { BlogpostItem } from '../mocks/types';
import { fetchBlogposts, deleteBlogpost } from '../mocks/data';
import { mockT } from '../config/snowTableSetup';

import { StatusBlogpost } from './StatusBlogpost';
import { Badge } from './Badge';
import { EditIcon, TrashIcon } from './Icons';

// =============================================================================
// Cache Keys
// =============================================================================

const CacheKeys = {
  BLOGPOSTS: () => ['blogposts'] as const,
};

// =============================================================================
// Date Formatting
// =============================================================================

const formatDateWithTime = (date: string): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// =============================================================================
// Column Configuration
// =============================================================================

const getColumnConfig = (domain: string): SnowColumnConfig<BlogpostItem>[] => [
  {
    key: 'imageUrl',
    label: 'Image',
    sortable: false,
    render: item => {
      return (
        <>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              width={100}
              height={100}
              draggable={false}
              className="w-full rounded-lg h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </>
      );
    },
  },
  {
    key: 'title',
    sortable: true,
    searchableValue: item => item.title ?? '',
    render: item => {
      return <span className="font-semibold">{item.title}</span>;
    },
  },
  {
    key: 'lang',
    sortable: true,
    render: item => {
      return <span className="uppercase text-sm font-medium text-gray-600">{item.lang}</span>;
    },
  },
  {
    key: 'tags',
    label: mockT('data.category'),
    sortable: true,
    render: item => (
      <div className="flex flex-wrap gap-1">
        {(item.tags ?? []).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    ),
    searchableValue: item => (item.tags ?? []).join(' '),
    meta: {
      defaultHidden: true,
    },
  },
  {
    key: 'author',
    label: 'Author',
    sortable: true,
    render: item => {
      return (
        <div className="text-sm">
          <div className="font-medium">{item.author.name}</div>
          <div className="text-gray-500">{item.author.email}</div>
        </div>
      );
    },
    searchableValue: item => `${item.author.name} ${item.author.email}`,
  },
  {
    key: 'viewCount',
    label: 'Views',
    sortable: true,
    render: item => {
      return <span className="tabular-nums">{item.viewCount.toLocaleString()}</span>;
    },
  },
  {
    key: 'updatedAt',
    sortable: true,
    render: item => {
      return <div className="text-xs">{formatDateWithTime(item.updatedAt)}</div>;
    },
  },
  {
    key: '_extra_url' as keyof BlogpostItem,
    sortable: false,
    label: mockT('data.url'),
    render: item => {
      const url = `https://${domain}/blog/${item.slug}`;
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
          {url}
        </a>
      );
    },
    searchableValue: item => item.slug,
    meta: {
      defaultHidden: true,
    },
  },
  {
    key: 'status',
    label: mockT('common.statut'),
    render: item => {
      return <StatusBlogpost status={item.status} />;
    },
  },
];

// =============================================================================
// BlogpostTable Component
// =============================================================================

interface BlogpostTableProps {
  activeRowId?: string | number;
  onEditClick: (item: BlogpostItem) => void;
  domain: string;
}

export const BlogpostTable: React.FC<BlogpostTableProps> = ({ onEditClick, activeRowId, domain }) => {
  const queryClient = useQueryClient();

  return (
    <SnowClientDataTable
      key={domain}
      queryKey={CacheKeys.BLOGPOSTS()}
      fetchAllItemsEndpoint={() => fetchBlogposts()}
      columnConfig={getColumnConfig(domain)}
      activeRowId={activeRowId}
      actions={[
        {
          type: 'click',
          icon: EditIcon,
          label: mockT('common.edit'),
          onClick: item => onEditClick(item),
          variant: 'default',
        },
        {
          type: 'endpoint',
          icon: TrashIcon,
          label: mockT('common.delete'),
          endpoint: item => deleteBlogpost(item.id),
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: CacheKeys.BLOGPOSTS(),
            });
          },
          variant: 'danger',
          confirm: {
            title: mockT('blogpost.yesDelete'),
            content: mockT('blogpost.confirmationDelete'),
          },
        },
      ]}
      defaultSortBy="updatedAt"
      defaultSortOrder="desc"
      enableGlobalSearch
      enablePagination
      enableSorting
      enableColumnConfiguration
    />
  );
};
