const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
    register: (email: string, name: string, password: string) =>
      apiRequest('/auth/register', { method: 'POST', body: { email, name, password } }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  },
  users: {
    me: () => apiRequest('/users/me'),
  },
  projects: {
    list: () => apiRequest('/projects'),
    get: (id: string) => apiRequest(`/projects/${id}`),
    create: (data: { name: string; description?: string; repositoryUrl: string }) =>
      apiRequest('/projects', { method: 'POST', body: data }),
    update: (id: string, data: { name?: string; description?: string }) =>
      apiRequest(`/projects/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) => apiRequest(`/projects/${id}`, { method: 'DELETE' }),
  },
  changeRequests: {
    list: (page = 1, pageSize = 20) =>
      apiRequest(`/change-requests?page=${page}&pageSize=${pageSize}`),
    get: (id: string) => apiRequest(`/change-requests/${id}`),
    create: (data: { title: string; description: string; projectId: string }) =>
      apiRequest('/change-requests', { method: 'POST', body: data }),
    approve: (id: string) => apiRequest(`/change-requests/${id}/approve`, { method: 'POST' }),
    reject: (id: string) => apiRequest(`/change-requests/${id}/reject`, { method: 'POST' }),
  },
};
