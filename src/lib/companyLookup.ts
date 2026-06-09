import { getCompanyByBan } from '@/lib/mockCompanies';
import {
  fetchMoeaBusinessByBan,
  fetchMoeaCompanyByBan,
  isMoeaLookupDisabled,
} from '@/lib/sources/moea';
import { validateBan } from '@/lib/validation';
import type { Company } from '@/types/company';

export interface CompanyLookupResult {
  company: Company | null;
  dataState: 'real' | 'mock' | 'api_unavailable' | 'not_found' | 'invalid_ban';
  lookupState:
    | 'invalid_ban'
    | 'lookup_disabled'
    | 'live_company_success'
    | 'live_business_success'
    | 'live_timeout'
    | 'live_unavailable'
    | 'live_parse_error'
    | 'no_public_record'
    | 'fallback_mock'
    | 'unavailable_no_mock';
  apiMessage?: string;
  sourceWarnings?: string[];
}

export async function getCompanyDetailByBan(ban: string): Promise<CompanyLookupResult> {
  const parsedBan = validateBan(ban);
  if (!parsedBan.success) {
    return {
      company: null,
      dataState: 'invalid_ban',
      lookupState: 'invalid_ban',
    };
  }

  const mockCompany = getCompanyByBan(parsedBan.data);

  if (isMoeaLookupDisabled()) {
    return mockCompany
      ? { company: mockCompany, dataState: 'mock', lookupState: 'lookup_disabled' }
      : { company: null, dataState: 'not_found', lookupState: 'lookup_disabled' };
  }

  const [companyResult, businessResult] = await Promise.all([
    fetchMoeaCompanyByBan(parsedBan.data),
    fetchMoeaBusinessByBan(parsedBan.data),
  ]);

  if (companyResult.state === 'found' && companyResult.company) {
    return {
      company: companyResult.company,
      dataState: 'real',
      lookupState: 'live_company_success',
      sourceWarnings:
        businessResult.state === 'unavailable' ||
        businessResult.state === 'timeout' ||
        businessResult.state === 'parse_error'
          ? ['部分公開資料來源暫時無法回應。']
          : undefined,
    };
  }

  if (businessResult.state === 'found' && businessResult.company) {
    return {
      company: businessResult.company,
      dataState: 'real',
      lookupState: 'live_business_success',
      sourceWarnings:
        companyResult.state === 'unavailable' ||
        companyResult.state === 'timeout' ||
        companyResult.state === 'parse_error'
          ? ['部分公開資料來源暫時無法回應。']
          : undefined,
    };
  }

  if (mockCompany) {
    const sourceWarnings: string[] = [];

    if (
      companyResult.state === 'unavailable' ||
      companyResult.state === 'timeout' ||
      companyResult.state === 'parse_error' ||
      businessResult.state === 'unavailable' ||
      businessResult.state === 'timeout' ||
      businessResult.state === 'parse_error'
    ) {
      sourceWarnings.push('部分公開資料來源暫時無法回應。');
    }

    return {
      company: mockCompany,
      dataState: 'mock',
      lookupState: 'fallback_mock',
      apiMessage:
        companyResult.message ??
        businessResult.message,
      sourceWarnings: sourceWarnings.length > 0 ? sourceWarnings : undefined,
    };
  }

  const allSourcesFailed =
    ['unavailable', 'timeout', 'parse_error'].includes(companyResult.state) &&
    ['unavailable', 'timeout', 'parse_error'].includes(businessResult.state);

  if (allSourcesFailed) {
    const timeoutSeen =
      companyResult.state === 'timeout' || businessResult.state === 'timeout';
    const parseSeen =
      companyResult.state === 'parse_error' || businessResult.state === 'parse_error';

    return {
      company: null,
      dataState: 'api_unavailable',
      apiMessage:
        companyResult.message ?? businessResult.message ?? '暫時無法取得公開資料，請稍後再試。',
      lookupState: timeoutSeen
        ? 'live_timeout'
        : parseSeen
          ? 'live_parse_error'
          : 'unavailable_no_mock',
      sourceWarnings: ['部分公開資料來源暫時無法回應。'],
    };
  }

  if (
    companyResult.state === 'unavailable' ||
    companyResult.state === 'timeout' ||
    companyResult.state === 'parse_error' ||
    businessResult.state === 'unavailable' ||
    businessResult.state === 'timeout' ||
    businessResult.state === 'parse_error'
  ) {
    return {
      company: null,
      dataState: 'api_unavailable',
      apiMessage:
        companyResult.message ?? businessResult.message ?? '暫時無法取得公開資料，請稍後再試。',
      lookupState:
        companyResult.state === 'timeout' || businessResult.state === 'timeout'
          ? 'live_timeout'
          : companyResult.state === 'parse_error' || businessResult.state === 'parse_error'
            ? 'live_parse_error'
            : 'unavailable_no_mock',
      sourceWarnings: ['部分公開資料來源暫時無法回應。'],
    };
  }

  return {
    company: null,
    dataState: 'not_found',
    lookupState: 'no_public_record',
  };
}
