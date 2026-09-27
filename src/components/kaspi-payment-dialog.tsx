import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/products";
import { createKaspiPhonePayment, createKaspiQrPayment, getKaspiPaymentStatus } from "@/lib/kaspi-checkout.server";
import type { ApiPayInvoice, ApiPayQrInvoice } from "@/lib/apipay.server";

const POLL_INTERVAL_MS = 4000;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartId: string | null;
  total: number;
  onPaid: () => void;
};

type Stage =
  | { kind: "form" }
  | { kind: "pending"; invoice: ApiPayQrInvoice | ApiPayInvoice }
  | { kind: "paid" }
  | { kind: "failed"; message: string };

export function KaspiPaymentDialog({ open, onOpenChange, cartId, total, onPaid }: Props) {
  const { t } = useI18n();
  const [stage, setStage] = useState<Stage>({ kind: "form" });
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setStage({ kind: "form" });
      setPhone("");
      setSubmitting(false);
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, [open]);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  function startPolling(invoiceId: number) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const invoice = await getKaspiPaymentStatus({ data: invoiceId });
        if (invoice.status === "paid") {
          if (pollRef.current) clearInterval(pollRef.current);
          setStage({ kind: "paid" });
          onPaid();
        } else if (invoice.status === "cancelled" || invoice.status === "expired" || invoice.status === "error") {
          if (pollRef.current) clearInterval(pollRef.current);
          const messages = { cancelled: t("kaspi.statusCancelled"), expired: t("kaspi.statusExpired"), error: t("kaspi.statusError") } as const;
          setStage({ kind: "failed", message: messages[invoice.status] });
        } else {
          setStage({ kind: "pending", invoice });
        }
      } catch {
        // transient network hiccup — keep polling, the interval will try again
      }
    }, POLL_INTERVAL_MS);
  }

  async function handleQr() {
    if (!cartId) return;
    setSubmitting(true);
    try {
      const invoice = await createKaspiQrPayment({ data: { cartId } });
      setStage({ kind: "pending", invoice });
      startPolling(invoice.id);
    } catch (error) {
      setStage({ kind: "failed", message: error instanceof Error ? error.message : String(error) });
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePhone() {
    if (!cartId) return;
    setSubmitting(true);
    try {
      const invoice = await createKaspiPhonePayment({ data: { cartId, phoneNumber: phone } });
      setStage({ kind: "pending", invoice });
      startPolling(invoice.id);
    } catch (error) {
      setStage({ kind: "failed", message: error instanceof Error ? error.message : String(error) });
    } finally {
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

        {stage.kind === "form" && (
          <Tabs defaultValue="qr">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">{t("kaspi.tabQr")}</TabsTrigger>
              <TabsTrigger value="phone">{t("kaspi.tabPhone")}</TabsTrigger>
            </TabsList>
            <TabsContent value="qr" className="kaspi-dialog__panel">
              <p>{t("kaspi.qrHint")}</p>
              <Button variant="luxury" size="wide" disabled={submitting} onClick={handleQr}>
                {submitting ? t("kaspi.creating") : t("kaspi.qrCta")}
              </Button>
            </TabsContent>
            <TabsContent value="phone" className="kaspi-dialog__panel">
              <Label htmlFor="kaspi-phone">{t("kaspi.phoneLabel")}</Label>
              <Input
                id="kaspi-phone"
                inputMode="tel"
                placeholder="8 7XX XXX XX XX"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <Button variant="luxury" size="wide" disabled={submitting || !phone} onClick={handlePhone}>
                {submitting ? t("kaspi.creating") : t("kaspi.phoneCta")}
              </Button>
            </TabsContent>
          </Tabs>
        )}

        {stage.kind === "pending" && (
          <div className="kaspi-dialog__panel kaspi-dialog__pending">
            {"qr_image_url" in stage.invoice && stage.invoice.qr_image_url && (
              <img src={stage.invoice.qr_image_url} alt={t("kaspi.qrAlt")} width={220} height={220} />
            )}
            <p>{stage.invoice.phone_number ? t("kaspi.waitingPhone") : t("kaspi.waitingQr")}</p>
            <p className="kaspi-dialog__spinner" aria-hidden />
          </div>
        )}

        {stage.kind === "paid" && (
          <div className="kaspi-dialog__panel">
            <p>{t("kaspi.paidTitle")}</p>
            <p>{t("kaspi.paidBody")}</p>
          </div>
        )}

        {stage.kind === "failed" && (
          <div className="kaspi-dialog__panel">
            <p>{stage.message}</p>
            <Button variant="luxury" size="wide" onClick={() => setStage({ kind: "form" })}>
              {t("kaspi.retry")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
