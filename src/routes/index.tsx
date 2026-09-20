import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Heart, Plus } from "lucide-react";
import heroImage from "@/assets/lioness-hero.jpg";
import campaignImage from "@/assets/lioness-campaign.jpg";
import storyImage from "@/assets/lioness-story.jpg";
import logoBadge from "@/assets/logo-badge.svg";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { formatPrice } from "@/lib/products";
import { getProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/")({
  loader: () => getProducts(),
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

// The intro video plays once per full page load; in-app navigation back to "/" skips it.
let heroIntroPlayed = false;

function Index() {
  const products = Route.useLoaderData();
  const [filter, setFilter] = useState<"ALL" | "BLACK" | "RED">("ALL");
  const visibleProducts = products.filter((product) => filter === "ALL" || product.color === filter);
  const { addToBag, toggleWishlist, isWishlisted } = useShop();
  const heroImageWrapRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [heroDone, setHeroDone] = useState(heroIntroPlayed);
  const [heroFallback, setHeroFallback] = useState(heroIntroPlayed);

  // Intro video: muted autoplay, once. Any failure/opt-out falls straight through to the photo.
  useEffect(() => {
    if (heroIntroPlayed) return;
    const video = heroVideoRef.current;
    let started = false;
    let cancelled = false;
    const finish = (fallback: boolean) => {
      if (cancelled) return;
      heroIntroPlayed = true;
      if (fallback) setHeroFallback(true);
      setHeroDone(true);
    };
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!video || saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish(true);
      return;
    }
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    video.muted = true;
    video.preload = "auto";
    video.src = mobile ? "/videos/hero-mobile.mp4" : "/videos/hero-desktop.mp4";
    // Play straight away (iOS won't buffer or fire canplaythrough before play()); the guards below only
    // step in if playback never starts, or freezes for good on a very slow link.
    let stallTimer = 0;
    let startTimer = 0;
    const onPlaying = () => {
      started = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(stallTimer);
    };
    const onWaiting = () => {
      if (!started) return;
      window.clearTimeout(stallTimer);
      stallTimer = window.setTimeout(() => finish(false), 3000);
    };
    // Start the dip-to-dark slightly before the last frame so it flows instead of freezing.
    const onTime = () => { if (video.duration && video.currentTime >= video.duration - 0.5) finish(false); };
    const onEnded = () => finish(false);
    const onError = () => finish(true);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    video.play()?.catch((error: unknown) => {
      if ((error as { name?: string })?.name !== "AbortError") finish(true);
    });
    startTimer = window.setTimeout(() => { if (!started) finish(true); }, 8000);
    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      window.clearTimeout(stallTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
    };
  }, []);

  // Once the fade has finished, release the video so it stops decoding/holding memory.
  useEffect(() => {
    if (!heroDone) return;
    const timer = window.setTimeout(() => {
      const video = heroVideoRef.current;
      if (!video) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [heroDone]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  // Subtle parallax: the hero photo lags slightly behind scroll, capped and rAF-throttled.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 70);
        if (heroImageWrapRef.current) heroImageWrapRef.current.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <main>
    <section className={`hero${heroDone ? " hero--done" : ""}${heroFallback ? " hero--fallback" : ""}`} aria-label="Black Angel collection">
      <div className="hero__image-wrap" ref={heroImageWrapRef}>
        <img className="hero__image" src={heroImage} alt="Woman wearing the Black Angel dress inside a private jet" width={1536} height={1920} />
        <video className="hero__video" ref={heroVideoRef} poster="/videos/hero-poster.jpg" muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      </div>
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
          <div className="product-card__image">
            <span>NEW IN</span>
            <button
              type="button"
              className={`product-card__wish ${isWishlisted(product.slug) ? "is-active" : ""}`}
              aria-label={isWishlisted(product.slug) ? "Remove from wishlist" : "Save to wishlist"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleWishlist({ slug: product.slug, name: product.name, price: product.price, image: product.image });
              }}
            >
              <Heart />
            </button>
            <img src={product.image} alt={product.name} width={1024} height={1280} loading="lazy" />
            <Button
              variant="luxury"
              size="plain"
              className="product-card__quick-add"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                addToBag(product);
              }}
            >
              <Plus /> ADD TO BAG
            </Button>
          </div>
          <h3>{product.name}</h3><p>{formatPrice(product.price)}</p>
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
      <div className="footer__brand"><img src={logoBadge} alt="Lioness Dress" /><span>LIONESS DRESS</span><small>Dress for self confident girls</small></div>
      <div><h3>CLIENT CARE</h3><a href="mailto:info@lionessdress.com">Contact</a><a href="#delivery">Delivery & returns</a><a href="#size-guide">Size guide</a></div>
      <div><h3>FOLLOW</h3><a href="https://instagram.com/lioness.dress" target="_blank" rel="noreferrer">Instagram</a><a href="https://wa.me/77789654642" target="_blank" rel="noreferrer">WhatsApp</a></div>
      <div><h3>PRIVATE ACCESS</h3><a href="https://instagram.com/lioness.dress" target="_blank" rel="noreferrer">Instagram</a><a href="https://lionessdress.com">lionessdress.com</a></div>
    </footer>
  </main>;
}