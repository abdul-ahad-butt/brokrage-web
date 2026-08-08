import Link from "next/link";
import type { Load } from "@freightbridge/shared-types";
import { LoadStatusBadge } from "../ui/LoadStatusBadge";

interface LoadCardProps {
  load: Load;
  href: string;
}

export function LoadCard({ load, href }: LoadCardProps) {
  const bidRange = (() => {
    if (load.lowestBid && load.highestBid) {
      return `$${load.lowestBid.toLocaleString()} – $${load.highestBid.toLocaleString()}`;
    }
    if (load.lowestBid) return `From $${load.lowestBid.toLocaleString()}`;
    return "No bids yet";
  })();

  return (
    <Link
      href={href}
      className="card-hover block no-underline"
      id={`load-card-${load.id}`}
    >
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <LoadStatusBadge status={load.status} />
          <span className="text-xs font-medium text-content-muted">
            {load.equipmentType.replace("_", " ")}
          </span>
        </div>

        {/* Route */}
        <div className="mb-3">
          <p className="font-semibold text-content-primary truncate">{load.originAddress}</p>
          <div className="my-0.5 flex items-center gap-1 text-content-muted">
            <span className="text-xs">↓</span>
            {load.distanceMiles && (
              <span className="text-xs">{load.distanceMiles.toFixed(0)} mi</span>
            )}
          </div>
          <p className="text-sm text-content-secondary truncate">{load.destAddress}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 border-t border-surface-border pt-3 text-xs">
          <div>
            <p className="text-content-muted">Weight</p>
            <p className="font-medium text-content-primary">
              {load.weightLbs.toLocaleString()} lbs
            </p>
          </div>
          <div>
            <p className="text-content-muted">Pickup</p>
            <p className="font-medium text-content-primary">
              {new Date(load.pickupDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-content-muted">Bid Range</p>
            <p className="font-medium text-content-primary">{bidRange}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
