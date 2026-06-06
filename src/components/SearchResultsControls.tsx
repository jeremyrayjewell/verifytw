'use client';

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

  const handleSearch = (newQuery: string) => {
    const businessIdResult = validateBan(newQuery);
    if (businessIdResult.success) {
      router.push(`/company/${businessIdResult.data}`);
      return;
    }

    const params = new URLSearchParams({ q: newQuery });
    if (filterType !== 'all') {
      params.set('type', filterType);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (newType: SearchFilter) => {
    if (!query) return;

    const params = new URLSearchParams({ q: query });
    if (newType !== 'all') {
      params.set('type', newType);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <SearchBox
        onSearch={handleSearch}
        placeholder="輸入公司名稱、統一編號 / Business ID 或負責人"
        initialValue={query}
      />
      <p className="mt-md text-sm text-neutral-700">
        建議輸入公司登記名稱或統一編號，例如「台灣積體電路製造股份有限公司」。
      </p>

      {query && (
        <div className="mt-2xl">
          <p className="text-sm font-medium text-neutral-600 mb-lg uppercase tracking-wider">
            分類篩選
          </p>
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
