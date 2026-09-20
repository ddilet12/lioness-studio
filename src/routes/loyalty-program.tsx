import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/loyalty-program")({
  head: () => ({ meta: [{ title: "Loyalty Program — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.loyalty" />,
});
