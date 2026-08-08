import { type Request, type Response } from "express";
import { BidStatus, LoadStatus } from "../constants";
import { prisma } from "../db/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { complianceService } from "../services/compliance/complianceService";
import type { CreateBidDto } from "@freightbridge/shared-types";
import { type AuthenticatedRequest } from "../middleware/auth";

export const bidController = {
  async getBidsForLoad(req: Request, res: Response) {
    const { loadId } = req.params;
    const userId = (req as AuthenticatedRequest).user.id;
    const role = (req as AuthenticatedRequest).user.role;

    const load = await prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new AppError(404, "NOT_FOUND", "Load not found");

    // Only shipper who owns the load or agent can see all bids
    if (role === "SHIPPER" && load.shipperId !== userId) {
      throw new AppError(403, "FORBIDDEN", "Not your load");
    }

    const bids = await prisma.bid.findMany({
      where: { loadId },
      include: {
        carrier: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
            mcNumber: true,
            mcStatus: true,
            ratingAverage: true,
            ratingCount: true,
          },
        },
      },
      orderBy: { amount: "asc" },
    });

    res.json({
      success: true,
      data: bids.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
      })),
    });
  },

  async create(req: Request, res: Response) {
    const loadId = req.params["loadId"] as string;
    const data = req.body as CreateBidDto;
    const carrierId = (req as AuthenticatedRequest).user.id;

    // 1. Check if load is OPEN
    const load = await prisma.load.findUnique({ where: { id: loadId } });
    if (!load || load.status !== LoadStatus.OPEN) {
      throw new AppError(400, "BAD_REQUEST", "Load is not OPEN for bidding");
    }

    // 2. Fetch full carrier object for compliance check
    const carrier = await prisma.user.findUnique({ where: { id: carrierId } });
    if (!carrier) throw new AppError(404, "NOT_FOUND", "Carrier not found");

    // 3. Perform Compliance Check (FMCSA Mock)
    const isCompliant = await complianceService.checkCarrierCompliance(carrier, loadId);
    if (!isCompliant) {
      throw new AppError(
        403,
        "COMPLIANCE_ERROR",
        "Your MC status is not ACTIVE or you are flagged as a BROKER. Bid rejected.",
      );
    }

    // 4. Create the bid
    const bid = await prisma.bid.create({
      data: {
        loadId,
        carrierId,
        amount: data.amount,
        status: BidStatus.PENDING,
        message: data.message,
      },
      include: {
        carrier: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
            mcNumber: true,
            mcStatus: true,
            ratingAverage: true,
            ratingCount: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...bid,
        createdAt: bid.createdAt.toISOString(),
      },
    });
  },

  async withdraw(req: Request, res: Response) {
    const bidId = req.params["bidId"] as string;
    const carrierId = (req as AuthenticatedRequest).user.id;

    const bid = await prisma.bid.findUnique({ where: { id: bidId } });
    if (!bid) throw new AppError(404, "NOT_FOUND", "Bid not found");
    if (bid.carrierId !== carrierId) throw new AppError(403, "FORBIDDEN", "Not your bid");
    if (bid.status !== BidStatus.PENDING) {
      throw new AppError(400, "BAD_REQUEST", "Can only withdraw PENDING bids");
    }

    await prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.WITHDRAWN },
    });

    res.status(204).send();
  },

  async getMyBids(req: Request, res: Response) {
    const carrierId = (req as AuthenticatedRequest).user.id;

    const bids = await prisma.bid.findMany({
      where: { carrierId },
      orderBy: { createdAt: "desc" },
      include: {
        load: {
          select: {
            id: true,
            status: true,
            originAddress: true,
            destAddress: true,
            equipmentType: true,
            pickupDate: true,
            deliveryDate: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: bids.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
        load: b.load
          ? {
              ...b.load,
              pickupDate: b.load.pickupDate.toISOString(),
              deliveryDate: b.load.deliveryDate.toISOString(),
            }
          : null,
      })),
    });
  },
};
