import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

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

      <h2>{t("terms.ordersTitle")}</h2>
      <p>{t("terms.ordersBody")}</p>

      <h2>{t("terms.productionTitle")}</h2>
      <p>{t("terms.productionBody")}</p>

      <h2>{t("terms.ipTitle")}</h2>
      <p>{t("terms.ipBody")}</p>

      <h2>{t("terms.liabilityTitle")}</h2>
      <p>{t("terms.liabilityBody")}</p>

      <h2>{t("terms.lawTitle")}</h2>
      <p>{t("terms.lawBody")}</p>

      <h2>{t("terms.contactTitle")}</h2>
      <p>{t("terms.contactBody")}</p>
    </ContentPage>
  );
}
