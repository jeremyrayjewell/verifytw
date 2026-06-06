import type { Metadata } from 'next';
import { BrandHeader } from '@/components/BrandHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'VerifyTW 台企查 - 查公司、查雇主、查交易對象',
  description:
    '台灣公開資料查詢平台。查公司、查雇主、查交易對象。公開資料，一次看懂。',
  keywords: [
    '公司查詢',
    '台灣',
    '統一編號',
    '商工登記',
    '公開資料',
    '企業查詢',
  ],
  openGraph: {
    title: 'VerifyTW 台企查',
    description: '台灣公開資料查詢平台',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-surface text-main-ink font-sans">
        <BrandHeader />
        <main className="min-h-screen bg-surface">
          {children}
        </main>
        <footer className="bg-main-ink text-rice-paper py-2xl px-lg mt-5xl">
          <div className="max-w-6xl mx-auto text-center text-sm">
            <p className="mb-md">
              VerifyTW 台企查 © 2024. 
            </p>
            <p>
              查公司、查雇主、查交易對象。公開資料，一次看懂。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
