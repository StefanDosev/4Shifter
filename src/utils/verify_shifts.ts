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

function verifyMonth(monthIndex: number, patterns: Record<string, string>, monthName: string) {
  console.warn(`Verifying ${monthName}...`);
  const daysInMonth = 31; // Both Dec and Jan have 31 days
  let errors = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(2025, monthIndex, day);

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

      // Special case: if multiple shifts claim the same group (error in pattern), or none do (rest)
      // The calculateShift logic defaults to REST if not found in I, II, III

      if (result.shiftType !== expectedShift) {
        // If expected is REST and result is REST, it's fine.
        // But our pattern has explicit REST string.
        // Let's trust the calculateShift logic which iterates I, II, III, REST
        // If the group is in REST pattern, it returns REST.

        // Wait, calculateShift iterates the map. If it finds it in REST, it returns REST.
        // So it should match.

        console.error(`Mismatch on ${monthName} ${day}, Group ${group}: Expected ${expectedShift}, Got ${result.shiftType}`);
        errors++;
      }
    }
  }

  if (errors === 0) {
    console.warn(`${monthName} verification PASSED.`);
  } else {
    console.warn(`${monthName} verification FAILED with ${errors} errors.`);
  }
}

verifyMonth(11, DECEMBER_PATTERNS, 'December');
verifyMonth(0, JANUARY_PATTERNS, 'January');
