import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: NextRequest) {
  const { userId, folderPath } = await req.json();
  if (!userId || !folderPath) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  await supabase.from("dropbox_tokens").update({ working_folder: folderPath }).eq("user_id", userId);
  return NextResponse.json({ ok: true });
}
