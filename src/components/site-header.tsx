import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { getCollections, getProducts, type ShopifyCollection, type ShopifyProduct } from "@/lib/shopify.server";
import { useI18n } from "@/lib/i18n";
import runwayImage from "@/assets/lioness-story.jpg";
import logoMark from "@/assets/logo-mark.svg";

export function SiteHeader() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [query, setQuery] = useState("");
  const [searchableProducts, setSearchableProducts] = useState<ShopifyProduct[]>([]);
  const { itemCount, setBagOpen, wishlist, setWishlistOpen, searchOpen, setSearchOpen } = useShop();
  const { t } = useI18n();
  const home = path === "/";
  const matches = query.trim()
    ? searchableProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    getCollections().then(setCollections).catch(() => setCollections([]));
  }, []);

  useEffect(() => {
    if (!searchOpen || searchableProducts.length) return;
    getProducts().then(setSearchableProducts);
  }, [searchOpen, searchableProducts.length]);

  return (
    <>
      <header className={`site-header ${home ? "site-header--overlay" : "site-header--solid"}`}>
        <nav className="site-header__nav" aria-label={t("nav.primary")}>
          <div className="site-header__left">
            <div className="shop-menu" onMouseEnter={() => setShopMenuOpen(true)} onMouseLeave={() => setShopMenuOpen(false)}>
              <Link to="/" hash="collection">{t("nav.shop")}</Link>
              {shopMenuOpen && (
                <div className="mega-menu" role="menu">
                  <div className="mega-menu__links">
                    <Link to="/" hash="collection" onClick={() => setShopMenuOpen(false)}>{t("nav.allDresses")}</Link>
                    <Link to="/new-collection" onClick={() => setShopMenuOpen(false)}>{t("nav.newCollection")}</Link>
                    <Link to="/bestsellers" onClick={() => setShopMenuOpen(false)}>{t("nav.bestsellers")}</Link>
                    <Link to="/party-dresses" onClick={() => setShopMenuOpen(false)}>{t("nav.partyDresses")}</Link>
                    <Link to="/outlet" onClick={() => setShopMenuOpen(false)}>{t("nav.outlet")}</Link>
                  </div>
                  <Link to="/" hash="collection" className="mega-menu__feature" onClick={() => setShopMenuOpen(false)}>
                    <img src={runwayImage} alt={t("nav.featureCollectionAlt")} width={640} height={800} />
                    <span>{t("nav.featureCollection")}</span>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/" hash="collection">{t("nav.blackAngel")}</Link>
            <Link to="/lookbook">{t("nav.lookbook")}</Link>
          </div>
          <Link to="/" className="site-logo" aria-label={t("nav.home")}><img src={logoMark} alt="Lioness Dress" /></Link>
          <div className="site-header__right">
            <Button variant="editorial" size="plain" onClick={() => setSearchOpen(true)}>{t("nav.search")}</Button>
            <Button variant="editorial" size="plain" onClick={() => setWishlistOpen(true)} aria-label={t("nav.openWishlist")}>
              <Heart className="wishlist-icon" />{wishlist.length > 0 && <span className="nav-count">{wishlist.length}</span>}
            </Button>
            <Button variant="editorial" size="plain" onClick={() => setBagOpen(true)}>{t("nav.bag")}{itemCount > 0 && <span className="nav-count">{itemCount}</span>}</Button>
          </div>
          <Button variant="editorial" size="iconSlim" className="site-header__mobile" onClick={() => setMenuOpen(true)} aria-label={t("nav.openMenu")}><Menu /></Button>
        </nav>
      </header>

      {menuOpen && <div className="menu-panel" role="dialog" aria-label={t("nav.menu")}>
        <Button variant="editorialDark" size="iconSlim" className="menu-panel__close" onClick={() => setMenuOpen(false)} aria-label={t("nav.closeMenu")}><X /></Button>
        <Link to="/" className="menu-panel__logo" onClick={() => setMenuOpen(false)}><img src={logoMark} alt="Lioness Dress" /></Link>
        <Link to="/" hash="collection" onClick={() => setMenuOpen(false)}>{t("nav.shop")}</Link>
        <Link to="/new-collection" onClick={() => setMenuOpen(false)}>{t("nav.newCollection")}</Link>
        <Link to="/bestsellers" onClick={() => setMenuOpen(false)}>{t("nav.bestsellers")}</Link>
        <Link to="/party-dresses" onClick={() => setMenuOpen(false)}>{t("nav.partyDresses")}</Link>
        <Link to="/outlet" onClick={() => setMenuOpen(false)}>{t("nav.outlet")}</Link>
        <Link to="/lookbook" onClick={() => setMenuOpen(false)}>{t("nav.lookbook")}</Link>
        {collections.length === 0 ? (
          <Link to="/" hash="collection" onClick={() => setMenuOpen(false)}>{t("nav.blackAngel")}</Link>
        ) : (
          <div className="menu-panel__fold">
            <button type="button" className="menu-panel__fold-toggle" aria-expanded={collectionsOpen} onClick={() => setCollectionsOpen((open) => !open)}>
              {t("nav.blackAngel")} <ChevronDown className={collectionsOpen ? "is-open" : ""} />
            </button>
            {collectionsOpen && <div className="menu-panel__fold-list">
              {collections.map((collection) => <Link key={collection.handle} to="/" search={{ collection: collection.handle }} hash="collection" onClick={() => setMenuOpen(false)}>{collection.title}</Link>)}
            </div>}
          </div>
        )}
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>{t("nav.search")}</Button>
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setWishlistOpen(true); }}>{t("nav.wishlist")}{wishlist.length > 0 && <span className="nav-count">{wishlist.length}</span>}</Button>
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setBagOpen(true); }}>{t("nav.bag")}{itemCount > 0 && <span className="nav-count">{itemCount}</span>}</Button>
      </div>}

      {searchOpen && <div className="search-overlay" role="dialog" aria-label={t("search.dialog")}>
        <Button variant="editorialDark" size="iconSlim" className="search-overlay__close" onClick={() => setSearchOpen(false)} aria-label={t("search.close")}><X /></Button>
        <label htmlFor="site-search">{t("nav.search")}</label>
        <input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search.placeholder")} />
        <div className="search-results">
          {matches.map((product) => <Link key={product.slug} to="/product/$slug" params={{ slug: product.slug }} onClick={() => setSearchOpen(false)}>{product.name}</Link>)}
        </div>
      </div>}
    </>
  );
}
