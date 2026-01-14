/**
 * Built-in Skeleton component
 *
 * STRUCTURE: none (skeleton is purely visual)
 * VISUAL (customizable via registry): bg, rounded, animation
 */

import { getStyles } from '../registry';
import { cn } from '../utils';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  const styles = getStyles();

  return <div className={cn(styles.skeleton, className)} />;
}
