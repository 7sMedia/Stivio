// Path: app/api/dropbox/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import validator from "validator";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_APP_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function errorHtml(message: string): string {
  return `
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:40px;">
        <h1>Could not connect your Dropbox account</h1>
        <p style="color:red;">${message}</p>
        <a href="/dashboard">← Go back and try again</a>
      </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const userId = request.nextUrl.searchParams.get("state");

  if (!userId || !validator.isUUID(userId)) {
    return new NextResponse(errorHtml("Invalid user ID format"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!code) {
    return new NextResponse(errorHtml("Missing Dropbox code"), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${DROPBOX_CLIENT_ID}:${DROPBOX_CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: DROPBOX_REDIRECT_URI,
      }),
    });

    const tokenJson = await tokenRes.json();

    if (!tokenJson.access_token) {
      console.error("Dropbox token response:", tokenJson);
      return new NextResponse(errorHtml("Failed to retrieve Dropbox token"), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    await supabase
      .from("users")
      .update({ dropbox_token: tokenJson.access_token })
      .eq("id", userId);

    return NextResponse.redirect(`${SITE_URL}/dashboard`);
  } catch (err) {
    console.error("Dropbox OAuth error:", err);
    return new NextResponse(errorHtml("Unexpected error occurred"), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
