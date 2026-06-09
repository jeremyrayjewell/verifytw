'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';
import {
  getEntityTypeLabel,
  getNameFieldLabel,
  getNameFieldLabelEn,
  getStatusFieldLabel,
  getStatusFieldLabelEn,
} from '@/lib/companyDisplay';

interface CompanyInfoTableProps {
  company: Company;
  className?: string;
}

const CompanyInfoTable: React.FC<CompanyInfoTableProps> = ({ company, className }) => {
  const rows = [
    { label: '統一編號', labelEn: 'Business ID', value: company.ban },
    { label: getNameFieldLabel(company.entityType), labelEn: getNameFieldLabelEn(), value: company.nameZh },
    { label: '英文名稱', labelEn: 'English name', value: company.nameEn || '未提供 / Not provided' },
    { label: getStatusFieldLabel(), labelEn: getStatusFieldLabelEn(), value: company.officialStatus },
    { label: '登記類型', labelEn: 'Entity type', value: getEntityTypeLabel(company.entityType) },
    { label: '負責人', labelEn: 'Responsible person', value: company.representative },
    { label: '資本額 / 登記資本', labelEn: 'Capital / registered funds', value: `NT$ ${company.capital}` },
    { label: '登記地址', labelEn: 'Registered address', value: company.address },
    { label: '設立 / 核准日期', labelEn: 'Established / approval date', value: company.establishedDate },
    { label: '最後更新', labelEn: 'Last updated', value: company.lastUpdated },
  ];

  return (
    <div className={cn('overflow-hidden rounded-base border-2 border-form-gray', className)}>
      <table className="w-full">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={`${row.label}-${idx}`}
              className={cn('border-b border-form-gray', idx % 2 === 0 ? 'bg-surface' : 'bg-rice-paper')}
            >
              <td className="w-32 px-lg py-lg align-top text-sm font-semibold text-main-ink md:w-44 md:min-w-max">
                {row.label}
                <p className="mt-xs text-xs font-normal text-neutral-600">{row.labelEn}</p>
              </td>
              <td className="break-words px-lg py-lg align-top text-sm leading-relaxed text-neutral-700">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { CompanyInfoTable };
export type { CompanyInfoTableProps };
