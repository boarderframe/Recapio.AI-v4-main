'use client';

import { useAuth } from '@/components/providers/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recent Transcripts */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Transcripts</h2>
                  <p className="mt-1 text-sm text-gray-500">You have no transcripts yet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">Storage Usage</h2>
                  <p className="mt-1 text-sm text-gray-500">0 MB used of 10 GB</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="relative h-2 rounded-full bg-gray-200">
                  <div className="absolute h-2 rounded-full bg-primary-600" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              <div className="mt-4 space-y-3">
                <button className="flex w-full items-center justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500">
                  New Transcript
                </button>
                <button className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  Upload Audio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 