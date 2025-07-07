import { NextResponse } from "next/server";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI!,
    response_type: "code",
    token_access_type: "offline",
  });

  return NextResponse.redirect(
    `https://www.dropbox.com/oauth2/authorize?${params.toString()}`
  );
}
