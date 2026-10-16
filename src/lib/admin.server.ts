import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

// Hidden "studio" panel: lets the brand file the products that already exist in Shopify into collections.
// Everything runs on the server; the browser only ever holds a signed session cookie.

const COOKIE = "studio_session";
const SESSION_SECONDS = 60 * 60 * 8;

export type StudioProduct = { id: string; title: string; image: string; collectionIds: string[] };
export type StudioCollection = { id: string; title: string; handle: string; count: number };
export type StudioData = { products: StudioProduct[]; collections: StudioCollection[] };

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error("studio_not_configured");
  return value;
}

const encoder = new TextEncoder();

async function sign(text: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(env("ADMIN_SESSION_SECRET")), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  return [...new Uint8Array(mac)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison of two hex/plain strings. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hasSession(): Promise<boolean> {
  const raw = getCookie(COOKIE);
  if (!raw) return false;
  const [expires, mac] = raw.split(".");
  if (!expires || !mac || Number(expires) < Date.now() / 1000) return false;
  return safeEqual(mac, await sign(expires));
}

async function requireSession(): Promise<void> {
  if (!(await hasSession())) throw new Error("studio_unauthorized");
}

// Dev Dashboard apps get a 24h Admin token by exchanging their client id + secret.
let cachedToken: { value: string; expiresAt: number } | undefined;

async function adminToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const response = await fetch(`https://${env("SHOPIFY_ADMIN_SHOP")}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: env("SHOPIFY_ADMIN_CLIENT_ID"), client_secret: env("SHOPIFY_ADMIN_CLIENT_SECRET") }),
  });
  if (!response.ok) throw new Error("studio_shopify_auth");
  const json = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://${env("SHOPIFY_ADMIN_SHOP")}/admin/api/2026-01/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": await adminToken() },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error("studio_shopify_error");
  const json = (await response.json()) as { data?: T; errors?: unknown };
  if (json.errors || !json.data) throw new Error("studio_shopify_error");
  return json.data;
}

function failIfUserErrors(userErrors: { message: string }[] | undefined) {
  if (userErrors && userErrors.length > 0) throw new Error(`studio_${userErrors[0]!.message}`);
}

export const studioStatus = createServerFn({ method: "GET" }).handler(async () => ({ signedIn: await hasSession() }));

export const studioLogin = createServerFn({ method: "POST" })
  .validator((input: { password: string }) => input)
  .handler(async ({ data }) => {
    const ok = safeEqual(await sign(String(data.password ?? "")), await sign(env("ADMIN_PASSWORD")));
    if (!ok) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      throw new Error("studio_wrong_password");
    }
    const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
    setCookie(COOKIE, `${expires}.${await sign(expires)}`, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return { signedIn: true };
  });

export const studioLogout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { signedIn: false };
});

export const studioData = createServerFn({ method: "GET" }).handler(async (): Promise<StudioData> => {
  await requireSession();
  const data = await admin<{
    products: { nodes: { id: string; title: string; featuredImage: { url: string } | null; collections: { nodes: { id: string }[] } }[] };
    collections: { nodes: { id: string; title: string; handle: string; productsCount: { count: number } }[] };
  }>(`{
    products(first: 100, query: "status:active") { nodes { id title featuredImage { url } collections(first: 50) { nodes { id } } } }
    collections(first: 100) { nodes { id title handle productsCount { count } } }
  }`);
  return {
    products: data.products.nodes.map((p) => ({ id: p.id, title: p.title, image: p.featuredImage?.url ?? "", collectionIds: p.collections.nodes.map((c) => c.id) })),
    collections: data.collections.nodes.map((c) => ({ id: c.id, title: c.title, handle: c.handle, count: c.productsCount.count })),
  };
});

export const studioCreateCollection = createServerFn({ method: "POST" })
  .validator((input: { title: string }) => input)
  .handler(async ({ data }) => {
    await requireSession();
    const title = String(data.title ?? "").replace(/\s+/g, " ").trim();
    if (title.length < 2 || title.length > 80) throw new Error("studio_invalid_title");
    const created = await admin<{ collectionCreate: { collection: { id: string } | null; userErrors: { message: string }[] } }>(
      `mutation($title: String!) { collectionCreate(input: { title: $title }) { collection { id } userErrors { message } } }`,
      { title },
    );
    failIfUserErrors(created.collectionCreate.userErrors);
    const id = created.collectionCreate.collection!.id;
    // New collections must be published to the storefront channels or they stay invisible on the site.
    const pubs = await admin<{ publications: { nodes: { id: string; name: string }[] } }>(`{ publications(first: 20) { nodes { id name } } }`);
    const targets = pubs.publications.nodes.filter((p) => /headless|online store/i.test(p.name));
    if (targets.length > 0) {
      const published = await admin<{ publishablePublish: { userErrors: { message: string }[] } }>(
        `mutation($id: ID!, $input: [PublicationInput!]!) { publishablePublish(id: $id, input: $input) { userErrors { message } } }`,
        { id, input: targets.map((p) => ({ publicationId: p.id })) },
      );
      failIfUserErrors(published.publishablePublish.userErrors);
    }
    return { id };
  });

export const studioDeleteCollection = createServerFn({ method: "POST" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    await requireSession();
    if (!/^gid:\/\/shopify\/Collection\/\d+$/.test(data.id)) throw new Error("studio_invalid_id");
    const deleted = await admin<{ collectionDelete: { userErrors: { message: string }[] } }>(
      `mutation($id: ID!) { collectionDelete(input: { id: $id }) { userErrors { message } } }`,
      { id: data.id },
    );
    failIfUserErrors(deleted.collectionDelete.userErrors);
    return { ok: true };
  });

export const studioSetMembership = createServerFn({ method: "POST" })
  .validator((input: { collectionId: string; productId: string; member: boolean }) => input)
  .handler(async ({ data }) => {
    await requireSession();
    if (!/^gid:\/\/shopify\/Collection\/\d+$/.test(data.collectionId) || !/^gid:\/\/shopify\/Product\/\d+$/.test(data.productId)) throw new Error("studio_invalid_id");
    const mutation = data.member
      ? `mutation($id: ID!, $ids: [ID!]!) { collectionAddProducts(id: $id, productIds: $ids) { userErrors { message } } }`
      : `mutation($id: ID!, $ids: [ID!]!) { collectionRemoveProducts(id: $id, productIds: $ids) { userErrors { message } } }`;
    const result = await admin<Record<string, { userErrors: { message: string }[] }>>(mutation, { id: data.collectionId, ids: [data.productId] });
    failIfUserErrors(Object.values(result)[0]?.userErrors);
    return { ok: true };
  });
