import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how FreightBridge collects, uses, and protects personal information for shippers, carriers, and platform users.",
};

const EFFECTIVE_DATE = "August 1, 2026";

export default function PrivacyPolicyPage() {
  return (
    <article className="card p-8 md:p-12" aria-labelledby="privacy-heading">
      {/* Header */}
      <header className="mb-10 border-b border-surface-border pb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Legal Document
        </div>
        <h1 id="privacy-heading" className="text-3xl font-bold tracking-tight text-navy-900">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-content-muted">
          Effective Date: <strong>{EFFECTIVE_DATE}</strong> · Last Updated: <strong>{EFFECTIVE_DATE}</strong>
        </p>
        <p className="mt-4 text-sm text-content-secondary leading-relaxed">
          FreightBridge is committed to protecting your privacy. This Privacy Policy describes
          what personal information we collect, how we use it, with whom we share it, and the
          choices you have regarding your information.
        </p>
      </header>

      <div className="space-y-10 text-sm leading-relaxed text-content-secondary">

        <section aria-labelledby="priv-1">
          <h2 id="priv-1" className="mb-3 text-lg font-semibold text-navy-900">1. Information We Collect</h2>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">1.1 Information You Provide</h3>
          <ul className="list-inside list-disc space-y-2">
            <li><strong>Account Information:</strong> Full name, company name, email address, phone number, and password (stored as a secure hash).</li>
            <li><strong>Carrier Compliance Data:</strong> MC number, DOT number, and operating authority status as declared during registration and as retrieved from FMCSA records.</li>
            <li><strong>Load Information:</strong> Freight details, addresses, commodity descriptions, and images uploaded by Shippers.</li>
            <li><strong>Bid Information:</strong> Bid amounts, messages, and correspondence between Carriers and Shippers on the platform.</li>
            <li><strong>Proof of Delivery:</strong> Documents and files uploaded by Carriers upon load completion.</li>
          </ul>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">1.2 Information Collected Automatically</h3>
          <ul className="list-inside list-disc space-y-2">
            <li><strong>Usage Data:</strong> Pages visited, features used, timestamps, and session duration.</li>
            <li><strong>Device and Log Data:</strong> IP address, browser type, operating system, and referring URLs.</li>
            <li><strong>Cookies and Local Storage:</strong> Authentication tokens and user preference settings. We do not use third-party advertising cookies.</li>
          </ul>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">1.3 Information from Third Parties</h3>
          <ul className="list-inside list-disc space-y-2">
            <li><strong>FMCSA / Compliance Databases:</strong> We query carrier operating authority status through FMCSA-linked services to verify eligibility to bid.</li>
            <li><strong>Payment Processors:</strong> Payment-related data is processed by our payment service provider. We do not store full credit card numbers on our servers.</li>
          </ul>
        </section>

        <section aria-labelledby="priv-2">
          <h2 id="priv-2" className="mb-3 text-lg font-semibold text-navy-900">2. How We Use Your Information</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>To operate and improve the FreightBridge platform and its features.</li>
            <li>To verify carrier compliance status before permitting bid submissions.</li>
            <li>To process freight bookings, fees, and carrier payouts through our licensed broker partner.</li>
            <li>To generate and maintain compliance ledger records as required by applicable law.</li>
            <li>To send transactional notifications (bid updates, booking confirmations, payment receipts).</li>
            <li>To detect and prevent fraud, abuse, and violations of our Terms of Service.</li>
            <li>To respond to support requests and communicate changes to our platform or policies.</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to third parties. We do not use your
            information for behavioral advertising or data brokerage.
          </p>
        </section>

        <section aria-labelledby="priv-3">
          <h2 id="priv-3" className="mb-3 text-lg font-semibold text-navy-900">3. How We Share Your Information</h2>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">3.1 Within a Freight Transaction</h3>
          <p>
            When a bid is accepted, certain Carrier and Shipper information (company name, contact
            details, MC number) is shared with the counterparty to facilitate the freight transaction.
            This is necessary for the performance of the contract.
          </p>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">3.2 With Our Licensed Broker Partner</h3>
          <p>
            Load, Shipper, and Carrier data for accepted bookings is transmitted to our partner
            licensed broker&rsquo;s Transportation Management System (TMS) as required for legal
            brokerage recordkeeping and regulatory compliance.
          </p>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">3.3 Service Providers</h3>
          <p>
            We engage trusted third-party vendors (hosting, payment processing, email delivery,
            compliance data APIs) who access your data only as necessary to perform services on
            our behalf and are bound by data processing agreements.
          </p>

          <h3 className="mb-2 mt-4 font-semibold text-content-primary">3.4 Legal Requirements</h3>
          <p>
            We may disclose your information if required by law, subpoena, court order, or
            regulatory authority, or if we believe disclosure is necessary to protect the rights,
            property, or safety of FreightBridge, our users, or the public.
          </p>
        </section>

        <section aria-labelledby="priv-4">
          <h2 id="priv-4" className="mb-3 text-lg font-semibold text-navy-900">4. Data Retention</h2>
          <p>
            We retain account information for as long as your account is active and for a
            reasonable period thereafter to enable account recovery, resolve disputes, and comply
            with legal obligations. Compliance ledger entries and audit logs are retained for a
            minimum of seven (7) years in accordance with DOT and FMCSA recordkeeping
            requirements. Ledger records are append-only and cannot be altered after creation.
          </p>
        </section>

        <section aria-labelledby="priv-5">
          <h2 id="priv-5" className="mb-3 text-lg font-semibold text-navy-900">5. Data Security</h2>
          <p>
            We implement industry-standard security measures including TLS encryption in transit,
            bcrypt password hashing, JWT-based authentication with short-lived tokens, and
            role-based access controls that limit data access to authorized personnel only.
          </p>
          <p className="mt-3">
            No method of electronic transmission or storage is 100% secure. In the event of a
            data breach affecting your information, we will notify you as required by applicable law.
          </p>
        </section>

        <section aria-labelledby="priv-6">
          <h2 id="priv-6" className="mb-3 text-lg font-semibold text-navy-900">6. Your Rights and Choices</h2>
          <ul className="list-inside list-disc space-y-2">
            <li><strong>Access and Correction:</strong> You may review and update your account information at any time from your profile settings.</li>
            <li><strong>Account Deletion:</strong> You may request deletion of your account by contacting us at privacy@freightbridge.com. Note that certain records (compliance ledger entries) cannot be deleted due to regulatory retention requirements.</li>
            <li><strong>Data Portability:</strong> You may request a copy of the personal data we hold about you in a structured, machine-readable format.</li>
            <li><strong>Opt-Out of Marketing:</strong> We do not send marketing emails by default. Any promotional communications will include an unsubscribe link.</li>
          </ul>
          <p className="mt-3">
            California residents may have additional rights under the CCPA. Please contact us at{" "}
            <a href="mailto:privacy@freightbridge.com" className="font-medium text-action hover:underline">
              privacy@freightbridge.com
            </a>{" "}
            to exercise any privacy rights.
          </p>
        </section>

        <section aria-labelledby="priv-7">
          <h2 id="priv-7" className="mb-3 text-lg font-semibold text-navy-900">7. Cookies</h2>
          <p>
            FreightBridge uses strictly necessary cookies and browser local storage to maintain
            your authenticated session. We do not use tracking or advertising cookies. You may
            clear local storage through your browser settings, which will log you out of the
            platform.
          </p>
        </section>

        <section aria-labelledby="priv-8">
          <h2 id="priv-8" className="mb-3 text-lg font-semibold text-navy-900">8. Children&rsquo;s Privacy</h2>
          <p>
            The FreightBridge platform is intended for use by business professionals aged 18 and
            older. We do not knowingly collect personal information from individuals under the age
            of 18. If you believe a minor has provided us with personal information, please contact
            us immediately.
          </p>
        </section>

        <section aria-labelledby="priv-9">
          <h2 id="priv-9" className="mb-3 text-lg font-semibold text-navy-900">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of material changes
            by posting the updated policy with a new effective date and sending an email to
            registered users. Your continued use of the platform following the effective date
            constitutes acceptance of the revised policy.
          </p>
        </section>

        <section aria-labelledby="priv-10">
          <h2 id="priv-10" className="mb-3 text-lg font-semibold text-navy-900">10. Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or your personal data,
            please contact our Privacy Team at:{" "}
            <a href="mailto:privacy@freightbridge.com" className="font-medium text-action hover:underline">
              privacy@freightbridge.com
            </a>
          </p>
        </section>

      </div>
    </article>
  );
}
