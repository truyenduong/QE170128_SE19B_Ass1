import React from 'react';
import { PROJECT_STATUS_MAP, TASK_STATUS_MAP } from '@/lib/types';

interface StatusBadgeProps {
  status: number;
  type?: 'project' | 'task';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, type = 'task', size = 'md' }: StatusBadgeProps) {
  const map = type === 'project' ? PROJECT_STATUS_MAP : TASK_STATUS_MAP;
  const config = map[status] || {
    label: `Unknown (${status})`,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  };

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-1'
    : 'text-[11px] px-2.5 py-1.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold leading-none ${config.bg} ${config.color} ${sizeClasses} transition-colors`}
    >
      <span className="size-1.5 rounded-full bg-current shadow-[0_0_7px_currentColor]" />
      {config.label}
    </span>
  );
}
