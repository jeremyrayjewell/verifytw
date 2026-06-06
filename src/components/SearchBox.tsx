'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { validateSearchQuery } from '@/lib/validation';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  variant?: 'hero' | 'compact';
  isLoading?: boolean;
  initialValue?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = '輸入公司名稱、統一編號或負責人',
  variant = 'compact',
  isLoading = false,
  initialValue = '',
}) => {
  const [query, setQuery] = React.useState(initialValue);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = validateSearchQuery(query);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || '請先輸入查詢內容');
      return;
    }

    setError('');
    onSearch(parsed.data.query);
  };

  const heroPadding = variant === 'hero' ? 'p-2xl' : 'p-lg';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full rounded-base bg-rice-paper border-2 border-form-gray',
        heroPadding
      )}
      noValidate
    >
      <div className="flex flex-col sm:flex-row gap-md items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-lg top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) {
                setError('');
              }
            }}
            placeholder={placeholder}
            className={cn(
              'w-full pl-2xl pr-lg py-md text-base bg-surface border-2 border-form-gray rounded-base',
              'placeholder:text-neutral-500',
              'focus-ring',
              'transition-colors duration-base',
              error && 'border-stamp-red-text bg-red-50'
            )}
            aria-label="搜尋公司 / Search company"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'searchbox-error' : undefined}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size={variant === 'hero' ? 'lg' : 'md'}
          isLoading={isLoading}
          className="whitespace-nowrap"
        >
          查詢
        </Button>
      </div>
      {error && (
        <p id="searchbox-error" className="mt-md text-sm text-stamp-red-text">
          {error}
          {error.includes('Email') ? '' : ''}
        </p>
      )}
    </form>
  );
};

export { SearchBox };
export type { SearchBoxProps };
