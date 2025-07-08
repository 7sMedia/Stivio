export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { user_id, path } = await req.json();

  const { data: tokenRow, error } = await supabase
    .from("dropbox_tokens")
    .select("access_token")
    .eq("user_id", user_id)
    .single();

  if (error || !tokenRow) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenRow.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ path })
  });

  const data = await res.json();
  return NextResponse.json(data);
}
