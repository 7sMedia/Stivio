import { NextRequest, NextResponse } from "next/server";
import { seedance } from "@/lib/seedanceClient";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }

  try {
    const status = await seedance.getJobStatus(jobId);
    // status might look like { id, state: 'pending'|'processing'|'completed'|'failed', resultUrl? }
    return NextResponse.json(status);
  } catch (err: any) {
    console.error("Seedance status error:", err);
    return NextResponse.json(
      { error: err.message || "Status check failed" },
      { status: 500 }
    );
  }
}
