// /app/api/ai-tool/generate/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@/lib/dropbox";

const SEEDANCE_API_KEY = process.env.SEEDANCE_API_KEY!;
const SEEDANCE_ENDPOINT = "https://api.wavespeed.ai/v1/endpoint"; // adjust if needed

export async function POST(req: NextRequest) {
  const { userId, dropboxPath, prompt } = await req.json();
  if (!userId || !dropboxPath || !prompt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // 1. Get Dropbox token
  const dropboxToken = await getValidDropboxToken(userId);
  if (!dropboxToken) {
    return NextResponse.json({ error: "Dropbox not connected" }, { status: 401 });
  }

  // 2. Download image from Dropbox
  const imageRes = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${dropboxToken}`,
      "Dropbox-API-Arg": JSON.stringify({ path: dropboxPath }),
    },
  });
  if (!imageRes.ok) {
    return NextResponse.json({ error: "Failed to download Dropbox image" }, { status: 400 });
  }
  const imageBuffer = await imageRes.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString("base64");

  // 3. Call Seedance API
  const seedanceRes = await fetch(SEEDANCE_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SEEDANCE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
      // Add other params if required by Seedance
    }),
  });

  if (!seedanceRes.ok) {
    const err = await seedanceRes.text();
    return NextResponse.json({ error: "Seedance API error", details: err }, { status: 400 });
  }

  const seedanceResult = await seedanceRes.json();

  // 4. Download the generated video from Seedance
  if (!seedanceResult.video_url) {
    return NextResponse.json({ error: "No video URL in Seedance response" }, { status: 500 });
  }
  const videoFileRes = await fetch(seedanceResult.video_url);
  if (!videoFileRes.ok) {
    return NextResponse.json({ error: "Failed to download video from Seedance" }, { status: 500 });
  }
  const videoBuffer = await videoFileRes.arrayBuffer();

  // 5. Upload video to Dropbox (/Apps/Beta7/Outputs/)
  const fileName = `seedance_video_${Date.now()}.mp4`;
  const dropboxUploadPath = `/Apps/Beta7/Outputs/${fileName}`;
  const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${dropboxToken}`,
      "Dropbox-API-Arg": JSON.stringify({
        path: dropboxUploadPath,
        mode: "add",
        autorename: true,
        mute: false,
      }),
      "Content-Type": "application/octet-stream",
    },
    body: Buffer.from(videoBuffer),
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    return NextResponse.json({ error: "Failed to upload video to Dropbox", details: err }, { status: 500 });
  }

  const uploadResult = await uploadRes.json();

  return NextResponse.json({
    dropbox: uploadResult,
    seedance: seedanceResult,
    dropbox_video_path: dropboxUploadPath,
  });
}
