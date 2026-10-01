'use client';

import React, { useState, useEffect } from 'react';
import { 
  getTasks, 
  getProjects, 
  getTags, 
  createTask, 
  updateTask, 
  deleteTask 
} from '@/lib/api';
import { Task, Project, Tag } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import TagChip from '@/components/TagChip';
import { useToast } from '@/components/ToastContext';
import { 
  CheckSquare, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  FolderKanban, 
  Loader2,
  Tag as TagIcon
} from 'lucide-react';

export default function TaskManagePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<number>(0);
  const [status, setStatus] = useState<number>(0);
  const [priority, setPriority] = useState<number>(1);
  const [dueDate, setDueDate] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Soft delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [taskData, projData, tagData] = await Promise.all([
        getTasks(),
        getProjects(),
        getTags(),
      ]);
      setTasks(taskData);
      setProjects(projData);
      setTags(tagData);
      if (projData.length > 0 && projectId === 0) {
        setProjectId(projData[0].projectId);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load task management data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setProjectId(projects.length > 0 ? projects[0].projectId : 0);
    setStatus(0);
    setPriority(1);
    setDueDate('');
    setSelectedTagIds([]);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description || '');
    setProjectId(t.projectId);
    setStatus(t.status);
    setPriority(t.priority);
    setDueDate(t.dueDate || '');
    setSelectedTagIds(t.tags ? t.tags.map((tag) => tag.tagId) : []);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Task Title is required';
    else if (title.length > 300) errors.title = 'Maximum 300 characters allowed';

    if (!projectId || projectId <= 0) errors.projectId = 'Project assignment is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.taskId, {
          title: title.trim(),
          description: description.trim() || undefined,
          projectId,
          status,
          priority,
          dueDate: dueDate || undefined,
          isActive: true,
          tagIds: selectedTagIds,
        });
        toast.success(`Task "${title}" updated successfully`);
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim() || undefined,
          projectId,
          status,
          priority,
          dueDate: dueDate || undefined,
          tagIds: selectedTagIds,
        });
        toast.success(`Task "${title}" created successfully`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteTask(deletingId);
      toast.success('Task soft-deleted successfully (IsActive = false)');
      setDeletingId(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Cannot delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase text-sky-300">Workspace settings</p>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            <CheckSquare className="h-6 w-6 text-sky-300" /> Task board
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Keep ownership, priority, and delivery dates in view.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Work item</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Due</th>
                <th className="px-6 py-4">Labels</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-600" />
                    Loading the task board...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    No active tasks on the board.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.taskId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 font-semibold">
                      #{task.taskId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <FolderKanban className="w-3.5 h-3.5 text-violet-500" />
                        {task.projectName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} type="task" size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {task.dueDate ? (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {task.dueDate}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {task.tags && task.tags.length > 0 ? (
                          task.tags.map((tag) => (
                            <TagChip key={tag.tagId} tag={tag} size="sm" />
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit task"
                          aria-label={`Edit ${task.title}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(task.taskId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Deactivate task"
                          aria-label={`Deactivate ${task.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Update task' : 'Create a task'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Task title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Describe the piece of work"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                formErrors.title ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500'
              }`}
            />
            {formErrors.title && <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Project <span className="text-red-400">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(parseInt(e.target.value, 10))}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                formErrors.projectId ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-sky-500'
              }`}
            >
              <option value={0}>Select a Project</option>
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName} ({p.departmentName})
                </option>
              ))}
            </select>
            {formErrors.projectId && <p className="mt-1 text-xs text-red-500">{formErrors.projectId}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add useful context for the person doing the work"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value={0}>To do</option>
                <option value={1}>In progress</option>
                <option value={2}>Done</option>
                <option value={3}>Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase text-slate-400">
              <span>Labels</span>
              <span className="text-[10px] font-normal normal-case text-slate-500">Choose any that apply</span>
            </label>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.tagId);
                return (
                  <button
                    key={tag.tagId}
                    type="button"
                    onClick={() => toggleTag(tag.tagId)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: tag.color || '#6366F1' }} 
                    />
                    #{tag.tagName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingTask ? 'Save task' : 'Create task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Soft-Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleSoftDelete}
        title="Deactivate this task?"
        message="This task will leave active project views. Its history remains available in the system."
        confirmLabel="Deactivate task"
        isLoading={isDeleting}
      />
    </div>
  );
}
