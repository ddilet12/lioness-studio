import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/components/shop-context";

export function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist } = useShop();
  const { t, tn } = useI18n();
  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="bag-drawer">
        <SheetHeader>
          <SheetTitle>{t("wishlist.title")}</SheetTitle>
          <SheetDescription>{wishlist.length ? tn("wishlist.count", wishlist.length) : t("wishlist.empty")}</SheetDescription>
        </SheetHeader>
        <div className="bag-list">
          {wishlist.map((item) => (
            <article key={item.slug} className="bag-item">
              <Link to="/product/$slug" params={{ slug: item.slug }} onClick={() => setWishlistOpen(false)}>
                <img src={item.image} alt={item.name} width={1024} height={1280} />
              </Link>
              <div>
                <Link to="/product/$slug" params={{ slug: item.slug }} onClick={() => setWishlistOpen(false)}><h3>{item.name}</h3></Link>
                <p>{formatPrice(item.price)}</p>
                <Button variant="text" size="plain" onClick={() => toggleWishlist(item)}>{t("bag.remove")}</Button>
              </div>
            </article>
          ))}
          {!wishlist.length && (
            <p className="wishlist-empty">
              <Heart /> {t("wishlist.hint")}
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
