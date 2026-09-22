// Verifies and handles inbound ApiPay webhooks. Kept separate from server.ts (the SSR entry) so the
// signature check — which needs the RAW request body, before any JSON parsing — stays isolated from
// the router. See src/lib/apipay.server.ts for background on what ApiPay is.

export const APIPAY_WEBHOOK_PATH = "/api/webhooks/apipay";

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

function bytesToHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison — crypto.subtle has no timingSafeEqual, so this is done by hand. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bytesA = hexToBytes(a);
  const bytesB = hexToBytes(b);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) diff |= (bytesA[i] ?? 0) ^ (bytesB[i] ?? 0);
  return diff === 0;
}

async function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): Promise<boolean> {
  if (!signatureHeader?.startsWith("sha256=")) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  return timingSafeEqualHex(bytesToHex(digest), signatureHeader.slice("sha256=".length));
}

type ApiPayWebhookPayload = {
  event: string;
  invoice?: { id: number; external_order_id?: string | null; status?: string; amount?: string; is_sandbox?: boolean };
  source?: string | null;
  timestamp?: string;
};

/**
 * Handles a POST to APIPAY_WEBHOOK_PATH. Returns a Response, or `undefined` if this request isn't
 * for us (caller should fall through to the normal app router in that case).
 */
export async function handleApiPayWebhook(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (url.pathname !== APIPAY_WEBHOOK_PATH || request.method !== "POST") return undefined;

  const secret = process.env["APIPAY_WEBHOOK_SECRET"];
  if (!secret) {
    console.error("ApiPay webhook received but APIPAY_WEBHOOK_SECRET is not configured");
    return new Response("Webhook not configured", { status: 500 });
  }

  const rawBody = await request.text();
  const valid = await verifySignature(rawBody, request.headers.get("x-webhook-signature"), secret);
  if (!valid) {
    console.error("ApiPay webhook: invalid signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: ApiPayWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Log just enough to debug delivery — no client name/phone (that's in the payload but is PII we
  // don't need in server logs).
  console.log("[apipay webhook]", payload.event, {
    invoiceId: payload.invoice?.id,
    status: payload.invoice?.status,
    externalOrderId: payload.invoice?.external_order_id,
    isSandbox: payload.invoice?.is_sandbox,
  });

  // TODO: once the Kaspi/ApiPay checkout flow is wired into the cart, react to
  // event === "invoice.status_changed" && invoice.status === "paid" here (mark the order paid).
  // Left as a no-op for now — this task only validates that ApiPay <-> our server round-trips.

  return new Response(null, { status: 200 });
}
