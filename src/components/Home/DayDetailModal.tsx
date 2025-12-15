import { Briefcase, Calendar, Palmtree, Pill, Sun, X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/Button';

type DailyStats = {
  date: string;
  nadure: number;
  ure: number;
  workedShiftType?: 'I' | 'II' | 'III' | null;
  isVacation: boolean;
  isSickLeave: boolean;
  isFlexTime: boolean;
  isHoliday: boolean;
};

type DayDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  data: DailyStats;
  onUpdate: (date: string, updates: Partial<DailyStats>) => void;
  locale: string;
  shiftType?: 'I' | 'II' | 'III' | 'REST';
  vacationBalance?: { used: number; total: number; remaining: number };
  flexTimeBalance?: { used: number; total: number; remaining: number };
};

const TRANSLATIONS = {
  en: {
    nadure: 'Paid Overtime (Nadure)',
    ure: 'Banked Hours (Ure)',
    vacation: 'Vacation',
    sick: 'Sick Leave',
    save: 'Save Changes',
    hours: 'hours',
    flexTime: 'Flex Time (Unpaid)',
    holiday: 'Holiday',
    remaining: 'remaining',
    useBanked: 'Use Banked Hours',
    useBankedDesc: 'Enter negative value to use (e.g. -8)',
  },
  sl: {
    nadure: 'Nadure (Plačane)',
    ure: 'Ure (Koriščenje)',
    vacation: 'Dopust',
    sick: 'Bolniška',
    save: 'Shrani',
    hours: 'ur',
    flexTime: 'Flex Time (Neplačano)',
    holiday: 'Praznik',
    remaining: 'preostalo',
    useBanked: 'Koristi Ure',
    useBankedDesc: 'Vnesi negativno vrednost za koriščenje (npr. -8)',
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
  vacationBalance,
  flexTimeBalance,
}) => {
  const [localData, setLocalData] = React.useState<DailyStats>(data);

  // Reset local state when modal opens or data changes externally
  React.useEffect(() => {
    setLocalData(data);
  }, [data, isOpen]);

  if (!isOpen) {
    return null;
  }

  const t = TRANSLATIONS[locale as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;
  const isRestDay = shiftType === 'REST';

  const handleLocalUpdate = (updates: Partial<DailyStats>) => {
    setLocalData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    onUpdate(dateStr, localData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border-2 border-black bg-white shadow-neo"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        onKeyDown={e => e.stopPropagation()}
        tabIndex={-1}
      >

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
              <Button size="sm" variant="secondary" onClick={() => handleLocalUpdate({ nadure: Math.max(0, (localData.nadure || 0) - 1) })}>-</Button>
              <span className="w-12 text-center font-mono text-xl font-bold">{localData.nadure || 0}</span>
              <Button size="sm" variant="secondary" onClick={() => handleLocalUpdate({ nadure: (localData.nadure || 0) + 1 })}>+</Button>
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
              <Button size="sm" variant="secondary" onClick={() => handleLocalUpdate({ ure: (localData.ure || 0) - 1 })}>-</Button>
              <span className="w-12 text-center font-mono text-xl font-bold">{localData.ure || 0}</span>
              <Button size="sm" variant="secondary" onClick={() => handleLocalUpdate({ ure: (localData.ure || 0) + 1 })}>+</Button>
              <span className="ml-auto text-sm text-gray-500">{t.hours}</span>
            </div>
          </div>

          {/* Shift Type Selector (Only if Nadure or Ure > 0) */}
          {((localData.nadure || 0) > 0 || (localData.ure || 0) > 0) && (
            <div className="space-y-2" role="group" aria-labelledby="shift-type-label">
              <p id="shift-type-label" className="text-sm font-bold text-gray-600">Worked Shift Type</p>
              <div className="grid grid-cols-3 gap-2">
                {(['I', 'II', 'III'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleLocalUpdate({ workedShiftType: type })}
                    className={`rounded-lg border-2 px-4 py-2 font-black transition-all ${
                      localData.workedShiftType === type
                        ? 'border-black bg-green-400 shadow-neo-sm'
                        : 'border-transparent bg-gray-100 hover:border-black/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Add for REST Days */}
          {isRestDay && (
            <>
              <div className="h-px bg-gray-200" />
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-600">Quick Add (8 Hours)</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => handleLocalUpdate({ nadure: (localData.nadure || 0) + 8 })}
                    className="flex-col gap-1 py-4"
                  >
                    <Sun size={20} />
                    <span className="text-xs">+8h Nadure</span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleLocalUpdate({ ure: (localData.ure || 0) + 8 })}
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

          {/* Toggles - Only show Vacation/Flex if NOT Rest Day, or if they are already active */}
          {(!isRestDay || localData.isVacation || localData.isFlexTime || localData.isSickLeave) && (
            <div className="grid grid-cols-2 gap-4">
              {/* Vacation Toggle */}
              <button
                onClick={() => {
                  if (!localData.isVacation && vacationBalance && vacationBalance.remaining <= 0) {
                    // Prevent selection if no balance
                    return;
                  }
                  handleLocalUpdate({ isVacation: !localData.isVacation, isSickLeave: false, isFlexTime: false });
                }}
                className={`cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-black p-4 shadow-neo-sm transition-all ${localData.isVacation ? 'translate-x-[2px] translate-y-[2px] bg-neo-blue shadow-none' : 'bg-white'} flex`}
                type="button"
              >
                <Palmtree size={24} />
                <div className="text-center">
                  <span className="block text-sm font-bold">{t.vacation}</span>
                  {vacationBalance && (
                    <span className="text-[10px] text-gray-500">
                      {vacationBalance.remaining}
                      {' '}
                      {t.remaining}
                    </span>
                  )}
                </div>
              </button>

              {/* Flex Time Toggle */}
              <button
                onClick={() => {
                  if (!localData.isFlexTime && flexTimeBalance && flexTimeBalance.remaining <= 0) {
                    // Prevent selection if no balance
                    return;
                  }
                  handleLocalUpdate({ isFlexTime: !localData.isFlexTime, isVacation: false, isSickLeave: false });
                }}
                className={`cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-black p-4 shadow-neo-sm transition-all ${localData.isFlexTime ? 'translate-x-[2px] translate-y-[2px] bg-purple-200 shadow-none' : 'bg-white'} flex`}
                type="button"
              >
                <Calendar size={24} />
                <div className="text-center">
                  <span className="block text-sm font-bold">{t.flexTime}</span>
                  {flexTimeBalance && (
                    <span className="text-[10px] text-gray-500">
                      {flexTimeBalance.remaining}
                      {' '}
                      {t.remaining}
                    </span>
                  )}
                </div>
              </button>

              {/* Sick Leave Toggle */}
              <button
                onClick={() => handleLocalUpdate({ isSickLeave: !localData.isSickLeave, isVacation: false, isFlexTime: false })}
                className={`cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-black p-4 shadow-neo-sm transition-all ${localData.isSickLeave ? 'translate-x-[2px] translate-y-[2px] bg-red-300 shadow-none' : 'bg-white'} flex`}
                type="button"
              >
                <Pill size={24} />
                <span className="text-sm font-bold">{t.sick}</span>
              </button>

              {/* Use Banked Hours - Only show if NOT Rest Day */}
              {!isRestDay && (
                <button
                  onClick={() => handleLocalUpdate({ ure: (localData.ure || 0) - 8 })}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-black bg-red-100 p-4 shadow-neo-sm transition-all hover:bg-red-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  type="button"
                >
                  <Briefcase size={24} />
                  <div className="text-center">
                    <span className="block text-sm font-bold">{t.useBanked}</span>
                    <span className="text-[10px] text-gray-500">-8h</span>
                  </div>
                </button>
              )}

              {/* Holiday Indicator (Read Only) */}
              {localData.isHoliday && (
                <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-black bg-pink-200 p-4 opacity-80 shadow-none">
                  <Sun size={24} />
                  <span className="text-sm font-bold">{t.holiday}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t-2 border-black bg-gray-50 p-4">
          <Button className="w-full" onClick={handleSave}>{t.save}</Button>
        </div>

      </div>
    </div>
  );
};
