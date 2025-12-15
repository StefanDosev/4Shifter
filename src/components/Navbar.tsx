'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppConfig } from '@/utils/AppConfig';

type NavbarProps = {
  leftNav?: React.ReactNode;
  rightNav?: React.ReactNode;
};

export const Navbar = ({ leftNav, rightNav }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo Section */}
        <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105">
          <Link href="/home" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-neo-yellow text-xl font-black shadow-sm">
              4
            </div>
            <span className="text-2xl font-black tracking-tight text-neo-black">
              {AppConfig.name}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-lg font-bold md:flex">
          <ul className="flex items-center gap-6">
            {leftNav}
          </ul>
          <ul className="flex items-center gap-4">
            {rightNav}
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border-2 border-black bg-neo-white p-2 hover:bg-gray-100 md:hidden"
          type="button"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-black transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-black transition-opacity ${open ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-black transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="border-t-2 border-black bg-white p-4 md:hidden">
          <ul className="flex flex-col space-y-4 text-lg font-bold">
            {leftNav}
            <div className="my-2 h-px bg-gray-200" />
            {rightNav}
          </ul>
        </nav>
      )}
    </header>
  );
};
