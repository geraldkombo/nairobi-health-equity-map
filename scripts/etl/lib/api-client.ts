import { z } from "zod";

export class FetchError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
  ) {
    super(`HTTP ${status} ${statusText}`);
    this.name = "FetchError";
  }
}

export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

const DEFAULT_RETRY: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retry: RetryConfig = DEFAULT_RETRY,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retry.maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;

      const body = await res.text();
      lastError = new FetchError(res.status, res.statusText, body);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    if (attempt < retry.maxRetries) {
      const delay = Math.min(retry.baseDelayMs * Math.pow(2, attempt - 1), retry.maxDelayMs);
      process.stderr.write(`  retry ${attempt}/${retry.maxRetries} after ${delay}ms\n`);
      await sleep(delay);
    }
  }

  throw lastError;
}

export async function fetchJSON<T>(
  url: string,
  schema: z.ZodSchema<T>,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetchWithRetry(url, options);
  const json = await res.json();
  return schema.parse(json);
}
