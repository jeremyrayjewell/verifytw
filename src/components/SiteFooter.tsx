import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-main-ink text-rice-paper py-2xl px-lg mt-5xl">
      <div className="max-w-6xl mx-auto text-center text-sm space-y-lg">
        <div className="space-y-sm">
          <p>VerifyTW 台企查 © 2026</p>
          <p>查公司、查雇主、查交易對象。公開資料，一次看懂。</p>
          <div className="space-y-xs">
            <p className="text-xs text-rice-paper/80">公開資料查詢與解讀工具，非政府網站。</p>
            <p className="text-[11px] text-rice-paper/60">
              Public-record lookup and interpretation tool. Not a government website.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-md sm:gap-lg">
          <Link href="/data" className="hover:text-white focus-ring rounded-base px-sm py-xs">
            資料說明
          </Link>
          <Link href="/about" className="hover:text-white focus-ring rounded-base px-sm py-xs">
            關於我們
          </Link>
          <Link href="/deeper-check" className="hover:text-white focus-ring rounded-base px-sm py-xs">
            申請進一步查證
          </Link>
          <a
            href="https://github.com/jeremyrayjewell/verifytw"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white focus-ring rounded-base px-sm py-xs"
          >
            原始碼 / GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
