import demoMofTaxIndex from '@/data/mof-tax-index.demo.json';
import type { NormalizedMofTaxRegistrationRecord } from '@/lib/sources/mof';
import { validateBan } from '@/lib/validation';

interface DemoMofTaxIndexFile {
  metadata: {
    sourceNameZh: string;
    sourceNameEn: string;
    coverageNoteZh: string;
    coverageNoteEn: string;
  };
  records: Record<string, NormalizedMofTaxRegistrationRecord>;
}

const mofTaxDemoIndex = demoMofTaxIndex as DemoMofTaxIndexFile;

export function getDemoMofTaxIndexMetadata() {
  return mofTaxDemoIndex.metadata;
}

export function getDemoMofTaxRecordByBusinessId(
  businessId: string
): NormalizedMofTaxRegistrationRecord | null {
  const parsed = validateBan(businessId);
  if (!parsed.success) {
    return null;
  }

  return mofTaxDemoIndex.records[parsed.data] ?? null;
}
