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

export function getEntityTypeLabelEn(entityType: EntityType): string {
  switch (entityType) {
    case 'company':
      return 'Company';
    case 'business':
      return 'Business';
    case 'branch':
      return 'Branch';
    default:
      return entityType;
  }
}

export function getRegistrationSectionTitle(): string {
  return '登記基本資料';
}

export function getRegistrationSectionTitleEn(): string {
  return 'Registration information';
}

export function getStatusFieldLabel(): string {
  return '登記狀態';
}

export function getStatusFieldLabelEn(): string {
  return 'Registration status';
}

export function getNameFieldLabel(entityType: EntityType): string {
  return entityType === 'business' ? '登記名稱' : '登記名稱';
}

export function getNameFieldLabelEn(): string {
  return 'Registered name';
}

export function getResultCardMeta(company: Company) {
  return [
    { label: '統一編號', value: company.ban },
    { label: '類型', value: getEntityTypeLabel(company.entityType) },
    { label: '負責人', value: company.representative },
    { label: '資本額', value: `NT$ ${company.capital}` },
  ];
}
