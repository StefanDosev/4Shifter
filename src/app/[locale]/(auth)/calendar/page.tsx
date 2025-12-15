import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getMonthlySchedule } from '@/actions/ShiftActions';
import { getAllBalances } from '@/actions/UserStatsActions';
import { CalendarPageClient } from '@/components/Calendar/CalendarPageClient';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Calendar',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentYear = now.getFullYear();

  // Fetch data
  const [schedule, balances] = await Promise.all([
    getMonthlySchedule(currentMonth, currentYear),
    getAllBalances(),
  ]);

  return (
    <div className="py-5 [&_p]:my-6">
      <h1 className="mb-8 text-3xl font-bold">Shift Calendar</h1>

      <CalendarPageClient
        initialSchedule={schedule}
        balances={balances}
      />
    </div>
  );
}
