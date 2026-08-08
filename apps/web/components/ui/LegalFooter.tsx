/**
 * LegalFooter — persistent on every page.
 *
 * Reads NEXT_PUBLIC_BROKER_NAME, NEXT_PUBLIC_BROKER_MC, NEXT_PUBLIC_BROKER_DOT
 * from environment variables so the real broker details can be filled in
 * without a code change once the broker partnership is signed.
 *
 * This is a Server Component — safe to use in root layout.tsx.
 */

const BROKER_NAME = process.env["NEXT_PUBLIC_BROKER_NAME"] ?? "Partner Broker LLC";
const BROKER_MC = process.env["NEXT_PUBLIC_BROKER_MC"] ?? "XXXXXX";
const BROKER_DOT = process.env["NEXT_PUBLIC_BROKER_DOT"] ?? "XXXXXXX";

export function LegalFooter() {
  return (
    <footer className="mt-auto border-t border-surface-border bg-navy-900 text-white">
      <div className="page-container py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Brand mark */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">FreightBridge</span>
            <span className="hidden text-navy-400 md:inline">|</span>
            <span className="hidden text-xs text-navy-300 md:inline">Independent Agent</span>
          </div>

          {/* Legal disclosure — required on every page */}
          <p className="max-w-2xl text-center text-xs leading-relaxed text-navy-300 md:text-right">
            FreightBridge is an independent agent of{" "}
            <strong className="font-semibold text-white">{BROKER_NAME}</strong>, an FMCSA licensed
            property broker (MC#&nbsp;{BROKER_MC}, USDOT#&nbsp;{BROKER_DOT}). All transport
            agreements are executed between the customer and{" "}
            <strong className="font-semibold text-white">{BROKER_NAME}</strong>.
          </p>
        </div>

        {/* Secondary links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-navy-800 pt-4 text-xs text-navy-400 md:justify-start">
          <span>© {new Date().getFullYear()} FreightBridge</span>
          <a href="/legal/terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="/legal/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/legal/broker-disclosure" className="hover:text-white transition-colors">
            Broker Disclosure
          </a>
        </div>
      </div>
    </footer>
  );
}
