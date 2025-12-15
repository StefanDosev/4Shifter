'use client';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { completeOnboarding } from '@/actions/OnboardingActions';
import { Button } from '../ui/Button';

const SHIFT_GROUPS = [
  { id: 'A', name: 'Group A', description: 'REST' },
  { id: 'B', name: 'Group B', description: 'II Shift' },
  { id: 'C', name: 'Group C', description: 'III Shift' },
  { id: 'D', name: 'Group D', description: 'I Shift' },
] as const;

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    shiftGroup: null as 'A' | 'B' | 'C' | 'D' | null,
    vacationDaysBalance: 0,
    flexDaysBalance: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.shiftGroup) {
      return;
    }

    setIsSubmitting(true);
    try {
      await completeOnboarding({
        firstName: formData.firstName,
        lastName: formData.lastName,
        shiftGroup: formData.shiftGroup,
        vacationDaysBalance: formData.vacationDaysBalance,
        flexDaysBalance: formData.flexDaysBalance,
      });
      window.location.href = '/home';
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6">
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-bold ${
                step >= i
                  ? 'border-black bg-neo-yellow'
                  : 'border-gray-200 bg-white text-gray-300'
              }`}
            >
              {step > i ? <Check size={16} /> : i}
            </div>
            <div className={`text-sm font-bold ${step >= i ? 'text-black' : 'text-gray-300'}`}>
              {i === 1 ? 'Personal' : i === 2 ? 'Shift' : 'Balances'}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-neo">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black">Who are you?</h2>
              <p className="font-bold opacity-60">Enter your name to personalize your experience.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border-2 border-black p-3 font-medium focus:bg-neo-blue/10 focus:outline-none"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border-2 border-black p-3 font-medium focus:bg-neo-blue/10 focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!formData.firstName || !formData.lastName}>
                Next
                {' '}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black">Choose your Shift</h2>
              <p className="font-bold opacity-60">Which shift pattern are you currently on?</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHIFT_GROUPS.map(group => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, shiftGroup: group.id })}
                  className={`rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-1 hover:shadow-neo ${
                    formData.shiftGroup === group.id
                      ? 'bg-neo-green border-black shadow-neo'
                      : 'border-black bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="font-black">{group.name}</div>
                  <div className="text-sm font-bold opacity-60">{group.description}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                {' '}
                Back
              </Button>
              <Button onClick={handleNext} disabled={!formData.shiftGroup}>
                Next
                {' '}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black">Current Balances</h2>
              <p className="font-bold opacity-60">Set your starting balances for accurate tracking.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold">Vacation Balance (Days)</label>
                <input
                  type="number"
                  value={formData.vacationDaysBalance}
                  onChange={e => setFormData({ ...formData, vacationDaysBalance: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black p-3 font-mono text-xl focus:bg-neo-blue/10 focus:outline-none"
                />
                <p className="mt-1 text-xs font-bold text-gray-500">Days remaining right now.</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold">Flex Time Balance (Days)</label>
                <input
                  type="number"
                  value={formData.flexDaysBalance}
                  onChange={e => setFormData({ ...formData, flexDaysBalance: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black p-3 font-mono text-xl focus:bg-neo-blue/10 focus:outline-none"
                />
                <p className="mt-1 text-xs font-bold text-gray-500">Days banked right now.</p>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                {' '}
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Finish Setup'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
