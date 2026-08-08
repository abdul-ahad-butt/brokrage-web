"use client";

/**
 * Data-fetching hooks for loads, bids, and agent data.
 * Lightweight useState + useEffect pattern — no external SWR dependency needed.
 * Each hook returns { data, isLoading, error, refetch }.
 */

import { useCallback, useEffect, useState } from "react";
import type {
  Load,
  Bid,
  LoadFilters,
  PaginatedResponse,
  AgentDashboardStats,
  LedgerEntry,
  ComplianceFlaggedCarrier,
} from "@freightbridge/shared-types";
import { loadsApi, bidsApi, agentApi, ApiClientError } from "./apiClient";

// ─── Generic data hook ─────────────────────────────────────────────────────

function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const refetch = useCallback(() => setRevision((r) => r + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetcher()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiClientError ? err.message : "An error occurred");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revision, ...deps]);

  return { data, isLoading, error, refetch };
}

// ─── Loads ─────────────────────────────────────────────────────────────────

export function useLoads(filters?: LoadFilters) {
  // Serialize filters to a stable dep
  const filterKey = JSON.stringify(filters ?? {});
  return useFetch<PaginatedResponse<Load>>(() => loadsApi.list(filters), [filterKey]);
}

export function useLoad(id: string | null) {
  return useFetch<Load>(
    () => {
      if (!id) return Promise.reject(new Error("No load ID"));
      return loadsApi.get(id);
    },
    [id],
  );
}

export function useLoadBids(loadId: string | null) {
  return useFetch<Bid[]>(
    () => {
      if (!loadId) return Promise.reject(new Error("No load ID"));
      return loadsApi.getBids(loadId);
    },
    [loadId],
  );
}

// ─── Agent data ────────────────────────────────────────────────────────────

export function useAgentDashboard() {
  return useFetch<AgentDashboardStats>(() => agentApi.dashboard());
}

export function useAgentLoads() {
  return useFetch<PaginatedResponse<Load>>(() => agentApi.loads());
}

export function useFlaggedCarriers() {
  return useFetch<ComplianceFlaggedCarrier[]>(() => agentApi.flaggedCarriers());
}

export function useAgentLedger(page: number, pageSize: number) {
  return useFetch<PaginatedResponse<LedgerEntry>>(
    () => agentApi.ledger(page, pageSize),
    [page, pageSize],
  );
}

// ─── Carrier bids (own bids) ───────────────────────────────────────────────

/** Returns a carrier's own bids by fetching the my-bids endpoint.
 *  The backend doesn't have a dedicated /bids/mine route, so we piggyback
 *  on the loads list and join — but to keep it simple, expose a direct
 *  helper that carriers can call per-load or as a list view.
 *
 *  For the "my-bids" page we fetch the carrier's bids via the agent bids
 *  endpoint — the API returns carrier-scoped bids when called by a CARRIER role.
 */
export function useCarrierBids() {
  const [data, setData] = useState<Bid[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const refetch = useCallback(() => setRevision((r) => r + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    // Carriers call the carrier-scoped bids endpoint
    fetch(
      `${process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001"}/api/bids/my`,
      {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("fb_auth_token") : ""}`,
        },
      },
    )
      .then((r) => r.json())
      .then((res: { success: boolean; data: Bid[] }) => {
        if (!cancelled && res.success) setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load your bids");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [revision]);

  return { data, isLoading, error, refetch };
}

// Re-export bidsApi withdraw for convenience
export { bidsApi };
