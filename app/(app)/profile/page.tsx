'use client';

import { useState } from 'react';
import { UserCircleIcon, KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/components/providers/AuthProvider';

interface Profile {
  name: string;
  email: string;
  role: string;
  joinedDate: string;
  lastActive: string;
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [profile] = useState<Profile>({
    name: user?.email?.split('@')[0] || '',
    email: user?.email || '',
    role: 'User',
    joinedDate: new Date().toLocaleDateString(),
    lastActive: new Date().toLocaleDateString(),
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and manage your profile information.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {/* Profile Overview */}
        <div className="bg-background shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-20 w-20 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {profile.role} · Joined {profile.joinedDate}
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Activity */}
        <div className="bg-background shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-foreground">Account Activity</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-background px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-muted-foreground">Last Active</dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-foreground">{profile.lastActive}</dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-background px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-muted-foreground">Total Transcripts</dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-foreground">0</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-background shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-foreground">Account Management</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <KeyIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm text-foreground">Change Password</span>
                </div>
                <Button variant="outline">Update</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <span className="text-sm text-foreground">Sign Out</span>
                </div>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-background shadow sm:rounded-lg border border-red-200">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-red-500">Danger Zone</h3>
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 