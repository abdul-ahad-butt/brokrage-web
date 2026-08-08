import { z } from "zod";

// ─── Enums (matching Prisma / shared-types) ──────────────────────────────────
export const RoleSchema = z.enum(["SHIPPER", "CARRIER", "AGENT_ADMIN"]);
export const EquipmentTypeSchema = z.enum(["FLATBED", "REEFER", "DRY_VAN", "OTHER"]);
export const LoadStatusSchema = z.enum(["DRAFT", "OPEN", "BOOKED", "IN_TRANSIT", "DELIVERED", "CANCELLED"]);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: RoleSchema,
  companyName: z.string().optional(),
  phone: z.string().regex(/^\+?1?\s*\(?([0-9]{3})\)?[-.\s]*([0-9]{3})[-.\s]*([0-9]{4})$/, "Must be a valid US phone number"),
  mcNumber: z.string().optional(),
  dotNumber: z.string().optional(),
});

// ─── Loads ────────────────────────────────────────────────────────────────────

export const CreateLoadSchema = z.object({
  originAddress: z.string().min(2),
  originLat: z.number(),
  originLng: z.number(),
  destAddress: z.string().min(2),
  destLat: z.number(),
  destLng: z.number(),
  pickupDate: z.string().datetime(), // ISO 8601
  deliveryDate: z.string().datetime(),
  equipmentType: EquipmentTypeSchema,
  weightLbs: z.number().positive(),
  lengthFt: z.number().positive(),
  widthFt: z.number().positive(),
  heightFt: z.number().positive(),
  commodity: z.string().min(2),
  imageUrls: z.array(z.string().url()).optional(),
  askingPrice: z.number().positive().optional(),
});

export const LoadFiltersSchema = z.object({
  equipmentType: EquipmentTypeSchema.optional(),
  status: LoadStatusSchema.optional(),
  originLat: z.coerce.number().optional(),
  originLng: z.coerce.number().optional(),
  originRadiusMiles: z.coerce.number().optional(),
  minPayout: z.coerce.number().optional(),
  maxPayout: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(25),
});

// ─── Bids ─────────────────────────────────────────────────────────────────────

export const CreateBidSchema = z.object({
  amount: z.number().positive(),
  message: z.string().optional(),
});

export const AcceptBidSchema = z.object({
  bidId: z.string().uuid(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const CreateReviewSchema = z.object({
  stars: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// ─── Load Update (partial) ────────────────────────────────────────────────────

export const UpdateLoadSchema = CreateLoadSchema.partial();
