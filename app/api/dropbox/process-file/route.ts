// /app/api/dropbox/process-file/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

// Utility: Download a file from Dropbox
async function downloadDropboxFile(access_token: string, filePath: string): Promise<Buffer> {
  const downloadRes = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access_token}`,
      "Dropbox-API-Arg": JSON.stringify({ path: filePath }),
    },
  });
  if (!downloadRes.ok) throw new Error("Dropbox download failed");
  const arrayBuffer = await downloadRes.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(req: NextRequest) {
  const { userId, file } = await req.json();
  if (!userId || !file) {
    return NextResponse.json({ error: "Missing userId or file" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  // Get Dropbox access token for user
  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("access_token")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.access_token) {
    return NextResponse.json({ error: "No Dropbox access token for user" }, { status: 404 });
  }

  // Download file from Dropbox
  let fileBuffer: Buffer;
  try {
    fileBuffer = await downloadDropboxFile(data.access_token, file.path_display);
  } catch (err) {
    return NextResponse.json({ error: "Failed to download Dropbox file" }, { status: 500 });
  }

  // TODO: Process fileBuffer, e.g. send to image-to-video workflow, or store, etc.

  // Save record of imported file to your DB for tracking
  await supabase.from("imported_files").insert([
    {
      user_id: userId,
      dropbox_file_id: file.id,
      file_name: file.name,
      dropbox_path: file.path_display,
      imported_at: new Date().toISOString(),
      // Optionally, status, processing result, etc.
    },
  ]);

  return NextResponse.json({ ok: true, fileName: file.name });
}
