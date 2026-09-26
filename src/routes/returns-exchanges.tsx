import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/returns-exchanges")({
  head: () => ({ meta: [{ title: "Returns & Exchanges — Lioness Dress" }] }),
  component: ReturnsExchanges,
});

function ReturnsExchanges() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.returns">
      <p className="content-page__intro">{t("returns.intro")}</p>

      <h2>{t("returns.windowTitle")}</h2>
      <p>{t("returns.windowBody")}</p>

      <h2>{t("returns.exchangeTitle")}</h2>
      <p>{t("returns.exchangeBody")}</p>

      <h2>{t("returns.nonReturnableTitle")}</h2>
      <p>{t("returns.nonReturnableBody")}</p>

      <h2>{t("returns.howTitle")}</h2>
      <p>{t("returns.howBody")}</p>
    </ContentPage>
  );
}
