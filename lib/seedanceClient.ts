// lib/seedanceClient.ts

/**
 * A simple wrapper around the Seedance SDK or HTTP API.
 * Replace this with your real import if you have an official SDK package,
 * or implement the HTTP calls directly here.
 */

// If you have an NPM SDK, import it:
// import { Seedance } from "seedance-sdk";

// Otherwise you can use fetch internally. The example below assumes an HTTP key/secret flow:

const API_BASE = process.env.SEEDANCE_API_BASE_URL || "https://api.seedance.ai";
const API_KEY  = process.env.SEEDANCE_API_KEY!;

export const seedance = {
  /**
   * Kick off a new job.
   * @param params.frames Array of image URLs.
   * @returns An object with at least an `id` field.
   */
  async createJob(params: { userId: string; frames: string[]; fps?: number; transition?: string }) {
    const res = await fetch(`${API_BASE}/v1/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        user_id: params.userId,
        frames: params.frames,
        fps: params.fps ?? 24,
        transition: params.transition ?? "fade",
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Seedance API error: ${err}`);
    }
    return res.json(); // should return { id: string; ... }
  },

  /**
   * (Optional) Poll job status.
   */
  async getJobStatus(jobId: string) {
    const res = await fetch(`${API_BASE}/v1/jobs/${jobId}`, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
      },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Seedance API error: ${err}`);
    }
    return res.json();
  },
};
