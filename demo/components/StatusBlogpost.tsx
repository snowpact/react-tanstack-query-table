import React from 'react';
import { Badge } from './Badge';
import type { BlogpostStatus } from '../mocks/types';

interface StatusBlogpostProps {
  status: BlogpostStatus;
}

const statusConfig: Record<BlogpostStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  published: { label: 'Published', variant: 'success' },
  draft: { label: 'Draft', variant: 'warning' },
  archived: { label: 'Archived', variant: 'danger' },
};

export const StatusBlogpost: React.FC<StatusBlogpostProps> = ({ status }) => {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
};
