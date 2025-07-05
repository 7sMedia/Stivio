// app/api/dropbox/list-files/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("user_id");
    const folderPath = req.nextUrl.searchParams.get("path") || "";

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: tokenRow } = await supabase
      .from("dropbox_tokens")
      .select("access_token")
      .eq("user_id", userId)
      .maybeSingle();

    if (!tokenRow?.access_token) {
      return NextResponse.json({ error: "No Dropbox token for user" }, { status: 404 });
    }

    const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenRow.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path: folderPath,
        recursive: false,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
      }),
    });

    let files;
    if (res.ok) {
      files = await res.json();
    } else {
      const errText = await res.text();
      console.error("[Dropbox list_folder error]", errText);
      return NextResponse.json({ error: "Dropbox API error", details: errText }, { status: res.status });
    }

    return NextResponse.json({ files });
  } catch (err) {
    console.error("[Dropbox List Files] Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error", details: String(err) }, { status: 500 });
  }
}
