export default function AnalyticsPage() {
  return (
    <div className="flex-1 w-full px-4 md:px-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
          Live Analytics
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Real-time insights from PostHog
        </p>
      </div>

      {/* Container to handle the iframe's look */}
      <div className="w-full overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-200">
        <iframe
          src="https://us.posthog.com/embedded/LNZo5cy6D-16SeKvVgnOutCHyeZclw"
          width="100%"
          height="1000"
          frameBorder="0"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups"
          title="Sajilo Kheti Admin Dashboard"
          className="block w-full min-h-[1000px]"
          loading="lazy"
        />
      </div>
      
      <div className="text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          Sajilo Kheti Internal Data
        </p>
      </div>
    </div>
  );
}