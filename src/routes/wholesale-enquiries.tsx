import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/stub-page";

export const Route = createFileRoute("/wholesale-enquiries")({
  head: () => ({ meta: [{ title: "Wholesale Enquiries — Lioness Dress" }] }),
  component: () => <StubPage titleKey="footer.wholesale" />,
});
