import { Company } from '@/types/company';

export const mockCompanies: Company[] = [
  {
    ban: '12345678',
    nameZh: '台灣範例股份有限公司',
    nameEn: 'Taiwan Sample Technology Co., Ltd.',
    status: '資料相符',
    representative: '王小明',
    capital: '5,000,000',
    address: '臺北市中正區重慶南路一段10號',
    establishedDate: '2010/01/15',
    lastUpdated: '2024/05/20',
    source: '經濟部商工登記公開資料',
  },
  {
    ban: '87654321',
    nameZh: '新北數據科技有限公司',
    nameEn: 'New Taipei Data Tech Ltd.',
    status: '資料相符',
    representative: '李美英',
    capital: '2,000,000',
    address: '新北市板橋區文化路一段258號',
    establishedDate: '2015/08/22',
    lastUpdated: '2024/06/10',
    source: '經濟部商工登記公開資料',
    flags: ['address_not_verified'],
  },
  {
    ban: '24681357',
    nameZh: '高雄貿易股份有限公司',
    nameEn: 'Kaohsiung Trading Co., Ltd.',
    status: '建議再確認',
    representative: '陳建國',
    capital: '10,000,000',
    address: '高雄市苓雅區和平一路298號',
    establishedDate: '2008/03/05',
    lastUpdated: '2024/04/15',
    source: '經濟部商工登記公開資料',
    flags: ['recent_address_change'],
  },
  {
    ban: '13579246',
    nameZh: '中台灣物流有限公司',
    nameEn: 'Central Taiwan Logistics Co., Ltd.',
    status: '資料相符',
    representative: '曾志安',
    capital: '8,500,000',
    address: '臺中市西屯區工業區二路50號',
    establishedDate: '2012/06/18',
    lastUpdated: '2024/05/30',
    source: '經濟部商工登記公開資料',
  },
  {
    ban: '97531842',
    nameZh: '台南營造工程股份有限公司',
    nameEn: 'Tainan Construction Engineering Co., Ltd.',
    status: '無公開資料',
    representative: '黃進財',
    capital: '15,000,000',
    address: '台南市永康區中華路260號',
    establishedDate: '2005/11/01',
    lastUpdated: '2024/03/20',
    source: '經濟部商工登記公開資料',
    flags: ['missing_tax_data'],
  },
  {
    ban: '55443322',
    nameZh: '基隆海運有限公司',
    nameEn: 'Keelung Maritime Co., Ltd.',
    status: '資料取得中',
    representative: '吳海濱',
    capital: '3,000,000',
    address: '基隆市中山區成功二路115號',
    establishedDate: '2018/09/14',
    lastUpdated: '2024/06/01',
    source: '經濟部商工登記公開資料',
  },
  {
    ban: '66778899',
    nameZh: '宜蘭農業科技股份有限公司',
    nameEn: 'Yilan Agriculture Tech Co., Ltd.',
    status: '資料相符',
    representative: '林田野',
    capital: '4,500,000',
    address: '宜蘭縣冬山鄉梅花路50號',
    establishedDate: '2013/04/22',
    lastUpdated: '2024/05/25',
    source: '經濟部商工登記公開資料',
  },
];

/**
 * Search companies by query (name, BAN, or representative name)
 * TODO: Replace with real API call to MOEA company registration endpoint
 */
export function searchCompanies(query: string, type?: string): Company[] {
  const lowerQuery = query.toLowerCase();

  return mockCompanies.filter((company) => {
    const matchesQuery =
      company.nameZh.toLowerCase().includes(lowerQuery) ||
      company.nameEn?.toLowerCase().includes(lowerQuery) ||
      company.ban.includes(query) ||
      company.representative.toLowerCase().includes(lowerQuery);

    if (!matchesQuery) return false;

    // TODO: Add type filtering when API supports it
    // if (type && type !== 'all') {
    //   return company.type === type;
    // }

    return true;
  });
}

/**
 * Get a company by BAN
 * TODO: Replace with real API call to Supabase or MOEA endpoint
 */
export function getCompanyByBan(ban: string): Company | undefined {
  return mockCompanies.find((company) => company.ban === ban);
}
