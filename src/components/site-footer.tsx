import { Link } from "@tanstack/react-router";
import logoBadge from "@/assets/logo-badge.svg";
import { useShop } from "@/components/shop-context";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t, lang, setLang } = useI18n();
  const { setSearchOpen } = useShop();

  return (
    <footer className="footer section-pad">
      <div className="footer__cards" aria-hidden="true">
        <div className="footer__card">
          <img src="/images/business-cards/lioness-card-front.webp" alt="" width={360} height={200} loading="lazy" />
        </div>
        <div className="footer__card">
          <img src="/images/business-cards/lioness-card-back.webp" alt="" width={360} height={200} loading="lazy" />
        </div>
      </div>
      <div className="footer__brand">
        <img src={logoBadge} alt="Lioness Dress" />
        <span>LIONESS DRESS</span>
        <small>{t("footer.slogan")}</small>
        <div className="footer__social">
          <a href="https://instagram.com/lioness.dress" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://wa.me/77789654642" target="_blank" rel="noreferrer">WhatsApp</a>
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
        {/* Exact wording as supplied by the client; identical in both languages. */}
        <p className="footer__legal">
          <span>© 2026 LIONESS DRESS</span>
          <span>Email: <a href="mailto:Info@lionessdress.com">Info@lionessdress.com</a></span>
          <span>Phone: <a href="tel:+77789654642">+7 778 965 4642</a></span>
          <span>Location: Astana, Kazakhstan</span>
        </p>
      </div>
    </footer>
  );
}
