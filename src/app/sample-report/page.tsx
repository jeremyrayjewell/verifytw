import Link from 'next/link';

const comparisonRows = [
  {
    item: '公司名稱 / Company name',
    submitted: '台灣範例科技股份有限公司',
    publicRecord: '台灣範例科技股份有限公司',
    interpretation: '相符 / Matches',
  },
  {
    item: '統一編號 / Business ID',
    submitted: '12345678',
    publicRecord: '12345678',
    interpretation: '相符 / Matches',
  },
  {
    item: '地址 / Address',
    submitted: '臺北市中正區範例路 100 號 5 樓',
    publicRecord: '臺北市中正區範例路 100 號',
    interpretation: '部分相符；樓層資訊需確認 / Partially matches; floor details need confirmation',
  },
  {
    item: 'Email 網域 / Email domain',
    submitted: 'contact@sample-tw.example',
    publicRecord: '公開公司登記資料通常不包含 Email 網域',
    interpretation: '無法由公司登記資料確認 / Cannot be confirmed from company-registration data',
  },
  {
    item: '網站 / Website',
    submitted: 'https://sample-tw.example',
    publicRecord: '目前查詢來源不直接確認官方網站',
    interpretation: '需與公司正式文件或其他來源交叉確認 / Needs cross-checking with formal documents or other sources',
  },
  {
    item: '付款帳戶 / Payment account',
    submitted: 'Taiwan Sample Tech Ltd.',
    publicRecord: '台灣範例科技股份有限公司',
    interpretation: '名稱相近但不完全一致；付款前應確認收款方 / Similar but not identical; confirm payee before payment',
  },
  {
    item: '合約簽署人 / Contract signer',
    submitted: '陳小華 / Chen Hsiao-hua',
    publicRecord: '負責人為王小明',
    interpretation: '簽署人是否有授權，需由對方提供文件確認 / Signer authorization needs documentation from the counterparty',
  },
] as const;

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
                  <p className="mt-xs text-sm text-main-ink">2026/06/09</p>
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

        <section className="rounded-base border-2 border-form-gray bg-support-blue-gray p-xl md:p-2xl space-y-sm">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">查證結論摘要</h2>
            <p className="mt-sm text-sm text-neutral-600">Executive summary</p>
          </div>
          <p className="text-sm leading-relaxed text-neutral-700">
            本範例中，公開登記資料可以支持「公司登記存在」與「公司名稱、統一編號格式相符」這兩點。不過，公開資料本身不能確認寄件者是否代表該公司，也不能確認 Email、合約或付款資訊是否真實。建議在付款或簽署前，要求對方提供可交叉確認的正式文件。
          </p>
          <p className="text-xs leading-relaxed text-neutral-600">
            In this sample, public records support that the company registration exists
            and that the submitted company name and Business ID are consistent with the
            sample record. However, public records alone cannot confirm whether the
            sender represents the company, or whether the email, contract, or payment
            details are legitimate. Ask for documents that can be cross-checked before
            paying or signing.
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">使用者提供資訊</h2>
            <p className="mt-sm text-sm text-neutral-600">Submitted information</p>
          </div>

          <div className="overflow-hidden rounded-base border border-form-gray bg-rice-paper">
            <div className="grid divide-y divide-form-gray">
              {[
                ['對方提供公司名稱 / Submitted company name', '台灣範例科技股份有限公司'],
                ['對方提供統一編號 / Submitted Business ID', '12345678'],
                ['對方使用 Email / Sender email', 'contact@sample-tw.example'],
                ['對方提供網站 / Submitted website', 'https://sample-tw.example'],
                ['合約公司名稱 / Contract company name', 'Taiwan Sample Technology Co., Ltd.'],
                ['付款帳戶名稱 / Payment account name', 'Taiwan Sample Tech Ltd.'],
                ['對方提供地址 / Submitted address', '臺北市中正區範例路 100 號 5 樓'],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-sm px-lg py-md md:grid-cols-[220px_minmax(0,1fr)]">
                  <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    {label}
                  </p>
                  {value.startsWith('http') ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm leading-relaxed text-civic-blue hover:underline focus-ring rounded-base"
                    >
                      {value}
                    </a>
                  ) : value.includes('@') ? (
                    <a
                      href={`mailto:${value}`}
                      className="text-sm leading-relaxed text-civic-blue hover:underline focus-ring rounded-base"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm leading-relaxed text-main-ink">{value}</p>
                  )}
                </div>
              ))}
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
                ['查詢時間 / Lookup time', '2026/06/09 14:30'],
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
            <h2 className="text-2xl font-bold text-main-ink">比對結果</h2>
            <p className="mt-sm text-sm text-neutral-600">Comparison results</p>
          </div>

          <div className="overflow-hidden rounded-base border border-form-gray bg-rice-paper">
            <div className="hidden grid-cols-[160px_1.1fr_1fr_1.2fr] gap-sm border-b border-form-gray bg-support-blue-gray px-lg py-sm text-xs font-medium uppercase tracking-wide text-neutral-600 md:grid">
              <p>項目 / Item</p>
              <p>使用者提供資訊 / Submitted information</p>
              <p>公開資料 / Public record</p>
              <p>初步判讀 / Preliminary interpretation</p>
            </div>
            <div className="divide-y divide-form-gray">
              {comparisonRows.map((row) => (
                <div key={row.item} className="grid gap-md px-lg py-md md:grid-cols-[160px_1.1fr_1fr_1.2fr]">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 md:hidden">
                      項目 / Item
                    </p>
                    <p className="text-sm leading-relaxed text-main-ink">{row.item}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 md:hidden">
                      使用者提供資訊 / Submitted information
                    </p>
                    {row.submitted.startsWith('http') ? (
                      <a
                        href={row.submitted}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-relaxed text-civic-blue hover:underline focus-ring rounded-base"
                      >
                        {row.submitted}
                      </a>
                    ) : row.submitted.includes('@') ? (
                      <a
                        href={`mailto:${row.submitted}`}
                        className="text-sm leading-relaxed text-civic-blue hover:underline focus-ring rounded-base"
                      >
                        {row.submitted}
                      </a>
                    ) : (
                      <p className="text-sm leading-relaxed text-neutral-700">{row.submitted}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 md:hidden">
                      公開資料 / Public record
                    </p>
                    <p className="text-sm leading-relaxed text-neutral-700">{row.publicRecord}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 md:hidden">
                      初步判讀 / Preliminary interpretation
                    </p>
                    <p className="text-sm leading-relaxed text-main-ink">{row.interpretation}</p>
                  </div>
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
                對方提供的公司地址主體與公開登記地址相符。
                <p className="mt-xs text-xs text-neutral-600">
                  The main address line matches the registered address.
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
              目前公開資料可以支持示範公司在查詢範圍內具有公司登記資料，並且公司名稱與統一編號在本範例中相符。不過，公開資料本身不能證明特定寄件者、網站、發票、付款帳戶或合約內容一定由該公司控制或授權。英文名稱縮寫或付款名稱略有差異有時屬於正常情況，但在付款前仍建議要求對方提供可交叉確認的正式文件。若對方要求緊急付款，應先確認收款對象與授權文件。
            </p>
            <p className="text-xs leading-relaxed text-neutral-600">
              Public records support that the sample company registration exists, and
              the company name and Business ID are consistent in this example. However,
              public records do not prove that a specific sender, website, invoice,
              payment account, or contract is genuinely controlled by the company.
              Small differences in English names or shortened payment names may be
              normal, but they should still be confirmed before payment. If urgent
              payment is requested, ask for formal documents and verify the payment
              recipient first.
            </p>
          </div>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <div>
            <h2 className="text-2xl font-bold text-main-ink">本報告可以與不能確認的事項</h2>
            <p className="mt-sm text-sm text-neutral-600">What this report can and cannot confirm</p>
          </div>

          <div className="grid gap-lg md:grid-cols-2">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink">可以確認</h3>
              <p className="mt-sm text-xs text-neutral-600">Can confirm</p>
              <ul className="mt-md space-y-sm text-sm text-neutral-700">
                <li>提供的公司名稱與統一編號是否可對應到示範公開資料</li>
                <li>基本登記欄位是否一致</li>
                <li>提交資訊看起來屬於相符、部分相符或無法確認</li>
              </ul>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink">不能確認</h3>
              <p className="mt-sm text-xs text-neutral-600">Cannot confirm</p>
              <ul className="mt-md space-y-sm text-sm text-neutral-700">
                <li>寄件者是否真的在該公司任職或代表該公司</li>
                <li>Email 網域是否由該公司控制</li>
                <li>付款帳戶是否安全</li>
                <li>合約是否具有法律效力</li>
                <li>交易是否保證安全</li>
              </ul>
            </div>
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
              <p className="text-base font-semibold text-main-ink">
                想針對自己的公司、雇主、合作邀約或付款資訊申請人工查證？
              </p>
              <p className="text-sm text-neutral-600">
                Request a manual check for your company, employer, business inquiry, or payment context.
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
