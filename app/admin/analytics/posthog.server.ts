const BASE = 'https://us.posthog.com';
const HEADERS = {
  Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
  'Content-Type': 'application/json',
};
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;

async function query(insight: object) {
  const res = await fetch(`${BASE}/api/projects/${PROJECT_ID}/query/`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ query: insight }),
    next: { revalidate: 300 },
  });
  return res.json();
}

export async function getAnalyticsData() {
  const [
    funnelRes,
    escrowVolumeRes,
    commissionRes,
    kycConversionRes,
    topLocationsRes,
    weeklyLeasesRes,
    totalCommissionRes,
    totalLeasersRes,
    totalOwnersRes,
    totalTransactionsRes,
  ] = await Promise.allSettled([
    // ── existing ────────────────────────────────────────────
    query({
      kind: 'FunnelQuery',
      series: [
        { event: 'land_published' },
        { event: 'land_verified' },
        { event: 'application_submitted' },
        { event: 'application_accepted' },
        { event: 'escrow_paid' },
        { event: 'lease_completed' },
      ],
      dateRange: { date_from: '-30d' },
    }),
    query({
      kind: 'TrendsQuery',
      series: [{ event: 'escrow_paid', math: 'sum', math_property: 'amount' }],
      dateRange: { date_from: '-30d' },
      interval: 'week',
    }),
    query({
      kind: 'TrendsQuery',
      series: [{ event: 'escrow_paid', math: 'sum', math_property: 'commission' }],
      dateRange: { date_from: '-30d' },
      interval: 'week',
    }),
    query({
      kind: 'FunnelQuery',
      series: [
        { event: 'kyc_submitted' },
        { event: 'kyc_reviewed', properties: [{ key: 'status', value: 'APPROVED' }] },
      ],
      dateRange: { date_from: '-90d' },
    }),
    query({
      kind: 'EventsQuery',
      select: ['properties.location', 'count()'],
      event: 'land_searched',
      groupBy: ['properties.location'],
      orderBy: ['-count()'],
      limit: 5,
      dateRange: { date_from: '-30d' },
    }),
    query({
      kind: 'TrendsQuery',
      series: [{ event: 'lease_completed', math: 'total' }],
      dateRange: { date_from: '-12w' },
      interval: 'week',
    }),

    // ── new: SectionCards + ChartAreaInteractive ─────────────
    query({
      kind: 'TrendsQuery',
      series: [{ event: 'escrow_paid', math: 'sum', math_property: 'commission' }],
      dateRange: { date_from: 'all' },
      interval: 'month',
    }),
    query({
      kind: 'EventsQuery',
      select: ['count()'],
      event: 'user_created',
      where: ["properties.role = 'LEASER'"],
      dateRange: { date_from: 'all' },
    }),
    query({
      kind: 'EventsQuery',
      select: ['count()'],
      event: 'user_created',
      where: ["properties.role = 'OWNER'"],
      dateRange: { date_from: 'all' },
    }),
    query({
      kind: 'EventsQuery',
      select: ['count()'],
      event: 'escrow_paid',
      dateRange: { date_from: 'all' },
    }),
  ]);

  const safe = (r: PromiseSettledResult<any>) =>
    r.status === 'fulfilled' ? r.value : null;

  const sumTrend = (res: any): number => {
    try {
      return (res?.results?.[0]?.data ?? []).reduce(
        (acc: number, v: number) => acc + (v ?? 0), 0
      );
    } catch { return 0; }
  };

  const countEvents = (res: any): number => {
    try { return res?.results?.[0]?.[0] ?? 0; }
    catch { return 0; }
  };

  return {
    funnel: safe(funnelRes),
    escrowVolume: safe(escrowVolumeRes),
    commission: safe(commissionRes),
    kycConversion: safe(kycConversionRes),
    topLocations: safe(topLocationsRes),
    weeklyLeases: safe(weeklyLeasesRes),
    totalProfit: sumTrend(safe(totalCommissionRes)),
    totalLeasers: countEvents(safe(totalLeasersRes)),
    totalOwners: countEvents(safe(totalOwnersRes)),
    totalTransactions: countEvents(safe(totalTransactionsRes)),
  };
}