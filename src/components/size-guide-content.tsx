import type { Lang } from "@/lib/i18n";

const rows = [
  { size: "XS", eu: "34", ru: "40", bust: "80", waist: "62", hips: "86" },
  { size: "S", eu: "36", ru: "42", bust: "84", waist: "66", hips: "90" },
  { size: "M", eu: "38", ru: "44", bust: "88", waist: "70", hips: "94" },
  { size: "L", eu: "40", ru: "46", bust: "92", waist: "74", hips: "98" },
];

type Item = { title: string; text: string };

const copy: Record<
  Lang,
  {
    subtitle: string;
    intro: string;
    columns: string[];
    range: string;
    approx: string;
    fitTitle: string;
    fit: Item[];
    between: { lead: string; text: string };
    stretch: string;
    measureTitle: string;
    measureHint: string;
    figureAlt: string;
    steps: Item[];
    extraTitle: string;
    extra: Item[];
  }
> = {
  en: {
    subtitle: "Evening dresses • Cocktail dresses • Fitted silhouettes",
    intro:
      "Measure your body and compare your measurements with the chart below. All measurements are in centimetres (cm) and refer to the body, not the finished garment.",
    columns: ["Size", "EU*", "RU / CIS*", "Bust", "Waist", "Hips"],
    range: "Size range: XS, S, M and L. Availability depends on the style and collection.",
    approx:
      "* EU and RU / CIS labels are approximate references. Sizing varies between brands and national systems. Use body measurements as your main guide.",
    fitTitle: "Fit by garment",
    fit: [
      { title: "Fitted & cocktail dresses", text: "Check bust, waist and hips. All three measurements matter for a close fit." },
      { title: "Mini, midi & maxi dresses", text: "The size chart stays the same; dress length is listed separately for each style." },
      { title: "Open-back & mesh styles", text: "Check the product details and measure in underwear suitable for the design." },
      { title: "Long-sleeved dresses", text: "Check bust, waist and hips, plus sleeve and shoulder measurements where provided." },
    ],
    between: {
      lead: "Between sizes?",
      text: "If your measurements fall across different sizes, contact us with your bust, waist, hips and height so we can help with the fit of your chosen style.",
    },
    stretch:
      "Fabric stretch, lining and cut affect the fit. Finished garment measurements and lengths should be checked in the individual product description.",
    measureTitle: "How to measure",
    measureHint: "Use a soft measuring tape • Stand naturally • Do not pull the tape tight",
    figureAlt: "Body measurement diagram with numbered points",
    steps: [
      { title: "1. Height", text: "Stand barefoot and upright. Measure from the top of your head to the floor." },
      { title: "2. Bust", text: "Measure around the fullest part of your bust, passing the tape under your arms." },
      { title: "3. Waist", text: "Measure around your natural waist, at the narrowest part of your torso. Tie a thin ribbon here as a reference." },
      { title: "4. Hips", text: "Measure horizontally around the fullest part of your hips and seat." },
      { title: "5. Inside leg", text: "Measure from the crotch to the ankle along the inside of your leg. Finished trouser length is checked separately." },
      { title: "6. Arm length", text: "Measure from the shoulder point over a slightly bent elbow to the wrist." },
      { title: "7. Shoulder length", text: "Measure from the base of your neck to the shoulder point. This is the length of one shoulder." },
      { title: "8. Upper arm", text: "Measure around the fullest part of your upper arm while it is relaxed." },
      { title: "9. Thigh", text: "Measure around the fullest part of one thigh, just below the seat." },
    ],
    extraTitle: "Additional measurements",
    extra: [
      { title: "Back waist length", text: "From the prominent bone at the base of the neck down to the natural waist." },
      { title: "Outside leg", text: "From the natural waist down the side of the leg to the ankle." },
      { title: "Seated crotch depth", text: "Sit upright on a firm chair. Measure vertically from the natural waist to the seat." },
      {
        title: "Garment length",
        text: "For skirts, check from the top of the waistband to the hem. For dresses and jackets, use the starting point stated in the product description.",
      },
    ],
  },
  ru: {
    subtitle: "Вечерние платья • Коктейльные платья • Приталенные силуэты",
    intro:
      "Снимите мерки и сравните их с таблицей ниже. Все значения указаны в сантиметрах (см) и относятся к параметрам тела, а не к замерам готовой одежды.",
    columns: ["Размер", "EU*", "RU / СНГ*", "Грудь", "Талия", "Бёдра"],
    range: "Размерный ряд: XS, S, M и L. Наличие зависит от модели и коллекции.",
    approx:
      "* Соответствие EU и RU / СНГ ориентировочное. Размерные системы разных брендов и стран отличаются. Ориентируйтесь на мерки тела.",
    fitTitle: "Как выбрать размер по типу изделия",
    fit: [
      { title: "Приталенные и коктейльные платья", text: "Проверьте грудь, талию и бёдра. Для облегающей посадки важны все три обхвата." },
      { title: "Платья мини, миди и макси", text: "Используется общая размерная сетка; длина платья указывается отдельно для каждой модели." },
      { title: "Модели с открытой спиной и сеткой", text: "Учитывайте особенности модели и снимайте мерки в белье, подходящем для выбранного платья." },
      { title: "Платья с длинным рукавом", text: "Проверьте грудь, талию и бёдра, а также плечи и рукав, если эти замеры указаны." },
    ],
    between: {
      lead: "Мерки соответствуют разным размерам?",
      text: "Напишите нам ваши обхваты груди, талии, бёдер и рост — мы поможем подобрать размер выбранной модели.",
    },
    stretch:
      "На посадку влияют растяжимость ткани, подкладка и крой. Замеры готового изделия и его длину уточняйте в описании конкретной модели.",
    measureTitle: "Как снимать мерки",
    measureHint: "Используйте мягкую сантиметровую ленту • Стойте спокойно • Не затягивайте ленту",
    figureAlt: "Схема снятия мерок с пронумерованными точками",
    steps: [
      { title: "1. Рост", text: "Встаньте прямо, без обуви. Измерьте расстояние от макушки до пола." },
      { title: "2. Обхват груди", text: "Измерьте обхват по наиболее выступающим точкам груди, проводя ленту под руками." },
      { title: "3. Обхват талии", text: "Измерьте обхват в самом узком месте корпуса. Повяжите здесь тонкую ленту как ориентир." },
      { title: "4. Обхват бёдер", text: "Проведите ленту горизонтально вокруг наиболее выступающей части бёдер и ягодиц." },
      { title: "5. Внутренняя длина ноги", text: "Измерьте от промежности до щиколотки по внутренней стороне ноги. Длину готовых брюк уточняйте отдельно." },
      { title: "6. Длина руки", text: "Измерьте от плечевой точки через слегка согнутый локоть до запястья." },
      { title: "7. Длина плеча", text: "Измерьте от основания шеи до плечевого сустава. Это длина одного плеча." },
      { title: "8. Обхват плеча", text: "Измерьте обхват самой полной части верхней части руки. Рука должна быть расслаблена." },
      { title: "9. Обхват бедра", text: "Измерьте обхват самой полной части одной ноги, непосредственно под ягодицей." },
    ],
    extraTitle: "Дополнительные мерки",
    extra: [
      { title: "Длина спины до талии", text: "От выступающего позвонка у основания шеи до естественной линии талии." },
      { title: "Боковая длина ноги", text: "От естественной линии талии по боковой стороне ноги до щиколотки." },
      { title: "Высота сидения", text: "Сядьте прямо на твёрдый стул. Измерьте вертикально от талии до поверхности сиденья." },
      {
        title: "Длина изделия",
        text: "Юбку измеряйте от верхнего края пояса до низа. Для платья и жакета используйте точку начала измерения, указанную в описании товара.",
      },
    ],
  },
};

