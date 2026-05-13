// Typed API client for the Property Tax Appeal AI backend.
export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "https://taxappeal.app";

export const TOS_VERSION = "2026-05-04";

export type Subject = {
  pin: string;
  pin_formatted: string;
  county: string;
  township: string;
  property_class: string;
  address: string;
  assessed_value: number;
  sqft: number;
  year_built: number;
  lot_sqft: number;
  av_per_sqft: number;
};

export type Cohort = {
  size: number;
  median_assessed_value: number;
  median_av_per_sqft: number;
  subject_av_per_sqft_percentile: number;
  uniformity_gap_pct: number;
  appears_over_assessed: boolean;
};

export type Comparable = {
  pin: string;
  pin_formatted: string;
  address: string;
  township: string;
  property_class: string;
  assessed_value: number;
  sqft: number;
  year_built: number;
  lot_sqft: number;
  similarity_score: number;
  av_gap_dollars: number;
  av_per_sqft_gap: number;
};

export type ComparablesResponse = {
  lookup_id: string;
  subject: Subject;
  cohort: Cohort;
  comparables: Comparable[];
  price_cents: number;
  methodology_version: string;
};

export type ConsentResponse = {
  consent_id: string;
  parcel: { pin_formatted: string; address: string; county: string };
  fee_cents: number;
  next_step: { type: string; post_to: string };
};

export type CheckoutResponse = {
  checkout_url: string;
  session_id: string;
  payment_id: string;
  mode: "live" | "test" | "scaffold";
};

export type RedactedComp = {
  direction: string;
  approximate_distance_miles: number;
  sqft: number;
  lot_sqft: number;
  year_built: number;
  assessed_value: number;
  similarity_score: number;
};

export type ReportResponse = {
  report_id: string;
  status: string;
  share_token: string;
  property: { pin_formatted: string; address: string; county: string; township: string };
  data_report_pdf_url: string;
  appeal_template_url: string;
  filing_instructions_url: string;
  comparables: RedactedComp[];
  filing: { county: string; form_name: string; deadline_iso: string };
};

export type ParcelSearchResult = {
  county: string;
  pin: string;
  pin_formatted: string;
  site_address: string;
  owner_name: string | null;
  township: string | null;
  property_class: string | null;
  assessed_value: number | null;
  serviceable: boolean;
  display_name: string;
};

export type ParcelSearchResponse = {
  count: number;
  results: ParcelSearchResult[];
};

export type ReportByConsentResponse =
  | { status: "awaiting_payment" }
  | { status: "generating" }
  | { status: "payment_failed"; reason?: string }
  | { status: "ready"; report: ReportResponse };

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any, message?: string) {
    super(message ?? body?.error ?? `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  let body: any = null;
  const text = await res.text();
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

export const api = {
  comparables: (pin: string) =>
    request<ComparablesResponse>("/api/comparables", {
      method: "POST",
      body: JSON.stringify({ pin }),
    }),
  consent: (input: {
    lookup_id: string;
    customer_name: string;
    customer_email: string;
  }) =>
    request<ConsentResponse>("/api/consent", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        tos_version: TOS_VERSION,
        tos_accepted: true,
      }),
    }),
  checkout: (input: { consent_id: string; success_url: string; cancel_url: string }) =>
    request<CheckoutResponse>("/api/checkout", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  reportByToken: (share_token: string) =>
    request<ReportResponse>(`/api/reports/${encodeURIComponent(share_token)}`),
  reportByConsent: (consent_id: string, signal?: AbortSignal) =>
    request<ReportByConsentResponse>(
      `/api/reports/by-consent/${encodeURIComponent(consent_id)}`,
      { method: "GET", signal },
    ),
  parcelSearch: (q: string, limit = 8, signal?: AbortSignal) =>
    request<ParcelSearchResponse>(
      `/api/parcels/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      { method: "GET", signal },
    ),
};
