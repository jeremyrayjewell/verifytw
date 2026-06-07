import { DeeperCheckForm } from '@/components/DeeperCheckForm';

export default function DeeperCheckPage() {
  return (
    <div className="min-h-screen bg-surface px-lg py-2xl">
      <div className="mx-auto max-w-4xl space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <h1 className="mb-md text-3xl font-bold text-main-ink md:text-4xl">
            申請進一步查證
          </h1>
          <p className="mb-md text-sm text-neutral-600">Request a deeper check</p>
          <div className="space-y-sm">
            <p className="text-base leading-relaxed text-neutral-700">
              提供公司名稱、統一編號、網站、Email、合約或相關資訊。我們會協助整理公開資料，並說明哪些資訊相符、哪些仍需要確認。
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              Submit a company name, Business ID, website, email, contract, or related
              details. We&apos;ll review public records and explain what matches, what is
              unclear, and what to confirm next.
            </p>
          </div>
        </section>

        <section className="rounded-base border border-form-gray bg-support-blue-gray p-lg">
          <p className="text-sm font-semibold text-main-ink">獨立專案</p>
          <p className="text-xs text-neutral-600">Independent project</p>
          <p className="mt-sm text-sm leading-relaxed text-neutral-700">
            VerifyTW 是獨立公開資料查詢與解讀工具，不是政府網站。人工查證會整理公開資料與你提供的情境，但不代表保證安全。
          </p>
          <p className="mt-xs text-xs leading-relaxed text-neutral-600">
            VerifyTW is an independent public-record lookup and interpretation tool, not
            a government website. Manual checks help organize public records and
            user-provided context, but do not guarantee safety.
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">免費查詢與人工查證</h2>
          <p className="text-sm text-neutral-600">Free lookup vs manual deeper check</p>

          <div className="grid gap-lg md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="mb-md text-lg font-semibold text-main-ink">免費查詢</h3>
              <p className="mb-md text-xs text-neutral-600">Free lookup</p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>即時查詢單一公司或統一編號</li>
                <li>顯示公開登記欄位</li>
                <li>提供基本查證摘要</li>
                <li>不比對外部文件、網站、Email、付款資訊或訊息</li>
              </ul>
              <p className="mt-md text-xs text-neutral-600">
                Instant public-record lookup for one company or Business ID. Does not
                compare outside documents or messages.
              </p>
            </div>

            <div className="rounded-base border border-civic-blue bg-support-blue-gray p-lg">
              <h3 className="mb-md text-lg font-semibold text-main-ink">人工查證</h3>
              <p className="mb-md text-xs text-neutral-600">Manual deeper check</p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>人工閱讀你提供的情境與資料</li>
                <li>比對公開資料與網站、Email、合約、付款資訊或訊息</li>
                <li>整理相符、部分相符與待確認項目</li>
                <li>提供下一步確認問題或文件清單</li>
              </ul>
              <p className="mt-md text-xs text-neutral-600">
                Human review of your context and materials, with matched / partially
                matched / still-to-confirm items.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">你會收到什麼</h2>
            <p className="mt-sm text-sm text-neutral-600">What you get</p>
          </div>

          <div className="grid gap-md md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                公開資料摘要 / Public-record summary
              </p>
              <p className="mt-sm text-sm text-neutral-700">整理主要登記欄位與更新時間。</p>
              <p className="mt-xs text-xs text-neutral-600">
                Key registration fields and update timing.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                來源與查詢依據 / Sources and lookup basis
              </p>
              <p className="mt-sm text-sm text-neutral-700">標示使用的公開資料來源與查詢依據。</p>
              <p className="mt-xs text-xs text-neutral-600">
                Sources used and the lookup basis.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                相符與待確認項目 / Matches and items to confirm
              </p>
              <p className="mt-sm text-sm text-neutral-700">說明哪些資訊一致、哪些仍需交叉確認。</p>
              <p className="mt-xs text-xs text-neutral-600">
                What matches and what still needs cross-checking.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                情境式說明 / Context-specific notes
              </p>
              <p className="mt-sm text-sm text-neutral-700">依你的使用情境整理簡短說明。</p>
              <p className="mt-xs text-xs text-neutral-600">
                Short notes tailored to your situation.
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg md:col-span-2">
              <p className="text-sm font-semibold text-main-ink">
                下一步確認清單 / Next-step checklist
              </p>
              <p className="mt-sm text-sm text-neutral-700">列出建議追問的問題或可索取的文件。</p>
              <p className="mt-xs text-xs text-neutral-600">
                Questions to ask next or documents to request.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">方案說明</h2>
            <p className="mt-sm text-sm text-neutral-600">Manual check options</p>
          </div>

          <div className="grid gap-lg md:grid-cols-3">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="mb-sm text-lg font-semibold text-main-ink">
                基本登記查證 — US$19
              </h3>
              <p className="mb-md text-xs text-neutral-600">Basic Record Check</p>
              <p className="mb-sm text-sm text-neutral-700">
                單一公司、雇主或招募者的公開登記資料解讀，適合你已經有公司名稱或統一編號時使用。
              </p>
              <p className="mb-md text-xs text-neutral-600">
                One company, employer, or recruiter. A short interpretation of what the
                public record shows and does not show.
              </p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>單一查證對象</li>
                <li>公開登記資料整理與簡短解讀</li>
                <li>說明該紀錄能證明什麼、不能證明什麼</li>
                <li>比對你提供的名稱、連結或雇主資訊是否相符</li>
                <li>3–5 個建議再確認的問題</li>
              </ul>
              <p className="mt-md text-xs text-neutral-600">
                Includes a short written summary and 3–5 questions or items to confirm.
              </p>
            </div>

            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="mb-sm text-lg font-semibold text-main-ink">
                情境比對查證 — US$39
              </h3>
              <p className="mb-md text-xs text-neutral-600">Context Check</p>
              <p className="mb-sm text-sm text-neutral-700">
                針對一個具體情境進行人工比對，例如工作邀約、招募訊息、租屋聯絡、合作對象、客戶或付款資訊。
              </p>
              <p className="mb-md text-xs text-neutral-600">
                One real-world situation, such as a job offer, recruiter message, rental
                contact, client, business partner, or payment detail.
              </p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>單一情境或交易對象</li>
                <li>比對公司名稱、統一編號、網站、Email、訊息、合約或付款資訊</li>
                <li>整理相符、部分相符與待確認項目</li>
                <li>說明公開資料與你提供資訊是否一致</li>
                <li>提供下一步問題與文件確認清單</li>
              </ul>
              <p className="mt-md text-xs text-neutral-600">
                Best for comparing public records against details someone gave you.
              </p>
            </div>

            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="mb-sm text-lg font-semibold text-main-ink">
                來台前候選清單查證 — US$79
              </h3>
              <p className="mb-md text-xs text-neutral-600">Arrival Shortlist</p>
              <p className="mb-sm text-sm text-neutral-700">
                適合即將來台工作、租屋或合作的人，快速比較最多 5 個查證對象。
              </p>
              <p className="mb-md text-xs text-neutral-600">
                For people preparing to work, rent, or do business in Taiwan. Brief
                checks for up to 5 entities.
              </p>
              <ul className="space-y-sm text-sm text-neutral-700">
                <li>最多 5 個查證對象</li>
                <li>每個對象提供簡短公開資料摘要</li>
                <li>每個對象列出主要待確認項目</li>
                <li>協助排序哪些對象最需要進一步確認</li>
                <li>適合雇主、租屋仲介、服務商或合作對象的初步比較</li>
              </ul>
              <p className="mt-md text-xs text-neutral-600">
                Brief comparison only. Not five full Context Checks.
              </p>
            </div>
          </div>

          <div className="space-y-sm rounded-base border border-form-gray bg-support-blue-gray p-lg">
            <p className="text-sm text-neutral-700">
              目前價格為人工查證服務測試期間的 introductory pricing。後續價格可能依需求、範圍與處理時間調整。
            </p>
            <p className="text-xs text-neutral-600">
              Current prices are introductory validation pricing while the manual check
              service is being tested. Pricing may change later based on scope, demand,
              and processing time.
            </p>
            <p className="text-sm text-neutral-700">
              US$79 的來台前候選清單查證為簡短比較，不等於 5 份完整情境比對查證。
            </p>
            <p className="text-xs text-neutral-600">
              The US$79 Arrival Shortlist is a brief comparison, not five full Context
              Checks.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">流程</h2>
            <p className="mt-sm text-sm text-neutral-600">Process</p>
          </div>

          <div className="grid gap-md md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                1. 送出申請 / Submit your request
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                2. Email 確認範圍、價格與付款方式 / Confirm scope, price, and payment
                method by email
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                3. 付款後進行人工查證 / Manual check begins after payment
              </p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <p className="text-sm font-semibold text-main-ink">
                4. Email 回覆整理結果 / Results are delivered by email
              </p>
            </div>
          </div>

          <div className="space-y-xs">
            <p className="text-sm text-neutral-700">
              目前尚未提供線上自動付款。付款方式會在確認範圍後以 Email 提供。
            </p>
            <p className="text-xs text-neutral-600">
              Online checkout is not available yet. Payment instructions are provided by
              email after scope confirmation.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-sm">
          <p className="text-sm text-neutral-700">
            人工查證不代表保證安全，也不構成法律、投資或交易建議。它的目標是協助你理解公開資料，並知道下一步該確認什麼。
          </p>
          <p className="text-xs text-neutral-600">
            A manual check does not guarantee safety or provide legal, investment, or
            transaction advice.
          </p>
        </section>

        <DeeperCheckForm />
      </div>
    </div>
  );
}
