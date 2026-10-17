import { createFileRoute } from "@tanstack/react-router";
import { SectionPage } from "@/components/section-page";
import { getSectionProducts } from "@/lib/shopify.server";

export const Route = createFileRoute("/party-dresses")({
  loader: () => getSectionProducts({ data: "party-dresses" }).catch(() => []),
  head: () => ({ meta: [{ title: "Party Dresses — Lioness Dress" }] }),
  component: PartyDresses,
});

function PartyDresses() {
  const products = Route.useLoaderData();
  return <SectionPage titleKey="nav.partyDresses" introKey="section.partyDresses.intro" products={products} />;
}
