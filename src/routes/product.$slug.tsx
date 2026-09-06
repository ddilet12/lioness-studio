import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop-context";
import { formatPrice, products } from "@/lib/products";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = products.find((item) => item.slug === params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Lioness Dress` : "Dress not found — Lioness Dress" },
      { name: "description", content: loaderData?.description ?? "Explore Lioness Dress eveningwear." },
      { property: "og:title", content: loaderData ? `${loaderData.name} — Lioness Dress` : "Lioness Dress" },
      { property: "og:description", content: loaderData?.description ?? "Explore Lioness Dress eveningwear." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const { addToBag } = useShop();
  return <main className="product-page">
    <div className="product-page__image"><img src={product.image} alt={product.name} width={1024} height={1280} /></div>
    <section className="product-page__details">
      <p className="eyebrow">BLACK ANGEL · PARIS 2026</p>
      <h1>{product.name}</h1>
      <p className="product-page__price">{formatPrice(product.price)}</p>
      <p className="product-page__description">{product.description}</p>
      <div className="size-row"><span>SIZE</span>{["XS", "S", "M", "L"].map((size) => <Button key={size} variant="quantity" size="iconSlim">{size}</Button>)}</div>
      <div className="product-page__actions"><div className="quantity-control"><Button variant="quantity" size="iconSlim" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus /></Button><span>{quantity}</span><Button variant="quantity" size="iconSlim" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus /></Button></div><Button variant="luxury" size="wide" onClick={() => addToBag(product, quantity)}>ADD TO BAG</Button></div>
      <Link to="/" hash="collection" className="text-link">← BACK TO COLLECTION</Link>
    </section>
  </main>;
}