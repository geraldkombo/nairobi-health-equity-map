import type { Handler } from "@netlify/functions";

const BASE_URL = "https://uhcke-247.netlify.app";

export const handler: Handler = async () => {
  try {
    const res = await fetch(`${BASE_URL}/data/snapshots/facilities.json`);
    const geojson = await res.json();
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
      body: JSON.stringify({ meta: { fetched_at: new Date().toISOString(), sources: [{ name: "OpenStreetMap", url: "https://www.openstreetmap.org", license: "ODbL", note: "Health facilities mapped in OSM. Coverage may be incomplete." }] }, geojson }),
    };
  } catch (err) {
    return { statusCode: 500, headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ error: "Failed to fetch facilities", message: String(err) }) };
  }
};
