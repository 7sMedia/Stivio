import { NextRequest, NextResponse } from "next/server";
// Replace this import with your actual Seedance client setup
import { seedance } from "@/lib/seedanceClient";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { userId, imageUrls } = await req.json();

    if (!userId || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: "Missing userId or imageUrls" }, { status: 400 });
    }

    // 1. Kick off a Seedance job
    const job = await seedance.createJob({
      userId,
      frames: imageUrls,
      // e.g. fps: 24, transition: "fade", etc.
    });

    // 2. Persist job record for status tracking
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { error: dbError } = await supabase
      .from("jobs")
      .insert({
        id: job.id,
        user_id: userId,
        status: "pending",
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Error persisting job:", dbError);
      // We still return the job ID so the client can poll
    }

    // 3. Return the jobId
    return NextResponse.json({ jobId: job.id });
  } catch (err: any) {
    console.error("Seedance generate error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
