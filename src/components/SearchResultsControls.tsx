'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBox } from '@/components/SearchBox';
import { Chip } from '@/components/ui/Chip';
import { validateBan } from '@/lib/validation';
import type { SearchFilter } from '@/types/company';

interface SearchResultsControlsProps {
  query: string;
  filterType: SearchFilter;
}

const filterChips: Array<{ id: SearchFilter; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'company', label: '公司' },
  { id: 'business', label: '商業' },
  { id: 'branch', label: '分公司' },
  { id: 'recent', label: '最近更新' },
];

export function SearchResultsControls({
  query,
  filterType,
}: SearchResultsControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (newQuery: string) => {
    const businessIdResult = validateBan(newQuery);
    if (businessIdResult.success) {
      startTransition(() => {
        router.push(`/company/${businessIdResult.data}`);
      });
      return;
    }

    const params = new URLSearchParams({ q: newQuery });
    if (filterType !== 'all') {
      params.set('type', filterType);
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  const handleFilterChange = (newType: SearchFilter) => {
    if (!query) return;

    const params = new URLSearchParams({ q: query });
    if (newType !== 'all') {
      params.set('type', newType);
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <>
      <SearchBox
        onSearch={handleSearch}
        placeholder="輸入公司名稱、統一編號 / Business ID 或負責人"
        initialValue={query}
        isLoading={isPending}
      />
      <p className="mt-md text-sm text-neutral-700">
        建議輸入公司登記名稱或統一編號，例如「台灣積體電路製造股份有限公司」。
      </p>
      <p className="mt-xs text-xs text-neutral-600">
        Use the registered company name or 8-digit Business ID for best results.
      </p>
      {isPending && (
        <p className="mt-sm text-sm text-neutral-600" aria-live="polite">
          正在查詢公開資料，可能需要幾秒鐘。
        </p>
      )}

      {query && (
        <div className="mt-2xl">
          <p className="text-sm font-medium text-neutral-600 mb-xs uppercase tracking-wider">
            分類篩選
          </p>
          <p className="text-xs text-neutral-500 mb-lg">Filters</p>
          <div className="flex flex-wrap gap-md">
            {filterChips.map((chip) => (
              <Chip
                key={chip.id}
                label={chip.label}
                selected={filterType === chip.id}
                onClick={() => handleFilterChange(chip.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
