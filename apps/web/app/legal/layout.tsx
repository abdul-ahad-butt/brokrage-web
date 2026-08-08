import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/broker-disclosure", label: "Broker Disclosure" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-200px)] flex-col">
      {/* Top nav strip */}
      <nav className="border-b border-surface-border bg-white" aria-label="Site navigation">
        <div className="page-container flex h-14 items-center gap-6">
          <Link href="/" className="text-base font-bold text-navy-900 hover:text-action transition-colors">
            FreightBridge
          </Link>
          <span className="text-surface-border">|</span>
          <div className="flex gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-content-secondary hover:text-action transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 bg-slate-50 py-12">
        <div className="page-container">
          <div className="mx-auto max-w-3xl">
            {/* Sidebar tabs */}
            <div className="mb-8 flex flex-wrap gap-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-surface-border bg-white px-4 py-1.5 text-sm font-medium text-content-secondary shadow-sm hover:border-action hover:text-action transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
