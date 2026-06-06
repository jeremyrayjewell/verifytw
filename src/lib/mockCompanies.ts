import type { Company, SearchFilter } from '@/types/company';
import { assertValidCompanies, validateBan, validateSearchQuery } from '@/lib/validation';

export const MOCK_DATA_SYNC_DATE = '2026/06/06';

const mockCompanyRecords: Company[] = assertValidCompanies([
  {
    ban: '12345678',
    nameZh: '台北城景資訊股份有限公司',
    nameEn: 'Taipei Cityview Data Co., Ltd.',
    status: '資料相符',
    representative: '王小明',
    capital: '12,000,000',
    address: '臺北市中山區南京東路二段88號 6 樓',
    establishedDate: '2014/03/18',
    lastUpdated: '2026/05/10',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/05/10',
    entityType: 'company',
    statusLabel: '目前公開資料顯示此公司為核准設立。',
  },
  {
    ban: '87654321',
    nameZh: '新北數據服務有限公司',
    nameEn: 'New Taipei Data Services Ltd.',
    status: '資料相符',
    representative: '李美英',
    capital: '5,000,000',
    address: '新北市板橋區文化路一段258號 9 樓',
    establishedDate: '2017/09/06',
    lastUpdated: '2026/05/28',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/05/28',
    entityType: 'company',
    statusLabel: '公司名稱與統一編號可對應。',
    flags: ['address_not_verified'],
  },
  {
    ban: '24681357',
    nameZh: '高雄港都貿易股份有限公司',
    nameEn: 'Kaohsiung Harbor Trading Co., Ltd.',
    status: '建議再確認',
    representative: '陳建國',
    capital: '10,000,000',
    address: '高雄市苓雅區四維四路199號 12 樓',
    establishedDate: '2009/11/02',
    lastUpdated: '2026/04/20',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/04/20',
    entityType: 'company',
    statusLabel: '部分資訊仍建議與對方提供的文件、合約或付款資訊交叉確認。',
    flags: ['recent_address_change'],
  },
  {
    ban: '13579246',
    nameZh: '中台灣物流商業社',
    nameEn: 'Central Taiwan Logistics Business',
    status: '資料相符',
    representative: '曾志安',
    capital: '800,000',
    address: '臺中市西屯區工業區二路50號 1 樓',
    establishedDate: '2016/01/12',
    lastUpdated: '2026/03/14',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/03/14',
    entityType: 'business',
    statusLabel: '目前公開資料可對應此商業登記。',
  },
  {
    ban: '97531842',
    nameZh: '台南營造工程股份有限公司',
    nameEn: 'Tainan Construction Engineering Co., Ltd.',
    status: '無公開資料',
    representative: '黃進財',
    capital: '15,000,000',
    address: '臺南市永康區中華路260號 5 樓',
    establishedDate: '2005/11/01',
    lastUpdated: '2026/02/18',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/02/18',
    entityType: 'company',
    statusLabel: '目前公開資料仍不足，建議進一步比對正式文件。',
    flags: ['missing_tax_data'],
  },
  {
    ban: '55443322',
    nameZh: '基隆海運有限公司',
    nameEn: 'Keelung Maritime Co., Ltd.',
    status: '資料取得中',
    representative: '吳海濱',
    capital: '3,000,000',
    address: '基隆市中山區成功二路115號 3 樓',
    establishedDate: '2018/09/14',
    lastUpdated: '2026/06/01',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/06/01',
    entityType: 'company',
    statusLabel: '部分欄位仍在整理中，建議稍後再次確認。',
  },
  {
    ban: '66778899',
    nameZh: '宜蘭農業科技股份有限公司羅東分公司',
    nameEn: 'Yilan AgriTech Co., Ltd. Luodong Branch',
    status: '資料相符',
    representative: '林田野',
    capital: '0',
    address: '宜蘭縣羅東鎮公正路128號 2 樓',
    establishedDate: '2020/07/08',
    lastUpdated: '2026/05/25',
    source: '示範資料（Mock）｜對應未來經濟部商工登記公開資料欄位',
    sourceUpdated: '2026/05/25',
    entityType: 'branch',
    statusLabel: '分公司名稱與統一編號可對應。',
  },
]);

export const mockCompanies: Company[] = mockCompanyRecords;

/**
 * Search companies by keyword, BAN, or representative name.
 * TODO: Replace with MOEA company keyword search.
 * TODO: Hydrate results from Supabase cache/database before falling back to live sources.
 */
export function searchCompanies(query: string, type: SearchFilter = 'all'): Company[] {
  const parsed = validateSearchQuery(query, type);
  if (!parsed.success) {
    return [];
  }

  const normalizedQuery = parsed.data.query;
  const lowerQuery = normalizedQuery.toLowerCase();
  const isBanSearch = /^\d{1,8}$/.test(normalizedQuery);

  const filtered = mockCompanies.filter((company) => {
    const matchesText =
      company.nameZh.toLowerCase().includes(lowerQuery) ||
      company.nameEn?.toLowerCase().includes(lowerQuery) ||
      company.ban.includes(normalizedQuery) ||
      company.representative.toLowerCase().includes(lowerQuery);

    if (!matchesText) return false;

    if (type !== 'all' && type !== 'recent' && company.entityType !== type) {
      return false;
    }

    return true;
  });

  if (type === 'recent') {
    return [...filtered].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
  }

  if (isBanSearch) {
    return [...filtered].sort((a, b) => {
      if (a.ban === normalizedQuery) return -1;
      if (b.ban === normalizedQuery) return 1;
      return a.nameZh.localeCompare(b.nameZh, 'zh-Hant');
    });
  }

  return filtered;
}

/**
 * Look up one company by BAN.
 * TODO: Replace with MOEA company registration lookup by 統一編號.
 * TODO: Enrich with MOF tax registration data when available.
 * TODO: Read/write Supabase cache/database for detail pages.
 */
export function getCompanyByBan(ban: string): Company | undefined {
  const parsed = validateBan(ban);
  if (!parsed.success) {
    return undefined;
  }

  return mockCompanies.find((company) => company.ban === parsed.data);
}
