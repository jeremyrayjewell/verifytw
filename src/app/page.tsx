'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users2, TrendingUp, Lock } from 'lucide-react';
import { SearchBox } from '@/components/SearchBox';
import { Chip } from '@/components/ui/Chip';
import { NoticeBox } from '@/components/ui/NoticeBox';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const searchExamples = [
    { label: '公司查詢', icon: Building2 },
    { label: '雇主查詢', icon: Users2 },
    { label: '交易對象', icon: TrendingUp },
    { label: '公開資料', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-rice-paper via-support-blue-gray to-surface py-3xl md:py-5xl px-lg">
        <div className="max-w-3xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-3xl md:mb-4xl animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
              先查一下，再放心合作。
            </h1>
            <p className="text-xl md:text-2xl text-data-teal-text font-medium mb-lg">
              公開資料，一次看懂。
            </p>
            <p className="text-base md:text-lg text-neutral-700">
              Check Taiwan companies, employers, and business partners with
              public records.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-slideUp">
            <SearchBox
              onSearch={handleSearch}
              variant="hero"
              placeholder="輸入公司名稱、統一編號或負責人"
            />
          </div>

          {/* Quick Access Chips */}
          <div className="mt-2xl flex flex-wrap gap-md justify-center">
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
                          : '有限'
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
        </div>
      </section>

      {/* Trust Note */}
      <section className="py-2xl px-lg">
        <div className="max-w-3xl mx-auto">
          <NoticeBox type="info">
            本平台整理公開資料，協助你快速理解基本資訊；查詢結果不等於法律或投資建議。
          </NoticeBox>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="py-3xl px-lg bg-rice-paper">
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
                搜尋經濟部登記的台灣公司資訊，包括公司名稱、統一編號、代表人、資本額等公開資訊。
              </p>
            </div>
            <div className="bg-surface rounded-base border-2 border-form-gray p-xl">
              <Users2 size={32} className="text-data-teal mb-lg" />
              <h3 className="text-lg font-semibold text-main-ink mb-md">
                透明查詢
              </h3>
              <p className="text-sm text-neutral-700">
                提供公開登記資料，幫助你快速驗證合作夥伴和商業對象的基本資訊。
              </p>
            </div>
            <div className="bg-surface rounded-base border-2 border-form-gray p-xl">
              <Lock size={32} className="text-island-green mb-lg" />
              <h3 className="text-lg font-semibold text-main-ink mb-md">
                隱私保護
              </h3>
              <p className="text-sm text-neutral-700">
                僅提供官方公開資料，不收集個人查詢紀錄。您的隱私是我們的優先。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-3xl px-lg">
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
