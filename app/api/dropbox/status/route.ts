import { NextRequest, NextResponse } from "next/server";
import { getValidDropboxToken } from "@lib/dropbox";

export async function GET(req: NextRequest) {
  const userId =
    req.nextUrl.searchParams.get("user_id") || req.headers.get("x-user-id");

  if (!userId) {
    console.log("[DROPBOX STATUS] Missing userId");
    return NextResponse.json({ connected: false });
  }

  const dropboxToken = await getValidDropboxToken(userId);
  console.log("[DROPBOX STATUS] Token from getValidDropboxToken:", dropboxToken);

  if (!dropboxToken) {
    console.log("[DROPBOX STATUS] No valid token found for userId:", userId);
    return NextResponse.json({ connected: false });
  }

  let text = "";
  let res;
  try {
    res = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dropboxToken}`,
        "Content-Type": "application/json",
      }
      // No body property at all!
    });
    text = await res.text();
    console.log("[DROPBOX STATUS] Dropbox API response:", res.status, text);
  } catch (e) {
    console.error("[DROPBOX STATUS] Error calling Dropbox:", e);
    return NextResponse.json({ connected: false, error: String(e) });
  }

  if (!res.ok) {
    return NextResponse.json({ connected: false, dropboxError: text });
  }

  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("[DROPBOX STATUS] Failed to parse Dropbox response:", e, text);
    return NextResponse.json({ connected: false, parseError: String(e), raw: text });
  }

  return NextResponse.json({
    connected: true,
    email: data.email,
    account_id: data.account_id,
    name: data.name?.display_name,
  });
}
