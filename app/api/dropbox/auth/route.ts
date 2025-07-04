// /app/api/dropbox/auth/route.ts

import { NextRequest, NextResponse } from "next/server";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const user_id = searchParams.get("user_id");

  const dropboxAuthUrl =
    `https://www.dropbox.com/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${DROPBOX_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(DROPBOX_REDIRECT_URI)}` +
    `&token_access_type=offline` +
    (user_id ? `&state=${encodeURIComponent(user_id)}` : "");

  return NextResponse.redirect(dropboxAuthUrl);
}
