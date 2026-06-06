'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchBox } from '@/components/SearchBox';
import { CompanyCard } from '@/components/CompanyCard';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { searchCompanies } from '@/lib/mockCompanies';
import { NoticeBox } from '@/components/ui/NoticeBox';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const filterType = searchParams.get('type') || 'all';

  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<typeof searchCompanies.prototype | null>(null);

  React.useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const searchResults = searchCompanies(query);
        setResults(searchResults);
        setIsLoading(false);
      }, 300);
    } else {
      setResults(null);
    }
  }, [query]);

  const handleSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}&type=${filterType}`);
  };

  const filterChips = [
    { id: 'all', label: '全部' },
    { id: 'company', label: '公司' },
    { id: 'business', label: '商業' },
    { id: 'branch', label: '分公司' },
  ];

  const handleFilterChange = (newType: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}&type=${newType}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Search Section */}
      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-main-ink mb-lg">查詢企業資訊</h1>
          <SearchBox
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder="輸入公司名稱、統一編號或負責人"
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-2xl px-lg">
        <div className="max-w-4xl mx-auto">
          {/* Filter Chips */}
          {query && (
            <div className="mb-2xl">
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

          {/* Search Notice */}
          {query && (
            <div className="mb-2xl">
              <NoticeBox type="info">
                查詢結果僅顯示經濟部商工登記的公開資料。若有資料異議，請洽經濟部申請更正。
              </NoticeBox>
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <div className="space-y-lg">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-48" />
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div>
              <div className="mb-xl">
                <p className="text-sm text-neutral-600">
                  找到 <span className="font-bold text-main-ink">{results.length}</span> 筆結果
                </p>
              </div>
              <div className="space-y-lg">
                {results.map((company) => (
                  <CompanyCard
                    key={company.ban}
                    company={company}
                  />
                ))}
              </div>
            </div>
          ) : query ? (
            <EmptyState
              title="查無相關結果"
              description="請試試其他查詢詞，或確認輸入的統一編號、公司名稱是否正確。"
              action={{
                label: '回到首頁',
                onClick: () => router.push('/'),
              }}
            />
          ) : (
            <EmptyState
              title="開始查詢"
              description="輸入公司名稱、統一編號或負責人名字，搜尋企業資訊。"
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
