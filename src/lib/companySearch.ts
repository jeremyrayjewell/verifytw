import { searchCompanies } from '@/lib/mockCompanies';
import {
  isMoeaLookupDisabled,
  searchMoeaBusinessesByKeyword,
  searchMoeaCompaniesByKeyword,
} from '@/lib/sources/moea';
import { validateBan, validateSearchQuery } from '@/lib/validation';
import type { Company, SearchFilter } from '@/types/company';

export interface CompanySearchResult {
  companies: Company[];
  dataState:
    | 'live'
    | 'live_partial'
    | 'mock'
    | 'fallback_mock'
    | 'no_results'
    | 'invalid_query';
  resultState:
    | 'live_success'
    | 'live_partial_success'
    | 'live_timeout'
    | 'live_zero_results'
    | 'fallback_mock'
    | 'mock'
    | 'invalid_query'
    | 'live_unavailable'
    | 'parse_error';
  query: string;
  filterType: SearchFilter;
  apiMessage?: string;
  helperText?: string;
  searchNotes?: string[];
}

const COMPANY_NAME_ALIAS_MAP: Record<string, string> = {
  台積電: '台灣積體電路製造股份有限公司',
  鴻海: '鴻海精密工業股份有限公司',
  宏碁: '宏碁股份有限公司',
};

const ENGLISH_ALIAS_MAP: Record<string, string> = {
  acer: '宏碁股份有限公司',
  tsmc: '台灣積體電路製造股份有限公司',
  foxconn: '鴻海精密工業股份有限公司',
  asus: '華碩電腦股份有限公司',
};

const COMPANY_NAME_SUFFIXES = ['股份有限公司', '有限公司', '公司'] as const;

interface LiveKeywordCandidate {
  query: string;
  notes: string[];
}

function normalizeRegisteredChineseName(value: string): string {
  return value.replace(/\s+/g, '').trim();
}

function buildLiveKeywordCandidates(query: string): LiveKeywordCandidate[] {
  const candidates: LiveKeywordCandidate[] = [];
  const seen = new Set<string>();
  const normalizedLowerQuery = query.toLowerCase();
  const mapped =
    COMPANY_NAME_ALIAS_MAP[query] ??
    ENGLISH_ALIAS_MAP[normalizedLowerQuery];
  const normalized = mapped ?? query;

  const pushCandidate = (candidateQuery: string, notes: string[]) => {
    if (!candidateQuery || seen.has(candidateQuery)) {
      return;
    }

    seen.add(candidateQuery);
    candidates.push({ query: candidateQuery, notes });
  };

  if (mapped) {
    pushCandidate(mapped, [
      ENGLISH_ALIAS_MAP[normalizedLowerQuery]
        ? `已使用常見英文簡稱對應查詢：「${query}」→「${mapped}」`
        : `已使用常見簡稱對應查詢：「${query}」→「${mapped}」`,
      ENGLISH_ALIAS_MAP[normalizedLowerQuery]
        ? 'Used a known English alias mapping.'
        : 'Used a known common-name mapping.',
    ]);
  } else {
    pushCandidate(normalized, []);
  }

  for (const suffix of COMPANY_NAME_SUFFIXES) {
    if (normalized.endsWith(suffix)) {
      const stripped = normalized.slice(0, -suffix.length).trim();
      if (stripped.length >= 2) {
        pushCandidate(stripped, [
          '已嘗試使用較寬鬆的公司名稱查詢。',
          'Tried a broader company-name search.',
        ]);
      }
    }
  }

  return candidates;
}

