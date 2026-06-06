'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';

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
          <p className="text-sm text-main-ink mb-lg">
            {company.source}
          </p>
          <p className="text-xs text-neutral-700 leading-relaxed">
            本平台整理公開資料，協助你快速理解基本資訊；查詢結果不等於法律或投資建議。部分資訊可能因資料更新延遲而有所差異，建議與公司最新公告文件比對。
          </p>
        </div>
      </div>
    </div>
  );
};

export { SourceNote };
export type { SourceNoteProps };
