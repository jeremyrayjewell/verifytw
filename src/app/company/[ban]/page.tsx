import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  FileSearch,
  FileText,
  Landmark,
} from 'lucide-react';
import { CompanyInfoTable } from '@/components/CompanyInfoTable';
import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { MofTaxCrossCheck } from '@/components/MofTaxCrossCheck';
import { RiskSummary } from '@/components/RiskSummary';
import { SourceNote } from '@/components/SourceNote';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  getEntityTypeLabel,
  getEntityTypeLabelEn,
  getRegistrationSectionTitle,
  getRegistrationSectionTitleEn,
  getStatusFieldLabel,
} from '@/lib/companyDisplay';
import { getCompanyDetailByBan } from '@/lib/companyLookup';
import { getDemoMofTaxRecordByBusinessId } from '@/lib/mofTaxLookup';
import { validateBan } from '@/lib/validation';

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
      className="focus-ring inline-flex items-center gap-sm rounded-base px-md py-xs font-medium text-civic-blue transition-colors hover:text-data-teal-text"
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
          <div className="px-lg py-2xl">
            <div className="mx-auto max-w-[860px] space-y-xl">
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
                description="你可以稍後再次查詢，或回到查詢頁改用登記名稱或負責人搜尋。"
                action={{
                  label: '回到查詢頁',
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
        <div className="px-lg py-2xl">
          <div className="mx-auto max-w-[860px] space-y-xl">
            <BackLink />
            <EmptyState
              icon={<FileSearch size={48} className="text-form-gray" />}
              title={validBan ? '目前查無此統一編號資料' : '請確認統一編號格式'}
              description={
                validBan
                  ? `目前沒有找到統一編號 ${params.ban} 的公開資料或示範資料。建議回到查詢頁重新輸入，或改用登記名稱搜尋。`
                  : '統一編號應為 8 碼數字。你也可以回到查詢頁改用登記名稱或負責人搜尋。'
              }
              action={{
                label: '重新查詢',
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
  const demoMofTaxRecord = getDemoMofTaxRecordByBusinessId(company.ban);

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b-2 border-form-gray px-lg py-lg">
        <div className="mx-auto max-w-[860px]">
          <BackLink />
        </div>
      </div>

      <section className="border-b-2 border-form-gray bg-rice-paper px-lg py-2xl">
        <div className="mx-auto max-w-[860px] space-y-lg">
          {showRealNotice && (
            <NoticeBox type="info" title="資料來源">
              <div className="space-y-xs">
                <p>公開資料來源：經濟部商工登記公開資料</p>
                <p className="text-xs text-neutral-600">
                  Currently showing {company.sourceNameEn}.
                </p>
              </div>
            </NoticeBox>
          )}

          {showMockNotice && (
            <NoticeBox type="info" title="原型說明">
              <div className="space-y-xs">
                <p>目前為示範資料，尚未連接完整政府公開資料 API。</p>
                {lookup.apiMessage && <p>暫時無法取得公開資料，請稍後再試。</p>}
                <p className="text-xs text-neutral-600">
                  Demo data only. Public-data APIs are not fully connected yet.
                </p>
              </div>
            </NoticeBox>
          )}

          <div className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl">
            <div className="flex flex-col gap-xl">
              <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="mb-sm text-sm font-medium text-data-teal-text">公開資料查詢報告</p>
                  <p className="mb-sm text-xs text-neutral-600">Public record lookup report</p>
                  <div className="mb-md inline-flex items-center rounded-full border border-form-gray bg-rice-paper px-md py-xs text-sm font-medium text-main-ink">
                    {getEntityTypeLabel(company.entityType)} / {getEntityTypeLabelEn(company.entityType)}
                  </div>
                  <h1 className="mb-md text-3xl font-bold text-main-ink md:text-4xl">
                    {company.nameZh}
                  </h1>
                  {company.nameEn && (
                    <p className="break-words text-lg text-neutral-600">{company.nameEn}</p>
                  )}
                </div>
                <div className="md:flex-shrink-0">
                  <StatusBadge status={company.status} size="lg" />
                </div>
              </div>

              <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <Landmark size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      統一編號
                    </p>
                    <p className="text-base font-semibold text-main-ink">{company.ban}</p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <FileText size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      {getStatusFieldLabel()}
                    </p>
                    <p className="text-base font-semibold text-main-ink">
                      {company.officialStatus}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <Landmark size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      登記類型
                    </p>
                    <p className="text-base font-semibold text-main-ink">
                      {getEntityTypeLabel(company.entityType)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <CalendarDays size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                      最後更新日期
                    </p>
                    <p className="text-base font-semibold text-main-ink">{company.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-lg py-2xl">
        <div className="mx-auto max-w-[860px] space-y-2xl">
          <div>
            <h2 className="mb-xl text-2xl font-bold text-main-ink">
              {getRegistrationSectionTitle()}
            </h2>
            <p className="mb-lg text-sm text-neutral-600">{getRegistrationSectionTitleEn()}</p>
            <CompanyInfoTable company={company} />
          </div>

          <div>
            <h2 className="mb-xl text-2xl font-bold text-main-ink">查證摘要</h2>
            <p className="mb-lg text-sm text-neutral-600">Lookup summary</p>
            <RiskSummary company={company} />
          </div>

          {demoMofTaxRecord && <MofTaxCrossCheck record={demoMofTaxRecord} />}

          <div>
            <h2 className="mb-xl text-2xl font-bold text-main-ink">本筆資料來源</h2>
            <p className="mb-lg text-sm text-neutral-600">Source for this record</p>
            <SourceNote company={company} />
          </div>

          <div>
            <h2 className="mb-xl text-2xl font-bold text-main-ink">注意事項</h2>
            <p className="mb-lg text-sm text-neutral-600">Important notes</p>
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
              If you need to compare public records with a website, email, contract, payment details,
              or other documents, request a manual check.
            </p>
            <DeeperCheckCTA />
          </div>

          <div className="border-t-2 border-form-gray pt-lg">
            <h3 className="mb-lg text-lg font-semibold text-main-ink">延伸參考</h3>
            <p className="mb-lg text-sm text-neutral-600">References</p>
            <div className="flex flex-wrap gap-md">
              <a
                href="https://findbiz.nat.gov.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-sm rounded-base bg-support-blue-gray px-lg py-md font-medium text-civic-blue transition-colors hover:bg-civic-blue hover:text-surface"
              >
                商工登記公示查詢
                <ExternalLink size={16} />
              </a>
              <a
                href="https://www.moea.gov.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex items-center gap-sm rounded-base bg-support-blue-gray px-lg py-md font-medium text-civic-blue transition-colors hover:bg-civic-blue hover:text-surface"
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
