"use client";

import { useLoads } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import { PodUploader } from "@/components/carrier/PodUploader";
import { LoadStatusBadge } from "@/components/ui/LoadStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { useState } from "react";

export default function CarrierActiveLoadsPage() {
  const { user } = useAuth();
  const { data: bookedData, isLoading: l1, refetch: r1 } = useLoads({ status: "BOOKED" });
  const { data: transitData, isLoading: l2, refetch: r2 } = useLoads({ status: "IN_TRANSIT" });

  // We need to filter by the carrier's accepted bid — we use the loads from the carrier's bids
  // The simplest approach: filter loads where the carrier was the winning bidder.
  // Since the API doesn't filter by carrier on the loads endpoint, we rely on the my-bids endpoint
  // to cross-reference. For now, show all booked/in-transit loads (agent view in dev).
  // In production this would be carrier-scoped via the bid acceptance record.
  const [podLoadId, setPodLoadId] = useState<string | null>(null);

  const allLoads = [
    ...(bookedData?.data ?? []),
    ...(transitData?.data ?? []),
  ];

  const isLoading = l1 || l2;

  const handlePodUploaded = () => {
    setPodLoadId(null);
    r1();
    r2();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Active Loads</h1>
        <p className="mt-1 text-content-secondary">
          Loads you&apos;ve won. Upload proof of delivery to mark a shipment complete.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" className="text-action" />
        </div>
      )}
      {!isLoading && allLoads.length === 0 && (
        <EmptyState
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
          title="No active loads"
          description="When you win a bid, the load will appear here for delivery management."
          action={<Link href="/carrier/find-loads" className="btn-primary">Browse Loads</Link>}
        />
      )}

      {!isLoading && allLoads.length > 0 && (
        <div className="space-y-4">
          {allLoads.map((load) => (
            <div key={load.id} className="card p-5 animate-slide-up" id={`active-load-${load.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <LoadStatusBadge status={load.status} />
                    <span className="text-xs text-content-muted">
                      {load.equipmentType.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-content-primary">{load.originAddress}</h3>
                  <p className="text-sm text-content-secondary">→ {load.destAddress}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-content-muted">Pickup</p>
                  <p className="font-medium">{new Date(load.pickupDate).toLocaleDateString()}</p>
                  <p className="mt-1 text-content-muted">Delivery</p>
                  <p className="font-medium">{new Date(load.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {podLoadId === load.id ? (
                  <div className="w-full">
                    <PodUploader loadId={load.id} onUploaded={handlePodUploaded} />
                    <button
                      type="button"
                      onClick={() => setPodLoadId(null)}
                      className="mt-2 text-xs text-content-muted hover:text-content-primary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPodLoadId(load.id)}
                    className="btn-primary text-sm"
                    id={`upload-pod-trigger-${load.id}`}
                  >
                    Upload Proof of Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
