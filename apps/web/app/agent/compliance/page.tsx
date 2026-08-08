"use client";

import { useFlaggedCarriers } from "@/lib/hooks";
import { ComplianceFlagRow } from "@/components/agent/ComplianceFlagRow";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AgentCompliancePage() {
  const { data: flags, isLoading, error } = useFlaggedCarriers();

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Compliance Flags</h1>
        <p className="mt-1 text-content-secondary">
          Carriers who attempted to bid while INACTIVE or with a BROKER-only MC number. Bid was
          rejected at the API level — no bid row was created.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" className="text-action" />
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      {!isLoading && !error && (!flags || flags.length === 0) && (
        <EmptyState
          icon={
            <svg className="h-6 w-6 text-compliance-active" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="No compliance flags"
          description="All carrier bids have passed the compliance check."
        />
      )}
      {!isLoading && flags && flags.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-surface-border">
          <table className="data-table" aria-label="Compliance flags table">
            <thead>
              <tr>
                <th>Carrier</th>
                <th>MC#</th>
                <th>MC Status</th>
                <th>Attempted Load</th>
                <th>Timestamp</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {flags.map((flag, i) => (
                <ComplianceFlagRow key={`${flag.carrierId}-${i}`} flag={flag} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
