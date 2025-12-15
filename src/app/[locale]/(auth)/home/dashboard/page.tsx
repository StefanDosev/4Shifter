import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getMonthlyAggregatedStats, getYearlyShiftStats, getYearlyTrend } from '@/actions/ShiftActions';
import { AnalyticsDashboard } from '@/components/Dashboard/AnalyticsDashboard';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Dashboard - 4Shifter`,
  };
}

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const searchParams = await props.searchParams;
  const now = new Date();
  const currentMonth = Number(searchParams.month) || now.getMonth() + 1;
  const currentYear = Number(searchParams.year) || now.getFullYear();

  // Fetch data in parallel
  const [yearlyStats, monthlyStats, yearlyTrend] = await Promise.all([
    getYearlyShiftStats(currentYear),
    getMonthlyAggregatedStats(currentMonth, currentYear),
    getYearlyTrend(currentYear),
  ]);

  return (
    <div className="py-4 sm:py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-black sm:text-4xl">Dashboard</h1>
      </div>

      <AnalyticsDashboard
        yearlyStats={yearlyStats}
        monthlyStats={monthlyStats}
        yearlyTrend={yearlyTrend}
      />
    </div>
  );
}
