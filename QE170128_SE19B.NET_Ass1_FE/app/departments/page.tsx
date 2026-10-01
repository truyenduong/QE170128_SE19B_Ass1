import Link from 'next/link';
import { getDepartments } from '@/lib/api';
import { Department } from '@/lib/types';
import { Layers, FolderKanban, ArrowRight, PlusCircle } from 'lucide-react';

export const revalidate = 0;

export default async function DepartmentsPage() {
  let departments: Department[] = [];
  let errorMsg: string | null = null;

  try {
    departments = await getDepartments();
  } catch (err: any) {
    errorMsg = err.message || 'Unable to load departments';
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase text-cyan-300">People & structure</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            Team directory
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Explore each group and the projects they bring forward.
          </p>
        </div>

        <Link
          href="/departments/manage"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-300/30 hover:text-cyan-200 sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Department studio</span>
        </Link>
      </div>

      {errorMsg ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          Failed to load departments: {errorMsg}
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-16 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No teams to show</h3>
          <p className="mt-1 text-xs text-slate-500">New departments will appear in this directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {departments.map((dept) => (
            <Link
              key={dept.departmentId}
              href={`/departments/${dept.departmentId}`}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-cyan-300/30"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-300 transition-colors group-hover:bg-cyan-300/15">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                    <FolderKanban className="h-3.5 w-3.5 text-violet-300" />
                    {dept.projectCount} {dept.projectCount === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                  {dept.departmentName}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">
                  {dept.departmentDescription}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-3 text-xs font-medium text-cyan-300">
                <span>Open team profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
