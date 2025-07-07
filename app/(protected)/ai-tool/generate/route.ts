// app/(protected)/ai-tool/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@/lib/dropbox";
import { createClient } from "@supabase/supabase-js";
import {
  checkRateLimit,
  canStartNewTask,
  markTaskStart,
  markTaskEnd,
} from "@/lib/seedanceLimiter";
import { generateOutputPath } from "@/lib/storagePaths";
import { uploadToDropboxWithRateLimit } from "@/lib/uploadToDropboxWithRateLimit";

const SEEDANCE_API_KEY = process.env.SEEDANCE_API_KEY!;
const SEEDANCE_ENDPOINT = "https://api.wavespeed.ai/v1/endpoint";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, dropboxPath, prompt } = await req.json();

  if (!userId || !dropboxPath || !prompt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!canStartNewTask(userId)) {
    return NextResponse.json({ error: "Too many concurrent tasks" }, { status: 429 });
  }

  if (!checkRateLimit(userId)) {
    return NextResponse.json({ error: "Rate limit exceeded (5 per minute)" }, { status: 429 });
  }

  markTaskStart(userId);

  try {
    const dropboxToken = await getValidDropboxToken(userId);
    if (!dropboxToken) {
      return NextResponse.json({ error: "Dropbox not connected" }, { status: 401 });
    }

    // Step 1: Download image from Dropbox
    const imageRes = await fetch("https://content.dropboxapi.com/2/files/download", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dropboxToken}`,
        "Dropbox-API-Arg": JSON.stringify({ path: dropboxPath }),
      },
    });

    if (!imageRes.ok) {
      return NextResponse.json({ error: "Failed to download Dropbox image" }, { status: 400 });
    }

    const imageBase64 = Buffer.from(await imageRes.arrayBuffer()).toString("base64");

    // Step 2: Call Seedance API
    const seedanceStart = Date.now();
    const seedanceRes = await fetch(SEEDANCE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SEEDANCE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageBase64, prompt }),
    });
    const seedanceElapsed = Date.now() - seedanceStart;
    console.log(`[Seedance] Generation took ${seedanceElapsed}ms`);

    if (!seedanceRes.ok) {
      const err = await seedanceRes.text();
      return NextResponse.json({ error: "Seedance API error", details: err }, { status: 400 });
    }

    const seedanceResult = await seedanceRes.json();
    if (!seedanceResult.video_url) {
      return NextResponse.json({ error: "No video URL in Seedance response" }, { status: 500 });
    }

    // Step 3: Download generated video
    const videoFileRes = await fetch(seedanceResult.video_url);
    if (!videoFileRes.ok) {
      return NextResponse.json({ error: "Failed to download video from Seedance" }, { status: 500 });
    }

    const videoBlob = await videoFileRes.blob();
    const file = new File([videoBlob], "video.mp4", { type: "video/mp4" });

    // Step 4: Upload to Dropbox using rate-limited uploader
    const { fullPath: dropboxUploadPath, filename, folder } = generateOutputPath();

    const uploadResult = await uploadToDropboxWithRateLimit({
      file,
      filename,
      accessToken: dropboxToken,
      folderPath: folder,
    });

    // Step 5: Log metadata to Supabase
    const { error: insertError } = await supabaseAdmin.from("generated_videos").insert({
      user_id: userId,
      dropbox_path: uploadResult.dropboxPath,
      filename,
      output_folder: folder,
      prompt,
      uuid: filename.replace(".mp4", "").replace("seedance_video_", ""),
      duration_ms: seedanceElapsed,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to insert video record into Supabase", details: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      dropbox_video_path: uploadResult.dropboxPath,
      dropbox_metadata: uploadResult,
      seedance_metadata: seedanceResult,
      duration_ms: seedanceElapsed,
    });
  } catch (err: any) {
    console.error("Unhandled error in /generate route:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    markTaskEnd(userId);
  }
}
