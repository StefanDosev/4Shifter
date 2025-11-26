'use client';

import { useState } from 'react';
import { updateShiftGroup } from '@/actions/OnboardingActions';

const SHIFT_GROUPS = [
  {
    id: 'A' as const,
    name: 'Group A',
    description: 'REST - Day off rotation',
  },
  {
    id: 'B' as const,
    name: 'Group B',
    description: 'Second Shift (II)',
  },
  {
    id: 'C' as const,
    name: 'Group C',
    description: 'Night Shift (III)',
  },
  {
    id: 'D' as const,
    name: 'Group D',
    description: 'First Shift (I)',
  },
];

export function OnboardingForm() {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selected) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateShiftGroup(selected);

      // Force a hard navigation instead of client-side
      window.location.href = '/dashboard';
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to 4Shifter!</h1>
        <p className="mt-2 text-gray-600">Select your shift group to get started</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SHIFT_GROUPS.map(group => (
          <button
            key={group.id}
            type="button"
            onClick={() => setSelected(group.id)}
            className={`rounded-lg border-2 p-6 text-left transition ${
              selected === group.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-xl font-semibold">{group.name}</div>
            <div className="mt-1 text-sm text-gray-600">{group.description}</div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || isSubmitting}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
