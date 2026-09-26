import type { ReactNode } from "react";
import { useI18n, type TKey } from "@/lib/i18n";

/** A footer/legal page with real copy: eyebrow + title, then freeform section content. */
export function ContentPage({ titleKey, children }: { titleKey: TKey; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <main className="content-page">
      <p className="eyebrow">LIONESS DRESS</p>
      <h1>{t(titleKey)}</h1>
      <div className="content-page__body">{children}</div>
    </main>
  );
}

/** Renders a `\n`-separated i18n string as a bullet list. */
export function ContentList({ text }: { text: string }) {
  return (
    <ul>
      {text.split("\n").map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
