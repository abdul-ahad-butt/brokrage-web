import { type Request, type Response } from "express";
import { prisma } from "../db/prismaClient";
import type { AgentDashboardStats, AgentActivityItem, PaginatedResponse } from "@freightbridge/shared-types";
import { LoadStatus } from "../constants";
import { generateLedgerCsv } from "../ledger/ledgerExport";

export const agentController = {
  async getDashboard(req: Request, res: Response) {
    const activeLoadsCount = await prisma.load.count({
      where: {
        status: { in: [LoadStatus.OPEN, LoadStatus.BOOKED, LoadStatus.IN_TRANSIT] },
      },
    });

    const pendingComplianceFlagsCount = await prisma.complianceFlagLog.count();

    const aggregateCommission = await prisma.ledgerEntry.aggregate({
      _sum: { platformCommission: true },
    });
    const totalCommissionYtd = aggregateCommission._sum.platformCommission || 0;

    // We can assume totalMarginThisMonth is same for this mock, or query based on date
    const totalMarginThisMonth = totalCommissionYtd;

    const recentFlags = await prisma.complianceFlagLog.findMany({
      take: 5,
      orderBy: { attemptedAt: "desc" },
    });

    const recentLedger = await prisma.ledgerEntry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const recentActivity: AgentActivityItem[] = [
      ...recentFlags.map((f) => ({
        type: "COMPLIANCE_BLOCK" as const,
        timestamp: f.attemptedAt.toISOString(),
        description: `Blocked bid from carrier (MC: ${f.mcNumber || "N/A"}) - ${f.reason}`,
        carrierId: f.carrierId,
        loadId: f.loadId,
      })),
      ...recentLedger.map((l) => ({
        type: "BID_ACCEPTED" as const,
        timestamp: l.createdAt.toISOString(),
        description: `Load ${l.loadId} booked for $${l.carrierPayout}. Commission: $${l.platformCommission}`,
        loadId: l.loadId,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const stats: AgentDashboardStats = {
      activeLoadsCount,
      totalMarginThisMonth,
      pendingComplianceFlagsCount,
      totalCommissionYtd,
      recentActivity: recentActivity.slice(0, 10),
    };

    res.json({ success: true, data: stats });
  },

  async getFlaggedCarriers(req: Request, res: Response) {
    const flags = await prisma.complianceFlagLog.findMany({
      orderBy: { attemptedAt: "desc" },
    });

    // Join carrier name from User table
    const carrierIds = [...new Set(flags.map((f) => f.carrierId))];
    const carriers = await prisma.user.findMany({
      where: { id: { in: carrierIds } },
      select: { id: true, fullName: true, companyName: true },
    });
    const carrierMap = new Map(carriers.map((c) => [c.id, c]));

    const data = flags.map((f) => {
      const c = carrierMap.get(f.carrierId);
      return {
        carrierId: f.carrierId,
        carrierName: c?.fullName ?? `MC: ${f.mcNumber ?? "N/A"}`,
        mcNumber: f.mcNumber,
        mcStatus: f.mcStatus,
        attemptedLoadId: f.loadId,
        attemptedAt: f.attemptedAt.toISOString(),
        reason: f.reason,
      };
    });

    res.json({ success: true, data });
  },

  async getAgentLoads(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 25;
    const statusFilter = req.query.status as string | undefined;

    const where = statusFilter ? { status: statusFilter } : {};

    const [total, loads] = await prisma.$transaction([
      prisma.load.count({ where }),
      prisma.load.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { bids: true } },
        },
      }),
    ]);

    // Compute margin = askingPrice - acceptedBid amount
    const acceptedBidIds = loads
      .map((l) => l.acceptedBidId)
      .filter((id): id is string => id !== null);
    const acceptedBids = await prisma.bid.findMany({
      where: { id: { in: acceptedBidIds } },
      select: { id: true, amount: true },
    });
    const bidAmountMap = new Map(acceptedBids.map((b) => [b.id, b.amount]));

    const data = loads.map((l) => {
      const acceptedAmount = l.acceptedBidId ? bidAmountMap.get(l.acceptedBidId) : undefined;
      const margin =
        l.askingPrice !== null && acceptedAmount !== undefined
          ? parseFloat((l.askingPrice - acceptedAmount).toFixed(2))
          : null;

      return {
        ...l,
        pickupDate: l.pickupDate.toISOString(),
        deliveryDate: l.deliveryDate.toISOString(),
        createdAt: l.createdAt.toISOString(),
        bidCount: l._count.bids,
        margin,
      };
    });

    res.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    } as PaginatedResponse<any>);
  },

  async exportLedger(req: Request, res: Response) {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=\"freightbridge-ledger.csv\"");
    await generateLedgerCsv(res, from ? new Date(from) : undefined, to ? new Date(to) : undefined);
  },

  async getLedger(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 25;

    const [total, entries] = await prisma.$transaction([
      prisma.ledgerEntry.count(),
      prisma.ledgerEntry.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const data = entries.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    }));

    res.json({
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    } as PaginatedResponse<any>);
  },
};
