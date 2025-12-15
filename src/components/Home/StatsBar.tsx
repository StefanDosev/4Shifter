'use client';

import { Calendar, Clock, Palmtree, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

type StatsBarProps = {
  nadureTotal: number;
  ureTotal: number;
  vacationBalance: { used: number; total: number; remaining: number };
  flexTimeBalance: { used: number; total: number; remaining: number };
};

export function StatsBar({ nadureTotal, ureTotal, vacationBalance, flexTimeBalance }: StatsBarProps) {
  const t = useTranslations('Home');

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      {/* Vacation Card - Neo Blue */}
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-neo-blue p-4 shadow-neo">
        <div className="flex-1">
          <p className="text-xs font-bold tracking-wider uppercase opacity-80">
            {t('vacation')}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-3xl font-black">
              {vacationBalance.remaining}
              <span className="text-sm font-bold text-black/50">d</span>
            </p>
            <p className="text-sm font-bold opacity-60">
              /
              {' '}
              {vacationBalance.total}
              <span className="text-sm font-bold text-black/50">d</span>
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-black bg-white/50">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${(vacationBalance.used / vacationBalance.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="ml-4 rounded-full border-2 border-black bg-white p-2">
          <Palmtree size={24} />
        </div>
      </div>

      {/* Flex Time Card - Purple */}
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-purple-200 p-4 shadow-neo">
        <div className="flex-1">
          <p className="text-xs font-bold tracking-wider uppercase opacity-80">
            {t('flexTime')}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-3xl font-black">
              {flexTimeBalance.remaining}
              <span className="text-sm font-bold text-black/50">d</span>
            </p>
            <p className="text-sm font-bold opacity-60">
              {/* / {flexTimeBalance.total} -- Total doesn't make sense for flex bank */}
            </p>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-black bg-white/50">
            <div
              className="h-full bg-black transition-all duration-500"
              style={{ width: `${(flexTimeBalance.used / flexTimeBalance.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="ml-4 rounded-full border-2 border-black bg-white p-2">
          <Calendar size={24} />
        </div>
      </div>

      {/* Nadure Card - Yellow */}
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-neo-yellow p-4 shadow-neo">
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
      <div className="flex items-center justify-between rounded-xl border-2 border-black bg-neo-cyan p-4 shadow-neo">
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
    </div>
  );
}
