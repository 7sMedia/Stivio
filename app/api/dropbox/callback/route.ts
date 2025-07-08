import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  console.log("📥 Incoming Dropbox OAuth callback:");
  console.log("code:", code);
  console.log("state:", state);

  if (!code || !state) {
    console.error("❌ Missing code or state");
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  const clientId = process.env.DROPBOX_CLIENT_ID;
  const clientSecret = process.env.DROPBOX_CLIENT_SECRET;
  const redirectUri = process.env.DROPBOX_REDIRECT_URI;

  console.log("🔐 Using client_id:", clientId);
  console.log("🔐 Using redirect_uri:", redirectUri);

  try {
    const tokenRes = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri!,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("📦 Dropbox token response:", tokenData);

    if (!tokenData.access_token) {
      console.error("❌ Failed to retrieve Dropbox token");
      return NextResponse.json({ error: "Failed to retrieve Dropbox token", detail: tokenData }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: updateError } = await supabase
      .from("users")
      .update({
        dropbox_access_token: tokenData.access_token,
        dropbox_refresh_token: tokenData.refresh_token,
        dropbox_account_id: tokenData.account_id,
      })
      .eq("id", state);

    if (updateError) {
      console.error("❌ Supabase update failed:", updateError);
      return NextResponse.json({ error: "Failed to save token to Supabase" }, { status: 500 });
    }

    console.log("✅ Dropbox token saved to Supabase");
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (err: any) {
    console.error("❌ Callback handler error:", err);
    return NextResponse.json({ error: "Unexpected error", detail: err.message }, { status: 500 });
  }
}
