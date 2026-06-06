'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Chip } from '@/components/ui/Chip';
import { NoticeBox } from '@/components/ui/NoticeBox';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DesignSystemPage() {
  const [selectedStatus, setSelectedStatus] = React.useState('資料相符');
  const colorTokens = [
    { name: 'main-ink', hex: '#102A43' },
    { name: 'civic-blue', hex: '#2563A6' },
    { name: 'data-teal', hex: '#159A9C' },
    { name: 'data-teal-text', hex: '#0B6F71' },
    { name: 'island-green', hex: '#4F8F6B' },
    { name: 'stamp-red', hex: '#C94C4C' },
    { name: 'stamp-red-text', hex: '#9F2F2F' },
    { name: 'rice-paper', hex: '#F8F3E7' },
    { name: 'form-gray', hex: '#E7E2D8' },
    { name: 'support-blue-gray', hex: '#DCE6F1' },
    { name: 'surface', hex: '#FFFFFF' },
  ];

  const typographyScale = [
    { size: 'xs', example: 'Caption 12px / 16px' },
    { size: 'sm', example: 'Small 14px / 18px' },
    { size: 'base', example: 'Body 16px / 24px' },
    { size: 'lg', example: 'Large 18px / 28px' },
    { size: 'xl', example: 'Extra Large 20px / 28px' },
    { size: '2xl', example: 'Display 24px / 32px' },
    { size: '3xl', example: 'Headline 32px / 40px' },
    { size: '4xl', example: 'Hero 40px / 48px' },
  ];

  const spacings = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

  return (
    <div className="min-h-screen bg-surface py-2xl px-lg">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-main-ink mb-lg">VerifyTW 設計系統</h1>
        <p className="text-lg text-neutral-700 mb-3xl">
          內部參考頁面 - 用於驗證設計系統的一致性
        </p>

        {/* Colors Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">色彩系統</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
            {colorTokens.map((token) => (
              <div key={token.name} className="space-y-md">
                <div
                  className="w-full h-24 rounded-base border-2 border-form-gray shadow-sm"
                  style={{ backgroundColor: token.hex }}
                />
                <div>
                  <p className="font-mono text-sm font-semibold text-main-ink">
                    {token.name}
                  </p>
                  <p className="font-mono text-xs text-neutral-600">
                    {token.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">排版</h2>
          <div className="space-y-lg">
            {typographyScale.map((item) => (
              <div key={item.size} className="p-lg bg-rice-paper rounded-base">
                <p className={`text-${item.size} font-medium text-main-ink mb-xs`}>
                  {item.example}
                </p>
                <p className={`text-${item.size} text-neutral-700`}>
                  台灣公開資料查詢平台 - 公開資料，一次看懂。
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">按鈕</h2>

          <div className="space-y-2xl">
            {/* Primary Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-main-ink mb-lg">Primary</h3>
              <div className="flex flex-wrap gap-lg">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Button variant="primary" size="md" disabled>
                  Disabled
                </Button>
                <Button variant="primary" size="md" isLoading>
                  Loading
                </Button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-main-ink mb-lg">Secondary</h3>
              <div className="flex flex-wrap gap-lg">
                <Button variant="secondary" size="sm">
                  Small
                </Button>
                <Button variant="secondary" size="md">
                  Medium
                </Button>
                <Button variant="secondary" size="lg">
                  Large
                </Button>
              </div>
            </div>

            {/* Outline Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-main-ink mb-lg">Outline</h3>
              <div className="flex flex-wrap gap-lg">
                <Button variant="outline" size="md">
                  Default
                </Button>
                <Button variant="outline" size="md" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-main-ink mb-lg">Ghost</h3>
              <div className="flex flex-wrap gap-lg">
                <Button variant="ghost" size="md">
                  Default
                </Button>
              </div>
            </div>

            {/* Danger Buttons */}
            <div>
              <h3 className="text-lg font-semibold text-main-ink mb-lg">Danger</h3>
              <div className="flex flex-wrap gap-lg">
                <Button variant="danger" size="md">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">輸入框</h2>
          <div className="space-y-lg max-w-md">
            <Input
              label="標準輸入框"
              placeholder="輸入內容..."
            />
            <Input
              label="有錯誤的輸入框"
              placeholder="輸入內容..."
              error="此欄位為必填"
            />
            <Input
              label="禁用輸入框"
              placeholder="禁用"
              disabled
            />
          </div>
        </section>

        {/* Status Badge Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">狀態標籤</h2>
          <div className="flex flex-wrap gap-lg">
            <StatusBadge status="資料相符" size="md" />
            <StatusBadge status="建議再確認" size="md" />
            <StatusBadge status="資料取得中" size="md" />
            <StatusBadge status="無公開資料" size="md" />
          </div>
        </section>

        {/* Chip Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">篩選籌碼</h2>
          <div className="flex flex-wrap gap-lg">
            <Chip label="全部" selected />
            <Chip label="公司" />
            <Chip label="商業" />
            <Chip label="分公司" />
          </div>
        </section>

        {/* Notice Box Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">通知盒</h2>
          <div className="space-y-lg">
            <NoticeBox type="info" title="資訊">
              這是一則資訊通知。包含重要提示或說明。
            </NoticeBox>
            <NoticeBox type="warning" title="警告">
              這是一則警告通知。用於提醒可能的問題。
            </NoticeBox>
            <NoticeBox type="error" title="錯誤">
              這是一則錯誤通知。指出需要修正的問題。
            </NoticeBox>
            <NoticeBox type="success" title="成功">
              這是一則成功通知。確認操作已完成。
            </NoticeBox>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">間距 (8px Grid)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
            {spacings.map((spacing) => {
              const sizeMap: Record<string, string> = {
                xs: '4px',
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '24px',
                '2xl': '32px',
                '3xl': '40px',
                '4xl': '48px',
                '5xl': '64px',
              };
              const size = sizeMap[spacing];
              return (
                <div key={spacing} className="space-y-md">
                  <div
                    className="bg-civic-blue rounded-base"
                    style={{ height: size }}
                  />
                  <div>
                    <p className="font-semibold text-sm text-main-ink">
                      {spacing}
                    </p>
                    <p className="text-xs text-neutral-600">{size}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Loading Skeleton Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">載入骨架</h2>
          <div className="space-y-lg">
            <LoadingSkeleton className="h-12" />
            <LoadingSkeleton className="h-24" />
            <LoadingSkeleton className="h-48" count={3} />
          </div>
        </section>

        {/* Empty State Section */}
        <section className="mb-4xl">
          <h2 className="text-2xl font-bold text-main-ink mb-xl">空狀態</h2>
          <div className="bg-rice-paper rounded-base p-2xl">
            <EmptyState
              title="查無相關結果"
              description="請試試其他查詢詞，或確認輸入的統一編號、公司名稱是否正確。"
              action={{
                label: '返回首頁',
                onClick: () => {},
              }}
            />
          </div>
        </section>

        {/* Accessibility Section */}
        <section>
          <h2 className="text-2xl font-bold text-main-ink mb-xl">無障礙設計</h2>
          <div className="space-y-lg">
            <NoticeBox type="info" title="焦點管理">
              所有互動元素都支援鍵盤導航。使用 <kbd>Tab</kbd> 鍵移動焦點，<kbd>Enter</kbd> 確認。
            </NoticeBox>
            <NoticeBox type="info" title="色彩對比">
              所有文字都符合 WCAG AA 標準。紅色狀態使用 #9F2F2F（而非 #C94C4C）作為文字顏色。
            </NoticeBox>
            <NoticeBox type="info" title="動作偏好">
              支援 <code>prefers-reduced-motion</code>。用戶若啟用「減少動作」設置，動畫將被禁用。
            </NoticeBox>
          </div>
        </section>
      </div>
    </div>
  );
}
