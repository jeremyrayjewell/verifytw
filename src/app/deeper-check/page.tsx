import { DeeperCheckForm } from '@/components/DeeperCheckForm';

export default function DeeperCheckPage() {
  return (
    <div className="min-h-screen bg-surface py-2xl px-lg">
      <div className="max-w-4xl mx-auto space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <p className="text-sm font-medium text-data-teal-text mb-sm">Request a deeper check</p>
          <h1 className="text-3xl md:text-4xl font-bold text-main-ink mb-md">
            申請進一步查證
          </h1>
          <p className="text-sm text-neutral-600 mb-md">Request a deeper check</p>
          <p className="text-base text-neutral-700 leading-relaxed">
            提供公司名稱、統一編號、網站、Email、合約內容或相關資訊，我們會協助整理公開資料，
            並說明哪些資訊相符、哪些仍需要你進一步確認。
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">人工查證服務測試中</h2>
            <p className="mt-sm text-base text-neutral-700 leading-relaxed">
              VerifyTW 目前正在測試人工查證需求。若你需要比免費查詢更完整的情境式整理，
              我們會先以 Email 確認需求、範圍與價格，再提供付款方式與後續安排。
            </p>
          </div>

          <div className="grid gap-lg md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-md">免費查詢</h3>
              <p className="text-xs text-neutral-600 mb-md">Free lookup</p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>即時查詢單一公司或統一編號</li>
                <li>顯示經濟部公司登記公開資料</li>
                <li>提供基本查證摘要</li>
                <li>適合快速初步確認</li>
              </ul>
            </div>

            <div className="rounded-base border border-civic-blue bg-support-blue-gray p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-md">人工查證</h3>
              <p className="text-xs text-neutral-600 mb-md">Manual deeper check</p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>由人工整理你提供的情境與資料</li>
                <li>可比對公司名稱、統一編號、網站、Email、合約或訊息內容</li>
                <li>可針對雇主、招募者、租屋仲介、客戶或交易對象提供重點整理</li>
                <li>提供下一步確認建議</li>
                <li>付款方式會在確認範圍後以 Email 提供</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">你會收到什麼</h2>
            <p className="text-sm text-neutral-600 mt-sm">What you get</p>
          </div>

          <div className="grid gap-lg md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink mb-sm">公開資料摘要</p>
              <p className="text-sm text-neutral-700">
                整理查詢對象的公司登記資訊、狀態、地址、負責人、資本額與更新日期。
              </p>
              <p className="text-xs text-neutral-600 mt-sm">
                Public-record summary of registration status, address, representative, capital, and update date.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink mb-sm">來源連結與查詢依據</p>
              <p className="text-sm text-neutral-700">
                標示使用的公開資料來源、查詢時間與整理依據。
              </p>
              <p className="text-xs text-neutral-600 mt-sm">Source links and lookup basis.</p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink mb-sm">相符與待確認項目</p>
              <p className="text-sm text-neutral-700">
                說明哪些資訊與公開資料一致，哪些仍需要交叉確認。
              </p>
              <p className="text-xs text-neutral-600 mt-sm">
                What matches public records and what still needs checking.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink mb-sm">情境式說明</p>
              <p className="text-sm text-neutral-700">
                依照你的情境整理重點，例如雇主、招募者、租屋仲介、客戶或交易對象。
              </p>
              <p className="text-xs text-neutral-600 mt-sm">
                Context-specific notes for employers, recruiters, rental agents, clients, or business partners.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg md:col-span-2">
              <p className="text-sm font-semibold text-main-ink mb-sm">下一步確認清單</p>
              <p className="text-sm text-neutral-700">
                提供你可以向對方確認的問題、建議索取的文件，或值得再次比對的資訊。
              </p>
              <p className="text-xs text-neutral-600 mt-sm">
                Suggested next questions or documents to request.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">方案說明</h2>
            <p className="text-sm text-neutral-600 mt-sm">Manual check options</p>
          </div>

          <div className="grid gap-lg md:grid-cols-3">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-sm">Basic Check — US$19</h3>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>單一公司、雇主或招募者</li>
                <li>公開登記資料整理</li>
                <li>狀態、地址、負責人、資本額摘要</li>
                <li>需要再確認的項目</li>
              </ul>
              <p className="text-xs text-neutral-600 mt-md">
                One company, employer, or recruiter. Public-record summary plus items to confirm.
              </p>
            </div>

            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-sm">Deal Check — US$39</h3>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>單一交易、租屋、合作或客戶情境</li>
                <li>比對你提供的名稱、網站、Email、訊息或付款資訊</li>
                <li>整理相符、部分相符與待確認項目</li>
                <li>提供下一步問題清單</li>
              </ul>
              <p className="text-xs text-neutral-600 mt-md">
                One deal/context check with comparison against the details you provide.
              </p>
            </div>

            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-sm">Taiwan Arrival Bundle — US$79</h3>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>最多 5 個查證對象</li>
                <li>適合來台前比較雇主、租屋仲介、服務商或合作對象</li>
                <li>每個對象提供簡短摘要與待確認項目</li>
                <li>協助排序哪些對象最需要進一步確認</li>
              </ul>
              <p className="text-xs text-neutral-600 mt-md">
                Up to 5 checks for people preparing to work, rent, or do business in Taiwan.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">流程</h2>
            <p className="text-sm text-neutral-600 mt-sm">Process</p>
          </div>

          <div className="grid gap-md md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">1. 送出申請</p>
              <p className="text-xs text-neutral-600 mt-xs">Submit your request</p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">2. 我們以 Email 確認範圍與價格</p>
              <p className="text-xs text-neutral-600 mt-xs">We confirm scope and pricing by email</p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">3. 付款後進行人工查證</p>
              <p className="text-xs text-neutral-600 mt-xs">Manual check begins after payment</p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">4. 以 Email 回覆整理結果</p>
              <p className="text-xs text-neutral-600 mt-xs">Results are delivered by email</p>
            </div>
          </div>

          <p className="text-sm text-neutral-700">
            目前付款方式為人工確認後提供，尚未提供線上自動付款。
          </p>
          <p className="text-xs text-neutral-600">
            Payment instructions are provided manually after scope confirmation. Online checkout is not available yet.
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-sm">
          <p className="text-sm text-neutral-700">
            人工查證不代表保證安全，也不構成法律、投資或交易建議。它的目標是協助你理解公開資料，並知道下一步該確認什麼。
          </p>
          <p className="text-xs text-neutral-600">
            A deeper check does not guarantee safety or provide legal, investment, or transaction advice. It helps you understand public records and what to confirm next.
          </p>
        </section>

        <DeeperCheckForm />
      </div>
    </div>
  );
}
