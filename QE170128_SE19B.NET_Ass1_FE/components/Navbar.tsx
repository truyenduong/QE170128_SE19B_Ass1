 'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, CheckSquare, ChevronRight, FolderKanban, Layers, Menu, Search, Settings2, Tag, X } from 'lucide-react';

const primaryLinks = [
  { href: '/', label: 'Overview', icon: CheckSquare },
  { href: '/departments', label: 'Departments', icon: Layers },
  { href: '/search', label: 'Task discovery', icon: Search },
];

const manageLinks = [
  { href: '/departments/manage', label: 'Departments', icon: Layers },
  { href: '/projects/manage', label: 'Projects', icon: FolderKanban },
  { href: '/tasks/manage', label: 'Tasks', icon: CheckSquare },
  { href: '/tags/manage', label: 'Tags', icon: Tag },
];

const routeNames: Record<string, string> = {
  departments: 'Departments',
  projects: 'Projects',
  tasks: 'Tasks',
  tags: 'Tags',
  manage: 'Management',
  search: 'Task discovery',
};

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.length === 0
    ? ['Workspace']
    : ['Workspace', ...segments.map((segment) => /^\d+$/.test(segment) ? `#${segment}` : routeNames[segment] || segment)];

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {isMobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={closeMobile} />}
      <aside className={`workspace-sidebar transition-transform duration-200 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Link href="/" onClick={closeMobile} className="mb-10 flex items-center gap-3 px-2">
          <span className="flex size-11 items-center justify-center rounded-xl bg-cyan-300 text-[#10131a] shadow-[0_0_30px_rgba(80,210,199,0.18)]">
            <CheckSquare size={21} strokeWidth={2.4} />
          </span>
          <span>
            <span className="block text-[17px] font-bold tracking-tight text-white">TaskTrack</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase text-slate-400">Work, in focus</span>
          </span>
        </Link>

        <div className="mb-2 px-3 text-[10px] font-bold uppercase text-slate-500">Workspace</div>
        <nav aria-label="Workspace" className="space-y-1">
          {primaryLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={closeMobile} aria-current={isActive(href) ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${isActive(href) ? 'bg-indigo-50 text-indigo-400' : 'text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'}`}>
              <Icon size={17} strokeWidth={1.8} />
              {label}
              {isActive(href) && <span className="ml-auto size-1.5 rounded-full bg-cyan-300" />}
            </Link>
          ))}
        </nav>

        <div className="mb-2 mt-9 flex items-center gap-2 px-3 text-[10px] font-bold uppercase text-slate-500">
          <Settings2 size={13} /> Manage data
        </div>
        <nav aria-label="Management" className="space-y-1">
          {manageLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={closeMobile} aria-current={isActive(href) ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${isActive(href) ? 'bg-indigo-50 text-indigo-400' : 'text-slate-400 hover:bg-white/[0.045] hover:text-slate-100'}`}>
              <Icon size={16} strokeWidth={1.8} />
              {label}
              {isActive(href) && <span className="ml-auto size-1.5 rounded-full bg-cyan-300" />}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-slate-200"><span className="size-1.5 rounded-full bg-emerald-400" />Connected workspace</div>
          <p className="text-[11px] leading-relaxed text-slate-500">Your teams, projects, and tasks in one place.</p>
          <Link href="/search" onClick={closeMobile} className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-200">
            Find a task <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="mt-4 flex items-center justify-between px-1 text-[10px] text-slate-600">
          <span>TaskTrack</span><span>v1.0</span>
        </div>
      </aside>

      <header className="workspace-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <button aria-label={isMobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setIsMobileOpen(!isMobileOpen)} className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 md:hidden">
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-xs">
            {breadcrumb.map((crumb, index) => (
              <span key={`${crumb}-${index}`} className="flex min-w-0 items-center gap-2">
                {index > 0 && <ChevronRight size={13} className="shrink-0 text-slate-600" />}
                <span className={`truncate ${index === breadcrumb.length - 1 ? 'font-medium text-slate-200' : 'text-slate-500'}`}>{crumb}</span>
              </span>
            ))}
          </nav>
        </div>
        <Link href="/search" aria-label="Search tasks" title="Search tasks" className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition-colors hover:border-cyan-300/30 hover:text-cyan-200">
          <Search size={16} />
        </Link>
      </header>
    </>
  );
}
