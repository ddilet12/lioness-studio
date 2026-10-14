// ApiPay.kz client — server-only. ApiPay is an independent third-party service layered on top of
// a merchant's own Kaspi Pay account; it is NOT an official Kaspi integration and is not affiliated
// with АО "Kaspi Bank". Never present it to users as one.
// Reference: https://apipay.kz/for-ai and https://apipay.kz/openapi.json

const DEFAULT_BASE_URL = "https://api.apipay.kz/api/v1";

export type ApiPayOrderItem = { title: string; quantity: number; price: number };

/** This ApiPay organization runs in "catalog" mode: every sold line must point at a catalog item. */
export type ApiPayCartItem = { catalogItemId: number; count: number; price: number };

type CatalogItemInput = { name: string; sellingPrice: number; externalRef: string };

/** Unit id 1 = "шт." (piece) — see GET /catalog/units. */
const PIECE_UNIT_ID = 1;

export type ApiPayPaymentLink = {
  static_qr_id: number;
  payment_url: string;
  status: string;
  amount: string;
  external_order_id?: string | null;
};

export type CreatePaymentLinkInput = {
  /** Cart lines, built on the server from the real Shopify cart — the payable amount is derived from these. */
  cartItems: ApiPayCartItem[];
  /** Shown on the payment page and Kaspi receipt line — ApiPay caps static-link descriptions at 60 chars. */
  description: string;
  /** Our order/cart reference, returned as-is on the invoice and in webhooks. */
  externalOrderId: string;
  /** Makes a repeated request for the same order return the same link instead of a duplicate. */
  idempotencyKey: string;
  /** Merchant-only note (max 255): never shown to the payer or sent to Kaspi. */
  internalComment: string;
  orderItems: ApiPayOrderItem[];
  successUrl: string;
  cancelUrl: string;
};

export function isApiPayConfigured(): boolean {
  return Boolean(process.env["APIPAY_API_KEY"]) && process.env["APIPAY_ENABLED"] !== "false";
}

async function apipayRequest<T>(path: string, init?: RequestInit): Promise<{ status: number; body: T }> {
  const apiKey = process.env["APIPAY_API_KEY"];
  if (!apiKey) throw new Error("ApiPay is not configured — set APIPAY_API_KEY (see .env.example)");
  const baseUrl = process.env["APIPAY_BASE_URL"] || DEFAULT_BASE_URL;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-API-Key": apiKey, ...init?.headers },
  });
  const body = (await response.json().catch(() => undefined)) as T;
  return { status: response.status, body };
}

/**
 * POST /catalog — registers products in the ApiPay catalog. It is safe to repeat: an item with the same
 * external_ref comes back as "matched" with its existing id, so this doubles as a lookup.
 */
export async function ensureCatalogItems(items: CatalogItemInput[]): Promise<Map<string, number>> {
  const { status, body } = await apipayRequest<{ data?: { id: number; external_ref?: string | null }[]; rejected?: unknown[] }>(
    "/catalog",
    {
      method: "POST",
      body: JSON.stringify({
        items: items.map((item) => ({
          name: item.name,
          selling_price: item.sellingPrice,
          unit_id: PIECE_UNIT_ID,
          external_ref: item.externalRef,
        })),
      }),
    },
  );
  if ((status !== 200 && status !== 201 && status !== 202) || !body?.data) {
    throw new Error(`ApiPay catalog request failed (${status})`);
  }
  const ids = new Map<string, number>();
  for (const entry of body.data) if (entry.external_ref) ids.set(entry.external_ref, entry.id);
  return ids;
}

/**
 * POST /invoices/qr with `static: true` — a one-time payment page. No Kaspi invoice exists until the
 * buyer presses "Pay" there, and it works from a phone (opens the Kaspi app) as well as a desktop.
 */
export async function createPaymentLink(input: CreatePaymentLinkInput): Promise<ApiPayPaymentLink> {
  const { status, body } = await apipayRequest<ApiPayPaymentLink & { error?: string; message?: string }>(
    "/invoices/qr",
    {
      method: "POST",
      body: JSON.stringify({
        static: true,
        single_use: true,
        cart_items: input.cartItems.map((item) => ({ catalog_item_id: item.catalogItemId, count: item.count, price: item.price })),
        description: input.description.slice(0, 60),
        external_order_id: input.externalOrderId,
        external_order_id_idempotency: input.idempotencyKey,
        internal_comment: input.internalComment.slice(0, 255),
        order_items: input.orderItems,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
      }),
    },
  );
  // A repeated request for the same order answers 409 idempotency_conflict and carries the original link.
  if (body?.payment_url && (status === 201 || status === 200 || status === 409)) return body;
  throw new Error(body?.message ?? body?.error ?? `ApiPay request failed (${status})`);
}
