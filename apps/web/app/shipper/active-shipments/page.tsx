"use client";

import Link from "next/link";
import { useLoads } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import { LoadStatusBadge } from "@/components/ui/LoadStatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ShipperActiveShipmentsPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useLoads({ status: "BOOKED" });
  const { data: inTransitData, isLoading: inLoading } = useLoads({ status: "IN_TRANSIT" });

  const bookedLoads = (data?.data ?? []).filter((l) => l.shipperId === user?.id);
  const inTransitLoads = (inTransitData?.data ?? []).filter((l) => l.shipperId === user?.id);
  const allActive = [...inTransitLoads, ...bookedLoads];

  const loading = isLoading || inLoading;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-navy-900">Active Shipments</h1>
        <p className="mt-1 text-content-secondary">
          Track your booked and in-transit loads in real time.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" className="text-action" />
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}
      {!loading && allActive.length === 0 && (
        <EmptyState
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
          title="No active shipments"
          description="Shipments you book will appear here for tracking."
          action={
            <Link href="/shipper/loads" className="btn-secondary">
              View My Loads
            </Link>
          }
        />
      )}

      {!loading && allActive.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {allActive.map((load) => (
            <div key={load.id} className="card p-5 animate-slide-up" id={`shipment-card-${load.id}`}>
              <div className="mb-3 flex items-center justify-between">
                <LoadStatusBadge status={load.status} />
                <Link
                  href={`/shipper/loads/${load.id}`}
                  className="text-xs text-action hover:text-action-hover"
                >
                  View Details →
                </Link>
              </div>
              <h3 className="font-semibold text-content-primary truncate">
                {load.originAddress}
              </h3>
              <p className="text-sm text-content-secondary truncate">→ {load.destAddress}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-content-muted">
                <div>
                  <p className="font-medium text-content-secondary">Equipment</p>
                  <p>{load.equipmentType.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="font-medium text-content-secondary">Weight</p>
                  <p>{load.weightLbs.toLocaleString()} lbs</p>
                </div>
                <div>
                  <p className="font-medium text-content-secondary">Pickup</p>
                  <p>{new Date(load.pickupDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-content-secondary">Delivery</p>
                  <p>{new Date(load.deliveryDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-content-muted mb-1">
                  <span>Booked</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-surface-muted overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full bg-action transition-all duration-500 ${
                      load.status === "BOOKED"
                        ? "w-1/3"
                        : load.status === "IN_TRANSIT"
                          ? "w-2/3"
                          : "w-full"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
