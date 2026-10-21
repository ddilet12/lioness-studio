import type { Lang } from "@/lib/i18n";

const copy: Record<
  Lang,
  {
    intlTitle: string;
    lead: string;
    intl: string;
    optionsTitle: string;
    options: string;
    transitTitle: string;
    columns: [string, string];
    rows: [string, string][];
    note: string;
    freeTitle: string;
    free: string[];
    dutiesTitle: string;
    duties: string[];
  }
> = {
  en: {
    intlTitle: "Shipping & delivery",
    lead: "From Astana, Kazakhstan, to your wardrobe.",
    intl: "International shipping is available to eligible destinations, subject to current courier coverage and local import requirements.",
    optionsTitle: "Shipping options",
    options: "Depending on your destination, shipping may be arranged through DHL Express, FedEx, UPS, or an alternative service such as QazPost/EMS or CDEK.",
    transitTitle: "Estimated transit times",
    columns: ["Destination", "DHL Express general estimate"],
    rows: [
      ["Europe — including France, Germany, Italy, Spain, the Netherlands, Belgium, Austria, Poland, the United Kingdom and Switzerland", "2–3 days"],
      ["United States", "3–5 days*"],
      ["Canada", "3–5 days*"],
      ["Australia", "3–5 days*"],
      ["Brazil", "3–5 days*"],
    ],
    note: "* The 3–5-day estimate is DHL Kazakhstan’s general worldwide indication, rather than a confirmed delivery window for each country listed. Availability and transit time must be checked for your exact delivery address. Remote locations and customs clearance may require additional time.",
    freeTitle: "Complimentary shipping & door-to-door delivery",
    free: [
      "We offer complimentary shipping within Kazakhstan, to CIS countries and internationally to eligible destinations. Shipping is included in the price of your purchase.",
      "We usually deliver orders directly to our customers’ doors, subject to courier coverage and local delivery conditions.",
    ],
    dutiesTitle: "Import duties & taxes",
    duties: [
      "Complimentary shipping does not include import duties, VAT, local taxes or customs clearance fees that may apply in the destination country, including the United Arab Emirates, the United States, European countries, Canada, Australia and Brazil.",
      "Any such charges are determined by the destination country’s authorities and are the responsibility of the recipient. We do not cover or reimburse these charges. Payment may be required before your order can be released by customs or delivered.",
      "Please check your local import requirements before placing your order.",
    ],
  },
  ru: {
    intlTitle: "Доставка по миру",
    lead: "Из Астаны, Казахстан, прямо в ваш гардероб.",
    intl: "Международная доставка доступна в подходящие страны с учётом текущего покрытия курьерских служб и местных правил импорта.",
    optionsTitle: "Способы доставки",
    options: "В зависимости от страны назначения доставка может быть организована через DHL Express, FedEx, UPS или альтернативные службы, такие как QazPost/EMS или CDEK.",
    transitTitle: "Ориентировочные сроки доставки",
    columns: ["Направление", "Ориентировочный срок DHL Express"],
    rows: [
      ["Европа — включая Францию, Германию, Италию, Испанию, Нидерланды, Бельгию, Австрию, Польшу, Великобританию и Швейцарию", "2–3 дня"],
      ["США", "3–5 дней*"],
      ["Канада", "3–5 дней*"],
      ["Австралия", "3–5 дней*"],
      ["Бразилия", "3–5 дней*"],
    ],
    note: "* Срок 3–5 дней — это общая ориентировочная оценка DHL Kazakhstan для международных отправлений, а не гарантированный период доставки для каждой из перечисленных стран. Возможность доставки и точное время в пути зависят от конкретного адреса назначения. В случае доставки в отдалённые районы или необходимости прохождения таможенного оформления может потребоваться дополнительное время.",
    freeTitle: "Бесплатная доставка «до двери»",
    free: [
      "Мы предлагаем бесплатную доставку по Казахстану, в страны СНГ, а также в ряд других стран. Стоимость доставки уже включена в цену вашего заказа.",
      "Как правило, мы осуществляем доставку заказов непосредственно «до двери» получателя (при условии наличия курьерского покрытия и с учётом местных условий доставки).",
    ],
    dutiesTitle: "Импортные пошлины и налоги",
    duties: [
      "Бесплатная доставка не покрывает импортные пошлины, НДС, местные налоги или таможенные сборы, которые могут взиматься в стране назначения (включая Объединённые Арабские Эмираты, США, страны Европы, Канаду, Австралию, Бразилию и другие государства).",
      "Размер подобных платежей определяется органами власти страны назначения, и ответственность за их уплату лежит на получателе. Мы не покрываем и не возмещаем такие расходы. Для прохождения таможенной очистки или осуществления доставки может потребоваться предварительная оплата данных сборов.",
      "Пожалуйста, ознакомьтесь с правилами импорта, действующими в вашей стране, перед оформлением заказа.",
    ],
  },
};

export function DeliveryExtra({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <h2>{c.intlTitle}</h2>
      <p>{c.lead}</p>
      <p>{c.intl}</p>

      <h2>{c.optionsTitle}</h2>
      <p>{c.options}</p>

      <h2>{c.transitTitle}</h2>
      <table className="content-page__table content-page__table--transit">
        <thead>
          <tr>
            <th>{c.columns[0]}</th>
            <th>{c.columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {c.rows.map(([dest, time]) => (
            <tr key={dest}>
              <td>{dest}</td>
              <td>{time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="content-page__meta">{c.note}</p>

      <h2>{c.freeTitle}</h2>
      {c.free.map((t) => (
        <p key={t}>{t}</p>
      ))}

      <h2>{c.dutiesTitle}</h2>
      {c.duties.map((t) => (
        <p key={t}>{t}</p>
      ))}
    </>
  );
}
