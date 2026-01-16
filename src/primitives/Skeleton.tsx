/**
 * Built-in Skeleton component
 */

import { cn } from '../utils';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('snow-skeleton', className)} />;
}
