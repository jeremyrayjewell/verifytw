'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import { RiskSummary } from '@/components/RiskSummary';
import { SourceNote } from '@/components/SourceNote';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { getCompanyByBan } from '@/lib/mockCompanies';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { validateBan } from '@/lib/validation';
import type { Company } from '@/types/company';
import { getEntityTypeLabel } from '@/lib/companyDisplay';

interface CompanyDetailPageProps {
  params: {
    ban: string;
  };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const router = useRouter();
  const [company, setCompany] = React.useState<Company | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // TODO: Replace with MOEA BAN lookup + MOF data enrichment from Supabase cache.
    setTimeout(() => {
      const found = getCompanyByBan(params.ban);
      setCompany(found ?? null);
      setIsLoading(false);
    }, 300);
  }, [params.ban]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="py-2xl px-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-sm text-civic-blue font-medium mb-2xl hover:text-data-teal-text transition-colors focus-ring"
            >
              <ArrowLeft size={20} />
              返回
            </button>
            <div className="space-y-lg">
              <LoadingSkeleton className="h-24" />
              <LoadingSkeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    const validBan = validateBan(params.ban).success;

    return (
      <div className="min-h-screen bg-surface">
        <div className="py-2xl px-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-sm text-civic-blue font-medium mb-2xl hover:text-data-teal-text transition-colors focus-ring"
            >
              <ArrowLeft size={20} />
              返回
            </button>
            <EmptyState
              icon={<FileSearch size={48} className="text-form-gray" />}
              title={validBan ? '目前查無此統一編號資料' : '請確認統一編號格式'}
              description={
                validBan
                  ? `目前沒有找到統一編號 ${params.ban} 的示範資料。建議回到查詢頁重新輸入，或改用公司名稱搜尋。`
                  : '統一編號應為 8 碼數字。你也可以回到查詢頁改用公司名稱、負責人或英文名稱搜尋。'
              }
              action={{
                label: '重新查詢',
                onClick: () => router.push('/search'),
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Back Button */}
      <div className="py-lg px-lg border-b-2 border-form-gray">
        <div className="max-w-[860px] mx-auto">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-sm text-civic-blue font-medium hover:text-data-teal-text transition-colors focus-ring rounded-base px-md py-xs"
          >
            <ArrowLeft size={20} />
            返回
          </button>
        </div>
      </div>

      {/* Company Header */}
      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-[860px] mx-auto space-y-lg">
          <NoticeBox type="info" title="原型說明">
            <div className="space-y-xs">
              <p>目前為示範資料，尚未連接政府公開資料 API。</p>
              <p className="text-xs text-neutral-600">Demo data only. Public-data APIs are not connected yet.</p>
            </div>
          </NoticeBox>
          <div className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl">
            <div className="flex flex-col gap-xl">
              <div className="flex flex-col gap-lg md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-data-teal-text mb-sm">
                  公開資料查詢報告
                  </p>
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
                  <StatusBadge status={company.status} size="sm" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">公司狀態</p>
                    <p className="text-base text-main-ink font-semibold">{company.status}</p>
                  </div>
                </div>
                <div className="flex items-start gap-sm rounded-base border border-form-gray bg-rice-paper p-lg">
                  <FileText size={18} className="text-civic-blue mt-xs flex-shrink-0" />
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

      {/* Content Sections */}
      <section className="py-2xl px-lg">
        <div className="max-w-[860px] mx-auto space-y-2xl">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">公司基本資料</h2>
            <CompanyInfoTable company={company} />
          </div>

          {/* Risk Summary */}
          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">查證摘要</h2>
            <RiskSummary company={company} />
          </div>

          {/* Source Info */}
          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">公開資料來源</h2>
            <SourceNote company={company} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">注意事項</h2>
            <NoticeBox type="info" title="使用提醒">
              <div className="space-y-sm">
                <p>查詢結果僅供初步參考。</p>
                <p>本平台不提供法律、投資或交易建議。</p>
                <p>公開資料可能存在更新延遲。</p>
                <p>請與對方提供的文件、合約或付款資訊交叉確認。</p>
              </div>
            </NoticeBox>
          </div>

          {/* Additional Resources */}
          <div className="pt-lg border-t-2 border-form-gray">
            <h3 className="text-lg font-semibold text-main-ink mb-lg">延伸參考</h3>
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
