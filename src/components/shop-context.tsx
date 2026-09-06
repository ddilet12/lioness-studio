import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

type CartItem = Product & { quantity: number };
type ShopContextValue = {
  items: CartItem[];
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
  addToBag: (product: Product, quantity?: number) => void;
  changeQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  itemCount: number;
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("lioness-bag");
    if (!saved) return;
    try {
      setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      window.localStorage.removeItem("lioness-bag");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("lioness-bag", JSON.stringify(items));
  }, [items]);

  const value = useMemo<ShopContextValue>(() => ({
    items,
    bagOpen,
    setBagOpen,
    addToBag: (product, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.slug === product.slug);
        return existing
          ? current.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item)
          : [...current, { ...product, quantity }];
      });
      setBagOpen(true);
    },
    changeQuantity: (slug, quantity) => setItems((current) => current.map((item) => item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item)),
    removeItem: (slug) => setItems((current) => current.filter((item) => item.slug !== slug)),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  }), [bagOpen, items]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}