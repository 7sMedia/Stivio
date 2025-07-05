// app/api/dropbox/debug-tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  const { data, error } = await supabase
    .from("dropbox_tokens")
    .select("*")
    .eq("user_id", userId);
  return NextResponse.json({ userId, data, error });
}
