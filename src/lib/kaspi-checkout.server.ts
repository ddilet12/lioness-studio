import { createServerFn } from "@tanstack/react-start";
import {
  createCatalogItems,
  createPhoneInvoice,
  createQrInvoice,
  findCatalogItemsByExternalRefs,
  getInvoice,
} from "@/lib/apipay.server";
import { getCart, type ShopifyCartItem } from "@/lib/shopify.server";

/** Maps each cart line to an ApiPay catalog item (by product slug), creating it in Kaspi's catalog if missing. */
async function resolveCartItems(items: ShopifyCartItem[]) {
  const slugs = [...new Set(items.map((item) => item.slug))];
  const existing = await findCatalogItemsByExternalRefs(slugs);
  const bySlug = new Map(existing.map((entry) => [entry.external_ref ?? "", entry]));

  const missing = items.filter((item) => !bySlug.has(item.slug));
  if (missing.length > 0) {
    const uniqueMissing = [...new Map(missing.map((item) => [item.slug, item])).values()];
    const created = await createCatalogItems(
      uniqueMissing.map((item) => ({ name: item.name, sellingPrice: item.price, externalRef: item.slug })),
    );
    for (const entry of created) if (entry.external_ref) bySlug.set(entry.external_ref, entry);
  }

  return items.map((item) => {
    const catalogItem = bySlug.get(item.slug);
    if (!catalogItem) throw new Error(`Could not create or find an ApiPay catalog item for "${item.slug}"`);
    return { catalogItemId: catalogItem.id, count: item.quantity, price: item.price };
  });
}

/** Kazakhstani phone in ApiPay's required format: leading 8, 11 digits total. */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withLeading8 = digits.length === 11 && digits.startsWith("7") ? `8${digits.slice(1)}` : digits;
  if (!/^8\d{10}$/.test(withLeading8)) {
    throw new Error("Введите номер в формате 8 7XX XXX XX XX");
  }
  return withLeading8;
}

async function loadCartTotals(cartId: string) {
  const cart = await getCart({ data: cartId });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");
  const amount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const description = cart.items
    .map((item) => `${item.name}${item.size ? ` ${item.size}` : ""} x${item.quantity}`)
    .join(", ")
    .slice(0, 100);
  return { amount, description };
}

export const createKaspiQrPayment = createServerFn({ method: "POST" })
  .validator((input: { cartId: string }) => input)
  .handler(async ({ data }) => {
    const cart = await getCart({ data: data.cartId });
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");
    const { description } = await loadCartTotals(data.cartId);
    const cartItems = await resolveCartItems(cart.items);
    const invoice = await createQrInvoice({ cartItems, description, externalOrderId: data.cartId });
    return invoice;
  });

export const createKaspiPhonePayment = createServerFn({ method: "POST" })
  .validator((input: { cartId: string; phoneNumber: string }) => input)
  .handler(async ({ data }) => {
    const { amount, description } = await loadCartTotals(data.cartId);
    const phoneNumber = normalizePhone(data.phoneNumber);
    const invoice = await createPhoneInvoice({ amount, phoneNumber, description, externalOrderId: data.cartId });
    return invoice;
  });

export const getKaspiPaymentStatus = createServerFn({ method: "GET" })
  .validator((invoiceId: number) => invoiceId)
  .handler(async ({ data: invoiceId }) => getInvoice(invoiceId));
