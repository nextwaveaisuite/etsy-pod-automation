export const PRODUCT_TAXONOMY: Record<string, number> = {
  mug: 691,
  "tote bag": 1100,
  poster: 502,
  "wall art": 498,
  tshirt: 2007,
  tee: 2007,
  hoodie: 2025,
  sweatshirt: 2023,
  onesie: 2145
};

export function resolveTaxonomyId(name: string): number | null {
  const key = (name || "").toLowerCase().trim();
  if (PRODUCT_TAXONOMY[key]) return PRODUCT_TAXONOMY[key];
  for (const k of Object.keys(PRODUCT_TAXONOMY)) {
    if (key.includes(k)) return PRODUCT_TAXONOMY[k];
  }
  return null;
}

export function normalizeColor(name: string): string {
  const n = name.trim().toLowerCase();
  const map: Record<string, string> = {
    black: "Black", "jet black": "Black", charcoal: "Black",
    white: "White", ivory: "White", cream: "White",
    navy: "Navy", "navy blue": "Navy", midnight: "Navy",
    blue: "Blue", "light blue": "Blue", sky: "Blue",
    red: "Red", maroon: "Red", burgundy: "Red",
    green: "Green", forest: "Green", olive: "Green",
    pink: "Pink", blush: "Pink", rose: "Pink",
    beige: "Beige", tan: "Beige", sand: "Beige",
    grey: "Grey", gray: "Grey", "heather grey": "Grey",
    purple: "Purple", lavender: "Purple",
    yellow: "Yellow", gold: "Yellow",
    orange: "Orange",
    brown: "Brown"
  };
  return map[n] || name.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
