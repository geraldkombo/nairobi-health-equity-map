/** Normalise a county name from any source to a canonical UPPERCASED key. */
export function sanitizeCountyName(name: string): string {
  return name
    .toUpperCase()
    .replace(/['\u2019]/g, "")
    .replace(/[-/]/g, " ")
    .replace(" CITY", "")
    .trim();
}

/** Convert "UASIN GISHU" to "uasin-gishu" for URL-safe IDs. */
export function createCountyId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

/** Convert "UASIN GISHU" to "Uasin Gishu". */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}
