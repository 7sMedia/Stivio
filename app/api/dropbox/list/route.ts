// /app/api/dropbox/list/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@/lib/dropbox";

export async function GET(req: NextRequest) {
  // Example: Get userId from request header (adapt to your auth/session system)
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get a valid Dropbox access token, auto-refresh if needed
  const dropboxToken = await getValidDropboxToken(userId);

  if (!dropboxToken) {
    return NextResponse.json({ error: "Dropbox not connected or token refresh failed" }, { status: 401 });
  }

  // List root folder (change path if needed)
  const listFolderRes = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${dropboxToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: "" }),
  });

  if (!listFolderRes.ok) {
    const err = await listFolderRes.text();
    return NextResponse.json({ error: "Dropbox API error", details: err }, { status: 400 });
  }

  const data = await listFolderRes.json();
  return NextResponse.json(data);
}
