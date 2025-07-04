// /app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!; // Service role key (server-side only!)

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // user_id
  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or user_id" }, { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://api.dropbox.com/oauth2/token", {
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
  const data = await tokenRes.json();

  if (!data.access_token) {
    return NextResponse.json({ error: "OAuth failed", details: data }, { status: 400 });
  }

  // Save token to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Remove any previous tokens for this user
  await supabase.from("dropbox_tokens").delete().eq("user_id", state);

  // Save the new token
  const { error: dbError } = await supabase.from("dropbox_tokens").insert([
    {
      user_id: state,
      access_token: data.access_token,
      refresh_token: data.refresh_token || null,
      expires_at: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null,
    },
  ]);

  if (dbError) {
    return NextResponse.json({ error: "Failed to save token", details: dbError }, { status: 500 });
  }

  // Redirect to dashboard or show success
  return NextResponse.redirect("/dashboard?dropbox=connected");
}
