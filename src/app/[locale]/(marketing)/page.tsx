'use client';

import type { ShiftGroup } from '@/types';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { ArrowRight, Calendar, CheckCircle, Clock, Coins, Heart, Shield, Umbrella } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { SHIFT_DEFINITIONS } from '@/constants';
import { getShiftForDate } from '@/utils/dateUtils';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Trigger animations on mount
  useEffect(() => {
    // Defer to next tick to avoid synchronous state update warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/sign-up');
    }, 800);
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const today = new Date();
  const groups: ShiftGroup[] = ['A', 'B', 'C', 'D'];

  return (
    <div className={`min-h-screen overflow-x-hidden bg-neo-white font-sans text-neo-black transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white">
        <Navbar
          rightNav={(
            <>
              <button
                type="button"
                onClick={() => router.push('/about')}
                className="mr-4 hidden font-bold decoration-2 underline-offset-4 hover:underline sm:block"
              >
                O nas
              </button>
              <button
                type="button"
                onClick={handleSignIn}
                className="mr-4 hidden font-bold decoration-2 underline-offset-4 hover:underline sm:block"
              >
                Prijava
              </button>
              <Button onClick={handleSignUp} size="sm" className="hidden sm:flex">
                Registracija
              </Button>
            </>
          )}
        />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-2 border-black bg-neo-yellow">
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-24">

          <div className="grid items-center gap-12 md:grid-cols-2">

            {/* Left: Copy */}
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block -rotate-2 transform animate-float rounded-full border-2 border-black bg-white px-4 py-1 text-sm font-bold shadow-neo-sm">
                ✓ Brezplačno • Brez oglasov • Brez prodaje podatkov
              </div>
              <h1 className="text-4xl leading-[1.1] font-black tracking-tight md:text-6xl">
                Tvoj urnik izmen.
                <br />
                <span className="text-white" style={{ textShadow: '4px 4px 0 #1a1a1a' }}>Vedno pri roki.</span>
              </h1>
              <p className="mx-auto max-w-lg text-xl leading-relaxed font-medium opacity-90 md:mx-0">
                Preveri izmeno, sledi nadurom in načrtuj dopust – brez glavobolov.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row md:justify-start">
                <Button onClick={handleSignUp} size="lg" className="w-full transform shadow-neo transition-all hover:-translate-y-1 hover:shadow-neo-hover sm:w-auto">
                  Ustvari račun
                  {' '}
                  <ArrowRight size={20} />
                </Button>
                <Button onClick={handleSignIn} variant="secondary" size="lg" className="w-full sm:w-auto">
                  Prijava
                </Button>
              </div>
              <p className="text-sm font-medium text-gray-700">
                Registracija traja manj kot minuto.
              </p>
            </div>

            {/* Right: Live Roster Widget */}
            <div className="relative">
              <div className="absolute -inset-4 scale-105 rotate-3 transform rounded-3xl bg-black/5"></div>
              <div className="relative transform rounded-2xl border-2 border-black bg-white p-6 shadow-neo transition-transform duration-300 hover:scale-[1.01]">
                <div className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-neo-cyan" />
                    <h2 className="text-xl font-black">Kdo danes dela?</h2>
                  </div>
                  <span className="rounded bg-black px-2 py-1 text-sm font-bold text-white">
                    {format(today, 'EEE, d MMM', { locale: sl })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {groups.map((group) => {
                    const shiftCode = getShiftForDate(today, group);
                    const shiftDef = SHIFT_DEFINITIONS[shiftCode];

                    return (
                      <div key={group} className="group flex items-center gap-3 rounded-xl border-2 border-gray-100 p-3 transition-colors hover:border-black">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-lg font-black text-white shadow-sm transition-transform group-hover:scale-110">
                          {group}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            Skupina
                            {' '}
                            {group}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full border border-black ${shiftDef.color}`}></span>
                            <span className="font-bold">{shiftDef.labelSl}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 border-t-2 border-gray-100 pt-4 text-center">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Živo stanje
                  </p>
                </div>
              </div>

              {/* Floating Decor */}
              <div className="absolute -top-6 -right-6 hidden rotate-12 transform animate-float rounded-xl border-2 border-black bg-neo-pink p-3 shadow-neo md:block">
                <Calendar size={24} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black">Narejeno za naš urnik</h2>
          <p className="text-xl text-gray-600">Vse kar rabiš. Nič več.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1: Koledar izmen */}
          <div className="group rounded-2xl border-2 border-black bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-neo-cyan transition-transform group-hover:rotate-6">
              <Calendar size={32} />
            </div>
            <h3 className="mb-3 text-2xl font-black">Koledar izmen</h3>
            <p className="leading-relaxed font-medium text-gray-600">
              Vedno veš, kdaj delaš in kdo je na izmeni s teboj.
            </p>
          </div>

          {/* Card 2: Nadure */}
          <div className="group rounded-2xl border-2 border-black bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-neo-pink transition-transform group-hover:-rotate-6">
              <Coins size={32} />
            </div>
            <h3 className="mb-3 text-2xl font-black">Nadure na enem mestu</h3>
            <p className="leading-relaxed font-medium text-gray-600">
              Beleži si nadure. Izberi: plačilo ali prosti dnevi.
            </p>
          </div>

          {/* Card 3: Dopust in flex */}
          <div className="group rounded-2xl border-2 border-black bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-neo-violet transition-transform group-hover:rotate-12">
              <Umbrella size={32} />
            </div>
            <h3 className="mb-3 text-2xl font-black">Dopust in flex</h3>
            <p className="leading-relaxed font-medium text-gray-600">
              Načrtuj dopust in prosti dneve brez papirjev.
            </p>
          </div>
        </div>
      </section>

      {/* Why 4Shifter Section */}
      <section className="border-y-2 border-black bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full border-2 border-black bg-neo-pink p-4">
            <Heart size={32} />
          </div>
          <h2 className="mb-6 text-3xl font-black md:text-4xl">Zakaj 4Shifter?</h2>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-gray-700">
            4Shifter je naredil delavec za sodelavce.
            <br />
            Nobenih podjetij, nobenih naročnin, nobene prodaje.
            <br />
            <span className="font-bold text-black">Samo orodje, ki dela življenje v 4-izmenskem sistemu lažje.</span>
          </p>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-neo md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center justify-center rounded-xl border-2 border-black bg-neo-cyan p-3">
                <Shield size={28} />
              </div>
              <h2 className="mb-4 text-3xl font-black">Tvoji podatki, tvoja stvar</h2>
              <p className="text-lg font-medium text-gray-600">
                Varnost in zasebnost sta osnova. Brez skritih stroškov.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-neo-cyan" size={24} />
                <span className="text-lg font-bold">Podatki ostanejo pri tebi</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-neo-cyan" size={24} />
                <span className="text-lg font-bold">Brez oglasov, brez sledenja</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-neo-cyan" size={24} />
                <span className="text-lg font-bold">Brezplačno za vedno</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border-2 border-black bg-neo-yellow p-8 text-center shadow-neo md:p-16">
          <h2 className="mb-4 text-4xl font-black md:text-5xl">Pripravljeni?</h2>
          <p className="mb-8 text-xl font-medium opacity-90">
            Začni uporabljati 4Shifter danes.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={handleSignUp} size="lg" className="w-full transform shadow-neo transition-all hover:-translate-y-1 hover:shadow-neo-hover sm:w-auto">
              Ustvari račun
              {' '}
              <ArrowRight size={20} />
            </Button>
            <Button onClick={handleSignIn} variant="secondary" size="lg" className="w-full sm:w-auto">
              Prijava
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t-4 border-neo-cyan bg-neo-black py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-transparent bg-white font-black text-black">4</div>
            <span className="text-xl font-bold">4Shifter</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => router.push('/privacy')}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Politika zasebnosti
            </button>
            <button
              type="button"
              onClick={() => router.push('/terms')}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Pogoji uporabe
            </button>
          </div>
          <p className="font-mono text-sm text-gray-400">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            4Shifter
          </p>
        </div>
      </footer>

    </div>
  );
}
