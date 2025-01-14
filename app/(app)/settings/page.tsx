'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';

interface UserSettings {
  email: string;
  name: string;
  notifications: {
    email: boolean;
    browser: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    email: '',
    name: '',
    notifications: {
      email: true,
      browser: true,
    },
    preferences: {
      theme: 'system',
      language: 'en',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save settings
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-10 divide-y divide-gray-900/10">
        {/* Profile Section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-foreground">Profile</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Update your personal information.
            </p>
          </div>

          <form className="bg-background shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2" onSubmit={handleSubmit}>
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-foreground">
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>

        {/* Preferences Section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-foreground">Preferences</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Customize your experience.
            </p>
          </div>

          <form className="bg-background shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="theme" className="block text-sm font-medium leading-6 text-foreground">
                    Theme
                  </label>
                  <div className="mt-2">
                    <select
                      id="theme"
                      name="theme"
                      value={settings.preferences.theme}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: e.target.value as 'light' | 'dark' | 'system' }
                      })}
                      className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="language" className="block text-sm font-medium leading-6 text-foreground">
                    Language
                  </label>
                  <div className="mt-2">
                    <select
                      id="language"
                      name="language"
                      value={settings.preferences.language}
                      onChange={(e) => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, language: e.target.value }
                      })}
                      className="block w-full rounded-md border-0 py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>

        {/* Notifications Section */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-foreground">Notifications</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Choose how you want to be notified.
            </p>
          </div>

          <form className="bg-background shadow-sm ring-1 ring-gray-900/5 rounded-xl md:col-span-2">
            <div className="px-4 py-6 sm:p-8">
              <div className="max-w-2xl space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="email-notifications"
                      name="email-notifications"
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: e.target.checked }
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="email-notifications" className="font-medium text-foreground">
                      Email notifications
                    </label>
                    <p className="text-muted-foreground">Get notified when a transcript is complete.</p>
                  </div>
                </div>

                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="browser-notifications"
                      name="browser-notifications"
                      type="checkbox"
                      checked={settings.notifications.browser}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, browser: e.target.checked }
                      })}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="browser-notifications" className="font-medium text-foreground">
                      Browser notifications
                    </label>
                    <p className="text-muted-foreground">Get browser notifications when a transcript is complete.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 