function Items({ items }: { items: Item[] }) {
  return (
    <>
      {items.map((it) => (
        <p key={it.title}>
          <strong>{it.title}</strong>
          <br />
          {it.text}
        </p>
      ))}
    </>
  );
}

export function SizeGuideContent({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return (
    <>
      <p className="content-page__meta">{c.subtitle}</p>
      <p className="content-page__intro">{c.intro}</p>

      <table className="content-page__table content-page__table--wide">
        <thead>
          <tr>
            {c.columns.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.size}>
              <td>{r.size}</td>
              <td>{r.eu}</td>
              <td>{r.ru}</td>
              <td>{r.bust}</td>
              <td>{r.waist}</td>
              <td>{r.hips}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{c.range}</p>
      <p className="content-page__meta">{c.approx}</p>

      <h2>{c.fitTitle}</h2>
      <Items items={c.fit} />
      <p>
        <strong>{c.between.lead}</strong> {c.between.text}
      </p>
      <p>{c.stretch}</p>

      <h2>{c.measureTitle}</h2>
      <p className="content-page__meta">{c.measureHint}</p>
      <img
        className="content-page__figure"
        src={`/size-guide/measure-${lang}.png`}
        alt={c.figureAlt}
        width={990}
        height={1215}
        loading="lazy"
      />
      <Items items={c.steps} />

      <h2>{c.extraTitle}</h2>
      <Items items={c.extra} />
    </>
  );
}
