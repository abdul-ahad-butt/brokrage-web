"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../../lib/auth";
import { Spinner } from "../../components/ui/Spinner";

const navItems = [
  { href: "/agent", label: "Dashboard", icon: "📊" },
  { href: "/agent/loads", label: "All Loads", icon: "📦" },
  { href: "/agent/compliance", label: "Compliance", icon: "🛡️" },
  { href: "/agent/ledger", label: "Ledger", icon: "📒" },
];

/**
 * Inner layout — needs to be a separate component so it can use useAuth()
 * which requires the AuthProvider ancestor.
 */
function AgentLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Role-gate: redirect non-AGENT_ADMIN users to home
  useEffect(() => {
    if (!isLoading && user && user.role !== "AGENT_ADMIN") {
      router.replace("/");
    }
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  if (!user || user.role !== "AGENT_ADMIN") {
    return null; // redirect in progress
  }

  return (
    <div className="flex min-h-[calc(100dvh-130px)]">
      <aside className="hidden w-56 shrink-0 border-r border-navy-800 bg-navy-900 text-white md:flex md:flex-col">
        <div className="border-b border-navy-800 px-4 py-4">
          <Link href="/" className="text-sm font-bold text-white hover:text-navy-300 transition-colors">
            ← FreightBridge
          </Link>
          <p className="mt-1 text-xs text-navy-400">Agent Admin</p>
          <p className="mt-1 text-xs font-medium text-navy-200 truncate">{user.fullName}</p>
        </div>
        <nav className="flex flex-col gap-1 p-2" aria-label="Agent admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-navy-300
                         hover:bg-navy-800 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-surface-muted">
        <div className="flex items-center gap-1 border-b border-navy-800 bg-navy-900 px-4 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 rounded-lg py-2 text-center text-xs font-medium text-navy-300
                         hover:bg-navy-800 hover:text-white transition-colors"
            >
              <span className="block text-base">{item.icon}</span>
              <span className="block truncate">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="section page-container">{children}</div>
      </main>
    </div>
  );
}

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AgentLayoutInner>{children}</AgentLayoutInner>
    </AuthProvider>
  );
}
