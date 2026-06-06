'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-5xl px-lg text-center',
        className
      )}
    >
      <div className="mb-xl">
        {icon || <Search size={48} className="text-form-gray" />}
      </div>
      <h3 className="text-xl font-semibold text-main-ink mb-md">{title}</h3>
      {description && (
        <p className="text-base text-neutral-600 mb-xl max-w-sm">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="text-civic-blue font-medium hover:underline focus-ring rounded-base"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="text-civic-blue font-medium hover:underline focus-ring rounded-base"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
};

export { EmptyState };
export type { EmptyStateProps };
