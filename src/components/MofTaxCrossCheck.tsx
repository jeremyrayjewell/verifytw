'use client';

import React from 'react';
import { Building2, FileText, MapPin, Receipt, Shapes, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NormalizedMofTaxRegistrationRecord } from '@/lib/sources/mof';
import { getDemoMofTaxIndexMetadata } from '@/lib/mofTaxLookup';

interface MofTaxCrossCheckProps {
  record: NormalizedMofTaxRegistrationRecord;
  className?: string;
}

function formatCapitalAmount(value?: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '未提供 / Not provided';
  }

  return `NT$ ${value.toLocaleString('en-US')}`;
}

function formatUniformInvoice(value?: 'Y' | 'N'): string {
  if (value === 'Y') {
    return '是 / Yes';
  }

  if (value === 'N') {
    return '否 / No';
  }

  return '未提供 / Not provided';
}

const MofTaxCrossCheck: React.FC<MofTaxCrossCheckProps> = ({ record, className }) => {
  const metadata = getDemoMofTaxIndexMetadata();

  const items = [
    {
      icon: Building2,
      label: '稅籍登記名稱',
      labelEn: 'Tax registration name',
      value: record.taxRegistrationName || '未提供 / Not provided',
    },
    {
      icon: MapPin,
      label: '稅籍登記地址',
      labelEn: 'Tax registration address',
      value: record.taxRegistrationAddress || '未提供 / Not provided',
    },
    {
      icon: Receipt,
      label: '資本額',
      labelEn: 'Capital amount',
      value: formatCapitalAmount(record.capitalAmount),
    },
    {
      icon: FileText,
      label: '設立日期',
      labelEn: 'Established date',
      value: record.establishedDate || '未提供 / Not provided',
    },
    {
      icon: Shapes,
      label: '組織別',
      labelEn: 'Organization type',
      value: record.organizationType || '未提供 / Not provided',
    },
    {
      icon: FileText,
      label: '使用統一發票',
      labelEn: 'Uses uniform invoice',
      value: formatUniformInvoice(record.usesUniformInvoice),
    },
  ];

  return (
    <section className={cn('space-y-lg rounded-base border-2 border-form-gray bg-rice-paper p-xl', className)}>
      <div>
        <h2 className="text-2xl font-bold text-main-ink">財政部稅籍資料比對</h2>
        <p className="text-sm text-neutral-600">MOF tax-registration cross-check</p>
      </div>

      <div className="rounded-base border border-form-gray bg-support-blue-gray p-lg">
        <p className="text-sm text-main-ink">{metadata.coverageNoteZh}</p>
        <p className="mt-xs text-xs text-neutral-600">{metadata.coverageNoteEn}</p>
      </div>

      <div className="space-y-sm text-sm text-neutral-700">
        <p>目前此區塊使用示範索引資料，並非完整即時查詢。</p>
        <p className="text-xs text-neutral-600">
          This section currently uses demo index data and is not a complete live lookup.
        </p>
        <p>
          不同主管機關的欄位定義、格式與更新時間可能不同。地址、資本額或日期不完全一致時，不一定代表異常。
        </p>
        <p className="text-xs text-neutral-600">
          Field definitions, formatting, and update timing may differ across agencies. Differences in address, capital, or dates do not automatically indicate a problem.
        </p>
      </div>

      <div className="grid gap-md sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-base border border-form-gray bg-surface p-lg"
            >
              <div className="mb-sm flex items-start gap-sm">
                <Icon size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
                <div>
                  <p className="text-sm font-semibold text-main-ink">{item.label}</p>
                  <p className="text-xs text-neutral-600">{item.labelEn}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-neutral-700">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-base border border-form-gray bg-surface p-lg">
        <div className="mb-sm flex items-start gap-sm">
          <Tags size={18} className="mt-xs flex-shrink-0 text-civic-blue" />
          <div>
            <p className="text-sm font-semibold text-main-ink">行業</p>
            <p className="text-xs text-neutral-600">Industries</p>
          </div>
        </div>
        {record.industries.length > 0 ? (
          <ul className="space-y-sm text-sm text-neutral-700">
            {record.industries.map((industry) => (
              <li key={`${industry.code}-${industry.name}`}>
                {industry.code || '未提供'}{industry.name ? `｜${industry.name}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-700">未提供 / Not provided</p>
        )}
      </div>
    </section>
  );
};

export { MofTaxCrossCheck };
export type { MofTaxCrossCheckProps };
