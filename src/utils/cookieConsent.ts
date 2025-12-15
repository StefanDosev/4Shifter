const CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

// Utility function to check consent status
export function getCookieConsent(): ConsentStatus {
  if (typeof window === 'undefined') {
    return 'pending';
  }
  return (localStorage.getItem(CONSENT_KEY) as ConsentStatus) || 'pending';
}

// Utility to check if analytics should load
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'accepted';
}
