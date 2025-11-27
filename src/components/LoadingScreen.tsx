import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white">

      {/* Background Geometric Ripples */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* Square 1 */}
        <div className="absolute h-[800px] w-[800px] animate-square-pop border-[20px] border-neo-yellow opacity-0"></div>
        {/* Square 2 */}
        <div className="absolute h-[800px] w-[800px] animate-square-pop border-[20px] border-neo-cyan opacity-0" style={{ animationDelay: '0.5s' }}></div>
        {/* Square 3 */}
        <div className="absolute h-[800px] w-[800px] animate-square-pop border-[20px] border-neo-pink opacity-0" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* The Spinning 4 Card */}
        <div className="relative">
          {/* Decorative shadow card behind */}
          <div className="absolute top-4 left-4 h-32 w-32 rounded-none bg-neo-black"></div>

          {/* Main Card */}
          <div className="relative z-10 flex h-32 w-32 items-center justify-center border-4 border-black bg-white shadow-none">
            <div className="origin-center animate-spin-step">
              <span className="block text-8xl font-black text-black">4</span>
            </div>
          </div>

          {/* Small decorative badge */}
          <div className="absolute -top-4 -right-4 z-20 border-2 border-black bg-neo-yellow px-2 py-1 text-xs font-bold shadow-neo-sm">
            SYNCING
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-16 text-center">
        <h2 className="mb-4 text-2xl font-black tracking-widest text-black uppercase">
          Loading Data
        </h2>

        {/* Waving Dots - Rectangular Style */}
        <div className="flex justify-center gap-4">
          <div className="h-4 w-4 animate-bounce bg-neo-black" style={{ animationDelay: '0s' }}></div>
          <div className="h-4 w-4 animate-bounce border-2 border-black bg-neo-cyan" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-4 w-4 animate-bounce border-2 border-black bg-neo-pink" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};
