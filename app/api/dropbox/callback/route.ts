export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

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

    const { access_token, refresh_token, expires_in, account_id } = tokenData;
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    const { error: dbxError } = await supabase
      .from("dropbox_tokens")
      .upsert({
        user_id: userId,
        access_token,
        refresh_token,
        account_id,
        expires_at: expiresAt
      });

    if (dbxError) {
      console.error("❌ Supabase dropbox_tokens upsert failed:", dbxError);
      return NextResponse.json({ error: "Failed to store Dropbox token" }, { status: 500 });
    }

    return NextResponse.redirect("https://beta7mvp.vercel.app/dashboard");
  } catch (err) {
    console.error("❌ Unexpected error in callback:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
