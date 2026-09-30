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
      {/* Header and Status Filter Tabs (Bonus Feature) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-500" />
            Project Tasks
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {tasks.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click any task to inspect details and metadata
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 0
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            To Do ({statusCounts.todo})
          </button>
          <button
            onClick={() => setStatusFilter(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 1
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-300'
            }`}
          >
            In Progress ({statusCounts.inProgress})
          </button>
          <button
            onClick={() => setStatusFilter(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 2
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'
            }`}
          >
            Done ({statusCounts.done})
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            No tasks match the selected status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.map((task) => (
            <Link
              key={task.taskId}
              href={`/tasks/${task.taskId}`}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all"
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

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
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
