'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { NoticeBox } from '@/components/ui/NoticeBox';
import {
  deeperCheckTypeValues,
  validateDeeperCheckRequest,
} from '@/lib/validation';

const MAILTO_RECIPIENT = 'hello@verifytw.example';

type FormState = {
  name: string;
  email: string;
  targetName: string;
  businessId: string;
  checkType: string;
  message: string;
  relatedLink: string;
  companyWebsite: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  targetName: '',
  businessId: '',
  checkType: '',
  message: '',
  relatedLink: '',
  companyWebsite: '',
};

export function DeeperCheckForm() {
  const [form, setForm] = React.useState<FormState>(initialState);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (serverError) {
      setServerError('');
    }
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const buildFallbackMailto = (data: Omit<FormState, 'companyWebsite'>) => {
    const bodyLines = [
      'VerifyTW deeper check request',
      '',
      `姓名 / Name: ${data.name}`,
      `Email: ${data.email}`,
      `查證對象名稱 / Company or person/entity name: ${data.targetName}`,
      `統一編號 / Business ID: ${data.businessId || '(optional / 未提供)'}`,
      `查證類型: ${data.checkType}`,
      '你想確認什麼？ / What are you trying to check?',
      data.message,
      '',
      `相關連結 / Related link: ${data.relatedLink || '(none)'}`,
    ];

    const subject = encodeURIComponent('VerifyTW deeper check request');
    const body = encodeURIComponent(bodyLines.join('\n'));
    return `mailto:${MAILTO_RECIPIENT}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError('');
    setIsSuccess(false);

    const parsed = validateDeeperCheckRequest({
      ...form,
      checkType: form.checkType,
    });

    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? 'form');
        if (!nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/deeper-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        fieldErrors?: Record<string, string[]>;
      };

      if (!response.ok || !result.success) {
        if (result.fieldErrors) {
          const nextErrors: Record<string, string> = {};
          Object.entries(result.fieldErrors).forEach(([key, value]) => {
            if (value?.[0]) {
              nextErrors[key] = value[0];
            }
          });
          setErrors(nextErrors);
        }

        setServerError(
          result.message ||
            '暫時無法送出申請。你可以稍後再試，或使用 Email 備用方式聯絡我們。'
        );
        return;
      }

      setIsSuccess(true);
      setForm(initialState);
    } catch {
      setServerError('暫時無法送出申請。你可以稍後再試，或使用 Email 備用方式聯絡我們。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fallbackMailto = buildFallbackMailto({
    name: form.name,
    email: form.email,
    targetName: form.targetName,
    businessId: form.businessId,
    checkType: form.checkType,
    message: form.message,
    relatedLink: form.relatedLink,
  });

  return (
    <div className="space-y-xl">
      <NoticeBox type="info" title="目前送出方式">
        <div className="space-y-sm">
          <p>目前此表單會直接送出查證申請。若送出失敗，你仍可使用 Email 備用方式聯絡我們。</p>
          <p className="text-xs text-neutral-600">Recipient placeholder: {MAILTO_RECIPIENT}</p>
        </div>
      </NoticeBox>

      {isSuccess && (
        <NoticeBox type="success" title="已收到你的查證申請">
          <div className="space-y-sm">
            <p>已收到你的查證申請。我們會先確認需求與範圍，再回覆下一步。</p>
            <p className="text-xs text-neutral-700">Your request has been received. We’ll review the scope and reply with next steps.</p>
          </div>
        </NoticeBox>
      )}

      {serverError && (
        <NoticeBox type="warning" title="送出未完成">
          <div className="space-y-sm">
            <p>{serverError}</p>
            <a
              href={fallbackMailto}
              className="inline-flex items-center text-civic-blue font-medium hover:underline focus-ring rounded-base"
            >
              使用 Email 備用方式聯絡我們
            </a>
          </div>
        </NoticeBox>
      )}

      <form onSubmit={handleSubmit} className="rounded-base border-2 border-form-gray bg-surface p-xl md:p-2xl space-y-lg" noValidate>
        <div className="hidden" aria-hidden="true">
          <Input
            label="Company website"
            tabIndex={-1}
            autoComplete="off"
            value={form.companyWebsite}
            onChange={(event) => updateField('companyWebsite', event.target.value)}
          />
        </div>
        <div className="grid gap-lg md:grid-cols-2">
          <Input
            label="姓名 / Name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            error={errors.email}
          />
        </div>

        <div className="grid gap-lg md:grid-cols-2">
          <Input
            label="查證對象名稱 / Company or person/entity name"
            value={form.targetName}
            onChange={(event) => updateField('targetName', event.target.value)}
            error={errors.targetName}
          />
          <Input
            label="統一編號 / Business ID（選填）"
            value={form.businessId}
            onChange={(event) => updateField('businessId', event.target.value)}
            error={errors.businessId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-main-ink mb-sm">
            查證類型
          </label>
          <select
            value={form.checkType}
            onChange={(event) => updateField('checkType', event.target.value)}
            className="w-full px-lg py-md text-base border-2 border-form-gray rounded-base bg-surface focus-ring transition-colors duration-base"
            aria-invalid={Boolean(errors.checkType)}
          >
            <option value="">請選擇</option>
            {deeperCheckTypeValues.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.checkType && (
            <p className="mt-sm text-sm text-stamp-red-text">{errors.checkType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-main-ink mb-sm">
            你想確認什麼？ / What are you trying to check?
          </label>
          <textarea
            value={form.message}
            onChange={(event) => updateField('message', event.target.value)}
            rows={6}
            className="w-full px-lg py-md text-base border-2 border-form-gray rounded-base bg-surface focus-ring transition-colors duration-base"
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message && (
            <p className="mt-sm text-sm text-stamp-red-text">{errors.message}</p>
          )}
        </div>

        <Input
          label="相關連結 / Related link（選填）"
          value={form.relatedLink}
          onChange={(event) => updateField('relatedLink', event.target.value)}
          error={errors.relatedLink}
        />

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
          申請進一步查證
        </Button>
      </form>

      <p className="text-sm text-neutral-600">
        送出後不會開啟你的 Email 應用程式；只有在送出失敗時，才會提供 Email 備用方式。
      </p>
    </div>
  );
}
