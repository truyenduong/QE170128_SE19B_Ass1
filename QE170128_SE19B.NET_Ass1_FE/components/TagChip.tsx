import React from 'react';
import { Tag as TagType } from '@/lib/types';
import { Tag as TagIcon, X } from 'lucide-react';

interface TagChipProps {
  tag: TagType;
  size?: 'sm' | 'md';
  onRemove?: () => void;
}

export default function TagChip({ tag, size = 'sm', onRemove }: TagChipProps) {
  const color = tag.color || '#6366F1';
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-1' : 'text-[11px] px-2.5 py-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} transition-all`}
      style={{
        backgroundColor: `${color}18`, // 10% opacity for background
        color: color,
        border: `1px solid ${color}40`, // 25% opacity for border
      }}
    >
      <TagIcon className="w-2.5 h-2.5 opacity-80" />
      <span>{tag.tagName}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-100 opacity-60 rounded-full hover:bg-black/10 dark:hover:bg-white/20 p-0.5"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
