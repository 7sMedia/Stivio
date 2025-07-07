import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID!;
const DROPBOX_CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET!;
const DROPBOX_REDIRECT_URI = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!;
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
    const state = req.nextUrl.searchParams.get("state"); // should carry your user_id

    if (!code || !state) {
      return new Response(errorHtml("Missing Dropbox code or user ID."), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    // 1) Exchange authorization code for tokens
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

    if (!tokenData.access_token) {
      let msg = "Could not connect to Dropbox.";
      if (tokenData.error === "invalid_grant") {
        msg = "This Dropbox link has expired or already been used. Please try again.";
      } else if (tokenData.error_description) {
        msg = tokenData.error_description;
      }
      return new Response(errorHtml(msg), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    // 2) Fetch Dropbox account info
    const accountRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const accountData = await accountRes.json();

    if (!accountData.account_id) {
      return new Response(errorHtml("Could not retrieve Dropbox account info."), {
        status: 400,
        headers: { "Content-Type": "text/html" },
      });
    }

    // 3) Save tokens to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Upsert into table keyed by user_id
    const { error: dbError } = await supabase
      .from("dropbox_tokens")
      .upsert(
        {
          user_id: state,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token || null,
          expires_at: tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
            : null,
          account_id: accountData.account_id,
          dropbox_email: accountData.email || null,
        },
        { onConflict: "user_id" }
      );

    if (dbError) {
      return new Response(errorHtml("Failed to save Dropbox token. Please try again."), {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }

    // 4) Notify parent window and close
    return new Response(
      `
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
    `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      }
    );
  } catch (err) {
    return new Response(errorHtml("An unexpected error occurred. Please try again or contact support."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
