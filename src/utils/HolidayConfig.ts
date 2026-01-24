/**
 * Holiday Configuration for Slovenian Public Holidays
 * This file defines national holidays that are displayed in the calendar
 */

export type Holiday = {
  name: string;
  nameEn: string;
  nameSl: string;
  // Month and day - we'll check against these for any year
  month: number; // 1-12
  day: number; // 1-31
  isMovable?: boolean; // For holidays like Easter that change dates
  isWorkingHoliday?: boolean; // Delo na praznik - working holiday for shift workers
  year?: number; // For movable holidays, specify the year
};

/**
 * Fixed Slovenian Public Holidays
 * Source: https://www.gov.si/teme/prazniki-in-dela-prosti-dnevi/
 *
 * Working holidays (delo na praznik) for 2026:
 * - February 8 (Prešeren Day)
 * - April 27 (Day of Uprising)
 * - May 2 (Labour Day 2nd)
 * - May 24 (Whit Sunday)
 */
export const SLOVENIAN_HOLIDAYS: Holiday[] = [
  {
    name: 'new_year_1',
    nameEn: 'New Year\'s Day',
    nameSl: 'Novo leto',
    month: 1,
    day: 1,
  },
  {
    name: 'new_year_2',
    nameEn: 'New Year\'s Day (2nd)',
    nameSl: 'Novo leto',
    month: 1,
    day: 2,
  },
  {
    name: 'preseren_day',
    nameEn: 'Prešeren Day (Cultural Holiday)',
    nameSl: 'Prešernov dan',
    month: 2,
    day: 8,
    isWorkingHoliday: true, // Delo na praznik
  },
  {
    name: 'easter_sunday',
    nameEn: 'Easter Sunday',
    nameSl: 'Velika noč',
    month: 4,
    day: 5,
    isMovable: true,
    year: 2026,
  },
  {
    name: 'easter_monday',
    nameEn: 'Easter Monday',
    nameSl: 'Velikonočni ponedeljek',
    month: 4,
    day: 6,
    isMovable: true,
    year: 2026,
  },
  {
    name: 'uprising_day',
    nameEn: 'Day of Uprising Against Occupation',
    nameSl: 'Dan upora proti okupatorju',
    month: 4,
    day: 27,
    isWorkingHoliday: true, // Delo na praznik
  },
  {
    name: 'labor_day',
    nameEn: 'Labour Day',
    nameSl: 'Praznik dela',
    month: 5,
    day: 1,
  },
  {
    name: 'labor_day_2',
    nameEn: 'Labour Day (2nd)',
    nameSl: 'Praznik dela',
    month: 5,
    day: 2,
    isWorkingHoliday: true, // Delo na praznik
  },
  {
    name: 'whit_sunday',
    nameEn: 'Whit Sunday (Pentecost)',
    nameSl: 'Binkošti',
    month: 5,
    day: 24,
    isMovable: true,
    year: 2026,
    isWorkingHoliday: true, // Delo na praznik
  },
  {
    name: 'statehood_day',
    nameEn: 'Statehood Day',
    nameSl: 'Dan državnosti',
    month: 6,
    day: 25,
  },
  {
    name: 'assumption_day',
    nameEn: 'Assumption Day',
    nameSl: 'Marijino vnebovzetje',
    month: 8,
    day: 15,
  },
  {
    name: 'reformation_day',
    nameEn: 'Reformation Day',
    nameSl: 'Dan reformacije',
    month: 10,
    day: 31,
  },
  {
    name: 'all_saints_day',
    nameEn: 'All Saints\' Day',
    nameSl: 'Dan spomina na mrtve',
    month: 11,
    day: 1,
  },
  {
    name: 'christmas',
    nameEn: 'Christmas Day',
    nameSl: 'Božič',
    month: 12,
    day: 25,
  },
  {
    name: 'independence_day',
    nameEn: 'Independence and Unity Day',
    nameSl: 'Dan samostojnosti in enotnosti',
    month: 12,
    day: 26,
  },
];

/**
 * Constants for vacation and flex time limits
 */
export const VACATION_DAYS_PER_YEAR = 26;
export const FLEX_TIME_DAYS_PER_YEAR = 10; // Default buffer

/**
 * Check if a given date is a Slovenian public holiday
 */
export function isHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  return SLOVENIAN_HOLIDAYS.some(
    (holiday) => {
      // For movable holidays, check the year matches
      if (holiday.isMovable && holiday.year && holiday.year !== year) {
        return false;
      }
      return holiday.month === month && holiday.day === day;
    },
  );
}

/**
 * Check if a given date is a working holiday (delo na praznik)
 * These are holidays where shift workers still work
 */
export function isWorkingHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const holiday = SLOVENIAN_HOLIDAYS.find(
    (h) => {
      // For movable holidays, check the year matches
      if (h.isMovable && h.year && h.year !== year) {
        return false;
      }
      return h.month === month && h.day === day;
    },
  );

  return holiday?.isWorkingHoliday ?? false;
}

/**
 * Get the holiday name for a given date (returns null if not a holiday)
 */
export function getHolidayName(date: Date, locale: 'en' | 'sl' = 'en'): string | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const holiday = SLOVENIAN_HOLIDAYS.find(
    (h) => {
      // For movable holidays, check the year matches
      if (h.isMovable && h.year && h.year !== year) {
        return false;
      }
      return h.month === month && h.day === day;
    },
  );

  if (!holiday) {
    return null;
  }

  return locale === 'sl' ? holiday.nameSl : holiday.nameEn;
}

/**
 * Get all holidays for a given month
 */
export function getHolidaysForMonth(month: number, year: number): Array<{ date: Date; name: string; nameSl: string; isWorkingHoliday: boolean }> {
  return SLOVENIAN_HOLIDAYS
    .filter((h) => {
      // For movable holidays, only include if year matches
      if (h.isMovable && h.year && h.year !== year) {
        return false;
      }
      return h.month === month;
    })
    .map(h => ({
      date: new Date(year, month - 1, h.day),
      name: h.nameEn,
      nameSl: h.nameSl,
      isWorkingHoliday: h.isWorkingHoliday ?? false,
    }));
}
