export const STATUS_VALUES = [
  '資料相符',
  '建議再確認',
  '資料取得中',
  '無公開資料',
] as const;

export const ENTITY_TYPE_VALUES = ['company', 'business', 'branch'] as const;

export const SEARCH_FILTER_VALUES = [
  'all',
  'company',
  'business',
  'branch',
  'recent',
] as const;

export const COMPANY_SOURCE_KIND_VALUES = ['real', 'mock'] as const;

export type Status = (typeof STATUS_VALUES)[number];
export type EntityType = (typeof ENTITY_TYPE_VALUES)[number];
export type SearchFilter = (typeof SEARCH_FILTER_VALUES)[number];
export type CompanySourceKind = (typeof COMPANY_SOURCE_KIND_VALUES)[number];

export interface Company {
  ban: string;
  nameZh: string;
  nameEn?: string;
  status: Status;
  officialStatus: string;
  representative: string;
  capital: string;
  address: string;
  establishedDate: string;
  lastUpdated: string;
  source: string;
  sourceUpdated: string;
  entityType: EntityType;
  statusLabel: string;
  sourceKind?: CompanySourceKind;
  fetchedAt?: string;
  sourceUrl?: string;
  flags?: string[];
}

export interface SearchQuery {
  query: string;
  type?: SearchFilter;
}
