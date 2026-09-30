'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CheckSquare, 
  Layers, 
  FolderKanban, 
  Search, 
  Settings, 
  ChevronDown, 
  Menu, 
  X,
  Tag as TagIcon
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 dark:from-white dark:via-indigo-200 dark:to-indigo-400">
                TaskTrack
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                Team & Task Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/departments"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/departments') && !pathname.includes('manage')
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Departments
            </Link>

            <Link
              href="/search"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                isActive('/search')
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              Search
            </Link>

            {/* Management Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsManageOpen(!isManageOpen)}
                onBlur={() => setTimeout(() => setIsManageOpen(false), 200)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                  pathname.includes('/manage')
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Management
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isManageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isManageOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Public CRUD Portals
                  </div>
                  <Link
                    href="/departments/manage"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <Layers className="w-4 h-4 text-indigo-500" />
                    Departments
                  </Link>
                  <Link
                    href="/projects/manage"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <FolderKanban className="w-4 h-4 text-violet-500" />
                    Projects
                  </Link>
                  <Link
                    href="/tasks/manage"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <CheckSquare className="w-4 h-4 text-sky-500" />
                    Tasks
                  </Link>
                  <Link
                    href="/tags/manage"
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <TagIcon className="w-4 h-4 text-emerald-500" />
                    Tags
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Dashboard
            </Link>
            <Link
              href="/departments"
              onClick={() => setIsMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Departments
            </Link>
            <Link
              href="/search"
              onClick={() => setIsMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Search
            </Link>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Management
              </div>
              <Link
                href="/departments/manage"
                onClick={() => setIsMobileOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
              >
                Manage Departments
              </Link>
              <Link
                href="/projects/manage"
                onClick={() => setIsMobileOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
              >
                Manage Projects
              </Link>
              <Link
                href="/tasks/manage"
                onClick={() => setIsMobileOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
              >
                Manage Tasks
              </Link>
              <Link
                href="/tags/manage"
                onClick={() => setIsMobileOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 dark:text-slate-300"
              >
                Manage Tags
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
