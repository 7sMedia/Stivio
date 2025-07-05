import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function getValidDropboxToken(userId: string): Promise<string | null> {
  // 1. Get Dropbox token data from DB (no type argument on .from)
  const { data, error } = await supabase
    .from("users")
    .select("dropbox_access_token, dropbox_refresh_token, dropbox_token_expires_at")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  // 2. Check if access token is about to expire (within 5 minutes)
  const expiresAt = new Date(data.dropbox_token_expires_at).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiresAt - now > fiveMinutes) {
    // Token is still valid
    return data.dropbox_access_token;
  }

  // 3. Token expired or about to expire, refresh it!
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", data.dropbox_refresh_token);

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
    .from("users")
    .update({
      dropbox_access_token: newAccessToken,
      dropbox_token_expires_at: newExpiresAt,
    })
    .eq("id", userId);

  return newAccessToken;
}
