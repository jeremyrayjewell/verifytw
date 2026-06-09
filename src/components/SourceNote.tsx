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
  const isRealData = company.sourceKind === 'real';
  const fetchedAt = company.fetchedAt ?? MOCK_DATA_SYNC_DATE;

  return (
    <div
      className={cn('rounded-base border-2 border-civic-blue bg-support-blue-gray p-lg', className)}
      role="note"
    >
      <div className="flex gap-md">
        <Info size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
        <div className="flex-1">
          <p className="mb-xs text-sm font-medium text-main-ink">公開資料來源</p>
          <dl className="mb-lg space-y-sm text-sm text-main-ink">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                來源名稱
              </dt>
              <dd>{company.sourceNameZh}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                Source name
              </dt>
              <dd>{company.sourceNameEn}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                來源更新日期
              </dt>
              <dd>{company.sourceUpdated}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                查詢 / 整理時間
              </dt>
              <dd>{fetchedAt}</dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-neutral-700">
            {isRealData
              ? '本頁目前顯示的是公開資料整理解讀結果。'
              : '本頁目前使用示範資料呈現未來公開資料畫面。'}
            {/* TODO: Add MOEA company registration source link. */}
            {/* TODO: Add MOEA business registration source link. */}
            {/* TODO: Add branch registration source link. */}
            {/* TODO: Add MOEA keyword search source link. */}
            {/* TODO: Add MOF tax registration source link. */}
            {/* TODO: Add Supabase caching layer metadata. */}
            本頁資料整理自經濟部商工登記公開資料。後續版本可能補上分公司資料、財政部稅籍交叉查詢與快取資料來源。查詢結果僅供初步參考，不等於法律、投資或交易建議。
          </p>
        </div>
      </div>
    </div>
  );
};

export { SourceNote };
export type { SourceNoteProps };
