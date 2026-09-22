// ApiPay.kz client — server-only. ApiPay is an independent third-party service layered on top of
// a merchant's own Kaspi Pay account; it is NOT an official Kaspi integration and is not affiliated
// with АО "Kaspi Bank". Never present it to users as one.
// Reference: https://apipay.kz/for-ai (playbook) and https://apipay.kz/openapi.json (verified schema).

export type ApiPayInvoiceStatus =
  | "processing"
  | "pending"
  | "cancelling"
  | "paid"
  | "cancelled"
  | "expired"
  | "error"
  | "partially_refunded";

export type ApiPayInvoice = {
  id: number;
  amount: string;
  status: ApiPayInvoiceStatus;
  description?: string | null;
  external_order_id?: string | null;
  phone_number?: string | null;
  is_sandbox: boolean;
  kaspi_invoice_id?: string | null;
  kaspi_qr_link?: string | null;
  error_code?: string | null;
  error_message?: string | null;
  paid_at?: string | null;
  created_at?: string;
};

export type ApiPayQrInvoice = ApiPayInvoice & {
  qr_token_url?: string;
  qr_image_url?: string;
  qr_expires_at?: string;
};

function getConfig() {
  const apiKey = process.env["APIPAY_API_KEY"];
  const baseUrl = process.env["APIPAY_BASE_URL"] || "https://api.apipay.kz/api/v1";
  if (!apiKey) {
    throw new Error("ApiPay is not configured — set APIPAY_API_KEY in .env (see .env.example)");
  }
  return { apiKey, baseUrl };
}

async function apipayRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { apiKey, baseUrl } = getConfig();
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = (body as { message?: string; error?: string })?.message
      ?? (body as { error?: string })?.error
      ?? `ApiPay request failed: ${response.status}`;
    throw new Error(`${message} (${response.status} ${path})`);
  }
  return body as T;
}

export type CreateQrInvoiceInput = {
  /** Whole or fractional tenge; QR invoices accept tiyn (POST /invoices does not). */
  amount: number;
  /** Shown as the line item name on the Kaspi QR receipt — Kaspi truncates at 100 chars. */
  description?: string;
  /** Our own order/cart reference, returned as-is on the invoice and in webhooks. */
  externalOrderId?: string;
  /** Prevents duplicate invoices if the request is retried for the same order. */
  externalOrderIdIdempotency?: string;
  /** Merchant-only note; never shown to the payer or sent to Kaspi. */
  internalComment?: string;
  /** Sandbox only: skip the QR entirely and create the invoice already in this terminal status. */
  simulate?: "paid" | "cancelled" | "expired";
};

/** POST /invoices/qr — an immediate, scan-to-pay QR invoice (TTL ~5 minutes per ApiPay's docs). */
export async function createQrInvoice(input: CreateQrInvoiceInput): Promise<ApiPayQrInvoice> {
  return apipayRequest<ApiPayQrInvoice>("/invoices/qr", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      description: input.description,
      external_order_id: input.externalOrderId,
      external_order_id_idempotency: input.externalOrderIdIdempotency,
      internal_comment: input.internalComment,
      simulate: input.simulate,
    }),
  });
}

export type CreatePhoneInvoiceInput = {
  /** Strict format 8XXXXXXXXXX (11 digits). */
  phoneNumber: string;
  /** Whole tenge only — fractional amounts are rejected with 422 amount_must_be_whole_tenge. */
  amount: number;
  description?: string;
  externalOrderId?: string;
};

/** POST /invoices — pushes a payment request to the buyer's Kaspi app by phone number (valid 24h). */
export async function createPhoneInvoice(input: CreatePhoneInvoiceInput): Promise<ApiPayInvoice> {
  return apipayRequest<ApiPayInvoice>("/invoices", {
    method: "POST",
    body: JSON.stringify({
      phone_number: input.phoneNumber,
      amount: input.amount,
      description: input.description,
      external_order_id: input.externalOrderId,
    }),
  });
}

/** GET /invoices/{id} — current status, amount, paid_at, error details. */
export async function getInvoice(id: number | string): Promise<ApiPayInvoice> {
  return apipayRequest<ApiPayInvoice>(`/invoices/${id}`);
}

/** POST /invoices/{id}/cancel */
export async function cancelInvoice(id: number | string): Promise<ApiPayInvoice> {
  return apipayRequest<ApiPayInvoice>(`/invoices/${id}/cancel`, { method: "POST" });
}

/**
 * POST /invoices/{invoice}/simulate-status — sandbox only (403 in production). Only valid from
 * `pending`, so it does not apply to a QR invoice already created with `simulate` set.
 */
export async function simulateInvoiceStatus(
  id: number | string,
  status: "paid" | "cancelled" | "expired" | "error" | "qr_scanned",
  errorMessage?: string,
): Promise<ApiPayInvoice> {
  return apipayRequest<ApiPayInvoice>(`/invoices/${id}/simulate-status`, {
    method: "POST",
    body: JSON.stringify({ status, error_message: errorMessage }),
  });
}

/** GET /webhook-logs?invoice_id= — programmatic proof a webhook was (or wasn't) delivered. */
export async function getWebhookLogs(invoiceId: number | string) {
  return apipayRequest<{ current_page: number; data: unknown[]; total: number }>(
    `/webhook-logs?invoice_id=${encodeURIComponent(String(invoiceId))}`,
  );
}
