import type { LocalizationResource } from '@clerk/types';
import { enUS } from '@clerk/localizations';

const supportedLocales: Record<string, LocalizationResource> = {
  en: enUS,
};

export const ClerkLocalizations = {
  defaultLocale: enUS,
  supportedLocales,
};
