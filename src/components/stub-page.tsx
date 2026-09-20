import { useI18n, type TKey } from "@/lib/i18n";

/** Placeholder for footer pages whose content is not written yet: title in the active language, nothing else. */
export function StubPage({ titleKey }: { titleKey: TKey }) {
  const { t } = useI18n();
  return (
    <main className="stub-page">
      <p className="eyebrow">LIONESS DRESS</p>
      <h1>{t(titleKey)}</h1>
      <p className="stub-page__note">{t("stub.soon")}</p>
    </main>
  );
}
