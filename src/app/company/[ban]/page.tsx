import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileSearch,
  FileText,
  Landmark,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CompanyInfoTable } from '@/components/CompanyInfoTable';
import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { RiskSummary } from '@/components/RiskSummary';
import { SourceNote } from '@/components/SourceNote';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { validateBan } from '@/lib/validation';
import { getEntityTypeLabel } from '@/lib/companyDisplay';
import { getCompanyDetailByBan } from '@/lib/companyLookup';

export const dynamic = 'force-dynamic';

interface CompanyDetailPageProps {
  params: {
    ban: string;
  };
}

function BackLink() {
  return (
    <Link
      href="/search"
      className="inline-flex items-center gap-sm text-civic-blue font-medium hover:text-data-teal-text transition-colors focus-ring rounded-base px-md py-xs"
    >
      <ArrowLeft size={20} />
      返回查詢
    </Link>
  );
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const lookup = await getCompanyDetailByBan(params.ban);
  const validBan = validateBan(params.ban).success;

  if (!lookup.company) {
    if (lookup.dataState === 'api_unavailable') {
      return (
        <div className="min-h-screen bg-surface">
          <div className="py-2xl px-lg">
            <div className="max-w-[860px] mx-auto space-y-xl">
              <BackLink />
              <NoticeBox type="warning" title="公開資料暫時無法取得">
                <div className="space-y-sm">
                  <p>{lookup.apiMessage ?? '暫時無法取得公開資料，請稍後再試。'}</p>
                  <p>目前此統一編號也沒有對應的示範資料，因此暫時無法顯示報告內容。</p>
                </div>
              </NoticeBox>
              <EmptyState
                icon={<FileSearch size={48} className="text-form-gray" />}
                title="暫時無法顯示查詢結果"
                description="你可以稍後再次查詢，或回到查詢頁改用公司名稱、負責人或英文名稱搜尋。"
                action={{
                  label: '回到查詢頁',
                  onClick: undefined,
                  href: '/',
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-surface">
        <div className="py-2xl px-lg">
          <div className="max-w-[860px] mx-auto space-y-xl">
            <BackLink />
            <EmptyState
              icon={<FileSearch size={48} className="text-form-gray" />}
              title={validBan ? '目前查無此統一編號資料' : '請確認統一編號格式'}
              description={
                validBan
                  ? `目前沒有找到統一編號 ${params.ban} 的公開資料或示範資料。建議回到查詢頁重新輸入，或改用公司名稱搜尋。`
                  : '統一編號應為 8 碼數字。你也可以回到查詢頁改用公司名稱、負責人或英文名稱搜尋。'
              }
              action={{
                label: '重新查詢',
                onClick: undefined,
                href: '/search',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  const company = lookup.company;
  const showMockNotice = lookup.dataState === 'mock';
  const showRealNotice = lookup.dataState === 'real';

  return (
    <div className="min-h-screen bg-surface">
      <div className="py-lg px-lg border-b-2 border-form-gray">
        <div className="max-w-[860px] mx-auto">
          <BackLink />
        </div>
      </div>

      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-[860px] mx-auto space-y-lg">
          {showRealNotice && (
            <NoticeBox type="info" title="公開資料來源">
              <div className="space-y-xs">
                <p>公開資料來源：經濟部商工登記公開資料</p>
                <p className="text-xs text-neutral-600">目前顯示為即時查詢整理解讀結果，查詢結果僅供初步參考。</p>
              </div>
            </NoticeBox>
          )}

          {showMockNotice && (
            <NoticeBox type="info" title="原型說明">
              <div className="space-y-xs">
                <p>目前為示範資料，尚未連接政府公開資料 API。</p>
                {lookup.apiMessage && (
                  <p>暫時無法取得公開資料，請稍後再試。</p>
                )}
                <p className="text-xs text-neutral-600">Demo data only. Public-data APIs are not connected yet.</p>
              </div>
            </NoticeBox>
          )}

          <div className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl">
            <div className="flex flex-col gap-xl">
              <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-data-teal-text mb-sm">
                    公開資料查詢報告
                  </p>
                  <p className="text-xs text-neutral-600 mb-sm">Public record lookup report</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
                    {company.nameZh}
                  </h1>
                  {company.nameEn && (
                    <p className="text-lg text-neutral-600 break-words">
                      {company.nameEn}
                    </p>
                  )}
                </div>
                <div className="md:flex-shrink-0">
                  <StatusBadge status={company.status} size="lg" />
                </div>
              </div>

              <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <Landmark size={18} className="text-civic-blue mt-xs flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">統一編號</p>
                    <p className="text-base text-main-ink font-semibold">{company.ban}</p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <FileText size={18} className="text-civic-blue mt-xs flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">公司狀態</p>
                    <p className="text-base text-main-ink font-semibold">{company.officialStatus}</p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <Landmark size={18} className="text-civic-blue mt-xs flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">登記類型</p>
                    <p className="text-base text-main-ink font-semibold">{getEntityTypeLabel(company.entityType)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <CalendarDays size={18} className="text-civic-blue mt-xs flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">最後更新日期</p>
                    <p className="text-base text-main-ink font-semibold">{company.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-2xl px-lg">
        <div className="max-w-[860px] mx-auto space-y-2xl">
          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">公司基本資料</h2>
            <p className="text-sm text-neutral-600 mb-lg">Basic company information</p>
            <CompanyInfoTable company={company} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">查證摘要</h2>
            <p className="text-sm text-neutral-600 mb-lg">Lookup summary</p>
            <RiskSummary company={company} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">公開資料來源</h2>
            <p className="text-sm text-neutral-600 mb-lg">Public data source</p>
            <SourceNote company={company} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">注意事項</h2>
            <p className="text-sm text-neutral-600 mb-lg">Important notes</p>
            <NoticeBox type="info" title="使用提醒">
              <div className="space-y-sm">
                <p>查詢結果僅供初步參考。</p>
                <p>本平台不提供法律、投資或交易建議。</p>
                <p>公開資料可能存在更新延遲。</p>
                <p>請與對方提供的文件、合約或付款資訊交叉確認。</p>
              </div>
            </NoticeBox>
          </div>

          <div className="space-y-md">
            <p className="text-sm text-neutral-700">
              如果你需要比對對方提供的網站、Email、合約、付款資訊或其他文件，可申請人工查證。
            </p>
            <p className="text-xs text-neutral-600">
              If you need to compare public records with a website, email, contract, payment details, or other documents, request a manual check.
            </p>
            <DeeperCheckCTA />
          </div>

          <div className="pt-lg border-t-2 border-form-gray">
            <h3 className="text-lg font-semibold text-main-ink mb-lg">延伸參考</h3>
            <p className="text-sm text-neutral-600 mb-lg">References</p>
            <div className="flex flex-wrap gap-md">
              <a
                href="https://findbiz.nat.gov.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-sm px-lg py-md rounded-base bg-support-blue-gray text-civic-blue font-medium hover:bg-civic-blue hover:text-surface transition-colors focus-ring"
              >
                商工登記公示查詢
                <ExternalLink size={16} />
              </a>
              <a
                href="https://www.moea.gov.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-sm px-lg py-md rounded-base bg-support-blue-gray text-civic-blue font-medium hover:bg-civic-blue hover:text-surface transition-colors focus-ring"
              >
                經濟部
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
