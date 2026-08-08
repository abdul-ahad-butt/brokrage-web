import { PrismaClient } from "@prisma/client";

// Singleton Prisma client — shared across the entire API process.
// In development, store on globalThis to prevent hot-reload from creating
// multiple connections (tsx watch reinitializes modules on change).

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.__prismaClient ??
  new PrismaClient({
    log: process.env["NODE_ENV"] === "development" ? ["query", "warn", "error"] : ["warn", "error"],
  });

if (process.env["NODE_ENV"] !== "production") {
  globalThis.__prismaClient = prisma;
}
