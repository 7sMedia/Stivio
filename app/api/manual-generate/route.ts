import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // for faster processing (optional)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const image = formData.get("image") as File;

    if (!prompt || !image) {
      return NextResponse.json({ error: "Missing prompt or image." }, { status: 400 });
    }

    // Prepare file buffer
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Seedance API
    const seedanceRes = await fetch("https://api.seedance.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SEEDANCE_API_KEY}`,
      },
      body: (() => {
        const body = new FormData();
        body.append("prompt", prompt);
        body.append("image", new Blob([buffer], { type: image.type }), image.name);
        return body;
      })(),
    });

    const result = await seedanceRes.json();

    if (!seedanceRes.ok || !result?.video_url) {
      return NextResponse.json(
        { error: result?.error || "Video generation failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ video_url: result.video_url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
