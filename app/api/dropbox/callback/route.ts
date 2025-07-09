import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state"); // sent as `state` from OAuthButton

  if (!code || !userId) {
    return NextResponse.json({ error: "❌ Missing code or user ID" }, { status: 400 });
  }

  try {
    // Exchange code for access token
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
        redirect_uri: DROPBOX_REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      return NextResponse.json({ error: "❌ Token exchange failed", details: errorText }, { status: 400 });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const accountId = tokenData.account_id;

    // Save token to Supabase
    const { error } = await supabase
      .from("dropbox_tokens")
      .upsert({
        user_id: userId,
        access_token: accessToken,
        account_id: accountId,
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "❌ Failed to save token in Supabase" }, { status: 500 });
    }

    console.log("✅ Dropbox OAuth Success");
    console.log("User ID:", userId);
    console.log("Account ID:", accountId);
    console.log("Token saved in Supabase.");

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
  } catch (err) {
    console.error("OAuth error:", err);
    return NextResponse.json({ error: "❌ Unexpected error" }, { status: 500 });
  }
}
