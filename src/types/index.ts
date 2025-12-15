export type ShiftGroup = 'A' | 'B' | 'C' | 'D';
export type ShiftType = 'I' | 'II' | 'III' | 'REST' | 'O';
export type Language = 'en' | 'sl';

export type DailyStats = {
  date: string;
  nadure: number;
  ure: number;
  isVacation: boolean;
  isSickLeave: boolean;
  isFlexTime: boolean;
  isHoliday: boolean;
};

export type UserData = {
  group: ShiftGroup | null;
  language: Language;
  events: Record<string, DailyStats>;
  onboarded: boolean;
};

export type AppState = {} & UserData;
