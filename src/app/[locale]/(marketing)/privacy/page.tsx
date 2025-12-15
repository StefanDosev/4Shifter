import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Privacy',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neo-white">
      <div className="sticky top-0 z-40 bg-white">
        <Navbar />
      </div>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-black">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-600">
            <strong>Last updated:</strong>
            {' '}
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-black">1. Data Controller</h2>
            <p>
              <strong>[YOUR COMPANY NAME]</strong>
              <br />
              [Your Address]
              <br />
              [City, Postal Code]
              <br />
              Slovenia
              <br />
              Email:
              {' '}
              <a href="mailto:privacy@example.com" className="text-neo-cyan underline">privacy@example.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">2. Data We Collect</h2>
            <p>We collect and process the following categories of personal data:</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Account Information:</strong>
                {' '}
                Email address, name (if provided), and authentication data through Clerk.
              </li>
              <li>
                <strong>Shift Data:</strong>
                {' '}
                Your shift group assignment, overtime records, and leave balances.
              </li>
              <li>
                <strong>Usage Data:</strong>
                {' '}
                Information about how you use our service (only if you consent to analytics cookies).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">3. Purpose and Legal Basis</h2>
            <p>We process your data for the following purposes:</p>
            <table className="w-full border-collapse border-2 border-black">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-2 border-black p-3 text-left">Purpose</th>
                  <th className="border-2 border-black p-3 text-left">Legal Basis (GDPR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-2 border-black p-3">User authentication</td>
                  <td className="border-2 border-black p-3">Contract performance (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="border-2 border-black p-3">Shift schedule management</td>
                  <td className="border-2 border-black p-3">Contract performance (Art. 6(1)(b))</td>
                </tr>
                <tr>
                  <td className="border-2 border-black p-3">Analytics (if consented)</td>
                  <td className="border-2 border-black p-3">Consent (Art. 6(1)(a))</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-2xl font-black">4. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active.
              If you delete your account, your data will be removed within 30 days,
              except where we are legally required to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">5. Your Rights</h2>
            <p>Under GDPR and Slovenian data protection law (ZVOP-2), you have the right to:</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Access</strong>
                {' '}
                your personal data
              </li>
              <li>
                <strong>Rectify</strong>
                {' '}
                inaccurate data
              </li>
              <li>
                <strong>Erase</strong>
                {' '}
                your data (&quot;right to be forgotten&quot;)
              </li>
              <li>
                <strong>Export</strong>
                {' '}
                your data (data portability)
              </li>
              <li>
                <strong>Object</strong>
                {' '}
                to processing
              </li>
              <li>
                <strong>Withdraw consent</strong>
                {' '}
                at any time
              </li>
            </ul>
            <p>
              To exercise these rights, contact us at
              {' '}
              <a href="mailto:privacy@example.com" className="text-neo-cyan underline">privacy@example.com</a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">6. Cookies</h2>
            <p>
              We use strictly necessary cookies for authentication. Analytics cookies
              are only used with your explicit consent. You can manage your preferences
              via the cookie banner.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">7. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Clerk</strong>
                {' '}
                - Authentication (
                <a href="https://clerk.com/privacy" className="text-neo-cyan underline">Privacy Policy</a>
                )
              </li>
              <li>
                <strong>PostHog</strong>
                {' '}
                - Analytics (only if consented) (
                <a href="https://posthog.com/privacy" className="text-neo-cyan underline">Privacy Policy</a>
                )
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">8. Complaints</h2>
            <p>
              If you believe your data protection rights have been violated, you may
              file a complaint with the Information Commissioner of the Republic of Slovenia:
            </p>
            <p>
              <strong>Informacijski pooblaščenec</strong>
              <br />
              Dunajska cesta 22, 1000 Ljubljana
              <br />
              Email: gp.ip@ip-rs.si
              <br />
              Website:
              {' '}
              <a href="https://www.ip-rs.si" className="text-neo-cyan underline">www.ip-rs.si</a>
            </p>
          </section>

          <div className="mt-12 border-t-2 border-gray-200 pt-8">
            <Link href="/" className="font-bold text-neo-cyan underline hover:text-neo-black">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
