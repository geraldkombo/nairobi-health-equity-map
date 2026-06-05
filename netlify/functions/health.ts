import type { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ status: "ok", service: "Nairobi Health Equity Map API", version: "1.0.0", timestamp: new Date().toISOString() }),
  };
};
