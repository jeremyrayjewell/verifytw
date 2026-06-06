'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-base transition-all duration-base focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-civic-blue text-surface hover:bg-opacity-90 active:bg-opacity-95',
      secondary: 'bg-data-teal text-surface hover:bg-opacity-90 active:bg-opacity-95',
      outline: 'border-2 border-main-ink text-main-ink hover:bg-rice-paper active:bg-form-gray',
      ghost: 'text-main-ink hover:bg-form-gray active:bg-neutral-200',
      danger: 'bg-stamp-red-text text-surface hover:bg-opacity-90 active:bg-opacity-95',
    };

    const sizes = {
      sm: 'px-lg py-sm text-sm',
      md: 'px-xl py-md text-base',
      lg: 'px-2xl py-lg text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 mr-md border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
