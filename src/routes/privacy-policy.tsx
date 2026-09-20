import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.privacy" />,
});
