import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "Latest News — Lioness Dress" }] }),
  component: News,
});

function News() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="news.title">
      <p className="content-page__intro">{t("news.intro")}</p>
      <p>{t("news.empty")}</p>
    </ContentPage>
  );
}
