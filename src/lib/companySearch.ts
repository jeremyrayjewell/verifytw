import { searchCompanies } from '@/lib/mockCompanies';
import { searchMoeaCompaniesByKeyword, isMoeaLookupDisabled } from '@/lib/sources/moea';
import { validateBan, validateSearchQuery } from '@/lib/validation';
import type { Company, SearchFilter } from '@/types/company';

export interface CompanySearchResult {
  companies: Company[];
  dataState: 'live' | 'mock' | 'fallback_mock' | 'no_results' | 'invalid_query';
  query: string;
  filterType: SearchFilter;
  apiMessage?: string;
  helperText?: string;
}

const COMPANY_NAME_ALIAS_MAP: Record<string, string> = {
  台積電: '台灣積體電路製造股份有限公司',
  鴻海: '鴻海精密工業股份有限公司',
  宏碁: '宏碁股份有限公司',
};

const COMPANY_NAME_SUFFIXES = ['股份有限公司', '有限公司', '公司'] as const;

function normalizeLiveKeywordQuery(query: string): string {
  // TODO: Expand alias coverage carefully with audited mappings only.
  return COMPANY_NAME_ALIAS_MAP[query] ?? query;
}

function buildLiveKeywordCandidates(query: string): string[] {
  const candidates = new Set<string>();
  const normalized = normalizeLiveKeywordQuery(query);

  if (normalized) {
    candidates.add(normalized);
  }

  for (const suffix of COMPANY_NAME_SUFFIXES) {
    if (normalized.endsWith(suffix)) {
      const stripped = normalized.slice(0, -suffix.length).trim();
      if (stripped.length >= 2) {
        candidates.add(stripped);
      }
    }
  }

  return Array.from(candidates);
}

function logSearchClassification(details: {
  query: string;
  filterType: SearchFilter;
  classification: 'live' | 'empty' | 'fallback' | 'unavailable' | 'parse-error' | 'mock' | 'invalid-query';
  resultCount: number;
}) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  console.log('[verifytw][search]', details);
}

function sortAndFilterCompanies(companies: Company[], filterType: SearchFilter): Company[] {
  const filtered =
    filterType === 'all' || filterType === 'recent'
      ? companies
      : companies.filter((company) => company.entityType === filterType);

  if (filterType === 'recent') {
    return [...filtered].sort((a, b) => {
      const left = a.lastUpdated || a.sourceUpdated || a.fetchedAt || '';
      const right = b.lastUpdated || b.sourceUpdated || b.fetchedAt || '';
      return right.localeCompare(left);
    });
  }

  return filtered;
}

export async function getSearchResults(
  rawQuery: string,
  filterType: SearchFilter = 'all'
): Promise<CompanySearchResult> {
  const parsedQuery = validateSearchQuery(rawQuery, filterType);
  if (!parsedQuery.success) {
    return {
      companies: [],
      dataState: 'invalid_query',
      query: rawQuery.trim(),
      filterType,
      apiMessage: parsedQuery.error.issues[0]?.message,
    };
  }

  const query = parsedQuery.data.query;
  const liveQueries = buildLiveKeywordCandidates(query);
  const primaryLiveQuery = liveQueries[0] ?? query;
  const mockResults = searchCompanies(query, filterType);
  const isBusinessIdSearch = validateBan(query).success;

  if (isMoeaLookupDisabled() || isBusinessIdSearch) {
    logSearchClassification({
      query,
      filterType,
      classification: 'mock',
      resultCount: mockResults.length,
    });

    return {
      companies: mockResults,
      dataState: mockResults.length > 0 ? 'mock' : 'no_results',
      query,
      filterType,
      helperText:
        mockResults.length > 0
          ? undefined
          : '建議輸入公司登記名稱或統一編號，例如「台灣積體電路製造股份有限公司」。',
    };
  }

  let liveResult = null as Awaited<ReturnType<typeof searchMoeaCompaniesByKeyword>> | null;
  let matchedLiveQuery = primaryLiveQuery;

  for (const candidate of liveQueries) {
    const candidateResult = await searchMoeaCompaniesByKeyword(candidate);
    liveResult = candidateResult;

    if (candidateResult.state === 'found') {
      matchedLiveQuery = candidate;
      break;
    }

    if (
      candidateResult.state === 'unavailable' ||
      candidateResult.state === 'parse_error'
    ) {
      matchedLiveQuery = candidate;
      break;
    }
  }

  if (liveResult?.state === 'found') {
    const companies = sortAndFilterCompanies(liveResult.companies, filterType);
    const usedApproximateMatch = query !== matchedLiveQuery;

    logSearchClassification({
      query,
      filterType,
      classification: 'live',
      resultCount: companies.length,
    });

    return {
      companies,
      dataState: 'live',
      query,
      filterType,
      helperText: usedApproximateMatch
        ? `已改用較接近的公司登記名稱查詢：「${matchedLiveQuery}」。`
        : undefined,
    };
  }

  if (!liveResult) {
    liveResult = {
      companies: [],
      state: 'not_found',
      message: '沒有找到相符的公司登記公開資料。',
    };
  }

  if (mockResults.length > 0) {
    logSearchClassification({
      query,
      filterType,
      classification:
        liveResult.state === 'unavailable'
          ? 'fallback'
          : liveResult.state === 'parse_error'
            ? 'parse-error'
            : 'fallback',
      resultCount: mockResults.length,
    });

    return {
      companies: mockResults,
      dataState:
        liveResult.state === 'unavailable' || liveResult.state === 'parse_error'
          ? 'fallback_mock'
          : 'mock',
      query,
      filterType,
      apiMessage:
        liveResult.state === 'unavailable' || liveResult.state === 'parse_error'
          ? liveResult.message
          : undefined,
      helperText:
        query !== matchedLiveQuery
          ? `即時公開資料未回傳結果，以下先顯示示範資料；已嘗試使用較接近的公司登記名稱「${matchedLiveQuery}」查詢。`
          : undefined,
    };
  }

  logSearchClassification({
    query,
    filterType,
    classification:
      liveResult.state === 'unavailable'
        ? 'unavailable'
        : liveResult.state === 'parse_error'
          ? 'parse-error'
          : 'empty',
    resultCount: 0,
  });

  return {
    companies: [],
    dataState: 'no_results',
    query,
    filterType,
    apiMessage: liveResult.message,
    helperText:
      liveResult.state === 'not_found'
        ? '可能原因包括：使用了簡稱、登記名稱不同、資料尚未更新，或目前查詢範圍尚未涵蓋。建議改用完整公司登記名稱或統一編號查詢。'
        : undefined,
  };
}
