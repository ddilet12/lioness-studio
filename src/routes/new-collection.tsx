import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { getSectionProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/new-collection")({
  loader: () => getSectionProducts({ data: "new-collection" }).catch(() => []),
  head: () => ({ meta: [{ title: "New Collection — Lioness Dress" }] }),
  component: NewCollection,
});

function NewCollection() {
  const products = Route.useLoaderData();
  return <SectionPage titleKey="nav.newCollection" introKey="section.newCollection.intro" products={products} />;
}
