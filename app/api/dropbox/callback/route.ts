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
          body { background: #111927; color: #dbeafe; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; }
          a { color: #0ec9db; text-decoration: underline; margin-top: 1rem; display: inline-block; }
        </style>
      </head>
      <body>
        <div>
          <h1>Could not connect your Dropbox account</h1>
          <p>${message}</p>
          <a href="/dashboard">← Go back and try again</a>
        </div>
      </body>
    </html>
  `;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return new Response(errorHtml("Missing Dropbox code or user ID."), {
      headers: { "Content-Type": "text/html" },
      status: 400,
    });
  }

  try {
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

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return new Response(errorHtml("Dropbox token exchange failed: " + errText), {
        headers: { "Content-Type": "text/html" },
        status: 500,
      });
    }

    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { error } = await supabase.from("dropbox_tokens").upsert({
      user_id: state,
      access_token: accessToken,
    });

    if (error) {
      return new Response(errorHtml("Failed to save token to Supabase: " + error.message), {
        headers: { "Content-Type": "text/html" },
        status: 500,
      });
    }

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (err: any) {
    return new Response(errorHtml("Unexpected error: " + err.message), {
      headers: { "Content-Type": "text/html" },
      status: 500,
    });
  }
}
