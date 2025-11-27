'use client';

import { Navbar } from '@/components/Navbar';
import { AppConfig } from '@/utils/AppConfig';

export const BaseTemplate = ({
  leftNav,
  rightNav,
  children,
}: {
  leftNav: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex min-h-screen w-full flex-col px-3 text-neo-black antialiased">
      <div className="mx-auto flex w-full max-w-screen-lg flex-1 flex-col">

        {/* NAVBAR */}
        <Navbar leftNav={leftNav} rightNav={rightNav} />

        {/* PAGE CONTENT */}
        <main className="flex-1 py-8">{children}</main>

        {/* FOOTER */}
        <footer className="border-t-2 border-neo-black bg-neo-white py-8 text-center text-sm font-medium">
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          {AppConfig.name}
          . All rights reserved.
        </footer>
      </div>
    </div>
  );
};
