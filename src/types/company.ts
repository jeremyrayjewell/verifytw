import { z } from 'zod';

export const StatusEnum = z.enum([
  '資料相符',
  '建議再確認',
  '資料取得中',
  '無公開資料',
]);

export type Status = z.infer<typeof StatusEnum>;

export const CompanySchema = z.object({
  ban: z.string().length(8, '統一編號須為8碼'),
  nameZh: z.string().min(1, '公司名稱必填'),
  nameEn: z.string().optional(),
  status: StatusEnum,
  representative: z.string(),
  capital: z.string(),
  address: z.string(),
  establishedDate: z.string(),
  lastUpdated: z.string(),
  source: z.string(),
  // Additional fields for risk summary
  flags?: z.array(z.string()).optional(),
});

export type Company = z.infer<typeof CompanySchema>;

export const SearchQuerySchema = z.object({
  query: z.string().min(1, '請輸入查詢內容'),
  type: z.enum(['all', 'company', 'business', 'branch']).optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export interface SearchResult {
  company: Company;
  relevanceScore: number;
}
