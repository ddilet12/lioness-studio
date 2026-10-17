import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product-card";
import { useI18n, type TKey } from "@/lib/i18n";
import type { Product } from "@/lib/products";

/** A shop section (New Collection, Bestsellers, Party Dresses, Outlet): the styles of one Shopify collection. */
export function SectionPage({ titleKey, introKey, products }: { titleKey: TKey; introKey: TKey; products: Product[] }) {
  const { t } = useI18n();
  return (
    <main className="section-page">
      <p className="eyebrow">LIONESS DRESS</p>
      <h1>{t(titleKey)}</h1>
      <p className="section-page__intro">{t(introKey)}</p>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="section-page__empty">{t("section.empty")}</p>
      )}
      <Link to="/" hash="collection" className="text-link section-page__back">
        {t("section.backToShop")} <span>→</span>
      </Link>
    </main>
  );
}
