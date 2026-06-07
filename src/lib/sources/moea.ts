import { validateBan, validateCompanyRecord, validateSearchQuery } from '@/lib/validation';
import type { Company, Status } from '@/types/company';

const MOEA_COMPANY_BY_BAN_ENDPOINT =
  process.env.MOEA_COMPANY_API_BASE ??
  'https://data.gcis.nat.gov.tw/od/data/api/5F64D864-61CB-4D0D-8AD9-492047CC1EA6';
const MOEA_COMPANY_KEYWORD_ENDPOINT =
  process.env.MOEA_COMPANY_KEYWORD_API_BASE ??
  'https://data.gcis.nat.gov.tw/od/data/api/6BBA2268-1367-4B42-9CCA-BC17499EBE8C';

// TODO: Add MOEA keyword search integration for /search.
// TODO: Add MOF tax registration cross-check after the BAN lookup is stable.
// TODO: Add source URL display handling once we expose official links in the UI.

const MOEA_LOOKUP_TIMEOUT_MS = 8000;
const MOEA_KEYWORD_LOOKUP_TIMEOUT_MS = 30000;
const MOEA_KEYWORD_STATUS_CODE = '01';
const MOEA_KEYWORD_TOP = 20;

export const MOEA_SOURCE_NAME = '經濟部商工登記公開資料';
export const MOEA_SOURCE_NAME_EN = 'MOEA public company registration data';

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
    keywordEndpoint: MOEA_COMPANY_KEYWORD_ENDPOINT,
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

function buildStatusLabel(statusDesc: string, companyName: string): string {
  if (!statusDesc) {
    return `目前正在整理 ${companyName} 的公開資料欄位，建議稍後再次確認。`;
  }

  if (/(解散|撤銷|廢止|停業|歇業|非營業中|命令停業)/.test(statusDesc)) {
    return `目前公開資料顯示此公司狀態為「${statusDesc}」，仍建議與對方提供的合約、付款資訊或官方文件交叉確認。`;
  }

  return `目前公開資料顯示此公司為「${statusDesc}」。`;
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

function getFirstRecord(payload: unknown): MoeaCompanyRecord | null {
  if (Array.isArray(payload)) {
    return (payload[0] as MoeaCompanyRecord | undefined) ?? null;
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { value?: unknown[] }).value)) {
    return (((payload as { value: unknown[] }).value[0] as MoeaCompanyRecord | undefined) ?? null);
  }

  return null;
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
    statusLabel: buildStatusLabel(statusDesc, companyName || '此公司'),
    sourceKind: 'real',
    fetchedAt: getFetchedAt(),
    sourceUrl: record.Company_Name ? MOEA_COMPANY_BY_BAN_ENDPOINT : undefined,
  };

  const parsed = validateCompanyRecord(normalized);
  return parsed.success ? parsed.data : null;
}

function getRecords(payload: unknown): MoeaCompanyRecord[] {
  if (Array.isArray(payload)) {
    return payload as MoeaCompanyRecord[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { value?: unknown[] }).value)) {
    return (payload as { value: unknown[] }).value as MoeaCompanyRecord[];
  }

  return [];
}

function isKeywordPayloadParseable(payload: unknown): boolean {
  return Array.isArray(payload) || Boolean(payload && typeof payload === 'object' && Array.isArray((payload as { value?: unknown[] }).value));
}

