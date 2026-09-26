import { createFileRoute } from "@tanstack/react-router";
import { ContentList, ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Lioness Dress" }] }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.privacy">
      <p className="content-page__meta">{t("privacy.updated")}</p>
      <p className="content-page__intro">{t("privacy.intro")}</p>

      <h2>{t("privacy.collectTitle")}</h2>
      <ContentList text={t("privacy.collectBody")} />

      <h2>{t("privacy.useTitle")}</h2>
      <p>{t("privacy.useBody")}</p>

      <h2>{t("privacy.thirdPartyTitle")}</h2>
      <p>{t("privacy.thirdPartyBody")}</p>

      <h2>{t("privacy.rightsTitle")}</h2>
      <p>{t("privacy.rightsBody")}</p>

      <h2>{t("privacy.contactTitle")}</h2>
      <p>{t("privacy.contactBody")}</p>
    </ContentPage>
  );
}
