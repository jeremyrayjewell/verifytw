import { validateBan, validateCompanyRecord, validateSearchQuery } from '@/lib/validation';
import type { Company, Status } from '@/types/company';

const MOEA_COMPANY_BY_BAN_ENDPOINT =
  process.env.MOEA_COMPANY_API_BASE ??
  'https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6';
const MOEA_COMPANY_KEYWORD_ENDPOINT =
  process.env.MOEA_COMPANY_KEYWORD_API_BASE ??
  'https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C';
const MOEA_BUSINESS_BY_BAN_ENDPOINT =
  process.env.MOEA_BUSINESS_API_BASE ??
  'https://data.gcis.nat.gov.tw/od/data/api/426D5542-5F05-43EB-83F9-F1300F14E1F1';
const MOEA_BUSINESS_KEYWORD_ENDPOINT =
  process.env.MOEA_BUSINESS_KEYWORD_API_BASE ??
  'https://data.gcis.nat.gov.tw/od/data/api/A1B4CBFF-2D3A-409B-8A78-2AD94F63AE4A';

// TODO: Add MOF tax registration cross-check after company/business lookup is stable.
// TODO: Add branch registration lookup after company and business records are stable.
// TODO: Add source URL display handling once we expose official links in the UI.

const MOEA_LOOKUP_TIMEOUT_MS = 8000;
const MOEA_KEYWORD_LOOKUP_TIMEOUT_MS = 30000;
const MOEA_KEYWORD_STATUS_CODE = '01';
const MOEA_BUSINESS_STATUS_CODE = '01';
const MOEA_KEYWORD_TOP = 20;

export const MOEA_SOURCE_NAME = '經濟部商工登記公開資料';
export const MOEA_COMPANY_SOURCE_NAME_EN = 'MOEA public company registration data';
export const MOEA_BUSINESS_SOURCE_NAME_EN = 'MOEA public business registration data';

type MoeaCompanyRecord = Partial<{
  Business_Accounting_NO: string;
  Company_Name: string;
  Company_Status: string;
  Company_Status_Desc: string;
  Capital_Stock_Amount: string | number;
  Paid_In_Capital_Amount: string | number;
  Responsible_Name: string;
  Company_Location: string;
  Register_Organization_Desc: string;
  Company_Setup_Date: string;
  Change_Of_Approval_Data: string;
  Revoke_App_Date: string;
  Case_Status: string;
  Case_Status_Desc: string;
  Sus_App_Date: string;
  Sus_Beg_Date: string;
  Sus_End_Date: string;
}>;

type MoeaBusinessRecord = Partial<{
  President_No: string;
  Business_Name: string;
  Business_Current_Status: string;
  Business_Current_Status_Desc: string;
  Business_Register_Funds: string | number;
  Responsible_Name: string;
  Business_Organization_Type: string;
  Business_Organization_Type_Desc: string;
  Agency: string;
  Agency_Desc: string;
  Business_Address: string;
  Business_Setup_Approve_Date: string;
  Business_Last_Change_Date: string;
  Business_Item_Old: string;
  Business_Seq_No: string | number;
  Business_Item: string;
  Business_Item_Desc: string;
}>;

export interface MoeaLookupResult {
  company: Company | null;
  state: 'found' | 'not_found' | 'unavailable' | 'timeout' | 'parse_error';
  message?: string;
}

export interface MoeaKeywordSearchResult {
  companies: Company[];
  state: 'found' | 'not_found' | 'unavailable' | 'timeout' | 'parse_error';
  message?: string;
}

export function isMoeaLookupDisabled(): boolean {
  return process.env.MOEA_LOOKUP_ENABLED === 'false';
}

