import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/Onboarding/OnboardingForm';

export const metadata: Metadata = {
  title: 'Welcome - 4Shifter',
};

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <OnboardingForm />
    </div>
  );
}
