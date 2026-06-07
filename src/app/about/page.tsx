import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { NoticeBox } from '@/components/ui/NoticeBox';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface px-lg py-2xl">
      <div className="mx-auto max-w-4xl space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <p className="mb-sm text-sm font-medium text-data-teal-text">About VerifyTW</p>
          <h1 className="mb-md text-3xl font-bold text-main-ink md:text-4xl">關於我們</h1>
          <p className="mb-md text-sm text-neutral-600">
            VerifyTW 台企查 is a Taiwan public-record lookup and interpretation tool for
            companies, employers, and business partners.
          </p>
          <p className="text-base leading-relaxed text-neutral-700">
            VerifyTW 台企查是一個台灣公開資料查詢與解讀工具，目標是讓公司、雇主、交易對象的基本公開資訊更容易理解。
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl">
          <div className="space-y-md">
            <h2 className="text-2xl font-bold text-main-ink">關於 VerifyTW</h2>
            <p className="text-sm text-neutral-600">About VerifyTW</p>
            <p className="text-base leading-relaxed text-neutral-700">
              VerifyTW 台企查是由 Jeremy Jewell 建立的獨立公開資料專案，目標是讓台灣公司登記資料更容易查詢與理解，特別適合需要初步確認公司、雇主、招募者、租屋仲介、客戶或交易對象的人。
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              VerifyTW 台企查 is an independent public-data project by Jeremy Jewell. It
              was built to make Taiwan company-registration information easier to
              understand for people checking companies, employers, recruiters, rental
              agents, clients, and business partners.
            </p>
            <p className="text-base leading-relaxed text-neutral-700">
              VerifyTW 不是政府網站，也不代表任何台灣政府機關。查詢結果整理自公開資料，僅供初步參考。
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              VerifyTW is not a government website and is not affiliated with any Taiwan
              government agency. The service organizes and explains public records for
              preliminary reference only.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl space-y-lg">
          <p className="text-base leading-relaxed text-neutral-700">
            我們希望幫助使用者在合作、應徵、租賃、交易或付款之前，先查一下公開資料，降低資訊不對稱。
          </p>
          <div className="space-y-xs text-sm text-neutral-600">
            <p>不是政府網站 / Not a government website</p>
            <p>僅供初步參考 / For preliminary reference only</p>
            <p>不提供法律、投資或交易建議 / Not legal, investment, or transaction advice</p>
          </div>
          <NoticeBox type="info">
            我們重視的是透明、可理解、可交叉確認的公開資訊，而不是誇大保證或風險煽動。
          </NoticeBox>
        </section>

        <DeeperCheckCTA />
      </div>
    </div>
  );
}
