'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { searchTasks, getProjects, getTags } from '@/lib/api';
import { Task, Project, Tag } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import TagChip from '@/components/TagChip';
import { 
  Search as SearchIcon, 
  RotateCcw, 
  CheckSquare, 
  Calendar, 
  ArrowRight,
  Filter,
  Loader2,
  FolderKanban
} from 'lucide-react';

export default function SearchPage() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<number | -1>(-1);
  const [priority, setPriority] = useState<number | -1>(-1);
  const [projectId, setProjectId] = useState<number | -1>(-1);
  const [tagId, setTagId] = useState<number | -1>(-1);

  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  // Fetch filter metadata (projects and tags)
  useEffect(() => {
    async function loadMeta() {
      try {
        const [projRes, tagRes] = await Promise.all([getProjects(), getTags()]);
        setProjects(projRes);
        setTags(tagRes);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
        setMetadataError('Some filter options are unavailable right now.');
      }
    }
    loadMeta();
  }, []);

  // Fetch filtered tasks
  const executeSearch = useCallback(async () => {
    setLoading(true);
    try {
      const results = await searchTasks({
        title: title.trim() || undefined,
        status: status === -1 ? undefined : status,
        priority: priority === -1 ? undefined : priority,
        projectId: projectId === -1 ? undefined : projectId,
        tagId: tagId === -1 ? undefined : tagId,
      });
      setTasks(results);
      setSearchError(null);
    } catch (err) {
      console.error('Search failed', err);
      setTasks([]);
      setSearchError(err instanceof Error ? err.message : 'Task results could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [title, status, priority, projectId, tagId]);

  // Reactive trigger on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch();
    }, 250); // 250ms debounce for typing
    return () => clearTimeout(timer);
  }, [executeSearch]);

  const handleReset = () => {
    setTitle('');
    setStatus(-1);
    setPriority(-1);
    setProjectId(-1);
    setTagId(-1);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase text-cyan-300">Task index</p>
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Find the next thing
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Search the work queue and narrow it down as priorities shift.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
          <input
            type="text"
            placeholder="Search tasks by title keyword..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/70 py-3 pl-11 pr-4 text-sm text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 xl:grid-cols-4">
          {/* Status Select */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-500">
              Work state
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            >
              <option value={-1}>All Statuses</option>
              <option value={0}>To Do</option>
              <option value={1}>In Progress</option>
              <option value={2}>Done</option>
              <option value={3}>Cancelled</option>
            </select>
          </div>

          {/* Priority Select */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-500">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            >
              <option value={-1}>All Priorities</option>
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
              <option value={3}>Critical</option>
            </select>
          </div>

          {/* Project Select */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-500">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(parseInt(e.target.value, 10))}
              className="w-full truncate rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            >
              <option value={-1}>All Projects</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Select */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-500">
              Tag
            </label>
            <select
              value={tagId}
              onChange={(e) => setTagId(parseInt(e.target.value, 10))}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-300/30"
            >
              <option value={-1}>All Tags</option>
              {tags.map((t) => (
                <option key={t.tagId} value={t.tagId}>
                  #{t.tagName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
          <div className="font-medium text-slate-400">
            <span className="font-semibold text-slate-100">{tasks.length}</span> results in this view
          </div>

          {(title || status !== -1 || priority !== -1 || projectId !== -1 || tagId !== -1) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div aria-label="Loading task results" className="space-y-2 animate-pulse">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-24 rounded-xl border border-slate-800 bg-slate-900" />)}
        </div>
      ) : searchError ? (
        <div role="alert" className="rounded-xl border border-rose-900/70 bg-rose-950/35 p-5 text-sm text-rose-200">
          <div className="font-semibold">Task results are unavailable</div>
          <p className="mt-1 text-xs text-rose-200/70">{searchError}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-16 text-center">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No work found for this combination</h3>
          <p className="mt-1 text-xs text-slate-500">Adjust a filter or clear the search to widen the list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {tasks.map((task) => (
            <Link
              key={task.taskId}
              href={`/tasks/${task.taskId}`}
              className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-cyan-300/30 md:flex-row md:items-center"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={task.status} type="task" size="sm" />
                  <PriorityBadge priority={task.priority} />
                  {task.projectName && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <FolderKanban className="w-3.5 h-3.5 text-violet-500" />
                      {task.projectName}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3 h-3" />
                      Due {task.dueDate}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-100 transition-colors group-hover:text-cyan-200">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                  {task.tags && task.tags.length > 0 ? (
                    task.tags.map((tag) => (
                      <TagChip key={tag.tagId} tag={tag} size="sm" />
                    ))
                  ) : null}
                </div>

                <div className="text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pl-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
