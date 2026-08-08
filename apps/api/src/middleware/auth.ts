import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import type { Role } from "@freightbridge/shared-types";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
  };
}

/**
 * Verifies the JWT from the Authorization: Bearer <token> header.
 * Attaches the decoded payload to req.user.
 * Returns 401 if the token is missing, malformed, or expired.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Missing or malformed Authorization header. Expected: Bearer <token>",
      },
    });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env["JWT_SECRET"];

  if (!secret) {
    console.error("JWT_SECRET is not set — cannot verify tokens");
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Authentication service misconfigured" },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: Role;
    };

    (req as AuthenticatedRequest).user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: { code: "TOKEN_EXPIRED", message: "Your session has expired. Please log in again." },
      });
    } else {
      res.status(401).json({
        success: false,
        error: { code: "TOKEN_INVALID", message: "Invalid authentication token." },
      });
    }
  }
}
