import { type LedgerEntry } from "@prisma/client";

/**
 * Mock TMS Service
 * Simulates pushing a booked load to the Broker of Record's Transportation Management System.
 */
export const tmsService = {
  /**
   * Sync a finalized load and its winning bid to the external TMS.
   */
  async syncLoadToTms(
    loadId: string,
    ledgerEntry: LedgerEntry,
  ): Promise<{ status: "SYNCED" | "FAILED"; tmsReferenceId: string }> {
    // 1. Simulate external API network latency
    const delay = Math.floor(Math.random() * 500) + 200; // 200-700ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Simulate occasional failure
    if (Math.random() > 0.9) {
      throw new Error("TMS API timeout");
    }

    // 2. Generate a fake TMS reference ID
    const tmsReferenceId = `TMS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // 3. In a real system we'd POST the payload. Here we just return success.
    return {
      status: "SYNCED",
      tmsReferenceId,
    };
  },
};
