// Path: app/api/dropbox/create-folder/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { userId, folderPath } = await req.json();

    if (!userId || !folderPath) {
      return NextResponse.json(
        { error: "Missing userId or folderPath" },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: tokenRow, error: tokenError } = await supabase
      .from("dropbox_tokens")
      .select("access_token")
      .eq("user_id", userId)
      .maybeSingle();

    if (tokenError || !tokenRow?.access_token) {
      return NextResponse.json(
        { error: "No Dropbox token for user" },
        { status: 404 }
      );
    }

    const res = await fetch("https://api.dropboxapi.com/2/files/create_folder_v2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenRow.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: folderPath, autorename: true }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Dropbox create_folder error]", errText);
      return NextResponse.json(
        { error: "Dropbox API error", details: errText },
        { status: res.status }
      );
    }

    const folder = await res.json();
    return NextResponse.json({ folder });
  } catch (err) {
    console.error("[Dropbox Create Folder] Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error", details: String(err) },
      { status: 500 }
    );
  }
}
