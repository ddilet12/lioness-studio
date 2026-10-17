import type { TKey } from "@/lib/i18n";

export type Product = {
  slug: string;
  name: string;
  price: number;
  color: "BLACK" | "RED";
  image: string;
  /** Every photo of the product, in Shopify order; falls back to [image] when Shopify has just one. */
  images: string[];
  description: string;
  /** False while the item has no stock in Shopify: the storefront shows it as "coming soon". */
  available: boolean;
};

export const SIZES = ["XS", "S", "M", "L"] as const;

/** Prices are stored in Shopify in KZT (₸). */
const priceFormat = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
const exactPriceFormat = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// Whole-tenge prices stay as they are; a price with tiyn is shown exactly, never rounded.
export const formatPrice = (price: number) =>
  `${(Math.abs(price - Math.round(price)) > 0.004 ? exactPriceFormat : priceFormat).format(price)} ₸`;

/** Temporary Shopify titles carry a "(заглушка)" suffix; never show it to shoppers. */
export const cleanProductName = (name: string) => name.replace(/\s*\(заглушка\)\s*$/i, "").trim();

const isPlaceholderText = (text: string) => !text.trim() || /заглушк/i.test(text);

// Written from what is visible in the product photography; replaced automatically once real copy is set in Shopify.
const DESCRIPTION_KEYS: Record<string, TKey> = {
  "the-asymmetric": "desc.asymmetric",
  "black-angel-midi": "desc.midi",
  "rouge-obsession": "desc.rouge",
  "velvet-rebellion": "desc.velvet",
};

/** Key of the built-in description to show instead of a placeholder Shopify description, if there is one. */
export function fallbackDescriptionKey(product: Pick<Product, "slug" | "description">): TKey | undefined {
  if (!isPlaceholderText(product.description)) return undefined;
  const prefix = Object.keys(DESCRIPTION_KEYS).find((key) => product.slug.startsWith(key));
  return prefix ? DESCRIPTION_KEYS[prefix] : undefined;
}
