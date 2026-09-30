import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/api';
import ProjectTaskList from './ProjectTaskList';
import StatusBadge from '@/components/StatusBadge';
import { 
  FolderKanban, 
  ArrowLeft, 
  Calendar, 
  Building2, 
  PlusCircle, 
  CheckCircle2,
  Clock
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id, 10);
  if (isNaN(projectId)) notFound();

  let project;
  try {
    project = await getProject(projectId);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>

        <div className="flex items-center gap-2">
          {project.departmentId && (
            <Link
              href={`/departments/${project.departmentId}`}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              {project.departmentName}
            </Link>
          )}
          <Link
            href="/tasks/manage"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Task
          </Link>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={project.status} type="project" />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Created {new Date(project.createdDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-1">
              {project.projectName}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 self-start">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Duration</div>
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  {project.startDate} {project.endDate ? `→ ${project.endDate}` : '(Ongoing)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {project.description || 'No detailed description specified for this project.'}
        </p>
      </div>

      {/* Interactive Task List with Status Filter (Bonus Requirement) */}
      <ProjectTaskList tasks={project.tasks} />
    </div>
  );
}
