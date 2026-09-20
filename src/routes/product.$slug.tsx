import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getProductByHandle } from "@/lib/shopify.server";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await getProductByHandle({ data: params.slug });
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Lioness Dress` : "Dress not found — Lioness Dress" },
      { name: "description", content: loaderData?.description ?? "Explore Lioness Dress eveningwear." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — Lioness Dress` : "Lioness Dress" },
      { property: "og:description", content: loaderData?.description ?? "Explore Lioness Dress eveningwear." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const { addToBag, toggleWishlist, isWishlisted } = useShop();
  const { t } = useI18n();
  const wishlisted = isWishlisted(product.slug);
  return <main className="product-page">
    <div className="product-page__image"><img src={product.image} alt={product.name} width={1024} height={1280} /></div>
    <section className="product-page__details">
      <p className="eyebrow">{t("pdp.eyebrow")}</p>
      <div className="product-page__title-row">
        <h1>{product.name}</h1>
        <button
          type="button"
          className={`product-page__wish ${wishlisted ? "is-active" : ""}`}
          aria-label={wishlisted ? t("product.wishRemove") : t("product.wishAdd")}
          onClick={() => toggleWishlist({ slug: product.slug, name: product.name, price: product.price, image: product.image })}
        >
          <Heart />
        </button>
      </div>
      <p className="product-page__price">{formatPrice(product.price)}</p>
      <p className="product-page__description">{product.description}</p>
      <div className="size-row"><span>{t("pdp.size")}</span>{["XS", "S", "M", "L"].map((size) => <Button key={size} variant="quantity" size="iconSlim">{size}</Button>)}</div>
      <div className="product-page__actions"><div className="quantity-control"><Button variant="quantity" size="iconSlim" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label={t("pdp.decrease")}><Minus /></Button><span>{quantity}</span><Button variant="quantity" size="iconSlim" onClick={() => setQuantity(quantity + 1)} aria-label={t("pdp.increase")}><Plus /></Button></div><Button variant="luxury" size="wide" onClick={() => addToBag(product, quantity)}>{t("product.addToBag")}</Button></div>
      <Link to="/" hash="collection" className="text-link">{t("pdp.back")}</Link>
    </section>
  </main>;
}