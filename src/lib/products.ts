export type Product = {
  slug: string;
  name: string;
  price: number;
  color: "BLACK" | "RED";
  image: string;
  description: string;
};

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
