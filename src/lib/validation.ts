import { z } from 'zod';
import {
  ENTITY_TYPE_VALUES,
  SEARCH_FILTER_VALUES,
  STATUS_VALUES,
  type Company,
  type SearchQuery,
} from '@/types/company';

export const banSchema = z
  .string()
  .trim()
  .regex(/^\d{8}$/, '請輸入 8 碼統一編號');

export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, '請先輸入公司名稱、統一編號、負責人或英文名稱')
    .max(100, '查詢內容請控制在 100 個字元內'),
  type: z.enum(SEARCH_FILTER_VALUES).optional(),
});

export const companyRecordSchema = z.object({
  ban: banSchema,
  nameZh: z.string().trim().min(1, '公司名稱必填'),
  nameEn: z.string().trim().optional(),
  status: z.enum(STATUS_VALUES),
  representative: z.string().trim().min(1, '代表人必填'),
  capital: z.string().trim().min(1, '資本額必填'),
  address: z.string().trim().min(1, '地址必填'),
  establishedDate: z.string().trim().min(1, '設立日期必填'),
  lastUpdated: z.string().trim().min(1, '最後更新日期必填'),
  source: z.string().trim().min(1, '資料來源必填'),
  sourceUpdated: z.string().trim().min(1, '資料來源更新日期必填'),
  entityType: z.enum(ENTITY_TYPE_VALUES),
  statusLabel: z.string().trim().min(1, '狀態說明必填'),
  flags: z.array(z.string()).optional(),
});

export function validateSearchQuery(input: string, type?: SearchQuery['type']) {
  return searchQuerySchema.safeParse({ query: input, type });
}

export function validateBan(input: string) {
  return banSchema.safeParse(input);
}

export function validateCompanyRecord(input: unknown) {
  return companyRecordSchema.safeParse(input);
}

export function assertValidCompanies(input: unknown[]): Company[] {
  return input.map((record) => companyRecordSchema.parse(record));
}
