'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

const CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

// Store for cookie consent
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('cookie-consent-changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('cookie-consent-changed', callback);
  };
}

function getSnapshot(): ConsentStatus {
  if (typeof window === 'undefined') {
    return 'pending';
  }
  return (localStorage.getItem(CONSENT_KEY) as ConsentStatus) || 'pending';
}

function getServerSnapshot(): ConsentStatus {
  return 'pending';
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: 'accepted' }));
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: 'rejected' }));
  };

  // Don't show banner if user already made a choice
  if (consent !== 'pending') {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t-4 border-black bg-white p-4 shadow-neo md:right-4 md:bottom-4 md:left-auto md:max-w-md md:rounded-xl md:border-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-black">🍪 Cookie Settings</h3>
          <p className="mb-4 text-sm text-gray-600">
            We use cookies to analyze site usage and improve your experience.
            You can accept or reject non-essential cookies.
            {' '}
            <Link href="/privacy" className="font-bold underline hover:text-neo-cyan">
              Learn more
            </Link>
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg border-2 border-black bg-neo-cyan px-4 py-2 font-bold shadow-neo-sm transition-all hover:-translate-y-0.5 hover:shadow-neo"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="rounded-lg border-2 border-black bg-white px-4 py-2 font-bold transition-all hover:bg-gray-100"
            >
              Reject Non-Essential
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReject}
          className="text-gray-400 transition-colors hover:text-black"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
