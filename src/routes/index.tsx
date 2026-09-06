import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroImage from "@/assets/lioness-hero.jpg";
import campaignImage from "@/assets/lioness-campaign.jpg";
import storyImage from "@/assets/lioness-story.jpg";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lioness Dress — Black Angel Collection" },
      { name: "description", content: "Lioness Dress luxury eveningwear. Discover the Black Angel collection, from Astana to Paris." },
      { property: "og:title", content: "Lioness Dress — Black Angel Collection" },
      { property: "og:description", content: "Luxury evening dresses designed between Astana and Paris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState<"ALL" | "BLACK" | "RED">("ALL");
  const visibleProducts = products.filter((product) => filter === "ALL" || product.color === filter);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <main>
    <section className="hero" aria-label="Black Angel collection">
      <img className="hero__image" src={heroImage} alt="Woman wearing the Black Angel dress inside a private jet" width={1536} height={1920} />
      <div className="hero__shade" />
      <div className="hero__copy">
        <p className="eyebrow">PARIS 2026</p>
        <h1>BLACK<br />ANGEL</h1>
        <Link to="/" hash="collection" className="text-link text-link--light">DISCOVER THE COLLECTION <span>→</span></Link>
      </div>
      <div className="hero__meta"><span>DESIGNED FOR SELF-CONFIDENT GIRLS</span><i /><span>01 / 03</span></div>
    </section>

    <section className="manifesto section-pad" data-reveal>
      <p className="eyebrow">NEW COLLECTION · PARIS 2026</p>
      <div className="manifesto__grid">
        <h2>Elegance<br />with an <span>edge.</span></h2>
        <p>Lioness Dress is made for<br />the woman who never asks<br />permission to be<br className="mobile-only" /> unforgettable.</p>
      </div>
    </section>

    <section id="collection" className="collection section-pad" data-reveal>
      <div className="collection__head">
        <div><p className="eyebrow">THE COLLECTION</p><h2>New arrivals</h2></div>
        <div className="filters" aria-label="Filter products">
          {(["ALL", "BLACK", "RED"] as const).map((value) => <button key={value} className={filter === value ? "active" : ""} onClick={() => setFilter(value)}>{value}</button>)}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => <Link to="/product/$slug" params={{ slug: product.slug }} className="product-card" key={product.slug}>
          <div className="product-card__image"><span>NEW IN</span><img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" /></div>
          <h3>{product.name}</h3><p>{`$${product.price}.00`}</p>
        </Link>)}
      </div>
    </section>

    <section className="campaign" data-reveal>
      <img src={campaignImage} alt="Woman wearing a Lioness Dress on a Paris street" width={1920} height={1280} loading="lazy" />
      <div className="campaign__shade" />
      <div className="campaign__copy"><p className="eyebrow">THE LIONESS WOMAN</p><h2>She doesn’t follow the room.<br />She changes it.</h2><Link to="/product/$slug" params={{ slug: "the-asymmetric" }} className="text-link text-link--light">SHOP THE SIGNATURE DRESS <span>→</span></Link></div>
    </section>

    <section id="story" className="story section-pad" data-reveal>
      <div className="story__title"><p className="eyebrow">OUR SIGNATURE</p><h2>From Astana<br />to Paris.</h2></div>
      <img src={storyImage} alt="Lioness Dress atelier with black, ivory and red dresses" width={1024} height={1280} loading="lazy" />
      <div className="story__copy"><p>Designed around confidence,<br />sensuality and clean feminine<br />lines. Every silhouette is created<br />to make an entrance — and stay<br />in memory.</p><Link to="/" hash="story" className="text-link">DISCOVER OUR STORY <span>→</span></Link></div>
    </section>

    <footer className="footer section-pad">
      <div className="footer__brand"><strong>LD</strong><span>LIONESS DRESS</span><small>DESIGNED FOR SELF-CONFIDENT GIRLS</small></div>
      <div><h3>CLIENT CARE</h3><a href="mailto:info@lionessdress.com">Contact</a><a href="#delivery">Delivery & returns</a><a href="#size-guide">Size guide</a></div>
      <div><h3>FOLLOW</h3><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://wa.me/" target="_blank" rel="noreferrer">WhatsApp</a></div>
      <div><h3>PRIVATE ACCESS</h3><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://www.lionessdress.com">www.lionessdress.com</a></div>
    </footer>
  </main>;
}