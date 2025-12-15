'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { completeOnboarding } from '@/actions/OnboardingActions';
import { Button } from '../ui/Button';

type ProfileFormProps = {
  user: {
    firstName: string | null;
    lastName: string | null;
    shiftGroup: 'A' | 'B' | 'C' | 'D';
    vacationDaysBalance: number;
    flexDaysBalance: number;
  };
};

const SHIFT_GROUPS = [
  { id: 'A', name: 'Group A (REST)' },
  { id: 'B', name: 'Group B (II)' },
  { id: 'C', name: 'Group C (III)' },
  { id: 'D', name: 'Group D (I)' },
] as const;

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    shiftGroup: user.shiftGroup,
    vacationDaysBalance: user.vacationDaysBalance,
    flexDaysBalance: user.flexDaysBalance,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await completeOnboarding({
        firstName: formData.firstName,
        lastName: formData.lastName,
        shiftGroup: formData.shiftGroup,
        vacationDaysBalance: formData.vacationDaysBalance,
        flexDaysBalance: formData.flexDaysBalance,
      });

      setMessage('Profile updated successfully!');

      // Refresh the page data
      router.refresh();
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border-2 border-black bg-white p-6 shadow-neo">
      <div className="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-4">
        <h2 className="text-xl font-bold">Work Settings / Delovne Nastavitve</h2>
      </div>

      {/* Personal Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full rounded-lg border-2 border-black bg-gray-50 p-2 focus:bg-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full rounded-lg border-2 border-black bg-gray-50 p-2 focus:bg-white"
          />
        </div>
      </div>

      {/* Shift Group */}
      <div className="space-y-2">
        <label className="text-sm font-bold">Shift Group</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {SHIFT_GROUPS.map(group => (
            <button
              key={group.id}
              type="button"
              onClick={() => setFormData({ ...formData, shiftGroup: group.id })}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-bold transition-all ${
                formData.shiftGroup === group.id
                  ? 'border-black bg-neo-yellow shadow-neo-sm'
                  : 'border-transparent bg-gray-100 hover:border-black/20'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">Changing this will update your schedule pattern.</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Balances */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold">Vacation Balance (Days)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={formData.vacationDaysBalance}
              onChange={e => setFormData({ ...formData, vacationDaysBalance: Number(e.target.value) })}
              className="w-full rounded-lg border-2 border-black p-2 font-mono"
            />
          </div>
          <p className="text-xs text-gray-500">Current available days (Sets used to 0).</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold">Flex Time Balance (Days)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={formData.flexDaysBalance}
              onChange={e => setFormData({ ...formData, flexDaysBalance: Number(e.target.value) })}
              className="w-full rounded-lg border-2 border-black p-2 font-mono"
            />
          </div>
          <p className="text-xs text-gray-500">Current available days (Sets used to 0).</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm font-bold ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
}
