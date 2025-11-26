import { useTranslations } from 'next-intl';

type ShiftCardProps = {
  currentShift: 'I' | 'II' | 'III' | 'REST';
  date: string;
};

const SHIFT_COLORS = {
  I: 'bg-purple-500',
  II: 'bg-green-500',
  III: 'bg-yellow-500',
  REST: 'bg-gray-400',
};

const SHIFT_LABELS = {
  I: 'First Shift',
  II: 'Second Shift',
  III: 'Night Shift',
  REST: 'Off',
};

export function ShiftCard({ currentShift, date }: ShiftCardProps) {
  const t = useTranslations('Dashboard');
  const colorClass = SHIFT_COLORS[currentShift];
  const label = SHIFT_LABELS[currentShift];

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-gray-700">
        {t('current_shift')}
      </h3>
      <div className="flex items-center gap-4">
        <div className={`flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white ${colorClass}`}>
          {currentShift}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{label}</div>
          <div className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
