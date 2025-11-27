import { Briefcase, Palmtree, Pill, Sun, X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/Button';

type DailyStats = {
  date: string;
  nadure: number;
  ure: number;
  isVacation: boolean;
  isSickLeave: boolean;
};

type DayDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  data: DailyStats;
  onUpdate: (date: string, updates: Partial<DailyStats>) => void;
  locale: string;
  shiftType?: 'I' | 'II' | 'III' | 'REST';
};

const TRANSLATIONS = {
  en: {
    nadure: 'Paid Overtime (Nadure)',
    ure: 'Banked Hours (Ure)',
    vacation: 'Vacation',
    sick: 'Sick Leave',
    save: 'Save Changes',
    hours: 'hours',
  },
  sl: {
    nadure: 'Nadure (Plačane)',
    ure: 'Ure (Koriščenje)',
    vacation: 'Dopust',
    sick: 'Bolniška',
    save: 'Shrani',
    hours: 'ur',
  },
};

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  data,
  onUpdate,
  locale,
  shiftType = 'REST',
}) => {
  if (!isOpen) {
    return null;
  }

  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const isRestDay = shiftType === 'REST';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border-2 border-black bg-white shadow-neo">

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black bg-neo-pink p-4">
          <h2 className="text-xl font-bold">{dateStr}</h2>
          <button onClick={onClose} className="cursor-pointer rounded-full p-1 transition-colors hover:bg-black/10" type="button">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">

          {/* Nadure Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md border-2 border-black bg-neo-yellow p-2">
                <Sun size={20} />
              </div>
              <label className="text-lg font-bold">{t.nadure}</label>
            </div>
            <div className="flex items-center gap-4 rounded-lg border-2 border-black/10 bg-gray-50 p-2">
              <Button size="sm" variant="secondary" onClick={() => onUpdate(dateStr, { nadure: Math.max(0, (data.nadure || 0) - 1) })}>-</Button>
              <span className="w-12 text-center font-mono text-xl font-bold">{data.nadure || 0}</span>
              <Button size="sm" variant="secondary" onClick={() => onUpdate(dateStr, { nadure: (data.nadure || 0) + 1 })}>+</Button>
              <span className="ml-auto text-sm text-gray-500">{t.hours}</span>
            </div>
          </div>

          {/* Ure Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md border-2 border-black bg-neo-cyan p-2">
                <Briefcase size={20} />
              </div>
              <label className="text-lg font-bold">{t.ure}</label>
            </div>
            <div className="flex items-center gap-4 rounded-lg border-2 border-black/10 bg-gray-50 p-2">
              <Button size="sm" variant="secondary" onClick={() => onUpdate(dateStr, { ure: Math.max(0, (data.ure || 0) - 1) })}>-</Button>
              <span className="w-12 text-center font-mono text-xl font-bold">{data.ure || 0}</span>
              <Button size="sm" variant="secondary" onClick={() => onUpdate(dateStr, { ure: (data.ure || 0) + 1 })}>+</Button>
              <span className="ml-auto text-sm text-gray-500">{t.hours}</span>
            </div>
          </div>

          {/* Quick Add for REST Days */}
          {isRestDay && (
            <>
              <div className="h-px bg-gray-200" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-600">Quick Add (8 Hours)</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => onUpdate(dateStr, { nadure: (data.nadure || 0) + 8 })}
                    className="flex-col gap-1 py-4"
                  >
                    <Sun size={20} />
                    <span className="text-xs">+8h Nadure</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onUpdate(dateStr, { ure: (data.ure || 0) + 8 })}
                    className="flex-col gap-1 py-4"
                  >
                    <Briefcase size={20} />
                    <span className="text-xs">+8h Ure</span>
                  </Button>
                </div>
              </div>
            </>
          )}

          <div className="h-px bg-gray-200" />

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate(dateStr, { isVacation: !data.isVacation, isSickLeave: false })}
              className={`cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-black p-4 shadow-neo-sm transition-all ${data.isVacation ? 'translate-x-[2px] translate-y-[2px] bg-neo-blue shadow-none' : 'bg-white'} flex`}
              type="button"
            >
              <Palmtree size={24} />
              <span className="text-sm font-bold">{t.vacation}</span>
            </button>

            <button
              onClick={() => onUpdate(dateStr, { isSickLeave: !data.isSickLeave, isVacation: false })}
              className={`cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-black p-4 shadow-neo-sm transition-all ${data.isSickLeave ? 'translate-x-[2px] translate-y-[2px] bg-red-300 shadow-none' : 'bg-white'} flex`}
              type="button"
            >
              <Pill size={24} />
              <span className="text-sm font-bold">{t.sick}</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t-2 border-black bg-gray-50 p-4">
          <Button className="w-full" onClick={onClose}>{t.save}</Button>
        </div>

      </div>
    </div>
  );
};
