import { createFileRoute, Link } from "@tanstack/react-router";
import campaignImage from "@/assets/lioness-campaign.jpg";
import heroTall from "@/assets/lioness-hero-tall.jpg";
import storyImage from "@/assets/lioness-story.jpg";
import { ProductCard } from "@/components/product-card";
import { useI18n } from "@/lib/i18n";
import { getLookbook, getProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/lookbook")({
  loader: async () => {
    const [products, collections] = await Promise.all([getProducts().catch(() => []), getLookbook().catch(() => [])]);
    return { products, collections };
  },
  head: () => ({ meta: [{ title: "Lookbook — Lioness Dress" }] }),
  component: Lookbook,
});

function Lookbook() {
  const { products, collections } = Route.useLoaderData();
  const { t } = useI18n();
  const looks = [
    { src: heroTall, alt: "Woman in a black dress under an LD umbrella in a Paris garden" },
    { src: campaignImage, alt: t("campaign.alt") },
    { src: storyImage, alt: t("story.alt") },
  ];
  return (
    <main className="section-page lookbook">
      <p className="eyebrow">LIONESS DRESS</p>
      <h1>{t("nav.lookbook")}</h1>
      <p className="section-page__intro">{t("lookbook.intro")}</p>

      <div className="lookbook__looks">
        {looks.map((look) => (
          <img key={look.src} src={look.src} alt={look.alt} width={853} height={1280} loading="lazy" />
        ))}
      </div>

      <section className="lookbook__collection">
        <h2>BLACK ANGEL</h2>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {collections.map((collection) => (
        <section key={collection.handle} className="lookbook__collection">
          <h2>{collection.title}</h2>
          <div className="product-grid">
            {collection.products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      ))}

      <Link to="/" hash="collection" className="text-link section-page__back">
        {t("section.backToShop")} <span>→</span>
      </Link>
    </main>
  );
}
