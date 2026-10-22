import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { getSectionProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/skirts")({
  loader: () => getSectionProducts({ data: "skirts" }).catch(() => []),
  head: () => ({ meta: [{ title: "Skirts — Lioness Dress" }] }),
  component: Skirts,
});

function Skirts() {
  const products = Route.useLoaderData();
  return <SectionPage titleKey="nav.skirts" introKey="section.skirts.intro" products={products} />;
}
