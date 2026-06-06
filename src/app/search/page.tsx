'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBox } from '@/components/SearchBox';
import { CompanyCard } from '@/components/CompanyCard';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { searchCompanies } from '@/lib/mockCompanies';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { validateBan } from '@/lib/validation';
import type { Company, SearchFilter } from '@/types/company';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const query = rawQuery.trim();
  const rawFilterType = searchParams.get('type');
  const filterType: SearchFilter =
    rawFilterType === 'company' ||
    rawFilterType === 'business' ||
    rawFilterType === 'branch' ||
    rawFilterType === 'recent'
      ? rawFilterType
      : 'all';

  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<Company[] | null>(null);

  React.useEffect(() => {
    if (query) {
      setIsLoading(true);
      // TODO: Replace with MOEA keyword search + Supabase cache lookup.
      setTimeout(() => {
        const searchResults = searchCompanies(query, filterType);
        setResults(searchResults);
        setIsLoading(false);
      }, 300);
    } else {
      setResults(null);
    }
  }, [filterType, query]);

  const handleSearch = (newQuery: string) => {
    const banResult = validateBan(newQuery);
    if (banResult.success) {
      router.push(`/company/${banResult.data}`);
      return;
    }

    router.push(`/search?q=${encodeURIComponent(newQuery)}&type=${filterType}`);
  };

  const filterChips = [
    { id: 'all', label: '全部' },
    { id: 'company', label: '公司' },
    { id: 'business', label: '商業' },
    { id: 'branch', label: '分公司' },
    { id: 'recent', label: '最近更新' },
  ];

  const handleFilterChange = (newType: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}&type=${newType}`);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Search Section */}
      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-main-ink mb-lg">查詢企業資訊</h1>
          <SearchBox
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder="輸入公司名稱、統一編號或負責人"
            initialValue={query}
          />
          <div className="mt-lg">
            <NoticeBox type="info" title="原型說明">
              <div className="space-y-xs">
                <p>目前為示範資料，尚未連接政府公開資料 API。</p>
                <p className="text-xs text-neutral-600">Demo data only. Public-data APIs are not connected yet.</p>
              </div>
            </NoticeBox>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-2xl px-lg">
        <div className="max-w-5xl mx-auto">
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
                目前為示範版查詢流程，以下結果使用 Mock 資料呈現未來公開資料畫面。查詢結果僅供初步參考，不等於法律、投資或交易建議。
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
              <div className="mb-xl rounded-base border-2 border-form-gray bg-rice-paper p-lg">
                <p className="text-sm text-neutral-700 mb-sm">
                  查詢：「<span className="font-medium text-main-ink">{query}</span>」
                </p>
                <p className="text-base text-main-ink font-semibold">
                  找到 {results.length} 筆結果
                </p>
                <p className="mt-sm text-sm text-neutral-600">
                  {filterType === 'recent'
                    ? '結果依最後更新日期排序，方便先查看近期異動的公開資料。'
                    : '可依公司名稱、統一編號、負責人或英文名稱初步比對，再與對方提供的文件交叉確認。'}
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
              title="沒有找到相符的公開資料"
              description="請確認公司名稱、統一編號或負責人是否正確。"
              action={{
                label: '清除查詢',
                onClick: () => router.push('/search'),
              }}
            />
          ) : (
            <EmptyState
              title="開始查詢"
              description="輸入公司名稱、統一編號、負責人或英文名稱，搜尋企業資訊。"
            />
          )}
          {query && !isLoading && (
            <div className="mt-xl text-center">
              <Link
                href="/"
                className="text-sm font-medium text-civic-blue hover:text-data-teal-text focus-ring rounded-base"
              >
                回到首頁重新查詢
              </Link>
            </div>
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
