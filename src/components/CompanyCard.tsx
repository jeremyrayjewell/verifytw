'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeInfo,
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
import { getEntityTypeLabel, getStatusFieldLabel } from '@/lib/companyDisplay';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, className }) => {
  return (
    <Link
      href={`/company/${company.ban}`}
      className={cn(
        'block rounded-base border-2 border-form-gray bg-surface p-xl',
        'group transition-all duration-base hover:border-civic-blue hover:shadow-md',
        'focus-ring',
        className
      )}
    >
      <article className="flex flex-col gap-lg">
        <div className="flex items-start justify-between gap-lg">
          <div className="min-w-0 flex-1">
            <div className="mb-sm inline-flex items-center gap-xs rounded-full border border-civic-blue/20 bg-support-blue-gray px-sm py-xs text-xs font-medium text-civic-blue">
              <BadgeInfo size={14} />
              {company.entityTypeLabelZh} / {company.entityTypeLabelEn}
            </div>
            <h3 className="mb-xs truncate text-lg font-semibold text-main-ink transition-colors duration-base group-hover:text-civic-blue">
              {company.nameZh}
            </h3>
            {company.nameEn && <p className="truncate text-sm text-neutral-600">{company.nameEn}</p>}
          </div>
          <ArrowRight
            size={20}
            className="mt-xs flex-shrink-0 text-civic-blue opacity-0 transition-opacity duration-base group-hover:opacity-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-md">
          <StatusBadge status={company.status} size="sm" />
          <span className="text-sm text-neutral-600">
            {getStatusFieldLabel()} / Registration status：
            <span className="font-medium text-main-ink"> {company.officialStatus}</span>
          </span>
        </div>

        <dl className="grid gap-md text-sm sm:grid-cols-2">
          <div className="flex items-start gap-sm">
            <Building2 size={16} className="mt-xs flex-shrink-0 text-civic-blue" />
            <div>
              <dt className="text-xs font-semibold tracking-wider text-neutral-600">
                統一編號 / Business ID
              </dt>
              <dd className="text-main-ink">
                {company.ban} ・ {getEntityTypeLabel(company.entityType)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-sm">
            <User size={16} className="mt-xs flex-shrink-0 text-civic-blue" />
            <div>
              <dt className="text-xs font-semibold tracking-wider text-neutral-600">
                負責人 / Responsible person
              </dt>
              <dd className="text-main-ink">{company.representative}</dd>
            </div>
          </div>
          <div className="flex items-start gap-sm">
            <Coins size={16} className="mt-xs flex-shrink-0 text-civic-blue" />
            <div>
              <dt className="text-xs font-semibold tracking-wider text-neutral-600">
                資本額 / Capital
              </dt>
              <dd className="text-main-ink">NT$ {company.capital}</dd>
            </div>
          </div>
          <div className="flex items-start gap-sm">
            <CalendarDays size={16} className="mt-xs flex-shrink-0 text-civic-blue" />
            <div>
              <dt className="text-xs font-semibold tracking-wider text-neutral-600">
                最後更新日期 / Last updated
              </dt>
              <dd className="text-main-ink">{company.lastUpdated}</dd>
            </div>
          </div>
          <div className="flex items-start gap-sm sm:col-span-2">
            <MapPin size={16} className="mt-xs flex-shrink-0 text-civic-blue" />
            <div>
              <dt className="text-xs font-semibold tracking-wider text-neutral-600">
                登記地址 / Registered address
              </dt>
              <dd className="line-clamp-2 text-main-ink">{company.address}</dd>
            </div>
          </div>
          <div className="flex items-start gap-sm sm:col-span-2">
            <FileText size={16} className="mt-xs flex-shrink-0 text-civic-blue" />
            <div>
              <dt className="text-xs font-semibold tracking-wider text-neutral-600">
                公開資料來源 / Public data source
              </dt>
              <dd className="text-main-ink">{company.sourceNameZh}</dd>
              <p className="mt-xs text-xs text-neutral-600">
                來源更新 / Source updated：{company.sourceUpdated}
                {company.fetchedAt ? ` ・ 查詢整理時間 / Checked at：${company.fetchedAt}` : ''}
              </p>
            </div>
          </div>
        </dl>

        <div className="flex items-center justify-between border-t border-form-gray pt-md text-sm text-neutral-600">
          <span>核准設立日期 / Established：{company.establishedDate}</span>
          <span className="inline-flex items-center gap-sm font-medium text-civic-blue transition-colors duration-base group-hover:text-data-teal-text">
            查看完整資料 / View full record
            <ArrowRight size={18} />
          </span>
        </div>
      </article>
    </Link>
  );
};

export { CompanyCard };
export type { CompanyCardProps };
