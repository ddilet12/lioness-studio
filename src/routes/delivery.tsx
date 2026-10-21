import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { DeliveryExtra } from "@/components/delivery-extra";
import { lines, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/delivery")({
  head: () => ({ meta: [{ title: "Delivery — Lioness Dress" }] }),
  component: Delivery,
});

function Delivery() {
  const { t, lang } = useI18n();
  return (
    <ContentPage titleKey="footer.delivery">
      <p className="content-page__intro">{t("delivery.intro")}</p>

      <h2>{t("delivery.productionTitle")}</h2>
      <p>{t("delivery.productionBody")}</p>

      <h2>{t("delivery.shippingTitle")}</h2>
      <p>{lines(t("delivery.shippingBody"))}</p>

      <DeliveryExtra lang={lang} />

      <h2>{t("delivery.costTitle")}</h2>
      <p>{t("delivery.costBody")}</p>
    </ContentPage>
  );
}
