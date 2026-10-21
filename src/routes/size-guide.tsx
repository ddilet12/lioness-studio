import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { SizeGuideContent } from "@/components/size-guide-content";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/size-guide")({
  head: () => ({ meta: [{ title: "Size Guide — Lioness Dress" }] }),
  component: SizeGuide,
});

function SizeGuide() {
  const { lang } = useI18n();
  return (
    <ContentPage titleKey="footer.sizeGuide">
      <SizeGuideContent lang={lang} />
    </ContentPage>
  );
}
