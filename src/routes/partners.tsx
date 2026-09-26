import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [{ title: "Partners — Lioness Dress" }] }),
  component: Partners,
});

function Partners() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.partners">
      <p className="content-page__intro">{t("partners.intro")}</p>

      <h2>{t("partners.stockistsTitle")}</h2>
      <p>{t("partners.stockistsBody")}</p>

      <h2>{t("partners.creativeTitle")}</h2>
      <p>{t("partners.creativeBody")}</p>

      <h2>{t("partners.contactTitle")}</h2>
      <p>{t("partners.contactBody")}</p>
    </ContentPage>
  );
}
