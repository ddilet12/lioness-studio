import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { lines, useI18n } from "@/lib/i18n";
import { SIZES } from "@/lib/products";

const MEASUREMENTS: Record<(typeof SIZES)[number], [number, number, number]> = {
  XS: [82, 62, 88],
  S: [86, 66, 92],
  M: [90, 70, 96],
  L: [94, 74, 100],
};

export const Route = createFileRoute("/size-guide")({
  head: () => ({ meta: [{ title: "Size Guide — Lioness Dress" }] }),
  component: SizeGuide,
});

function SizeGuide() {
  const { t } = useI18n();
  return (
    <ContentPage titleKey="footer.sizeGuide">
      <p className="content-page__intro">{t("sizeGuide.intro")}</p>

      <table className="content-page__table">
        <thead>
          <tr>
            <th></th>
            {SIZES.map((size) => (
              <th key={size}>{size}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(["bust", "waist", "hips"] as const).map((row, rowIndex) => (
            <tr key={row}>
              <th>{t(`sizeGuide.${row}`)}</th>
              {SIZES.map((size) => (
                <td key={size}>{MEASUREMENTS[size][rowIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t("sizeGuide.howTitle")}</h2>
      <p>{lines(t("sizeGuide.howBody"))}</p>

      <h2>{t("sizeGuide.contactTitle")}</h2>
      <p>{t("sizeGuide.contactBody")}</p>
    </ContentPage>
  );
}
