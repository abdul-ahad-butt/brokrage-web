import type { User } from "@prisma/client";
import { prisma } from "../../db/prismaClient";

const MCStatus = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE", BROKER: "BROKER", UNKNOWN: "UNKNOWN" } as const;

/**
 * Mock Compliance Service (FMCSA / RMIS Integration)
 * Simulates checking a carrier's compliance status before they can bid.
 */
export const complianceService = {
  /**
   * Check if a carrier is compliant to bid on a load.
   * If not compliant (INACTIVE or BROKER), it logs a compliance flag and returns false.
   */
  async checkCarrierCompliance(carrier: User, loadId: string): Promise<boolean> {
    // 1. Simulate external API network latency
    const delay = Math.floor(Math.random() * 300) + 100; // 100-400ms
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 2. Mock external check (in this mock, we just trust our DB snapshot of their mcStatus)
    const status = carrier.mcStatus ?? MCStatus.UNKNOWN;

    if (status === MCStatus.ACTIVE) {
      return true;
    }

    // 3. Carrier is not active (e.g., INACTIVE or double BROKER authority)
    // We must record this attempt for the agent dashboard.
    const reason =
      status === MCStatus.BROKER
        ? "Double brokering attempt detected (Broker authority)"
        : `Carrier status is ${status}`;

    await prisma.complianceFlagLog.create({
      data: {
        carrierId: carrier.id,
        loadId,
        mcNumber: carrier.mcNumber,
        mcStatus: status,
        reason,
      },
    });

    return false;
  },
};
