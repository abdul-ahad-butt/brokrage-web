/**
 * String-based enum constants matching the Prisma schema String fields.
 * These replace @prisma/client enum imports for SQLite compatibility.
 */

export const Role = {
  SHIPPER: "SHIPPER",
  CARRIER: "CARRIER",
  AGENT_ADMIN: "AGENT_ADMIN",
} as const;

export const MCStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BROKER: "BROKER",
  UNKNOWN: "UNKNOWN",
} as const;

export const LoadStatus = {
  DRAFT: "DRAFT",
  OPEN: "OPEN",
  BOOKED: "BOOKED",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export const EquipmentType = {
  FLATBED: "FLATBED",
  REEFER: "REEFER",
  DRY_VAN: "DRY_VAN",
  OTHER: "OTHER",
} as const;

export const BidStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;
