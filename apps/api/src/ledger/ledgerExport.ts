/**
 * Ledger CSV export — Phase 9.
 *
 * Streams rows from the LedgerEntry table directly to the HTTP response,
 * avoiding loading the full table into memory. Uses `csv-stringify` for
 * proper RFC 4180 quoting (handles commas in commodity/name fields).
 *
 * No update or delete methods are exposed for LedgerEntry anywhere in the
 * codebase — this module is read-only by design. Mutations happen only via
 * paymentsService.processBidAcceptance() which writes to LedgerAuditLog at
 * the same time.
 */

import { stringify } from "csv-stringify";
import type { Response } from "express";
import { prisma } from "../db/prismaClient";
import type {
  LedgerShipperInfo,
  LedgerCarrierInfo,
} from "@freightbridge/shared-types";

const COLUMNS = [
  "Load ID",
  "Shipper Name",
  "Shipper Company",
  "Carrier Name",
  "Carrier MC#",
  "Origin",
  "Destination",
  "Commodity",
  "Total Shipper Cost",
  "Carrier Payout",
  "Platform Commission",
  "Booking Fee Charged",
  "Broker TMS Sync Status",
  "Created At",
] as const;

/**
 * Streams a CSV of all ledger entries (optionally date-filtered) into the
 * provided Express Response. Caller must have already set Content-Type and
 * Content-Disposition headers.
 */
export async function generateLedgerCsv(
  res: Response,
  from?: Date,
  to?: Date,
): Promise<void> {
  const where =
    from || to
      ? {
          createdAt: {
            ...(from ? { gte: from } : {}),
            ...(to ? { lte: to } : {}),
          },
        }
      : {};

  const stringifier = stringify({
    header: true,
    columns: COLUMNS.map((col) => ({ key: col, header: col })),
    quoted: true, // quote all fields — safe against commas in commodity/names
    cast: {
      number: (value) => value.toFixed(2),
    },
  });

  // Pipe the stringifier output directly to the response
  stringifier.pipe(res);

  // Cursor-style iteration — fetch in pages to avoid memory pressure
  const PAGE_SIZE = 500;
  let page = 0;
  let hasMore = true;

  while (hasMore) {
    const rows = await prisma.ledgerEntry.findMany({
      where,
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { createdAt: "asc" },
    });

    if (rows.length === 0) {
      hasMore = false;
      break;
    }

    for (const row of rows) {
      const shipper = JSON.parse(row.shipperInfo as string) as LedgerShipperInfo;
      const carrier = JSON.parse(row.carrierInfo as string) as LedgerCarrierInfo;

      stringifier.write({
        "Load ID": row.loadId,
        "Shipper Name": shipper.fullName,
        "Shipper Company": shipper.companyName ?? "",
        "Carrier Name": carrier.fullName,
        "Carrier MC#": carrier.mcNumber ?? "",
        Origin: row.origin,
        Destination: row.destination,
        Commodity: row.commodity,
        "Total Shipper Cost": row.totalShipperCost,
        "Carrier Payout": row.carrierPayout,
        "Platform Commission": row.platformCommission,
        "Booking Fee Charged": row.bookingFeeCharged,
        "Broker TMS Sync Status": row.brokerRoutingStatus,
        "Created At": row.createdAt.toISOString(),
      });
    }

    if (rows.length < PAGE_SIZE) {
      hasMore = false;
    } else {
      page++;
    }
  }

  // Signal end of CSV — stringifier will flush and close the response pipe
  await new Promise<void>((resolve, reject) => {
    stringifier.end(() => resolve());
    stringifier.on("error", reject);
  });
}
