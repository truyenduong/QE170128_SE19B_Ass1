import Link from 'next/link';
import { getDepartments, getProjects, getTasks } from '@/lib/api';
import { Department, Project, Task } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import { 
  Layers, 
  FolderKanban, 
  CheckSquare, 
  ArrowRight, 
  Calendar, 
  Building2,
  ListFilter,
  PlusCircle,
  Clock
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  let departments: Department[] = [];
  let projects: Project[] = [];
  let tasks: Task[] = [];
  let fetchError: string | null = null;

  try {
    const [deptRes, projRes, taskRes] = await Promise.all([
      getDepartments(),
      getProjects(),
      getTasks(),
    ]);
    departments = deptRes;
    projects = projRes;
    tasks = taskRes;
  } catch (err: any) {
    fetchError = err.message || 'Could not connect to backend API';
  }

  const activeProjects = projects.filter((p) => p.isActive);
  const completedProjects = activeProjects.filter((p) => p.status === 2).length;
  const inProgressProjects = activeProjects.filter((p) => p.status === 1).length;

  return (
    <div className="space-y-9 animate-in fade-in duration-300">
      <section className="relative isolate overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-900 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-[10px] font-bold uppercase text-cyan-200">
            <span className="size-1.5 rounded-full bg-cyan-300" />
            Your workspace at a glance
          </div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight text-white md:text-4xl">
            Work moves faster with a clear view.
          </h1>
          <p className="max-w-xl text-sm leading-7 text-slate-400 md:text-base">
            Bring your teams, project plans, and day-to-day tasks into one focused workspace.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-[#10131a] transition-colors hover:bg-cyan-200"
            >
              <ListFilter className="w-4 h-4" />
              Browse tasks
            </Link>
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.08]"
            >
              Explore teams
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 hidden h-full w-[36%] border-l border-white/[0.06] md:block">
          <div className="absolute inset-y-0 left-1/3 border-l border-white/[0.06]" />
          <div className="absolute inset-y-0 left-2/3 border-l border-white/[0.06]" />
          <div className="absolute left-6 top-8 flex items-center gap-2 text-[10px] font-medium uppercase text-slate-500"><Clock size={13} /> Live overview</div>
          <div className="absolute bottom-10 left-6 right-6 h-px bg-gradient-to-r from-cyan-300/60 to-transparent" />
          <div className="absolute bottom-14 left-6 text-5xl font-semibold tracking-tight text-white/10">TT<span className="text-cyan-300/40">.</span></div>
        </div>
      </section>

      {/* Error state alert if API connection fails */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">Workspace connection issue.</span> {fetchError}
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Teams</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {departments.length}
            </span>
            <span className="text-xs text-slate-500">in your workspace</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <Link href="/departments" className="flex items-center gap-1 font-medium text-cyan-300 hover:text-cyan-200">
              Open team directory <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Live projects</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeProjects.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {inProgressProjects} moving · {completedProjects} finished
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <Link href="/projects/manage" className="flex items-center gap-1 font-medium text-violet-300 hover:text-violet-200">
              Open project studio <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tracked tasks</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {tasks.length}
            </span>
            <span className="text-xs text-slate-500">across projects</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <Link href="/search" className="flex items-center gap-1 font-medium text-sky-300 hover:text-sky-200">
              Search task index <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Active Projects Cards Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-100">
              Project pulse
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A current snapshot of work underway across your teams.
            </p>
          </div>
          <Link
            href="/projects/manage"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
          >
            <PlusCircle className="w-4 h-4" />
            Create project
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-14 text-center">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-200">Nothing is underway yet</p>
            <p className="mt-1 text-xs text-slate-500">Projects will appear here once they are active.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {activeProjects.map((p) => (
              <Link
                key={p.projectId}
                href={`/projects/${p.projectId}`}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-cyan-300/30 hover:bg-slate-900/80"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-cyan-300" />
                      {p.departmentName || 'Department'}
                    </span>
                    <StatusBadge status={p.status} type="project" size="sm" />
                  </div>

                  <h3 className="text-base font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                    {p.projectName}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{p.startDate}</span>
                    {p.endDate && <span>→ {p.endDate}</span>}
                  </div>

                  <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <CheckSquare className="w-3.5 h-3.5 text-cyan-300" />
                    <span>{p.taskCount} tasks</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
