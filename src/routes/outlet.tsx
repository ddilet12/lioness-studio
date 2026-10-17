import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { getSectionProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/outlet")({
  loader: () => getSectionProducts({ data: "outlet" }).catch(() => []),
  head: () => ({ meta: [{ title: "Outlet — Lioness Dress" }] }),
  component: Outlet,
});

function Outlet() {
  const products = Route.useLoaderData();
  return <SectionPage titleKey="nav.outlet" introKey="section.outlet.intro" products={products} />;
}
