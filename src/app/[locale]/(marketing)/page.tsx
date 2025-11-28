'use client';

import type { ShiftGroup } from '@/types';
import { ArrowRight, Calendar, Clock, Coins, Shield, Users } from 'lucide-react';
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
    setMounted(true);
  }, []);

  const handleEnterApp = () => {
    setIsLoading(true);
    // Simulate loading delay for effect, then navigate
    setTimeout(() => {
      router.push('/home');
    }, 1500);
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
                onClick={() => router.push('/about')}
                className="mr-4 hidden font-bold decoration-2 underline-offset-4 hover:underline sm:block"
              >
                About
              </button>
              <button
                onClick={() => router.push('/sign-in')}
                className="mr-4 hidden font-bold decoration-2 underline-offset-4 hover:underline sm:block"
              >
                Log In
              </button>
              <Button onClick={() => router.push('/sign-up')} size="sm" className="hidden sm:flex">
                Sign Up
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
                👋 Team Portal & Family Sync
              </div>
              <h1 className="text-5xl leading-[1.0] font-black tracking-tight md:text-7xl">
                Stay in Sync
                {' '}
                <br />
                <span className="text-white text-shadow-black" style={{ textShadow: '4px 4px 0 #1a1a1a' }}>Without The Chaos.</span>
              </h1>
              <p className="mx-auto max-w-lg text-xl leading-relaxed font-medium opacity-90 md:mx-0">
                A simple, private tool to check the roster, track overtime, and plan family time around the 4-shift cycle.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row md:justify-start">
                <Button onClick={handleEnterApp} size="lg" className="w-full transform shadow-neo transition-all hover:-translate-y-1 hover:shadow-neo-hover sm:w-auto">
                  Open My Calendar
                  {' '}
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>

            {/* Right: Live Roster Widget */}
            <div className="relative">
              <div className="absolute -inset-4 scale-105 rotate-3 transform rounded-3xl bg-black/5"></div>
              <div className="relative transform rounded-2xl border-2 border-black bg-white p-6 shadow-neo transition-transform duration-300 hover:scale-[1.01]">
                <div className="mb-6 flex items-center justify-between border-b-2 border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="text-neo-cyan" />
                    <h2 className="text-xl font-black">Who is working today?</h2>
                  </div>
                  <span className="rounded bg-black px-2 py-1 text-sm font-bold text-white">
                    {today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
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
                            Group
                            {group}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full border border-black ${shiftDef.color}`}></span>
                            <span className="font-bold">{shiftDef.labelEn}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 border-t-2 border-gray-100 pt-4 text-center">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Live Status
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
          <h2 className="mb-4 text-4xl font-black">Built for our schedule</h2>
          <p className="text-xl text-gray-600">Everything you need, nothing you don't.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl border-2 border-black bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-neo-cyan transition-transform group-hover:rotate-6">
              <Users size={32} />
            </div>
            <h3 className="mb-3 text-2xl font-black">Family Access</h3>
            <p className="leading-relaxed font-medium text-gray-600">
              Mom can check if you're working night shift without asking. Just share the link.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border-2 border-black bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-neo-pink transition-transform group-hover:-rotate-6">
              <Coins size={32} />
            </div>
            <h3 className="mb-3 text-2xl font-black">Track "Nadure"</h3>
            <p className="leading-relaxed font-medium text-gray-600">
              Keep a personal log of extra hours and banked time. Don't rely on memory alone.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border-2 border-black bg-white p-8 shadow-neo transition-all duration-300 hover:-translate-y-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-black bg-neo-violet transition-transform group-hover:rotate-12">
              <Shield size={32} />
            </div>
            <h3 className="mb-3 text-2xl font-black">Private & Local</h3>
            <p className="leading-relaxed font-medium text-gray-600">
              Data stays on your browser. No login required for basic checking.
            </p>
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
          <p className="font-mono text-sm text-gray-400">
            Internal Tool •
            {' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>

    </div>
  );
}
