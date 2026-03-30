import { getEventCounts } from "../analytics/posthog.server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const revalidate = 0; // always fresh

export default async function AdminEventsPage() {
  const events = await getEventCounts();
  const hasData = Array.isArray(events) && events.length > 0;

  const totalEvents = hasData ? events.length : 0;
  const totalHits = hasData ? events.reduce((sum, item) => sum + (item.total ?? 0), 0) : 0;
  const topEvent = hasData ? events[0]?.event ?? "" : "";

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">
          Event Counts
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          All events captured in PostHog with their total occurrences.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Distinct events" value={totalEvents.toLocaleString()} />
        <StatCard label="Total hits" value={totalHits.toLocaleString()} />
        <StatCard label="Top event" value={topEvent || "—"} subtle />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b px-4 py-3 text-sm font-medium text-slate-600">
          <span>Events</span>
          <span className="text-xs uppercase tracking-wide text-slate-400">All time</span>
        </div>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white/90 backdrop-blur">
            <TableRow>
              <TableHead className="w-2/3">Event</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasData ? (
              events.map(({ event, total }, idx) => (
                <TableRow key={event || idx} className={idx % 2 ? "bg-slate-50" : "bg-white"}>
                  <TableCell className="font-medium capitalize">{event || "(unknown)"}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-slate-800">{total.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center text-slate-500">
                  No events found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtle = false }: { label: string; value: string; subtle?: boolean }) {
  return (
    <div className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700/80">{label}</p>
      <p className={`mt-2 text-2xl font-black ${subtle ? "text-slate-800" : "text-emerald-900"}`}>{value}</p>
    </div>
  );
}
