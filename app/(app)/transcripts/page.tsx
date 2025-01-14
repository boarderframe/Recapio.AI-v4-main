'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';

export default function TranscriptsPage() {
  const [transcripts] = useState([]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Transcripts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage your audio transcripts. Create new transcripts by uploading audio files or recording directly.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button asChild>
            <Link href="/new-transcript">
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Transcript
            </Link>
          </Button>
        </div>
      </div>

      {transcripts.length === 0 ? (
        <div className="mt-12 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">No transcripts</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new transcript.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/new-transcript">
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                New Transcript
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-secondary">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                        Created
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                        Duration
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-background">
                    {transcripts.map((transcript) => (
                      <tr key={transcript.id}>
                        {/* Transcript row content will go here */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 