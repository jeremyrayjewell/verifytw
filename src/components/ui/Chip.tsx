'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  label: string;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected = false, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center px-lg py-sm text-sm font-medium rounded-full transition-all duration-base',
          'border-2',
          selected
            ? 'bg-civic-blue text-surface border-civic-blue'
            : 'bg-form-gray text-main-ink border-form-gray hover:border-civic-blue',
          'focus-ring',
          className
        )}
        {...props}
      >
        {label}
      </button>
    );
  }
);

Chip.displayName = 'Chip';

export { Chip };
export type { ChipProps };
