import { type Request, type Response } from "express";
import { prisma } from "../db/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { type AuthenticatedRequest } from "../middleware/auth";
import type { CreateReviewDto } from "@freightbridge/shared-types";

export const reviewController = {
  async list(req: Request, res: Response) {
    const { carrierId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { carrierId },
      orderBy: { createdAt: "desc" },
      include: {
        shipper: {
          select: { id: true, fullName: true, companyName: true },
        },
      },
    });

    res.json({
      success: true,
      data: reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })),
    });
  },

  async create(req: Request, res: Response) {
    const { carrierId } = req.params;
    const dto = req.body as CreateReviewDto;
    const shipperId = (req as AuthenticatedRequest).user.id;

    // Verify that this shipper has a DELIVERED load with this carrier
    const completedLoad = await prisma.load.findFirst({
      where: {
        shipperId,
        status: "DELIVERED",
        acceptedBidId: { not: null },
        bids: { some: { carrierId, status: "ACCEPTED" } },
      },
    });

    if (!completedLoad) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "You can only review a carrier after a delivered load together",
      );
    }

    // Prevent duplicate review for the same load
    const existing = await prisma.review.findFirst({
      where: { loadId: completedLoad.id, shipperId, carrierId },
    });
    if (existing) {
      throw new AppError(409, "CONFLICT", "You have already reviewed this carrier for that load");
    }

    const review = await prisma.review.create({
      data: {
        carrier: { connect: { id: carrierId } },
        shipper: { connect: { id: shipperId } },
        load: { connect: { id: completedLoad.id } },
        stars: dto.stars,
        comment: dto.comment,
      },
    });

    // Update carrier's running average
    const agg = await prisma.review.aggregate({
      where: { carrierId },
      _avg: { stars: true },
      _count: { stars: true },
    });

    await prisma.user.update({
      where: { id: carrierId },
      data: {
        ratingAverage: agg._avg.stars ?? 0,
        ratingCount: agg._count.stars,
      },
    });

    res.status(201).json({
      success: true,
      data: { ...review, createdAt: review.createdAt.toISOString() },
    });
  },
};