function logMoeaKeywordDebug(details: {
  classification: 'live-success' | 'zero-results' | 'fallback' | 'timeout' | 'unavailable' | 'parse-error';
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

  console.log('[verifytw][moea-keyword]', {
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

function logMoeaBanDebug(details: {
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

  console.log('[verifytw][moea-ban]', {
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

export async function fetchMoeaCompanyByBan(ban: string): Promise<MoeaLookupResult> {
  const parsedBan = validateBan(ban);
  if (!parsedBan.success) {
    logMoeaBanDebug({
      lookupEnabled: !isMoeaLookupDisabled(),
      url: MOEA_COMPANY_BY_BAN_ENDPOINT,
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

  const url = new URL(MOEA_COMPANY_BY_BAN_ENDPOINT);
  url.searchParams.set('$format', 'json');
  url.searchParams.set('$filter', `Business_Accounting_NO eq ${parsedBan.data}`);
  url.searchParams.set('$skip', '0');
  url.searchParams.set('$top', '1');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MOEA_LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type');
    const rawText = await response.text();
    const preview = rawText.slice(0, 500);

    if (!response.ok) {
      logMoeaBanDebug({
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
      logMoeaBanDebug({
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

    const record = getFirstRecord(payload);

    if (!record) {
      logMoeaBanDebug({
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
      };
    }

    const company = normalizeMoeaCompany(record);
    if (!company) {
      logMoeaBanDebug({
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

    logMoeaBanDebug({
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
      logMoeaBanDebug({
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

    logMoeaBanDebug({
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

export async function searchMoeaCompaniesByKeyword(
  query: string,
  debugMeta?: {
    originalQuery?: string;
    aliasExpandedQuery?: string;
    broaderQuery?: string;
  }
): Promise<MoeaKeywordSearchResult> {
  const parsedQuery = validateSearchQuery(query, 'all');
  if (!parsedQuery.success) {
    return {
      companies: [],
      state: 'unavailable',
      message: parsedQuery.error.issues[0]?.message ?? '請先輸入公司名稱',
    };
  }

  const url = new URL(MOEA_COMPANY_KEYWORD_ENDPOINT);
  url.searchParams.set('$format', 'json');
  url.searchParams.set(
    '$filter',
    `Company_Name like ${parsedQuery.data.query} and Company_Status eq ${MOEA_KEYWORD_STATUS_CODE}`
  );
  url.searchParams.set('$skip', '0');
  url.searchParams.set('$top', String(MOEA_KEYWORD_TOP));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MOEA_KEYWORD_LOOKUP_TIMEOUT_MS);
  const requestUrl = url.toString();

  try {
    const response = await fetch(requestUrl, {
      headers: {
        accept: 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type');
    const rawText = await response.text();
    const preview = rawText.slice(0, 500);

    if (!response.ok) {
      logMoeaKeywordDebug({
        classification: 'unavailable',
        originalQuery: debugMeta?.originalQuery,
        aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
        broaderQuery: debugMeta?.broaderQuery,
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
      payload = JSON.parse(rawText) as unknown;
    } catch {
      logMoeaKeywordDebug({
        classification: 'parse-error',
        originalQuery: debugMeta?.originalQuery,
        aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
        broaderQuery: debugMeta?.broaderQuery,
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
        message: '公開資料格式暫時無法解析。',
      };
    }

    if (!isKeywordPayloadParseable(payload)) {
      logMoeaKeywordDebug({
        classification: 'parse-error',
        originalQuery: debugMeta?.originalQuery,
        aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
        broaderQuery: debugMeta?.broaderQuery,
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
        message: '公開資料格式暫時無法解析。',
      };
    }

    const companies: Company[] = getRecords(payload).reduce<Company[]>((acc, record) => {
      const company = normalizeMoeaCompany(record);
      if (!company) {
        return acc;
      }

      acc.push({
        ...company,
        sourceUrl: MOEA_COMPANY_KEYWORD_ENDPOINT,
      });

      return acc;
    }, []);

    if (companies.length === 0) {
      logMoeaKeywordDebug({
        classification: 'zero-results',
        originalQuery: debugMeta?.originalQuery,
        aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
        broaderQuery: debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        responseStatus: response.status,
        contentType,
        preview,
        parsedResultCount: 0,
      });

      return {
        companies: [],
        state: 'not_found',
        message: '沒有找到相符的公司登記公開資料。',
      };
    }

    logMoeaKeywordDebug({
      classification: 'live-success',
      originalQuery: debugMeta?.originalQuery,
      aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
      broaderQuery: debugMeta?.broaderQuery,
      url: requestUrl,
      timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
      responseStatus: response.status,
      contentType,
      preview,
      parsedResultCount: companies.length,
    });

    return {
      companies,
      state: 'found',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logMoeaKeywordDebug({
        classification: 'timeout',
        originalQuery: debugMeta?.originalQuery,
        aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
        broaderQuery: debugMeta?.broaderQuery,
        url: requestUrl,
        timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
        preview: '',
        parsedResultCount: 0,
        errorMessage: error.message,
      });

      return {
        companies: [],
        state: 'timeout',
        message: '即時公開資料回應較慢，請稍後再試，或改用統一編號查詢。',
      };
    }

    logMoeaKeywordDebug({
      classification: 'unavailable',
      originalQuery: debugMeta?.originalQuery,
      aliasExpandedQuery: debugMeta?.aliasExpandedQuery,
      broaderQuery: debugMeta?.broaderQuery,
      url: requestUrl,
      timeoutMs: MOEA_KEYWORD_LOOKUP_TIMEOUT_MS,
      preview: '',
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
