export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const DROPBOX_CLIENT_ID = process.env.DROPBOX_CLIENT_ID!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const { data: existing } = await supabase
      .from("dropbox_tokens")
      .select("access_token")
      .eq("user_id", userId)
      .single();

    if (existing?.access_token) {
      return NextResponse.redirect("https://beta7mvp.vercel.app/dashboard");
    }

    const authUrl = new URL("https://www.dropbox.com/oauth2/authorize");
    authUrl.searchParams.set("client_id", DROPBOX_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", DROPBOX_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", userId);

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error("Error starting Dropbox auth flow:", error);
    return NextResponse.json({ error: "Failed to initiate Dropbox OAuth" }, { status: 500 });
  }
}
