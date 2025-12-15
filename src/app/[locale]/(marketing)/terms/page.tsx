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
    namespace: 'Terms',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-neo-white">
      <div className="sticky top-0 z-40 bg-white">
        <Navbar />
      </div>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-4xl font-black">Terms of Service</h1>

        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-gray-600">
            <strong>Last updated:</strong>
            {' '}
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-black">1. Introduction</h2>
            <p>
              Welcome to 4Shifter. By using our service, you agree to these Terms of Service.
              Please read them carefully before using the application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">2. Service Description</h2>
            <p>
              4Shifter is a shift management tool designed for employees working on a 4-shift
              rotation schedule. The service allows you to:
            </p>
            <ul className="list-disc pl-6">
              <li>View your shift schedule</li>
              <li>Track overtime hours and compensation time</li>
              <li>Manage vacation and flex time balances</li>
              <li>Plan around your work schedule</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">3. Account Registration</h2>
            <p>
              To use 4Shifter, you must create an account using a valid email address.
              You are responsible for:
            </p>
            <ul className="list-disc pl-6">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate information during registration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Transmit any malware or harmful code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black">5. Data Accuracy</h2>
            <p>
              While we strive to provide accurate shift calculations, 4Shifter is provided
              as a planning tool. The official source of truth for your work schedule is
              your employer&apos;s official roster system. We are not responsible for any
              discrepancies between our calculations and official records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">6. Intellectual Property</h2>
            <p>
              The 4Shifter service, including its design, features, and content, is protected
              by intellectual property rights. You may not copy, modify, or distribute any
              part of the service without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, 4Shifter and its operators shall not
              be liable for any indirect, incidental, special, consequential, or punitive
              damages arising from your use of the service.
            </p>
            <p>
              The service is provided &quot;as is&quot; without warranties of any kind, either
              express or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">8. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users
              of significant changes via email or through the application. Continued use
              of the service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">9. Termination</h2>
            <p>
              We may terminate or suspend your access to the service at any time, with or
              without cause, with or without notice. You may also delete your account at
              any time through your profile settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Republic of Slovenia. Any disputes
              arising from these Terms or your use of the service shall be subject to the
              exclusive jurisdiction of the courts of Slovenia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">11. Contact</h2>
            <p>
              For questions about these Terms, please contact us at:
              <br />
              Email:
              {' '}
              <a href="mailto:support@example.com" className="text-neo-cyan underline">support@example.com</a>
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
