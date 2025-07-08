// Path: app/api/dropbox/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!;
const DROPBOX_REDIRECT_URI = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!DROPBOX_CLIENT_ID || !DROPBOX_REDIRECT_URI) {
    return new NextResponse("Missing Dropbox environment variables", { status: 500 });
  }

  if (!userId || !/^[0-9a-fA-F-]{36}$/.test(userId)) {
    return new NextResponse("Invalid or missing user_id", { status: 400 });
  }

  const dropboxAuthUrl = new URL("https://www.dropbox.com/oauth2/authorize");
  dropboxAuthUrl.searchParams.set("response_type", "code");
  dropboxAuthUrl.searchParams.set("client_id", DROPBOX_CLIENT_ID);
  dropboxAuthUrl.searchParams.set("redirect_uri", DROPBOX_REDIRECT_URI);
  dropboxAuthUrl.searchParams.set("state", userId);

  return NextResponse.redirect(dropboxAuthUrl.toString());
}
