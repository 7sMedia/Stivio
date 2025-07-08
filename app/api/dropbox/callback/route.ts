// ✅ File: app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const userId = request.nextUrl.searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.redirect(`${APP_URL}/dashboard?error=missing_code_or_user`);
  }

  // Step 1: Exchange code for token
  const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: DROPBOX_CLIENT_ID,
      client_secret: DROPBOX_CLIENT_SECRET,
      redirect_uri: process.env.DROPBOX_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("❌ Dropbox token exchange failed:", err);
    return NextResponse.redirect(`${APP_URL}/dashboard?error=token_exchange_failed`);
  }

  const tokenJson = await tokenRes.json();
  console.log("✅ Dropbox token JSON:", tokenJson);

  const { access_token, refresh_token, expires_in, account_id } = tokenJson;
  const expires_at = Math.floor(Date.now() / 1000) + expires_in;

  // Step 2: Get Dropbox account email
  const accountRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  let dropbox_email = null;

  if (accountRes.ok) {
    const account = await accountRes.json();
    dropbox_email = account.email;
  } else {
    console.warn("⚠️ Could not fetch Dropbox account email.");
  }

  // Step 3: Upsert token row in Supabase
  const { error } = await supabase.from("dropbox_tokens").upsert({
    user_id: userId,
    access_token,
    refresh_token,
    expires_at,
    account_id,
    dropbox_email,
  });

  if (error) {
    console.error("❌ Supabase insert failed:", error.message);
    return NextResponse.redirect(`${APP_URL}/dashboard?error=supabase_upsert_failed`);
  }

  return NextResponse.redirect(`${APP_URL}/dashboard`);
}
