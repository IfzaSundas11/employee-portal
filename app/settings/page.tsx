"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  Bell,
  Palette,
  Globe,
  Save,
  ChevronRight,
} from "lucide-react";
import { applyTheme, getStoredTheme, Theme } from "@/lib/theme/theme";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("Light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskNotifications, setTaskNotifications] = useState(true);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  function handleThemeChange(newTheme: Theme) {
    setTheme(newTheme);
    applyTheme(newTheme);
  }

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your account and portal preferences.
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Profile Settings */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Profile Settings
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Personal account information
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="space-y-4 p-5">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Full Name
                </label>

                <input
                  type="text"
                  defaultValue="Admin User"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  defaultValue="admin@example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Phone
                </label>

                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Role
                </label>

                <input
                  type="text"
                  defaultValue="Administrator"
                  disabled
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950">
                  <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Company Information
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Organization details
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="space-y-4 p-5">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Company Name
                </label>

                <input
                  type="text"
                  defaultValue="Employee Portal"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Company Email
                </label>

                <input
                  type="email"
                  defaultValue="company@example.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Address
                </label>

                <textarea
                  rows={4}
                  placeholder="Enter company address"
                  className="w-full resize-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-white outline-none transition focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950">
                  <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Appearance
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Customize portal appearance
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="p-5">

              <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                Theme
              </p>

              <div className="grid grid-cols-3 gap-2">

                <button
                  onClick={() => handleThemeChange("Light")}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    theme === "Light"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Light
                </button>

                <button
                  onClick={() => handleThemeChange("Dark")}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    theme === "Dark"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  Dark
                </button>

                <button
                  onClick={() => handleThemeChange("System")}
                  className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                    theme === "System"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  }`}
                >
                  System
                </button>

              </div>

              <div className="mt-4 rounded-lg bg-slate-50 dark:bg-slate-800 px-4 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Selected theme
                </p>

                <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-white">
                  {theme}
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Notifications
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage notification preferences
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="space-y-3 p-5">

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">

                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Email Notifications
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Receive important updates through email.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) =>
                    setEmailNotifications(e.target.checked)
                  }
                  className="h-5 w-5 accent-blue-600"
                />

              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800">

                <div className="pr-4">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Task Notifications
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Receive notifications about assigned tasks.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={taskNotifications}
                  onChange={(e) =>
                    setTaskNotifications(e.target.checked)
                  }
                  className="h-5 w-5 accent-blue-600"
                />

              </label>

            </div>
          </div>

          {/* Language & Region */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 dark:bg-green-950">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Language & Region
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Language and regional preferences
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Language
                </label>

                <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-700 dark:text-white outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900">
                  <option>English</option>
                  <option>Urdu</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Time Zone
                </label>

                <select
                  defaultValue="Asia/Karachi"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-700 dark:text-white outline-none focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
                >
                  <option value="Asia/Karachi">Pakistan Standard Time (UTC+05:00) — Karachi</option>
                  <option value="Asia/Dubai">Gulf Standard Time (UTC+04:00) — Dubai</option>
                  <option value="Asia/Riyadh">Arabia Standard Time (UTC+03:00) — Riyadh</option>
                  <option value="Asia/Kolkata">India Standard Time (UTC+05:30) — New Delhi</option>
                  <option value="Asia/Dhaka">Bangladesh Standard Time (UTC+06:00) — Dhaka</option>
                  <option value="Asia/Tokyo">Japan Standard Time (UTC+09:00) — Tokyo</option>
                  <option value="Asia/Seoul">Korea Standard Time (UTC+09:00) — Seoul</option>
                  <option value="Asia/Shanghai">China Standard Time (UTC+08:00) — Shanghai</option>
                  <option value="Europe/London">Greenwich Mean Time — London</option>
                  <option value="Europe/Paris">Central European Time — Paris</option>
                  <option value="America/New_York">Eastern Time — New York</option>
                  <option value="America/Chicago">Central Time — Chicago</option>
                  <option value="America/Denver">Mountain Time — Denver</option>
                  <option value="America/Los_Angeles">Pacific Time — Los Angeles</option>
                  <option value="Australia/Sydney">Australian Eastern Time — Sydney</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Portal Preferences */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950">
                  <SettingsIcon />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">
                    Portal Preferences
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    General employee portal settings
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="space-y-3 p-5">

              <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Dashboard View
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Use the standard dashboard layout.
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
                  Standard
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Portal Version
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Current employee management system version.
                  </p>
                </div>

                <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  V2.0
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end pb-8">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

/* Small settings icon */
function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5 text-sky-600 dark:text-sky-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.03H6.6v-2.4h.24A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.67 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.34 10a1.7 1.7 0 0 0 1.56 1.03h.24v2.4h-.24A1.7 1.7 0 0 0 19.4 15Z"
      />
    </svg>
  );
}