'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users2, ShieldCheck, Database, FileText } from 'lucide-react';
import { SearchBox } from '@/components/SearchBox';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { validateBan } from '@/lib/validation';

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    const banResult = validateBan(trimmedQuery);

    if (banResult.success) {
      router.push(`/company/${banResult.data}`);
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const searchExamples = [
    { label: '公司查詢', icon: Building2 },
    { label: '雇主查詢', icon: Users2 },
    { label: '交易對象', icon: Database },
    { label: '資料來源', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-rice-paper via-support-blue-gray to-surface px-lg pt-[56px] pb-[48px]">
        <div className="max-w-3xl mx-auto">
          {/* Hero Text */}
          <div className="text-center animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
              先查一下，再放心合作。
            </h1>
            <p className="text-xl md:text-2xl text-data-teal-text font-medium mb-lg">
              公開資料，一次看懂。
            </p>
            <p className="text-sm md:text-base text-neutral-600">
              Public-record checks for Taiwan companies, employers, and
              business partners.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-3xl animate-slideUp">
            <SearchBox
              onSearch={handleSearch}
              variant="hero"
              placeholder="輸入公司名稱、統一編號或負責人"
            />
            <p className="mt-md text-sm text-neutral-700 text-center">
              可輸入公司名稱、統一編號、負責人或英文名稱
            </p>
          </div>

          {/* Quick Access Chips */}
          <div className="mt-xl flex flex-wrap gap-md justify-center">
            {searchExamples.map((example) => {
              const Icon = example.icon;
              return (
                <button
                  key={example.label}
                  onClick={() =>
                    handleSearch(
                      example.label === '公司查詢'
                        ? '台灣'
                        : example.label === '雇主查詢'
                          ? '股份有限'
                          : example.label === '交易對象'
                            ? '貿易'
                            : '經濟部商工登記公開資料'
                    )
                  }
                  className="flex items-center gap-sm px-lg py-md rounded-full bg-form-gray hover:bg-civic-blue hover:text-surface text-main-ink font-medium text-sm transition-all duration-base focus-ring"
                >
                  <Icon size={18} />
                  {example.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3xl">
            <div className="max-w-3xl mx-auto">
              <NoticeBox type="info">
                資料來源為公開資料；查詢結果僅供初步參考。
              </NoticeBox>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="py-3xl px-lg bg-rice-paper scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-main-ink mb-2xl text-center">
            查詢說明
          </h2>
          <div className="grid md:grid-cols-3 gap-xl">
            <div className="bg-surface rounded-base border-2 border-form-gray p-xl">
              <Building2 size={32} className="text-civic-blue mb-lg" />
              <h3 className="text-lg font-semibold text-main-ink mb-md">
                公司查詢
              </h3>
              <p className="text-sm text-neutral-700">
                查詢公司名稱、統一編號、負責人、資本額與登記地址。
              </p>
            </div>
            <div className="bg-surface rounded-base border-2 border-form-gray p-xl">
              <FileText size={32} className="text-data-teal mb-lg" />
              <h3 className="text-lg font-semibold text-main-ink mb-md">
                資料來源
              </h3>
              <p className="text-sm text-neutral-700">
                整理政府公開資料，並標示來源與更新日期。
              </p>
            </div>
            <div className="bg-surface rounded-base border-2 border-form-gray p-xl">
              <ShieldCheck size={32} className="text-island-green mb-lg" />
              <h3 className="text-lg font-semibold text-main-ink mb-md">
                隱私保護
              </h3>
              <p className="text-sm text-neutral-700">
                不販售個人資料；查詢結果僅供初步參考。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-lg py-2xl">
        <div className="max-w-4xl mx-auto">
          <DeeperCheckCTA />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-3xl px-lg scroll-mt-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-main-ink mb-lg">
            關於 VerifyTW
          </h2>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed mb-xl">
            VerifyTW 台企查 是一個台灣公開資料查詢平台，致力於透過整理公開登記資料，協助你在商業合作前快速驗證企業資訊。
          </p>
          <p className="text-sm text-neutral-600">
            我們相信透明的資訊和可信的資料，是建立安心合作關係的基礎。
          </p>
        </div>
      </section>
    </div>
  );
}
