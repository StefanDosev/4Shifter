import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getMonthlyTotals } from '@/actions/DailyStatsActions';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { checkNeedsOnboarding, getUserShiftGroup } from '@/actions/UserActions';
import { getAllBalances } from '@/actions/UserStatsActions';
import { DashboardWrapper } from '@/components/Home/DashboardWrapper';
import { SmartWidget } from '@/components/Home/SmartWidget';
import { calculateDaysUntilOff } from '@/utils/shiftUtils';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Home',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user needs onboarding
  const needsOnboarding = await checkNeedsOnboarding();
  if (needsOnboarding) {
    redirect('/onboarding');
  }

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // Fetch data in parallel
  const [schedule, totals, userGroup, balances] = await Promise.all([
    getMonthlySchedule(currentMonth, currentYear),
    getMonthlyTotals(currentMonth, currentYear),
    getUserShiftGroup(),
    getAllBalances(),
  ]);

  // Get today's shift
  const today = now.toISOString().split('T')[0];
  const todayShift = schedule.find(day => day.date === today);
  const currentShift = (todayShift?.shift as 'I' | 'II' | 'III' | 'REST') || 'REST';

  // Calculate days until next off
  const daysUntilOff = calculateDaysUntilOff(now, userGroup);

  return (
    <div className="py-4 sm:py-6">
      <h1 className="mb-6 text-3xl font-black sm:mb-8 sm:text-4xl">Home</h1>

      {/* Smart Widget - Today's shift */}
      <SmartWidget currentShift={currentShift} daysUntilOff={daysUntilOff} />

      {/* Dashboard Wrapper - Manages state and displays StatsBar + Calendar */}
      <DashboardWrapper
        initialSchedule={schedule}
        initialTotals={totals}
        balances={balances}
      />
    </div>
  );
}
