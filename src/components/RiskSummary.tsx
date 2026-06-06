'use client';

import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';

interface RiskSummaryProps {
  company: Company;
  className?: string;
}

const generateSummaryPoints = (company: Company): { text: string; positive: boolean }[] => {
  const points = [];

  // Always show status confirmation
  points.push({
    text: '目前公開資料顯示此公司為核准設立。',
    positive: company.status === '資料相符' || company.status === '資料取得中',
  });

  // Check name matching
  points.push({
    text: '公司名稱與統一編號可對應。',
    positive: company.status !== '無公開資料',
  });

  // Address verification
  if (company.flags?.includes('address_not_verified')) {
    points.push({
      text: '公司登記地址與實際營業地點可能不同，建議與對方提供的地址交叉確認。',
      positive: false,
    });
  }

  // Recent changes
  if (company.flags?.includes('recent_address_change')) {
    points.push({
      text: '最近期公開資料顯示此公司有異動紀錄，建議進一步確認。',
      positive: false,
    });
  }

  // Tax data
  if (company.flags?.includes('missing_tax_data')) {
    points.push({
      text: '目前尚未取得完整的稅務登記資訊，可能為新登記或已停業。',
      positive: false,
    });
  }

  // Generic confirmation
  if (points.length === 2) {
    points.push({
      text: '部分資訊仍建議與對方提供的文件交叉確認。',
      positive: true,
    });
  }

  return points;
};

const RiskSummary: React.FC<RiskSummaryProps> = ({ company, className }) => {
  const points = generateSummaryPoints(company);

  return (
    <div className={cn('rounded-base bg-rice-paper border-2 border-form-gray p-xl', className)}>
      <h3 className="text-lg font-semibold text-main-ink mb-lg">查詢摘要</h3>
      <div className="space-y-md">
        {points.map((point, idx) => (
          <div key={idx} className="flex gap-md">
            {point.positive ? (
              <CheckCircle
                size={20}
                className="text-emerald-600 flex-shrink-0 mt-xs"
              />
            ) : (
              <AlertCircle
                size={20}
                className="text-orange-600 flex-shrink-0 mt-xs"
              />
            )}
            <p className="text-sm text-neutral-700 flex-1">{point.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RiskSummary };
export type { RiskSummaryProps };
