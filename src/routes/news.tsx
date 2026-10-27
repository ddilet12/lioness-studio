import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ContentPage } from "@/components/content-page";
import { ImageLightbox } from "@/components/image-lightbox";
import { useI18n } from "@/lib/i18n";
import { NEWS } from "@/lib/news";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "Latest News — Lioness Dress" }] }),
  component: News,
});

function News() {
  const { t } = useI18n();
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  return (
    <ContentPage titleKey="news.title">
      <p className="content-page__intro">{t("news.intro")}</p>
      {NEWS.length === 0 && <p>{t("news.empty")}</p>}
      <div className="news-list">
        {NEWS.map((item, index) => (
          <button key={item.slug} type="button" className="news-item" onClick={() => setZoomIndex(index)} aria-label={item.alt}>
            <img src={item.image} alt={item.alt} width={1024} height={1280} loading="lazy" />
          </button>
        ))}
      </div>
      <ImageLightbox images={NEWS.map((item) => item.image)} index={zoomIndex} label={NEWS[zoomIndex ?? 0]?.alt ?? ""} onClose={() => setZoomIndex(null)} onChange={setZoomIndex} />
    </ContentPage>
  );
}
