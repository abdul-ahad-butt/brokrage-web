import type { LedgerEntry } from "@freightbridge/shared-types";

interface LedgerTableProps {
  entries: LedgerEntry[];
}

export function LedgerTable({ entries }: LedgerTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-surface-border">
      <table className="data-table" aria-label="Compliance ledger entries">
        <thead>
          <tr>
            <th>Load ID</th>
            <th>Shipper</th>
            <th>Carrier</th>
            <th>Route</th>
            <th>Commodity</th>
            <th>Shipper Total</th>
            <th>Carrier Payout</th>
            <th>Commission</th>
            <th>Booking Fee</th>
            <th>TMS Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} id={`ledger-row-${e.id}`}>
              <td>
                <span className="font-mono text-xs text-content-secondary">
                  {e.loadId.slice(0, 8)}…
                </span>
              </td>
              <td>
                <div>
                  <p className="text-xs font-medium text-content-primary">
                    {e.shipperInfo.fullName}
                  </p>
                  {e.shipperInfo.companyName && (
                    <p className="text-xs text-content-muted">{e.shipperInfo.companyName}</p>
                  )}
                </div>
              </td>
              <td>
                <div>
                  <p className="text-xs font-medium text-content-primary">
                    {e.carrierInfo.fullName}
                  </p>
                  {e.carrierInfo.mcNumber && (
                    <p className="font-mono text-xs text-content-muted">
                      MC# {e.carrierInfo.mcNumber}
                    </p>
                  )}
                </div>
              </td>
              <td>
                <div className="max-w-[160px]">
                  <p className="truncate text-xs">{e.origin.split(",")[0]}</p>
                  <p className="truncate text-xs text-content-muted">→ {e.destination.split(",")[0]}</p>
                </div>
              </td>
              <td className="text-xs">{e.commodity}</td>
              <td className="font-medium">${e.totalShipperCost.toFixed(2)}</td>
              <td className="font-medium">${e.carrierPayout.toFixed(2)}</td>
              <td className="font-semibold text-compliance-active">
                ${e.platformCommission.toFixed(2)}
              </td>
              <td>${e.bookingFeeCharged.toFixed(2)}</td>
              <td>
                <span
                  className={`badge ${
                    e.brokerRoutingStatus === "SYNCED"
                      ? "badge-active"
                      : e.brokerRoutingStatus === "FAILED"
                        ? "badge-inactive"
                        : "badge-pending"
                  }`}
                >
                  {e.brokerRoutingStatus.replace("_", " ")}
                </span>
              </td>
              <td className="text-xs text-content-muted">
                {new Date(e.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
