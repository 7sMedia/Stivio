import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DROPBOX_CLIENT_ID = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY!;
const DROPBOX_REDIRECT_URI = process.env.DROPBOX_REDIRECT_URI!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    const { data: existingUser, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (lookupError || !existingUser) {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        dropbox_oauth_state: userId,
      });

      if (insertError) {
        console.error("❌ Supabase insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to create user in Supabase" },
          { status: 500 }
        );
      }

      console.log("✅ Created new user in Supabase");
    } else {
      console.log("ℹ️ User already exists in Supabase");
    }
  } catch (err) {
    console.error("❌ Unexpected error during Supabase user creation:", err);
    return NextResponse.json(
      { error: "Unexpected error creating user" },
      { status: 500 }
    );
  }

  // ✅ Build Dropbox OAuth URL
  const dropboxAuthUrl = new URL("https://www.dropbox.com/oauth2/authorize");
  dropboxAuthUrl.searchParams.set("response_type", "code");
  dropboxAuthUrl.searchParams.set("client_id", DROPBOX_CLIENT_ID);
  dropboxAuthUrl.searchParams.set("redirect_uri", DROPBOX_REDIRECT_URI);
  dropboxAuthUrl.searchParams.set("state", userId);

  console.log("🌐 Redirecting to Dropbox:", dropboxAuthUrl.toString());

  return NextResponse.redirect(dropboxAuthUrl.toString());
}
