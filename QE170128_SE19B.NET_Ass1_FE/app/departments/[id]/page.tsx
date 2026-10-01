import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartment } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { 
  Layers, 
  FolderKanban, 
  ArrowLeft, 
  Calendar, 
  PlusCircle, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const deptId = parseInt(resolvedParams.id, 10);
  if (isNaN(deptId)) notFound();

  let dept;
  try {
    dept = await getDepartment(deptId);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Team directory
        </Link>

        <Link
          href="/projects/manage"
          className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-300/10"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add project
        </Link>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-300">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase text-cyan-300">Team profile</p>
              <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
                {dept.departmentName}
              </h1>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active team
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300">
            {dept.projects.length} projects
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-7 text-slate-400">
          {dept.departmentDescription}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
          <FolderKanban className="h-5 w-5 text-violet-300" />
          Projects in this team
        </h2>

        {dept.projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center">
            <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No projects belong to this team yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {dept.projects.map((project) => (
              <Link
                key={project.projectId}
                href={`/projects/${project.projectId}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-cyan-300/30"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <StatusBadge status={project.status} type="project" size="sm" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {project.startDate}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                    {project.projectName}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-400 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs font-medium text-cyan-300">
                  <span>Open project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
