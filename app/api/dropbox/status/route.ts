import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ connected: false });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data } = await supabase
    .from("dropbox_tokens")
    .select("dropbox_email")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.dropbox_email) {
    return NextResponse.json({ connected: true, email: data.dropbox_email });
  }
  return NextResponse.json({ connected: false });
}
