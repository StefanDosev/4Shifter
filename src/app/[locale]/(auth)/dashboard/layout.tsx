import { SignOutButton } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'DashboardLayout' });

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href="/dashboard"
              className="font-bold decoration-2 underline-offset-4 hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/user-profile"
              className="font-bold decoration-2 underline-offset-4 hover:underline"
            >
              {t('user_profile_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/settings"
              className="font-bold decoration-2 underline-offset-4 hover:underline"
            >
              Settings
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <>
          <li>
            <SignOutButton>
              <button
                type="button"
                className="font-bold decoration-2 underline-offset-4 hover:underline"
              >
                {t('sign_out')}
              </button>
            </SignOutButton>
          </li>
          <li>
            <LocaleSwitcher />
          </li>
        </>
      )}
    >
      {props.children}
    </BaseTemplate>
  );
}
