import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateDeeperCheckRequest } from '@/lib/validation';

const SUBMISSION_FAILED_MESSAGE =
  '暫時無法送出申請。你可以稍後再試，或使用 Email 備用方式聯絡我們。';
const INVALID_REQUEST_MESSAGE = '請確認表單內容後再試一次。';

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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
}

function getMissingEnvVarNames() {
  const requiredEnvVars = [
    'RESEND_API_KEY',
    'DEEPER_CHECK_TO_EMAIL',
    'DEEPER_CHECK_FROM_EMAIL',
  ] as const;

  return requiredEnvVars.filter((name) => !process.env[name]);
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    console.error('[verifytw][deeper-check] Failed to parse request JSON.', {
      error: getErrorMessage(error),
    });

    return NextResponse.json(
      { success: false, message: INVALID_REQUEST_MESSAGE },
      { status: 400 }
    );
  }

  const parsed = validateDeeperCheckRequest(payload);
  if (!parsed.success) {
    console.error('[verifytw][deeper-check] Validation failed.', {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join('.') || 'form',
        message: issue.message,
      })),
    });

    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message ?? INVALID_REQUEST_MESSAGE,
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (parsed.data.companyWebsite) {
    console.warn('[verifytw][deeper-check] Honeypot field was filled; request accepted silently.');
    return NextResponse.json({ success: true });
  }

  const missingEnvVars = getMissingEnvVarNames();
  if (missingEnvVars.length > 0) {
    console.error('[verifytw][deeper-check] Missing Resend configuration.', {
      missingEnvVars,
    });

    return NextResponse.json(
      { success: false, message: SUBMISSION_FAILED_MESSAGE },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    const result = await resend.emails.send({
      from: process.env.DEEPER_CHECK_FROM_EMAIL!,
      to: process.env.DEEPER_CHECK_TO_EMAIL!,
      replyTo: parsed.data.email,
      subject: `VerifyTW deeper check request: ${parsed.data.targetName}`,
      text: buildPlainTextBody(parsed.data),
      html: buildHtmlBody(parsed.data),
    });

    if (result.error) {
      console.error('[verifytw][deeper-check] Resend API returned an error.', {
        name: result.error.name,
        message: result.error.message,
      });

      return NextResponse.json(
        { success: false, message: SUBMISSION_FAILED_MESSAGE },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[verifytw][deeper-check] Failed to send Resend email.', {
      error: getErrorMessage(error),
    });

    return NextResponse.json(
      { success: false, message: SUBMISSION_FAILED_MESSAGE },
      { status: 502 }
    );
  }
}
