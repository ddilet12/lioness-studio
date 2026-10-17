import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { getRates } from "@/lib/rates.server";

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Euro and dollar equivalents of a tenge price, so shoppers abroad see what they pay. Charging is always in tenge. */
export function AltPrice({ value, note = false }: { value: number; note?: boolean }) {
  const { lang } = useI18n();
  const { data: rates } = useQuery({ queryKey: ["nbk-rates"], queryFn: () => getRates(), staleTime: 6 * 60 * 60 * 1000 });
  if (!rates || !(value > 0)) return null;
  return (
    <span className="alt-price">
      ≈ €{whole.format(value / rates.eur)} · ≈ ${whole.format(value / rates.usd)}
      {note && (
        <span className="alt-price__note">
          {lang === "en"
            ? "Prices are in tenge (₸), the currency you are charged in. € and $ are approximate, at the National Bank of Kazakhstan rate."
            : "Цены указаны в тенге (₸), в этой валюте происходит оплата. € и $ — справочно, по курсу Нацбанка РК."}
        </span>
      )}
    </span>
  );
}
