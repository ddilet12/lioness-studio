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
  "nav.blackAngel": "COLLECTION",
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
  "collection.title": "Black Angel",
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
  "campaign.alt": "Woman in a Lioness Dress gown holding a black LD umbrella in a Paris park",
  "campaign.eyebrow": "THE LIONESS WOMAN",
  "campaign.title": "Her confidence\nis beyond fashion.",
  "campaign.cta": "SHOP THE SIGNATURE DRESS",

  // Story
  "story.alt": "Lioness Dress show in Paris: models in black dresses walking through a historic hall",
  "story.eyebrow": "OUR SIGNATURE",
  "story.title": "From Astana\nto Paris.",
  "story.body": "LIONESS DRESS creates dresses for self-confident girls who embrace their sensuality and feminine spirit. In October 2026, we presented BLACK ANGEL — our flagship collection and a favourite among our customers — during Paris Fashion Week.\n\n“Angel skin” fabric and French mesh, paired with gloves and eye veils, capture the collection’s French chic and the alluring mood of a Parisian evening.",
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
  "bag.remove": "REMOVE",
  "bag.total": "TOTAL",
  "bag.checkout": "GO TO SHOPIFY",
  "bag.checkoutKaspi": "PAY WITH KASPI",
  "kaspi.title": "Checkout",
  "kaspi.total": "Order total: {price}",
  "kaspi.name": "Full name",
  "kaspi.phone": "Phone number",
  "kaspi.address": "Delivery address (city, street, house)",
  "kaspi.comment": "Comment (optional)",
  "kaspi.pay": "PAY WITH KASPI",
  "kaspi.creating": "OPENING PAYMENT…",
  "kaspi.note": "You will be taken to a secure Kaspi Pay payment page (ApiPay service). We confirm the order after payment.",
  "kaspi.error.name": "Please enter your name.",
  "kaspi.error.phone": "Please enter a valid Kazakhstan phone number, e.g. +7 701 123 45 67.",
  "kaspi.error.address": "Please enter a delivery address.",
  "kaspi.error.comment": "The comment is too long.",
  "kaspi.error.emptyCart": "Your bag is empty.",
  "kaspi.error.generic": "Could not open the payment page. Please try again or write to us on WhatsApp.",

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
  "nav.lookbook": "LOOKBOOK",
  "nav.newCollection": "NEW COLLECTION",
  "nav.bestsellers": "BESTSELLERS",
  "nav.partyDresses": "PARTY DRESSES",
  "nav.outlet": "OUTLET",
  "section.newCollection.intro": "The latest arrivals from LIONESS DRESS.",
  "section.bestsellers.intro": "Our most loved styles.",
  "section.partyDresses.intro": "Cocktail dresses for evenings that deserve an entrance.",
  "section.outlet.intro": "Selected dresses at special prices.",
  "section.empty": "New pieces are being added here. Please check back soon.",
  "section.backToShop": "ALL DRESSES",
  "lookbook.intro": "Our collections in one place, through the looks.",
  "lookbook.soon": "Photos coming soon.",
  "lookbook.shop": "SHOP THE COLLECTION",
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
  "footer.copyright": "© 2026 LIONESS DRESS. All rights reserved.",

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
  "returns.windowBody": "Under the Law of the Republic of Kazakhstan «On Protection of Consumer Rights», you can exchange or return a non-food item of proper quality within 14 calendar days of purchase if it has not been worn or washed, keeps its presentation, tags and labels, and you have a document confirming the purchase (order confirmation or payment receipt).",
  "returns.exchangeTitle": "Exchanges",
  "returns.exchangeBody": "Need a different size? Write to us and we'll arrange an exchange, subject to availability. Made-to-order and altered pieces are exchanged for size only, not style.",
  "returns.nonReturnableTitle": "Non-returnable items",
  "returns.nonReturnableBody": "Dresses altered to your personal measurements, and items marked as final sale, cannot be returned or exchanged unless they arrive damaged or faulty.",
  "returns.howTitle": "How to start a return",
  "returns.howBody": "Email info@lionessdress.com or message us on WhatsApp with your order number and reason for return. We'll confirm the next steps and cover return shipping if the dress arrived damaged or incorrect.",
  "returns.refundTitle": "Refunds",
  "returns.refundBody": "If an exchange is not possible (for example the size you need is not available), we return the amount paid for the item. The refund goes back the way you paid, after we receive and inspect the item.",
  "returns.defectTitle": "Items of improper quality",
  "returns.defectBody": "If an item arrives with a defect or does not match the order, you keep all rights provided by Kazakhstani consumer law: you may ask for a replacement, repair, a price reduction or a refund, and we cover return shipping. Please write to us as soon as you notice the problem and attach photos.",

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
  "privacy.consentTitle": "Legal basis and consent",
  "privacy.consentBody": "We process personal data in accordance with the Law of the Republic of Kazakhstan «On Personal Data and Their Protection». By placing an order, submitting a form or writing to us you give your consent to the collection and processing of the data you provide, for the purposes described below. You can withdraw your consent at any time by writing to info@lionessdress.com.",
  "privacy.collectTitle": "Information we collect",
  "privacy.collectBody": "Contact details you give us when you place an order or write to us — name, phone number, email and delivery address.\nOrder details — the items you buy, sizes and order history.\nBasic technical data — such as browser type and pages visited, used only to keep the site working correctly.",
  "privacy.useTitle": "How we use it",
  "privacy.useBody": "To process and deliver your order, to answer your questions, and to let you know the status of your order. We do not sell your personal information to third parties.",
  "privacy.thirdPartyTitle": "Third-party services",
  "privacy.thirdPartyBody": "Our store runs on Shopify, which processes order and catalogue data on our behalf; payments are processed by a payment service (Kaspi Pay) and orders are delivered by courier companies. These providers receive only the information needed to do their job. Some of them may process data outside Kazakhstan; we choose providers that protect personal data and we do not share it for any other purpose.",
  "privacy.rightsTitle": "Your rights",
  "privacy.rightsBody": "You have the right to know what data we hold about you, to ask us to correct, block or delete it, and to withdraw your consent. Write to info@lionessdress.com and we will respond within the time set by law.",
  "privacy.storageTitle": "Storage and security",
  "privacy.storageBody": "We keep your data only as long as needed to complete your order, meet legal and accounting requirements and handle possible claims, then delete or anonymise it. We take technical and organisational measures to protect it from unauthorised access, loss or disclosure.",
  "privacy.cookiesTitle": "Cookies",
  "privacy.cookiesBody": "The site uses cookies and similar technologies that are necessary for the cart and checkout to work. You can disable cookies in your browser settings, but parts of the site may then stop working.",
  "privacy.contactTitle": "Contact",
  "privacy.contactBody": "Questions about this policy can be sent to info@lionessdress.com.",

  // Terms of Service
  "terms.updated": "Last updated: September 2026",
  "terms.intro": "These terms apply whenever you browse or order from lionessdress.com. By placing an order, you agree to them.",
  "terms.offerTitle": "Public offer",
  "terms.offerBody": "The information on this site is a public offer (Civil Code of the Republic of Kazakhstan). The contract of sale is concluded when you place an order and we confirm it. Before ordering, check the item, size, price and delivery details.",
  "terms.ordersTitle": "Orders & pricing",
  "terms.ordersBody": "All prices are shown in Kazakhstani tenge (₸) and include applicable taxes. We reserve the right to correct pricing errors and to cancel an order if a mistake is found, in which case you'll receive a full refund.",
  "terms.paymentTitle": "Payment",
  "terms.paymentBody": "Payment is made online through Kaspi Pay or the Shopify checkout. Card and payment details are processed by the payment service; we never see or store them.",
  "terms.consumerTitle": "Consumer rights",
  "terms.consumerBody": "These terms do not limit your rights under the Law of the Republic of Kazakhstan «On Protection of Consumer Rights». Delivery, exchange and return terms are described on the Delivery and Returns & Exchanges pages.",
  "terms.productionTitle": "Made-to-order pieces",
  "terms.productionBody": "Some styles are cut and finished after you order, within the production time stated on the Delivery page. Availability shown on the site is not a guarantee until your order is confirmed.",
  "terms.ipTitle": "Intellectual property",
  "terms.ipBody": "All designs, photography and text on this site belong to Lioness Dress and may not be copied or reused without our written permission.",
  "terms.liabilityTitle": "Liability",
  "terms.liabilityBody": "We do our best to describe every dress accurately, but colours may vary slightly by screen. Our liability is limited to the value of your order.",
  "terms.disputeTitle": "Complaints and disputes",
  "terms.disputeBody": "If you have a complaint, write to info@lionessdress.com — we will review it and reply. Disputes that cannot be settled by agreement are resolved in the courts of the Republic of Kazakhstan.",
  "terms.sellerTitle": "Seller",
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
  "nav.blackAngel": "КОЛЛЕКЦИИ",
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
  "hero.eyebrow": "ПАРИЖ 2026",
  "hero.cta": "СМОТРЕТЬ КОЛЛЕКЦИЮ",
  "hero.meta": "СОЗДАНО ДЛЯ УВЕРЕННЫХ В СЕБЕ ДЕВУШЕК",

  "manifesto.eyebrow": "НОВАЯ КОЛЛЕКЦИЯ · ПАРИЖ 2026",
  "manifesto.title.a": "Элегантность\nс ",
  "manifesto.title.b": "характером.",
  "manifesto.body": "Lioness Dress создан для\nженщины, которая никогда\nне просит разрешения быть\v незабываемой.",

  "collection.eyebrow": "КОЛЛЕКЦИЯ",
  "collection.title": "Black Angel",
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

  "campaign.alt": "Девушка в платье Lioness Dress с чёрным зонтом LD в парижском парке",
  "campaign.eyebrow": "ЖЕНЩИНА LIONESS",
  "campaign.title": "Её уверенность\nвне моды.",
  "campaign.cta": "СМОТРЕТЬ ФИРМЕННОЕ ПЛАТЬЕ",

  "story.alt": "Показ Lioness Dress в Париже: модели в чёрных платьях идут по историческому залу",
  "story.eyebrow": "НАШ ПОЧЕРК",
  "story.title": "Из Астаны\nв Париж.",
  "story.body": "LIONESS DRESS создаёт платья для уверенных в себе девушек, которые принимают свою чувственность и женственность. В октябре 2026 года мы представили BLACK ANGEL — нашу флагманскую коллекцию и любимицу клиенток — во время Недели моды в Париже.\n\nТкань «ангельская кожа» и французская сетка в сочетании с перчатками и вуалями для глаз передают французский шик коллекции и соблазнительное настроение парижского вечера.",
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
  "bag.remove": "УДАЛИТЬ",
  "bag.total": "ИТОГО",
  "bag.checkout": "ОФОРМИТЬ В SHOPIFY",
  "bag.checkoutKaspi": "ОПЛАТИТЬ ЧЕРЕЗ KASPI",
  "kaspi.title": "Оформление заказа",
  "kaspi.total": "Сумма заказа: {price}",
  "kaspi.name": "Имя и фамилия",
  "kaspi.phone": "Номер телефона",
  "kaspi.address": "Адрес доставки (город, улица, дом)",
  "kaspi.comment": "Комментарий (необязательно)",
  "kaspi.pay": "ОПЛАТИТЬ ЧЕРЕЗ KASPI",
  "kaspi.creating": "ОТКРЫВАЕМ ОПЛАТУ…",
  "kaspi.note": "Вы перейдёте на защищённую страницу оплаты Kaspi Pay (сервис ApiPay). Заказ подтверждаем после оплаты.",
  "kaspi.error.name": "Введите имя.",
  "kaspi.error.phone": "Введите номер телефона Казахстана, например +7 701 123 45 67.",
  "kaspi.error.address": "Введите адрес доставки.",
  "kaspi.error.comment": "Комментарий слишком длинный.",
  "kaspi.error.emptyCart": "Корзина пуста.",
  "kaspi.error.generic": "Не удалось открыть страницу оплаты. Попробуйте ещё раз или напишите нам в WhatsApp.",

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

  "nav.lookbook": "ЛУКБУК",
  "nav.newCollection": "НОВАЯ КОЛЛЕКЦИЯ",
  "nav.bestsellers": "БЕСТСЕЛЛЕРЫ",
  "nav.partyDresses": "КОКТЕЙЛЬНЫЕ ПЛАТЬЯ",
  "nav.outlet": "АУТЛЕТ",
  "section.newCollection.intro": "Последние поступления LIONESS DRESS.",
  "section.bestsellers.intro": "Наши самые любимые модели.",
  "section.partyDresses.intro": "Коктейльные платья для вечеров, на которые хочется войти эффектно.",
  "section.outlet.intro": "Избранные платья по специальным ценам.",
  "section.empty": "Здесь скоро появятся новые модели. Загляните позже.",
  "section.backToShop": "ВСЕ ПЛАТЬЯ",
  "lookbook.intro": "Наши коллекции в одном месте, через образы.",
  "lookbook.soon": "Фото скоро появятся.",
  "lookbook.shop": "СМОТРЕТЬ КОЛЛЕКЦИЮ",
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
  "footer.copyright": "© 2026 LIONESS DRESS. Все права защищены.",

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
  "returns.windowBody": "В соответствии с Законом Республики Казахстан «О защите прав потребителей» вы можете обменять или вернуть непродовольственный товар надлежащего качества в течение 14 календарных дней с момента покупки, если он не носился и не стирался, сохранены товарный вид, бирки и ярлыки, и есть документ, подтверждающий покупку (подтверждение заказа или чек об оплате).",
  "returns.exchangeTitle": "Обмен",
  "returns.exchangeBody": "Нужен другой размер? Напишите нам — организуем обмен при наличии нужного размера. Изделия, сшитые под заказ или изменённые по фигуре, меняются только по размеру, не по модели.",
  "returns.nonReturnableTitle": "Товары, не подлежащие возврату",
  "returns.nonReturnableBody": "Платья, ушитые по вашим индивидуальным меркам, и товары с пометкой «финальная распродажа» не подлежат возврату или обмену — кроме случаев брака или повреждения при доставке.",
  "returns.howTitle": "Как оформить возврат",
  "returns.howBody": "Напишите на info@lionessdress.com или в WhatsApp, указав номер заказа и причину возврата. Мы подскажем дальнейшие шаги и оплатим обратную доставку, если платье пришло повреждённым или не тем, что вы заказывали.",
  "returns.refundTitle": "Возврат денег",
  "returns.refundBody": "Если обмен невозможен (например, нужного размера нет в наличии), мы возвращаем уплаченную за товар сумму. Деньги возвращаются тем же способом, которым вы платили, после получения и проверки изделия.",
  "returns.defectTitle": "Товар ненадлежащего качества",
  "returns.defectBody": "Если изделие пришло с браком или не соответствует заказу, за вами сохраняются все права по законодательству Казахстана о защите прав потребителей: вы можете потребовать замену, ремонт, уменьшение цены или возврат денег, а обратную доставку оплачиваем мы. Напишите нам, как только заметите проблему, и приложите фото.",

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
  "privacy.consentTitle": "Правовое основание и согласие",
  "privacy.consentBody": "Мы обрабатываем персональные данные в соответствии с Законом Республики Казахстан «О персональных данных и их защите». Оформляя заказ, отправляя форму или обращаясь к нам, вы даёте согласие на сбор и обработку указанных вами данных для целей, описанных ниже. Согласие можно отозвать в любой момент, написав на info@lionessdress.com.",
  "privacy.collectTitle": "Какие данные мы собираем",
  "privacy.collectBody": "Контактные данные, которые вы указываете при заказе или обращении — имя, телефон, email и адрес доставки.\nДанные о заказе — какие товары вы купили, размеры и история заказов.\nТехнические данные — тип браузера и посещённые страницы, используются только для корректной работы сайта.",
  "privacy.useTitle": "Как мы используем данные",
  "privacy.useBody": "Чтобы обработать и доставить ваш заказ, ответить на вопросы и сообщать о статусе заказа. Мы не продаём ваши персональные данные третьим лицам.",
  "privacy.thirdPartyTitle": "Сторонние сервисы",
  "privacy.thirdPartyBody": "Наш магазин работает на платформе Shopify, которая обрабатывает данные о заказах и каталоге от нашего имени; оплату принимает платёжный сервис (Kaspi Pay), а заказы доставляют курьерские компании. Эти сервисы получают только данные, необходимые для работы. Часть из них может обрабатывать данные за пределами Казахстана; мы выбираем поставщиков, которые защищают персональные данные, и не передаём их для других целей.",
  "privacy.rightsTitle": "Ваши права",
  "privacy.rightsBody": "Вы вправе знать, какие данные мы о вас храним, требовать их исправления, блокирования или удаления и отозвать своё согласие. Напишите на info@lionessdress.com — мы ответим в сроки, установленные законом.",
  "privacy.storageTitle": "Хранение и защита",
  "privacy.storageBody": "Мы храним данные только столько, сколько нужно для выполнения заказа, соблюдения требований закона и учёта, а также для рассмотрения возможных претензий, после чего удаляем или обезличиваем их. Мы принимаем технические и организационные меры против несанкционированного доступа, потери и раскрытия данных.",
  "privacy.cookiesTitle": "Файлы cookie",
  "privacy.cookiesBody": "Сайт использует cookie и похожие технологии, необходимые для работы корзины и оформления заказа. Вы можете отключить cookie в настройках браузера, но часть функций сайта тогда перестанет работать.",
  "privacy.contactTitle": "Контакты",
  "privacy.contactBody": "По вопросам, связанным с этой политикой, пишите на info@lionessdress.com.",

  "terms.updated": "Последнее обновление: сентябрь 2026",
  "terms.intro": "Эти условия действуют при использовании сайта lionessdress.com и оформлении заказа. Оформляя заказ, вы соглашаетесь с ними.",
  "terms.offerTitle": "Публичная оферта",
  "terms.offerBody": "Информация на этом сайте является публичной офертой (Гражданский кодекс Республики Казахстан). Договор купли-продажи заключается, когда вы оформили заказ, а мы его подтвердили. Перед заказом проверьте изделие, размер, цену и условия доставки.",
  "terms.ordersTitle": "Заказы и цены",
  "terms.ordersBody": "Все цены указаны в тенге (₸) с учётом применимых налогов. Мы оставляем за собой право исправить ошибку в цене и отменить заказ при её обнаружении — в этом случае вы получите полный возврат средств.",
  "terms.paymentTitle": "Оплата",
  "terms.paymentBody": "Оплата проходит онлайн через Kaspi Pay или оформление заказа Shopify. Данные карты и платежа обрабатывает платёжный сервис — мы их не видим и не храним.",
  "terms.consumerTitle": "Права потребителя",
  "terms.consumerBody": "Эти условия не ограничивают ваши права по Закону Республики Казахстан «О защите прав потребителей». Условия доставки, обмена и возврата описаны на страницах «Доставка» и «Возврат и обмен».",
  "terms.productionTitle": "Изделия на заказ",
  "terms.productionBody": "Некоторые модели кроятся и дошиваются уже после оформления заказа, в срок, указанный на странице «Доставка». Наличие на сайте не является окончательным подтверждением до подтверждения заказа.",
  "terms.ipTitle": "Интеллектуальная собственность",
  "terms.ipBody": "Все дизайны, фотографии и тексты на этом сайте принадлежат Lioness Dress и не могут копироваться или использоваться без письменного разрешения.",
  "terms.liabilityTitle": "Ответственность",
  "terms.liabilityBody": "Мы стараемся максимально точно описывать каждое платье, но цвета могут немного отличаться в зависимости от экрана. Наша ответственность ограничена стоимостью заказа.",
  "terms.disputeTitle": "Претензии и споры",
  "terms.disputeBody": "Если у вас есть претензия, напишите на info@lionessdress.com — мы рассмотрим её и ответим. Споры, которые не удалось решить по соглашению, разрешаются в судах Республики Казахстан.",
  "terms.sellerTitle": "Продавец",
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
