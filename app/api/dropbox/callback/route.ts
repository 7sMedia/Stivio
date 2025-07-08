import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  try {
    console.log("📩 Received Dropbox OAuth code:", code);
    console.log("🔒 Using redirect URI:", DROPBOX_REDIRECT_URI);

    const tokenRes = await fetch("https://api.dropbox.com/oauth2/token", {
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
      }).toString(),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.text();
      console.error("❌ Failed to get Dropbox token:", error);
      return new Response("Failed to retrieve Dropbox token", { status: 400 });
    }

    const tokenData = await tokenRes.json();
    console.log("✅ Dropbox token received:", tokenData);

    const { access_token, refresh_token, uid, account_id } = tokenData;

    const { error } = await supabase
      .from("dropbox_tokens")
      .upsert({
        user_id: state,
        access_token,
        refresh_token,
        account_id,
        uid,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("❌ Supabase upsert error:", error);
      return new Response("Failed to save token", { status: 500 });
    }

    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  } catch (err) {
    console.error("❌ Error in Dropbox callback:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
