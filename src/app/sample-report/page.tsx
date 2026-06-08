import Link from 'next/link';

export default function SampleReportPage() {
  return (
    <div className="min-h-screen bg-surface px-lg py-2xl">
      <div className="mx-auto max-w-4xl space-y-2xl">
        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <div className="space-y-md">
            <div className="inline-flex rounded-full border border-civic-blue/30 bg-support-blue-gray px-md py-xs text-xs font-medium text-civic-blue">
              示範資料 / Demo data
            </div>
            <div>
              <h1 className="text-3xl font-bold text-main-ink md:text-4xl">範例報告</h1>
              <p className="mt-sm text-sm text-neutral-600">Sample report</p>
            </div>
            <p className="text-base leading-relaxed text-neutral-700">
              以下為人工查證報告的格式範例，使用示範資料。實際報告會依你提供的情境與公開資料調整。
            </p>
            <p className="text-sm leading-relaxed text-neutral-600">
              This is a sample format using demo data. Actual reports depend on your
              submitted context and available public records.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">查證對象</h2>
            <p className="mt-sm text-sm text-neutral-600">Subject</p>
          </div>

          <div className="space-y-md rounded-base border border-form-gray bg-rice-paper p-lg">
            <div className="grid gap-md md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  公司名稱 / Company name
                </p>
                <p className="mt-xs text-base font-semibold text-main-ink">
                  台灣範例科技股份有限公司
                </p>
                <p className="text-sm text-neutral-600">Taiwan Sample Technology Co., Ltd.</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  統一編號 / Business ID
                </p>
                <p className="mt-xs text-base text-main-ink">12345678</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  查證情境 / Check context
                </p>
                <p className="mt-xs text-sm leading-relaxed text-neutral-700">
                  使用者收到一封自稱來自該公司的合作邀約，想確認公司登記資料與對方提供的資訊是否一致。
                </p>
                <p className="mt-xs text-xs leading-relaxed text-neutral-600">
                  The user received a business inquiry claiming to represent this company
                  and wants to compare the claim against public records.
                </p>
              </div>
              <div className="grid gap-md sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    查證日期 / Report date
                  </p>
                  <p className="mt-xs text-sm text-main-ink">2026/06/08</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    報告類型 / Report type
                  </p>
                  <p className="mt-xs text-sm text-main-ink">情境比對查證 / Context Check</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">公開資料摘要</h2>
            <p className="mt-sm text-sm text-neutral-600">Public-record summary</p>
          </div>

          <div className="overflow-hidden rounded-base border border-form-gray bg-rice-paper">
            <div className="grid divide-y divide-form-gray">
              {[
                ['公司狀態 / Company status', '核准設立'],
                ['登記類型 / Entity type', '公司'],
                ['負責人 / Representative', '王小明'],
                ['資本額 / Capital', 'NT$5,000,000'],
                ['登記地址 / Registered address', '臺北市中正區範例路 100 號'],
                ['核准設立日期 / Established date', '2018/05/20'],
                ['來源 / Source', '經濟部商工登記公開資料'],
                ['查詢時間 / Lookup time', '2026/06/08 14:30'],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-sm px-lg py-md md:grid-cols-[220px_minmax(0,1fr)]">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    {label}
                  </p>
                  <p className="text-sm leading-relaxed text-main-ink">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">相符項目</h2>
            <p className="mt-sm text-sm text-neutral-600">What matches</p>
          </div>
          <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
            <ul className="space-y-md text-sm text-neutral-700">
              <li>
                使用者提供的公司名稱與公開登記名稱相符。
                <p className="mt-xs text-xs text-neutral-600">
                  The submitted company name matches the public registration record.
                </p>
              </li>
              <li>
                統一編號格式正確，且可對應到示範公司資料。
                <p className="mt-xs text-xs text-neutral-600">
                  The Business ID format is valid and maps to the sample record.
                </p>
              </li>
              <li>
                對方提供的公司地址與公開登記地址部分相符。
                <p className="mt-xs text-xs text-neutral-600">
                  The provided address partially matches the registered address.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">待確認項目</h2>
            <p className="mt-sm text-sm text-neutral-600">Items to confirm</p>
          </div>
          <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
            <ul className="space-y-md text-sm text-neutral-700">
              <li>
                對方使用的 Email 網域是否屬於該公司，仍需確認。
                <p className="mt-xs text-xs text-neutral-600">
                  Email domain ownership still needs confirmation.
                </p>
              </li>
              <li>
                付款帳戶名稱是否與公司名稱一致，仍需確認。
                <p className="mt-xs text-xs text-neutral-600">
                  Payment account name should be checked against the company name.
                </p>
              </li>
              <li>
                合約上的公司名稱、統一編號與簽署人身份應再次比對。
                <p className="mt-xs text-xs text-neutral-600">
                  Contract name, Business ID, and signer identity should be cross-checked.
                </p>
              </li>
              <li>
                若對方要求提前付款，建議先索取正式文件並確認付款對象。
                <p className="mt-xs text-xs text-neutral-600">
                  If advance payment is requested, ask for formal documents and confirm
                  the payment recipient first.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">情境式說明</h2>
            <p className="mt-sm text-sm text-neutral-600">Context-specific notes</p>
          </div>
          <div className="space-y-sm rounded-base border border-form-gray bg-rice-paper p-lg">
            <p className="text-sm leading-relaxed text-neutral-700">
              目前公開資料可以確認示範公司在查詢範圍內有公司登記資料，但公開登記資料本身不能證明對方訊息、Email、合約或付款資訊一定真實。建議使用者在付款或簽署前，要求對方提供可交叉確認的正式文件。
            </p>
            <p className="text-xs leading-relaxed text-neutral-600">
              Public records can show that a company registration exists, but they do not
              prove that a specific email, contract, message, or payment request is
              legitimate. Ask for documents that can be cross-checked before paying or
              signing.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">建議下一步</h2>
            <p className="mt-sm text-sm text-neutral-600">Suggested next steps</p>
          </div>
          <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
            <ul className="space-y-md text-sm text-neutral-700">
              <li>
                要求對方提供正式公司抬頭文件。
                <p className="mt-xs text-xs text-neutral-600">
                  Request official company documents.
                </p>
              </li>
              <li>
                確認 Email 網域是否與公司官方網站一致。
                <p className="mt-xs text-xs text-neutral-600">
                  Compare the email domain with the official company website.
                </p>
              </li>
              <li>
                確認付款帳戶名稱是否與公司或合約方一致。
                <p className="mt-xs text-xs text-neutral-600">
                  Check whether the payment account name matches the company or contract
                  party.
                </p>
              </li>
              <li>
                比對合約上的公司名稱、統一編號與地址。
                <p className="mt-xs text-xs text-neutral-600">
                  Cross-check the company name, Business ID, and address shown in the
                  contract.
                </p>
              </li>
              <li>
                若金額較高，考慮尋求法律或專業意見。
                <p className="mt-xs text-xs text-neutral-600">
                  For high-value decisions, consider legal or professional advice.
                </p>
              </li>
            </ul>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">限制與提醒</h2>
            <p className="mt-sm text-sm text-neutral-600">Limitations</p>
          </div>
          <div className="space-y-sm rounded-base border border-form-gray bg-support-blue-gray p-lg">
            <p className="text-sm leading-relaxed text-neutral-700">
              本範例僅示範報告格式。人工查證不代表保證安全，也不構成法律、投資或交易建議。公開資料可能存在更新延遲，實際查證結果取決於可取得的公開資料與使用者提供的資訊。
            </p>
            <p className="text-xs leading-relaxed text-neutral-600">
              This sample shows the report format only. A manual check does not
              guarantee safety or provide legal, investment, or transaction advice.
              Results depend on available public records and the information submitted by
              the user.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
          <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-base font-semibold text-main-ink">想申請自己的人工查證？</p>
              <p className="text-sm text-neutral-600">
                Ready to request your own manual check?
              </p>
            </div>
            <Link
              href="/deeper-check"
              className="inline-flex items-center justify-center rounded-base bg-civic-blue px-lg py-sm text-sm font-medium text-white transition-colors hover:bg-opacity-90 focus-ring"
            >
              前往申請頁面
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
