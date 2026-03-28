// app/admin/analytics/page.tsx
import { getAnalyticsData } from './posthog.server';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();
  return <AnalyticsDashboard data={data} />;
}