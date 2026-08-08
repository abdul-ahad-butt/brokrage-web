"use client";

import { useState } from "react";
import { useAgentLedger } from "@/lib/hooks";
import { agentApi } from "@/lib/apiClient";
import { LedgerTable } from "@/components/agent/LedgerTable";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function AgentLedgerPage() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 25;
  const { data, isLoading, error } = useAgentLedger(page, PAGE_SIZE);

  const entries = data?.data ?? [];
  const pagination = data?.pagination;

  const handleExport = () => {
    // Open the export URL in a new tab — the browser will trigger a download
    window.open(agentApi.ledgerExportUrl(), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy-900">Compliance Ledger</h1>
          <p className="mt-1 text-content-secondary">
            Immutable record of every booked shipment, fee, and broker routing status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          id="export-ledger-btn"
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {pagination && (
        <p className="mb-4 text-xs text-content-muted">
          Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, pagination.total)} of{" "}
          {pagination.total} entries
        </p>
      )}

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
      {!isLoading && !error && entries.length === 0 && (
        <EmptyState
          title="No ledger entries"
          description="Ledger entries are created when a bid is accepted and payment is processed."
        />
      )}
      {!isLoading && entries.length > 0 && <LedgerTable entries={entries} />}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-content-muted">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
            disabled={page === pagination.totalPages}
            className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
