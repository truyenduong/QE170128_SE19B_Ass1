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
    ? 'text-xs px-2 py-0.5' 
    : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.color} ${sizeClasses} transition-colors`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {config.label}
    </span>
  );
}
