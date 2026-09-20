import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD, useShop } from "@/components/shop-context";

export function CartDrawer() {
  const { items, bagOpen, setBagOpen, changeQuantity, removeItem, checkoutUrl } = useShop();
  const { t, tn } = useI18n();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <Sheet open={bagOpen} onOpenChange={setBagOpen}>
      <SheetContent className="bag-drawer">
        <SheetHeader>
          <SheetTitle>{t("bag.title")}</SheetTitle>
          <SheetDescription>{items.length ? tn("bag.count", items.length) : t("bag.empty")}</SheetDescription>
        </SheetHeader>
        {items.length > 0 && (
          <div className="shipping-progress">
            <p>{remaining > 0 ? t("bag.addMore", { price: formatPrice(remaining) }) : t("bag.unlocked")}</p>
            <div className="shipping-progress__track"><div className="shipping-progress__fill" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
        <div className="bag-list">
          {items.map((item) => <article key={item.lineId} className="bag-item">
            <img src={item.image} alt={item.name} width={1024} height={1280} />
            <div><h3>{item.name}</h3><p>{formatPrice(item.price)}</p>
              <div className="quantity-control">
                <Button variant="quantity" size="iconSlim" onClick={() => changeQuantity(item.lineId, item.quantity - 1)} aria-label={t("pdp.decrease")}><Minus /></Button>
                <span>{item.quantity}</span>
                <Button variant="quantity" size="iconSlim" onClick={() => changeQuantity(item.lineId, item.quantity + 1)} aria-label={t("pdp.increase")}><Plus /></Button>
              </div>
              <Button variant="text" size="plain" onClick={() => removeItem(item.lineId)}>{t("bag.remove")}</Button>
            </div>
          </article>)}
        </div>
        {items.length > 0 && <div className="bag-total"><span>{t("bag.total")}</span><strong>{formatPrice(total)}</strong><Button variant="luxury" size="wide" onClick={() => { if (checkoutUrl) window.location.href = checkoutUrl; }}>{t("bag.checkout")}</Button></div>}
      </SheetContent>
    </Sheet>
  );
}