import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/returns-exchanges")({
  head: () => ({ meta: [{ title: "Returns & Exchanges — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.returns" />,
});
