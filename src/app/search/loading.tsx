import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <section className="py-2xl px-lg bg-rice-paper border-b-2 border-form-gray">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-main-ink mb-lg">查詢企業資訊</h1>
          <p className="text-sm text-neutral-600 mb-lg">Search company information</p>

          <div className="w-full rounded-base bg-rice-paper border-2 border-form-gray p-lg">
            <div className="flex flex-col sm:flex-row gap-md items-stretch sm:items-center">
              <LoadingSkeleton className="h-12 flex-1" />
              <LoadingSkeleton className="h-12 w-32 md:w-44 md:min-w-max" />
            </div>
          </div>

          <div className="mt-lg rounded-base border-2 border-civic-blue bg-support-blue-gray p-lg">
            <p className="text-sm text-main-ink">正在查詢公開資料，可能需要幾秒鐘。</p>
            <p className="mt-xs text-xs text-neutral-600">
              Looking up public records. This can take a few seconds.
            </p>
          </div>
        </div>
      </section>

      <section className="py-2xl px-lg">
        <div className="max-w-5xl mx-auto space-y-lg">
          <LoadingSkeleton className="h-24" />
          <LoadingSkeleton className="h-48" count={3} />
        </div>
      </section>
    </div>
  );
}
