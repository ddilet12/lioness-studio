import { useEffect, useState, type FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n, type TKey } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { createKaspiPaymentLink } from "@/lib/kaspi-checkout.server";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartId: string | null;
  total: number;
};

const ERROR_KEYS: Record<string, TKey> = {
  invalid_name: "kaspi.error.name",
  invalid_phone: "kaspi.error.phone",
  invalid_address: "kaspi.error.address",
  invalid_comment: "kaspi.error.comment",
  empty_cart: "kaspi.error.emptyCart",
};

export function KaspiCheckoutDialog({ open, onOpenChange, cartId, total }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<TKey | null>(null);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setErrorKey(null);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!cartId || submitting) return;
    setSubmitting(true);
    setErrorKey(null);
    try {
      const { paymentUrl } = await createKaspiPaymentLink({ data: { cartId, customer: { name, phone, address, comment } } });
      window.location.href = paymentUrl;
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      setErrorKey(ERROR_KEYS[code] ?? "kaspi.error.generic");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="kaspi-dialog">
        <DialogHeader>
          <DialogTitle>{t("kaspi.title")}</DialogTitle>
          <DialogDescription>{t("kaspi.total", { price: formatPrice(total) })}</DialogDescription>
        </DialogHeader>
        <form className="kaspi-dialog__form" onSubmit={handleSubmit}>
          <Label htmlFor="kaspi-name">{t("kaspi.name")}</Label>
          <Input id="kaspi-name" autoComplete="name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} />
          <Label htmlFor="kaspi-phone">{t("kaspi.phone")}</Label>
          <Input id="kaspi-phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+7 7XX XXX XX XX" value={phone} onChange={(event) => setPhone(event.target.value)} />
          <Label htmlFor="kaspi-address">{t("kaspi.address")}</Label>
          <Input id="kaspi-address" autoComplete="street-address" required maxLength={160} value={address} onChange={(event) => setAddress(event.target.value)} />
          <Label htmlFor="kaspi-comment">{t("kaspi.comment")}</Label>
          <Input id="kaspi-comment" maxLength={120} value={comment} onChange={(event) => setComment(event.target.value)} />
          {errorKey && <p className="kaspi-dialog__error" role="alert">{t(errorKey)}</p>}
          <Button type="submit" variant="luxury" size="wide" disabled={submitting || !cartId}>
            {submitting ? t("kaspi.creating") : t("kaspi.pay")}
          </Button>
          <p className="kaspi-dialog__note">{t("kaspi.note")}</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
