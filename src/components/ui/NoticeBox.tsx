'use client';

import React from 'react';
import {
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoticeBoxProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
}

const noticeConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-support-blue-gray',
    borderColor: 'border-civic-blue',
    textColor: 'text-main-ink',
    iconColor: 'text-civic-blue',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-900',
    iconColor: 'text-orange-600',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-stamp-red',
    textColor: 'text-stamp-red-text',
    iconColor: 'text-stamp-red-text',
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-900',
    iconColor: 'text-emerald-600',
  },
};

const NoticeBox: React.FC<NoticeBoxProps> = ({
  type = 'info',
  title,
  children,
  icon: customIcon,
}) => {
  const config = noticeConfig[type];
  const Icon = customIcon || config.icon;

  return (
    <div
      className={cn(
        'p-lg rounded-base border-2 flex gap-lg',
        config.bgColor,
        config.borderColor
      )}
      role="alert"
    >
      <Icon size={20} className={cn('flex-shrink-0 mt-xs', config.iconColor)} />
      <div className="flex-1">
        {title && (
          <p className={cn('font-semibold text-base mb-sm', config.textColor)}>
            {title}
          </p>
        )}
        <div className={cn('text-sm leading-relaxed', config.textColor)}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { NoticeBox };
export type { NoticeBoxProps };
