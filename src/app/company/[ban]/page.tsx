'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CompanyInfoTable } from '@/components/CompanyInfoTable';
import { RiskSummary } from '@/components/RiskSummary';
import { SourceNote } from '@/components/SourceNote';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { getCompanyByBan } from '@/lib/mockCompanies';

interface CompanyDetailPageProps {
  params: {
    ban: string;
  };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const router = useRouter();
  const [company, setCompany] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const found = getCompanyByBan(params.ban);
      setCompany(found);
      setIsLoading(false);
    }, 300);
  }, [params.ban]);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleExportPDF = () => {
    alert('PDF 匯出功能開發中');
  };

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
              title="查無此公司"
              description={`找不到統一編號為 ${params.ban} 的公司記錄。`}
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
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-xl md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
                {company.nameZh}
              </h1>
              {company.nameEn && (
                <p className="text-lg text-neutral-600 mb-lg">
                  {company.nameEn}
                </p>
              )}
              <div className="flex flex-wrap gap-md items-center">
                <StatusBadge status={company.status} size="lg" />
                <span className="text-sm text-neutral-600">
                  統一編號: <span className="font-mono font-bold">{company.ban}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-md">
              <Button
                variant={isSaved ? 'secondary' : 'outline'}
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-md"
              >
                <Heart
                  size={20}
                  fill={isSaved ? 'currentColor' : 'none'}
                />
                {isSaved ? '已收藏' : '加入收藏'}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center gap-md"
              >
                <Download size={20} />
                匯出 PDF
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-2xl px-lg">
        <div className="max-w-4xl mx-auto space-y-2xl">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">基本資訊</h2>
            <CompanyInfoTable company={company} />
          </div>

          {/* Risk Summary */}
          <div>
            <h2 className="text-2xl font-bold text-main-ink mb-xl">查詢摘要</h2>
            <RiskSummary company={company} />
          </div>

          {/* Source Info */}
          <div>
            <SourceNote company={company} />
          </div>

          {/* Additional Resources */}
          <div className="pt-lg border-t-2 border-form-gray">
            <h3 className="text-lg font-semibold text-main-ink mb-lg">查看資料來源</h3>
            <div className="flex flex-wrap gap-md">
              <a
                href="https://findbiz.nat.gov.tw/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-sm px-lg py-md rounded-base bg-support-blue-gray text-civic-blue font-medium hover:bg-civic-blue hover:text-surface transition-colors focus-ring"
              >
                經濟部商業司
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
