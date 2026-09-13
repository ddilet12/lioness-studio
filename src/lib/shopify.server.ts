import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import { createServerFn } from "@tanstack/react-start";
import type { Product } from "@/lib/products";

export type ShopifyProduct = Product & { variantId: string };

export type ShopifyCartItem = {
  lineId: string;
  variantId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  items: ShopifyCartItem[];
};

function getClient() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const publicAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-01";

  if (!storeDomain || !publicAccessToken) {
    throw new Error(
      "Shopify Storefront API is not configured — set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env",
    );
  }

  return createStorefrontApiClient({ storeDomain, apiVersion, publicAccessToken });
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            price { amount }
            product { title handle featuredImage { url } }
          }
        }
      }
    }
  }
`;

function deriveColor(tags: string[]): Product["color"] {
  return tags.some((tag) => tag.toUpperCase() === "RED") ? "RED" : "BLACK";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(node: any): ShopifyProduct {
  return {
    slug: node.handle,
    name: node.title,
    price: Number(node.priceRange.minVariantPrice.amount),
    color: deriveColor(node.tags ?? []),
    image: node.featuredImage?.url ?? "",
    description: node.description ?? "",
    variantId: node.variants.edges[0]?.node.id ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCart(cart: any): ShopifyCart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: cart.lines.edges.map(({ node }: any) => ({
      lineId: node.id,
      variantId: node.merchandise.id,
      slug: node.merchandise.product.handle,
      name: node.merchandise.product.title,
      price: Number(node.merchandise.price.amount),
      image: node.merchandise.product.featuredImage?.url ?? "",
      quantity: node.quantity,
    })),
  };
}

async function fetchProducts(): Promise<ShopifyProduct[]> {
  const client = getClient();
  const { data, errors } = await client.request(
    `query Products($first: Int!) {
      products(first: $first) {
        edges {
          node {
            handle
            title
            description
            tags
            featuredImage { url }
            priceRange { minVariantPrice { amount } }
            variants(first: 1) { edges { node { id } } }
          }
        }
      }
    }`,
    { variables: { first: 24 } },
  );
  if (errors) throw new Error(errors.message ?? "Failed to load products from Shopify");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data?.products.edges ?? []).map(({ node }: any) => mapProduct(node));
}

async function fetchProductByHandle(handle: string): Promise<ShopifyProduct | undefined> {
  const client = getClient();
  const { data, errors } = await client.request(
    `query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        handle
        title
        description
        tags
        featuredImage { url }
        priceRange { minVariantPrice { amount } }
        variants(first: 1) { edges { node { id } } }
      }
    }`,
    { variables: { handle } },
  );
  if (errors) throw new Error(errors.message ?? "Failed to load product from Shopify");
  return data?.productByHandle ? mapProduct(data.productByHandle) : undefined;
}

async function createCart(variantId: string, quantity: number): Promise<ShopifyCart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { variables: { lines: [{ merchandiseId: variantId, quantity }] } },
  );
  const userError = data?.cartCreate?.userErrors?.[0]?.message;
  if (errors || userError) throw new Error(userError ?? errors?.message ?? "Failed to create cart");
  return mapCart(data.cartCreate.cart);
}

async function addCartLine(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] } },
  );
  const userError = data?.cartLinesAdd?.userErrors?.[0]?.message;
  if (errors || userError) throw new Error(userError ?? errors?.message ?? "Failed to add to cart");
  return mapCart(data.cartLinesAdd.cart);
}

async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { variables: { cartId, lines: [{ id: lineId, quantity }] } },
  );
  const userError = data?.cartLinesUpdate?.userErrors?.[0]?.message;
  if (errors || userError) throw new Error(userError ?? errors?.message ?? "Failed to update cart");
  return mapCart(data.cartLinesUpdate.cart);
}

async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
  const client = getClient();
  const { data, errors } = await client.request(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    { variables: { cartId, lineIds: [lineId] } },
  );
  const userError = data?.cartLinesRemove?.userErrors?.[0]?.message;
  if (errors || userError) throw new Error(userError ?? errors?.message ?? "Failed to remove cart line");
  return mapCart(data.cartLinesRemove.cart);
}

async function fetchCart(cartId: string): Promise<ShopifyCart | undefined> {
  const client = getClient();
  const { data, errors } = await client.request(
    `query Cart($cartId: ID!) { cart(id: $cartId) { ${CART_FIELDS} } }`,
    { variables: { cartId } },
  );
  if (errors) throw new Error(errors.message ?? "Failed to load cart");
  return data?.cart ? mapCart(data.cart) : undefined;
}

export const getProducts = createServerFn({ method: "GET" }).handler(async () => fetchProducts());

export const getProductByHandle = createServerFn({ method: "GET" })
  .validator((handle: string) => handle)
  .handler(async ({ data: handle }) => fetchProductByHandle(handle));

export const getCart = createServerFn({ method: "GET" })
  .validator((cartId: string) => cartId)
  .handler(async ({ data: cartId }) => fetchCart(cartId));

type AddToCartInput = { cartId?: string; variantId: string; quantity: number };

export const addToCart = createServerFn({ method: "POST" })
  .validator((input: AddToCartInput) => input)
  .handler(async ({ data }) =>
    data.cartId ? addCartLine(data.cartId, data.variantId, data.quantity) : createCart(data.variantId, data.quantity),
  );

type UpdateCartLineInput = { cartId: string; lineId: string; quantity: number };

export const updateCartLineQuantity = createServerFn({ method: "POST" })
  .validator((input: UpdateCartLineInput) => input)
  .handler(async ({ data }) => updateCartLine(data.cartId, data.lineId, data.quantity));

type RemoveCartLineInput = { cartId: string; lineId: string };

export const removeFromCart = createServerFn({ method: "POST" })
  .validator((input: RemoveCartLineInput) => input)
  .handler(async ({ data }) => removeCartLine(data.cartId, data.lineId));
