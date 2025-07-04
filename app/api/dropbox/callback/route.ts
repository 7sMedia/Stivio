// /app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

// These should be in your .env.local
const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // this is user_id if you set it
  if (!code) {
    return NextResponse.json({ error: "No code in URL" }, { status: 400 });
  }

  // Exchange the code for an access token
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

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.json({ error: "Failed to obtain access token", details: tokenData }, { status: 400 });
  }

  // TODO: Save access_token and refresh_token to your DB (e.g., Supabase), associated with user_id (from `state`)
  // Example:
  // await saveDropboxTokenToSupabase(state, tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);

  // Redirect user to dashboard, or show a success page
  return NextResponse.redirect("/dashboard?dropbox=connected");
}
