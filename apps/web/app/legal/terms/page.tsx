import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the FreightBridge Terms of Service governing use of our freight marketplace platform for shippers and carriers.",
};

const EFFECTIVE_DATE = "August 1, 2026";
const BROKER_NAME = process.env["NEXT_PUBLIC_BROKER_NAME"] ?? "Partner Broker LLC";
const BROKER_MC = process.env["NEXT_PUBLIC_BROKER_MC"] ?? "XXXXXX";

export default function TermsOfServicePage() {
  return (
    <article className="card p-8 md:p-12" aria-labelledby="tos-heading">
      {/* Header */}
      <header className="mb-10 border-b border-surface-border pb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
          Legal Document
        </div>
        <h1 id="tos-heading" className="text-3xl font-bold tracking-tight text-navy-900">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-content-muted">
          Effective Date: <strong>{EFFECTIVE_DATE}</strong> · Last Updated: <strong>{EFFECTIVE_DATE}</strong>
        </p>
        <p className="mt-4 text-sm text-content-secondary leading-relaxed">
          Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using the FreightBridge
          platform. By creating an account or using any part of the Service, you agree to be bound by
          these Terms.
        </p>
      </header>

      {/* Body */}
      <div className="prose-legal space-y-10 text-sm leading-relaxed text-content-secondary">

        <section aria-labelledby="tos-1">
          <h2 id="tos-1" className="mb-3 text-lg font-semibold text-navy-900">1. Parties and Platform Role</h2>
          <p>
            FreightBridge (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the Platform&rdquo;) is an
            independent agent of <strong>{BROKER_NAME}</strong>, an FMCSA-licensed property broker
            (MC#&nbsp;{BROKER_MC}). FreightBridge is a technology platform that facilitates the
            connection between shippers (&ldquo;Shippers&rdquo;) and motor carriers
            (&ldquo;Carriers&rdquo;). FreightBridge is <em>not</em> a licensed freight broker and does
            not act as the broker of record for any freight transaction. All binding freight
            contracts, rate confirmations, and broker-carrier agreements are entered into between
            the Shipper, the Carrier, and {BROKER_NAME}.
          </p>
        </section>

        <section aria-labelledby="tos-2">
          <h2 id="tos-2" className="mb-3 text-lg font-semibold text-navy-900">2. Eligibility and Account Registration</h2>
          <p>
            You must be at least 18 years of age and have the legal authority to enter into a
            binding agreement on behalf of yourself or your company. Carriers must hold a valid
            FMCSA-issued operating authority (MC number) in &ldquo;ACTIVE&rdquo; status at the
            time of each bid submission. Carriers holding only broker authority (no carrier
            authority) are not eligible to bid on loads through FreightBridge.
          </p>
          <p className="mt-3">
            You agree to provide accurate, current, and complete information during registration and
            to promptly update any information that changes. FreightBridge reserves the right to
            suspend or terminate accounts that contain false or outdated compliance information.
          </p>
        </section>

        <section aria-labelledby="tos-3">
          <h2 id="tos-3" className="mb-3 text-lg font-semibold text-navy-900">3. Carrier Compliance Vetting</h2>
          <p>
            Prior to allowing a bid submission, FreightBridge verifies each Carrier&rsquo;s FMCSA
            operating authority status through automated compliance checks. Carriers whose MC
            authority is INACTIVE, revoked, or classified as broker-only will be blocked from
            submitting bids. This check is performed at time of bid and does not guarantee
            continuous compliance monitoring. Shippers should independently verify carrier
            credentials before executing transport agreements.
          </p>
          <p className="mt-3">
            FreightBridge logs all blocked bid attempts in a compliance audit trail accessible to
            platform administrators, in accordance with applicable recordkeeping requirements.
          </p>
        </section>

        <section aria-labelledby="tos-4">
          <h2 id="tos-4" className="mb-3 text-lg font-semibold text-navy-900">4. Load Posting and Bidding</h2>
          <p>
            Shippers may post freight loads on the FreightBridge platform. Load postings must
            accurately describe the freight, including weight, dimensions, commodity type, and
            pickup and delivery requirements. Shippers are solely responsible for the accuracy of
            load information.
          </p>
          <p className="mt-3">
            Carriers submit bids that represent a binding offer to transport the described freight
            at the stated price. Acceptance of a bid by a Shipper constitutes the initiation of a
            freight booking routed through {BROKER_NAME} as the broker of record. All bids are
            subject to compliance verification prior to acceptance.
          </p>
        </section>

        <section aria-labelledby="tos-5">
          <h2 id="tos-5" className="mb-3 text-lg font-semibold text-navy-900">5. Fees and Payment</h2>
          <p>
            FreightBridge charges a platform booking fee (currently 10% of the total shipper cost)
            upon acceptance of a bid. This fee is charged to the Shipper&rsquo;s account and
            collected through the platform&rsquo;s payment processor. Carrier payouts are settled
            through the broker of record, {BROKER_NAME}, and are subject to the terms of the
            applicable broker-carrier agreement.
          </p>
          <p className="mt-3">
            All fees are disclosed at time of bid acceptance. FreightBridge does not collect or
            hold carrier funds; carrier payments flow through {BROKER_NAME}&rsquo;s licensed
            merchant accounts.
          </p>
        </section>

        <section aria-labelledby="tos-6">
          <h2 id="tos-6" className="mb-3 text-lg font-semibold text-navy-900">6. Prohibited Uses</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Re-brokering or re-tendering loads to another carrier without written consent from the Shipper and {BROKER_NAME}.</li>
            <li>Submitting bids under an MC number you do not own or have authority to operate under.</li>
            <li>Using the platform to facilitate any transaction that violates FMCSA regulations, federal, or state law.</li>
            <li>Scraping, crawling, or otherwise extracting platform data by automated means without express written permission.</li>
            <li>Providing materially false information in load postings, bids, or account registration.</li>
          </ul>
        </section>

        <section aria-labelledby="tos-7">
          <h2 id="tos-7" className="mb-3 text-lg font-semibold text-navy-900">7. Proof of Delivery and Dispute Resolution</h2>
          <p>
            Upon delivery, Carriers are required to upload a Proof of Delivery (POD) document via
            the platform within 48 hours of delivery completion. Failure to upload POD may result
            in delayed payment processing. In the event of a freight dispute, the parties should
            first attempt resolution directly. Unresolved disputes will be escalated to{" "}
            {BROKER_NAME} per the applicable broker-carrier agreement. FreightBridge is not a
            party to freight contracts and does not adjudicate cargo claims.
          </p>
        </section>

        <section aria-labelledby="tos-8">
          <h2 id="tos-8" className="mb-3 text-lg font-semibold text-navy-900">8. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, FREIGHTBRIDGE, ITS OFFICERS, DIRECTORS,
            EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM, INCLUDING
            BUT NOT LIMITED TO LOSS OF FREIGHT, CARGO DAMAGE, DELAYS, OR LOSS OF PROFITS. OUR
            TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE PLATFORM SHALL NOT EXCEED THE BOOKING
            FEES PAID BY YOU IN THE THREE (3) MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        <section aria-labelledby="tos-9">
          <h2 id="tos-9" className="mb-3 text-lg font-semibold text-navy-900">9. Termination</h2>
          <p>
            Either party may terminate access to the platform at any time. FreightBridge reserves
            the right to suspend or permanently terminate accounts for violations of these Terms,
            regulatory non-compliance, or fraudulent activity, with or without prior notice.
            Termination does not relieve any party of obligations arising from completed or pending
            freight transactions.
          </p>
        </section>

        <section aria-labelledby="tos-10">
          <h2 id="tos-10" className="mb-3 text-lg font-semibold text-navy-900">10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United States and the state in which{" "}
            {BROKER_NAME} is headquartered, without regard to conflict of law principles. Any
            disputes arising under these Terms shall be resolved through binding arbitration in
            accordance with the rules of the American Arbitration Association.
          </p>
        </section>

        <section aria-labelledby="tos-11">
          <h2 id="tos-11" className="mb-3 text-lg font-semibold text-navy-900">11. Changes to These Terms</h2>
          <p>
            FreightBridge reserves the right to update these Terms at any time. We will notify
            registered users of material changes via email or an in-platform notice at least 14
            days before changes take effect. Continued use of the platform after the effective date
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section aria-labelledby="tos-12">
          <h2 id="tos-12" className="mb-3 text-lg font-semibold text-navy-900">12. Contact</h2>
          <p>
            For questions about these Terms, please contact:{" "}
            <a href="mailto:legal@freightbridge.com" className="font-medium text-action hover:underline">
              legal@freightbridge.com
            </a>
          </p>
        </section>

      </div>
    </article>
  );
}
