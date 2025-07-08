// /app/api/dropbox/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!DROPBOX_CLIENT_ID || !DROPBOX_REDIRECT_URI) {
    return new NextResponse("Missing Dropbox env vars", { status: 500 });
  }

  if (!userId) {
    return new NextResponse("Missing user_id", { status: 400 });
  }

  const dropboxAuthUrl = new URL("https://www.dropbox.com/oauth2/authorize");
  dropboxAuthUrl.searchParams.set("response_type", "code");
  dropboxAuthUrl.searchParams.set("client_id", DROPBOX_CLIENT_ID);
  dropboxAuthUrl.searchParams.set("redirect_uri", DROPBOX_REDIRECT_URI);
  dropboxAuthUrl.searchParams.set("state", userId); // must be a valid UUID

  return NextResponse.redirect(dropboxAuthUrl.toString());
}
