import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { NoticeBox } from '@/components/ui/NoticeBox';

export default function DataPage() {
  return (
    <div className="min-h-screen bg-surface py-2xl px-lg">
      <div className="max-w-4xl mx-auto space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <p className="text-sm font-medium text-data-teal-text mb-sm">Data guide</p>
          <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
            資料說明
          </h1>
          <p className="text-base text-neutral-700 leading-relaxed">
            VerifyTW 台企查整理目前可取得的公司登記公開資料，協助你更快理解基本資訊與查詢範圍。
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">VerifyTW 目前查詢什麼？</h2>
          <p className="text-sm text-neutral-600">What VerifyTW currently checks</p>
          <p className="text-base text-neutral-700 leading-relaxed">
            VerifyTW 台企查目前整理經濟部商工登記公開資料，協助使用者快速查詢台灣公司的基本登記資訊。
          </p>
          <div className="grid gap-md sm:grid-cols-2">
            {[
              '統一編號',
              '公司名稱',
              '公司狀態',
              '負責人',
              '資本額',
              '登記地址',
              '核准設立日期',
              '最後更新日期',
            ].map((item) => (
              <div key={item} className="rounded-base bg-rice-paper border border-form-gray px-lg py-md text-sm text-main-ink">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">什麼是統一編號？</h2>
          <p className="text-sm text-neutral-600">What is a Business ID?</p>
          <p className="text-base text-neutral-700 leading-relaxed">
            統一編號是台灣公司或商業登記常用的 8 位數識別號碼。使用統一編號查詢通常比使用簡稱更準確。
          </p>
          <p className="text-sm text-neutral-600">
            A Business ID is an 8-digit identifier used for Taiwan company and business registrations.
          </p>
          <NoticeBox type="info">
            例如搜尋「台積電」可能查不到完整結果，建議搜尋「台灣積體電路製造股份有限公司」或使用統一編號。
          </NoticeBox>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">目前資料來源</h2>
          <p className="text-sm text-neutral-600">Current data source</p>
          <div className="space-y-sm text-base text-neutral-700">
            <p>經濟部商工登記公開資料</p>
            <p className="text-sm text-neutral-600">MOEA public company registration data</p>
          </div>
          <p className="text-base text-neutral-700 leading-relaxed">
            目前主要涵蓋公司登記資料。公開資料可能存在更新延遲，因此查詢結果僅供初步參考。
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">尚未涵蓋的資料</h2>
          <p className="text-sm text-neutral-600">Not yet covered</p>
          <ul className="grid gap-md sm:grid-cols-2 text-sm text-neutral-700">
            {[
              '商業登記',
              '分公司資料',
              '財政部稅籍資料',
              '法院或裁罰紀錄',
              '使用者評價或投訴',
              '即時風險評分',
            ].map((item) => (
              <li key={item} className="rounded-base bg-rice-paper border border-form-gray px-lg py-md">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-support-blue-gray p-xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">查有資料不代表保證安全</h2>
          <p className="text-sm text-neutral-600">Record found does not mean guaranteed safe.</p>
          <p className="text-base text-neutral-700 leading-relaxed">
            查到公開登記資料，代表該公司在目前查詢範圍內有相符公開資料；不代表交易、聘僱、租賃或付款一定安全。
          </p>
          <p className="text-base text-neutral-700 leading-relaxed">
            VerifyTW 不提供法律、投資或交易建議。重大決定仍應與對方提供的文件、合約、付款資訊及官方資料交叉確認。
          </p>
        </section>

        <DeeperCheckCTA />
      </div>
    </div>
  );
}
