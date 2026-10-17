import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import heroWide from "@/assets/lioness-hero-wide.jpg";
import heroTall from "@/assets/lioness-hero-tall.jpg";
import campaignImage from "@/assets/lioness-campaign.jpg";
import storyImage from "@/assets/lioness-story.jpg";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { lines, useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getCollections, getProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [products, collections] = await Promise.all([
      getProducts().catch((error) => {
        console.error("Shopify products unavailable", error);
        return [];
      }),
      getCollections().catch((error) => {
        console.error("Shopify collections unavailable", error);
        return [];
      }),
    ]);
    return { products, collections };
  },
  head: () => ({
    meta: [
      { title: "Lioness Dress — Black Angel Collection" },
      { name: "description", content: "Lioness Dress luxury eveningwear. Discover the Black Angel collection, from Astana to Paris." },
      { property: "og:title", content: "Lioness Dress — Black Angel Collection" },
      { property: "og:description", content: "Luxury evening dresses designed between Astana and Paris." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://lionessdress.com/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://lionessdress.com/og-image.jpg" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { color?: "black" | "red"; collection?: string } => {
    const color = search["color"] === "black" || search["color"] === "red" ? search["color"] : undefined;
    const collection = typeof search["collection"] === "string" && /^[a-z0-9-]{1,80}$/.test(search["collection"]) ? search["collection"] : undefined;
    return { ...(color ? { color } : {}), ...(collection ? { collection } : {}) };
  },
  component: Index,
});

function Index() {
  const { products, collections } = Route.useLoaderData();
  const { color, collection } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const filter = color === "black" ? "BLACK" : color === "red" ? "RED" : "ALL";
  const setFilter = (value: "ALL" | "BLACK" | "RED") =>
    navigate({ search: value === "ALL" ? {} : { color: value === "BLACK" ? "black" : "red" }, hash: "collection", resetScroll: false });
  const activeCollection = collections.find((c) => c.handle === collection);
  const visibleProducts = products.filter((product) =>
    activeCollection ? activeCollection.productHandles.includes(product.slug) : filter === "ALL" || product.color === filter,
  );
  const { toggleWishlist, isWishlisted } = useShop();
  const { t } = useI18n();
  const filterLabels = { ALL: t("collection.all"), BLACK: t("collection.black"), RED: t("collection.red") } as const;
  return <main>
    <section className="hero" aria-label={t("hero.label")}>
      <div className="hero__image-wrap">
        <picture>
          <source media="(min-width: 701px)" srcSet={heroWide} width={1280} height={720} />
          <img className="hero__image" src={heroTall} alt="Woman in a black dress under an LD umbrella in a Paris garden" width={853} height={1280} />
        </picture>
      </div>
      <div className="hero__shade" />
      <div className="hero__copy">
        <p className="eyebrow">{t("hero.eyebrow")}</p>
        <h1>BLACK<br />ANGEL</h1>
        <Link to="/" hash="collection" className="text-link text-link--light">{t("hero.cta")} <span>→</span></Link>
      </div>
      <div className="hero__meta"><span>{t("hero.meta")}</span><i /><span>01 / 03</span></div>
    </section>

    <section className="manifesto section-pad">
      <p className="eyebrow">{t("manifesto.eyebrow")}</p>
      <div className="manifesto__grid">
        <h2>{lines(t("manifesto.title.a"))}<span>{t("manifesto.title.b")}</span></h2>
        <p>{lines(t("manifesto.body"))}</p>
      </div>
    </section>

    <section id="collection" className="collection section-pad">
      <div className="collection__head">
        <div><p className="eyebrow">{t("collection.eyebrow")}</p><h2>{t("collection.title")}</h2></div>
        <div className="filters" aria-label={t("collection.filterLabel")}>
          {(["ALL", "BLACK", "RED"] as const).map((value) => <button key={value} className={!activeCollection && filter === value ? "active" : ""} onClick={() => setFilter(value)}>{filterLabels[value]}</button>)}
          {collections.map((c) => <button key={c.handle} className={activeCollection?.handle === c.handle ? "active" : ""} onClick={() => navigate({ search: { collection: c.handle }, hash: "collection", resetScroll: false })}>{c.title}</button>)}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </section>

    <section className="campaign">
      <img src={campaignImage} alt={t("campaign.alt")} width={1024} height={1536} loading="lazy" />
      <div className="campaign__shade" />
      <div className="campaign__copy"><p className="eyebrow">{t("campaign.eyebrow")}</p><h2>{lines(t("campaign.title"))}</h2><Link to="/product/$slug" params={{ slug: "the-asymmetric" }} className="text-link text-link--light">{t("campaign.cta")} <span>→</span></Link></div>
    </section>

    <section id="story" className="story section-pad">
      <div className="story__title"><p className="eyebrow">{t("story.eyebrow")}</p><h2>{lines(t("story.title"))}</h2></div>
      <img src={storyImage} alt={t("story.alt")} width={1024} height={1280} loading="lazy" />
      <div className="story__copy">{t("story.body").split("\n\n").map((paragraph) => <p key={paragraph}>{lines(paragraph)}</p>)}<Link to="/" hash="story" className="text-link">{t("story.cta")} <span>→</span></Link></div>
    </section>
  </main>;
}