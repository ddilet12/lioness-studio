import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { getSectionProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/bestsellers")({
  loader: () => getSectionProducts({ data: "bestsellers" }).catch(() => []),
  head: () => ({ meta: [{ title: "Bestsellers — Lioness Dress" }] }),
  component: Bestsellers,
});

function Bestsellers() {
  const products = Route.useLoaderData();
  return <SectionPage titleKey="nav.bestsellers" introKey="section.bestsellers.intro" products={products} />;
}
