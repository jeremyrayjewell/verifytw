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
          <p className="text-base text-neutral-700 leading-relaxed">
            提供公司名稱、統一編號或相關資訊，我們會協助整理公開資料並回覆你下一步。
          </p>
        </section>

        <section className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg">
          <h2 className="text-2xl font-bold text-main-ink">人工查證服務測試中</h2>
          <p className="text-base text-neutral-700 leading-relaxed">
            VerifyTW 目前正在測試人工查證需求。若你需要更完整的公開資料整理，我們會先以 Email 確認需求與範圍，再提供付款方式。
          </p>

          <div className="grid gap-lg md:grid-cols-3">
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-sm">Basic Check — US$19</h3>
              <p className="text-sm text-neutral-700">公司、雇主或招募者的基本公開資料整理。</p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-sm">Deal Check — US$39</h3>
              <p className="text-sm text-neutral-700">針對交易對象、客戶、租屋仲介或合作對象的較完整初步查證。</p>
            </div>
            <div className="rounded-base border border-form-gray bg-rice-paper p-lg">
              <h3 className="text-lg font-semibold text-main-ink mb-sm">Taiwan Arrival Bundle — US$79</h3>
              <p className="text-sm text-neutral-700">最多 5 個對象的查證整理，適合即將來台工作、租屋或合作的人。</p>
            </div>
          </div>

          <p className="text-sm text-neutral-600">
            人工查證不代表保證安全，也不構成法律、投資或交易建議。
          </p>
        </section>

        <DeeperCheckForm />
      </div>
    </div>
  );
}
