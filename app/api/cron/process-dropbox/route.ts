// /app/api/cron/process-dropbox/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;
const SEEDANCE_API_KEY = process.env.SEEDANCE_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: configs, error: configError } = await supabase
      .from("automation_configs")
      .select("user_id, dropbox_folder, prompt, template")
      .eq("is_active", true);

    if (configError) throw configError;

    for (const config of configs || []) {
      const { user_id, dropbox_folder, prompt } = config;

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
        body: JSON.stringify({ path: dropbox_folder, recursive: false }),
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
        const { path_display, name, id: dropboxFileId } = image;

        // Skip if already processed
        const { data: existing } = await supabase
          .from("generated_videos")
          .select("id")
          .eq("user_id", user_id)
          .eq("dropbox_path", path_display)
          .maybeSingle();

        if (existing) continue;

        // Download image file from Dropbox
        const downloadRes = await fetch("https://content.dropboxapi.com/2/files/download", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": JSON.stringify({ path: path_display }),
          },
        });

        if (!downloadRes.ok) {
          console.warn(`⚠️ Failed to download: ${path_display}`);
          continue;
        }

        const imageBuffer = await downloadRes.arrayBuffer();
        const blob = new Blob([imageBuffer]);

        // Send to Seedance
        const form = new FormData();
        form.append("prompt", prompt || "Make this cinematic with light motion");
        form.append("image", blob, name);

        const seedanceRes = await fetch("https://api.seedance.ai/v1/generate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SEEDANCE_API_KEY}`,
          },
          body: form,
        });

        const result = await seedanceRes.json();

        if (!seedanceRes.ok || !result?.video_url) {
          console.error(`❌ Seedance error for ${name}:`, result?.error);
          continue;
        }

        // Save to Supabase
        await supabase.from("generated_videos").insert({
          user_id,
          prompt,
          dropbox_path: path_display,
          filename: name,
          output_folder: dropbox_folder,
          video_url: result.video_url,
          created_at: new Date().toISOString(),
        });

        console.log(`✅ Generated video for ${name}: ${result.video_url}`);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Cron job error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
