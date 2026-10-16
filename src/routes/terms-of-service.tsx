import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";
import { SELLER } from "@/lib/seller";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({ meta: [{ title: "Terms of Service — Lioness Dress" }] }),
  component: TermsOfService,
});

function TermsOfService() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.terms">
      <p className="content-page__meta">{t("terms.updated")}</p>
      <p className="content-page__intro">{t("terms.intro")}</p>

      <h2>{t("terms.offerTitle")}</h2>
      <p>{t("terms.offerBody")}</p>

      <h2>{t("terms.ordersTitle")}</h2>
      <p>{t("terms.ordersBody")}</p>

      <h2>{t("terms.paymentTitle")}</h2>
      <p>{t("terms.paymentBody")}</p>

      <h2>{t("terms.consumerTitle")}</h2>
      <p>{t("terms.consumerBody")}</p>

      <h2>{t("terms.productionTitle")}</h2>
      <p>{t("terms.productionBody")}</p>

      <h2>{t("terms.ipTitle")}</h2>
      <p>{t("terms.ipBody")}</p>

      <h2>{t("terms.liabilityTitle")}</h2>
      <p>{t("terms.liabilityBody")}</p>

      <h2>{t("terms.disputeTitle")}</h2>
      <p>{t("terms.disputeBody")}</p>

      {SELLER.name && (
        <>
          <h2>{t("terms.sellerTitle")}</h2>
          <p>{[SELLER.name, SELLER.taxId, SELLER.address].filter(Boolean).join(", ")}</p>
        </>
      )}

      <h2>{t("terms.lawTitle")}</h2>
      <p>{t("terms.lawBody")}</p>

      <h2>{t("terms.contactTitle")}</h2>
      <p>{t("terms.contactBody")}</p>
    </ContentPage>
  );
}
