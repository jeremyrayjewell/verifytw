'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';
import { MOCK_DATA_SYNC_DATE } from '@/lib/mockCompanies';

interface SourceNoteProps {
  company: Company;
  className?: string;
}

const SourceNote: React.FC<SourceNoteProps> = ({ company, className }) => {
  return (
    <div
      className={cn(
        'rounded-base bg-support-blue-gray border-2 border-civic-blue p-lg',
        className
      )}
      role="note"
    >
      <div className="flex gap-md">
        <Info size={18} className="text-civic-blue flex-shrink-0 mt-xs" />
        <div className="flex-1">
          <p className="text-sm font-medium text-main-ink mb-xs">資料來源</p>
          <dl className="space-y-sm mb-lg text-sm text-main-ink">
            <div>
              <dt className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">來源名稱</dt>
              <dd>{company.source}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">來源更新日期</dt>
              <dd>{company.sourceUpdated}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">查詢 / 整理時間</dt>
              <dd>{MOCK_DATA_SYNC_DATE}</dd>
            </div>
          </dl>
          <p className="text-xs text-neutral-700 leading-relaxed">
            本頁目前使用示範資料呈現未來公開資料畫面。
            {/* TODO: Add MOEA company registration source link. */}
            {/* TODO: Add MOEA keyword search source link. */}
            {/* TODO: Add MOF tax registration source link. */}
            正式串接時，將補上經濟部商工登記、財政部稅籍與快取資料來源；查詢結果僅供初步參考，不等於法律、投資或交易建議。
          </p>
        </div>
      </div>
    </div>
  );
};

export { SourceNote };
export type { SourceNoteProps };
