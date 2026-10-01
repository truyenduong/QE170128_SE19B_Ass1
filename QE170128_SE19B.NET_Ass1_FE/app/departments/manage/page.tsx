'use client';

import React, { useState, useEffect } from 'react';
import { 
  getDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '@/lib/api';
import { Department } from '@/lib/types';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from '@/components/ToastContext';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  FolderKanban, 
  Loader2, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export default function DepartmentManagePage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setIsActive(true);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.departmentName);
    setDescription(dept.departmentDescription);
    setIsActive(dept.isActive);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors: { name?: string; description?: string } = {};
    if (!name.trim()) errors.name = 'Department Name is required';
    else if (name.length > 100) errors.name = 'Maximum 100 characters allowed';

    if (!description.trim()) errors.description = 'Description is required';
    else if (description.length > 300) errors.description = 'Maximum 300 characters allowed';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editingDept) {
        await updateDepartment(editingDept.departmentId, {
          departmentName: name.trim(),
          departmentDescription: description.trim(),
          isActive,
        });
        toast.success(`Department "${name}" updated successfully`);
      } else {
        await createDepartment({
          departmentName: name.trim(),
          departmentDescription: description.trim(),
          isActive,
        });
        toast.success(`Department "${name}" created successfully`);
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
      await deleteDepartment(deletingId);
      toast.success('Department deleted successfully');
      setDeletingId(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Cannot delete department');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase text-cyan-300">Workspace settings</p>
          <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
            <Layers className="h-6 w-6 text-cyan-300" /> Team studio
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Shape the groups that bring your projects and people together.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New team
        </button>
      </div>

      {/* Departments Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Team</th>
                <th className="px-6 py-4">Scope</th>
                <th className="px-6 py-4">Projects</th>
                <th className="px-6 py-4">Visibility</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                    Loading teams...
                  </td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No teams have been created yet.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.departmentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 font-semibold">
                      #{dept.departmentId}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {dept.departmentName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {dept.departmentDescription}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-medium text-xs">
                        <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
                        {dept.projectCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {dept.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                          <XCircle className="w-3.5 h-3.5" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(dept)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit team"
                          aria-label={`Edit ${dept.departmentName}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(dept.departmentId)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete team"
                          aria-label={`Delete ${dept.departmentName}`}
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
        title={editingDept ? 'Update team' : 'Create a team'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Team name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name this group"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                formErrors.name 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              What this team owns <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe its focus and responsibilities"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                formErrors.description 
                  ? 'border-red-500 focus:ring-red-400' 
                  : 'border-slate-200 dark:border-slate-700 focus:ring-indigo-500'
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="deptActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="deptActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Show this team in the workspace
            </label>
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
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingDept ? 'Save team' : 'Create team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove this team?"
        message="This team will be removed from the workspace. The request cannot complete while projects are still linked to it."
        confirmLabel="Remove team"
        isLoading={isDeleting}
      />
    </div>
  );
}
