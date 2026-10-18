/**
 * The history of LIONESS DRESS collections shown on the Lookbook page, in the order the brand listed them.
 * To add photos later: put the files in src/assets/lookbook/, import them here and list them in `photos`.
 * A collection without photos shows a "photos coming soon" note.
 */
export type LookbookPhoto = { src: string; alt: string };
export type LookbookEntry = { slug: string; year: number; name: string; photos: LookbookPhoto[] };

export const LOOKBOOK: LookbookEntry[] = [
  { slug: "sparkling-nights", year: 2020, name: "SPARKLING NIGHTS", photos: [] },
  { slug: "maldivian-mood", year: 2021, name: "MALDIVIAN MOOD", photos: [] },
  { slug: "la-dolce-vita", year: 2022, name: "LA DOLCE VITA", photos: [] },
  { slug: "burlesque", year: 2022, name: "BURLESQUE", photos: [] },
  { slug: "black-angel", year: 2023, name: "BLACK ANGEL", photos: [] },
  { slug: "diamond-moments", year: 2024, name: "DIAMOND MOMENTS", photos: [] },
];
