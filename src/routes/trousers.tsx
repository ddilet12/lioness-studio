import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { getSectionProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/trousers")({
  loader: () => getSectionProducts({ data: "trousers" }).catch(() => []),
  head: () => ({ meta: [{ title: "Trousers — Lioness Dress" }] }),
  component: Trousers,
});

function Trousers() {
  const products = Route.useLoaderData();
  return <SectionPage titleKey="nav.trousers" introKey="section.trousers.intro" products={products} />;
}
