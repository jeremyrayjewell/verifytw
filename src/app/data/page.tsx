import { DeeperCheckCTA } from '@/components/DeeperCheckCTA';
import { NoticeBox } from '@/components/ui/NoticeBox';

export default function DataPage() {
  return (
    <div className="min-h-screen bg-surface px-lg py-2xl">
      <div className="mx-auto max-w-4xl space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <p className="mb-sm text-sm font-medium text-data-teal-text">Data guide</p>
          <h1 className="mb-md text-3xl font-bold text-main-ink md:text-4xl">資料說明</h1>
          <p className="text-base leading-relaxed text-neutral-700">
            VerifyTW 台企查整理目前可取得的商工登記公開資料，協助你更快理解基本資訊、查詢範圍與目前限制。
          </p>
        </section>

        <section className="space-y-lg rounded-base border-2 border-form-gray bg-surface p-xl">
          <h2 className="text-2xl font-bold text-main-ink">VerifyTW 目前查詢什麼？</h2>
          <p className="text-sm text-neutral-600">What VerifyTW currently checks</p>
          <p className="text-base leading-relaxed text-neutral-700">
            VerifyTW 台企查目前可整理經濟部商工登記公開資料中的公司登記與商業登記資訊，協助使用者快速查詢基本登記內容。
          </p>
          <div className="grid gap-md sm:grid-cols-2">
            {[
              '統一編號',
              '登記名稱',
              '登記狀態',
              '登記類型（公司 / 商業）',
              '負責人',
              '資本額或登記資本',
              '登記地址',
              '設立或核准日期',
              '最後更新日期',
            ].map((item) => (
              <div
                key={item}
                className="rounded-base border border-form-gray bg-rice-paper px-lg py-md text-sm text-main-ink"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-lg rounded-base border-2 border-form-gray bg-surface p-xl">
          <h2 className="text-2xl font-bold text-main-ink">什麼是統一編號？</h2>
          <p className="text-sm text-neutral-600">What is a Business ID?</p>
          <p className="text-base leading-relaxed text-neutral-700">
            統一編號是台灣公司或商業登記常用的 8 位數識別號碼。使用統一編號查詢通常比使用簡稱或片段名稱更準確。
          </p>
          <p className="text-sm text-neutral-600">
            A Business ID is an 8-digit identifier used for Taiwan company and business registrations.
          </p>
          <NoticeBox type="info">
            例如搜尋「台積電」可能查不到完整結果，建議搜尋完整登記名稱，或直接使用統一編號查詢。
          </NoticeBox>
        </section>

        <section className="space-y-lg rounded-base border-2 border-form-gray bg-surface p-xl">
          <h2 className="text-2xl font-bold text-main-ink">目前資料來源</h2>
          <p className="text-sm text-neutral-600">Current data sources</p>
          <div className="space-y-sm text-base text-neutral-700">
            <p>經濟部商工登記公開資料</p>
            <p className="text-sm text-neutral-600">
              MOEA public company and business registration data
            </p>
          </div>
          <p className="text-base leading-relaxed text-neutral-700">
            目前 live lookup 會嘗試查詢公司登記與商業登記資料；不同來源可提供的欄位略有差異，公開資料也可能存在更新延遲。
          </p>
        </section>

        <section className="space-y-lg rounded-base border-2 border-form-gray bg-surface p-xl">
          <h2 className="text-2xl font-bold text-main-ink">目前限制</h2>
          <p className="text-sm text-neutral-600">Current limitations</p>
          <ul className="grid gap-md sm:grid-cols-2 text-sm text-neutral-700">
            {[
              '關鍵字查詢速度取決於外部 MOEA 回應時間',
              '不同登記類型的欄位完整度可能不同',
              '分公司資料尚未納入 live 查詢',
              '財政部稅籍資料尚未交叉比對',
              '不是所有商業類型都保證能即時查到',
              '查詢結果僅供初步參考',
            ].map((item) => (
              <li
                key={item}
                className="rounded-base border border-form-gray bg-rice-paper px-lg py-md"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-lg rounded-base border-2 border-form-gray bg-support-blue-gray p-xl">
          <h2 className="text-2xl font-bold text-main-ink">查有資料不代表保證安全</h2>
          <p className="text-sm text-neutral-600">A public record does not guarantee safety.</p>
          <p className="text-base leading-relaxed text-neutral-700">
            查到公開登記資料，代表在目前查詢範圍內有相符記錄；不代表交易、聘僱、租賃或付款一定安全。
          </p>
          <p className="text-base leading-relaxed text-neutral-700">
            VerifyTW 不提供法律、投資或交易建議。重大決定仍應與對方提供的文件、合約、付款資訊及官方資料交叉確認。
          </p>
        </section>

        <DeeperCheckCTA />
      </div>
    </div>
  );
}
