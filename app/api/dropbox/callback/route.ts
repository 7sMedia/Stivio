// /app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!; // Service role key (server-side only!)

function errorHtml(message: string) {
  return `
    <html>
      <head>
        <title>Dropbox Connection Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { background: #111927; color: #dbeafe; font-family: sans-serif; text-align: center; padding-top: 3em; }
          a { color: #38bdf8; text-decoration: underline; font-weight: bold; }
          .card { background: #1e293b; padding: 2em 2.5em; border-radius: 1em; display: inline-block; margin-top: 2em; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Could not connect your Dropbox account</h2>
          <p>${message}</p>
          <a href="/dashboard">← Go back and try again</a>
        </div>
      </body>
    </html>
  `;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state"); // user_id

  if (!code || !state) {
    return new Response(errorHtml("Missing Dropbox code or user ID."), {
      status: 400,
      headers: { "Content-Type": "text/html" }
    });
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

  // Handle OAuth errors and give user-friendly feedback
  if (!data.access_token) {
    let msg = "Could not connect to Dropbox.";
    if (data.error === "invalid_grant") {
      msg = "This Dropbox sign-in link has expired or already been used. Please try connecting again.";
    } else if (data.error_description) {
      msg = data.error_description;
    }
    return new Response(errorHtml(msg), {
      status: 400,
      headers: { "Content-Type": "text/html" }
    });
  }

  // --- GET Dropbox Account Info (account_id) ---
  const accountRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
    method: "POST",
    headers: { "Authorization": `Bearer ${data.access_token}` }
  });
  const accountData = await accountRes.json();
  if (!accountData.account_id) {
    return new Response(errorHtml("Could not retrieve your Dropbox account info."), {
      status: 400,
      headers: { "Content-Type": "text/html" }
    });
  }

  // Save token (and account_id) to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Remove any previous tokens for this user
  await supabase.from("dropbox_tokens").delete().eq("user_id", state);

  // Save the new token and account_id
  const { error: dbError } = await supabase.from("dropbox_tokens").insert([
    {
      user_id: state,
      access_token: data.access_token,
      refresh_token: data.refresh_token || null,
      expires_at: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null,
      account_id: accountData.account_id,
    },
  ]);

  if (dbError) {
    return new Response(errorHtml("Failed to save Dropbox token. Please try again."), {
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  }

  // Redirect to dashboard or show success
  return NextResponse.redirect("/dashboard?dropbox=connected");
}
