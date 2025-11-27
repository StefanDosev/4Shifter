export const SHIFT_DEFINITIONS = {
  I: { code: 'I', labelEn: 'Morning', labelSl: 'Dopoldne', color: 'bg-neo-yellow', times: '06:00 - 14:00' },
  II: { code: 'II', labelEn: 'Afternoon', labelSl: 'Popoldne', color: 'bg-neo-cyan', times: '14:00 - 22:00' },
  III: { code: 'III', labelEn: 'Night', labelSl: 'Ponoči', color: 'bg-neo-violet', times: '22:00 - 06:00' },
  REST: { code: 'REST', labelEn: 'Free', labelSl: 'Prosto', color: 'bg-white', times: 'Off' },
  O: { code: 'O', labelEn: 'Other', labelSl: 'Drugo', color: 'bg-gray-100', times: '-' },
} as const;

export const TRANSLATIONS = {
  en: {
    welcome: 'Select your shift group to get started',
    today: 'Today\'s Shift',
    vacation: 'Vacation',
    sick: 'Sick Leave',
    nadure: 'Overtime',
    ure: 'Banked Hours',
  },
  sl: {
    welcome: 'Izberite svojo izmeno za začetek',
    today: 'Današnja izmena',
    vacation: 'Dopust',
    sick: 'Bolniška',
    nadure: 'Nadure',
    ure: 'Ure',
  },
} as const;
