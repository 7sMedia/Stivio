export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const userId = state;

  try {
    const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: DROPBOX_CLIENT_ID,
        client_secret: DROPBOX_CLIENT_SECRET,
        redirect_uri: DROPBOX_REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("❌ Dropbox token exchange failed:", tokenData);
      return NextResponse.json({ error: "Failed to retrieve Dropbox token" }, { status: 400 });
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    const { error: dbError } = await supabase
      .from("dropbox_tokens")
      .upsert({
        user_id: userId,
        access_token,
        refresh_token,
        expires_at: new Date(Date.now() + expires_in * 1000).toISOString()
      });

    if (dbError) {
      console.error("❌ Failed to save token:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.redirect("https://beta7mvp.vercel.app/dashboard");
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
