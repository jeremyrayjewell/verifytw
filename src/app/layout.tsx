import type { Metadata } from 'next';
import { BrandHeader } from '@/components/BrandHeader';
import { SiteFooter } from '@/components/SiteFooter';
import './globals.css';

export const metadata: Metadata = {
  title: 'VerifyTW 台企查',
  description:
    '台灣公司、雇主與交易對象的公開資料查詢與解讀工具。Public-record lookup for Taiwan companies, employers, and business partners.',
  keywords: ['公司查詢', '台灣', '統一編號', '商工登記', '公開資料', '企業查詢'],
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'icon',
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  openGraph: {
    title: 'VerifyTW 台企查',
    description:
      '台灣公司、雇主與交易對象的公開資料查詢與解讀工具。Public-record lookup for Taiwan companies, employers, and business partners.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'VerifyTW 台企查',
    description:
      '台灣公司、雇主與交易對象的公開資料查詢與解讀工具。Public-record lookup for Taiwan companies, employers, and business partners.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-surface text-main-ink font-sans">
        <BrandHeader />
        <main className="min-h-screen bg-surface">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
