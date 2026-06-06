'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { Company } from '@/types/company';

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
    { label: '公司名稱 (中文)', value: company.nameZh },
    { label: '公司名稱 (英文)', value: company.nameEn || '-' },
    { label: '代表人', value: company.representative },
    { label: '公司地址', value: company.address },
    { label: '資本額', value: `NT$ ${company.capital}` },
    { label: '設立日期', value: company.establishedDate },
    { label: '登記狀態', value: company.status },
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
              <td className="px-lg py-md font-semibold text-main-ink text-sm w-32 md:w-auto md:min-w-max">
                {row.label}
              </td>
              <td className="px-lg py-md text-neutral-700 text-sm">
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
