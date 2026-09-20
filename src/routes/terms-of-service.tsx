import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({ meta: [{ title: "Terms of Service — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.terms" />,
});
