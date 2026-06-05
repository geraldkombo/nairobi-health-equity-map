import type { Handler } from "@netlify/functions";

const BASE_URL = "https://uhcke-247.netlify.app";

export const handler: Handler = async () => {
  try {
    const res = await fetch(`${BASE_URL}/data/snapshots/counties.json`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
      body: JSON.stringify({
        meta: { level: "county", fetched_at: new Date().toISOString(), sources: [{ name: "KNBS 2019 Census", url: "https://www.knbs.or.ke", license: "Open Data" }] },
        counties: Array.isArray(data) ? data : data.counties || [],
      }),
    };
  } catch (err) {
    return { statusCode: 500, headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ error: "Failed to fetch counties", message: String(err) }) };
  }
};
