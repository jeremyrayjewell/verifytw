import { validateBan } from '@/lib/validation';

// Research spike only:
// The MOF tax-business registration dataset is published as a large file dataset,
// not as a small per-record live lookup endpoint like the current MOEA sources.
// Keep this module conservative until we have an ingestion/caching step.

export const MOF_TAX_DATASET_PAGE_URL = 'https://data.gov.tw/dataset/9400';
export const MOF_TAX_DATASET_ZIP_URL = 'https://eip.fia.gov.tw/data/BGMOPEN1.zip';
export const MOF_TAX_DATASET_CSV_URL = 'https://eip.fia.gov.tw/data/BGMOPEN1.csv';

export const MOF_SOURCE_NAME_ZH = '財政部營業（稅籍）登記資料';
export const MOF_SOURCE_NAME_EN = 'MOF tax-business registration data';

export interface MofTaxRegistrationRecordRaw {
  '統一編號'?: string;
  '總機構統一編號'?: string;
  '營業人名稱'?: string;
  '營業地址'?: string;
  '資本額'?: string;
  '設立日期'?: string;
  '組織別名稱'?: string;
  '使用統一發票'?: string;
  '行業代號'?: string;
  '名稱'?: string;
  '行業代號1'?: string;
  '名稱1'?: string;
  '行業代號2'?: string;
  '名稱2'?: string;
  '行業代號3'?: string;
  '名稱3'?: string;
}

export interface MofIndustryCode {
  code: string;
  name: string;
}

export interface NormalizedMofTaxRegistrationRecord {
  businessId: string;
  headOfficeBusinessId?: string;
  taxRegistrationName?: string;
  taxRegistrationAddress?: string;
  capitalAmount?: number;
  establishedDate?: string;
  organizationType?: string;
  usesUniformInvoice?: 'Y' | 'N';
  industries: MofIndustryCode[];
  sourceType: 'mof_tax_registration';
  sourceNameZh: typeof MOF_SOURCE_NAME_ZH;
  sourceNameEn: typeof MOF_SOURCE_NAME_EN;
}

export interface MofLookupResult {
  record: NormalizedMofTaxRegistrationRecord | null;
  state:
    | 'not_implemented'
    | 'invalid_ban'
    | 'not_found'
    | 'ingestion_required'
    | 'unavailable';
  message: string;
}

export function getMofTaxResearchNotes() {
  return {
    datasetPageUrl: MOF_TAX_DATASET_PAGE_URL,
    zipDownloadUrl: MOF_TAX_DATASET_ZIP_URL,
    csvDownloadUrl: MOF_TAX_DATASET_CSV_URL,
    sourceNameZh: MOF_SOURCE_NAME_ZH,
    sourceNameEn: MOF_SOURCE_NAME_EN,
    accessPattern:
      'Official open-data file dataset (CSV download with ZIP archive reference), not a proven small live lookup API for per-request Business ID queries.',
    operationalRecommendation:
      'Build a local generated index or cache from the CSV/ZIP dataset before wiring MOF cross-checks into production detail pages.',
    notes: [
      'The public dataset page says the open file currently covers active tax registrations only.',
      'The dataset page lists daily update frequency.',
      'Per-request runtime downloads would be too heavy for production page rendering.',
    ],
  };
}

function normalizeCapitalAmount(value?: string): number | undefined {
  const raw = value?.replace(/,/g, '').trim();
  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function normalizeUniformInvoiceFlag(value?: string): 'Y' | 'N' | undefined {
  const raw = value?.trim();
  if (!raw) {
    return undefined;
  }

  if (/(是|Y|Yes|true|1)/i.test(raw)) {
    return 'Y';
  }

  if (/(否|N|No|false|0)/i.test(raw)) {
    return 'N';
  }

  return undefined;
}

function normalizeIndustryCodes(row: MofTaxRegistrationRecordRaw): MofIndustryCode[] {
  const pairs: Array<[string | undefined, string | undefined]> = [
    [row['行業代號'], row['名稱']],
    [row['行業代號1'], row['名稱1']],
    [row['行業代號2'], row['名稱2']],
    [row['行業代號3'], row['名稱3']],
  ];

  return pairs.reduce<MofIndustryCode[]>((acc, [code, name]) => {
    const normalizedCode = code?.trim();
    const normalizedName = name?.trim();

    if (!normalizedCode && !normalizedName) {
      return acc;
    }

    acc.push({
      code: normalizedCode ?? '',
      name: normalizedName ?? '',
    });
    return acc;
  }, []);
}

export function normalizeMofTaxRegistrationRecord(
  row: MofTaxRegistrationRecordRaw
): NormalizedMofTaxRegistrationRecord | null {
  const businessId = row['統一編號']?.trim();
  if (!businessId) {
    return null;
  }

  return {
    businessId,
    headOfficeBusinessId: row['總機構統一編號']?.trim() || undefined,
    taxRegistrationName: row['營業人名稱']?.trim() || undefined,
    taxRegistrationAddress: row['營業地址']?.trim() || undefined,
    capitalAmount: normalizeCapitalAmount(row['資本額']),
    establishedDate: row['設立日期']?.trim() || undefined,
    organizationType: row['組織別名稱']?.trim() || undefined,
    usesUniformInvoice: normalizeUniformInvoiceFlag(row['使用統一發票']),
    industries: normalizeIndustryCodes(row),
    sourceType: 'mof_tax_registration',
    sourceNameZh: MOF_SOURCE_NAME_ZH,
    sourceNameEn: MOF_SOURCE_NAME_EN,
  };
}

export async function fetchMofTaxRegistrationByBusinessId(
  businessId: string
): Promise<MofLookupResult> {
  const parsedBan = validateBan(businessId);
  if (!parsedBan.success) {
    return {
      record: null,
      state: 'invalid_ban',
      message: parsedBan.error.issues[0]?.message ?? 'Please enter an 8-digit Business ID.',
    };
  }

  // TODO: Replace this placeholder with a generated local index lookup after adding
  // an ingestion step for the MOF CSV/ZIP dataset.
  // TODO: Decide whether the index should live in git-generated assets, build output,
  // or a future cache/database layer.
  return {
    record: null,
    state: 'ingestion_required',
    message:
      'MOF tax-business registration lookup is not wired for runtime requests yet. This dataset likely needs CSV/ZIP ingestion and a local index first.',
  };
}
