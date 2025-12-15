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
};

/**
 * Fixed Slovenian Public Holidays
 * Source: https://www.gov.si/teme/prazniki-in-dela-prosti-dnevi/
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
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();

  return SLOVENIAN_HOLIDAYS.some(
    holiday => holiday.month === month && holiday.day === day,
  );
}

/**
 * Get the holiday name for a given date (returns null if not a holiday)
 */
export function getHolidayName(date: Date, locale: 'en' | 'sl' = 'en'): string | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const holiday = SLOVENIAN_HOLIDAYS.find(
    h => h.month === month && h.day === day,
  );

  if (!holiday) {
    return null;
  }

  return locale === 'sl' ? holiday.nameSl : holiday.nameEn;
}

/**
 * Get all holidays for a given month
 */
export function getHolidaysForMonth(month: number, year: number): Array<{ date: Date; name: string; nameSl: string }> {
  return SLOVENIAN_HOLIDAYS
    .filter(h => h.month === month)
    .map(h => ({
      date: new Date(year, month - 1, h.day),
      name: h.nameEn,
      nameSl: h.nameSl,
    }));
}
