import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export async function GET(req: NextRequest) {
  try {
    const { data: configs, error: configError } = await supabase
      .from("automation_configs")
      .select("user_id, dropbox_folder, prompt, template")
      .eq("is_active", true);

    if (configError) throw configError;

    for (const config of configs || []) {
      const { user_id, dropbox_folder, prompt, template } = config;

      const { data: tokenRow, error: tokenError } = await supabase
        .from("dropbox_tokens")
        .select("access_token")
        .eq("user_id", user_id)
        .maybeSingle();

      if (tokenError || !tokenRow) continue;
      const accessToken = tokenRow.access_token;

      const dropboxRes = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: dropbox_folder,
          recursive: false,
        }),
      });

      const dropboxData = await dropboxRes.json();
      if (!dropboxRes.ok) continue;

      const newImages = (dropboxData.entries || []).filter((entry: any) => {
        return (
          entry[".tag"] === "file" &&
          SUPPORTED_IMAGE_EXTENSIONS.some((ext) => entry.name.toLowerCase().endsWith(ext))
        );
      });

      for (const image of newImages) {
        const { path_display, name } = image;

        const { data: existing } = await supabase
          .from("generated_videos")
          .select("id")
          .eq("user_id", user_id)
          .eq("dropbox_path", path_display)
          .maybeSingle();

        if (existing) continue;

        await supabase.from("generated_videos").insert({
          user_id,
          prompt,
          dropbox_path: path_display,
          filename: name,
          output_folder: dropbox_folder,
        });

        // TODO: Send to Seedance API
        console.log(`✅ Queued: ${name} for ${user_id}`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Cron job error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
