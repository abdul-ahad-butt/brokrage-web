import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prismaClient";
import { AppError } from "../middleware/errorHandler";
import type { LoginDto, RegisterDto, AuthResponse } from "@freightbridge/shared-types";
import { MCStatus } from "../constants";
import { type AuthenticatedRequest } from "../middleware/auth";

const JWT_SECRET = process.env["JWT_SECRET"] || "fallback_secret";
const JWT_EXPIRES_IN = process.env["JWT_EXPIRES_IN"] || "7d";

function generateToken(userId: string, role: string): string {
  return jwt.sign({ id: userId, role }, JWT_SECRET as string, { expiresIn: JWT_EXPIRES_IN as any });
}

export const authController = {
  async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginDto;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const token = generateToken(user.id, user.role);

    // Filter out passwordHash
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        token,
        user: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          complianceCheckedAt: userWithoutPassword.complianceCheckedAt?.toISOString() || null,
        },
      } as AuthResponse,
    });
  },

  async register(req: Request, res: Response) {
    const data = req.body as RegisterDto;

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError(400, "EMAIL_EXISTS", "Email already in use");
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        role: data.role,
        companyName: data.companyName,
        phone: data.phone,
        // If carrier, initialize compliance
        mcNumber: data.role === "CARRIER" ? data.mcNumber : null,
        dotNumber: data.role === "CARRIER" ? data.dotNumber : null,
        mcStatus: data.role === "CARRIER" ? MCStatus.UNKNOWN : null,
      },
    });

    const token = generateToken(user.id, user.role);
    const { passwordHash: _ph, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          complianceCheckedAt: userWithoutPassword.complianceCheckedAt?.toISOString() || null,
        },
      } as AuthResponse,
    });
  },

  async me(req: Request, res: Response) {
    const userId = (req as AuthenticatedRequest).user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(404, "NOT_FOUND", "User not found");
    }

    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        ...userWithoutPassword,
        createdAt: userWithoutPassword.createdAt.toISOString(),
        complianceCheckedAt: userWithoutPassword.complianceCheckedAt?.toISOString() || null,
      },
    });
  },
};
