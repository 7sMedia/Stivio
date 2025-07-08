export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  return NextResponse.json({ token: data });
}
