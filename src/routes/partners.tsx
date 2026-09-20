import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/partners")({
  head: () => ({ meta: [{ title: "Partners — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.partners" />,
});
