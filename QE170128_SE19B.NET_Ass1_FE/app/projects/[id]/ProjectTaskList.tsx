'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Task } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import TagChip from '@/components/TagChip';
import { 
  CheckSquare, 
  Calendar, 
  ArrowRight, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface ProjectTaskListProps {
  tasks: Task[];
}

export default function ProjectTaskList({ tasks }: ProjectTaskListProps) {
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const statusCounts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 0).length,
    inProgress: tasks.filter((t) => t.status === 1).length,
    done: tasks.filter((t) => t.status === 2).length,
    cancelled: tasks.filter((t) => t.status === 3).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <CheckSquare className="h-5 w-5 text-cyan-300" />
            Work items
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
              {tasks.length}
            </span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Filter the project workload by its current state.
          </p>
        </div>

        <div aria-label="Filter tasks by status" className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-cyan-300 text-[#10131a]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 0
                ? 'bg-cyan-300 text-[#10131a]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            To Do ({statusCounts.todo})
          </button>
          <button
            onClick={() => setStatusFilter(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 1
                ? 'bg-cyan-300 text-[#10131a]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            In Progress ({statusCounts.inProgress})
          </button>
          <button
            onClick={() => setStatusFilter(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 2
                ? 'bg-cyan-300 text-[#10131a]'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Done ({statusCounts.done})
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No work items match this status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {filteredTasks.map((task) => (
            <Link
              key={task.taskId}
              href={`/tasks/${task.taskId}`}
              className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-cyan-300/30 md:flex-row md:items-center"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={task.status} type="task" size="sm" />
                  <PriorityBadge priority={task.priority} />
                  {task.dueDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      Due {task.dueDate}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Tags and Action arrow */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                  {task.tags && task.tags.length > 0 ? (
                    task.tags.map((tag) => (
                      <TagChip key={tag.tagId} tag={tag} size="sm" />
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No tags</span>
                  )}
                </div>

                <div className="text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pl-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
