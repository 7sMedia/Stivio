import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@/lib/dropbox";

export async function POST(req: NextRequest) {
  const { userId, path } = await req.json();
  const dropboxToken = await getValidDropboxToken(userId);
  if (!dropboxToken) {
    return NextResponse.json({ error: "Dropbox not connected" }, { status: 401 });
  }
  const resp = await fetch("https://api.dropboxapi.com/2/files/get_temporary_link", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dropboxToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    return NextResponse.json({ error: data.error_summary || "Dropbox link error" }, { status: 400 });
  }
  return NextResponse.json({ link: data.link });
}
