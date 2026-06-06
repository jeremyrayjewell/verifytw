import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateDeeperCheckRequest } from '@/lib/validation';

const MISSING_CONFIG_MESSAGE = '暫時無法送出申請。你可以稍後再試，或使用 Email 備用方式聯絡我們。';

function getSubmittedAt() {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  }).format(new Date());
}

function buildPlainTextBody(data: {
  name: string;
  email: string;
  targetName: string;
  businessId?: string;
  checkType: string;
  message: string;
  relatedLink?: string;
}) {
  return [
    'VerifyTW deeper check request',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Target name: ${data.targetName}`,
    `Business ID: ${data.businessId || '(not provided)'}`,
    `Check type: ${data.checkType}`,
    '',
    'Message:',
    data.message,
    '',
    `Related link: ${data.relatedLink || '(not provided)'}`,
    `Submitted at: ${getSubmittedAt()}`,
    'Source: VerifyTW /deeper-check',
  ].join('\n');
}

function buildHtmlBody(data: {
  name: string;
  email: string;
  targetName: string;
  businessId?: string;
  checkType: string;
  message: string;
  relatedLink?: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #102A43; line-height: 1.6;">
      <h2>VerifyTW deeper check request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Target name:</strong> ${data.targetName}</p>
      <p><strong>Business ID:</strong> ${data.businessId || '(not provided)'}</p>
      <p><strong>Check type:</strong> ${data.checkType}</p>
      <p><strong>Message:</strong><br/>${data.message.replace(/\n/g, '<br/>')}</p>
      <p><strong>Related link:</strong> ${data.relatedLink || '(not provided)'}</p>
      <p><strong>Submitted at:</strong> ${getSubmittedAt()}</p>
      <p><strong>Source:</strong> VerifyTW /deeper-check</p>
    </div>
  `;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: '送出內容格式不正確。' },
      { status: 400 }
    );
  }

  const parsed = validateDeeperCheckRequest(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? '請確認表單內容',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (parsed.data.companyWebsite) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[verifytw][deeper-check] Honeypot field was filled; request accepted silently.');
    }

    return NextResponse.json({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.DEEPER_CHECK_TO_EMAIL;
  const fromEmail = process.env.DEEPER_CHECK_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[verifytw][deeper-check] Missing Resend configuration. Expected RESEND_API_KEY, DEEPER_CHECK_TO_EMAIL, and DEEPER_CHECK_FROM_EMAIL.'
      );
    }

    return NextResponse.json(
      { success: false, message: MISSING_CONFIG_MESSAGE },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: parsed.data.email,
      subject: `VerifyTW deeper check request: ${parsed.data.targetName}`,
      text: buildPlainTextBody(parsed.data),
      html: buildHtmlBody(parsed.data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[verifytw][deeper-check] Failed to send Resend email.', error);
    }

    return NextResponse.json(
      { success: false, message: MISSING_CONFIG_MESSAGE },
      { status: 502 }
    );
  }
}

