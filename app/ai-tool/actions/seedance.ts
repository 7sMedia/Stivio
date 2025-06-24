// /app/ai-tool/actions/seedance.ts
"use server";

import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  prompt: z.string().min(5),
  video_length: z.number().min(1).max(8).optional(),
});

export async function generateSeedanceVideo(
  formData: FormData
): Promise<{ status: string; video_url?: string; error?: string }> {
  const prompt = formData.get("prompt") as string;
  const image = formData.get("image") as File | null;
  const video_length = formData.get("video_length") as string | null;

  if (!prompt || !image) {
    return { status: "failed", error: "Prompt and image are required." };
  }

  const apiKey = process.env.SEEDANCE_API_KEY;
  if (!apiKey) {
    return { status: "failed", error: "API key not set." };
  }

  const apiForm = new FormData();
  apiForm.append("prompt", prompt);
  apiForm.append("image", image);
  if (video_length) apiForm.append("video_length", video_length);

  try {
    const resp = await fetch("https://api.wavespeed.ai/v1/animate/prompt", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body: apiForm,
      // @ts-ignore
      duplex: "half", // For Node 18 compatibility
    });

    const data = await resp.json();
    if (data.status === "success") {
      return { status: "success", video_url: data.video_url };
    } else {
      return { status: "failed", error: data.message || "Unknown error" };
    }
  } catch (e: any) {
    return { status: "failed", error: e.message || "API error" };
  }
}
