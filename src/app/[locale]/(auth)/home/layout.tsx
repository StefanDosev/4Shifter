import { SignOutButton } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default async function HomeLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'HomeLayout' });

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href="/home"
              className="font-bold decoration-2 underline-offset-4 hover:underline"
            >
              {t('dashboard_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/home/user-profile"
              className="font-bold decoration-2 underline-offset-4 hover:underline"
            >
              {t('user_profile_link')}
            </Link>
          </li>
          <li>
            <Link
              href="/home/settings"
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
