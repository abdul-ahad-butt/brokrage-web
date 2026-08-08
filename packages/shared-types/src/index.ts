// ─────────────────────────────────────────────────────────────
// FreightBridge — Shared Types
// Single source of truth for types used by both API and Web.
// ─────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export type Role = "SHIPPER" | "CARRIER" | "AGENT_ADMIN";

export type MCStatus = "ACTIVE" | "INACTIVE" | "BROKER" | "UNKNOWN";

export type LoadStatus =
  | "DRAFT"
  | "OPEN"
  | "BOOKED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export type EquipmentType = "FLATBED" | "REEFER" | "DRY_VAN" | "OTHER";

export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export type BrokerRoutingStatus = "PENDING_TMS_SYNC" | "SYNCED" | "FAILED";

// ──────────────────────────────────────────────
// User
// ──────────────────────────────────────────────

export interface User {
  id: string;
  role: Role;
  email: string;
  fullName: string;
  companyName: string | null;
  phone: string | null;
  createdAt: string; // ISO 8601

  // Carrier-specific compliance fields
  mcNumber: string | null;
  dotNumber: string | null;
  mcStatus: MCStatus | null;
  complianceCheckedAt: string | null; // ISO 8601
  ratingAverage: number;
  ratingCount: number;
}

/** Public carrier profile — safe to expose on load boards */
export interface CarrierPublicProfile {
  id: string;
  fullName: string;
  companyName: string | null;
  mcNumber: string | null;
  mcStatus: MCStatus | null;
  ratingAverage: number;
  ratingCount: number;
}

// ──────────────────────────────────────────────
// Load
// ──────────────────────────────────────────────

export interface Load {
  id: string;
  shipperId: string;
  status: LoadStatus;
  originAddress: string;
  originLat: number;
  originLng: number;
  destAddress: string;
  destLat: number;
  destLng: number;
  pickupDate: string; // ISO 8601
  deliveryDate: string; // ISO 8601
  equipmentType: EquipmentType;
  weightLbs: number;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  commodity: string;
  imageUrls: string[];
  askingPrice: number | null;
  acceptedBidId: string | null;
  createdAt: string; // ISO 8601

  // Computed/joined fields (optional — not always present)
  bidCount?: number;
  lowestBid?: number;
  highestBid?: number;
  distanceMiles?: number; // populated on load-board queries with origin radius
}

export interface CreateLoadDto {
  originAddress: string;
  originLat: number;
  originLng: number;
  destAddress: string;
  destLat: number;
  destLng: number;
  pickupDate: string;
  deliveryDate: string;
  equipmentType: EquipmentType;
  weightLbs: number;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
  commodity: string;
  imageUrls?: string[];
  askingPrice?: number;
}

export interface LoadFilters {
  equipmentType?: EquipmentType;
  status?: LoadStatus;
  originLat?: number;
  originLng?: number;
  originRadiusMiles?: number;
  minPayout?: number;
  maxPayout?: number;
  page?: number;
  pageSize?: number;
}

// ──────────────────────────────────────────────
// Bid
// ──────────────────────────────────────────────

export interface Bid {
  id: string;
  loadId: string;
  carrierId: string;
  amount: number;
  status: BidStatus;
  message: string | null;
  createdAt: string; // ISO 8601

  // Joined fields
  carrier?: CarrierPublicProfile;
}

export interface CreateBidDto {
  amount: number;
  message?: string;
}

// ──────────────────────────────────────────────
// Proof of Delivery
// ──────────────────────────────────────────────

export interface PodDocument {
  id: string;
  loadId: string;
  carrierId: string;
  fileUrl: string;
  uploadedAt: string; // ISO 8601
}

// ──────────────────────────────────────────────
// Review
// ──────────────────────────────────────────────

export interface Review {
  id: string;
  carrierId: string;
  shipperId: string;
  loadId: string;
  stars: number; // 1–5
  comment: string | null;
  createdAt: string; // ISO 8601

  // Joined
  shipper?: Pick<User, "id" | "fullName" | "companyName">;
}

export interface CreateReviewDto {
  stars: number;
  comment?: string;
}

// ──────────────────────────────────────────────
// Ledger
// ──────────────────────────────────────────────

export interface LedgerShipperInfo {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string;
}

export interface LedgerCarrierInfo {
  id: string;
  fullName: string;
  companyName: string | null;
  mcNumber: string | null;
  dotNumber: string | null;
  mcStatus: MCStatus | null;
}

export interface LedgerEntry {
  id: string;
  loadId: string;
  shipperInfo: LedgerShipperInfo;
  carrierInfo: LedgerCarrierInfo;
  origin: string;
  destination: string;
  commodity: string;
  totalShipperCost: number;
  carrierPayout: number;
  platformCommission: number;
  bookingFeeCharged: number;
  brokerRoutingStatus: BrokerRoutingStatus;
  createdAt: string; // ISO 8601
}

// ──────────────────────────────────────────────
// Payments
// ──────────────────────────────────────────────

export interface BidAcceptanceResult {
  load: Load;
  bid: Bid;
  ledgerEntry: LedgerEntry;
  payment: {
    bookingFeeCharged: number;
    carrierPayoutAmount: number;
    platformAccountTxnId: string;
    carrierPayoutInvoiceId: string;
  };
  tmsSync: {
    tmsReferenceId: string;
    status: "SYNCED" | "FAILED";
  };
}

// ──────────────────────────────────────────────
// Compliance
// ──────────────────────────────────────────────

export interface CarrierComplianceResult {
  status: MCStatus;
  legalName: string;
  entityType: string;
  checkedAt: string; // ISO 8601
}

export interface ComplianceFlaggedCarrier {
  carrierId: string;
  carrierName: string;
  mcNumber: string | null;
  mcStatus: MCStatus;
  attemptedLoadId: string;
  attemptedAt: string; // ISO 8601
  reason: string;
}

// ──────────────────────────────────────────────
// Agent Dashboard
// ──────────────────────────────────────────────

export interface AgentDashboardStats {
  activeLoadsCount: number;
  totalMarginThisMonth: number;
  pendingComplianceFlagsCount: number;
  totalCommissionYtd: number;
  recentActivity: AgentActivityItem[];
}

export interface AgentActivityItem {
  type: "BID_ACCEPTED" | "COMPLIANCE_BLOCK";
  timestamp: string; // ISO 8601
  description: string;
  loadId?: string;
  carrierId?: string;
}

// ──────────────────────────────────────────────
// API Response Shapes
// ──────────────────────────────────────────────

/** Standard success envelope */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/** Standard error envelope */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  companyName?: string;
  phone: string;
  // Carrier-only
  mcNumber?: string;
  dotNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ──────────────────────────────────────────────
// Misc helpers
// ──────────────────────────────────────────────

/** Utility: make all properties of T optional */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
