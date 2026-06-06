import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { NoticeBox } from '@/components/ui/NoticeBox';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface py-2xl px-lg">
      <div className="max-w-4xl mx-auto space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <p className="text-sm font-medium text-data-teal-text mb-sm">About VerifyTW</p>
          <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
            關於我們
          </h1>
          <p className="text-sm text-neutral-600 mb-md">
            VerifyTW 台企查 is a Taiwan public-record lookup and interpretation tool for companies, employers, and business partners.
          </p>
          <p className="text-base text-neutral-700 leading-relaxed">
            VerifyTW 台企查是一個台灣公開資料查詢與解讀工具，目標是讓公司、雇主、交易對象的基本公開資訊更容易理解。
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl space-y-lg">
          <p className="text-base text-neutral-700 leading-relaxed">
            我們希望幫助使用者在合作、應徵、租賃、交易或付款之前，先查一下公開資料，降低資訊不對稱。
          </p>
          <p className="text-base text-neutral-700 leading-relaxed">
            VerifyTW 不是政府網站，也不代表任何政府機關。查詢結果整理自公開資料，僅供初步參考。
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
