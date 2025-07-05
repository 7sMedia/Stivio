// app/api/dropbox/callback/route.ts
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
  try {
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

    let data;
    try {
      data = await tokenRes.json();
    } catch (e) {
      return new Response(errorHtml("Dropbox token exchange failed (invalid response)."), {
        status: 500,
        headers: { "Content-Type": "text/html" }
      });
    }

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

    // --- GET Dropbox Account Info (account_id and email) ---
    const accountRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST",
      headers: { "Authorization": `Bearer ${data.access_token}` }
    });

    let accountData;
    try {
      accountData = await accountRes.json();
    } catch (e) {
      return new Response(errorHtml("Could not retrieve your Dropbox account info."), {
        status: 400,
        headers: { "Content-Type": "text/html" }
      });
    }

    if (!accountData.account_id) {
      return new Response(errorHtml("Could not retrieve your Dropbox account info."), {
        status: 400,
        headers: { "Content-Type": "text/html" }
      });
    }

    // Save token (and account_id/email) to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Remove any previous tokens for this user
    await supabase.from("dropbox_tokens").delete().eq("user_id", state);

    // Save the new token and account_id/email
    const { error: dbError } = await supabase.from("dropbox_tokens").insert([{
      user_id: state,
      access_token: data.access_token,
      refresh_token: data.refresh_token || null,
      expires_at: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : null,
      account_id: accountData.account_id,
      dropbox_email: accountData.email || null,
    }]);

    if (dbError) {
      return new Response(errorHtml("Failed to save Dropbox token. Please try again."), {
        status: 500,
        headers: { "Content-Type": "text/html" }
      });
    }

    // Close the popup and notify parent (if opened in a popup)
    return new Response(`
      <html>
        <body style="background: #181b24; color: #fff; font-family: sans-serif; text-align: center; padding-top: 4em;">
          <div style="background: #23263b; border-radius: 16px; display: inline-block; padding: 2.5em 3.5em;">
            <h2>Dropbox Connected!</h2>
            <p>You can now close this window.</p>
          </div>
          <script>
            window.opener && window.opener.postMessage({ type: "dropbox-connected" }, "*");
            setTimeout(() => { window.close(); }, 900);
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (err: any) {
    return new Response(errorHtml("An unexpected error occurred. Please try again or contact support."), {
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  }
}
