"use server";

import { z } from "zod";

// API constants
const SEEDANCE_API_URL = "https://api.seedance.ai/v1/generate";
const SEEDANCE_API_KEY = process.env.SEEDANCE_API_KEY!;

const schema = z.object({
  prompt: z.string().min(5, "Prompt is too short"),
  image_url: z.string().url().optional(),
  template_id: z.string().optional(),
});

export interface SeedanceResponse {
  job_id: string;
  status: string;
  video_url?: string;
  error?: string;
}

/**
 * Calls the Seedance API with a prompt and optional image/template.
 * This function will be used by both manual and automated workflows.
 */
export async function callSeedanceAPI({
  prompt,
  image_url,
  template_id,
}: {
  prompt: string;
  image_url?: string;
  template_id?: string;
}): Promise<SeedanceResponse> {
  const parsed = schema.safeParse({ prompt, image_url, template_id });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.message, job_id: "" };
  }

  try {
    const res = await fetch(SEEDANCE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SEEDANCE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        image_url,
        template_id,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return {
        status: "error",
        error: `Seedance API error: ${err}`,
        job_id: "",
      };
    }

    const data = await res.json();

    return {
      status: "ok",
      job_id: data.id || "",
      video_url: data.video_url || undefined,
    };
  } catch (err: any) {
    return {
      status: "error",
      error: err.message || "Unknown error",
      job_id: "",
    };
  }
}
