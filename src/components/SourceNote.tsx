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
          <p className="mb-xs text-sm font-medium text-main-ink">本筆資料來源</p>
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
          <div className="space-y-xs text-xs leading-relaxed text-neutral-700">
            <p>
              {isRealData
                ? '本頁目前顯示的是此筆公開登記資料的整理解讀結果。'
                : '本頁目前使用示範資料呈現此筆公開登記資料的未來畫面。'}
            </p>
            <p className="text-neutral-600">
              This page shows an organized interpretation of this specific public registration record.
            </p>
            <p>
              本頁資料整理自經濟部商工登記公開資料。後續版本可能補上分公司資料、財政部稅籍交叉查詢與快取資料來源。查詢結果僅供初步參考，不等於法律、投資或交易建議。
            </p>
          </div>
          {/* TODO: Add MOEA company registration source link. */}
          {/* TODO: Add MOEA business registration source link. */}
          {/* TODO: Add branch registration source link. */}
          {/* TODO: Add MOEA keyword search source link. */}
          {/* TODO: Add MOF tax registration source link. */}
          {/* TODO: Add Supabase caching layer metadata. */}
        </div>
      </div>
    </div>
  );
};

export { SourceNote };
export type { SourceNoteProps };
