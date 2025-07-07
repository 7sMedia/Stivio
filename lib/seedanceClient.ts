// lib/seedanceClient.ts

/**
 * A simple wrapper around the Seedance (WaveSpeed) HTTP API.
 * Reads the base URL and API key from environment variables.
 */

const API_BASE = process.env.SEEDANCE_API_BASE_URL ?? "https://api.seedance.ai";
const API_KEY  = process.env.SEEDANCE_API_KEY!;

export const seedance = {
  /**
   * Kick off a new job with Seedance.
   * @param params.userId   The Supabase user ID.
   * @param params.frames   Array of image URLs to animate.
   * @param params.fps      Frames per second (optional).
   * @param params.transition  Transition style (optional).
   */
  async createJob(params: {
    userId: string;
    frames: string[];
    fps?: number;
    transition?: string;
  }) {
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

    return res.json() as Promise<{ id: string }>;
  },

  /**
   * (Optional) Poll a job’s status.
   * @param jobId  The ID returned by createJob.
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
