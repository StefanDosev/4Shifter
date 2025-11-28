'use client';

import { useLocale, useTranslations } from 'next-intl';
import { SHIFT_DEFINITIONS } from './constants';

type SmartWidgetProps = {
  currentShift: 'I' | 'II' | 'III' | 'REST';
  daysUntilOff: number;
};

export function SmartWidget({ currentShift, daysUntilOff }: SmartWidgetProps) {
  const t = useTranslations('Home');
  const locale = useLocale();
  const shiftDef = SHIFT_DEFINITIONS[currentShift];
  const shiftLabel = locale === 'sl' ? shiftDef.labelSl : shiftDef.labelEn;

  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-6 rounded-xl border-2 border-black bg-white p-6 shadow-neo md:flex-row">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl border-2 border-black p-4 ${shiftDef.color}`}>
          <span className="text-2xl font-black">{currentShift}</span>
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
            {t('today')}
          </h2>
          <p className="text-2xl font-bold">{shiftLabel}</p>
          <p className="text-sm font-medium opacity-75">{shiftDef.times}</p>
        </div>
      </div>

      <div className="h-px w-full bg-gray-200 md:h-12 md:w-px"></div>

      <div className="text-center md:text-right">
        <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">Status</p>
        {daysUntilOff === 0
          ? (
              <p className="text-xl font-bold text-[#23a094]">Enjoy your rest!</p>
            )
          : (
              <p className="text-xl font-bold">
                <span className="mr-1 text-3xl text-[#ff90e8]">{daysUntilOff}</span>
                days until OFF
              </p>
            )}
      </div>
    </div>
  );
}
