import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/about-us")({
  head: () => ({ meta: [{ title: "About Us — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.about" />,
});
