export const SHIFT_COLORS = {
  I: 'bg-[#ffc900]', // M - Morning (yellow)
  II: 'bg-[#23a094]', // A - Afternoon (cyan)
  III: 'bg-[#b597f6]', // N - Night (violet)
  REST: 'bg-white', // O - Off
} as const;

export const SHIFT_LABELS_EN = {
  I: 'Morning',
  II: 'Afternoon',
  III: 'Night',
  REST: 'Off',
} as const;

export const SHIFT_LABELS_SL = {
  I: 'Jutranja',
  II: 'Popoldanska',
  III: 'Nočna',
  REST: 'Prosto',
} as const;

export const SHIFT_TIMES = {
  I: '06:00 - 14:00',
  II: '14:00 - 22:00',
  III: '22:00 - 06:00',
  REST: '-',
} as const;

export type ShiftType = 'I' | 'II' | 'III' | 'REST';

export const SHIFT_DEFINITIONS = {
  I: {
    code: 'I' as const,
    color: SHIFT_COLORS.I,
    labelEn: SHIFT_LABELS_EN.I,
    labelSl: SHIFT_LABELS_SL.I,
    times: SHIFT_TIMES.I,
  },
  II: {
    code: 'II' as const,
    color: SHIFT_COLORS.II,
    labelEn: SHIFT_LABELS_EN.II,
    labelSl: SHIFT_LABELS_SL.II,
    times: SHIFT_TIMES.II,
  },
  III: {
    code: 'III' as const,
    color: SHIFT_COLORS.III,
    labelEn: SHIFT_LABELS_EN.III,
    labelSl: SHIFT_LABELS_SL.III,
    times: SHIFT_TIMES.III,
  },
  REST: {
    code: 'REST' as const,
    color: SHIFT_COLORS.REST,
    labelEn: SHIFT_LABELS_EN.REST,
    labelSl: SHIFT_LABELS_SL.REST,
    times: SHIFT_TIMES.REST,
  },
} as const;
