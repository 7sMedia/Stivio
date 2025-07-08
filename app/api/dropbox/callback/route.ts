import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const uid = searchParams.get("state");

  if (!code || !uid) {
    return new Response("Missing code or user ID", { status: 400 });
  }

  try {
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

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Dropbox token exchange failed:", tokenData);
      return new Response("Token exchange failed", { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error } = await supabase
      .from("dropbox_tokens")
      .upsert({ user_id: uid, access_token: tokenData.access_token });

    if (error) {
      console.error("Supabase DB write failed:", error);
      return new Response("Supabase write error", { status: 500 });
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err: any) {
    console.error("OAuth callback error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
