/**
 * 4-Shift Pattern Calculator
 *
 * Calculates which shift a user works on any given day based on their shift group.
 * Patterns are defined monthly and repeat.
 *
 * SHIFT GROUP MAPPING:
 * - A = REST (day off)
 * - B = II (second shift)
 * - C = III (night shift)
 * - D = I (first shift)
 */

// December pattern (31 days)
// Lowercase = working shift (a=A group, b=B group, c=C group, d=D group)
// Uppercase = vacation for that shift group
const DECEMBER_PATTERNS = {
  A: 'aaaabbbbbcccccdddddaaaaABBBBBCC',
  B: 'bbcccccdddddaaaaabbbbccCCCDDDDD',
  C: 'dddddaaaaabbbbbcccccdddDDAAAAAB',
  D: 'ccbbaddccbaaddcbbaadcbbbadcccba',
} as const;

type ShiftGroup = 'A' | 'B' | 'C' | 'D';
type ShiftType = 'I' | 'II' | 'III' | 'REST';

type ShiftResult = {
  shiftType: ShiftType;
  isVacation: boolean;
};

// Map shift group letters to shift types
const SHIFT_GROUP_TO_TYPE: Record<string, ShiftType> = {
  a: 'REST', // Group A = REST
  b: 'II', // Group B = Second shift
  c: 'III', // Group C = Night shift
  d: 'I', // Group D = First shift
  A: 'REST',
  B: 'II',
  C: 'III',
  D: 'I',
};

/**
 * Calculate the shift for a specific date and group
 */
export function calculateShift(date: Date, shiftGroup: ShiftGroup): ShiftResult {
  const month = date.getMonth(); // 0-11
  const day = date.getDate(); // 1-31

  // For now, we only have December pattern
  // TODO: Define patterns for other months or use a repeating cycle
  let pattern: string;

  if (month === 11) {
    // December (month 11)
    pattern = DECEMBER_PATTERNS[shiftGroup];
  } else {
    // Fallback: use December pattern as template for all months
    // You can extend this to handle other months differently
    pattern = DECEMBER_PATTERNS[shiftGroup];
  }

  const dayIndex = day - 1; // Convert to 0-indexed
  const patternChar = pattern[dayIndex % pattern.length];

  if (!patternChar) {
    return { shiftType: 'REST', isVacation: false };
  }

  const isVacation = patternChar === patternChar.toUpperCase() && patternChar !== patternChar.toLowerCase();
  const shiftLetter = patternChar.toLowerCase();

  const shiftType = SHIFT_GROUP_TO_TYPE[shiftLetter] || 'REST';

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
