// app/api/dropbox/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@lib/dropbox";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id") || req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ connected: false });

  const dropboxToken = await getValidDropboxToken(userId);
  if (!dropboxToken) return NextResponse.json({ connected: false });

  const res = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dropboxToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return NextResponse.json({ connected: false });
  }

  const data = await res.json();

  return NextResponse.json({
    connected: true,
    email: data.email,
    account_id: data.account_id,
    name: data.name?.display_name,
  });
}
