import { NextRequest, NextResponse } from "next/server";

const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  const dropboxAuthUrl = new URL("https://www.dropbox.com/oauth2/authorize");
  dropboxAuthUrl.searchParams.set("response_type", "code");
  dropboxAuthUrl.searchParams.set("client_id", DROPBOX_CLIENT_ID);
  dropboxAuthUrl.searchParams.set("redirect_uri", DROPBOX_REDIRECT_URI);
  dropboxAuthUrl.searchParams.set("state", userId);

  return NextResponse.redirect(dropboxAuthUrl.toString());
}
