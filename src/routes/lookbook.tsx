import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LOOKBOOK } from "@/lib/lookbook";

export const Route = createFileRoute("/lookbook")({
  head: () => ({ meta: [{ title: "Lookbook — Lioness Dress" }] }),
  component: Lookbook,
});

function Lookbook() {
  const { t } = useI18n();
  return (
    <main className="section-page lookbook">
      <p className="eyebrow">LIONESS DRESS</p>
      <h1>{t("nav.lookbook")}</h1>
      <p className="section-page__intro">{t("lookbook.intro")}</p>

      <nav className="lookbook__index" aria-label={t("nav.lookbook")}>
        {LOOKBOOK.map((entry) => (
          <a key={entry.slug} href={`#${entry.slug}`}>
            <span>{entry.year}</span> {entry.name}
          </a>
        ))}
      </nav>

      {LOOKBOOK.map((entry) => (
        <section key={entry.slug} id={entry.slug} className="lookbook__collection">
          <p className="eyebrow">{entry.year}</p>
          <h2>{entry.name}</h2>
          {entry.photos.length > 0 ? (
            <div className="lookbook__photos">
              {entry.photos.map((photo) => (
                <img key={photo.src} src={photo.src} alt={photo.alt} loading="lazy" />
              ))}
            </div>
          ) : (
            <p className="lookbook__soon">{t("lookbook.soon")}</p>
          )}
          {entry.slug === "black-angel" && (
            <Link to="/" hash="collection" className="text-link">
              {t("lookbook.shop")} <span>→</span>
            </Link>
          )}
        </section>
      ))}

      <Link to="/" hash="collection" className="text-link section-page__back">
        {t("section.backToShop")} <span>→</span>
      </Link>
    </main>
  );
}
