import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ShopifyCartItem, ShopifyProduct } from "@/lib/shopify.server";
import { addToCart, getCart, removeFromCart, updateCartLineQuantity } from "@/lib/shopify.server";

const CART_ID_KEY = "lioness-cart-id";
const WISHLIST_KEY = "lioness-wishlist";

export const FREE_SHIPPING_THRESHOLD = 100000;

export type WishlistItem = { slug: string; name: string; price: number; image: string };

type ShopContextValue = {
  items: ShopifyCartItem[];
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  addToBag: (product: ShopifyProduct, quantity?: number, size?: string) => Promise<void>;
  changeQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  itemCount: number;
  checkoutUrl: string | null;
  wishlist: WishlistItem[];
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (slug: string) => boolean;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<ShopifyCartItem[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const savedId = window.localStorage.getItem(CART_ID_KEY);
    if (!savedId) return;
    getCart({ data: savedId })
      .then((cart) => {
        if (!cart) {
          window.localStorage.removeItem(CART_ID_KEY);
          return;
        }
        setCartId(cart.id);
        setItems(cart.items);
        setCheckoutUrl(cart.checkoutUrl);
      })
      .catch(() => window.localStorage.removeItem(CART_ID_KEY));
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(WISHLIST_KEY);
    if (!saved) return;
    try {
      setWishlist(JSON.parse(saved));
    } catch {
      window.localStorage.removeItem(WISHLIST_KEY);
    }
  }, []);

  const value = useMemo<ShopContextValue>(
    () => ({
      items,
      bagOpen,
      setBagOpen,
      checkoutUrl,
      wishlist,
      wishlistOpen,
      setWishlistOpen,
      searchOpen,
      setSearchOpen,
      toggleWishlist: (item) => {
        setWishlist((current) => {
          const exists = current.some((entry) => entry.slug === item.slug);
          const next = exists ? current.filter((entry) => entry.slug !== item.slug) : [...current, item];
          window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
          return next;
        });
      },
      isWishlisted: (slug) => wishlist.some((entry) => entry.slug === slug),
      addToBag: async (product, quantity = 1, size) => {
        const cart = await addToCart({
          data: { cartId: cartId ?? undefined, variantId: product.variantId, quantity, ...(size ? { size } : {}) },
        });
        setCartId(cart.id);
        window.localStorage.setItem(CART_ID_KEY, cart.id);
        setItems(cart.items);
        setCheckoutUrl(cart.checkoutUrl);
        setBagOpen(true);
      },
      changeQuantity: async (lineId, quantity) => {
        if (!cartId || quantity < 1) return;
        const cart = await updateCartLineQuantity({ data: { cartId, lineId, quantity } });
        setItems(cart.items);
        setCheckoutUrl(cart.checkoutUrl);
      },
      removeItem: async (lineId) => {
        if (!cartId) return;
        const cart = await removeFromCart({ data: { cartId, lineId } });
        setItems(cart.items);
        setCheckoutUrl(cart.checkoutUrl);
      },
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [bagOpen, items, cartId, checkoutUrl, wishlist, wishlistOpen, searchOpen],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}
