// app/admin/analytics/posthog.server.ts
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
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[PostHog] Query failed [${res.status}]:`, err);
    return null;
  }

  const json = await res.json();

  if (json?.error || json?.detail) {
    console.error(`[PostHog] Query error:`, json.error ?? json.detail);
    return null;
  }

  return json;
}

const safe = (r: PromiseSettledResult<any>) =>
  r.status === 'fulfilled' ? r.value : null;

// ── Section Cards ────────────────────────────────────────────────────────────
// Used by app/admin/page.tsx — all-time counts from PostHog events
export async function getSectionCardData() {
  const [
    commissionRes,
    leasersRes,
    ownersRes,
    transactionsRes,
  ] = await Promise.allSettled([

    // Total profit = sum of commission property on escrow_paid
    query({
      kind: 'HogQLQuery',
      query: `
        SELECT sum(toFloatOrZero(toString(properties.commission))) AS total_commission
        FROM events
        WHERE event = 'escrow_paid'
      `,
    }),

    // Total leasers = users who registered (user_created fires on signup)
    query({
      kind: 'HogQLQuery',
      query: `
        SELECT count() AS total_leasers
        FROM events
        WHERE event = 'user_created'
      `,
    }),

    // Total land owners = KYC approvals
    query({
      kind: 'HogQLQuery',
      query: `
        SELECT count() AS total_owners
        FROM events
        WHERE event = 'kyc_reviewed'
          AND properties.status = 'APPROVED'
      `,
    }),

    // Total transactions = escrow payments
    query({
      kind: 'HogQLQuery',
      query: `
        SELECT count() AS total_transactions
        FROM events
        WHERE event = 'escrow_paid'
      `,
    }),
  ]);

  // HogQLQuery returns: { results: [[value]] }
  const commission   = safe(commissionRes)?.results?.[0]?.[0] ?? 0;
  const leasers      = safe(leasersRes)?.results?.[0]?.[0] ?? 0;
  const owners       = safe(ownersRes)?.results?.[0]?.[0] ?? 0;
  const transactions = safe(transactionsRes)?.results?.[0]?.[0] ?? 0;

  return {
    totalProfit:       Number(commission),
    totalLeasers:      Number(leasers),
    totalOwners:       Number(owners),
    totalTransactions: Number(transactions),
  };
}

// ── Weekly Leases (shared) ───────────────────────────────────────────────────
export async function getWeeklyLeases() {
  const res = await query({
    kind: 'HogQLQuery',
    query: `
      SELECT
        formatDateTime(toStartOfWeek(timestamp), '%Y-%m-%d') AS week_start,
        count() AS leases
      FROM events
      WHERE event = 'lease_completed'
        AND timestamp >= now() - INTERVAL 12 WEEK
      GROUP BY week_start
      ORDER BY week_start ASC
    `,
  });

  if (!res?.results) return null;

  const days = res.results.map((row: any[]) => row?.[0]);
  const data = res.results.map((row: any[]) => Number(row?.[1]) || 0);

  // Match the structure expected by ChartAreaInteractive (results[0].days/data)
  return { results: [{ days, data }] };
}

// ── Event Counts (all events) ───────────────────────────────────────────────
export async function getEventCounts() {
  const res = await query({
    kind: 'HogQLQuery',
    query: `
      SELECT
        event,
        count() AS total
      FROM events
      GROUP BY event
      ORDER BY total DESC
    `,
  });

  if (!res?.results) return [];

  return res.results.map((row: any[]) => ({
    event: String(row?.[0] ?? ''),
    total: Number(row?.[1] ?? 0),
  }));
}

// ── Analytics Dashboard ──────────────────────────────────────────────────────
// Used by app/admin/analytics/page.tsx
export async function getAnalyticsData() {
  const [
    funnelRes,
    escrowVolumeRes,
    commissionRes,
    kycConversionRes,
    topLocationsRes,
    weeklyLeasesRes,
  ] = await Promise.allSettled([

    query({
      kind: 'FunnelsQuery',
      dateRange: { date_from: '-30d' },
      series: [
        { kind: 'EventsNode', event: 'land_published' },
        { kind: 'EventsNode', event: 'land_verified' },
        { kind: 'EventsNode', event: 'application_submitted' },
        { kind: 'EventsNode', event: 'application_accepted' },
        { kind: 'EventsNode', event: 'escrow_paid' },
        { kind: 'EventsNode', event: 'lease_completed' },
      ],
    }),

    query({
      kind: 'TrendsQuery',
      dateRange: { date_from: '-30d' },
      interval: 'week',
      series: [{
        kind: 'EventsNode',
        event: 'escrow_paid',
        math: 'sum',
        math_property: 'amount',
      }],
    }),

    query({
      kind: 'TrendsQuery',
      dateRange: { date_from: '-30d' },
      interval: 'week',
      series: [{
        kind: 'EventsNode',
        event: 'escrow_paid',
        math: 'sum',
        math_property: 'commission',
      }],
    }),

    query({
      kind: 'FunnelsQuery',
      dateRange: { date_from: '-90d' },
      series: [
        { kind: 'EventsNode', event: 'kyc_submitted' },
        {
          kind: 'EventsNode',
          event: 'kyc_reviewed',
          properties: [{
            key: 'status',
            value: 'APPROVED',
            operator: 'exact',
            type: 'event',
          }],
        },
      ],
    }),

    query({
      kind: 'HogQLQuery',
      query: `
        SELECT
          properties.location AS location,
          count() AS searches
        FROM events
        WHERE
          event = 'land_searched'
          AND timestamp >= now() - INTERVAL 30 DAY
          AND properties.location IS NOT NULL
          AND properties.location != ''
        GROUP BY location
        ORDER BY searches DESC
        LIMIT 5
      `,
    }),

    getWeeklyLeases(),
  ]);

  return {
    funnel:        safe(funnelRes),
    escrowVolume:  safe(escrowVolumeRes),
    commission:    safe(commissionRes),
    kycConversion: safe(kycConversionRes),
    topLocations:  safe(topLocationsRes),
    weeklyLeases:  safe(weeklyLeasesRes),
  };
}