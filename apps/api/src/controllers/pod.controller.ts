import { type Request, type Response } from "express";
import { LoadStatus } from "../constants";
import { prisma } from "../db/prismaClient";
import { AppError } from "../middleware/errorHandler";
import { type AuthenticatedRequest } from "../middleware/auth";
import path from "path";
import fs from "fs";

/** Simple file storage: save uploaded file to local uploads/ dir.
 *  In production this would be replaced by an S3/GCS upload. */
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export const podController = {
  async upload(req: Request, res: Response) {
    const loadId = req.params["id"] as string;
    const carrierId = (req as AuthenticatedRequest).user.id;

    // Verify the load is booked/in-transit and this carrier is assigned
    const load = await prisma.load.findUnique({ where: { id: loadId } });
    if (!load) throw new AppError(404, "NOT_FOUND", "Load not found");
    if (!["BOOKED", "IN_TRANSIT"].includes(load.status)) {
      throw new AppError(400, "BAD_REQUEST", "Load is not in a deliverable state");
    }

    // Verify carrier is the accepted carrier
    if (load.acceptedBidId) {
      const acceptedBid = await prisma.bid.findUnique({ where: { id: load.acceptedBidId } });
      if (!acceptedBid || acceptedBid.carrierId !== carrierId) {
        throw new AppError(403, "FORBIDDEN", "You are not the assigned carrier for this load");
      }
    } else {
      throw new AppError(400, "BAD_REQUEST", "No accepted bid on this load");
    }

    // In real prod: parse multipart body with multer, upload to cloud storage.
    // Here we simulate the POD receipt by generating a placeholder URL.
    const podUrl = `/uploads/${loadId}/pod_${Date.now()}.pdf`;

    // Ensure uploads dir exists (for dev)
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Create POD record
    const pod = await prisma.podDocument.create({
      data: {
        loadId,
        carrierId,
        fileUrl: podUrl,
      },
    });

    // Flip load status to IN_TRANSIT if it was BOOKED, or DELIVERED if already IN_TRANSIT
    const nextStatus =
      load.status === LoadStatus.BOOKED ? LoadStatus.IN_TRANSIT : LoadStatus.DELIVERED;

    await prisma.load.update({
      where: { id: loadId },
      data: { status: nextStatus },
    });

    res.status(201).json({
      success: true,
      data: {
        ...pod,
        uploadedAt: pod.uploadedAt.toISOString(),
        newLoadStatus: nextStatus,
      },
    });
  },
};
