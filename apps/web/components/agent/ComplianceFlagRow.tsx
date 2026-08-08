import type { ComplianceFlaggedCarrier } from "@freightbridge/shared-types";
import { ComplianceBadge } from "../ui/ComplianceBadge";
import Link from "next/link";

interface ComplianceFlagRowProps {
  flag: ComplianceFlaggedCarrier;
}

export function ComplianceFlagRow({ flag }: ComplianceFlagRowProps) {
  return (
    <tr id={`flag-row-${flag.carrierId}`}>
      <td>
        <span className="font-medium text-content-primary">{flag.carrierName}</span>
      </td>
      <td>
        <span className="font-mono text-xs">{flag.mcNumber ?? "—"}</span>
      </td>
      <td>
        <ComplianceBadge status={flag.mcStatus} />
      </td>
      <td>
        <Link
          href={`/carrier/find-loads/${flag.attemptedLoadId}`}
          className="font-mono text-xs text-action hover:underline"
        >
          {flag.attemptedLoadId.slice(0, 8)}…
        </Link>
      </td>
      <td>
        <span className="text-xs text-content-muted">
          {new Date(flag.attemptedAt).toLocaleString()}
        </span>
      </td>
      <td>
        <span className="text-xs text-content-secondary">{flag.reason}</span>
      </td>
    </tr>
  );
}
