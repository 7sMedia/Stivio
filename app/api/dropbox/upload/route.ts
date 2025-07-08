// Path: app/api/dropbox/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Required env vars
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { user_id, fileName, fileDataBase64 } = await req.json();

    if (!user_id || !fileName || !fileDataBase64) {
      return NextResponse.json(
        { error: "Missing user_id, fileName, or fileDataBase64." },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: tokenData, error: tokenError } = await supabase
      .from("dropbox_tokens")
      .select("access_token")
      .eq("user_id", user_id)
      .maybeSingle();

    if (tokenError || !tokenData?.access_token) {
      return NextResponse.json(
        { error: "No Dropbox token found for user." },
        { status: 404 }
      );
    }

    // Handle base64 with or without data URI prefix
    let base64str = fileDataBase64;
    if (base64str.startsWith("data:")) {
      base64str = base64str.split(",")[1];
    }
    const fileBuffer = Buffer.from(base64str, "base64");

    const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Dropbox-API-Arg": JSON.stringify({
          path: `/${fileName}`,
          mode: "add",
          autorename: true,
          mute: false,
        }),
        "Content-Type": "application/octet-stream",
      },
      body: fileBuffer,
    });

    const resJson = await uploadRes.json();

    if (!uploadRes.ok) {
      return NextResponse.json(
        { error: "Dropbox upload failed", details: resJson },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, dropboxFile: resJson });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: e.message || e.toString() },
      { status: 500 }
    );
  }
}
