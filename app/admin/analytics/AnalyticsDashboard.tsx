// app/admin/analytics/AnalyticsDashboard.tsx
'use client';

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { TrendingUp, DollarSign, Users, MapPin, CheckCircle } from 'lucide-react';

const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

function StatCard({ title, value, icon: Icon, sub }: {
  title: string; value: string | number; icon: any; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-emerald-600" />
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="text-sm text-slate-500 font-medium">{sub}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="text-slate-400 text-sm py-12 text-center font-medium">{message}</p>
  );
}

export function AnalyticsDashboard({ data }: { data: any }) {

  // ── FUNNEL ──────────────────────────────────────────────────────────
  // Shape: results: [] (empty until events fire) OR results: [[step1, step2, ...]]
  // When non-empty it's an array of arrays — take the first row
  const funnelRows: any[] = data.funnel?.results ?? [];
  const funnelSteps: any[] = Array.isArray(funnelRows[0]) ? funnelRows[0] : funnelRows;
  const funnelData = funnelSteps.map((step: any) => ({
    name:  (step.name ?? step.action_id ?? '').replace(/_/g, ' '),
    count: step.count ?? 0,
  }));

  // ── TRENDS (escrow volume, commission, weekly leases) ────────────────
  // Shape: results: [{ data: number[], labels: string[], ... }]
  const volumeSeries    = data.escrowVolume?.results?.[0];
  const commissionSeries = data.commission?.results?.[0];
  const leaseSeries     = data.weeklyLeases?.results?.[0];

  const volumeData = (volumeSeries?.data ?? []).map((v: number, i: number) => ({
    week:   volumeSeries?.labels?.[i] ?? `W${i + 1}`,
    amount: Math.round(v),
  }));

  const commissionData = (commissionSeries?.data ?? []).map((v: number, i: number) => ({
    week:       commissionSeries?.labels?.[i] ?? `W${i + 1}`,
    commission: Math.round(v),
  }));

  const weeklyLeasesData = (leaseSeries?.data ?? []).map((v: number, i: number) => ({
    week:   leaseSeries?.labels?.[i] ?? `W${i + 1}`,
    leases: v,
  }));

  // ── KYC FUNNEL ──────────────────────────────────────────────────────
  // Shape: results: [{ name: 'kyc_submitted', count: 1 }, { name: 'kyc_reviewed', count: 1 }]
  // It's a FLAT array of step objects (confirmed from logs)
  const kycSteps: any[] = data.kycConversion?.results ?? [];
  const kycSubmitted = kycSteps[0]?.count ?? 0;
  const kycApproved  = kycSteps[1]?.count ?? 0;
  const kycRate      = kycSubmitted > 0
    ? Math.round((kycApproved / kycSubmitted) * 100)
    : 0;

  // ── TOP LOCATIONS ────────────────────────────────────────────────────
  // Shape: results: [[location, count], ...] (HogQLQuery row format)
  const locationData = (data.topLocations?.results ?? []).map((row: any[]) => ({
    location: row[0] ?? 'Unknown',
    searches: row[1] ?? 0,
  }));

  // ── TOTALS ───────────────────────────────────────────────────────────
  const totalVolume     = volumeData.reduce((s: number, d: any) => s + d.amount, 0);
  const totalCommission = commissionData.reduce((s: number, d: any) => s + d.commission, 0);
  const totalLeases     = weeklyLeasesData.reduce((s: number, d: any) => s + d.leases, 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Analytics</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Last 30 days · Powered by PostHog</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Escrow Volume"
          value={`Rs ${totalVolume.toLocaleString()}`}
          icon={DollarSign}
          sub="Total held (30d)"
        />
        <StatCard
          title="Commission"
          value={`Rs ${totalCommission.toLocaleString()}`}
          icon={TrendingUp}
          sub="Revenue earned (30d)"
        />
        <StatCard
          title="Leases Completed"
          value={totalLeases}
          icon={CheckCircle}
          sub="Last 12 weeks"
        />
        <StatCard
          title="KYC Approval Rate"
          value={`${kycRate}%`}
          icon={Users}
          sub={`${kycApproved} of ${kycSubmitted} approved`}
        />
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-2xl border p-6">
        <SectionHeader title="Conversion Funnel" sub="Land listed → Lease completed (30d)" />
        {funnelData.length === 0
          ? <EmptyState message="No funnel data yet — fire some land_published / application_submitted events first." />
          : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20, right: 40 }}>
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={200}
                  tick={{ fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                  formatter={(v: any) => [v, 'Users']}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {funnelData.map((_: any, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                  <LabelList dataKey="count" position="right" style={{ fontSize: 12, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
      </div>

      {/* Escrow Volume + Commission */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <SectionHeader title="Escrow Volume" sub="Weekly totals (Rs)" />
          {volumeData.every((d: any) => d.amount === 0)
            ? <EmptyState message="No escrow payments yet." />
            : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={volumeData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="amount" stroke="#059669" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <SectionHeader title="Commission Earned" sub="Weekly totals (Rs)" />
          {commissionData.every((d: any) => d.commission === 0)
            ? <EmptyState message="No commission earned yet." />
            : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={commissionData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>

      {/* Weekly Leases + Top Locations */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border p-6">
          <SectionHeader title="Leases Completed" sub="Weekly (last 12 weeks)" />
          {weeklyLeasesData.every((d: any) => d.leases === 0)
            ? <EmptyState message="No leases completed yet." />
            : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyLeasesData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="leases" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="bg-white rounded-2xl border p-6">
          <SectionHeader title="Top Searched Locations" sub="Last 30 days" />
          {locationData.length === 0
            ? <EmptyState message="No land_searched events yet." />
            : (
              <div className="space-y-3 mt-2">
                {locationData.map((loc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <span className="font-bold text-sm text-slate-700">{loc.location}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-600">{loc.searches} searches</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* KYC Panel */}
      <div className="bg-white rounded-2xl border p-6">
        <SectionHeader title="KYC Analytics" sub="Last 90 days" />
        <div className="grid grid-cols-3 gap-6 mt-2 text-center">
          <div>
            <p className="text-3xl font-black text-slate-900">{kycSubmitted}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Submitted</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-600">{kycApproved}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Approved</p>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">{kycRate}%</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Approval Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}