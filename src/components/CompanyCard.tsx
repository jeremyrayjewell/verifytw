'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Coins,
  FileText,
  MapPin,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Company } from '@/types/company';
import { getEntityTypeLabel } from '@/lib/companyDisplay';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, className }) => {
  return (
    <Link
      href={`/company/${company.ban}`}
      className={cn(
        'block p-xl rounded-base bg-surface border-2 border-form-gray',
        'hover:border-civic-blue hover:shadow-md',
        'transition-all duration-base',
        'group focus-ring',
        className
      )}
    >
      <article
        className={cn(
          'flex flex-col gap-lg'
        )}
      >
        <div className="flex items-start justify-between gap-lg">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-main-ink mb-xs group-hover:text-civic-blue transition-colors duration-base truncate">
              {company.nameZh}
            </h3>
            {company.nameEn && (
              <p className="text-sm text-neutral-600 truncate">
                {company.nameEn}
              </p>
            )}
          </div>
          <ArrowRight
            size={20}
            className="text-civic-blue flex-shrink-0 mt-xs opacity-0 group-hover:opacity-100 transition-opacity duration-base"
          />
        </div>

        <div className="flex flex-wrap items-center gap-md">
          <StatusBadge status={company.status} size="sm" />
          <span className="text-sm text-neutral-600">
            公司狀態：<span className="font-medium text-main-ink">{company.officialStatus}</span>
          </span>
        </div>

        <dl className="grid sm:grid-cols-2 gap-md text-sm">
          <div className="flex items-start gap-sm">
            <Building2 size={16} className="text-civic-blue mt-xs flex-shrink-0" />
            <div>
              <dt className="text-xs font-semibold text-neutral-600 tracking-wider">
                統一編號 / 類型
              </dt>
              <dd className="text-main-ink">
                {company.ban} ・ {getEntityTypeLabel(company.entityType)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-sm">
            <User size={16} className="text-civic-blue mt-xs flex-shrink-0" />
            <div>
              <dt className="text-xs font-semibold text-neutral-600 tracking-wider">
                負責人
              </dt>
              <dd className="text-main-ink">{company.representative}</dd>
            </div>
          </div>
          <div className="flex items-start gap-sm">
            <Coins size={16} className="text-civic-blue mt-xs flex-shrink-0" />
            <div>
              <dt className="text-xs font-semibold text-neutral-600 tracking-wider">
                資本額
              </dt>
              <dd className="text-main-ink">NT$ {company.capital}</dd>
            </div>
          </div>
          <div className="flex items-start gap-sm">
            <CalendarDays size={16} className="text-civic-blue mt-xs flex-shrink-0" />
            <div>
              <dt className="text-xs font-semibold text-neutral-600 tracking-wider">
                最後更新日期
              </dt>
              <dd className="text-main-ink">{company.lastUpdated}</dd>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-sm">
            <MapPin size={16} className="text-civic-blue mt-xs flex-shrink-0" />
            <div>
              <dt className="text-xs font-semibold text-neutral-600 tracking-wider">
                登記地址
              </dt>
              <dd className="text-main-ink line-clamp-2">{company.address}</dd>
            </div>
          </div>
          <div className="sm:col-span-2 flex items-start gap-sm">
            <FileText size={16} className="text-civic-blue mt-xs flex-shrink-0" />
            <div>
              <dt className="text-xs font-semibold text-neutral-600 tracking-wider">
                資料來源
              </dt>
              <dd className="text-main-ink">{company.source}</dd>
              <p className="mt-xs text-xs text-neutral-600">
                來源更新：{company.sourceUpdated}
                {company.fetchedAt ? ` ・ 查詢整理時間：${company.fetchedAt}` : ''}
              </p>
            </div>
          </div>
        </dl>

        <div className="flex items-center justify-between text-sm text-neutral-600 pt-md border-t border-form-gray">
          <span>核准設立日期：{company.establishedDate}</span>
          <span className="inline-flex items-center gap-sm font-medium text-civic-blue group-hover:text-data-teal-text transition-colors duration-base">
            查看完整資料
            <ArrowRight size={18} />
          </span>
        </div>
      </article>
    </Link>
  );
};

export { CompanyCard };
export type { CompanyCardProps };
