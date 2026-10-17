import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { AltPrice } from "@/components/alt-price";
import { useShop } from "@/components/shop-context";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { formatPrice, type Product } from "@/lib/products";

/** One style in a grid: photo, wishlist heart, name and price (with the old price struck through when on sale). */
export function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted } = useShop();
  const { t } = useI18n();
  const wished = isWishlisted(product.slug);
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="product-card">
      <div className="product-card__image">
        <span>{!product.available ? t("product.soon") : discount > 0 ? `-${discount}%` : t("product.new")}</span>
        <button
          type="button"
          className={`product-card__wish ${wished ? "is-active" : ""}`}
          aria-label={wished ? t("product.wishRemove") : t("product.wishAdd")}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleWishlist({ slug: product.slug, name: product.name, price: product.price, image: product.image });
          }}
        >
          <Heart />
        </button>
        <img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" />
        {/* A size is required, so the card sends shoppers to the product page; while a style has no stock it reads "coming soon". */}
        <Button variant="luxury" size="plain" className="product-card__quick-add" disabled={!product.available} tabIndex={-1}>
          {product.available ? t("product.selectSize") : t("product.soon")}
        </Button>
      </div>
      <h3>{product.name}</h3>
      <p>
        {formatPrice(product.price)}
        {discount > 0 && product.compareAtPrice ? <s className="price-old">{formatPrice(product.compareAtPrice)}</s> : null}
        <AltPrice value={product.price} />
      </p>
    </Link>
  );
}
