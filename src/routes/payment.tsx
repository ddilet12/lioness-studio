import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentList, ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment — Lioness Dress" }] }),
  component: Payment,
});

function Payment() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.payment">
      <h2>{t("payment.kzTitle")}</h2>
      <p>{t("payment.kzIntro")}</p>
      <ContentList text={t("payment.kzList")} />

      <h2>{t("payment.howTitle")}</h2>
      <p>{t("payment.how1")}</p>
      <p>{t("payment.how2")}</p>
      <p>{t("payment.how3")}</p>

      <h2>{t("payment.returnTitle")}</h2>
      <p>{t("payment.return1")}</p>
      <p>{t("payment.return2")}</p>
      <p>
        {t("payment.return3")} «<Link to="/returns-exchanges">{t("footer.returns")}</Link>».
      </p>
    </ContentPage>
  );
}
