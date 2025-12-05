'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import type { ProjectResponse, ChangeRequestListResponse, ChangeRequestStatus } from '@moaa/shared';

const statusColors: Record<ChangeRequestStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  AWAITING_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  MERGED: 'bg-purple-100 text-purple-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequestListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', projectId: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [projectsData, requestsData] = await Promise.all([
        api.projects.list() as Promise<ProjectResponse[]>,
        api.changeRequests.list() as Promise<ChangeRequestListResponse>,
      ]);
      setProjects(projectsData);
      setChangeRequests(requestsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.changeRequests.create(newRequest);
      setShowNewRequest(false);
      setNewRequest({ title: '', description: '', projectId: '' });
      loadData();
    } catch (err) {
      console.error('Failed to create request:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-primary-600">MOAA</span>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => setShowNewRequest(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium"
          >
            + New Change Request
          </button>
        </div>

        {/* New Request Modal */}
        {showNewRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">New Change Request</h2>
              <form onSubmit={handleSubmitRequest}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                    <select
                      required
                      value={newRequest.projectId}
                      onChange={(e) => setNewRequest({ ...newRequest, projectId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select a project</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newRequest.title}
                      onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Brief title for your change"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newRequest.description}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, description: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Describe what you want to change in detail..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewRequest(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Projects</h3>
            <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Change Requests</h3>
            <p className="text-3xl font-bold text-gray-900">{changeRequests?.total || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Awaiting Review</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {changeRequests?.items.filter((r) => r.status === 'AWAITING_REVIEW').length || 0}
            </p>
          </div>
        </div>

        {/* Recent Change Requests */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Change Requests</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {changeRequests?.items.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No change requests yet. Create one to get started!
              </div>
            ) : (
              changeRequests?.items.map((request) => (
                <div key={request.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {request.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}
                    >
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
