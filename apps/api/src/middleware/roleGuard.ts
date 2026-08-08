import type { Request, Response, NextFunction } from "express";

import type { Role } from "@freightbridge/shared-types";

import type { AuthenticatedRequest } from "./auth";

/**
 * Role guard middleware factory.
 * Call requireRole("SHIPPER") or requireRole("CARRIER", "AGENT_ADMIN") etc.
 * Must be used AFTER the authenticate middleware.
 */
export function requireRole(...roles: Role[]) {
  return function roleGuard(req: Request, res: Response, next: NextFunction): void {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required." },
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access denied. Required role(s): ${roles.join(", ")}. Your role: ${authReq.user.role}`,
        },
      });
      return;
    }

    next();
  };
}
