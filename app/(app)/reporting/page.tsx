'use client';

import { useState } from 'react';
import { ChartBarIcon, ClockIcon, DocumentTextIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';

interface Stats {
  totalTranscripts: number;
  totalDuration: string;
  averageLength: string;
  completionRate: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

export default function ReportingPage() {
  const [stats] = useState<Stats>({
    totalTranscripts: 0,
    totalDuration: '0 hours',
    averageLength: '0 minutes',
    completionRate: '0%',
  });

  const [recentActivity] = useState<RecentActivity[]>([]);

  const cards = [
    { name: 'Total Transcripts', value: stats.totalTranscripts, icon: DocumentTextIcon },
    { name: 'Total Duration', value: stats.totalDuration, icon: ClockIcon },
    { name: 'Average Length', value: stats.averageLength, icon: ChartBarIcon },
    { name: 'Completion Rate', value: stats.completionRate, icon: ArrowTrendingUpIcon },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Reporting</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View analytics and insights about your transcripts and usage.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button variant="outline">
            Download Report
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.name} className="overflow-hidden rounded-lg bg-background px-4 py-5 shadow sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-muted-foreground">{card.name}</dt>
                    <dd className="mt-1 text-lg font-semibold tracking-tight text-foreground">{card.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-foreground mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Start creating transcripts to see analytics and insights.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-background">
                {recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                      {activity.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {activity.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                      {activity.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 