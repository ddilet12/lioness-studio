import gazetteVelours from "@/assets/news/la-gazette-velours-de-minuit.jpg";

/**
 * News shown on the "Latest News" page, newest first. To add one: put the picture in src/assets/news/, import it
 * above and add an entry here.
 */
export type NewsItem = { slug: string; date: string; image: string; alt: string };

export const NEWS: NewsItem[] = [
  {
    slug: "la-gazette-velours-de-minuit",
    date: "2026-10",
    image: gazetteVelours,
    alt: "La Gazette, October 2026: Velours de Minuit — a new chapter of the brand",
  },
];
