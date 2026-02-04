'use client';

import type { ScheduleDay, ShiftGroup, SmartWidgetContext, TodayStats } from '@/utils/smartWidgetUtils';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { getSmartWidgetData } from '@/utils/smartWidgetUtils';

type SmartWidgetProps = {
  schedule: ScheduleDay[];
  todayStats: TodayStats | null;
  shiftGroup: ShiftGroup;
  locale: string;
};

// Progress bar component
function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-linear-to-r from-neo-pink to-neo-violet transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Context-specific icon/badge
function ContextBadge({ context, shiftType }: { context: SmartWidgetContext; shiftType: string }) {
  const bgColors: Record<SmartWidgetContext, string> = {
    NORMAL_WORKDAY: shiftType === 'I' ? 'bg-neo-yellow' : shiftType === 'II' ? 'bg-neo-cyan' : 'bg-neo-violet',
    LAST_WORKDAY: 'bg-neo-pink',
    OFF_DAY: 'bg-white',
    MULTIPLE_OFF: 'bg-white',
    VACATION: 'bg-neo-blue',
    FLEX_TIME: 'bg-purple-200',
    EXTRA_WORK: 'bg-neo-yellow',
    NIGHT_SHIFT: 'bg-neo-violet',
  };

  const icons: Record<SmartWidgetContext, string> = {
    NORMAL_WORKDAY: shiftType,
    LAST_WORKDAY: '🎉',
    OFF_DAY: '😌',
    MULTIPLE_OFF: '🏖',
    VACATION: '🏖',
    FLEX_TIME: '📅',
    EXTRA_WORK: '💪',
    NIGHT_SHIFT: '🌙',
  };

  return (
    <div className={`rounded-xl border-2 border-black p-4 ${bgColors[context]}`}>
      <span className="text-2xl font-black">{icons[context]}</span>
    </div>
  );
}

export function SmartWidget({ schedule, todayStats, shiftGroup, locale }: SmartWidgetProps) {
  const t = useTranslations('SmartWidget');

  const data = useMemo(() => {
    return getSmartWidgetData(new Date(), shiftGroup, schedule, todayStats, locale);
  }, [schedule, todayStats, shiftGroup, locale]);

  // Render different layouts based on context
  const renderContent = () => {
    switch (data.context) {
      case 'VACATION':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">{t('vacation')}</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            <div className="text-center md:text-right">
              {data.nextShift && (
                <>
                  <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                    {t('back_to_work')}
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {data.nextShift.dayName}
                  </p>
                </>
              )}
            </div>
          </>
        );

      case 'FLEX_TIME':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">{t('flex_day')}</p>
                <p className="text-sm font-medium text-gray-500">{t('flex_used')}</p>
              </div>
            </div>
          </>
        );

      case 'EXTRA_WORK':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">{t('extra_work')}</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            <div className="text-center md:text-right">
              <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                {t('extra_choice')}
              </p>
              <p className="text-lg font-bold">
                {data.extraWorkType === 'nadure' && `💰 ${t('extra_paid')}`}
                {data.extraWorkType === 'ure' && `➕ ${t('extra_plus_hours')}`}
                {data.extraWorkType === 'both' && `💰 + ➕`}
              </p>
            </div>
          </>
        );

      case 'OFF_DAY':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">{t('off')}</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            {data.nextShift && (
              <div className="text-center md:text-right">
                <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('next_shift')}
                </p>
                <p className="text-lg font-bold">{data.nextShift.shiftType === 'I' ? t('morning') : data.nextShift.shiftType === 'II' ? t('afternoon') : t('night')}</p>
                <p className="text-sm text-gray-500">
                  {data.nextShift.dayName}
                  {' '}
                  {data.nextShift.times}
                </p>
              </div>
            )}
          </>
        );

      case 'MULTIPLE_OFF':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">{t('off_days')}</p>
                <p className="text-sm font-medium text-neo-cyan">
                  {data.consecutiveOffDays === 1
                    ? t('days_off_remaining_one')
                    : t('days_off_remaining', { days: data.consecutiveOffDays ?? 0 })}
                </p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            {data.nextShift && (
              <div className="text-center md:text-right">
                <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('next_shift')}
                </p>
                <p className="text-lg font-bold">{data.nextShift.dayName}</p>
              </div>
            )}
          </>
        );

      case 'LAST_WORKDAY':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">
                  {data.shiftLabel}
                  {' '}
                  ·
                  {' '}
                  {data.shiftTimes}
                </p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            <div className="text-center md:text-right">
              <p className="text-lg font-bold text-neo-pink">{t('last_workday')}</p>
              <p className="text-xl font-bold text-neo-cyan">{t('tomorrow_off')}</p>
            </div>
            {data.workCycle && (
              <div className="w-full md:hidden">
                <ProgressBar current={data.workCycle.currentDay} total={data.workCycle.totalDays} />
              </div>
            )}
          </>
        );

      case 'NIGHT_SHIFT':
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">{t('night')}</p>
                <p className="text-xs text-gray-500">{t('night_ends_tomorrow')}</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            <div className="text-center md:text-right">
              {data.workCycle && (
                <p className="text-sm font-bold text-gray-500">
                  {t('day_progress', { current: data.workCycle.currentDay, total: data.workCycle.totalDays })}
                </p>
              )}
              <p className="text-lg font-bold">
                {data.daysUntilOff === 1
                  ? t('days_until_off_one')
                  : t('days_until_off', { days: data.daysUntilOff ?? 0 })}
              </p>
            </div>
            {data.workCycle && (
              <div className="w-full md:hidden">
                <ProgressBar current={data.workCycle.currentDay} total={data.workCycle.totalDays} />
              </div>
            )}
          </>
        );

      case 'NORMAL_WORKDAY':
      default:
        return (
          <>
            <div className="flex items-center gap-4">
              <ContextBadge context={data.context} shiftType={data.currentShift} />
              <div>
                <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                  {t('today')}
                </h2>
                <p className="text-2xl font-bold">
                  {data.shiftLabel}
                  {' '}
                  ·
                  {' '}
                  {data.shiftTimes}
                </p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 md:h-12 md:w-px" />
            <div className="text-center md:text-right">
              {data.workCycle && (
                <p className="text-sm font-bold text-gray-500">
                  {t('day_progress', { current: data.workCycle.currentDay, total: data.workCycle.totalDays })}
                </p>
              )}
              <p className="text-lg font-bold">
                {data.daysUntilOff === 1
                  ? t('days_until_off_one')
                  : t('days_until_off', { days: data.daysUntilOff ?? 0 })}
              </p>
            </div>
            {data.workCycle && (
              <div className="w-full md:hidden">
                <ProgressBar current={data.workCycle.currentDay} total={data.workCycle.totalDays} />
              </div>
            )}
          </>
        );
    }
  };

  // Desktop progress bar for workday contexts
  const showDesktopProgress = ['NORMAL_WORKDAY', 'LAST_WORKDAY', 'NIGHT_SHIFT'].includes(data.context);

  return (
    <div className="mb-8 rounded-xl border-2 border-black bg-white shadow-neo">
      <div className="flex flex-col items-center justify-between gap-6 p-6 md:flex-row">
        {renderContent()}
      </div>
      {showDesktopProgress && data.workCycle && (
        <div className="hidden border-t-2 border-black px-6 py-3 md:block">
          <ProgressBar current={data.workCycle.currentDay} total={data.workCycle.totalDays} />
        </div>
      )}
    </div>
  );
}
