'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { Company } from '@/types/company';

interface CompanyCardProps {
  company: Company;
  className?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, className }) => {
  return (
    <Link href={`/company/${company.ban}`}>
      <div
        className={cn(
          'p-xl rounded-base bg-surface border-2 border-form-gray',
          'hover:border-civic-blue hover:shadow-md',
          'transition-all duration-base',
          'group cursor-pointer focus-within:ring-2 focus-within:ring-civic-blue focus-within:ring-offset-2',
          className
        )}
      >
        <div className="flex items-start justify-between gap-lg mb-md">
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

        <div className="mb-md">
          <StatusBadge status={company.status} size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-lg text-sm mb-lg">
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              統一編號
            </p>
            <p className="text-base text-main-ink font-medium mt-xs">
              {company.ban}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              負責人
            </p>
            <p className="text-base text-main-ink font-medium mt-xs">
              {company.representative}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              公司地址
            </p>
            <p className="text-sm text-main-ink mt-xs line-clamp-2">
              {company.address}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-600 pt-md border-t border-form-gray">
          <span>設立: {company.establishedDate}</span>
          <span>更新: {company.lastUpdated}</span>
        </div>
      </div>
    </Link>
  );
};

export { CompanyCard };
export type { CompanyCardProps };
