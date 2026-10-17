import { createServerFn } from "@tanstack/react-start";

/** Official National Bank of Kazakhstan rates: how many tenge one euro / one US dollar costs. */
export type Rates = { usd: number; eur: number };

const SIX_HOURS = 6 * 60 * 60 * 1000;
let cache: { rates: Rates; at: number } | undefined;

async function loadRates(): Promise<Rates | null> {
  // The bank publishes one file per day, addressed by date in Kazakhstan time (dd.mm.yyyy).
  const today = new Date().toLocaleDateString("ru-RU", { timeZone: "Asia/Almaty" });
  const response = await fetch(`https://nationalbank.kz/rss/get_rates.cfm?fdate=${today}`);
  if (!response.ok) return null;
  const xml = await response.text();
  const pick = (code: string) => Number(xml.match(new RegExp(`<title>${code}</title>\\s*<description>([\\d.,]+)`))?.[1]?.replace(",", "."));
  const usd = pick("USD");
  const eur = pick("EUR");
  return usd > 0 && eur > 0 ? { usd, eur } : null;
}

/** Shown next to every tenge price for information only; null when the bank is unreachable (conversions are then hidden). */
export const getRates = createServerFn({ method: "GET" }).handler(async (): Promise<Rates | null> => {
  if (cache && Date.now() - cache.at < SIX_HOURS) return cache.rates;
  try {
    const rates = await loadRates();
    if (rates) cache = { rates, at: Date.now() };
    return rates ?? cache?.rates ?? null;
  } catch {
    return cache?.rates ?? null;
  }
});
