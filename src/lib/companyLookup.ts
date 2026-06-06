import { getCompanyByBan } from '@/lib/mockCompanies';
import { fetchMoeaCompanyByBan, isMoeaLookupDisabled } from '@/lib/sources/moea';
import { validateBan } from '@/lib/validation';
import type { Company } from '@/types/company';

export interface CompanyLookupResult {
  company: Company | null;
  dataState: 'real' | 'mock' | 'api_unavailable' | 'not_found' | 'invalid_ban';
  apiMessage?: string;
}

export async function getCompanyDetailByBan(ban: string): Promise<CompanyLookupResult> {
  const parsedBan = validateBan(ban);
  if (!parsedBan.success) {
    return {
      company: null,
      dataState: 'invalid_ban',
    };
  }

  const mockCompany = getCompanyByBan(parsedBan.data);

  if (isMoeaLookupDisabled()) {
    // TODO: Add a Supabase caching layer before falling back to mock data.
    return mockCompany
      ? { company: mockCompany, dataState: 'mock' }
      : { company: null, dataState: 'not_found' };
  }

  const moeaResult = await fetchMoeaCompanyByBan(parsedBan.data);
  if (moeaResult.state === 'found' && moeaResult.company) {
    return {
      company: moeaResult.company,
      dataState: 'real',
    };
  }

  if (mockCompany) {
    return {
      company: mockCompany,
      dataState: 'mock',
      apiMessage: moeaResult.state === 'unavailable' ? moeaResult.message : undefined,
    };
  }

  if (moeaResult.state === 'unavailable') {
    return {
      company: null,
      dataState: 'api_unavailable',
      apiMessage: moeaResult.message,
    };
  }

  return {
    company: null,
    dataState: 'not_found',
  };
}
