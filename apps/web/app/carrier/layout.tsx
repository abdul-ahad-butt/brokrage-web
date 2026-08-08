"use client";

import Link from "next/link";
import { AuthProvider } from "../../lib/auth";

/**
 * Carrier portal layout with AuthProvider.
 * AuthProvider provides the useAuth() hook to all carrier pages.
 */
export default function CarrierLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: "/carrier/find-loads", label: "Find Loads", icon: "🔍" },
    { href: "/carrier/my-bids", label: "My Bids", icon: "🏷️" },
    { href: "/carrier/active-loads", label: "Active Loads", icon: "🚛" },
    { href: "/carrier/profile", label: "My Profile", icon: "👤" },
  ];

  return (
    <AuthProvider>
      <div className="flex min-h-[calc(100dvh-130px)]">
        <aside className="hidden w-56 shrink-0 border-r border-surface-border bg-white md:flex md:flex-col">
          <div className="border-b border-surface-border px-4 py-4">
            <Link href="/" className="text-sm font-bold text-navy-900 hover:text-action transition-colors">
              ← FreightBridge
            </Link>
            <p className="mt-1 text-xs text-content-muted">Carrier Portal</p>
          </div>
          <nav className="flex flex-col gap-1 p-2" aria-label="Carrier navigation">
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

        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-1 border-b border-surface-border bg-white px-4 py-3 md:hidden">
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
