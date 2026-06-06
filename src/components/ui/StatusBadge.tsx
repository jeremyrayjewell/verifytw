'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Status } from '@/types/company';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  '資料相符': {
    icon: CheckCircle,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: '資料相符',
  },
  '建議再確認': {
    icon: AlertCircle,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    label: '建議再確認',
  },
  '資料取得中': {
    icon: Clock,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    label: '資料取得中',
  },
  '無公開資料': {
    icon: HelpCircle,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    label: '無公開資料',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizes = {
    sm: 'px-md py-xs text-xs gap-xs',
    md: 'px-lg py-sm text-sm gap-sm',
    lg: 'px-xl py-md text-base gap-md',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center border-2 rounded-base font-medium',
        config.color,
        sizes[size]
      )}
      role="status"
      aria-label={`狀態: ${status}`}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{status}</span>
    </div>
  );
};

export { StatusBadge };
export type { StatusBadgeProps };
