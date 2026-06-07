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

  return (
    <div className="min-h-screen bg-surface">
      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-main-ink mb-lg">查詢企業資訊</h1>
          <p className="text-sm text-neutral-600 mb-lg">Search company information</p>
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
                  <p className="text-xs text-neutral-600">Live data is unavailable; showing demo/local results where available.</p>
                  {searchResult.apiMessage && (
                    <p className="text-xs text-neutral-600">{searchResult.apiMessage}</p>
                  )}
                </div>
              </NoticeBox>
            </div>
          )}

          {query && searchResult?.resultState === 'live_timeout' && (
            <div className="mt-lg">
              <NoticeBox type="info" title="查詢逾時">
                <div className="space-y-xs">
                  <p>即時公開資料回應較慢，請稍後再試，或改用統一編號查詢。</p>
                  <p className="text-xs text-neutral-600">
                    Public-data response is slow. Try again later or use the 8-digit Business ID.
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
                查詢 / Search：「<span className="font-medium text-main-ink">{searchResult.query}</span>」
              </p>
              <p className="text-base text-main-ink font-semibold">
                找到 {results.length} 筆結果
              </p>
              <p className="text-sm text-neutral-600">{results.length} result(s) found</p>
              <p className="mt-sm text-sm text-neutral-600">
                {filterType === 'recent'
                  ? '結果依最近更新資訊排序，方便先查看近期異動的公開資料。'
                  : '查詢結果整理自公開資料，僅供初步參考。公開資料可能存在更新延遲，仍建議與對方提供的文件或合約交叉確認。'}
              </p>
              {searchResult.searchNotes && searchResult.searchNotes.length > 0 && (
                <div className="mt-sm space-y-xs">
                  {searchResult.searchNotes.map((note) => (
                    <p key={note} className="text-sm text-neutral-600">{note}</p>
                  ))}
                </div>
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
                  searchResult?.resultState === 'live_timeout'
                    ? '即時公開資料回應較慢'
                    : searchResult?.resultState === 'parse_error'
                      ? '公開資料回應格式暫時無法讀取'
                      : searchResult?.resultState === 'live_zero_results'
                        ? '沒有找到相符的公司登記公開資料'
                        : searchResult?.resultState === 'live_unavailable'
                          ? '暫時無法顯示即時查詢結果'
                          : '沒有找到相符的公開資料'
                }
                description={
                  searchResult?.resultState === 'live_zero_results'
                    ? '可能原因包括：使用了簡稱、登記名稱不同、資料尚未更新，或目前查詢範圍尚未涵蓋。'
                    : searchResult?.resultState === 'live_timeout'
                      ? '建議稍後再試，或直接改用 8 碼統一編號查詢。'
                      : searchResult?.resultState === 'parse_error'
                        ? '請稍後再試，或改用統一編號查詢。'
                      : searchResult?.helperText ??
                        '請確認公司名稱、統一編號或負責人是否正確。'
                }
                action={{
                  label: '回到首頁',
                  href: '/',
                }}
              />
              {searchResult?.resultState === 'live_zero_results' && (
                <div className="mt-lg space-y-xs text-center">
                  <p className="text-sm text-neutral-600">
                    建議改用完整公司登記名稱或統一編號查詢。
                  </p>
                  <p className="text-sm text-neutral-600">
                    No matching company-registration record found.
                  </p>
                </div>
              )}
              {searchResult?.searchNotes && searchResult.searchNotes.length > 0 && (
                <div className="mt-lg space-y-xs text-center">
                  {searchResult.searchNotes.map((note) => (
                    <p key={note} className="text-sm text-neutral-600">{note}</p>
                  ))}
                </div>
              )}
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
