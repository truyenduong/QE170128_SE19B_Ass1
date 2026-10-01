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
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Link
          href={task.projectId ? `/projects/${task.projectId}` : '/search'}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {task.projectName ? `Project: ${task.projectName}` : 'Tasks'}
        </Link>

        <Link
          href="/tasks/manage"
          className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-300/10"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit Task
        </Link>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2.5 flex-wrap">
            <StatusBadge status={task.status} type="task" />
            <PriorityBadge priority={task.priority} />
            <span className="text-[10px] font-mono font-medium text-slate-500">
              Work item / {task.taskId}
            </span>
          </div>

          <h1 className="text-2xl font-semibold leading-tight text-slate-100 sm:text-3xl">
            {task.title}
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-[10px] font-bold uppercase text-slate-500">
            Work brief
          </h2>
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {task.description || 'No brief has been added to this work item.'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500">
            <TagIcon className="w-3.5 h-3.5" />
            Labels
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            {task.tags && task.tags.length > 0 ? (
              task.tags.map((tag) => (
                <TagChip key={tag.tagId} tag={tag} size="md" />
              ))
            ) : (
              <span className="text-xs text-slate-500">No labels assigned.</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-slate-800 pt-5 text-xs sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5">
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

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5">
            <Building2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">Department</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                {task.departmentName || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5">
            <Calendar className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <div>
              <div className="text-slate-400 font-medium">Due Date</div>
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                {task.dueDate || 'No due date'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5">
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
