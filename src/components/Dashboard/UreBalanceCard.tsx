import { useTranslations } from 'next-intl';

type UreBalanceCardProps = {
  ureHours: number;
};

export function UreBalanceCard({ ureHours }: UreBalanceCardProps) {
  const t = useTranslations('Dashboard');
  const ureDays = Math.floor(ureHours / 8); // Assuming 8-hour workday
  const remainingHours = ureHours % 8;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {t('ure_balance_title')}
      </h3>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold text-indigo-600">{ureDays}</div>
        <div className="text-lg text-gray-600">{t('days')}</div>
        {remainingHours > 0 && (
          <>
            <div className="text-2xl font-semibold text-indigo-400">{remainingHours}</div>
            <div className="text-sm text-gray-500">{t('hours')}</div>
          </>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-500">
        {t('total_hours', { hours: ureHours })}
      </div>
    </div>
  );
}
