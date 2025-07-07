import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

type DropboxTokenRow = {
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

export async function getValidDropboxToken(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("*")
    .eq("user_id", userId);

  if (error || !data || data.length === 0) {
    console.error("Failed to retrieve Dropbox token row", error);
    return null;
  }

  const row = data[0] as DropboxTokenRow;

  // 1. Check expiration
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : 0;

  if (expiresAt - now > fiveMinutes) {
    return row.access_token;
  }

  // 2. Token expired or near expiry — refresh it
  const start = Date.now();
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
    const errText = await response.text();
    console.error("Failed to refresh Dropbox token", errText);
    return null;
  }

  const json: {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    account_id?: string;
  } = await response.json();

  const newAccessToken = json.access_token;
  const newExpiresAt = new Date(Date.now() + json.expires_in * 1000).toISOString();

  const { error: updateError } = await supabase
    .from("dropbox_tokens")
    .update({
      access_token: newAccessToken,
      expires_at: newExpiresAt,
    })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Failed to update Supabase with new token", updateError);
  }

  const duration = Date.now() - start;
  console.log(`[Dropbox] Token refreshed in ${duration}ms`);

  return newAccessToken;
}
