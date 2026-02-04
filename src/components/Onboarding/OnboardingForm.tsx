'use client';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { completeOnboarding } from '@/actions/OnboardingActions';
import { Button } from '../ui/Button';

const SHIFT_GROUPS_RAW = [
  { id: 'A', nameKey: 'group_a', description: 'REST' },
  { id: 'B', nameKey: 'group_b', description: 'II Shift' },
  { id: 'C', nameKey: 'group_c', description: 'III Shift' },
  { id: 'D', nameKey: 'group_d', description: 'I Shift' },
] as const;

export function OnboardingForm() {
  const t = useTranslations('Onboarding');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    shiftGroup: null as 'A' | 'B' | 'C' | 'D' | null,
    vacationDaysBalance: 0,
    flexDaysBalance: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.shiftGroup) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await completeOnboarding({
        firstName: formData.firstName,
        lastName: formData.lastName,
        shiftGroup: formData.shiftGroup,
        vacationDaysBalance: formData.vacationDaysBalance,
        flexDaysBalance: formData.flexDaysBalance,
      });

      if (!result.success) {
        setError(result.error || t('error_failed'));
        setIsSubmitting(false);
        return;
      }

      window.location.href = '/home';
    } catch (error) {
      console.error(error);
      setError(t('error_system'));
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
              {i === 1 ? t('step_personal') : i === 2 ? t('step_shift') : t('step_balances')}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border-2 border-red-500 bg-red-50 p-4 text-center text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-neo">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black">{t('personal_title')}</h2>
              <p className="font-bold opacity-60">{t('personal_desc')}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-sm font-bold">{t('first_name')}</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-lg border-2 border-black p-3 font-medium focus:bg-neo-blue/10 focus:outline-none"
                  placeholder={t('first_name_placeholder')}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-sm font-bold">{t('last_name')}</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-lg border-2 border-black p-3 font-medium focus:bg-neo-blue/10 focus:outline-none"
                  placeholder={t('last_name_placeholder')}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNext} disabled={!formData.firstName || !formData.lastName}>
                {t('next')}
                {' '}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black">{t('shift_title')}</h2>
              <p className="font-bold opacity-60">{t('shift_desc')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SHIFT_GROUPS_RAW.map(group => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, shiftGroup: group.id })}
                  className={`rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-1 hover:shadow-neo ${
                    formData.shiftGroup === group.id
                      ? 'border-black bg-neo-cyan shadow-neo'
                      : 'border-black bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="font-black">{t(group.nameKey as any)}</div>
                  <div className="text-sm font-bold opacity-60">{group.description}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                {' '}
                {t('back')}
              </Button>
              <Button onClick={handleNext} disabled={!formData.shiftGroup}>
                {t('next')}
                {' '}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black">{t('balances_title')}</h2>
              <p className="font-bold opacity-60">{t('balances_desc')}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="vacationBalance" className="mb-2 block text-sm font-bold">{t('vacation_label')}</label>
                <input
                  id="vacationBalance"
                  type="number"
                  value={formData.vacationDaysBalance}
                  onChange={e => setFormData({ ...formData, vacationDaysBalance: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black p-3 font-mono text-xl focus:bg-neo-blue/10 focus:outline-none"
                />
                <p className="mt-1 text-xs font-bold text-gray-500">{t('vacation_hint')}</p>
              </div>
              <div>
                <label htmlFor="flexBalance" className="mb-2 block text-sm font-bold">{t('flex_label')}</label>
                <input
                  id="flexBalance"
                  type="number"
                  value={formData.flexDaysBalance}
                  onChange={e => setFormData({ ...formData, flexDaysBalance: Number(e.target.value) })}
                  className="w-full rounded-lg border-2 border-black p-3 font-mono text-xl focus:bg-neo-blue/10 focus:outline-none"
                />
                <p className="mt-1 text-xs font-bold text-gray-500">{t('flex_hint')}</p>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={handleBack}>
                <ArrowLeft size={16} className="mr-2" />
                {' '}
                {t('back')}
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? t('saving') : t('finish')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
