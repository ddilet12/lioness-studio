import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { products } from "@/lib/products";

export function SiteHeader() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount, setBagOpen } = useShop();
  const home = path === "/";
  const matches = query.trim() ? products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <>
      <header className={`site-header ${home ? "site-header--overlay" : "site-header--solid"}`}>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <div className="site-header__left">
            <Link to="/" hash="collection">SHOP</Link>
            <Link to="/" hash="collection">BLACK ANGEL</Link>
            <Link to="/" hash="story">OUR STORY</Link>
          </div>
          <Link to="/" className="site-logo" aria-label="Lioness Dress home">LD</Link>
          <div className="site-header__right">
            <Button variant="editorial" size="plain" onClick={() => setSearchOpen(true)}>SEARCH</Button>
            <Button variant="editorial" size="plain" onClick={() => setBagOpen(true)}>BAG {itemCount}</Button>
          </div>
          <Button variant="editorial" size="iconSlim" className="site-header__mobile" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></Button>
        </nav>
      </header>

      {menuOpen && <div className="menu-panel" role="dialog" aria-label="Menu">
        <Button variant="editorialDark" size="iconSlim" className="menu-panel__close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></Button>
        <Link to="/" onClick={() => setMenuOpen(false)}>LD</Link>
        <Link to="/" hash="collection" onClick={() => setMenuOpen(false)}>SHOP</Link>
        <Link to="/" hash="collection" onClick={() => setMenuOpen(false)}>BLACK ANGEL</Link>
        <Link to="/" hash="story" onClick={() => setMenuOpen(false)}>OUR STORY</Link>
        <Button variant="editorialDark" size="plain" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>SEARCH</Button>
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