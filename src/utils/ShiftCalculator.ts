/**
 * 4-Shift Pattern Calculator
 *
 * Calculates which shift a user works on any given day based on their shift group.
 * Patterns are defined monthly.
 *
 * SHIFT GROUP MAPPING:
 * - A = REST (day off)
 * - B = II (second shift)
 * - C = III (night shift)
 * - D = I (first shift)
 */

type ShiftGroup = 'A' | 'B' | 'C' | 'D';
type ShiftType = 'I' | 'II' | 'III' | 'REST';

type ShiftResult = {
  shiftType: ShiftType;
  isVacation: boolean;
};

// Monthly shift patterns
// Key: Month index (0 = January, 11 = December)
// Value: Object mapping ShiftType to a string of group letters for each day
const MONTHLY_SHIFTS: Record<number, { I: string; II: string; III: string; REST: string }> = {
  11: { // December
    I: 'aaaabbbbbcccccdddddaaaaabbbbbcc',
    II: 'bbcccccdddddaaaaabbbbcccccddddd',
    III: 'dddddaaaaabbbbbcccccdddddaaaaab',
    REST: 'ccbbaddccbaaddcbbaadcbbbadcccba',
  },
  0: { // January
    I: 'cccdddddaaaaabbbbbcccccdddddaaa',
    II: 'daaaaabbbbbcccccdddddaaaaabbbbb',
    III: 'bbbbcccccdddddaaaaabbbbbcccccdd',
    REST: 'addcbbaadccbbaddccbaaddcbbaadcc',
  },
};

/**
 * Calculate the shift for a specific date and group
 */
export function calculateShift(date: Date, shiftGroup: ShiftGroup): ShiftResult {
  const month = date.getMonth(); // 0-11
  const day = date.getDate(); // 1-31

  // Get patterns for the month, fallback to empty object if not defined
  // TODO: Handle other months or repeating logic
  const patterns = MONTHLY_SHIFTS[month];

  if (!patterns) {
    // Default fallback if month is not defined (e.g. treat as REST or handle error)
    return { shiftType: 'REST', isVacation: false };
  }

  const dayIndex = day - 1; // Convert to 0-indexed

  let shiftType: ShiftType = 'REST';
  let isVacation = false;

  // Check each shift type to see if the user's group is assigned to it
  for (const [type, patternString] of Object.entries(patterns)) {
    const char = patternString[dayIndex];

    if (char && char.toLowerCase() === shiftGroup.toLowerCase()) {
      shiftType = type as ShiftType;
      // Check for vacation (uppercase in pattern means vacation)
      // Note: Current provided patterns are all lowercase, so this will be false unless patterns are updated
      isVacation = char === char.toUpperCase() && char !== char.toLowerCase();
      break;
    }
  }

  return { shiftType, isVacation };
}

/**
 * Get the full month schedule for a user's shift group
 */
export function getMonthSchedule(year: number, month: number, shiftGroup: ShiftGroup) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const schedule = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const result = calculateShift(date, shiftGroup);
    schedule.push({
      date: date.toISOString().split('T')[0],
      shiftType: result.shiftType,
      isVacation: result.isVacation,
    });
  }

  return schedule;
}
