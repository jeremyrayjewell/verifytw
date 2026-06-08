import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-5xl bg-main-ink px-lg py-2xl text-rice-paper">
      <div className="mx-auto max-w-6xl space-y-lg text-center text-sm">
        <div className="space-y-sm">
          <p>VerifyTW 台企查 © 2026</p>
          <p>查公司、查雇主、查交易對象。公開資料，一次看懂。</p>
          <div className="space-y-xs">
            <p className="text-xs text-rice-paper/80">
              公開資料查詢與解讀工具，非政府網站。
            </p>
            <p className="text-[11px] text-rice-paper/60">
              Public-record lookup and interpretation tool. Not a government website.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-md sm:gap-lg">
          <Link href="/data" className="rounded-base px-sm py-xs hover:text-white focus-ring">
            資料說明
          </Link>
          <Link href="/about" className="rounded-base px-sm py-xs hover:text-white focus-ring">
            關於我們
          </Link>
          <Link
            href="/deeper-check"
            className="rounded-base px-sm py-xs hover:text-white focus-ring"
          >
            申請進一步查證
          </Link>
          <Link
            href="/sample-report"
            className="rounded-base px-sm py-xs hover:text-white focus-ring"
          >
            範例報告
          </Link>
          <a
            href="https://github.com/jeremyrayjewell/verifytw"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-base px-sm py-xs hover:text-white focus-ring"
          >
            原始碼 / GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
