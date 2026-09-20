import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/delivery")({
  head: () => ({ meta: [{ title: "Delivery — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.delivery" />,
});
