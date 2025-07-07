// /lib/dropboxLimiter.ts

type FetchOptions = Parameters<typeof fetch>[1];

const MAX_RETRIES = 5;
const RETRY_BASE_DELAY = 1000; // 1 second

export async function fetchWithDropboxRetry(
  url: string,
  options: FetchOptions = {},
  attempt = 1
): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status !== 429 && res.status !== 503) {
    return res;
  }

  // Get Retry-After header (in seconds)
  const retryAfter = parseInt(res.headers.get("Retry-After") || "", 10);
  const delay = isNaN(retryAfter)
    ? RETRY_BASE_DELAY * Math.pow(2, attempt - 1) // exponential backoff
    : retryAfter * 1000;

  if (attempt >= MAX_RETRIES) {
    console.error(`[Dropbox] Max retries exceeded (${res.status})`);
    return res;
  }

  console.warn(`[Dropbox] Rate limited (status ${res.status}), retrying in ${delay}ms...`);

  await new Promise((resolve) => setTimeout(resolve, delay));
  return fetchWithDropboxRetry(url, options, attempt + 1);
}
