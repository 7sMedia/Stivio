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

    console.log("[DROPBOX CALLBACK] code/state:", { code, state });

    if (!code || !state) {
      console.warn("[DROPBOX CALLBACK] Missing code or state!");
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

    // ----- SAFELY READ BODY: JSON or TEXT -----
    let data: any = {};
    const tokenContentType = tokenRes.headers.get("content-type") || "";
    if (!tokenRes.ok) {
      // Try to parse error body as text
      const errText = await tokenRes.text();
      console.error("[DROPBOX CALLBACK] Dropbox token error response:", errText);
      let msg = "Could not connect to Dropbox.";
      if (tokenContentType.includes("application/json")) {
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error === "invalid_grant") {
            msg = "This Dropbox sign-in link has expired or already been used. Please try connecting again.";
          } else if (errJson.error_description) {
            msg = errJson.error_description;
          }
        } catch {}
      }
      return new Response(errorHtml(msg), {
        status: 400,
        headers: { "Content-Type": "text/html" }
      });
    } else if (tokenContentType.includes("application/json")) {
      try {
        data = await tokenRes.json();
      } catch (e) {
        console.error("[DROPBOX CALLBACK] Could not parse Dropbox token JSON:", e);
        return new Response(errorHtml("Dropbox gave an invalid response. Please try again."), {
          status: 500,
          headers: { "Content-Type": "text/html" }
        });
      }
    } else {
      const txt = await tokenRes.text();
      console.error("[DROPBOX CALLBACK] Unexpected Dropbox token response:", txt);
      return new Response(errorHtml("Dropbox gave an unexpected response. Please try again later."), {
        status: 500,
        headers: { "Content-Type": "text/html" }
      });
    }

    // Defensive: If for any reason we don't have a token now, bail out.
    if (!data?.access_token) {
      return new Response(errorHtml("Could not connect to Dropbox (no access token)."), {
        status: 400,
        headers: { "Content-Type": "text/html" }
      });
    }

    // --- GET Dropbox Account Info (account_id) ---
    const accountRes = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST",
      headers: { "Authorization": `Bearer ${data.access_token}` }
    });

    let accountData: any = {};
    const accountContentType = accountRes.headers.get("content-type") || "";
    if (accountContentType.includes("application/json")) {
      try {
        accountData = await accountRes.json();
      } catch (e) {
        console.error("[DROPBOX CALLBACK] Failed to parse account info as JSON");
        return new Response(errorHtml("Could not retrieve your Dropbox account info (parse error)."), {
          status: 400,
          headers: { "Content-Type": "text/html" }
        });
      }
    } else {
      const txt = await accountRes.text();
      console.error("[DROPBOX CALLBACK] Unexpected Dropbox account info response:", txt);
      return new Response(errorHtml("Could not retrieve your Dropbox account info."), {
        status: 400,
        headers: { "Content-Type": "text/html" }
      });
    }

    if (!accountData.account_id) {
      return new Response(errorHtml("Could not retrieve your Dropbox account info (no account ID)."), {
        status: 400,
        headers: { "Content-Type": "text/html" }
      });
    }

    // Save token (and account_id) to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Remove any previous tokens for this user
    const delRes = await supabase.from("dropbox_tokens").delete().eq("user_id", state);

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
  } catch (err: any) {
    console.error("[DROPBOX CALLBACK] Unexpected error:", err, err?.stack);
    return new Response(errorHtml("An unexpected error occurred. Please try again or contact support."), {
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  }
}
