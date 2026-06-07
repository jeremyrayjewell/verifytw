import { getCompanyByBan } from '@/lib/mockCompanies';
import { fetchMoeaCompanyByBan, isMoeaLookupDisabled } from '@/lib/sources/moea';
import { validateBan } from '@/lib/validation';
import type { Company } from '@/types/company';

export interface CompanyLookupResult {
  company: Company | null;
  dataState: 'real' | 'mock' | 'api_unavailable' | 'not_found' | 'invalid_ban';
  lookupState:
    | 'invalid_ban'
    | 'lookup_disabled'
    | 'live_success'
    | 'live_timeout'
    | 'live_unavailable'
    | 'live_parse_error'
    | 'no_public_record'
    | 'fallback_mock'
    | 'unavailable_no_mock';
  apiMessage?: string;
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
    // TODO: Add a Supabase caching layer before falling back to mock data.
    return mockCompany
      ? { company: mockCompany, dataState: 'mock', lookupState: 'lookup_disabled' }
      : { company: null, dataState: 'not_found', lookupState: 'lookup_disabled' };
  }

  const moeaResult = await fetchMoeaCompanyByBan(parsedBan.data);
  if (moeaResult.state === 'found' && moeaResult.company) {
    return {
      company: moeaResult.company,
      dataState: 'real',
      lookupState: 'live_success',
    };
  }

  if (mockCompany) {
    return {
      company: mockCompany,
      dataState: 'mock',
      lookupState: 'fallback_mock',
      apiMessage:
        moeaResult.state === 'unavailable' ||
        moeaResult.state === 'timeout' ||
        moeaResult.state === 'parse_error'
          ? moeaResult.message
          : undefined,
    };
  }

  if (
    moeaResult.state === 'unavailable' ||
    moeaResult.state === 'timeout' ||
    moeaResult.state === 'parse_error'
  ) {
    return {
      company: null,
      dataState: 'api_unavailable',
      apiMessage: moeaResult.message,
      lookupState:
        moeaResult.state === 'timeout'
          ? 'live_timeout'
          : moeaResult.state === 'parse_error'
            ? 'live_parse_error'
            : 'unavailable_no_mock',
    };
  }

  return {
    company: null,
    dataState: 'not_found',
    lookupState: 'no_public_record',
  };
}
