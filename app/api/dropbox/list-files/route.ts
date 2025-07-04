// /app/api/dropbox/list-files/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get("user_id");
  if (!user_id) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("access_token")
    .eq("user_id", user_id)
    .maybeSingle();

  if (!data?.access_token) {
    return NextResponse.json({ error: "No Dropbox token found for user" }, { status: 404 });
  }

  // List files in the root Dropbox folder
  const dropboxRes = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${data.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: "" }) // root folder
  });

  if (!dropboxRes.ok) {
    const errorJson = await dropboxRes.json();
    return NextResponse.json({ error: "Dropbox API error", details: errorJson }, { status: 500 });
  }

  const files = await dropboxRes.json();

  return NextResponse.json({ files });
}