export function getMoeaDebugConfig() {
  return {
    companyByBanEndpoint: MOEA_COMPANY_BY_BAN_ENDPOINT,
    companyKeywordEndpoint: MOEA_COMPANY_KEYWORD_ENDPOINT,
    businessByBanEndpoint: MOEA_BUSINESS_BY_BAN_ENDPOINT,
    businessKeywordEndpoint: MOEA_BUSINESS_KEYWORD_ENDPOINT,
    banTimeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
    keywordTimeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
    lookupEnabled: !isMoeaLookupDisabled(),
  };
}

function formatDate(value: string | number | undefined): string {
  const raw = String(value ?? '').trim();
  if (!raw) return '公開資料未提供';

  if (/^\d{7}$/.test(raw)) {
    const year = Number(raw.slice(0, 3)) + 1911;
    const month = raw.slice(3, 5);
    const day = raw.slice(5, 7);
    return `${year}/${month}/${day}`;
  }

  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}/${raw.slice(4, 6)}/${raw.slice(6, 8)}`;
  }

  return raw.replace(/[-.]/g, '/');
}

function formatCapital(value: string | number | undefined): string {
  const raw = String(value ?? '').replace(/,/g, '').trim();
  if (!raw) return '公開資料未提供';

  const amount = Number(raw);
  if (Number.isNaN(amount)) {
    return String(value);
  }

  return amount.toLocaleString('en-US');
}

function inferStatus(statusDesc: string, caseStatusDesc: string): Status {
  const combined = `${statusDesc} ${caseStatusDesc}`.trim();

  if (!combined) return '資料取得中';
  if (/(解散|撤銷|廢止|停業|歇業|非營業中|命令停業)/.test(combined)) {
    return '建議再確認';
  }
  if (/(查無|不存在|未提供)/.test(combined)) {
    return '無公開資料';
  }

  return '資料相符';
}

function buildStatusLabel(statusDesc: string, entityLabel: string): string {
  if (!statusDesc) {
    return `目前正在整理此${entityLabel}的公開資料欄位，建議稍後再次確認。`;
  }

  if (/(解散|撤銷|廢止|停業|歇業|非營業中|命令停業)/.test(statusDesc)) {
    return `目前公開資料顯示此${entityLabel}狀態為「${statusDesc}」，仍建議與對方提供的合約、付款資訊或官方文件交叉確認。`;
  }

  return `目前公開資料顯示此${entityLabel}為「${statusDesc}」。`;
}

function getFetchedAt(): string {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  })
    .format(new Date())
    .replace(/\//g, '/')
    .replace(',', '');
}

function getFirstRecord<T>(payload: unknown): T | null {
  if (Array.isArray(payload)) {
    return (payload[0] as T | undefined) ?? null;
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { value?: unknown[] }).value)) {
    return (((payload as { value: unknown[] }).value[0] as T | undefined) ?? null);
  }

  return null;
}

function getRecords<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { value?: unknown[] }).value)) {
    return (payload as { value: unknown[] }).value as T[];
  }

  return [];
}

function isKeywordPayloadParseable(payload: unknown): boolean {
  return (
    Array.isArray(payload) ||
    Boolean(payload && typeof payload === 'object' && Array.isArray((payload as { value?: unknown[] }).value))
  );
}

function isKnownNoDataPayload(payload: unknown): boolean {
  if (Array.isArray(payload)) {
    return payload.length === 0;
  }

  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const record = payload as {
    value?: unknown[];
    data?: unknown[];
    total?: number | string;
    count?: number | string;
    message?: string;
    msg?: string;
  };

  if (Array.isArray(record.value) && record.value.length === 0) {
    return true;
  }

  if (Array.isArray(record.data) && record.data.length === 0) {
    return true;
  }

  if (String(record.total ?? '').trim() === '0' || String(record.count ?? '').trim() === '0') {
    return true;
  }

  const combinedMessage = `${String(record.message ?? '')} ${String(record.msg ?? '')}`.trim();
  return /(查無資料|查無符合|無符合|無資料|no data|not found)/i.test(combinedMessage);
}

function logKeywordDebug(details: {
  sourceType: 'company' | 'business';
  classification: 'live-success' | 'zero-results' | 'timeout' | 'unavailable' | 'parse-error';
  originalQuery?: string;
  aliasExpandedQuery?: string;
  broaderQuery?: string;
  url: string;
  timeoutMs: number;
  responseStatus?: number;
  contentType?: string | null;
  preview?: string;
  parsedResultCount?: number;
  errorMessage?: string;
}) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log(`[verifytw][moea-${details.sourceType}-keyword]`, {
    originalQuery: details.originalQuery ?? null,
    aliasExpandedQuery: details.aliasExpandedQuery ?? null,
    broaderQuery: details.broaderQuery ?? null,
    requestUrl: details.url,
    timeoutMs: details.timeoutMs,
    responseStatus: details.responseStatus ?? null,
    contentType: details.contentType ?? null,
    rawPreview: details.preview ?? '',
    parsedResultCount: details.parsedResultCount ?? 0,
    classification: details.classification,
    errorMessage: details.errorMessage ?? null,
  });
}

function logBanDebug(details: {
  sourceType: 'company' | 'business';
  lookupEnabled: boolean;
  url: string;
  timeoutMs: number;
  responseStatus?: number;
  contentType?: string | null;
  preview?: string;
  parsedResultCount?: number;
  normalizedCompanyName?: string;
  normalizedBan?: string;
  classification: 'success' | 'not-found' | 'timeout' | 'unavailable' | 'parse-error' | 'invalid-ban';
  errorMessage?: string;
}) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log(`[verifytw][moea-${details.sourceType}-ban]`, {
    moeaLookupEnabled: details.lookupEnabled,
    requestUrl: details.url,
    timeoutMs: details.timeoutMs,
    responseStatus: details.responseStatus ?? null,
    contentType: details.contentType ?? null,
    rawPreview: details.preview ?? '',
    parsedResultCount: details.parsedResultCount ?? 0,
    normalizedCompanyName: details.normalizedCompanyName ?? null,
    normalizedBan: details.normalizedBan ?? null,
    classification: details.classification,
    errorMessage: details.errorMessage ?? null,
  });
}

function normalizeMoeaCompany(record: MoeaCompanyRecord): Company | null {
  const statusDesc = String(record.Company_Status_Desc ?? '').trim();
  const caseStatusDesc = String(record.Case_Status_Desc ?? '').trim();
  const companyName = String(record.Company_Name ?? '').trim();

  const normalized: Company = {
    ban: String(record.Business_Accounting_NO ?? '').trim(),
    nameZh: companyName,
    nameEn: undefined,
    status: inferStatus(statusDesc, caseStatusDesc),
    officialStatus: statusDesc || caseStatusDesc || '公開資料未提供',
    representative: String(record.Responsible_Name ?? '').trim() || '公開資料未提供',
    capital: formatCapital(record.Capital_Stock_Amount ?? record.Paid_In_Capital_Amount),
    address: String(record.Company_Location ?? '').trim() || '公開資料未提供',
    establishedDate: formatDate(record.Company_Setup_Date),
    lastUpdated: formatDate(record.Change_Of_Approval_Data),
    source: MOEA_SOURCE_NAME,
    sourceUpdated: formatDate(record.Change_Of_Approval_Data),
    entityType: 'company',
    entityTypeLabelZh: '公司',
    entityTypeLabelEn: 'Company',
    statusLabel: buildStatusLabel(statusDesc || caseStatusDesc, '公司'),
    sourceKind: 'real',
    sourceType: 'moea_company',
    sourceNameZh: MOEA_SOURCE_NAME,
    sourceNameEn: MOEA_COMPANY_SOURCE_NAME_EN,
    fetchedAt: getFetchedAt(),
    sourceUrl: MOEA_COMPANY_BY_BAN_ENDPOINT,
  };

  const parsed = validateCompanyRecord(normalized);
  return parsed.success ? parsed.data : null;
}

function normalizeMoeaBusiness(record: MoeaBusinessRecord): Company | null {
  const statusDesc = String(record.Business_Current_Status_Desc ?? '').trim();
  const businessName = String(record.Business_Name ?? '').trim();

  const normalized: Company = {
    ban: String(record.President_No ?? '').trim(),
    nameZh: businessName,
    nameEn: undefined,
    status: inferStatus(statusDesc, ''),
    officialStatus: statusDesc || '公開資料未提供',
    representative: String(record.Responsible_Name ?? '').trim() || '公開資料未提供',
    capital: formatCapital(record.Business_Register_Funds),
    address: String(record.Business_Address ?? '').trim() || '公開資料未提供',
    establishedDate: formatDate(record.Business_Setup_Approve_Date),
    lastUpdated: formatDate(record.Business_Last_Change_Date),
    source: MOEA_SOURCE_NAME,
    sourceUpdated: formatDate(record.Business_Last_Change_Date),
    entityType: 'business',
    entityTypeLabelZh: '商業',
    entityTypeLabelEn: 'Business',
    statusLabel: buildStatusLabel(statusDesc, '商業登記'),
    sourceKind: 'real',
    sourceType: 'moea_business',
    sourceNameZh: MOEA_SOURCE_NAME,
    sourceNameEn: MOEA_BUSINESS_SOURCE_NAME_EN,
    fetchedAt: getFetchedAt(),
    sourceUrl: MOEA_BUSINESS_BY_BAN_ENDPOINT,
  };

  const parsed = validateCompanyRecord(normalized);
  return parsed.success ? parsed.data : null;
}

async function fetchByBan<T>(config: {
  sourceType: 'company' | 'business';
  endpoint: string;
  filterField: string;
  ban: string;
  normalizer: (record: T) => Company | null;
  notFoundMessage?: string;
}): Promise<MoeaLookupResult> {
  const parsedBan = validateBan(config.ban);
  if (!parsedBan.success) {
    logBanDebug({
      sourceType: config.sourceType,
      lookupEnabled: !isMoeaLookupDisabled(),
      url: config.endpoint,
      timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
      classification: 'invalid-ban',
      errorMessage: parsedBan.error.issues[0]?.message ?? '請輸入 8 碼統一編號',
    });

    return {
      company: null,
      state: 'parse_error',
      message: parsedBan.error.issues[0]?.message ?? '請輸入 8 碼統一編號',
    };
  }

  const url = new URL(config.endpoint);
  url.searchParams.set('$format', 'json');
  url.searchParams.set('$filter', `${config.filterField} eq ${parsedBan.data}`);
  url.searchParams.set('$skip', '0');
  url.searchParams.set('$top', '1');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MOEA_LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type');
    const rawText = await response.text();
    const preview = rawText.slice(0, 500);

    if (!response.ok) {
      logBanDebug({
        sourceType: config.sourceType,
        lookupEnabled: !isMoeaLookupDisabled(),
        url: url.toString(),
        timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
        classification: 'unavailable',
      });

      return {
        company: null,
        state: 'unavailable',
        message: '暫時無法取得公開資料，請稍後再試。',
      };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawText) as unknown;
    } catch {
      logBanDebug({
        sourceType: config.sourceType,
        lookupEnabled: !isMoeaLookupDisabled(),
        url: url.toString(),
        timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
        classification: 'parse-error',
      });

      return {
        company: null,
        state: 'parse_error',
        message: '公開資料格式暫時無法辨識，請稍後再試。',
      };
    }

    const record = getFirstRecord<T>(payload);
    if (!record) {
      logBanDebug({
        sourceType: config.sourceType,
        lookupEnabled: !isMoeaLookupDisabled(),
        url: url.toString(),
        timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
        classification: 'not-found',
      });

      return {
        company: null,
        state: 'not_found',
        message: config.notFoundMessage,
      };
    }

    const company = config.normalizer(record);
    if (!company) {
      logBanDebug({
        sourceType: config.sourceType,
        lookupEnabled: !isMoeaLookupDisabled(),
        url: url.toString(),
        timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 1,
        classification: 'parse-error',
      });

      return {
        company: null,
        state: 'parse_error',
        message: '公開資料格式暫時無法辨識，請稍後再試。',
      };
    }

    logBanDebug({
      sourceType: config.sourceType,
      lookupEnabled: !isMoeaLookupDisabled(),
      url: url.toString(),
      timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
      responseStatus: response.status,
      contentType,
      parsedResultCount: 1,
      normalizedCompanyName: company.nameZh,
      normalizedBan: company.ban,
      classification: 'success',
    });

    return {
      company,
      state: 'found',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logBanDebug({
        sourceType: config.sourceType,
        lookupEnabled: !isMoeaLookupDisabled(),
        url: url.toString(),
        timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
        parsedResultCount: 0,
        classification: 'timeout',
        errorMessage: error.message,
      });

      return {
        company: null,
        state: 'timeout',
        message: '公開資料回應較慢，請稍後再試。',
      };
    }

    logBanDebug({
      sourceType: config.sourceType,
      lookupEnabled: !isMoeaLookupDisabled(),
      url: url.toString(),
      timeoutMs: MOEA_LOOKUP_TIMEOUT_MS,
      parsedResultCount: 0,
      classification: 'unavailable',
      errorMessage: error instanceof Error ? error.message : 'unknown error',
    });

    return {
      company: null,
      state: 'unavailable',
      message: '暫時無法取得公開資料，請稍後再試。',
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function searchByKeyword<T>(config: {
  sourceType: 'company' | 'business';
  endpoint: string;
  query: string;
  filterExpression: (normalizedQuery: string) => string;
  normalizer: (record: T) => Company | null;
  notFoundMessage: string;
  debugMeta?: {
    originalQuery?: string;
    aliasExpandedQuery?: string;
    broaderQuery?: string;
  };
}): Promise<MoeaKeywordSearchResult> {
  const parsedQuery = validateSearchQuery(config.query, 'all');
  if (!parsedQuery.success) {
    return {
      companies: [],
      state: 'unavailable',
      message: parsedQuery.error.issues[0]?.message ?? '請先輸入登記名稱',
    };
  }

  const url = new URL(config.endpoint);
  url.searchParams.set('$format', 'json');
  url.searchParams.set('$filter', config.filterExpression(parsedQuery.data.query));
  url.searchParams.set('$skip', '0');
  url.searchParams.set('$top', String(MOEA_KEYWORD_TOP));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MOEA_KEYWORD_LOOKUP_TIMEOUT_MS);
  const requestUrl = url.toString();

  try {
    const response = await fetch(requestUrl, {
      headers: { accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type');
    const rawText = await response.text();
    const preview = rawText.slice(0, 500);
    const trimmedRawText = rawText.trim();

    if (response.status === 204 || trimmedRawText.length === 0) {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'zero-results',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return { companies: [], state: 'not_found', message: config.notFoundMessage };
    }

    if (!response.ok) {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'unavailable',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return {
        companies: [],
        state: 'unavailable',
        message: '暫時無法取得即時公開資料，請稍後再試。',
      };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(trimmedRawText) as unknown;
    } catch {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'parse-error',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return {
        companies: [],
        state: 'parse_error',
        message: '公開資料回應格式暫時無法讀取。',
      };
    }

    if (isKnownNoDataPayload(payload)) {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'zero-results',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return { companies: [], state: 'not_found', message: config.notFoundMessage };
    }

    if (!isKeywordPayloadParseable(payload)) {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'parse-error',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return {
        companies: [],
        state: 'parse_error',
        message: '公開資料回應格式暫時無法讀取。',
      };
    }

    const companies: Company[] = getRecords<T>(payload).reduce<Company[]>((acc, record) => {
      const company = config.normalizer(record);
      if (!company) {
        return acc;
      }

      acc.push({
        ...company,
        sourceUrl: config.endpoint,
      });

      return acc;
    }, []);

    if (companies.length === 0) {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'zero-results',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return { companies: [], state: 'not_found', message: config.notFoundMessage };
    }

    logKeywordDebug({
      sourceType: config.sourceType,
      classification: 'live-success',
      originalQuery: config.debugMeta?.originalQuery,
      aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
      broaderQuery: config.debugMeta?.broaderQuery,
      url: requestUrl,
      timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
      responseStatus: response.status,
      contentType,
      preview,
      parsedResultCount: companies.length,
    });

    return { companies, state: 'found' };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logKeywordDebug({
        sourceType: config.sourceType,
        classification: 'timeout',
        originalQuery: config.debugMeta?.originalQuery,
        aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
        broaderQuery: config.debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        parsedResultCount: 0,
        errorMessage: error.message,
      });

      return {
        companies: [],
        state: 'timeout',
        message: '即時公開資料回應較慢，請稍後再試，或改用統一編號查詢。',
      };
    }

    logKeywordDebug({
      sourceType: config.sourceType,
      classification: 'unavailable',
      originalQuery: config.debugMeta?.originalQuery,
      aliasExpandedQuery: config.debugMeta?.aliasExpandedQuery,
      broaderQuery: config.debugMeta?.broaderQuery,
      url: requestUrl,
      timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
      parsedResultCount: 0,
      errorMessage: error instanceof Error ? error.message : 'unknown error',
    });

    return {
      companies: [],
      state: 'unavailable',
      message: '暫時無法取得即時公開資料，請稍後再試。',
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchMoeaCompanyByBan(ban: string): Promise<MoeaLookupResult> {
  return fetchByBan<MoeaCompanyRecord>({
    sourceType: 'company',
    endpoint: MOEA_COMPANY_BY_BAN_ENDPOINT,
    filterField: 'Business_Accounting_NO',
    ban,
    normalizer: normalizeMoeaCompany,
  });
}

export async function fetchMoeaBusinessByBan(ban: string): Promise<MoeaLookupResult> {
  return fetchByBan<MoeaBusinessRecord>({
    sourceType: 'business',
    endpoint: MOEA_BUSINESS_BY_BAN_ENDPOINT,
    filterField: 'President_No',
    ban,
    normalizer: normalizeMoeaBusiness,
  });
}

export async function searchMoeaCompaniesByKeyword(
  query: string,
  debugMeta?: {
    originalQuery?: string;
    aliasExpandedQuery?: string;
    broaderQuery?: string;
  }
): Promise<MoeaKeywordSearchResult> {
  return searchByKeyword<MoeaCompanyRecord>({
    sourceType: 'company',
    endpoint: MOEA_COMPANY_KEYWORD_ENDPOINT,
    query,
    filterExpression: (normalizedQuery) =>
      `Company_Name like ${normalizedQuery} and Company_Status eq ${MOEA_KEYWORD_STATUS_CODE}`,
    normalizer: normalizeMoeaCompany,
    notFoundMessage: '沒有找到相符的公司登記公開資料。',
    debugMeta,
  });
}

export async function searchMoeaBusinessesByKeyword(
  query: string,
  debugMeta?: {
    originalQuery?: string;
    aliasExpandedQuery?: string;
    broaderQuery?: string;
  }
): Promise<MoeaKeywordSearchResult> {
  return searchByKeyword<MoeaBusinessRecord>({
    sourceType: 'business',
    endpoint: MOEA_BUSINESS_KEYWORD_ENDPOINT,
    query,
    filterExpression: (normalizedQuery) =>
      `Business_Name like ${normalizedQuery} and Business_Current_Status eq ${MOEA_BUSINESS_STATUS_CODE}`,
    normalizer: normalizeMoeaBusiness,
    notFoundMessage: '沒有找到相符的商業登記公開資料。',
    debugMeta,
  });
}
