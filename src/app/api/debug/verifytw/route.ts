import { NextResponse } from 'next/server';
import { getMoeaDebugConfig, isMoeaLookupDisabled } from '@/lib/sources/moea';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function isDebugEnabled() {
  return process.env.NODE_ENV === 'development' || process.env.VERIFYTW_DEBUG_ENABLED === 'true';
}

export async function GET() {
  if (!isDebugEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const moeaConfig = getMoeaDebugConfig();

  return NextResponse.json({
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    appMode: isMoeaLookupDisabled() ? 'mock-only' : 'live-enabled',
    moeaLookupEnabled: !isMoeaLookupDisabled(),
    resendConfigured: Boolean(process.env.RESEND_API_KEY),
    deeperCheckToEmailConfigured: Boolean(process.env.DEEPER_CHECK_TO_EMAIL),
    deeperCheckFromEmailConfigured: Boolean(process.env.DEEPER_CHECK_FROM_EMAIL),
    endpoints: {
      companyByBanHost: new URL(moeaConfig.companyByBanEndpoint).host,
      keywordSearchHost: new URL(moeaConfig.keywordEndpoint).host,
    },
    timeouts: {
      banLookupMs: moeaConfig.banTimeoutMs,
      keywordLookupMs: moeaConfig.keywordTimeoutMs,
    },
  });
}
