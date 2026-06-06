'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';

import { getEntityTypeLabel } from '@/lib/companyDisplay';

interface CompanyInfoTableProps {
  company: Company;
  className?: string;
}

const CompanyInfoTable: React.FC<CompanyInfoTableProps> = ({
  company,
  className,
}) => {
  const rows = [
    { label: '統一編號', value: company.ban },
    {
      label: '公司狀態',
      value: company.status,
    },
    { label: '公司名稱', value: company.nameZh },
    { label: '英文名稱', value: company.nameEn || '-' },
    { label: '登記類型', value: getEntityTypeLabel(company.entityType) },
    { label: '負責人', value: company.representative },
    { label: '資本額', value: `NT$ ${company.capital}` },
    { label: '登記地址', value: company.address },
    { label: '核准設立日期', value: company.establishedDate },
    { label: '最後更新', value: company.lastUpdated },
  ];

  return (
    <div className={cn('rounded-base border-2 border-form-gray overflow-hidden', className)}>
      <table className="w-full">
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                'border-b border-form-gray',
                idx % 2 === 0 ? 'bg-surface' : 'bg-rice-paper'
              )}
            >
              <td className="px-lg py-lg align-top font-semibold text-main-ink text-sm w-32 md:w-44 md:min-w-max">
                {row.label}
              </td>
              <td className="px-lg py-lg align-top text-neutral-700 text-sm leading-relaxed break-words">
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
