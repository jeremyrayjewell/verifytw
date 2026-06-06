'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-form-gray rounded-base animate-pulse',
            className
          )}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export { LoadingSkeleton };
export type { LoadingSkeletonProps };
