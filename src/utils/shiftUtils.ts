// Utility function to calculate days until next REST day
export function calculateDaysUntilOff(currentDate: Date, shiftGroup: 'A' | 'B' | 'C' | 'D'): number {
  const SHIFT_EPOCH = new Date('2024-01-01T00:00:00');
  const SHIFT_CYCLE = ['I', 'I', 'II', 'II', 'III', 'III', 'REST', 'REST']; // 8-day cycle

  const GROUP_OFFSETS: Record<string, number> = {
    A: 0,
    B: 2,
    C: 4,
    D: 6,
  };

  const offset = GROUP_OFFSETS[shiftGroup];

  // Calculate days from epoch
  const daysSinceEpoch = Math.floor((currentDate.getTime() - SHIFT_EPOCH.getTime()) / (1000 * 60 * 60 * 24));
  const adjustedDay = (daysSinceEpoch + (offset ?? 0)) % 8;

  // Find next REST in the cycle
  let daysUntilRest = 0;
  for (let i = 1; i <= 8; i++) {
    const nextDayIndex = (adjustedDay + i) % 8;
    if (SHIFT_CYCLE[nextDayIndex] === 'REST') {
      daysUntilRest = i;
      break;
    }
  }

  return daysUntilRest;
}
