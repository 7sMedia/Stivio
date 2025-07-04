// /app/api/dropbox/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";

/**
 * Dropbox will send:
 * - GET requests for webhook verification (with a "challenge" param)
 * - POST requests with user_id(s) when there are changes
 */

// Handle GET: Respond to challenge
export async function GET(req: NextRequest) {
  const challenge = req.nextUrl.searchParams.get("challenge");
  if (challenge) {
    // Respond with the challenge string, as required by Dropbox
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Missing challenge param", { status: 400 });
}

// Handle POST: Dropbox sends a JSON with user IDs whose files have changed
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Dropbox sends:
  // { "list_folder": { "accounts": ["dbid:AACxxxxxxx", ...] } }
  const changedAccounts = body?.list_folder?.accounts || [];

  // For each Dropbox account that changed, you need to:
  // 1. Find the corresponding user in your DB (if you saved Dropbox account ID)
  // 2. Fetch their latest files from Dropbox (using their stored token)
  // 3. Process new files as needed (e.g., trigger your video workflow)

  // TODO: Implement logic to map Dropbox account ID to your user, and trigger processing.
  // (You may want to log the incoming body to see the shape.)

  console.log("Dropbox webhook POST received. Changed accounts:", changedAccounts);

  // Always respond with 200 OK quickly!
  return NextResponse.json({ ok: true });
}
