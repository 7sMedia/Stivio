import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function getValidDropboxToken(userId: string): Promise<string | null> {
  // 1. Get Dropbox token data from dropbox_tokens table
  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("*")
    .eq("user_id", userId);

  console.log("Supabase query result for dropbox_tokens:", data, error);

  if (error || !data || data.length === 0) return null;

  const row = data[0];

  // 2. Check if access token is about to expire (within 5 minutes)
  // Defensive: handle missing or invalid expires_at
  let expiresAt: number | null = null;
  if (row.expires_at) {
    const ts = new Date(row.expires_at).getTime();
    expiresAt = isNaN(ts) ? null : ts;
  }
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // If expiresAt is missing or invalid, treat token as valid!
  if (!expiresAt || expiresAt - now > fiveMinutes) {
    return row.access_token;
  }

  // 3. Token expired or about to expire, refresh it!
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", row.refresh_token);

  const basicAuth = Buffer.from(`${DROPBOX_CLIENT_ID}:${DROPBOX_CLIENT_SECRET}`).toString("base64");

  const response = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    console.error("Failed to refresh Dropbox token");
    return null;
  }

  const json = await response.json();

  // Save the new token and expiry in DB
  const newAccessToken = json.access_token;
  const expiresIn = json.expires_in; // seconds

  const newExpiresAt = new Date(Date.now() + (expiresIn || 3 * 60 * 60) * 1000).toISOString(); // fallback: +3hr

  await supabase
    .from("dropbox_tokens")
    .update({
      access_token: newAccessToken,
      expires_at: newExpiresAt,
    })
    .eq("user_id", userId);

  return newAccessToken;
}
