import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import type { ReactNode } from "react";
import logoBadge from "@/assets/logo-badge.svg";
import { useShop } from "@/components/shop-context";
import { useI18n } from "@/lib/i18n";

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// Social icons. Pinterest is shown only once its url is filled in: a link without a url is not rendered.
const SOCIALS: { id: string; label: string; url: string | null; icon: () => ReactNode }[] = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/lioness.dress", icon: () => <Instagram /> },
  { id: "pinterest", label: "Pinterest", url: null, icon: PinterestIcon },
  { id: "whatsapp", label: "WhatsApp", url: "https://wa.me/77789654642", icon: WhatsAppIcon },
];

export function SiteFooter() {
  const { t, lang, setLang } = useI18n();
  const { setSearchOpen } = useShop();

  return (
    <footer className="footer section-pad">
      <div className="footer__brand">
        <img src={logoBadge} alt="Lioness Dress" />
        <span>LIONESS DRESS</span>
        <small>{t("footer.slogan")}</small>
        <div className="footer__social">
          {SOCIALS.filter((x) => x.url).map((x) => (
            <a key={x.id} href={x.url!} target="_blank" rel="noopener noreferrer" aria-label={x.label} title={x.label}>
              {x.icon()}
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3>{t("footer.care")}</h3>
        <a href="mailto:info@lionessdress.com">{t("footer.contact")}</a>
        <Link to="/delivery">{t("footer.delivery")}</Link>
        <Link to="/returns-exchanges">{t("footer.returns")}</Link>
        <Link to="/size-guide">{t("footer.sizeGuide")}</Link>
        <Link to="/loyalty-program">{t("footer.loyalty")}</Link>
      </div>

      <div>
        <h3>{t("footer.brand")}</h3>
        <Link to="/about-us">{t("footer.about")}</Link>
        <Link to="/lookbook">{t("nav.lookbook")}</Link>
        <Link to="/partners">{t("footer.partners")}</Link>      </div>

      <div>
        <h3>{t("footer.legal")}</h3>
        <Link to="/privacy-policy">{t("footer.privacy")}</Link>
        <Link to="/terms-of-service">{t("footer.terms")}</Link>
      </div>

      <div>
        <h3>{t("footer.navigation")}</h3>
        <button type="button" className="footer__link" onClick={() => setSearchOpen(true)}>{t("footer.search")}</button>
      </div>

      <div className="footer__bottom">
        <div className="footer__lang" role="group" aria-label={t("footer.language")}>
          <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>{t("footer.langEn")}</button>
          <span aria-hidden="true">/</span>
          <button type="button" aria-pressed={lang === "ru"} onClick={() => setLang("ru")}>{t("footer.langRu")}</button>
        </div>
        <p className="footer__legal">
          <span>{t("footer.copyright")}</span>
        </p>
      </div>
    </footer>
  );
}
