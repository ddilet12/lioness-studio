import { createServerFn } from "@tanstack/react-start";
import { createPaymentLink, ensureCatalogItems, isApiPayConfigured } from "@/lib/apipay.server";
import { getCart } from "@/lib/shopify.server";

export type KaspiCustomer = { name: string; phone: string; address: string; comment?: string };

const SITE_URL = (process.env["SITE_URL"] || "https://lionessdress.com").replace(/\/$/, "");

/** Shopify cart ids look like gid://shopify/Cart/<token>?key=<secret> — only the token may leave our server. */
function cartToken(cartId: string): string {
  const match = cartId.match(/\/Cart\/([^?]+)/);
  if (!match?.[1]) throw new Error("invalid_cart");
  return match[1];
}

/** Kazakhstani mobile number as +7XXXXXXXXXX. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const national = digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8")) ? digits.slice(1) : digits;
  if (!/^7\d{9}$/.test(national)) throw new Error("invalid_phone");
  return `+7${national}`;
}

function cleanText(raw: unknown, min: number, max: number, errorCode: string): string {
  const value = typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "";
  if (value.length < min || value.length > max) throw new Error(errorCode);
  return value;
}

async function shortHash(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].slice(0, 6).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const getPaymentMode = createServerFn({ method: "GET" }).handler(async () => ({ kaspi: isApiPayConfigured() }));

export const createKaspiPaymentLink = createServerFn({ method: "POST" })
  .validator((input: { cartId: string; customer: KaspiCustomer }) => input)
  .handler(async ({ data }) => {
    if (!isApiPayConfigured()) throw new Error("kaspi_unavailable");

    const name = cleanText(data.customer?.name, 2, 80, "invalid_name");
    const phone = normalizePhone(String(data.customer?.phone ?? ""));
    const address = cleanText(data.customer?.address, 6, 160, "invalid_address");
    const comment = data.customer?.comment ? cleanText(data.customer.comment, 1, 120, "invalid_comment") : "";

    const token = cartToken(data.cartId);
    const cart = await getCart({ data: data.cartId });
    if (!cart || cart.items.length === 0) throw new Error("empty_cart");

    // The amount always comes from the real Shopify cart, never from the browser.
    const amount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!(amount > 0)) throw new Error("empty_cart");

    const orderItems = cart.items.map((item) => ({
      title: `${item.name}${item.size ? ` (${item.size})` : ""}`,
      quantity: item.quantity,
      price: item.price,
    }));

    // Sizes of one dress share a catalog item; the sold price travels with each line.
    const catalogIds = await ensureCatalogItems(
      [...new Map(cart.items.map((item) => [item.slug, item])).values()].map((item) => ({
        name: item.name,
        sellingPrice: item.price,
        externalRef: item.slug,
      })),
    );
    const cartItems = cart.items.map((item) => {
      const catalogItemId = catalogIds.get(item.slug);
      if (!catalogItemId) throw new Error("catalog_unavailable");
      return { catalogItemId, count: item.quantity, price: item.price };
    });
    const description = `Lioness Dress: ${orderItems.map((item) => `${item.title} x${item.quantity}`).join(", ")}`;
    const internalComment = [name, phone, address, comment].filter(Boolean).join("; ");
    const fingerprint = await shortHash(JSON.stringify({ orderItems, amount, internalComment }));

    const link = await createPaymentLink({
      cartItems,
      description,
      externalOrderId: `ld-${token}`,
      idempotencyKey: `ld-${token}-${fingerprint}`,
      internalComment,
      orderItems,
      successUrl: `${SITE_URL}/?paid=1`,
      cancelUrl: `${SITE_URL}/`,
    });
    return { paymentUrl: link.payment_url };
  });
