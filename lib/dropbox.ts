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
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  // 2. Check if access token is about to expire (within 5 minutes)
  const expiresAt = new Date(data.expires_at).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiresAt - now > fiveMinutes) {
    // Token is still valid
    return data.access_token;
  }

  // 3. Token expired or about to expire, refresh it!
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", data.refresh_token);

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

  const newExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  await supabase
    .from("dropbox_tokens")
    .update({
      access_token: newAccessToken,
      expires_at: newExpiresAt,
    })
    .eq("user_id", userId);

  return newAccessToken;
}
