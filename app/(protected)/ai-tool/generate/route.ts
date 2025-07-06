import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@/lib/dropbox";
import { createClient } from "@supabase/supabase-js";

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

  // Get Dropbox token
  const dropboxToken = await getValidDropboxToken(userId);
  if (!dropboxToken) {
    return NextResponse.json({ error: "Dropbox not connected" }, { status: 401 });
  }

  // Download image from Dropbox
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

  // Call Seedance AI
  const seedanceRes = await fetch(SEEDANCE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SEEDANCE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: imageBase64, prompt }),
  });

  if (!seedanceRes.ok) {
    const err = await seedanceRes.text();
    return NextResponse.json({ error: "Seedance API error", details: err }, { status: 400 });
  }

  const seedanceResult = await seedanceRes.json();
  if (!seedanceResult.video_url) {
    return NextResponse.json({ error: "No video URL in Seedance response" }, { status: 500 });
  }

  // Download video from Seedance
  const videoFileRes = await fetch(seedanceResult.video_url);
  if (!videoFileRes.ok) {
    return NextResponse.json({ error: "Failed to download video from Seedance" }, { status: 500 });
  }

  const videoBuffer = Buffer.from(await videoFileRes.arrayBuffer());

  // Upload video to Dropbox
  const dropboxUploadPath = `/Apps/Beta7/Outputs/seedance_video_${Date.now()}.mp4`;
  const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dropboxToken}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: dropboxUploadPath,
        mode: "add",
        autorename: true,
        mute: false,
      }),
      "Content-Type": "application/octet-stream",
    },
    body: videoBuffer,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return NextResponse.json({ error: "Failed to upload video to Dropbox", details: err }, { status: 500 });
  }

  const uploadResult = await uploadRes.json();

  // Insert record into Supabase
  const { error: insertError } = await supabaseAdmin.from("generated_videos").insert({
    user_id: userId,
    dropbox_path: dropboxUploadPath,
    prompt,
  });

  if (insertError) {
    return NextResponse.json({ error: "Failed to insert video record into Supabase", details: insertError }, { status: 500 });
  }

  return NextResponse.json({
    dropbox_video_path: dropboxUploadPath,
    dropbox_metadata: uploadResult,
    seedance_metadata: seedanceResult,
  });
}
