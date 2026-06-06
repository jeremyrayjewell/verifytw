import type { Company, EntityType } from '@/types/company';

export function getEntityTypeLabel(entityType: EntityType): string {
  switch (entityType) {
    case 'company':
      return '公司';
    case 'business':
      return '商業';
    case 'branch':
      return '分公司';
    default:
      return entityType;
  }
}

export function getResultCardMeta(company: Company) {
  return [
    { label: '統一編號', value: company.ban },
    { label: '類型', value: getEntityTypeLabel(company.entityType) },
    { label: '負責人', value: company.representative },
    { label: '資本額', value: `NT$ ${company.capital}` },
  ];
}
