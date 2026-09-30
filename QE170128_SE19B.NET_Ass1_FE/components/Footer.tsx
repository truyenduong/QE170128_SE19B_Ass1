import React from 'react';
import { Layers, Database, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-200">PRN232</span>
            <span>•</span>
            <span>Assignment 01 — Task & Team Management Application</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              PostgreSQL
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
              <Layers className="w-3.5 h-3.5 text-violet-500" />
              ASP.NET Core 8
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-mono">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              Next.js 15
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-center md:text-left text-xs text-slate-400">
          Student ID: <span className="font-mono font-medium text-slate-600 dark:text-slate-300">QE170128</span> | Class Code: <span className="font-mono font-medium text-slate-600 dark:text-slate-300">SE19B.NET</span>
        </div>
      </div>
    </footer>
  );
}
