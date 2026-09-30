import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTask } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import TagChip from '@/components/TagChip';
import { 
  CheckSquare, 
  ArrowLeft, 
  Calendar, 
  FolderKanban, 
  Building2, 
  Clock, 
  Edit3,
  Tag as TagIcon
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const taskId = parseInt(resolvedParams.id, 10);
  if (isNaN(taskId)) notFound();

  let task;
  try {
    task = await getTask(taskId);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={task.projectId ? `/projects/${task.projectId}` : '/search'}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {task.projectName ? `Project: ${task.projectName}` : 'Tasks'}
        </Link>

        <Link
          href="/tasks/manage"
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Task
        </Link>
      </div>

      {/* Main Task Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        {/* Header and Badges */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-2.5 flex-wrap">
            <StatusBadge status={task.status} type="task" />
            <PriorityBadge priority={task.priority} />
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Task #{task.taskId}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {task.title}
          </h1>
        </div>

        {/* Task Description */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Description
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {task.description || 'No detailed description provided for this task.'}
            </p>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TagIcon className="w-3.5 h-3.5" />
            Assigned Tags
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {task.tags && task.tags.length > 0 ? (
              task.tags.map((tag) => (
                <TagChip key={tag.tagId} tag={tag} size="md" />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No tags associated with this task.</span>
            )}
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <FolderKanban className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">Assigned Project</div>
              {task.projectId ? (
                <Link
                  href={`/projects/${task.projectId}`}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {task.projectName || `Project #${task.projectId}`}
                </Link>
              ) : (
                <div className="font-semibold text-slate-700 dark:text-slate-200">Unassigned</div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Building2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">Department</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                {task.departmentName || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">Due Date</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                {task.dueDate || 'No due date'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">Created / Modified</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                {new Date(task.createdDate).toLocaleDateString()}
                {task.modifiedDate && ` (Updated: ${new Date(task.modifiedDate).toLocaleDateString()})`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
