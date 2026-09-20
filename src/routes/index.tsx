import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Plus } from "lucide-react";
import heroImage from "@/assets/lioness-hero.jpg";
import campaignImage from "@/assets/lioness-campaign.jpg";
import storyImage from "@/assets/lioness-story.jpg";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { lines, useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { getProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/")({
  loader: () => getProducts(),
  head: () => ({
    meta: [
      { title: "Lioness Dress — Black Angel Collection" },
      { name: "description", content: "Lioness Dress luxury eveningwear. Discover the Black Angel collection, from Astana to Paris." },
      { property: "og:title", content: "Lioness Dress — Black Angel Collection" },
      { property: "og:description", content: "Luxury evening dresses designed between Astana and Paris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const products = Route.useLoaderData();
  const [filter, setFilter] = useState<"ALL" | "BLACK" | "RED">("ALL");
  const visibleProducts = products.filter((product) => filter === "ALL" || product.color === filter);
  const { addToBag, toggleWishlist, isWishlisted } = useShop();
  const { t } = useI18n();
  const filterLabels = { ALL: t("collection.all"), BLACK: t("collection.black"), RED: t("collection.red") } as const;
  const heroImageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Subtle parallax: the hero photo lags slightly behind scroll, capped and rAF-throttled.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 70);
        if (heroImageWrapRef.current) heroImageWrapRef.current.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <main>
    <section className="hero" aria-label={t("hero.label")}>
      <div className="hero__image-wrap" ref={heroImageWrapRef}>
        <img className="hero__image" src={heroImage} alt={t("hero.alt")} width={1536} height={1920} />
      </div>
      <div className="hero__shade" />
      <div className="hero__copy">
        <p className="eyebrow">{t("hero.eyebrow")}</p>
        <h1>BLACK<br />ANGEL</h1>
        <Link to="/" hash="collection" className="text-link text-link--light">{t("hero.cta")} <span>→</span></Link>
      </div>
      <div className="hero__meta"><span>{t("hero.meta")}</span><i /><span>01 / 03</span></div>
    </section>

    <section className="manifesto section-pad" data-reveal>
      <p className="eyebrow">{t("manifesto.eyebrow")}</p>
      <div className="manifesto__grid">
        <h2>{lines(t("manifesto.title.a"))}<span>{t("manifesto.title.b")}</span></h2>
        <p>{lines(t("manifesto.body"))}</p>
      </div>
    </section>

    <section id="collection" className="collection section-pad" data-reveal>
      <div className="collection__head">
        <div><p className="eyebrow">{t("collection.eyebrow")}</p><h2>{t("collection.title")}</h2></div>
        <div className="filters" aria-label={t("collection.filterLabel")}>
          {(["ALL", "BLACK", "RED"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{filterLabels[value]}</button>)}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => <Link to="/product/$slug" params={{ slug: product.slug }} className="product-card" key={product.slug}>
          <div className="product-card__image">
            <span>{t("product.new")}</span>
            <button
              type="button"
              className={`product-card__wish ${isWishlisted(product.slug) ? "is-active" : ""}`}
              aria-label={isWishlisted(product.slug) ? t("product.wishRemove") : t("product.wishAdd")}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleWishlist({ slug: product.slug, name: product.name, price: product.price, image: product.image });
              }}
            >
              <Heart />
            </button>
            <img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" />
            <Button
              variant="luxury"
              size="plain"
              className="product-card__quick-add"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                addToBag(product);
              }}
            >
              <Plus /> {t("product.addToBag")}
            </Button>
          </div>
          <h3>{product.name}</h3><p>{formatPrice(product.price)}</p>
        </Link>)}
      </div>
    </section>

    <section className="campaign" data-reveal>
      <img src={campaignImage} alt={t("campaign.alt")} width={1920} height={1280} loading="lazy" />
      <div className="campaign__shade" />
      <div className="campaign__copy"><p className="eyebrow">{t("campaign.eyebrow")}</p><h2>{lines(t("campaign.title"))}</h2><Link to="/product/$slug" params={{ slug: "the-asymmetric" }} className="text-link text-link--light">{t("campaign.cta")} <span>→</span></Link></div>
    </section>

    <section id="story" className="story section-pad" data-reveal>
      <div className="story__title"><p className="eyebrow">{t("story.eyebrow")}</p><h2>{lines(t("story.title"))}</h2></div>
      <img src={storyImage} alt={t("story.alt")} width={1024} height={1280} loading="lazy" />
      <div className="story__copy"><p>{lines(t("story.body"))}</p><Link to="/" hash="story" className="text-link">{t("story.cta")} <span>→</span></Link></div>
    </section>
  </main>;
}