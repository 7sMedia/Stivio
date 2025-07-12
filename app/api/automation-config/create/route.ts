import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function POST(req: NextRequest) {
  try {
    const { userId, dropbox_folder, prompt, template } = await req.json();

    if (!userId || !dropbox_folder || !prompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("automation_configs")
      .upsert({
        user_id: userId,
        dropbox_folder,
        prompt,
        template,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" })  // Only allow 1 config per user for now
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save config" }, { status: 500 });
    }

    return NextResponse.json({ message: "Config saved" }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
