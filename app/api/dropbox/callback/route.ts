import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    console.error("❌ Missing code or state in Dropbox callback");
    return NextResponse.redirect(
      new URL("/error?message=Missing+Dropbox+authorization+code+or+state", req.url)
    );
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: process.env.DROPBOX_CLIENT_ID!,
      client_secret: process.env.DROPBOX_CLIENT_SECRET!,
      redirect_uri: process.env.DROPBOX_REDIRECT_URI!,
    }),
  });

  if (!tokenRes.ok) {
    console.error("❌ Failed to fetch Dropbox token");
    return NextResponse.redirect(
      new URL("/error?message=Failed+to+retrieve+Dropbox+token", req.url)
    );
  }

  const tokenData = await tokenRes.json();
  console.log("✅ Dropbox token response:", tokenData);

  const access_token = tokenData.access_token;
  const refresh_token = tokenData.refresh_token;

  // Save tokens to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data, error } = await supabase
    .from("users")
    .update({
      dropbox_access_token: access_token,
      dropbox_refresh_token: refresh_token,
      dropbox_connected: true,
    })
    .eq("dropbox_oauth_state", state);

  if (error) {
    console.error("❌ Supabase update failed:", error);
    return NextResponse.json({ error: "Failed to save token to Supabase" }, { status: 500 });
  }

  console.log("✅ Dropbox connected for user:", data);

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
