import asymmetricImage from "@/assets/product-asymmetric.jpg";
import midiImage from "@/assets/product-midi.jpg";
import rougeImage from "@/assets/product-rouge.jpg";
import velvetImage from "@/assets/product-velvet.jpg";

export type Product = {
  slug: string;
  name: string;
  price: number;
  color: "BLACK" | "RED";
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    slug: "the-asymmetric",
    name: "THE ASYMMETRIC",
    price: 450,
    color: "BLACK",
    image: asymmetricImage,
    description: "A sculpted one-shoulder silhouette cut to command the room.",
  },
  {
    slug: "black-angel-midi",
    name: "BLACK ANGEL MIDI",
    price: 420,
    color: "BLACK",
    image: midiImage,
    description: "Sheer sleeves and a precise corseted line define our signature midi.",
  },
  {
    slug: "rouge-obsession",
    name: "ROUGE OBSESSION",
    price: 390,
    color: "RED",
    image: rougeImage,
    description: "Deep rouge draping designed for an unforgettable entrance.",
  },
  {
    slug: "velvet-rebellion",
    name: "VELVET REBELLION",
    price: 320,
    color: "BLACK",
    image: velvetImage,
    description: "Soft velvet and sheer sleeves balanced in a modern mini silhouette.",
  },
];

export const formatPrice = (price: number) => `$${price}.00`;