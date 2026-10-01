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
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Workspace overview
        </Link>

        <div className="flex items-center gap-2">
          {project.departmentId && (
            <Link
              href={`/departments/${project.departmentId}`}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              {project.departmentName}
            </Link>
          )}
          <Link
            href="/tasks/manage"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Task
          </Link>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={project.status} type="project" />
                <span className="text-[10px] font-bold uppercase text-slate-500">Project brief</span>
                <span className="text-xs text-slate-500">
                Opened {new Date(project.createdDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="pt-1 text-2xl font-semibold text-slate-100 sm:text-3xl">
              {project.projectName}
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-slate-800 bg-slate-800/60 p-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-300" />
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-500">Timeline</div>
                <div className="font-semibold text-slate-200">
                  {project.startDate} {project.endDate ? `→ ${project.endDate}` : '(Ongoing)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-7 text-slate-400">
          {project.description || 'This project has no brief attached yet.'}
        </p>
      </div>

      <ProjectTaskList tasks={project.tasks} />
    </div>
  );
}
