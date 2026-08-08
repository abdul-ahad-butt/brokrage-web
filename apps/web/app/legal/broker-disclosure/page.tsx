import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Broker Disclosure",
  description:
    "FreightBridge broker disclosure statement — FMCSA licensing information, agent relationship, and regulatory compliance details.",
};

const EFFECTIVE_DATE = "August 1, 2026";
const BROKER_NAME = process.env["NEXT_PUBLIC_BROKER_NAME"] ?? "Partner Broker LLC";
const BROKER_MC = process.env["NEXT_PUBLIC_BROKER_MC"] ?? "XXXXXX";
const BROKER_DOT = process.env["NEXT_PUBLIC_BROKER_DOT"] ?? "XXXXXXX";

export default function BrokerDisclosurePage() {
  return (
    <article className="card p-8 md:p-12" aria-labelledby="disclosure-heading">
      {/* Header */}
      <header className="mb-10 border-b border-surface-border pb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
          Regulatory Disclosure
        </div>
        <h1 id="disclosure-heading" className="text-3xl font-bold tracking-tight text-navy-900">
          Broker Disclosure Statement
        </h1>
        <p className="mt-3 text-sm text-content-muted">
          Effective Date: <strong>{EFFECTIVE_DATE}</strong> · Last Updated: <strong>{EFFECTIVE_DATE}</strong>
        </p>
        <p className="mt-4 text-sm text-content-secondary leading-relaxed">
          This Broker Disclosure Statement is provided in compliance with applicable federal
          regulations governing licensed freight brokerage activities and to ensure full
          transparency about the legal structure through which freight services are arranged on
          the FreightBridge platform.
        </p>
      </header>

      {/* Highlighted disclosure box */}
      <div className="mb-10 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-amber-900">Required FMCSA Disclosure</p>
            <p className="mt-1 text-sm text-amber-800 leading-relaxed">
              FreightBridge is an independent agent of{" "}
              <strong>{BROKER_NAME}</strong>, an FMCSA-licensed property broker
              (MC#&nbsp;{BROKER_MC}, USDOT#&nbsp;{BROKER_DOT}). All transport agreements are
              executed between the customer and <strong>{BROKER_NAME}</strong>. FreightBridge
              does not hold a freight broker license and does not act as broker of record.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-sm leading-relaxed text-content-secondary">

        <section aria-labelledby="disc-1">
          <h2 id="disc-1" className="mb-3 text-lg font-semibold text-navy-900">1. Broker of Record</h2>
          <p>
            All freight brokerage services facilitated through the FreightBridge platform are
            performed by and in the name of <strong>{BROKER_NAME}</strong>, which holds the
            following federal operating authority:
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-surface-border">
            <table className="w-full text-sm" aria-label="Broker licensing details">
              <tbody>
                <tr className="border-b border-surface-border">
                  <td className="bg-surface-muted px-4 py-3 font-semibold text-content-primary w-1/3">Licensed Broker</td>
                  <td className="px-4 py-3 text-content-secondary">{BROKER_NAME}</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="bg-surface-muted px-4 py-3 font-semibold text-content-primary">FMCSA MC Number</td>
                  <td className="px-4 py-3 font-mono text-content-secondary">MC-{BROKER_MC}</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="bg-surface-muted px-4 py-3 font-semibold text-content-primary">USDOT Number</td>
                  <td className="px-4 py-3 font-mono text-content-secondary">{BROKER_DOT}</td>
                </tr>
                <tr className="border-b border-surface-border">
                  <td className="bg-surface-muted px-4 py-3 font-semibold text-content-primary">Authority Type</td>
                  <td className="px-4 py-3 text-content-secondary">Property Broker</td>
                </tr>
                <tr>
                  <td className="bg-surface-muted px-4 py-3 font-semibold text-content-primary">Authority Status</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-active">Active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-content-muted">
            You may verify this information independently on the{" "}
            <a
              href="https://ai.fmcsa.dot.gov/SMS"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-action hover:underline"
            >
              FMCSA Safety Measurement System (SMS)
            </a>{" "}
            or the{" "}
            <a
              href="https://safer.fmcsa.dot.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-action hover:underline"
            >
              FMCSA SAFER System
            </a>
            .
          </p>
        </section>

        <section aria-labelledby="disc-2">
          <h2 id="disc-2" className="mb-3 text-lg font-semibold text-navy-900">2. Role of FreightBridge</h2>
          <p>
            FreightBridge operates as an independent agent on behalf of {BROKER_NAME}. FreightBridge&rsquo;s role
            is limited to providing a technology platform that:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>Allows Shippers to post freight loads for competitive bidding.</li>
            <li>Allows Carriers to discover available loads and submit bids.</li>
            <li>Verifies Carrier operating authority status prior to permitting bid submissions.</li>
            <li>Routes confirmed bookings to {BROKER_NAME}&rsquo;s Transportation Management System for legal execution of the broker-carrier agreement.</li>
            <li>Maintains a compliance ledger and audit trail of all transactions in accordance with regulatory requirements.</li>
          </ul>
          <p className="mt-4">
            FreightBridge does <strong>not</strong>:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2">
            <li>Hold, solicit, or execute freight contracts in its own name.</li>
            <li>Act as a carrier or assume liability for freight in transit.</li>
            <li>Collect or hold carrier payment funds in its own accounts.</li>
            <li>Represent itself as a licensed freight broker in any communication, contract, or document.</li>
          </ul>
        </section>

        <section aria-labelledby="disc-3">
          <h2 id="disc-3" className="mb-3 text-lg font-semibold text-navy-900">3. Carrier Agreements</h2>
          <p>
            Upon acceptance of a bid through the FreightBridge platform, a broker-carrier
            agreement is executed between the Carrier and <strong>{BROKER_NAME}</strong> as the
            broker of record. The terms of this agreement include rate confirmation, liability
            allocation, cargo insurance requirements, and proof-of-delivery obligations. Copies
            of applicable broker-carrier agreement templates are available from{" "}
            {BROKER_NAME} upon request.
          </p>
          <p className="mt-3">
            Carriers must maintain active FMCSA operating authority (MC number in ACTIVE status)
            and all required insurance coverages (including cargo liability and general liability)
            at the time of each load acceptance and throughout the duration of transport.
          </p>
        </section>

        <section aria-labelledby="disc-4">
          <h2 id="disc-4" className="mb-3 text-lg font-semibold text-navy-900">4. Shipper Agreements</h2>
          <p>
            By accepting a carrier&rsquo;s bid on the FreightBridge platform, Shippers enter
            into a freight service agreement with <strong>{BROKER_NAME}</strong> as the
            arranging broker. FreightBridge is not a party to this agreement. Shippers agree
            that:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>The freight description, weight, dimensions, and commodity information they provide are accurate and complete.</li>
            <li>The arranged Carrier is an independent contractor and not an employee or agent of FreightBridge or {BROKER_NAME}.</li>
            <li>Cargo claims must be filed directly with the Carrier or their insurer, in accordance with 49 U.S.C. § 14706 (Carmack Amendment).</li>
          </ul>
        </section>

        <section aria-labelledby="disc-5">
          <h2 id="disc-5" className="mb-3 text-lg font-semibold text-navy-900">5. Anti-Double-Brokering Policy</h2>
          <p>
            FreightBridge actively enforces a strict anti-double-brokering policy. Carriers who
            hold only broker authority (and no carrier operating authority) are blocked from
            submitting bids at the point of bid submission. All blocked attempts are logged in
            a compliance audit trail and flagged for review by our operations team.
          </p>
          <p className="mt-3">
            Any Carrier found to have re-tendered a load to a third-party carrier without the
            express written consent of the Shipper and {BROKER_NAME} will be immediately
            suspended from the platform and reported to the FMCSA where warranted.
          </p>
        </section>

        <section aria-labelledby="disc-6">
          <h2 id="disc-6" className="mb-3 text-lg font-semibold text-navy-900">6. Platform Fees and Financial Flows</h2>
          <p>
            FreightBridge charges a booking fee upon bid acceptance. This fee is disclosed to
            the Shipper at the time of bid acceptance confirmation before any charge is
            processed. Carrier payouts for completed loads are settled by{" "}
            {BROKER_NAME} per the applicable broker-carrier agreement. FreightBridge does not
            retain carrier funds at any point in the payment flow.
          </p>
        </section>

        <section aria-labelledby="disc-7">
          <h2 id="disc-7" className="mb-3 text-lg font-semibold text-navy-900">7. Regulatory Recordkeeping</h2>
          <p>
            In compliance with 49 CFR Part 371 (Broker Regulations) and applicable FMCSA
            requirements, all transaction records facilitated through FreightBridge are
            transmitted to and maintained by {BROKER_NAME} for the federally required retention
            period. FreightBridge independently maintains an immutable compliance ledger and
            audit log for all bookings executed through the platform.
          </p>
        </section>

        <section aria-labelledby="disc-8">
          <h2 id="disc-8" className="mb-3 text-lg font-semibold text-navy-900">8. Contact and Complaints</h2>
          <p>
            For questions about the broker relationship, licensing, or to report a compliance
            concern:
          </p>
          <div className="mt-4 space-y-2">
            <p>
              <strong>FreightBridge Operations:</strong>{" "}
              <a href="mailto:compliance@freightbridge.com" className="font-medium text-action hover:underline">
                compliance@freightbridge.com
              </a>
            </p>
            <p>
              <strong>Broker of Record ({BROKER_NAME}):</strong>{" "}
              <a href="mailto:broker@freightbridge.com" className="font-medium text-action hover:underline">
                broker@freightbridge.com
              </a>
            </p>
            <p>
              <strong>FMCSA National Consumer Complaint Database:</strong>{" "}
              <a
                href="https://nccdb.fmcsa.dot.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-action hover:underline"
              >
                nccdb.fmcsa.dot.gov
              </a>
            </p>
          </div>
        </section>

      </div>
    </article>
  );
}
