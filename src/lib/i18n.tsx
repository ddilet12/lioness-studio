import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "ru";

const STORAGE_KEY = "lioness-lang";

/**
 * Line breaks inside dictionary strings: "\n" is a <br />, "\v" is a <br /> that only shows on mobile
 * (matches the `.mobile-only` helper class used by the layout).
 */
export function lines(text: string): ReactNode {
  return text.split(/(\n|\v)/).map((part, index) => {
    if (part === "\n") return <br key={index} />;
    if (part === "\v") return <br key={index} className="mobile-only" />;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

const en = {
  // Header / navigation
  "nav.primary": "Primary navigation",
  "nav.home": "Lioness Dress home",
  "nav.shop": "SHOP",
  "nav.blackAngel": "BLACK ANGEL",
  "nav.ourStory": "OUR STORY",
  "nav.allDresses": "ALL DRESSES",
  "nav.black": "BLACK",
  "nav.red": "RED",
  "nav.featureCollection": "BLACK ANGEL COLLECTION →",
  "nav.featureNew": "NEW ARRIVALS →",
  "nav.featureCollectionAlt": "Black Angel collection",
  "nav.featureNewAlt": "The Lioness Woman campaign",
  "nav.search": "SEARCH",
  "nav.wishlist": "WISHLIST",
  "nav.bag": "BAG",
  "nav.openWishlist": "Open wishlist",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "nav.menu": "Menu",
  "search.dialog": "Product search",
  "search.close": "Close search",
  "search.placeholder": "TYPE A PRODUCT NAME",

  // Hero
  "hero.label": "Black Angel collection",
  "hero.alt": "Woman wearing the Black Angel dress inside a private jet",
  "hero.eyebrow": "PARIS 2026",
  "hero.cta": "DISCOVER THE COLLECTION",
  "hero.meta": "DESIGNED FOR SELF-CONFIDENT GIRLS",

  // Manifesto
  "manifesto.eyebrow": "NEW COLLECTION · PARIS 2026",
  "manifesto.title.a": "Elegance\nwith an ",
  "manifesto.title.b": "edge.",
  "manifesto.body": "Lioness Dress is made for\nthe woman who never asks\npermission to be\v unforgettable.",

  // Collection
  "collection.eyebrow": "THE COLLECTION",
  "collection.title": "New arrivals",
  "collection.filterLabel": "Filter products",
  "collection.all": "ALL",
  "collection.black": "BLACK",
  "collection.red": "RED",
  "product.new": "NEW IN",
  "product.wishAdd": "Save to wishlist",
  "product.wishRemove": "Remove from wishlist",
  "product.addToBag": "ADD TO BAG",

  // Campaign
  "campaign.alt": "Woman wearing a Lioness Dress on a Paris street",
  "campaign.eyebrow": "THE LIONESS WOMAN",
  "campaign.title": "She doesn’t follow the room.\nShe changes it.",
  "campaign.cta": "SHOP THE SIGNATURE DRESS",

  // Story
  "story.alt": "Lioness Dress atelier with black, ivory and red dresses",
  "story.eyebrow": "OUR SIGNATURE",
  "story.title": "From Astana\nto Paris.",
  "story.body": "Designed around confidence,\nsensuality and clean feminine\nlines. Every silhouette is created\nto make an entrance — and stay\nin memory.",
  "story.cta": "DISCOVER OUR STORY",

  // Product page
  "pdp.eyebrow": "BLACK ANGEL · PARIS 2026",
  "pdp.size": "SIZE",
  "pdp.back": "← BACK TO COLLECTION",
  "pdp.decrease": "Decrease quantity",
  "pdp.increase": "Increase quantity",

  // Bag
  "bag.title": "YOUR BAG",
  "bag.empty": "Your bag is empty.",
  "bag.count.one": "{n} selected style",
  "bag.count.other": "{n} selected styles",
  "bag.addMore": "Add {price} more for free shipping",
  "bag.unlocked": "You've unlocked free shipping",
  "bag.remove": "REMOVE",
  "bag.total": "TOTAL",
  "bag.checkout": "CHECKOUT",

  // Wishlist
  "wishlist.title": "WISHLIST",
  "wishlist.empty": "No saved styles yet.",
  "wishlist.count.one": "{n} saved style",
  "wishlist.count.other": "{n} saved styles",
  "wishlist.hint": "Tap the heart on any dress to save it here.",

  // Error pages
  "notFound.title": "Page not found",
  "notFound.body": "The page you're looking for doesn't exist or has been moved.",
  "error.title": "This page didn't load",
  "error.body": "Something went wrong on our end. You can try refreshing or head back home.",
  "error.retry": "Try again",
  "common.home": "Go home",
  "common.close": "Close",

  // Footer
  "footer.slogan": "Dresses for self-confident girls",
  "footer.care": "Customer Care",
  "footer.contact": "Contact Us",
  "footer.delivery": "Delivery",
  "footer.returns": "Returns & Exchanges",
  "footer.sizeGuide": "Size Guide",
  "footer.loyalty": "Loyalty Program",
  "footer.brand": "About the Brand",
  "footer.about": "About Us",
  "footer.partners": "Partners",
  "footer.wholesale": "Wholesale Enquiries",
  "footer.legal": "Legal Information",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.navigation": "Navigation",
  "footer.search": "Search",
  "footer.language": "Language",
  "footer.langEn": "English",
  "footer.langRu": "Русский",

  // Placeholder pages
  "stub.soon": "This page is coming soon.",
} as const;

export type TKey = keyof typeof en;

const ru: Record<TKey, string> = {
  "nav.primary": "Основная навигация",
  "nav.home": "Lioness Dress — на главную",
  "nav.shop": "МАГАЗИН",
  "nav.blackAngel": "BLACK ANGEL",
  "nav.ourStory": "НАША ИСТОРИЯ",
  "nav.allDresses": "ВСЕ ПЛАТЬЯ",
  "nav.black": "ЧЁРНЫЕ",
  "nav.red": "КРАСНЫЕ",
  "nav.featureCollection": "КОЛЛЕКЦИЯ BLACK ANGEL →",
  "nav.featureNew": "НОВИНКИ →",
  "nav.featureCollectionAlt": "Коллекция Black Angel",
  "nav.featureNewAlt": "Кампания The Lioness Woman",
  "nav.search": "ПОИСК",
  "nav.wishlist": "ИЗБРАННОЕ",
  "nav.bag": "КОРЗИНА",
  "nav.openWishlist": "Открыть избранное",
  "nav.openMenu": "Открыть меню",
  "nav.closeMenu": "Закрыть меню",
  "nav.menu": "Меню",
  "search.dialog": "Поиск по товарам",
  "search.close": "Закрыть поиск",
  "search.placeholder": "ВВЕДИТЕ НАЗВАНИЕ ТОВАРА",

  "hero.label": "Коллекция Black Angel",
  "hero.alt": "Девушка в платье Black Angel в салоне частного самолёта",
  "hero.eyebrow": "ПАРИЖ 2026",
  "hero.cta": "СМОТРЕТЬ КОЛЛЕКЦИЮ",
  "hero.meta": "СОЗДАНО ДЛЯ УВЕРЕННЫХ В СЕБЕ ДЕВУШЕК",

  "manifesto.eyebrow": "НОВАЯ КОЛЛЕКЦИЯ · ПАРИЖ 2026",
  "manifesto.title.a": "Элегантность\nс ",
  "manifesto.title.b": "характером.",
  "manifesto.body": "Lioness Dress создан для\nженщины, которая никогда\nне просит разрешения быть\v незабываемой.",

  "collection.eyebrow": "КОЛЛЕКЦИЯ",
  "collection.title": "Новинки",
  "collection.filterLabel": "Фильтр товаров",
  "collection.all": "ВСЕ",
  "collection.black": "ЧЁРНЫЕ",
  "collection.red": "КРАСНЫЕ",
  "product.new": "НОВИНКА",
  "product.wishAdd": "Добавить в избранное",
  "product.wishRemove": "Удалить из избранного",
  "product.addToBag": "В КОРЗИНУ",

  "campaign.alt": "Девушка в платье Lioness Dress на парижской улице",
  "campaign.eyebrow": "ЖЕНЩИНА LIONESS",
  "campaign.title": "Она не идёт за толпой.\nОна задаёт тон.",
  "campaign.cta": "СМОТРЕТЬ ФИРМЕННОЕ ПЛАТЬЕ",

  "story.alt": "Ателье Lioness Dress: чёрные, молочные и красные платья",
  "story.eyebrow": "НАШ ПОЧЕРК",
  "story.title": "Из Астаны\nв Париж.",
  "story.body": "Создано вокруг уверенности,\nчувственности и чистых женских\nлиний. Каждый силуэт задуман,\nчтобы произвести впечатление —\nи остаться в памяти.",
  "story.cta": "УЗНАТЬ НАШУ ИСТОРИЮ",

  "pdp.eyebrow": "BLACK ANGEL · ПАРИЖ 2026",
  "pdp.size": "РАЗМЕР",
  "pdp.back": "← НАЗАД В КОЛЛЕКЦИЮ",
  "pdp.decrease": "Уменьшить количество",
  "pdp.increase": "Увеличить количество",

  "bag.title": "ВАША КОРЗИНА",
  "bag.empty": "Ваша корзина пуста.",
  "bag.count.one": "Выбрана {n} модель",
  "bag.count.other": "Выбрано моделей: {n}",
  "bag.addMore": "Добавьте ещё {price} для бесплатной доставки",
  "bag.unlocked": "Бесплатная доставка включена",
  "bag.remove": "УДАЛИТЬ",
  "bag.total": "ИТОГО",
  "bag.checkout": "ОФОРМИТЬ ЗАКАЗ",

  "wishlist.title": "ИЗБРАННОЕ",
  "wishlist.empty": "Пока ничего не сохранено.",
  "wishlist.count.one": "Сохранена {n} модель",
  "wishlist.count.other": "Сохранено моделей: {n}",
  "wishlist.hint": "Нажмите на сердечко у любого платья, чтобы сохранить его здесь.",

  "notFound.title": "Страница не найдена",
  "notFound.body": "Такой страницы не существует, или она была перемещена.",
  "error.title": "Страница не загрузилась",
  "error.body": "Что-то пошло не так на нашей стороне. Попробуйте обновить страницу или вернитесь на главную.",
  "error.retry": "Попробовать снова",
  "common.home": "На главную",
  "common.close": "Закрыть",

  "footer.slogan": "Платья для уверенных в себе девушек",
  "footer.care": "Помощь клиентам",
  "footer.contact": "Связаться с нами",
  "footer.delivery": "Доставка",
  "footer.returns": "Возврат и обмен",
  "footer.sizeGuide": "Таблица размеров",
  "footer.loyalty": "Программа лояльности",
  "footer.brand": "О бренде",
  "footer.about": "О нас",
  "footer.partners": "Партнёры",
  "footer.wholesale": "Оптовое сотрудничество",
  "footer.legal": "Правовая информация",
  "footer.privacy": "Политика конфиденциальности",
  "footer.terms": "Условия использования",
  "footer.navigation": "Навигация",
  "footer.search": "Поиск",
  "footer.language": "Язык",
  "footer.langEn": "English",
  "footer.langRu": "Русский",

  "stub.soon": "Эта страница скоро появится.",
};

const dictionaries: Record<Lang, Record<TKey, string>> = { en, ru };

type Vars = Record<string, string | number>;

function translate(lang: Lang, key: TKey, vars?: Vars) {
  let text = dictionaries[lang][key];
  if (vars) for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey, vars?: Vars) => string;
  /** Plural-aware lookup: picks `${base}.one` / `.other` (English) using the language's plural rule. */
  tn: (base: "bag.count" | "wishlist.count", count: number) => string;
};

const fallback: I18nValue = {
  lang: "en",
  setLang: () => {},
  t: (key, vars) => translate("en", key, vars),
  tn: (base, count) => translate("en", `${base}.${count === 1 ? "one" : "other"}`, { n: count }),
};

const I18nContext = createContext<I18nValue>(fallback);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start in English so server and first client render match; the saved choice is applied after mount.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "ru") setLangState("ru");
    } catch {
      /* storage unavailable: stay on English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
      tn: (base, count) => {
        const category = new Intl.PluralRules(lang).select(count);
        // English ships one/other, Russian one/other with the "other" wording reused for few/many.
        const form = category === "one" ? "one" : "other";
        return translate(lang, `${base}.${form}`, { n: count });
      },
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
