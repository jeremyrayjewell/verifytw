import { searchCompanies } from '@/lib/mockCompanies';
import { searchMoeaCompaniesByKeyword, isMoeaLookupDisabled } from '@/lib/sources/moea';
import { validateBan, validateSearchQuery } from '@/lib/validation';
import type { Company, SearchFilter } from '@/types/company';

export interface CompanySearchResult {
  companies: Company[];
  dataState: 'live' | 'mock' | 'fallback_mock' | 'no_results' | 'invalid_query';
  resultState:
    | 'live_success'
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

const COMPANY_NAME_SUFFIXES = ['股份有限公司', '有限公司', '公司'] as const;

interface LiveKeywordCandidate {
  query: string;
  notes: string[];
}

function buildLiveKeywordCandidates(query: string): LiveKeywordCandidate[] {
  const candidates: LiveKeywordCandidate[] = [];
  const seen = new Set<string>();
  const mapped = COMPANY_NAME_ALIAS_MAP[query];
  const normalized = mapped ?? query;

  const pushCandidate = (candidateQuery: string, notes: string[]) => {
    if (!candidateQuery || seen.has(candidateQuery)) {
      return;
    }

    seen.add(candidateQuery);
    candidates.push({
      query: candidateQuery,
      notes,
    });
  };

  if (mapped) {
    pushCandidate(mapped, [
      `已使用常見簡稱對應查詢：「${query}」→「${mapped}」`,
      'Used a known common-name mapping.',
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
  classification: 'live' | 'empty' | 'fallback' | 'unavailable' | 'parse-error' | 'mock' | 'invalid-query';
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
      helperText:
        mockResults.length > 0
          ? undefined
          : '沒有找到相符的公司登記公開資料。',
      searchNotes:
        mockResults.length > 0
          ? ['建議優先使用統一編號查詢，結果通常更準確。', 'For best results, use the 8-digit Business ID.']
          : [
              '建議優先使用統一編號查詢，結果通常更準確。',
              'For best results, use the 8-digit Business ID.',
            ],
    };
  }

  let liveResult = null as Awaited<ReturnType<typeof searchMoeaCompaniesByKeyword>> | null;
  let matchedCandidate = liveCandidates[0] ?? { query, notes: [] };

  for (const candidate of liveCandidates) {
    const candidateResult = await searchMoeaCompaniesByKeyword(candidate.query, {
      originalQuery: query,
      aliasExpandedQuery,
      broaderQuery,
    });
    liveResult = candidateResult;
    matchedCandidate = candidate;

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

  if (liveResult?.state === 'found') {
    const companies = sortAndFilterCompanies(liveResult.companies, filterType);

    logSearchClassification({
      query,
      filterType,
      classification: 'live',
      resultCount: companies.length,
      aliasExpandedQuery,
      broaderQuery,
      finalLiveQuery: matchedCandidate.query,
    });

    return {
      companies,
      dataState: 'live',
      resultState: 'live_success',
      query,
      filterType,
      searchNotes: [
        '建議優先使用統一編號查詢，結果通常更準確。',
        'For best results, use the 8-digit Business ID.',
        ...matchedCandidate.notes,
      ],
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
    const isFallbackState =
      liveResult.state === 'unavailable' ||
      liveResult.state === 'timeout' ||
      liveResult.state === 'parse_error';

    logSearchClassification({
      query,
      filterType,
      classification:
        isFallbackState
          ? 'fallback'
          : liveResult.state === 'parse_error'
            ? 'parse-error'
            : 'fallback',
      resultCount: mockResults.length,
      aliasExpandedQuery,
      broaderQuery,
      finalLiveQuery: matchedCandidate.query,
    });

    return {
      companies: mockResults,
      dataState: isFallbackState ? 'fallback_mock' : 'mock',
      resultState: isFallbackState ? 'fallback_mock' : 'mock',
      query,
      filterType,
      apiMessage: isFallbackState ? liveResult.message : undefined,
      searchNotes: [
        '建議優先使用統一編號查詢，結果通常更準確。',
        'For best results, use the 8-digit Business ID.',
        ...matchedCandidate.notes,
      ],
    };
  }

  logSearchClassification({
      query,
      filterType,
      classification:
      liveResult.state === 'unavailable' || liveResult.state === 'timeout'
        ? 'unavailable'
        : liveResult.state === 'parse_error'
          ? 'parse-error'
          : 'empty',
      resultCount: 0,
      aliasExpandedQuery,
      broaderQuery,
      finalLiveQuery: matchedCandidate.query,
    });

  return {
    companies: [],
    dataState: 'no_results',
    resultState:
      liveResult.state === 'timeout'
        ? 'live_timeout'
        : liveResult.state === 'unavailable'
          ? 'live_unavailable'
          : liveResult.state === 'parse_error'
            ? 'parse_error'
            : 'live_zero_results',
    query,
    filterType,
    apiMessage: liveResult.message,
    helperText:
      liveResult.state === 'not_found'
        ? '可能原因包括：使用了簡稱、登記名稱不同、資料尚未更新，或目前查詢範圍尚未涵蓋。建議改用完整公司登記名稱或統一編號查詢。'
        : liveResult.state === 'timeout'
          ? '建議稍後再試，或直接改用 8 碼統一編號查詢。'
          : undefined,
    searchNotes: [
      '建議優先使用統一編號查詢，結果通常更準確。',
      'For best results, use the 8-digit Business ID.',
      ...matchedCandidate.notes,
    ],
  };
}
