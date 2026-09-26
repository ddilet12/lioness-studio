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
  "product.soon": "COMING SOON",
  "product.selectSize": "SELECT SIZE",
  "desc.asymmetric": "One-shoulder evening gown in black. One long fitted sleeve, a softly draped and ruched waist and a side train that flows to the floor.",
  "desc.midi": "Black midi dress with a sweetheart bodice, sheer mesh sleeves and an illusion high neck. Fitted through the waist, with a draped hip and a pencil skirt.",
  "desc.rouge": "Deep red midi dress with sheer chiffon puff sleeves and buttoned cuffs. A draped, ruched waist flows into a fitted pencil skirt with a cascading side drape.",
  "desc.velvet": "Black velvet bodice with a round neckline and sheer tulle puff sleeves finished with velvet cuffs, over a flared mini skirt of black lace on tulle.",

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
  "pdp.chooseSize": "Please choose a size.",
  "bag.size": "Size: {size}",
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

  // Size Guide
  "sizeGuide.intro": "Every Lioness Dress piece is cut for a close, sculpted fit — if you're between two sizes, we recommend sizing up for comfort through the hip and thigh. All measurements below are body measurements in centimetres, not garment measurements.",
  "sizeGuide.bust": "Bust",
  "sizeGuide.waist": "Waist",
  "sizeGuide.hips": "Hips",
  "sizeGuide.howTitle": "How to measure",
  "sizeGuide.howBody": "Bust — around the fullest part of the chest, keeping the tape level.\nWaist — around the narrowest part, just above the navel.\nHips — around the fullest part, roughly 20 cm below the waist.",
  "sizeGuide.contactTitle": "Still not sure?",
  "sizeGuide.contactBody": "Write to us on WhatsApp or by email with your measurements — we'll help you choose the right size before you order.",

  // Delivery
  "delivery.intro": "Every dress is cut and finished to order in small batches, so please allow a short production time before your order ships.",
  "delivery.productionTitle": "Production time",
  "delivery.productionBody": "3–7 business days from order confirmation, depending on the style and current queue. We'll message you on WhatsApp once your dress is ready to ship.",
  "delivery.shippingTitle": "Shipping",
  "delivery.shippingBody": "Astana & Almaty — 1–2 days by courier after your order ships.\nRest of Kazakhstan — 2–5 days via courier or Kazpost.\nOutside Kazakhstan — available on request; write to us for a quote before ordering.",
  "delivery.costTitle": "Cost & tracking",
  "delivery.costBody": "Delivery cost is calculated at checkout based on your city. You'll receive a tracking number by WhatsApp or email as soon as your order leaves us.",

  // Returns & Exchanges
  "returns.intro": "We want you to love the way your Lioness Dress fits. If something isn't right, we're happy to help with an exchange or return.",
  "returns.windowTitle": "Return window",
  "returns.windowBody": "You have 14 days from the delivery date to request a return or exchange. The dress must be unworn, unwashed, with all tags attached and in its original packaging.",
  "returns.exchangeTitle": "Exchanges",
  "returns.exchangeBody": "Need a different size? Write to us and we'll arrange an exchange, subject to availability. Made-to-order and altered pieces are exchanged for size only, not style.",
  "returns.nonReturnableTitle": "Non-returnable items",
  "returns.nonReturnableBody": "Dresses altered to your personal measurements, and items marked as final sale, cannot be returned or exchanged unless they arrive damaged or faulty.",
  "returns.howTitle": "How to start a return",
  "returns.howBody": "Email info@lionessdress.com or message us on WhatsApp with your order number and reason for return. We'll confirm the next steps and cover return shipping if the dress arrived damaged or incorrect.",

  // Loyalty Program
  "loyalty.intro": "Our loyalty program is being prepared for launch alongside the first full Black Angel drop. Here's what to expect.",
  "loyalty.perksTitle": "What's coming",
  "loyalty.perks": "Early access to new collections before public release\nA gift on your birthday\nExclusive invitations to Lioness Dress trunk shows\nPoints on every order, redeemable toward future pieces",
  "loyalty.cta": "Want to be first in line? Follow us on Instagram or write to us — we'll let you know the moment it opens.",

  // About Us
  "about.intro": "Lioness Dress was born between two cities — Astana, where every piece is designed and made, and Paris, where the silhouette was found.",
  "about.philosophyTitle": "Our philosophy",
  "about.philosophyBody": "We design for the woman who walks into a room already certain of herself. Every dress is built around clean feminine lines, a sculpted fit and a single strong detail — never noise, never excess.",
  "about.collectionTitle": "The Black Angel collection",
  "about.collectionBody": "Our debut collection takes its name from the woman who wears black not to disappear, but to be impossible to ignore. Each dress is cut and finished by hand in small batches, so every piece gets real attention.",
  "about.contactTitle": "Say hello",
  "about.contactBody": "Questions about a dress, a custom order or a collaboration? Reach us any time at info@lionessdress.com or on WhatsApp.",

  // Partners
  "partners.intro": "We're open to working with people who share the same standard of taste and craft.",
  "partners.stockistsTitle": "Boutiques & stockists",
  "partners.stockistsBody": "If you run a multi-brand boutique or showroom and would like to carry Lioness Dress, write to us with your store details and location.",
  "partners.creativeTitle": "Stylists, photographers & creators",
  "partners.creativeBody": "For styling pulls, editorial loans and content collaborations, send your portfolio or page link and what you have in mind.",
  "partners.contactTitle": "Get in touch",
  "partners.contactBody": "Email info@lionessdress.com with a short introduction — we read every message and reply personally.",

  // Privacy Policy
  "privacy.updated": "Last updated: September 2026",
  "privacy.intro": "This policy explains what personal information Lioness Dress collects when you use lionessdress.com, why we collect it, and how you can control it.",
  "privacy.collectTitle": "Information we collect",
  "privacy.collectBody": "Contact details you give us when you place an order or write to us — name, phone number, email and delivery address.\nOrder details — the items you buy, sizes and order history.\nBasic technical data — such as browser type and pages visited, used only to keep the site working correctly.",
  "privacy.useTitle": "How we use it",
  "privacy.useBody": "To process and deliver your order, to answer your questions, and to let you know the status of your order. We do not sell your personal information to third parties.",
  "privacy.thirdPartyTitle": "Third-party services",
  "privacy.thirdPartyBody": "Our store runs on Shopify, which processes order and catalogue data on our behalf, and we may use a payment provider to process your payment securely. These providers only receive the information needed to do their job.",
  "privacy.rightsTitle": "Your rights",
  "privacy.rightsBody": "You can ask us at any time what information we hold about you, ask us to correct it, or ask us to delete it. Write to info@lionessdress.com and we'll respond within a reasonable time.",
  "privacy.contactTitle": "Contact",
  "privacy.contactBody": "Questions about this policy can be sent to info@lionessdress.com.",

  // Terms of Service
  "terms.updated": "Last updated: September 2026",
  "terms.intro": "These terms apply whenever you browse or order from lionessdress.com. By placing an order, you agree to them.",
  "terms.ordersTitle": "Orders & pricing",
  "terms.ordersBody": "All prices are shown in Kazakhstani tenge (₸) and include applicable taxes. We reserve the right to correct pricing errors and to cancel an order if a mistake is found, in which case you'll receive a full refund.",
  "terms.productionTitle": "Made-to-order pieces",
  "terms.productionBody": "Some styles are cut and finished after you order, within the production time stated on the Delivery page. Availability shown on the site is not a guarantee until your order is confirmed.",
  "terms.ipTitle": "Intellectual property",
  "terms.ipBody": "All designs, photography and text on this site belong to Lioness Dress and may not be copied or reused without our written permission.",
  "terms.liabilityTitle": "Liability",
  "terms.liabilityBody": "We do our best to describe every dress accurately, but colours may vary slightly by screen. Our liability is limited to the value of your order.",
  "terms.lawTitle": "Governing law",
  "terms.lawBody": "These terms are governed by the laws of the Republic of Kazakhstan.",
  "terms.contactTitle": "Contact",
  "terms.contactBody": "Questions about these terms can be sent to info@lionessdress.com.",
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
  "product.soon": "СКОРО В ПРОДАЖЕ",
  "product.selectSize": "ВЫБРАТЬ РАЗМЕР",
  "desc.asymmetric": "Вечернее платье в пол с открытым плечом, чёрное. Одно длинное приталенное плечо, мягкая драпировка на талии и шлейф, струящийся до пола.",
  "desc.midi": "Чёрное платье-миди с лифом-сердечком, полупрозрачными рукавами из сетки и воротником-иллюзией. Приталенный силуэт, драпировка на бедре и юбка-карандаш.",
  "desc.rouge": "Глубокое красное платье-миди с шифоновыми рукавами-фонариками и манжетами на пуговицах. Драпированная талия переходит в облегающую юбку-карандаш с каскадной драпировкой сбоку.",
  "desc.velvet": "Чёрный бархатный лиф с круглым вырезом и прозрачными рукавами из тюля с бархатными манжетами, пышная мини-юбка из чёрного кружева на тюле.",

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
  "pdp.chooseSize": "Пожалуйста, выберите размер.",
  "bag.size": "Размер: {size}",
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
  "footer.legal": "Правовая информация",
  "footer.privacy": "Политика конфиденциальности",
  "footer.terms": "Условия использования",
  "footer.navigation": "Навигация",
  "footer.search": "Поиск",
  "footer.language": "Язык",
  "footer.langEn": "English",
  "footer.langRu": "Русский",

  "stub.soon": "Эта страница скоро появится.",

  "sizeGuide.intro": "Каждая модель Lioness Dress скроена по фигуре — плотно и точно. Если вы между размерами, рекомендуем брать размер больше для комфорта в области бедра. Все замеры ниже — по телу, в сантиметрах, а не по самому изделию.",
  "sizeGuide.bust": "Грудь",
  "sizeGuide.waist": "Талия",
  "sizeGuide.hips": "Бёдра",
  "sizeGuide.howTitle": "Как снять мерки",
  "sizeGuide.howBody": "Грудь — по самой выступающей точке груди, лента строго горизонтально.\nТалия — по самой узкой точке, чуть выше пупка.\nБёдра — по самой выступающей точке, примерно на 20 см ниже талии.",
  "sizeGuide.contactTitle": "Не уверены в размере?",
  "sizeGuide.contactBody": "Напишите нам в WhatsApp или на почту свои мерки — поможем подобрать размер перед заказом.",

  "delivery.intro": "Каждое платье кроится и дошивается на заказ небольшими партиями, поэтому перед отправкой требуется немного времени на пошив.",
  "delivery.productionTitle": "Срок пошива",
  "delivery.productionBody": "3–7 рабочих дней с момента подтверждения заказа, в зависимости от модели и текущей загрузки. Как только платье будет готово к отправке, мы напишем вам в WhatsApp.",
  "delivery.shippingTitle": "Доставка",
  "delivery.shippingBody": "Астана и Алматы — 1–2 дня курьером после отправки заказа.\nОстальной Казахстан — 2–5 дней курьером или Казпочтой.\nЗа пределы Казахстана — по запросу, напишите нам до заказа, чтобы уточнить стоимость.",
  "delivery.costTitle": "Стоимость и отслеживание",
  "delivery.costBody": "Стоимость доставки рассчитывается при оформлении заказа в зависимости от города. Трек-номер вы получите в WhatsApp или на почту сразу после отправки заказа.",

  "returns.intro": "Мы хотим, чтобы вам было идеально в вашем платье Lioness Dress. Если что-то не подошло, поможем с обменом или возвратом.",
  "returns.windowTitle": "Сроки возврата",
  "returns.windowBody": "У вас есть 14 дней с даты получения, чтобы оформить возврат или обмен. Платье должно быть без следов носки, не стирано, с бирками и в оригинальной упаковке.",
  "returns.exchangeTitle": "Обмен",
  "returns.exchangeBody": "Нужен другой размер? Напишите нам — организуем обмен при наличии нужного размера. Изделия, сшитые под заказ или изменённые по фигуре, меняются только по размеру, не по модели.",
  "returns.nonReturnableTitle": "Товары, не подлежащие возврату",
  "returns.nonReturnableBody": "Платья, ушитые по вашим индивидуальным меркам, и товары с пометкой «финальная распродажа» не подлежат возврату или обмену — кроме случаев брака или повреждения при доставке.",
  "returns.howTitle": "Как оформить возврат",
  "returns.howBody": "Напишите на info@lionessdress.com или в WhatsApp, указав номер заказа и причину возврата. Мы подскажем дальнейшие шаги и оплатим обратную доставку, если платье пришло повреждённым или не тем, что вы заказывали.",

  "loyalty.intro": "Программа лояльности готовится к запуску вместе с первым полноценным релизом коллекции Black Angel. Вот что вас ждёт.",
  "loyalty.perksTitle": "Что будет доступно",
  "loyalty.perks": "Ранний доступ к новым коллекциям до официального релиза\nПодарок на день рождения\nПриглашения на закрытые показы Lioness Dress\nБаллы за каждый заказ, которые можно потратить на будущие покупки",
  "loyalty.cta": "Хотите быть в числе первых? Подпишитесь на нас в Instagram или напишите нам — сообщим, как только программа откроется.",

  "about.intro": "Lioness Dress родился между двумя городами — Астаной, где создаётся и шьётся каждая модель, и Парижем, откуда пришёл сам силуэт.",
  "about.philosophyTitle": "Наша философия",
  "about.philosophyBody": "Мы создаём платья для женщины, которая входит в комнату, уже зная себе цену. В основе каждого платья — чистые женственные линии, точная посадка по фигуре и одна сильная деталь — никогда шум, никогда лишнее.",
  "about.collectionTitle": "Коллекция Black Angel",
  "about.collectionBody": "Дебютная коллекция получила имя в честь женщины, которая носит чёрное не для того, чтобы слиться с толпой, а чтобы её было невозможно не заметить. Каждое платье кроится и дошивается вручную небольшими партиями — с вниманием к каждой детали.",
  "about.contactTitle": "Написать нам",
  "about.contactBody": "Вопросы о платье, индивидуальном заказе или сотрудничестве? Пишите в любое время на info@lionessdress.com или в WhatsApp.",

  "partners.intro": "Мы открыты к сотрудничеству с теми, кто разделяет наш уровень вкуса и мастерства.",
  "partners.stockistsTitle": "Бутики и байеры",
  "partners.stockistsBody": "Если вы управляете мультибрендовым бутиком или шоурумом и хотите добавить Lioness Dress в свой ассортимент — напишите нам, расскажите о магазине и укажите город.",
  "partners.creativeTitle": "Стилисты, фотографы и авторы",
  "partners.creativeBody": "Для стайлинга, съёмок и коллабораций пришлите портфолио или ссылку на страницу и опишите вашу идею.",
  "partners.contactTitle": "Связаться с нами",
  "partners.contactBody": "Напишите на info@lionessdress.com с коротким описанием — мы читаем каждое сообщение и отвечаем лично.",

  "privacy.updated": "Последнее обновление: сентябрь 2026",
  "privacy.intro": "В этой политике описано, какие персональные данные Lioness Dress собирает при использовании сайта lionessdress.com, зачем это нужно и как вы можете ими управлять.",
  "privacy.collectTitle": "Какие данные мы собираем",
  "privacy.collectBody": "Контактные данные, которые вы указываете при заказе или обращении — имя, телефон, email и адрес доставки.\nДанные о заказе — какие товары вы купили, размеры и история заказов.\nТехнические данные — тип браузера и посещённые страницы, используются только для корректной работы сайта.",
  "privacy.useTitle": "Как мы используем данные",
  "privacy.useBody": "Чтобы обработать и доставить ваш заказ, ответить на вопросы и сообщать о статусе заказа. Мы не продаём ваши персональные данные третьим лицам.",
  "privacy.thirdPartyTitle": "Сторонние сервисы",
  "privacy.thirdPartyBody": "Наш магазин работает на платформе Shopify, которая обрабатывает данные о заказах и каталоге от нашего имени, а для приёма оплаты может использоваться платёжный провайдер. Эти сервисы получают только те данные, которые необходимы для их работы.",
  "privacy.rightsTitle": "Ваши права",
  "privacy.rightsBody": "Вы можете в любой момент запросить у нас информацию о том, какие данные мы храним, попросить их исправить или удалить. Напишите на info@lionessdress.com — мы ответим в разумные сроки.",
  "privacy.contactTitle": "Контакты",
  "privacy.contactBody": "По вопросам, связанным с этой политикой, пишите на info@lionessdress.com.",

  "terms.updated": "Последнее обновление: сентябрь 2026",
  "terms.intro": "Эти условия действуют при использовании сайта lionessdress.com и оформлении заказа. Оформляя заказ, вы соглашаетесь с ними.",
  "terms.ordersTitle": "Заказы и цены",
  "terms.ordersBody": "Все цены указаны в тенге (₸) с учётом применимых налогов. Мы оставляем за собой право исправить ошибку в цене и отменить заказ при её обнаружении — в этом случае вы получите полный возврат средств.",
  "terms.productionTitle": "Изделия на заказ",
  "terms.productionBody": "Некоторые модели кроятся и дошиваются уже после оформления заказа, в срок, указанный на странице «Доставка». Наличие на сайте не является окончательным подтверждением до подтверждения заказа.",
  "terms.ipTitle": "Интеллектуальная собственность",
  "terms.ipBody": "Все дизайны, фотографии и тексты на этом сайте принадлежат Lioness Dress и не могут копироваться или использоваться без письменного разрешения.",
  "terms.liabilityTitle": "Ответственность",
  "terms.liabilityBody": "Мы стараемся максимально точно описывать каждое платье, но цвета могут немного отличаться в зависимости от экрана. Наша ответственность ограничена стоимостью заказа.",
  "terms.lawTitle": "Применимое право",
  "terms.lawBody": "Эти условия регулируются законодательством Республики Казахстан.",
  "terms.contactTitle": "Контакты",
  "terms.contactBody": "По вопросам, связанным с этими условиями, пишите на info@lionessdress.com.",
};

const dictionaries: Record<Lang, Record<TKey, string>> = { en, ru };

type Vars = Record<string, string | number>;

/** Translate outside React (e.g. page <head> metadata, which is rendered on the server in English). */
export const translateFor = (lang: Lang, key: TKey, vars?: Vars) => translate(lang, key, vars);

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
