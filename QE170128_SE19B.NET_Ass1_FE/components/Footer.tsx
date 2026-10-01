import React from 'react';
import { Layers, Database, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="workspace-footer">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-[11px]">
        <span className="font-medium text-slate-400">TaskTrack workspace</span>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5"><Database size={13} className="text-cyan-300" /> PostgreSQL</span>
          <span className="inline-flex items-center gap-1.5"><Layers size={13} className="text-violet-400" /> ASP.NET Core</span>
          <span className="inline-flex items-center gap-1.5"><Globe size={13} className="text-emerald-400" /> Next.js</span>
        </div>
      </div>
    </footer>
  );
}
