'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-main-ink mb-sm">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full px-lg py-md text-base border-2 border-form-gray rounded-base',
            'placeholder:text-neutral-400',
            'focus-ring',
            'transition-colors duration-base',
            error && 'border-stamp-red-text bg-red-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-sm text-sm text-stamp-red-text">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
