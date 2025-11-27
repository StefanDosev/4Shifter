import { useLocale, useTranslations } from 'next-intl';
import { SHIFT_DEFINITIONS } from './constants';

type ShiftCardProps = {
  currentShift: 'I' | 'II' | 'III' | 'REST';
  date: string;
};

export function ShiftCard({ currentShift, date }: ShiftCardProps) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const shiftDef = SHIFT_DEFINITIONS[currentShift];
  const shiftLabel = locale === 'sl' ? shiftDef.labelSl : shiftDef.labelEn;

  return (
    <div className="flex flex-col gap-4 rounded-xl border-2 border-black bg-white p-6 shadow-neo md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 border-black ${shiftDef.color}`}
        >
          <span className="text-2xl font-black">{currentShift}</span>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wide text-gray-500 uppercase">
            {t('current_shift')}
          </h3>
          <p className="text-xl font-black">{shiftLabel}</p>
          <p className="text-sm font-medium opacity-75">{shiftDef.times}</p>
        </div>
      </div>

      <div className="text-center md:text-right">
        <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">Date</p>
        <p className="text-lg font-bold">{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
