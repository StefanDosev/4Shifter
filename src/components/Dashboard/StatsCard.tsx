import { TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

type StatsCardProps = {
  stats: Record<string, number>;
};

const SHIFT_ICON_COLORS = {
  I: 'bg-[#ffc900]',
  II: 'bg-[#23a094]',
  III: 'bg-[#b597f6]',
  REST: 'bg-gray-200',
};

export function StatsCard({ stats }: StatsCardProps) {
  const t = useTranslations('Dashboard');

  return (
    <div className="rounded-xl border-2 border-black bg-white p-6 shadow-neo">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
          {t('shift_stats_title')}
        </h3>
        <div className="rounded-full border-2 border-black bg-white p-2">
          <TrendingUp size={20} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([shift, count]) => (
          <div key={shift} className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 border-black text-xl font-black ${SHIFT_ICON_COLORS[shift as keyof typeof SHIFT_ICON_COLORS] || 'bg-gray-100'}`}>
              {shift}
            </div>
            <div>
              <div className="text-xs text-gray-500">{t('days_count')}</div>
              <div className="text-xl font-bold">{count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
