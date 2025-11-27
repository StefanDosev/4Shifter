'use client';

import { CalendarHeart, Clock, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

type StatsBarProps = {
  nadureTotal: number;
  ureTotal: number;
};

export function StatsBar({ nadureTotal, ureTotal }: StatsBarProps) {
  const t = useTranslations('Dashboard');
  const daysOff = Math.floor(ureTotal / 8); // Assuming 8 hour work day

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Nadure Card - Yellow */}
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#ffc900] p-4 shadow-neo">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase opacity-80">
            {t('total_nadure')}
          </p>
          <p className="mt-1 text-3xl font-black">
            {nadureTotal}
            h
          </p>
        </div>
        <div className="rounded-full border-2 border-black bg-white p-2">
          <Wallet size={24} />
        </div>
      </div>

      {/* Ure Card - Cyan */}
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#23a094] p-4 shadow-neo">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase opacity-80">
            {t('total_ure')}
          </p>
          <p className="mt-1 text-3xl font-black">
            {ureTotal}
            h
          </p>
        </div>
        <div className="rounded-full border-2 border-black bg-white p-2">
          <Clock size={24} />
        </div>
      </div>

      {/* Days Off Card - Violet */}
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-[#b597f6] p-4 shadow-neo">
        <div>
          <p className="text-xs font-bold tracking-wider uppercase opacity-80">
            {t('days_off_available')}
          </p>
          <p className="mt-1 text-3xl font-black">
            ~
            {daysOff}
            {' '}
            <span className="text-base font-medium">days</span>
          </p>
        </div>
        <div className="rounded-full border-2 border-black bg-white p-2">
          <CalendarHeart size={24} />
        </div>
      </div>
    </div>
  );
}
