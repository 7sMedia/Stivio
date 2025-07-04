// /app/api/dropbox/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// Handle GET: Dropbox webhook verification challenge
export async function GET(req: NextRequest) {
  const challenge = req.nextUrl.searchParams.get("challenge");
  if (challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Missing challenge param", { status: 400 });
}

// Handle POST: Dropbox sends account IDs for users with changes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const changedAccounts: string[] = body?.list_folder?.accounts || [];

  // Set up Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  for (const accountId of changedAccounts) {
    // Look up user_id and access_token by Dropbox account_id
    const { data, error } = await supabase
      .from("dropbox_tokens")
      .select("user_id, access_token")
      .eq("account_id", accountId)
      .maybeSingle();

    if (data?.user_id && data.access_token) {
      // TODO: Check for new files and trigger your automation here!
      // For now, just log:
      console.log(`Webhook: Found user_id=${data.user_id} for Dropbox account_id=${accountId}`);
      // Example: Trigger a workflow/queue or fetch/process new files
    } else {
      console.warn(`Webhook: No user found for Dropbox account_id=${accountId}`);
    }
  }

  // Always respond quickly!
  return NextResponse.json({ ok: true });
}
