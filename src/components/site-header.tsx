import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { getProducts, type ShopifyProduct } from "@/lib/shopify.server";
import heroImage from "@/assets/lioness-hero.jpg";
import campaignImage from "@/assets/lioness-campaign.jpg";
import logoMark from "@/assets/logo-mark.svg";

export function SiteHeader() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchableProducts, setSearchableProducts] = useState<ShopifyProduct[]>([]);
  const { itemCount, setBagOpen, wishlist, setWishlistOpen } = useShop();
  const home = path === "/";
  const matches = query.trim()
    ? searchableProducts.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    if (!searchOpen || searchableProducts.length) return;
    getProducts().then(setSearchableProducts);
  }, [searchOpen, searchableProducts.length]);

  return (
    <>
      <header className={`site-header ${home ? "site-header--overlay" : "site-header--solid"}`}>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <div className="site-header__left">
            <div className="shop-menu" onMouseEnter={() => setShopMenuOpen(true)} onMouseLeave={() => setShopMenuOpen(false)}>
              <Link to="/" hash="collection">SHOP</Link>
              {shopMenuOpen && (
                <div className="mega-menu" role="menu">
                  <div className="mega-menu__links">
                    <Link to="/" hash="collection" onClick={() => setShopMenuOpen(false)}>ALL DRESSES</Link>
                    <Link to="/" hash="collection" onClick={() => setShopMenuOpen(false)}>BLACK</Link>
                    <Link to="/" hash="collection" onClick={() => setShopMenuOpen(false)}>RED</Link>
                    <Link to="/" hash="story" onClick={() => setShopMenuOpen(false)}>OUR STORY</Link>
                  </div>
                  <Link to="/" hash="collection" className="mega-menu__feature" onClick={() => setShopMenuOpen(false)}>
                    <img src={heroImage} alt="Black Angel collection" width={640} height={800} />
                    <span>BLACK ANGEL COLLECTION →</span>
                  </Link>
                  <Link to="/" hash="collection" className="mega-menu__feature" onClick={() => setShopMenuOpen(false)}>
                    <img src={campaignImage} alt="The Lioness Woman campaign" width={640} height={800} />
                    <span>NEW ARRIVALS →</span>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/" hash="collection">BLACK ANGEL</Link>
            <Link to="/" hash="story">OUR STORY</Link>
          </div>
          <Link to="/" className="site-logo" aria-label="Lioness Dress home"><img src={logoMark} alt="Lioness Dress" /></Link>
          <div className="site-header__right">
            <Button variant="editorial" size="plain" onClick={() => setSearchOpen(true)}>SEARCH</Button>
            <Button variant="editorial" size="plain" onClick={() => setWishlistOpen(true)} aria-label="Open wishlist">
              <Heart className="wishlist-icon" /> {wishlist.length}
            </Button>
            <Button variant="editorial" size="plain" onClick={() => setBagOpen(true)}>BAG {itemCount}</Button>
          </div>
          <Button variant="editorial" size="iconSlim" className="site-header__mobile" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></Button>
        </nav>
      </header>

      {menuOpen && <div className="menu-panel" role="dialog" aria-label="Menu">
        <Button variant="editorialDark" size="iconSlim" className="menu-panel__close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button>
        <Link to="/" className="menu-panel__logo" onClick={() => setMenuOpen(false)}><img src={logoMark} alt="Lioness Dress" /></Link>
        <Link to="/" hash="collection" onClick={() => setMenuOpen(false)}>SHOP</Link>
        <Link to="/" hash="collection" onClick={() => setMenuOpen(false)}>BLACK ANGEL</Link>
        <Link to="/" hash="story" onClick={() => setMenuOpen(false)}>OUR STORY</Link>
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>SEARCH</Button>
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setWishlistOpen(true); }}>WISHLIST {wishlist.length}</Button>
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setBagOpen(true); }}>BAG {itemCount}</Button>
      </div>}

      {searchOpen && <div className="search-overlay" role="dialog" aria-label="Product search">
        <Button variant="editorialDark" size="iconSlim" className="search-overlay__close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X /></Button>
        <label htmlFor="site-search">SEARCH</label>
        <input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="TYPE A PRODUCT NAME" />
        <div className="search-results">
          {matches.map((product) => <Link key={product.slug} to="/product/$slug" params={{ slug: product.slug }} onClick={() => setSearchOpen(false)}>{product.name}</Link>)}
        </div>
      </div>}
    </>
  );
}
