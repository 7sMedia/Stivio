// ✅ File: app/api/dropbox/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.redirect("https://beta7mvp.vercel.app/dashboard?error=missing_user_id");
  }

  const url = new URL("https://www.dropbox.com/oauth2/authorize");
  url.searchParams.set("client_id", DROPBOX_CLIENT_ID);
  url.searchParams.set("redirect_uri", DROPBOX_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("token_access_type", "offline");
  url.searchParams.set("state", userId); // use `state` to pass user_id

  return NextResponse.redirect(url.toString());
}
