import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@/lib/dropbox";

export async function POST(req: NextRequest) {
  try {
    const { userId, path } = await req.json();

    if (!userId || !path) {
      return NextResponse.json({ error: "Missing userId or path" }, { status: 400 });
    }

    const accessToken = await getValidDropboxToken(userId);
    if (!accessToken) {
      return NextResponse.json({ error: "Dropbox not connected" }, { status: 401 });
    }

    const res = await fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Failed to get temporary link", details: err }, { status: 400 });
    }

    const data = await res.json();
    return NextResponse.json({ link: data.link });
  } catch (error: any) {
    console.error("Error in get-temporary-link:", error);
    return NextResponse.json(
      { error: error?.message || "Server error while generating temporary link" },
      { status: 500 }
    );
  }
}
