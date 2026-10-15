import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { KaspiCheckoutDialog } from "@/components/kaspi-checkout-dialog";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/components/shop-context";

export function CartDrawer() {
  const { items, bagOpen, setBagOpen, changeQuantity, removeItem, cartId, checkoutUrl, kaspiEnabled } = useShop();
  const { t, tn } = useI18n();
  const [kaspiOpen, setKaspiOpen] = useState(false);
  const checkout = () => {
    if (kaspiEnabled) {
      setBagOpen(false);
      setKaspiOpen(true);
    } else if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <>
    <Sheet open={bagOpen} onOpenChange={setBagOpen}>
      <SheetContent className="bag-drawer">
        <SheetHeader>
          <SheetTitle>{t("bag.title")}</SheetTitle>
          <SheetDescription>{items.length ? tn("bag.count", items.length) : t("bag.empty")}</SheetDescription>
        </SheetHeader>
        <div className="bag-list">
          {items.map((item) => <article key={item.lineId} className="bag-item">
            <Link to="/product/$slug" params={{ slug: item.slug }} onClick={() => setBagOpen(false)}>
              <img src={item.image} alt={item.name} width={1024} height={1280} />
            </Link>
            <div><Link to="/product/$slug" params={{ slug: item.slug }} onClick={() => setBagOpen(false)}><h3>{item.name}</h3></Link><p>{formatPrice(item.price)}</p>{item.size && <p className="bag-item__size">{t("bag.size", { size: item.size })}</p>}
              <div className="quantity-control">
                <Button variant="quantity" size="iconSlim" onClick={() => changeQuantity(item.lineId, item.quantity - 1)} aria-label={t("pdp.decrease")}><Minus /></Button>
                <span>{item.quantity}</span>
                <Button variant="quantity" size="iconSlim" onClick={() => changeQuantity(item.lineId, item.quantity + 1)} aria-label={t("pdp.increase")}><Plus /></Button>
              </div>
              <Button variant="text" size="plain" onClick={() => removeItem(item.lineId)}>{t("bag.remove")}</Button>
            </div>
          </article>)}
        </div>
        {items.length > 0 && <div className="bag-total"><span>{t("bag.total")}</span><strong>{formatPrice(total)}</strong><Button variant="luxury" size="wide" onClick={checkout}>{t(kaspiEnabled ? "bag.checkoutKaspi" : "bag.checkout")}</Button></div>}
      </SheetContent>
    </Sheet>
    <KaspiCheckoutDialog open={kaspiOpen} onOpenChange={setKaspiOpen} cartId={cartId} total={total} />
    </>
  );
}