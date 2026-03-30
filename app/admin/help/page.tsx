export const revalidate = 0;

const helpLinks: { label: string; href?: string }[] = [];

export default function AdminHelpPage() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Get Help</h1>
        <p className="text-slate-500 text-sm font-medium">Support, docs, and quick troubleshooting links.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <HelpCard
          title="Contact support"
          body="Email the admin team with context. Include URLs, user IDs, and recent actions."
          action={<a className="text-emerald-700 font-semibold" href="mailto:support@sajilokheti.com">support@sajilokheti.com</a>}
        />
        <HelpCard
          title="Escalate an incident"
          body="For outages or payment issues, email ops with subject 'P1'."
          action={<a className="text-emerald-700 font-semibold" href="mailto:ops@sajilokheti.com?subject=P1%20Incident">ops@sajilokheti.com</a>}
        />
      </div>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b px-4 py-3 text-sm font-medium text-slate-600">Docs & FAQs</div>
        <div className="px-4 py-4 text-sm text-slate-600">
          Docs are coming soon. For now, email support with the page URL, user ID, and a short description of the issue.
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Troubleshooting checklist</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-slate-700">
          <li>Refresh and retry the action; note the exact time.</li>
          <li>Confirm the user’s role and permissions.</li>
          <li>Check status page for PostHog/TRPC/DB health.</li>
          <li>Re-run with a different account to isolate data issues.</li>
          <li>Capture console/network errors for support.</li>
        </ol>
      </section>
    </div>
  );
}

function HelpCard({ title, body, action }: { title: string; body: string; action: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{body}</p>
      <div className="mt-3 text-sm">{action}</div>
    </div>
  );
}
