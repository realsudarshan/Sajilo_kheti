import { QuickPreferences } from "./QuickPreferences";

export const revalidate = 0;

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm font-medium">Quick local preferences you can adjust now. More settings will come later.</p>
      </header>

      <QuickPreferences />

      <div className="rounded-2xl border border-dashed bg-white p-4 text-sm text-slate-500 ring-1 ring-slate-200">
        Additional settings (notifications, exports, access controls) will appear here once backend support is ready.
      </div>
    </div>
  );
}
