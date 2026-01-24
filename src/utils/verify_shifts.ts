import { calculateShift } from './ShiftCalculator';

const DECEMBER_PATTERNS = {
  I: 'aaaabbbbbcccccdddddaaaaabbbbbcc',
  II: 'bbcccccdddddaaaaabbbbcccccddddd',
  III: 'dddddaaaaabbbbbcccccdddddaaaaab',
  REST: 'ccbbaddccbaaddcbbaadcbbbadcccba',
};

const JANUARY_PATTERNS = {
  I: 'cccdddddaaaaabbbbbcccccdddddaaa',
  II: 'daaaaabbbbbcccccdddddaaaaabbbbb',
  III: 'bbbbcccccdddddaaaaabbbbbcccccdd',
  REST: 'addcbbaadccbbaddccbaaddcbbaadcc',
};

const FEBRUARY_PATTERNS = {
  I: 'aabbbbbcccccdddddaaaaabbbbbc',
  II: 'cccccdddddaaaaabbbbbcccccddd',
  III: 'dddaaaaabbbbbcccccdddddaaaaa',
  REST: 'bbaddccbaaddcbbaadccbbaddccb',
};

const MARCH_PATTERNS = {
  I: 'ccccdddddaaaaabbbbbcccccdddddaa',
  II: 'ddaaaaabbbbbcccccdddddaaaaabbbb',
  III: 'bbbbbcccccdddddaaaaabbbbbcccccd',
  REST: 'aaddcbbaadccbbaddccbaaddcbbaadc',
};

const APRIL_PATTERNS = {
  I: 'aaaabbbbcccccdddddaaaaabbbbbcc',
  II: 'bcccccdddddaaaaabbbbbcccccdddd',
  III: 'ddddaaaaabbbbbcccccdddddaaaaab',
  REST: 'cbbbddccbaaddcbbaadccbbaddccba',
};

const MAY_PATTERNS = {
  I: 'cccdddddaaaaabbbbbcccccdddddaaa',
  II: 'daaaaabbbbbcccccdddddaaaaabbbbb',
  III: 'bbbbcccccdddddaaaaabbbbbcccccdd',
  REST: 'addcbbaadccbbaddccbaaddcbbaadcc',
};

// Days in each month
const MONTH_DAYS: Record<number, number> = {
  11: 31, // December
  0: 31, // January
  1: 28, // February 2026 (not a leap year)
  2: 31, // March
  3: 30, // April
  4: 31, // May
};

function verifyMonth(
  monthIndex: number,
  patterns: { I: string; II: string; III: string; REST: string },
  monthName: string,
  year: number = 2026,
) {
  console.warn(`Verifying ${monthName} ${year}...`);

  // Use actual days for the month
  const daysInMonth = MONTH_DAYS[monthIndex] ?? patterns.I.length;
  let errors = 0;

  // Verify pattern lengths match expected days
  for (const [shiftType, pattern] of Object.entries(patterns)) {
    if (pattern.length !== daysInMonth) {
      console.error(
        `Pattern length mismatch for ${shiftType}: expected ${daysInMonth}, got ${pattern.length}`,
      );
      errors++;
    }
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);

    // Let's check all groups for this day
    for (const group of ['A', 'B', 'C', 'D'] as const) {
      const result = calculateShift(date, group);

      // Find what shift this group SHOULD be on according to pattern
      let expectedShift = 'REST';
      for (const [s, p] of Object.entries(patterns)) {
        if (p[day - 1]?.toLowerCase() === group.toLowerCase()) {
          expectedShift = s;
          break;
        }
      }

      if (result.shiftType !== expectedShift) {
        console.error(
          `Mismatch on ${monthName} ${day}, Group ${group}: Expected ${expectedShift}, Got ${result.shiftType}`,
        );
        errors++;
      }
    }
  }

  if (errors === 0) {
    console.warn(`${monthName} ${year} verification PASSED.`);
  } else {
    console.warn(`${monthName} ${year} verification FAILED with ${errors} errors.`);
  }

  return errors;
}

// Run verification for all months
export function runFullVerification() {
  let totalErrors = 0;

  // December 2025
  totalErrors += verifyMonth(11, DECEMBER_PATTERNS, 'December', 2025);

  // January - May 2026
  totalErrors += verifyMonth(0, JANUARY_PATTERNS, 'January', 2026);
  totalErrors += verifyMonth(1, FEBRUARY_PATTERNS, 'February', 2026);
  totalErrors += verifyMonth(2, MARCH_PATTERNS, 'March', 2026);
  totalErrors += verifyMonth(3, APRIL_PATTERNS, 'April', 2026);
  totalErrors += verifyMonth(4, MAY_PATTERNS, 'May', 2026);

  console.warn(`\nTotal verification errors: ${totalErrors}`);
  return totalErrors;
}

// Only run if this file is executed directly
if (typeof window === 'undefined' && process.argv[1]?.includes('verify_shifts')) {
  runFullVerification();
}
