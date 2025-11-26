import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getUreBalance } from '@/actions/ExtraHoursActions';
import { getMonthlySchedule, getShiftStats } from '@/actions/ShiftActions';
import { checkNeedsOnboarding } from '@/actions/UserActions';
import { CalendarView } from '@/components/Dashboard/CalendarView';
import { ShiftCard } from '@/components/Dashboard/ShiftCard';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { UreBalanceCard } from '@/components/Dashboard/UreBalanceCard';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function Dashboard() {
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
  const [schedule, stats, ureBalance] = await Promise.all([
    getMonthlySchedule(currentMonth, currentYear),
    getShiftStats(currentMonth, currentYear),
    getUreBalance(),
  ]);

  // Get today's shift
  const today = now.toISOString().split('T')[0];
  const todayShift = schedule.find(day => day.date === today);

  const t = await getTranslations('Dashboard');

  return (
    <div className="py-5 [&_p]:my-6">
      <h1 className="mb-8 text-3xl font-bold">{t('meta_title')}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Shift */}
        {todayShift && (
          <ShiftCard
            currentShift={todayShift.shift as 'I' | 'II' | 'III' | 'REST'}
            date={todayShift.date}
          />
        )}

        {/* Shift Statistics */}
        <StatsCard stats={stats} />

        {/* URE Balance */}
        <UreBalanceCard ureHours={ureBalance.totalUreHours} />
      </div>

      {/* Calendar View */}
      <div className="mt-8">
        <CalendarView initialSchedule={schedule} />
      </div>
    </div>
  );
}
