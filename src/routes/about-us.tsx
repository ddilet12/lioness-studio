import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about-us")({
  head: () => ({ meta: [{ title: "About Us — Lioness Dress" }] }),
  component: AboutUs,
});

function AboutUs() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.about">
      <p className="content-page__intro">{t("about.intro")}</p>

      <h2>{t("about.philosophyTitle")}</h2>
      <p>{t("about.philosophyBody")}</p>

      <h2>{t("about.collectionTitle")}</h2>
      <p>{t("about.collectionBody")}</p>

      <h2>{t("about.contactTitle")}</h2>
      <p>{t("about.contactBody")}</p>
    </ContentPage>
  );
}
