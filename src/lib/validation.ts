import { z } from 'zod';
import {
  COMPANY_SOURCE_KIND_VALUES,
  ENTITY_TYPE_VALUES,
  SEARCH_FILTER_VALUES,
  SOURCE_TYPE_VALUES,
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
    .min(1, '請先輸入公司名稱、統一編號或負責人')
    .max(100, '查詢內容請控制在 100 個字元內'),
  type: z.enum(SEARCH_FILTER_VALUES).optional(),
});

export const companyRecordSchema = z.object({
  ban: banSchema,
  nameZh: z.string().trim().min(1, '公司名稱必填'),
  nameEn: z.string().trim().optional(),
  status: z.enum(STATUS_VALUES),
  officialStatus: z.string().trim().min(1, '登記狀態必填'),
  representative: z.string().trim().min(1, '代表人必填'),
  capital: z.string().trim().min(1, '資本額必填'),
  address: z.string().trim().min(1, '地址必填'),
  establishedDate: z.string().trim().min(1, '設立日期必填'),
  lastUpdated: z.string().trim().min(1, '最後更新日期必填'),
  source: z.string().trim().min(1, '資料來源必填'),
  sourceUpdated: z.string().trim().min(1, '資料來源更新日期必填'),
  entityType: z.enum(ENTITY_TYPE_VALUES),
  entityTypeLabelZh: z.string().trim().min(1, '登記類型中文標籤必填'),
  entityTypeLabelEn: z.string().trim().min(1, '登記類型英文標籤必填'),
  statusLabel: z.string().trim().min(1, '狀態說明必填'),
  sourceKind: z.enum(COMPANY_SOURCE_KIND_VALUES).optional(),
  sourceType: z.enum(SOURCE_TYPE_VALUES),
  sourceNameZh: z.string().trim().min(1, '來源中文名稱必填'),
  sourceNameEn: z.string().trim().min(1, '來源英文名稱必填'),
  fetchedAt: z.string().trim().optional(),
  sourceUrl: z.string().trim().optional(),
  flags: z.array(z.string()).optional(),
});

export const deeperCheckTypeValues = [
  '雇主 / Employer',
  '招募者 / Recruiter',
  '交易對象 / Business partner',
  '租屋仲介 / Rental agent',
  '客戶 / Client',
  '其他 / Other',
] as const;

export const deeperCheckRequestSchema = z.object({
  name: z.string().trim().min(1, '請輸入姓名').max(80, '姓名請控制在 80 個字元內'),
  email: z.string().trim().email('請輸入有效的 Email。Please enter a valid email address.'),
  targetName: z
    .string()
    .trim()
    .min(1, '請輸入查證對象名稱')
    .max(120, '查證對象名稱請控制在 120 個字元內'),
  businessId: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^\d{8}$/.test(value),
      '若填寫統一編號，請輸入 8 碼數字。Business ID must be 8 digits.'
    ),
  checkType: z.enum(deeperCheckTypeValues, {
    errorMap: () => ({ message: '請選擇查證類型' }),
  }),
  message: z
    .string()
    .trim()
    .min(1, '請填寫你想確認的內容')
    .max(1000, '內容請控制在 1000 個字元內'),
  relatedLink: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^https?:\/\//i.test(value),
      '相關連結需以 http:// 或 https:// 開頭。Use a full http:// or https:// link.'
    ),
  companyWebsite: z.string().trim().max(0, '請勿填寫此欄位').optional(),
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

export function validateDeeperCheckRequest(input: unknown) {
  return deeperCheckRequestSchema.safeParse(input);
}
