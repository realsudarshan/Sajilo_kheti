'use client'

import { useEffect, useMemo, useState } from "react";

type Prefs = {
  landing: string;
  sidebarCollapsed: boolean;
  timezone: string;
};

const STORAGE_KEY = "sajilokheti:admin:prefs";

const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const defaultPrefs: Prefs = {
  landing: "/admin",
  sidebarCollapsed: false,
  timezone: defaultTimezone,
};

export function QuickPreferences() {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [status, setStatus] = useState<string>("Saved locally");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Prefs>;
        setPrefs({ ...defaultPrefs, ...parsed });
      }
    } catch {
      // ignore parse errors, keep defaults
    }
  }, []);

  const timezones = useMemo(() => {
    const tzs = [defaultTimezone, "Asia/Kathmandu", "UTC"];
    return Array.from(new Set(tzs.filter(Boolean)));
  }, []);

  const save = (next: Prefs) => {
    setPrefs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStatus("Saved locally");
  };

  const handleLanding = (value: string) => save({ ...prefs, landing: value });
  const handleSidebar = (value: boolean) => save({ ...prefs, sidebarCollapsed: value });
  const handleTimezone = (value: string) => save({ ...prefs, timezone: value || defaultTimezone });

  const reset = () => save(defaultPrefs);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700/80">Quick preferences</p>
          <p className="text-sm text-slate-600">Stored locally in your browser.</p>
        </div>
        <span className="text-xs text-emerald-700 font-semibold">{status}</span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-900">
          Default landing page
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            value={prefs.landing}
            onChange={(e) => handleLanding(e.target.value)}
          >
            <option value="/admin">Admin home</option>
            <option value="/admin/analytics">Analytics</option>
            <option value="/admin/events">Events</option>
            <option value="/admin/settings">Settings</option>
          </select>
        </label>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-900">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            checked={prefs.sidebarCollapsed}
            onChange={(e) => handleSidebar(e.target.checked)}
          />
          Start with sidebar collapsed
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-900">
          Timezone for reports
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            value={prefs.timezone}
            onChange={(e) => handleTimezone(e.target.value)}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          <span className="text-xs font-normal text-slate-500">Used for date displays if supported later.</span>
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
