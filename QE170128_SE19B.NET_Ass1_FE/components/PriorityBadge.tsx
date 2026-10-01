import React from 'react';
import { TASK_PRIORITY_MAP } from '@/lib/types';
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: number;
  showIcon?: boolean;
}

export default function PriorityBadge({ priority, showIcon = true }: PriorityBadgeProps) {
  const config = TASK_PRIORITY_MAP[priority] || {
    label: `Priority ${priority}`,
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
  };

  const renderIcon = () => {
    switch (priority) {
      case 3:
        return <AlertCircle className="w-3 h-3 text-red-300" />;
      case 2:
        return <AlertTriangle className="w-3 h-3 text-orange-300" />;
      case 1:
        return <ArrowUp className="w-3 h-3 text-sky-300" />;
      case 0:
        return <ArrowDown className="w-3 h-3 text-teal-300" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 font-semibold rounded-full border leading-none ${config.bg} ${config.color}`}
    >
      {showIcon && <span className={`size-1.5 rounded-full ${config.dot}`} />}
      {showIcon && renderIcon()}
      {config.label}
    </span>
  );
}
