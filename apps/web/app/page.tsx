import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FreightBridge — Transparent Freight Marketplace",
  description:
    "Connect with vetted carriers, post loads, and book freight shipments through FreightBridge — the compliance-first freight marketplace operating as an independent agent.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-navy-800 bg-navy-900 text-white">
        <div className="page-container flex h-16 items-center justify-between">
          <span className="text-xl font-bold tracking-tight">FreightBridge</span>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-navy-300 hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-900 pb-24 pt-20 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(59,130,246,0.15),transparent_70%)]"
        />
        <div className="page-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-block rounded-full border border-navy-700 bg-navy-800 px-3 py-1 text-xs font-medium text-navy-300">
              Compliance-First Freight Marketplace
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Ship with confidence.{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                Carry with credibility.
              </span>
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-navy-300 md:text-xl">
              FreightBridge connects shippers with FMCSA-vetted carriers through a transparent
              bidding marketplace. Every load, every bid, every payment — tracked and compliant.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register?role=SHIPPER" className="btn-primary px-6 py-3 text-base">
                Post a Load →
              </Link>
              <Link
                href="/register?role=CARRIER"
                className="btn-secondary px-6 py-3 text-base text-white border-navy-600 bg-navy-800 hover:bg-navy-700"
              >
                Find Freight
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────── */}
      <section className="section bg-surface-base">
        <div className="page-container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">How FreightBridge Works</h2>
            <p className="text-content-secondary">
              Simple, transparent, and backed by licensed broker compliance.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "📦",
                title: "Post Your Load",
                desc: "Enter origin, destination, cargo specs, and an optional asking price. Carriers start bidding within hours.",
              },
              {
                icon: "🛡️",
                title: "Vetted Carriers Only",
                desc: "Every bid is automatically checked against FMCSA compliance data. INACTIVE or broker-only carriers cannot bid.",
              },
              {
                icon: "💳",
                title: "Transparent Pricing",
                desc: "Accept the best bid and see exactly where your money goes — carrier payout, booking fee, and broker settlement.",
              },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <span className="mb-4 block text-4xl">{f.icon}</span>
                <h3 className="mb-2 text-lg font-semibold text-content-primary">{f.title}</h3>
                <p className="text-sm leading-relaxed text-content-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="section border-y border-surface-border bg-surface-muted">
        <div className="page-container">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "100%", label: "FMCSA-verified carriers" },
              { value: "10%", label: "Flat booking fee — no hidden costs" },
              { value: "24h", label: "Average time to first bid" },
              { value: "3", label: "Portal types: Shipper, Carrier, Agent" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-navy-900 md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs text-content-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="page-container">
          <div className="rounded-2xl bg-navy-900 p-10 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to move freight?</h2>
            <p className="mb-8 text-navy-300">
              Join shippers and carriers who trust FreightBridge for transparent, compliant freight
              brokerage.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register?role=SHIPPER" className="btn-primary px-6 py-3">
                I&apos;m a Shipper
              </Link>
              <Link
                href="/register?role=CARRIER"
                className="border border-navy-600 bg-navy-800 hover:bg-navy-700 text-white btn-secondary px-6 py-3"
              >
                I&apos;m a Carrier
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
