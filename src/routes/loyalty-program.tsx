import { createFileRoute } from "@tanstack/react-router";
import { ContentList, ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/loyalty-program")({
  head: () => ({ meta: [{ title: "Loyalty Program — Lioness Dress" }] }),
  component: LoyaltyProgram,
});

function LoyaltyProgram() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.loyalty">
      <p className="content-page__intro">{t("loyalty.intro")}</p>

      <h2>{t("loyalty.perksTitle")}</h2>
      <ContentList text={t("loyalty.perks")} />

      <p>{t("loyalty.cta")}</p>
    </ContentPage>
  );
}
