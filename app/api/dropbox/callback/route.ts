// /app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as isUUID } from "uuid";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

function errorHtml(message: string) {
  return `
    <html>
      <head><title>Dropbox Connection Error</title></head>
      <body style="font-family: sans-serif; padding: 40px; background: #111927; color: #dbeafe;">
        <h1>Could not connect your Dropbox account</h1>
        <p>${message}</p>
        <a href="/dashboard" style="color: #0ec9db;">← Go back and try again</a>
      </body>
    </html>
  `;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const userId = req.nextUrl.searchParams.get("state");

  if (!code || !userId) {
    return new NextResponse(errorHtml("Missing code or user ID"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!isUUID(userId)) {
    return new NextResponse(errorHtml("Invalid user ID format"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

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

  if (!tokenRes.ok) {
    console.error("Dropbox token error", tokenData);
    return new NextResponse(errorHtml("Failed to get access token from Dropbox."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const access_token = tokenData.access_token;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const { error } = await supabase
    .from("dropbox_tokens")
    .upsert({ user_id: userId, access_token });

  if (error) {
    console.error("Supabase upsert error", error);
    return new NextResponse(errorHtml("Supabase write error: " + error.message), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
}
