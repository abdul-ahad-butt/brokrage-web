"use client";

import Link from "next/link";
import { AuthProvider } from "../../lib/auth";

/**
 * Shipper portal layout with AuthProvider.
 */
export default function ShipperLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/shipper/post-load", label: "Post a Load", icon: "➕" },
    { href: "/shipper/loads", label: "My Loads", icon: "📋" },
    { href: "/shipper/active-shipments", label: "Active Shipments", icon: "🚚" },
  ];

  return (
    <AuthProvider>
      <div className="flex min-h-[calc(100dvh-130px)]">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 border-r border-surface-border bg-white md:flex md:flex-col">
          <div className="border-b border-surface-border px-4 py-4">
            <Link href="/" className="text-sm font-bold text-navy-900 hover:text-action transition-colors">
              ← FreightBridge
            </Link>
            <p className="mt-1 text-xs text-content-muted">Shipper Portal</p>
          </div>
          <nav className="flex flex-col gap-1 p-2" aria-label="Shipper navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-content-secondary
                           hover:bg-surface-muted hover:text-content-primary transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile top nav */}
          <div className="flex items-center gap-2 border-b border-surface-border bg-white px-4 py-3 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 rounded-lg py-2 text-center text-xs font-medium text-content-secondary
                           hover:bg-surface-muted hover:text-content-primary transition-colors"
              >
                <span className="block text-base">{item.icon}</span>
                <span className="block truncate">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="section page-container">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
