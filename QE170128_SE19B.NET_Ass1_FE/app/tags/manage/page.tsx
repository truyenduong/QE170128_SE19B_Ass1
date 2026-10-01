'use client';

import React, { useState, useEffect } from 'react';
import { 
  getTags, 
  createTag, 
  updateTag, 
  deleteTag 
} from '@/lib/api';
import { Tag } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/components/ToastContext';
import { 
  Tag as TagIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  CheckSquare, 
  Palette 
} from 'lucide-react';

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#DC2626', // Crimson
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#64748B', // Slate
];

export default function TagManagePage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingTag(null);
    setTagName('');
    setColor('#3B82F6');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (t: Tag) => {
    setEditingTag(t);
    setTagName(t.tagName);
    setColor(t.color || '#3B82F6');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!tagName.trim()) errors.tagName = 'Tag Name is required';
    else if (tagName.length > 50) errors.tagName = 'Maximum 50 characters allowed';

    if (color && !/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) {
      errors.color = 'Must be a valid hex color code (e.g. #3B82F6)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingTag) {
        await updateTag(editingTag.tagId, {
          tagName: tagName.trim(),
          color: color.trim() || undefined,
        });
        toast.success(`Tag "${tagName}" updated successfully`);
      } else {
        await createTag({
          tagName: tagName.trim(),
          color: color.trim() || undefined,
        });
        toast.success(`Tag "${tagName}" created successfully`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteTag(deletingId);
      toast.success('Tag deleted successfully');
      setDeletingId(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Cannot delete tag');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase text-emerald-300">Workspace settings</p>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            <TagIcon className="h-6 w-6 text-emerald-300" /> Label palette
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create reusable labels to make related work easy to spot.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New label
        </button>
      </div>

      {/* Tags Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Label</th>
                <th className="px-6 py-4">Appearance</th>
                <th className="px-6 py-4">Used on tasks</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    Loading labels...
                  </td>
                </tr>
              ) : tags.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No labels have been created yet.
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.tagId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 font-semibold">
                      #{tag.tagId}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      #{tag.tagName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium"
                          style={{
                            backgroundColor: `${tag.color || '#6366F1'}18`,
                            color: tag.color || '#6366F1',
                            border: `1px solid ${tag.color || '#6366F1'}40`,
                          }}
                        >
                          <TagIcon className="w-3 h-3" />
                          #{tag.tagName}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {tag.color || 'No color'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-xs text-slate-700 dark:text-slate-300">
                        <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                        {tag.taskCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(tag)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit label"
                          aria-label={`Edit ${tag.tagName}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(tag.tagId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete label"
                          aria-label={`Delete ${tag.tagName}`}
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
        title={editingTag ? 'Update label' : 'Create a label'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Label name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Name this label"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                formErrors.tagName ? 'border-red-500 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500'
              }`}
            />
            {formErrors.tagName && <p className="mt-1 text-xs text-red-500">{formErrors.tagName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Label color</span>
              <span className="font-mono text-[11px] text-slate-400">{color}</span>
            </label>
            
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3B82F6"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Color Presets */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color.toLowerCase() === c.toLowerCase() ? 'scale-125 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>

            {formErrors.color && <p className="mt-1 text-xs text-red-500">{formErrors.color}</p>}
          </div>

          {/* Live Preview */}
          <div className="pt-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Preview
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium"
              style={{
                backgroundColor: `${color || '#6366F1'}18`,
                color: color || '#6366F1',
                border: `1px solid ${color || '#6366F1'}40`,
              }}
            >
              <TagIcon className="w-3 h-3" />
              #{tagName || 'tag-preview'}
            </span>
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
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingTag ? 'Save label' : 'Create label'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove this label?"
        message="The label will be removed from the workspace. The request cannot complete while tasks still use it."
        confirmLabel="Remove label"
        isLoading={isDeleting}
      />
    </div>
  );
}
