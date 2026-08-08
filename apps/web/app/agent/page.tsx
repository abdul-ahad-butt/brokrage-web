"use client";

import { useAgentDashboard } from "@/lib/hooks";
import { KpiCard } from "@/components/agent/KpiCard";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";

export default function AgentDashboardPage() {
  const { data: stats, isLoading, error } = useAgentDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" className="text-action" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Agent Dashboard</h1>
        <p className="mt-1 text-content-secondary">
          Real-time overview of platform activity, margin, and compliance.
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          id="kpi-active-loads"
          label="Active Loads"
          value={stats.activeLoadsCount}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
        />
        <KpiCard
          id="kpi-margin"
          label="Margin This Month"
          value={`$${stats.totalMarginThisMonth.toFixed(2)}`}
          trend="up"
          subValue="Platform commissions"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KpiCard
          id="kpi-flags"
          label="Pending Flags"
          value={stats.pendingComplianceFlagsCount}
          trend={stats.pendingComplianceFlagsCount > 0 ? "down" : "neutral"}
          subValue={stats.pendingComplianceFlagsCount > 0 ? "Requires review" : "All clear"}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <KpiCard
          id="kpi-commission"
          label="Commission YTD"
          value={`$${stats.totalCommissionYtd.toFixed(2)}`}
          trend="up"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "All Loads", href: "/agent/loads", desc: "View every load with margin data" },
          { label: "Compliance Flags", href: "/agent/compliance", desc: "Review blocked bid attempts" },
          { label: "Compliance Ledger", href: "/agent/ledger", desc: "Paginated export-ready records" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card-hover p-4 no-underline block"
          >
            <p className="font-semibold text-content-primary">{item.label}</p>
            <p className="mt-0.5 text-xs text-content-secondary">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="mb-4 text-base font-semibold text-content-primary">
          Recent Activity
        </h2>
        {stats.recentActivity.length === 0 ? (
          <p className="text-sm text-content-secondary">No recent activity.</p>
        ) : (
          <div className="space-y-2">
            {stats.recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-white border border-surface-border p-3 text-sm"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    item.type === "COMPLIANCE_BLOCK" ? "bg-compliance-inactive" : "bg-compliance-active"
                  }`}
                >
                  {item.type === "COMPLIANCE_BLOCK" ? "✕" : "✓"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-content-primary">{item.description}</p>
                  <p className="mt-0.5 text-xs text-content-muted">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
