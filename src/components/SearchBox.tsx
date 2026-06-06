'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  variant?: 'hero' | 'compact';
  isLoading?: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = '輸入公司名稱、統一編號或負責人',
  variant = 'compact',
  isLoading = false,
}) => {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const heroPadding = variant === 'hero' ? 'p-2xl' : 'p-lg';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'w-full rounded-base bg-rice-paper border-2 border-form-gray',
        heroPadding
      )}
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
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-2xl pr-lg py-md text-base bg-surface border-2 border-form-gray rounded-base',
              'placeholder:text-neutral-500',
              'focus-ring',
              'transition-colors duration-base'
            )}
            aria-label="搜尋公司"
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
    </form>
  );
};

export { SearchBox };
export type { SearchBoxProps };
