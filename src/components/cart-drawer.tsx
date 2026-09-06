import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/components/shop-context";

export function CartDrawer() {
  const { items, bagOpen, setBagOpen, changeQuantity, removeItem } = useShop();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <Sheet open={bagOpen} onOpenChange={setBagOpen}>
      <SheetContent className="bag-drawer">
        <SheetHeader>
          <SheetTitle>YOUR BAG</SheetTitle>
          <SheetDescription>{items.length ? `${items.length} selected style${items.length > 1 ? "s" : ""}` : "Your bag is empty."}</SheetDescription>
        </SheetHeader>
        <div className="bag-list">
          {items.map((item) => <article key={item.slug} className="bag-item">
            <img src={item.image} alt={item.name} width={1024} height={1280} />
            <div><h3>{item.name}</h3><p>{formatPrice(item.price)}</p>
              <div className="quantity-control">
                <Button variant="quantity" size="iconSlim" onClick={() => changeQuantity(item.slug, item.quantity - 1)} aria-label="Decrease quantity"><Minus /></Button>
                <span>{item.quantity}</span>
                <Button variant="quantity" size="iconSlim" onClick={() => changeQuantity(item.slug, item.quantity + 1)} aria-label="Increase quantity"><Plus /></Button>
              </div>
              <Button variant="text" size="plain" onClick={() => removeItem(item.slug)}>REMOVE</Button>
            </div>
          </article>)}
        </div>
        {items.length > 0 && <div className="bag-total"><span>TOTAL</span><strong>{formatPrice(total)}</strong><Button variant="luxury" size="wide">CHECKOUT</Button></div>}
      </SheetContent>
    </Sheet>
  );
}