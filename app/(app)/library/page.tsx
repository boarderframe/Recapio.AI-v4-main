'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, FolderIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';

interface Folder {
  id: string;
  name: string;
  transcriptCount: number;
}

interface SavedTranscript {
  id: string;
  title: string;
  folder: string;
  lastModified: string;
}

export default function LibraryPage() {
  const [folders] = useState<Folder[]>([]);
  const [savedTranscripts] = useState<SavedTranscript[]>([]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Library</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize your transcripts into folders and access your saved work.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
          <Button variant="outline" asChild>
            <Link href="/library/new-folder">
              <FolderIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Folder
            </Link>
          </Button>
          <Button asChild>
            <Link href="/new-transcript">
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Transcript
            </Link>
          </Button>
        </div>
      </div>

      {folders.length === 0 && savedTranscripts.length === 0 ? (
        <div className="mt-12 text-center">
          <FolderIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">No folders or transcripts</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating a new folder or transcript.
          </p>
          <div className="mt-6 space-x-4">
            <Button variant="outline" asChild>
              <Link href="/library/new-folder">
                <FolderIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                New Folder
              </Link>
            </Button>
            <Button asChild>
              <Link href="/new-transcript">
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                New Transcript
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Folders Section */}
          <section>
            <h2 className="text-lg font-medium text-foreground mb-4">Folders</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={`/library/folder/${folder.id}`}
                  className="group relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-background px-6 py-5 shadow-sm hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    <FolderIcon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-foreground">{folder.name}</p>
                    <p className="truncate text-sm text-muted-foreground">{folder.transcriptCount} transcripts</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Saved Transcripts Section */}
          <section>
            <h2 className="text-lg font-medium text-foreground mb-4">Recent Transcripts</h2>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-secondary">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Folder
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                      Last Modified
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-background">
                  {savedTranscripts.map((transcript) => (
                    <tr key={transcript.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                        {transcript.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                        {transcript.folder}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                        {transcript.lastModified}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={`/library/transcript/${transcript.id}`} className="text-primary-600 hover:text-primary-900">
                          View<span className="sr-only">, {transcript.title}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
} 