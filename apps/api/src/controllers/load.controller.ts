import { type Request, type Response } from "express";
import { Prisma } from "@prisma/client";
import { LoadStatus, BidStatus } from "../constants";
import { prisma } from "../db/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { paymentsService } from "../services/payments/paymentsService";
import { tmsService } from "../services/tms/tmsService";
import type {
  CreateLoadDto,
  LoadFilters,
  PaginatedResponse,
  BidAcceptanceResult,
  LedgerShipperInfo,
  LedgerCarrierInfo,
} from "@freightbridge/shared-types";
import { type AuthenticatedRequest } from "../middleware/auth";

export const loadController = {
  async list(req: Request, res: Response) {
    const filters = req.query as unknown as LoadFilters;
    const page = Number(filters.page) || 1;
    const pageSize = Number(filters.pageSize) || 25;

    const where: Prisma.LoadWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    } else {
      // By default, only show OPEN loads on the board
      where.status = LoadStatus.OPEN;
    }

    if (filters.equipmentType) {
      where.equipmentType = filters.equipmentType;
    }

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

    // Map Prisma outputs to DTO shapes
    const data = loads.map((l) => ({
      ...l,
      imageUrls: JSON.parse(l.imageUrls) as string[],
      pickupDate: l.pickupDate.toISOString(),
      deliveryDate: l.deliveryDate.toISOString(),
      createdAt: l.createdAt.toISOString(),
      bidCount: l._count.bids,
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

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const load = await prisma.load.findUnique({
      where: { id },
      include: {
        shipper: { select: { companyName: true, fullName: true, ratingAverage: true } },
      },
    });

    if (!load) {
      throw new AppError(404, "NOT_FOUND", "Load not found");
    }

    res.json({
      success: true,
      data: {
        ...load,
        imageUrls: JSON.parse(load.imageUrls) as string[],
        pickupDate: load.pickupDate.toISOString(),
        deliveryDate: load.deliveryDate.toISOString(),
        createdAt: load.createdAt.toISOString(),
      },
    });
  },

  async create(req: Request, res: Response) {
    const data = req.body as CreateLoadDto;
    const shipperId = (req as AuthenticatedRequest).user.id;

    const load = await prisma.load.create({
      data: {
        shipperId,
        status: LoadStatus.OPEN,
        originAddress: data.originAddress,
        originLat: data.originLat,
        originLng: data.originLng,
        destAddress: data.destAddress,
        destLat: data.destLat,
        destLng: data.destLng,
        pickupDate: new Date(data.pickupDate),
        deliveryDate: new Date(data.deliveryDate),
        equipmentType: data.equipmentType,
        weightLbs: data.weightLbs,
        lengthFt: data.lengthFt,
        widthFt: data.widthFt,
        heightFt: data.heightFt,
        commodity: data.commodity,
        imageUrls: data.imageUrls ? JSON.stringify(data.imageUrls) : "[]",
        askingPrice: data.askingPrice,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        ...load,
        imageUrls: JSON.parse(load.imageUrls) as string[],
        pickupDate: load.pickupDate.toISOString(),
        deliveryDate: load.deliveryDate.toISOString(),
        createdAt: load.createdAt.toISOString(),
      },
    });
  },

  async acceptBid(req: Request, res: Response) {
    const loadId = req.params["id"] as string;
    const bidId = req.body.bidId as string;
    const shipperId = (req as AuthenticatedRequest).user.id;

    // 1. Fetch load & bid
    const load = await prisma.load.findUnique({
      where: { id: loadId },
      include: { shipper: true },
    });
    if (!load) throw new AppError(404, "NOT_FOUND", "Load not found");
    if (load.shipperId !== shipperId) throw new AppError(403, "FORBIDDEN", "Not your load");
    if (load.status !== LoadStatus.OPEN) throw new AppError(400, "BAD_REQUEST", "Load is not OPEN");

    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { carrier: true },
    });
    if (!bid || bid.loadId !== loadId) throw new AppError(404, "NOT_FOUND", "Bid not found");
    if (bid.status !== BidStatus.PENDING) throw new AppError(400, "BAD_REQUEST", "Bid is not PENDING");

    // 2. Mock payment: 10% platform fee
    const platformCommission = Math.round(bid.amount * 0.1 * 100) / 100;
    const shipperTotal = bid.amount + platformCommission;

    const paymentResult = await paymentsService.processBidAcceptance({
      loadId,
      shipperId,
      carrierId: bid.carrierId,
      shipperTotal,
      carrierBidAmount: bid.amount,
    });

    const shipperInfoJson = JSON.stringify({
      id: load.shipper.id,
      fullName: load.shipper.fullName,
      companyName: load.shipper.companyName,
      email: load.shipper.email,
    });
    const carrierInfoJson = JSON.stringify({
      id: bid.carrier.id,
      fullName: bid.carrier.fullName,
      companyName: bid.carrier.companyName,
      mcNumber: bid.carrier.mcNumber,
      dotNumber: bid.carrier.dotNumber,
      mcStatus: bid.carrier.mcStatus,
    });

    // 3. Create LedgerEntry and AuditLog
    const ledgerEntry = await prisma.$transaction(async (tx) => {
      const entry = await tx.ledgerEntry.create({
        data: {
          loadId,
          shipperInfo: shipperInfoJson,
          carrierInfo: carrierInfoJson,
          origin: load.originAddress,
          destination: load.destAddress,
          commodity: load.commodity,
          totalShipperCost: shipperTotal,
          carrierPayout: bid.amount,
          platformCommission,
          bookingFeeCharged: paymentResult.bookingFeeCharged,
          brokerRoutingStatus: "PENDING_TMS_SYNC",
        },
      });
      await tx.ledgerAuditLog.create({
        data: {
          ledgerEntryId: entry.id,
          loadId,
          shipperInfo: shipperInfoJson,
          carrierInfo: carrierInfoJson,
          origin: load.originAddress,
          destination: load.destAddress,
          commodity: load.commodity,
          totalShipperCost: shipperTotal,
          carrierPayout: bid.amount,
          platformCommission,
          bookingFeeCharged: paymentResult.bookingFeeCharged,
          brokerRoutingStatus: "PENDING_TMS_SYNC",
        },
      });
      return entry;
    });

    // 4. Call TMS
    let tmsSyncStatus = "PENDING_TMS_SYNC";
    let tmsReferenceId = undefined;
    try {
      const tmsResult = await tmsService.syncLoadToTms(loadId, ledgerEntry);
      tmsSyncStatus = tmsResult.status;
      tmsReferenceId = tmsResult.tmsReferenceId;
    } catch (e) {
      tmsSyncStatus = "FAILED";
    }

    // Update LedgerEntry with TMS status
    await prisma.$transaction(async (tx) => {
      await tx.ledgerEntry.update({
        where: { id: ledgerEntry.id },
        data: { brokerRoutingStatus: tmsSyncStatus },
      });
      await tx.ledgerAuditLog.create({
        data: {
          ledgerEntryId: ledgerEntry.id,
          loadId,
          shipperInfo: shipperInfoJson,
          carrierInfo: carrierInfoJson,
          origin: load.originAddress,
          destination: load.destAddress,
          commodity: load.commodity,
          totalShipperCost: shipperTotal,
          carrierPayout: bid.amount,
          platformCommission,
          bookingFeeCharged: paymentResult.bookingFeeCharged,
          brokerRoutingStatus: tmsSyncStatus,
        },
      });
    });

    // 5. Flip status
    await prisma.$transaction([
      prisma.bid.updateMany({
        where: { loadId, id: { not: bidId }, status: BidStatus.PENDING },
        data: { status: BidStatus.REJECTED },
      }),
      prisma.bid.update({
        where: { id: bidId },
        data: { status: BidStatus.ACCEPTED },
      }),
      prisma.load.update({
        where: { id: loadId },
        data: { status: LoadStatus.BOOKED, acceptedBidId: bidId },
      }),
    ]);

    const updatedLoad = await prisma.load.findUnique({ where: { id: loadId }, include: { shipper: true } });
    const updatedBid = await prisma.bid.findUnique({ where: { id: bidId }, include: { carrier: true } });

    res.json({
      success: true,
      data: {
        load: {
          ...updatedLoad,
          imageUrls: JSON.parse(updatedLoad!.imageUrls) as string[],
          pickupDate: updatedLoad!.pickupDate.toISOString(),
          deliveryDate: updatedLoad!.deliveryDate.toISOString(),
          createdAt: updatedLoad!.createdAt.toISOString(),
        },
        bid: {
          ...updatedBid,
          createdAt: updatedBid!.createdAt.toISOString(),
        },
        ledgerEntry: {
          ...ledgerEntry,
          brokerRoutingStatus: tmsSyncStatus,
          shipperInfo: JSON.parse(ledgerEntry.shipperInfo) as LedgerShipperInfo,
          carrierInfo: JSON.parse(ledgerEntry.carrierInfo) as LedgerCarrierInfo,
          createdAt: ledgerEntry.createdAt.toISOString(),
        },
        payment: {
          bookingFeeCharged: paymentResult.bookingFeeCharged,
          carrierPayoutAmount: paymentResult.carrierPayoutAmount,
          platformAccountTxnId: paymentResult.platformAccountTxnId,
          carrierPayoutInvoiceId: paymentResult.carrierPayoutInvoiceId,
        },
        tmsSync: {
          status: tmsSyncStatus,
          tmsReferenceId: tmsReferenceId,
        },
      } as BidAcceptanceResult,
    });
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const shipperId = (req as AuthenticatedRequest).user.id;
    const data = req.body as Partial<CreateLoadDto>;

    const load = await prisma.load.findUnique({ where: { id } });
    if (!load) throw new AppError(404, "NOT_FOUND", "Load not found");
    if (load.shipperId !== shipperId) throw new AppError(403, "FORBIDDEN", "Not your load");
    if (!["DRAFT", "OPEN"].includes(load.status)) {
      throw new AppError(400, "BAD_REQUEST", "Can only edit DRAFT or OPEN loads");
    }

    const updated = await prisma.load.update({
      where: { id },
      data: {
        ...(data.originAddress && { originAddress: data.originAddress }),
        ...(data.originLat !== undefined && { originLat: data.originLat }),
        ...(data.originLng !== undefined && { originLng: data.originLng }),
        ...(data.destAddress && { destAddress: data.destAddress }),
        ...(data.destLat !== undefined && { destLat: data.destLat }),
        ...(data.destLng !== undefined && { destLng: data.destLng }),
        ...(data.pickupDate && { pickupDate: new Date(data.pickupDate) }),
        ...(data.deliveryDate && { deliveryDate: new Date(data.deliveryDate) }),
        ...(data.equipmentType && { equipmentType: data.equipmentType }),
        ...(data.weightLbs !== undefined && { weightLbs: data.weightLbs }),
        ...(data.lengthFt !== undefined && { lengthFt: data.lengthFt }),
        ...(data.widthFt !== undefined && { widthFt: data.widthFt }),
        ...(data.heightFt !== undefined && { heightFt: data.heightFt }),
        ...(data.commodity && { commodity: data.commodity }),
        ...(data.imageUrls && { imageUrls: JSON.stringify(data.imageUrls) }),
        ...(data.askingPrice !== undefined && { askingPrice: data.askingPrice }),
      },
    });

    res.json({
      success: true,
      data: {
        ...updated,
        imageUrls: JSON.parse(updated.imageUrls) as string[],
        pickupDate: updated.pickupDate.toISOString(),
        deliveryDate: updated.deliveryDate.toISOString(),
        createdAt: updated.createdAt.toISOString(),
      },
    });
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const shipperId = (req as AuthenticatedRequest).user.id;

    const load = await prisma.load.findUnique({ where: { id } });
    if (!load) throw new AppError(404, "NOT_FOUND", "Load not found");
    if (load.shipperId !== shipperId) throw new AppError(403, "FORBIDDEN", "Not your load");
    if (!["DRAFT", "OPEN"].includes(load.status)) {
      throw new AppError(400, "BAD_REQUEST", "Can only delete DRAFT or OPEN loads");
    }

    await prisma.load.update({
      where: { id },
      data: { status: LoadStatus.CANCELLED },
    });

    res.status(204).send();
  },
};
