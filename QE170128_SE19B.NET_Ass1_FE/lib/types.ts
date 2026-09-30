export interface Department {
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  isActive: boolean;
  projectCount: number;
}

export interface DepartmentDetail extends Department {
  projects: Project[];
}

export interface DepartmentInput {
  departmentName: string;
  departmentDescription: string;
  isActive: boolean;
}

export interface Project {
  projectId: number;
  projectName: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  status: number;
  statusName: string;
  departmentId: number;
  departmentName: string;
  isActive: boolean;
  createdDate: string;
  taskCount: number;
}

export interface ProjectDetail extends Project {
  tasks: Task[];
}

export interface ProjectInput {
  projectName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: number;
  departmentId: number;
  isActive: boolean;
}

export interface Tag {
  tagId: number;
  tagName: string;
  color?: string | null;
  taskCount?: number;
}

export interface TagInput {
  tagName: string;
  color?: string;
}

export interface Task {
  taskId: number;
  title: string;
  description?: string | null;
  status: number;
  statusName: string;
  priority: number;
  priorityName: string;
  dueDate?: string | null;
  projectId: number;
  projectName: string;
  departmentId?: number | null;
  departmentName: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string | null;
  tags: Tag[];
}

export interface TaskInput {
  title: string;
  description?: string;
  status: number;
  priority: number;
  dueDate?: string;
  projectId: number;
  isActive?: boolean;
  tagIds: number[];
}

export const PROJECT_STATUS_MAP: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'Not Started', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  1: { label: 'In Progress', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800' },
  2: { label: 'Completed', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' },
  3: { label: 'On Hold', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' },
};

export const TASK_STATUS_MAP: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: 'To Do', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  1: { label: 'In Progress', color: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 dark:border-sky-800' },
  2: { label: 'Done', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' },
  3: { label: 'Cancelled', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800' },
};

export const TASK_PRIORITY_MAP: Record<number, { label: string; color: string; bg: string; dot: string }> = {
  0: { label: 'Low', color: 'text-teal-700 dark:text-teal-300', bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-800', dot: 'bg-teal-500' },
  1: { label: 'Medium', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800', dot: 'bg-blue-500' },
  2: { label: 'High', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-50 dark:bg-orange-950/50 border-orange-300 dark:border-orange-800', dot: 'bg-orange-500' },
  3: { label: 'Critical', color: 'text-red-700 dark:text-red-300', bg: 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800', dot: 'bg-red-500' },
};
