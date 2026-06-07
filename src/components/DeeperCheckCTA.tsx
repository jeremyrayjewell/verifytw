import Link from 'next/link';
import { ArrowRight, SearchCheck } from 'lucide-react';

interface DeeperCheckCTAProps {
  className?: string;
}

export function DeeperCheckCTA({ className }: DeeperCheckCTAProps) {
  return (
    <section className={className}>
      <div className="rounded-base border-2 border-form-gray bg-rice-paper p-xl md:p-2xl">
        <div className="flex flex-col gap-lg md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-sm text-sm font-medium text-data-teal-text mb-md">
              <SearchCheck size={18} />
              Request a deeper check
            </div>
            <h2 className="text-2xl font-bold text-main-ink mb-md">
              需要更完整的查證？
            </h2>
            <p className="text-sm text-neutral-600 mb-md">Need a deeper check?</p>
            <p className="text-base text-neutral-700 leading-relaxed">
              如果你需要比對網站、Email、合約、招募訊息、租屋資訊或付款細節，可以申請人工查證。
              我們會整理公開資料，並指出哪些資訊相符、哪些仍需要確認。
            </p>
            <p className="mt-sm text-xs text-neutral-600">
              For websites, emails, contracts, recruiter messages, rental details, or payment information, request a manual check.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/deeper-check"
              className="inline-flex items-center gap-sm px-xl py-md rounded-base bg-civic-blue text-surface font-medium hover:bg-opacity-90 transition-colors focus-ring"
            >
              申請進一步查證
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
