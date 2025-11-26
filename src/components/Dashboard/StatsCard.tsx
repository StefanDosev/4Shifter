import { useTranslations } from 'next-intl';

type StatsCardProps = {
  stats: Record<string, number>;
};

const SHIFT_COLORS = {
  A: 'text-blue-600',
  B: 'text-green-600',
  C: 'text-yellow-600',
  D: 'text-purple-600',
};

export function StatsCard({ stats }: StatsCardProps) {
  const t = useTranslations('Dashboard');

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {t('shift_stats_title')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([shift, count]) => (
          <div key={shift} className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${SHIFT_COLORS[shift as keyof typeof SHIFT_COLORS]}`}>
              {shift}
            </div>
            <div>
              <div className="text-sm text-gray-500">{t('days_count')}</div>
              <div className="text-xl font-semibold">{count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
