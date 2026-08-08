/**
 * FreightBridge API Client
 * Typed fetch wrapper for all API calls from the Next.js frontend.
 * Base URL is read from NEXT_PUBLIC_API_URL.
 * Auth token is read from localStorage (client-side) or passed as a parameter.
 */

import type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
  Load,
  CreateLoadDto,
  LoadFilters,
  Bid,
  CreateBidDto,
  BidAcceptanceResult,
  Review,
  CreateReviewDto,
  AgentDashboardStats,
  LedgerEntry,
  ComplianceFlaggedCarrier,
} from "@freightbridge/shared-types";

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3001";
const TOKEN_KEY = "fb_auth_token";

// ─── Token management ─────────────────────────────────────────────────────────

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
  },
};

// ─── Core fetch helper ────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token: overrideToken, ...rest } = options;
  const token = overrideToken ?? tokenStore.get();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });

  if (!res.ok) {
    let errorBody: ApiError;
    try {
      errorBody = (await res.json()) as ApiError;
    } catch {
      errorBody = {
        success: false,
        error: { code: "NETWORK_ERROR", message: `HTTP ${res.status}: ${res.statusText}` },
      };
    }
    const err = new ApiClientError(errorBody.error.message, errorBody.error.code, res.status);
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await apiFetch<ApiResponse<AuthResponse>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    tokenStore.set(res.data.token);
    return res.data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await apiFetch<ApiResponse<AuthResponse>>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    tokenStore.set(res.data.token);
    return res.data;
  },

  async me(): Promise<User> {
    const res = await apiFetch<ApiResponse<User>>("/api/auth/me");
    return res.data;
  },

  logout(): void {
    tokenStore.clear();
  },
};

// ─── Loads ────────────────────────────────────────────────────────────────────

export const loadsApi = {
  async list(filters?: LoadFilters): Promise<PaginatedResponse<Load>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null) params.set(k, String(v));
      });
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<PaginatedResponse<Load>>(`/api/loads${query}`);
  },

  async get(id: string): Promise<Load> {
    const res = await apiFetch<ApiResponse<Load>>(`/api/loads/${id}`);
    return res.data;
  },

  async create(dto: CreateLoadDto): Promise<Load> {
    const res = await apiFetch<ApiResponse<Load>>("/api/loads", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async update(id: string, dto: Partial<CreateLoadDto>): Promise<Load> {
    const res = await apiFetch<ApiResponse<Load>>(`/api/loads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiFetch<void>(`/api/loads/${id}`, { method: "DELETE" });
  },

  async getBids(loadId: string): Promise<Bid[]> {
    const res = await apiFetch<ApiResponse<Bid[]>>(`/api/loads/${loadId}/bids`);
    return res.data;
  },

  async acceptBid(loadId: string, bidId: string): Promise<BidAcceptanceResult> {
    const res = await apiFetch<ApiResponse<BidAcceptanceResult>>(
      `/api/loads/${loadId}/accept-bid`,
      {
        method: "POST",
        body: JSON.stringify({ bidId }),
      },
    );
    return res.data;
  },
};

// ─── Bids ─────────────────────────────────────────────────────────────────────

export const bidsApi = {
  async create(loadId: string, dto: CreateBidDto): Promise<Bid> {
    const res = await apiFetch<ApiResponse<Bid>>(`/api/loads/${loadId}/bids`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async withdraw(bidId: string): Promise<void> {
    await apiFetch<void>(`/api/bids/${bidId}`, { method: "DELETE" });
  },
};

// ─── POD ──────────────────────────────────────────────────────────────────────

export const podApi = {
  async upload(loadId: string, file: File): Promise<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const token = tokenStore.get();
    const res = await fetch(`${API_BASE}/api/loads/${loadId}/pod`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = (await res.json()) as ApiError;
      throw new ApiClientError(err.error.message, err.error.code, res.status);
    }

    const data = (await res.json()) as ApiResponse<{ fileUrl: string }>;
    return data.data;
  },
};

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsApi = {
  async create(carrierId: string, dto: CreateReviewDto): Promise<Review> {
    const res = await apiFetch<ApiResponse<Review>>(`/api/carriers/${carrierId}/reviews`, {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return res.data;
  },

  async list(carrierId: string): Promise<Review[]> {
    const res = await apiFetch<ApiResponse<Review[]>>(`/api/carriers/${carrierId}/reviews`);
    return res.data;
  },
};

// ─── Agent / Admin ────────────────────────────────────────────────────────────

export const agentApi = {
  async dashboard(): Promise<AgentDashboardStats> {
    const res = await apiFetch<ApiResponse<AgentDashboardStats>>("/api/agent/dashboard");
    return res.data;
  },

  async loads(): Promise<PaginatedResponse<Load>> {
    return apiFetch<PaginatedResponse<Load>>("/api/agent/loads");
  },

  async flaggedCarriers(): Promise<ComplianceFlaggedCarrier[]> {
    const res = await apiFetch<ApiResponse<ComplianceFlaggedCarrier[]>>(
      "/api/agent/carriers/flagged",
    );
    return res.data;
  },

  async ledger(page = 1, pageSize = 25): Promise<PaginatedResponse<LedgerEntry>> {
    return apiFetch<PaginatedResponse<LedgerEntry>>(
      `/api/agent/ledger?page=${page}&pageSize=${pageSize}`,
    );
  },

  ledgerExportUrl(): string {
    return `${API_BASE}/api/agent/ledger/export`;
  },
};
