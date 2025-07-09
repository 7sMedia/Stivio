import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { error } = await supabase
      .from("dropbox_tokens")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Supabase delete error:", error);
      return NextResponse.json({ error: "❌ Failed to delete token" }, { status: 500 });
    }

    return NextResponse.json({ message: "✅ Dropbox disconnected" }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json({ error: "❌ Unexpected server error" }, { status: 500 });
  }
}
