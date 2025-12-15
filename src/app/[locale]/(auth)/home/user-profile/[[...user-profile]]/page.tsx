import type { Metadata } from 'next';
import { UserProfile } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCurrentUser } from '@/actions/UserActions';

import { ProfileForm } from '@/components/Profile/ProfileForm';
import { getI18nPath } from '@/utils/Helpers';

type IUserProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IUserProfilePageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
  };
}

export default async function UserProfilePage(props: IUserProfilePageProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const user = await getCurrentUser();

  return (
    <div className="my-6">
      <div className="mb-8">
        <ProfileForm user={user} />
      </div>

      <div className="-ml-16">
        <UserProfile
          path={getI18nPath('/home/user-profile', locale)}
        />
      </div>
    </div>
  );
};