function logSearchClassification(details: {
  query: string;
  filterType: SearchFilter;
  classification:
    | 'live'
    | 'live-partial'
    | 'empty'
    | 'fallback'
    | 'unavailable'
    | 'parse-error'
    | 'mock'
    | 'invalid-query';
  resultCount: number;
  aliasExpandedQuery?: string;
  broaderQuery?: string;
  finalLiveQuery?: string;
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

function mergeLiveResults(companies: Company[]): Company[] {
  const byBan = new Map<string, Company>();

  for (const company of companies) {
    const existing = byBan.get(company.ban);
    if (!existing) {
      byBan.set(company.ban, company);
      continue;
    }

    if (existing.entityType === 'business' && company.entityType === 'company') {
      byBan.set(company.ban, company);
    }
  }

  return [...byBan.values()];
}

function shouldSuppressPartialSourceWarning(options: {
  filterType: SearchFilter;
  matchedCompanyCandidate: LiveKeywordCandidate;
  query: string;
  companyLiveFound: boolean;
  companyLiveCompanies: Company[];
  companyFailed: boolean;
  businessFailed: boolean;
  filteredLiveResults: Company[];
}) {
  const {
    filterType,
    matchedCompanyCandidate,
    query,
    companyLiveFound,
    companyLiveCompanies,
    companyFailed,
    businessFailed,
    filteredLiveResults,
  } = options;

  if (companyFailed || !businessFailed) {
    return false;
  }

  if (filterType !== 'all' && filterType !== 'company') {
    return false;
  }

  if (!companyLiveFound) {
    return false;
  }

  const hasCompanyResult = filteredLiveResults.some(
    (company) => company.entityType === 'company'
  );

  if (!hasCompanyResult) {
    return false;
  }

  const usedAlias = matchedCompanyCandidate.notes.some(
    (note) =>
      note.includes('常見簡稱對應') || note.includes('English alias mapping')
  );
  const normalizedQuery = normalizeRegisteredChineseName(query);
  const hasExactRegisteredNameCompanyHit = companyLiveCompanies.some(
    (company) =>
      normalizeRegisteredChineseName(company.nameZh) === normalizedQuery
  );

  return usedAlias || hasExactRegisteredNameCompanyHit;
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
      resultState: 'invalid_query',
      query: rawQuery.trim(),
      filterType,
      apiMessage: parsedQuery.error.issues[0]?.message,
    };
  }

  const query = parsedQuery.data.query;
  const liveCandidates = buildLiveKeywordCandidates(query);
  const aliasExpandedQuery =
    liveCandidates.find((candidate) =>
      candidate.notes.some((note) => note.includes('常見簡稱對應'))
    )?.query;
  const broaderQuery =
    liveCandidates.find((candidate) =>
      candidate.notes.some((note) => note.includes('較寬鬆'))
    )?.query;
  const mockResults = searchCompanies(query, filterType);
  const isBusinessIdSearch = validateBan(query).success;

  if (isMoeaLookupDisabled() || isBusinessIdSearch) {
    logSearchClassification({
      query,
      filterType,
      classification: 'mock',
      resultCount: mockResults.length,
      aliasExpandedQuery,
      broaderQuery,
    });

    return {
      companies: mockResults,
      dataState: mockResults.length > 0 ? 'mock' : 'no_results',
      resultState: mockResults.length > 0 ? 'mock' : 'live_zero_results',
      query,
      filterType,
      helperText: mockResults.length > 0 ? undefined : '未找到相符登記資料。',
      searchNotes: [
        '建議優先使用統一編號查詢，結果通常更準確。',
        'For best results, use the 8-digit Business ID.',
      ],
    };
  }

  let companyLiveResult = null as Awaited<ReturnType<typeof searchMoeaCompaniesByKeyword>> | null;
  let matchedCompanyCandidate = liveCandidates[0] ?? { query, notes: [] };

  for (const candidate of liveCandidates) {
    const candidateResult = await searchMoeaCompaniesByKeyword(candidate.query, {
      originalQuery: query,
      aliasExpandedQuery,
      broaderQuery,
    });
    companyLiveResult = candidateResult;
    matchedCompanyCandidate = candidate;

    if (candidateResult.state === 'found') {
      break;
    }

    if (
      candidateResult.state === 'unavailable' ||
      candidateResult.state === 'timeout' ||
      candidateResult.state === 'parse_error'
    ) {
      break;
    }
  }

  const businessLiveResult = await searchMoeaBusinessesByKeyword(query, {
    originalQuery: query,
  });

  const combinedLiveResults = mergeLiveResults([
    ...(companyLiveResult?.state === 'found' ? companyLiveResult.companies : []),
    ...(businessLiveResult.state === 'found' ? businessLiveResult.companies : []),
  ]);

  const filteredLiveResults = sortAndFilterCompanies(combinedLiveResults, filterType);

  const companyFailed =
    companyLiveResult?.state === 'unavailable' ||
    companyLiveResult?.state === 'timeout' ||
    companyLiveResult?.state === 'parse_error';
  const businessFailed =
    businessLiveResult.state === 'unavailable' ||
    businessLiveResult.state === 'timeout' ||
    businessLiveResult.state === 'parse_error';

  if (filteredLiveResults.length > 0) {
    const suppressPartialSourceWarning = shouldSuppressPartialSourceWarning({
      filterType,
      matchedCompanyCandidate,
      query,
      companyLiveFound: companyLiveResult?.state === 'found',
      companyLiveCompanies:
        companyLiveResult?.state === 'found' ? companyLiveResult.companies : [],
      companyFailed,
      businessFailed,
      filteredLiveResults,
    });
    const partialMessage =
      (companyFailed || businessFailed) && !suppressPartialSourceWarning
        ? '部分公開資料來源暫時無法回應。'
        : undefined;

    logSearchClassification({
      query,
      filterType,
      classification: partialMessage ? 'live-partial' : 'live',
      resultCount: filteredLiveResults.length,
      aliasExpandedQuery,
      broaderQuery,
      finalLiveQuery: matchedCompanyCandidate.query,
    });

    return {
      companies: filteredLiveResults,
      dataState: partialMessage ? 'live_partial' : 'live',
      resultState: partialMessage ? 'live_partial_success' : 'live_success',
      query,
      filterType,
      apiMessage: partialMessage,
      searchNotes: [
        '建議優先使用統一編號查詢，結果通常更準確。',
        'For best results, use the 8-digit Business ID.',
        ...matchedCompanyCandidate.notes,
      ],
    };
  }

  if (
    (companyFailed || businessFailed) &&
    mockResults.length > 0
  ) {
    logSearchClassification({
      query,
      filterType,
      classification: 'fallback',
      resultCount: mockResults.length,
      aliasExpandedQuery,
      broaderQuery,
      finalLiveQuery: matchedCompanyCandidate.query,
    });

    return {
      companies: mockResults,
      dataState: 'fallback_mock',
      resultState: 'fallback_mock',
      query,
      filterType,
      apiMessage: '部分公開資料來源暫時無法回應。',
      searchNotes: [
        '建議優先使用統一編號查詢，結果通常更準確。',
        'For best results, use the 8-digit Business ID.',
        ...matchedCompanyCandidate.notes,
      ],
    };
  }

  if (
    companyFailed &&
    businessFailed
  ) {
    logSearchClassification({
      query,
      filterType,
      classification: 'unavailable',
      resultCount: 0,
      aliasExpandedQuery,
      broaderQuery,
      finalLiveQuery: matchedCompanyCandidate.query,
    });

    return {
      companies: [],
      dataState: 'no_results',
      resultState:
        companyLiveResult?.state === 'parse_error' || businessLiveResult.state === 'parse_error'
          ? 'parse_error'
          : companyLiveResult?.state === 'timeout' || businessLiveResult.state === 'timeout'
            ? 'live_timeout'
            : 'live_unavailable',
      query,
      filterType,
      apiMessage:
        companyLiveResult?.message ??
        businessLiveResult.message ??
        '暫時無法取得即時公開資料，請稍後再試。',
      helperText:
        companyLiveResult?.state === 'timeout' || businessLiveResult.state === 'timeout'
          ? '建議稍後再試，或直接改用 8 碼統一編號查詢。'
          : undefined,
      searchNotes: [
        '建議優先使用統一編號查詢，結果通常更準確。',
        'For best results, use the 8-digit Business ID.',
        ...matchedCompanyCandidate.notes,
      ],
    };
  }

  const noResultsMessage = '未找到相符登記資料。';

  logSearchClassification({
    query,
    filterType,
    classification: 'empty',
    resultCount: 0,
    aliasExpandedQuery,
    broaderQuery,
    finalLiveQuery: matchedCompanyCandidate.query,
  });

  return {
    companies: [],
    dataState: 'no_results',
    resultState: 'live_zero_results',
    query,
    filterType,
    apiMessage: noResultsMessage,
    helperText:
      '可能原因包括：使用了簡稱、登記名稱不同、資料尚未更新，或目前查詢範圍尚未涵蓋。建議使用完整名稱或統一編號再次查詢。',
    searchNotes: [
      '建議優先使用統一編號查詢，結果通常更準確。',
      'For best results, use the 8-digit Business ID.',
      ...matchedCompanyCandidate.notes,
    ],
  };
}
