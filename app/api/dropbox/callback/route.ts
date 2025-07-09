import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!;
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.json({ error: "❌ Missing code or user ID" }, { status: 400 });
  }

  try {
    // Exchange code for Dropbox access token
    const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: DROPBOX_CLIENT_ID,
        client_secret: DROPBOX_CLIENT_SECRET,
        redirect_uri: DROPBOX_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("❌ Dropbox token exchange failed:", errorText);
      return NextResponse.json({ error: "❌ Dropbox token exchange failed", details: errorText }, { status: 400 });
    }

    const tokenData = await tokenRes.json();
    const {
      access_token,
      refresh_token,
      expires_in,
      token_type,
      scope,
      account_id,
      uid,
      team_id,
    } = tokenData;

    // Calculate expiration timestamp (optional)
    const expires_at = expires_in
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    const { error } = await supabase
      .from("dropbox_tokens")
      .upsert(
        {
          user_id: userId,
          access_token,
          refresh_token,
          token_type,
          scope,
          expires_at,
          account_id,
          uid,
          team_id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.error("❌ Supabase upsert error:", error);
      return NextResponse.json({ error: "❌ Failed to save token in Supabase", details: error.message }, { status: 500 });
    }

    return NextResponse.redirect(`${NEXT_PUBLIC_SITE_URL}/dashboard`);
  } catch (err: any) {
    console.error("❌ Unexpected OAuth error:", err);
    return NextResponse.json({ error: "❌ Unexpected error", details: err.message }, { status: 500 });
  }
}
