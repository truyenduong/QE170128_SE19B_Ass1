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
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white p-8 md:p-12 shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-indigo-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PRN232 Practical Exam — Public Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Streamlined Team & Task Management
          </h1>
          <p className="text-indigo-100 text-base md:text-lg leading-relaxed">
            Organize departments, manage strategic projects, and track active deliverables seamlessly without authentication friction.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-semibold text-sm shadow-md hover:bg-indigo-50 transition-colors"
            >
              <ListFilter className="w-4 h-4" />
              Explore Tasks
            </Link>
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500/30 backdrop-blur-md text-white border border-white/20 font-semibold text-sm hover:bg-indigo-500/50 transition-colors"
            >
              Browse Departments
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -top-12 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
      </section>

      {/* Error state alert if API connection fails */}
      {fetchError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">Backend Notice:</span> {fetchError}. Ensure your .NET backend is running at <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-xs">{process.env.NEXT_PUBLIC_API_URL}</code>.
          </div>
        </div>
      )}

      {/* Metric Counters Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Departments</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {departments.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">active units</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <Link href="/departments" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
              View all departments <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Projects</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeProjects.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({inProgressProjects} ongoing, {completedProjects} done)
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <Link href="/projects/manage" className="text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1">
              Manage projects <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tasks</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {tasks.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">in tracking</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-xs">
            <Link href="/search" className="text-sky-600 dark:text-sky-400 font-medium hover:underline flex items-center gap-1">
              Filter task board <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Active Projects Cards Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Active Projects
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Overview of all active development streams and initiatives
            </p>
          </div>
          <Link
            href="/projects/manage"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
          >
            <PlusCircle className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {activeProjects.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">No active projects found</p>
            <p className="text-xs text-slate-400 mt-1">Initialize the database or add a project from management.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((p) => (
              <Link
                key={p.projectId}
                href={`/projects/${p.projectId}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {p.departmentName || 'Department'}
                    </span>
                    <StatusBadge status={p.status} type="project" size="sm" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {p.projectName}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{p.startDate}</span>
                    {p.endDate && <span>→ {p.endDate}</span>}
                  </div>

                  <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
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
