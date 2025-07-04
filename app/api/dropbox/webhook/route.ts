// /app/api/dropbox/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ENV config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// Download a file from Dropbox as Buffer
async function downloadDropboxFile(access_token: string, filePath: string): Promise<Buffer> {
  const downloadRes = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Dropbox-API-Arg": JSON.stringify({ path: filePath }),
    },
  });
  if (!downloadRes.ok) {
    throw new Error(`Dropbox download failed: ${await downloadRes.text()}`);
  }
  const arrayBuffer = await downloadRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// --- GET: For Dropbox webhook verification ---
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

// --- POST: Real-time Dropbox webhook event ---
export async function POST(req: NextRequest) {
  const body = await req.json();
  const changedAccounts: string[] = body?.list_folder?.accounts || [];

  // Setup Supabase client (service role)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  for (const accountId of changedAccounts) {
    // 1. Find the user and access_token by Dropbox account_id
    const { data, error } = await supabase
      .from("dropbox_tokens")
      .select("user_id, access_token")
      .eq("account_id", accountId)
      .maybeSingle();

    if (data?.user_id && data.access_token) {
      // 2. Fetch the user's Dropbox files
      const filesRes = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${data.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: "" }), // Root folder; change if you want subfolders
      });

      const filesData = await filesRes.json();

      if (filesData.entries) {
        // 3. Download and (optionally) process each file
        for (const file of filesData.entries) {
          if (file[".tag"] === "file") {
            try {
              const fileBuffer = await downloadDropboxFile(data.access_token, file.path_display);
              // --- TODO: Replace this log with your image-to-video or processing logic! ---
              console.log(
                `Webhook: Downloaded file "${file.name}" for user_id=${data.user_id}, size=${file.size}`
              );
              // await yourProcessFunction(fileBuffer, file, data.user_id);
            } catch (e) {
              console.error(`Failed to download ${file.name}:`, e);
            }
          }
        }
      }
    } else {
      console.warn(`Webhook: No user found for Dropbox account_id=${accountId}`);
    }
  }

  // Always respond quickly!
  return NextResponse.json({ ok: true });
}
