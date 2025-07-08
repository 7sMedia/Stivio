export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const path = formData.get("path") as string;
  const user_id = formData.get("user_id") as string;

  if (!file || !path || !user_id) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const { data: tokenRow, error } = await supabase
    .from("dropbox_tokens")
    .select("access_token")
    .eq("user_id", user_id)
    .single();

  if (error || !tokenRow) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenRow.access_token}`,
      "Dropbox-API-Arg": JSON.stringify({
        path,
        mode: "add",
        autorename: true,
        mute: false
      }),
      "Content-Type": "application/octet-stream"
    },
    body: buffer
  });

  const data = await res.json();
  return NextResponse.json(data);
}
