'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, useRef, useState } from 'react';
import { Env } from '@/libs/Env';
import { hasAnalyticsConsent } from '@/utils/cookieConsent';
import { SuspendedPostHogPageView } from './PostHogPageView';

export const PostHogProvider = (props: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const initAttempted = useRef(false);

  useEffect(() => {
    const initPostHog = () => {
      if (Env.NEXT_PUBLIC_POSTHOG_KEY && hasAnalyticsConsent() && !initAttempted.current) {
        initAttempted.current = true;
        posthog.init(Env.NEXT_PUBLIC_POSTHOG_KEY, {
          api_host: Env.NEXT_PUBLIC_POSTHOG_HOST,
          capture_pageview: false,
          capture_pageleave: true,
        });
        setIsInitialized(true);
      }
    };

    // Try to initialize on mount if consent already given
    initPostHog();

    // Listen for consent changes
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail === 'accepted') {
        initPostHog();
      }
    };

    window.addEventListener('cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  if (!Env.NEXT_PUBLIC_POSTHOG_KEY || !isInitialized) {
    return props.children;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {props.children}
    </PHProvider>
  );
};
