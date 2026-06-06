import Link from 'next/link';
import { CompanyCard } from '@/components/CompanyCard';
import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { SearchResultsControls } from '@/components/SearchResultsControls';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { getSearchResults } from '@/lib/companySearch';
import type { SearchFilter } from '@/types/company';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams?: {
    q?: string;
    type?: string;
  };
}

function getFilterType(type?: string): SearchFilter {
  if (
    type === 'company' ||
    type === 'business' ||
    type === 'branch' ||
    type === 'recent'
  ) {
    return type;
  }

  return 'all';
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const rawQuery = searchParams?.q ?? '';
  const query = rawQuery.trim();
  const filterType = getFilterType(searchParams?.type);
  const searchResult = query
    ? await getSearchResults(query, filterType)
    : null;

  const results = searchResult?.companies ?? [];
  const isUnavailableState =
    searchResult?.dataState === 'no_results' &&
    searchResult.apiMessage === '暫時無法取得即時公開資料，請稍後再試。';
  const isParseErrorState =
    searchResult?.dataState === 'no_results' &&
    searchResult.apiMessage === '公開資料格式暫時無法解析。';
  const isLiveEmptyState =
    searchResult?.dataState === 'no_results' &&
    searchResult.apiMessage === '沒有找到相符的公司登記公開資料。';

  return (
    <div className="min-h-screen bg-surface">
      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-main-ink mb-lg">查詢企業資訊</h1>
          <SearchResultsControls query={query} filterType={filterType} />

          {query && searchResult?.dataState === 'live' && (
            <div className="mt-lg">
              <NoticeBox type="info" title="資料來源">
                <div className="space-y-xs">
                  <p>目前顯示經濟部商工登記公開資料。</p>
                  <p className="text-xs text-neutral-600">MOEA public company registration data</p>
                </div>
              </NoticeBox>
            </div>
          )}

          {query && searchResult?.dataState === 'mock' && (
            <div className="mt-lg">
              <NoticeBox type="info" title="原型說明">
                <div className="space-y-xs">
                  <p>目前為示範資料，尚未取得即時政府公開資料。</p>
                  <p className="text-xs text-neutral-600">Demo data only. Public-data APIs are not connected yet.</p>
                </div>
              </NoticeBox>
            </div>
          )}

          {query && searchResult?.dataState === 'fallback_mock' && (
            <div className="mt-lg">
              <NoticeBox type="info" title="暫時使用示範資料">
                <div className="space-y-xs">
                  <p>暫時無法取得即時公開資料，以下顯示示範資料或本地結果。</p>
                  <p className="text-xs text-neutral-600">
                    {searchResult.apiMessage ?? '公開資料來源可能暫時回應較慢，建議稍後再次查詢。'}
                  </p>
                </div>
              </NoticeBox>
            </div>
          )}
        </div>
      </section>

      <section className="py-2xl px-lg">
        <div className="max-w-5xl mx-auto">
          {query && searchResult && searchResult.dataState !== 'invalid_query' && (
            <div className="mb-xl rounded-base border-2 border-form-gray bg-rice-paper p-lg">
              <p className="text-sm text-neutral-700 mb-sm">
                查詢：「<span className="font-medium text-main-ink">{searchResult.query}</span>」
              </p>
              <p className="text-base text-main-ink font-semibold">
                找到 {results.length} 筆結果
              </p>
              <p className="mt-sm text-sm text-neutral-600">
                {filterType === 'recent'
                  ? '結果依最近更新資訊排序，方便先查看近期異動的公開資料。'
                  : '查詢結果整理自公開資料，僅供初步參考。公開資料可能存在更新延遲，仍建議與對方提供的文件或合約交叉確認。'}
              </p>
              {searchResult.helperText && results.length > 0 && (
                <p className="mt-sm text-sm text-neutral-600">{searchResult.helperText}</p>
              )}
            </div>
          )}

          {searchResult?.dataState === 'invalid_query' ? (
            <EmptyState
              title="請確認查詢內容"
              description={searchResult.apiMessage ?? '請輸入公司名稱、統一編號 / Business ID 或負責人。'}
              action={{
                label: '回到首頁',
                href: '/',
              }}
            />
          ) : results.length > 0 ? (
            <div className="space-y-lg">
              {results.map((company) => (
                <CompanyCard key={`${company.sourceKind ?? 'mock'}-${company.ban}`} company={company} />
              ))}
            </div>
          ) : query ? (
            <>
              {searchResult?.dataState === 'no_results' && searchResult.apiMessage && (
                <div className="mb-xl">
                  <NoticeBox type="info">
                    {searchResult.apiMessage}
                  </NoticeBox>
                </div>
              )}
              <EmptyState
                title={
                  isUnavailableState
                    ? '暫時無法顯示即時查詢結果'
                    : isParseErrorState
                      ? '公開資料暫時無法解析'
                      : isLiveEmptyState
                        ? '沒有找到相符的公司登記公開資料'
                        : '沒有找到相符的公開資料'
                }
                description={
                  searchResult?.helperText ??
                  '請確認公司名稱、統一編號或負責人是否正確。'
                }
                action={{
                  label: '回到首頁',
                  href: '/',
                }}
              />
            </>
          ) : (
            <EmptyState
              title="開始查詢"
              description="輸入公司名稱、統一編號 / Business ID、負責人或英文名稱，搜尋企業資訊。"
            />
          )}

          {query && (
            <div className="mt-xl text-center">
              <Link
                href="/"
                className="text-sm font-medium text-civic-blue hover:text-data-teal-text focus-ring rounded-base"
              >
                回到首頁重新查詢
              </Link>
            </div>
          )}

          <div className="mt-2xl">
            <DeeperCheckCTA />
          </div>
        </div>
      </section>
    </div>
  );
}
