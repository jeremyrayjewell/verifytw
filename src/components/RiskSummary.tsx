'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';

interface RiskSummaryProps {
  company: Company;
  className?: string;
}

const generateSummaryPoints = (company: Company): { text: string; positive: boolean }[] => {
  const points: { text: string; positive: boolean }[] = [];

  points.push({
    text:
      company.status === '資料相符'
        ? `目前公開資料顯示此登記資料為「${company.officialStatus}」。`
        : company.statusLabel,
    positive: company.status === '資料相符' || company.status === '資料取得中',
  });

  points.push({
    text: '登記名稱與統一編號可對應。',
    positive: company.status !== '無公開資料',
  });

  if (company.flags?.includes('address_not_verified')) {
    points.push({
      text: '登記地址與實際營業地點可能不同，建議與對方提供的地址交叉確認。',
      positive: false,
    });
  }

  if (company.flags?.includes('recent_address_change')) {
    points.push({
      text: '最近期公開資料顯示此登記有異動紀錄，建議進一步確認。',
      positive: false,
    });
  }

  if (company.flags?.includes('missing_tax_data')) {
    points.push({
      text: '目前尚未取得完整的稅務登記資訊，建議稍後再查詢並與對方提供的資料交叉確認。',
      positive: false,
    });
  }

  if (points.length === 2) {
    points.push({
      text: '部分資訊仍建議與對方提供的文件、合約或付款資訊交叉確認。',
      positive: false,
    });
  }

  return points;
};

const RiskSummary: React.FC<RiskSummaryProps> = ({ company, className }) => {
  const points = generateSummaryPoints(company);

  return (
    <div className={cn('rounded-base border-2 border-form-gray bg-rice-paper p-xl', className)}>
      <h3 className="mb-lg text-lg font-semibold text-main-ink">查詢摘要</h3>
      <div className="space-y-md">
        {points.map((point, idx) => (
          <div key={idx} className="flex gap-md">
            {point.positive ? (
              <CheckCircle size={20} className="mt-xs flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="mt-xs flex-shrink-0 text-orange-600" />
            )}
            <p className="flex-1 text-sm text-neutral-700">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RiskSummary };
export type { RiskSummaryProps };
