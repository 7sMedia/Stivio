export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const { user_id } = await req.json();

  const { error } = await supabase
    .from("dropbox_tokens")
    .delete()
    .eq("user_id", user_id);

  if (error) {
    console.error("Failed to disconnect Dropbox:", error);
    return NextResponse.json({ error: "Failed to disconnect Dropbox" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
