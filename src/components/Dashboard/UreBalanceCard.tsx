import { CalendarHeart } from 'lucide-react';
import { useTranslations } from 'next-intl';

type UreBalanceCardProps = {
  ureHours: number;
};

export function UreBalanceCard({ ureHours }: UreBalanceCardProps) {
  const t = useTranslations('Dashboard');
  const ureDays = Math.floor(ureHours / 8); // Assuming 8-hour workday

  return (
    <div className="rounded-xl border-2 border-black bg-[#b597f6] p-6 shadow-neo">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wide uppercase opacity-80">
          {t('ure_balance_title')}
        </h3>
        <div className="rounded-full border-2 border-black bg-white p-2">
          <CalendarHeart size={20} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-black">
          ~
          {ureDays}
        </div>
        <div className="text-base font-medium">days</div>
      </div>
      <div className="mt-2 text-sm font-medium opacity-75">
        {t('total_hours', { hours: ureHours })}
      </div>
    </div>
  );
}
