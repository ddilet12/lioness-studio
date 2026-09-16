import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/components/shop-context";

export function WishlistDrawer() {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist } = useShop();
  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="bag-drawer">
        <SheetHeader>
          <SheetTitle>WISHLIST</SheetTitle>
          <SheetDescription>{wishlist.length ? `${wishlist.length} saved style${wishlist.length > 1 ? "s" : ""}` : "No saved styles yet."}</SheetDescription>
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
                <Button variant="text" size="plain" onClick={() => toggleWishlist(item)}>REMOVE</Button>
              </div>
            </article>
          ))}
          {!wishlist.length && (
            <p className="wishlist-empty">
              <Heart /> Tap the heart on any dress to save it here.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
