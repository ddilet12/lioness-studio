import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { translateFor, useI18n } from "@/lib/i18n";
import { fallbackDescriptionKey, formatPrice, SIZES } from "@/lib/products";
import { getProductByHandle } from "@/lib/shopify.server";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = await getProductByHandle({ data: params.slug });
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const fallbackKey = loaderData ? fallbackDescriptionKey(loaderData) : undefined;
    const description = fallbackKey ? translateFor("en", fallbackKey) : (loaderData?.description || "Explore Lioness Dress eveningwear.");
    return {
      meta: [
        { title: loaderData ? `${loaderData.name} — Lioness Dress` : "Dress not found — Lioness Dress" },
        { name: "description", content: description },
        { property: "og:title", content: loaderData ? `${loaderData.name} — Lioness Dress` : "Lioness Dress" },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<string | null>(null);
  const [sizeMissing, setSizeMissing] = useState(false);
  const { addToBag, toggleWishlist, isWishlisted } = useShop();
  const { t } = useI18n();
  const wishlisted = isWishlisted(product.slug);
  const fallbackKey = fallbackDescriptionKey(product);
  const description = fallbackKey ? t(fallbackKey) : product.description;
  const handleAdd = () => {
    if (!size) {
      setSizeMissing(true);
      return;
    }
    void addToBag(product, quantity, size);
  };
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
      <p className="product-page__description">{description}</p>
      <div className="size-row" role="group" aria-label={t("pdp.size")}>
        <span>{t("pdp.size")}</span>
        {SIZES.map((option) => (
          <Button
            key={option}
            variant="quantity"
            size="iconSlim"
            aria-pressed={size === option}
            disabled={!product.available}
            onClick={() => { setSize(option); setSizeMissing(false); }}
          >
            {option}
          </Button>
        ))}
        <Link to="/size-guide" className="size-row__guide">{t("footer.sizeGuide")}</Link>
      </div>
      {sizeMissing && <p className="size-hint" role="alert">{t("pdp.chooseSize")}</p>}
      <div className="product-page__actions"><div className="quantity-control"><Button variant="quantity" size="iconSlim" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label={t("pdp.decrease")}><Minus /></Button><span>{quantity}</span><Button variant="quantity" size="iconSlim" onClick={() => setQuantity(quantity + 1)} aria-label={t("pdp.increase")}><Plus /></Button></div><Button variant="luxury" size="wide" disabled={!product.available} onClick={handleAdd}>{product.available ? t("product.addToBag") : t("product.soon")}</Button></div>
      <Link to="/" hash="collection" className="text-link">{t("pdp.back")}</Link>
    </section>
  </main>;
}