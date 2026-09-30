import {
  Department,
  DepartmentDetail,
  DepartmentInput,
  Project,
  ProjectDetail,
  ProjectInput,
  Tag,
  TagInput,
  Task,
  TaskInput,
} from './types';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '')}/api`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMsg = errorData.message;
      } else if (errorData.errors) {
        errorMsg = Object.values(errorData.errors).flat().join(', ');
      }
    } catch {
      // Body not JSON
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

// ==================== DEPARTMENTS ====================
export async function getDepartments(): Promise<Department[]> {
  const res = await fetch(`${API_BASE}/departments`, { cache: 'no-store' });
  return handleResponse<Department[]>(res);
}

export async function getDepartment(id: number): Promise<DepartmentDetail> {
  const res = await fetch(`${API_BASE}/departments/${id}`, { cache: 'no-store' });
  return handleResponse<DepartmentDetail>(res);
}

export async function searchDepartments(name: string): Promise<Department[]> {
  const res = await fetch(`${API_BASE}/departments/search?name=${encodeURIComponent(name)}`, { cache: 'no-store' });
  return handleResponse<Department[]>(res);
}

export async function createDepartment(data: DepartmentInput): Promise<Department> {
  const res = await fetch(`${API_BASE}/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Department>(res);
}

export async function updateDepartment(id: number, data: DepartmentInput): Promise<Department> {
  const res = await fetch(`${API_BASE}/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Department>(res);
}

export async function deleteDepartment(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/departments/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

// ==================== PROJECTS ====================
export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`, { cache: 'no-store' });
  return handleResponse<Project[]>(res);
}

export async function getProject(id: number): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects/${id}`, { cache: 'no-store' });
  return handleResponse<ProjectDetail>(res);
}

export async function getProjectsByDepartment(deptId: number): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects/department/${deptId}`, { cache: 'no-store' });
  return handleResponse<Project[]>(res);
}

export async function searchProjects(params: { name?: string; status?: number; departmentId?: number }): Promise<Project[]> {
  const query = new URLSearchParams();
  if (params.name) query.append('name', params.name);
  if (params.status !== undefined && params.status !== -1) query.append('status', params.status.toString());
  if (params.departmentId && params.departmentId !== -1) query.append('departmentId', params.departmentId.toString());

  const res = await fetch(`${API_BASE}/projects/search?${query.toString()}`, { cache: 'no-store' });
  return handleResponse<Project[]>(res);
}

export async function createProject(data: ProjectInput): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Project>(res);
}

export async function updateProject(id: number, data: ProjectInput): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Project>(res);
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

// ==================== TASKS ====================
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`, { cache: 'no-store' });
  return handleResponse<Task[]>(res);
}

export async function getTask(id: number): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { cache: 'no-store' });
  return handleResponse<Task>(res);
}

export async function getTasksByProject(projectId: number): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks/project/${projectId}`, { cache: 'no-store' });
  return handleResponse<Task[]>(res);
}

export async function searchTasks(params: {
  title?: string;
  status?: number;
  priority?: number;
  projectId?: number;
  tagId?: number;
}): Promise<Task[]> {
  const query = new URLSearchParams();
  if (params.title) query.append('title', params.title);
  if (params.status !== undefined && params.status !== -1) query.append('status', params.status.toString());
  if (params.priority !== undefined && params.priority !== -1) query.append('priority', params.priority.toString());
  if (params.projectId && params.projectId !== -1) query.append('projectId', params.projectId.toString());
  if (params.tagId && params.tagId !== -1) query.append('tagId', params.tagId.toString());

  const res = await fetch(`${API_BASE}/tasks/search?${query.toString()}`, { cache: 'no-store' });
  return handleResponse<Task[]>(res);
}

export async function createTask(data: TaskInput): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(id: number, data: TaskInput): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Task>(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

// ==================== TAGS ====================
export async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${API_BASE}/tags`, { cache: 'no-store' });
  return handleResponse<Tag[]>(res);
}

export async function getTag(id: number): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags/${id}`, { cache: 'no-store' });
  return handleResponse<Tag>(res);
}

export async function createTag(data: TagInput): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Tag>(res);
}

export async function updateTag(id: number, data: TagInput): Promise<Tag> {
  const res = await fetch(`${API_BASE}/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Tag>(res);
}

export async function deleteTag(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/tags/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}
