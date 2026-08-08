import type { Load } from "@freightbridge/shared-types";
import Link from "next/link";
import { LoadStatusBadge } from "../ui/LoadStatusBadge";

interface MarginTableProps {
  loads: (Load & { margin?: number | null })[];
}

export function MarginTable({ loads }: MarginTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-surface-border">
      <table className="data-table" aria-label="All loads with margin">
        <thead>
          <tr>
            <th>Load ID</th>
            <th>Route</th>
            <th>Status</th>
            <th>Equipment</th>
            <th>Asking Price</th>
            <th>Accepted Bid</th>
            <th>Margin</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {loads.map((load) => {
            const margin = (load as any).margin as number | null | undefined;
            const acceptedBidAmt =
              load.askingPrice && margin !== null && margin !== undefined
                ? load.askingPrice - margin
                : null;

            return (
              <tr key={load.id} id={`margin-row-${load.id}`}>
                <td>
                  <Link
                    href={`/shipper/loads/${load.id}`}
                    className="font-mono text-xs text-action hover:underline"
                  >
                    {load.id.slice(0, 8)}…
                  </Link>
                </td>
                <td>
                  <div className="max-w-[200px]">
                    <p className="truncate text-xs font-medium text-content-primary">
                      {load.originAddress.split(",")[0]}
                    </p>
                    <p className="truncate text-xs text-content-muted">
                      → {load.destAddress.split(",")[0]}
                    </p>
                  </div>
                </td>
                <td>
                  <LoadStatusBadge status={load.status} />
                </td>
                <td>{load.equipmentType.replace("_", " ")}</td>
                <td>
                  {load.askingPrice ? (
                    <span className="font-medium">${load.askingPrice.toLocaleString()}</span>
                  ) : (
                    <span className="text-content-muted">—</span>
                  )}
                </td>
                <td>
                  {acceptedBidAmt !== null ? (
                    <span className="font-medium">${acceptedBidAmt.toLocaleString()}</span>
                  ) : (
                    <span className="text-content-muted">—</span>
                  )}
                </td>
                <td>
                  {margin !== null && margin !== undefined ? (
                    <span
                      className={`font-semibold ${margin >= 0 ? "text-compliance-active" : "text-compliance-inactive"}`}
                    >
                      {margin >= 0 ? "+" : ""}${margin.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-content-muted">—</span>
                  )}
                </td>
                <td className="text-xs text-content-muted">
                  {new Date(load.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
