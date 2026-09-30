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

  // Fetch filter metadata (projects and tags)
  useEffect(() => {
    async function loadMeta() {
      try {
        const [projRes, tagRes] = await Promise.all([getProjects(), getTags()]);
        setProjects(projRes);
        setTags(tagRes);
      } catch (err) {
        console.error('Failed to load filter metadata', err);
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
    } catch (err) {
      console.error('Search failed', err);
      setTasks([]);
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
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <SearchIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          Task Search & Filter
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Real-time interactive multi-criteria filter across all active project deliverables.
        </p>
      </div>

      {/* Filter Control Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        {/* Title input */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title keyword..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Status Select */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 truncate"
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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Tag
            </label>
            <select
              value={tagId}
              onChange={(e) => setTagId(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Clear Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="text-slate-500 dark:text-slate-400 font-medium">
            Found <span className="font-bold text-slate-900 dark:text-white">{tasks.length}</span> matching tasks
          </div>

          {(title || status !== -1 || priority !== -1 || projectId !== -1 || tagId !== -1) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No tasks matched your criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search term or clearing one of the filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {tasks.map((task) => (
            <Link
              key={task.taskId}
              href={`/tasks/${task.taskId}`}
              className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all"
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

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
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
