import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-main-ink text-rice-paper py-2xl px-lg mt-5xl">
      <div className="max-w-6xl mx-auto text-center text-sm space-y-lg">
        <div className="space-y-sm">
          <p>VerifyTW 台企查 © 2024.</p>
          <p>查公司、查雇主、查交易對象。公開資料，一次看懂。</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-lg">
          <Link href="/data" className="hover:text-white focus-ring rounded-base">
            資料說明
          </Link>
          <Link href="/about" className="hover:text-white focus-ring rounded-base">
            關於我們
          </Link>
          <Link href="/deeper-check" className="hover:text-white focus-ring rounded-base">
            申請進一步查證
          </Link>
        </nav>
      </div>
    </footer>
  );
}
