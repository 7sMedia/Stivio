// /app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

function errorHtml(message: string) {
  return `
    <html>
      <head>
        <title>Dropbox Connection Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { background: #111927; color: #dbeafe; font-family: sans-serif; padding: 2rem; }
          a { color: #38bdf8; text-decoration: underline; }
        </style>
      </head>
      <body>
        <h1>Could not connect your Dropbox account</h1>
        <p>${message}</p>
        <a href="/dashboard">← Go back and try again</a>
      </body>
    </html>
  `;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return new Response(errorHtml("Missing authorization code or state."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Exchange code for access token
  const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
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
    return new Response(
      errorHtml("Failed to get access token: " + JSON.stringify(tokenData)),
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      }
    );
  }

  // Save token to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { error } = await supabase
    .from("dropbox_tokens")
    .upsert({
      user_id: state,
      access_token: tokenData.access_token,
    })
    .eq("user_id", state);

  if (error) {
    return new Response(errorHtml("Supabase write error: " + error.message), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  // ✅ Redirect to dashboard
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
